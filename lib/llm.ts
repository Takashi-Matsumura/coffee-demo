type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

const LLAMA_URL =
  process.env.LLAMA_API_URL ?? "http://127.0.0.1:8080/v1/chat/completions";
const LLAMA_MODEL = process.env.LLAMA_MODEL ?? "gemma";

export async function streamLlamaChat(
  messages: ChatMessage[],
  signal?: AbortSignal,
): Promise<ReadableStream<string>> {
  const upstream = await fetch(LLAMA_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: LLAMA_MODEL,
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 1024,
      chat_template_kwargs: { enable_thinking: false },
      reasoning_format: "none",
    }),
    signal,
  });

  if (!upstream.ok || !upstream.body) {
    throw new Error(`llama.cpp upstream error: ${upstream.status}`);
  }

  const decoder = new TextDecoder();
  const reader = upstream.body.getReader();
  let buffer = "";
  let done = false;

  // gemma-4-12B は thinking を `<|channel>thought\n<channel|>本文` という制御
  // トークンで包んで返すが、llama.cpp(b9430時点) はこれを reasoning として
  // 分離できず content にそのまま混ぜてくる（reasoning_format:none も効かない）。
  // 本文開始マーカー `<channel|>` より前を破棄して落とす。マーカーを出さない
  // モデル（e4b 等）は即座に素通しさせるため、制御プレフィックスの前方一致が
  // 崩れた時点でゲートを解除する。詳細は README.md の llama.cpp 既知の問題を参照。
  const CHANNEL_MARKER = "<channel|>";
  const CTRL_PREFIX = "<|channel";
  const MAX_PREFIX_BUFFER = 200;
  let headerStripped = false;
  let prefixBuffer = "";

  // 本文チャンクを受け取り、制御プレフィックスを剥がした出力を返す。
  // まだ判定中（バッファ保留）なら null を返す。
  function stripChannelPrefix(text: string): string | null {
    if (headerStripped) return text;
    prefixBuffer += text;

    const idx = prefixBuffer.indexOf(CHANNEL_MARKER);
    if (idx !== -1) {
      headerStripped = true;
      const rest = prefixBuffer.slice(idx + CHANNEL_MARKER.length);
      prefixBuffer = "";
      return rest.length > 0 ? rest : null;
    }

    // 制御プレフィックスの途中なら、マーカー到着を待つ。
    const stillMatching =
      CTRL_PREFIX.startsWith(prefixBuffer) ||
      prefixBuffer.startsWith(CTRL_PREFIX);
    if (!stillMatching || prefixBuffer.length >= MAX_PREFIX_BUFFER) {
      headerStripped = true;
      const out = prefixBuffer;
      prefixBuffer = "";
      return out.length > 0 ? out : null;
    }
    return null;
  }

  return new ReadableStream<string>({
    async pull(controller) {
      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) {
          done = true;
          // 判定が確定しないまま終了した残バッファ（マーカー無しモデルの
          // 短い応答など）は本文として流し切る。
          if (!headerStripped && prefixBuffer.length > 0) {
            headerStripped = true;
            const out = prefixBuffer;
            prefixBuffer = "";
            controller.enqueue(out);
            return;
          }
          break;
        }
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        const deltas: string[] = [];
        for (const event of events) {
          for (const line of event.split("\n")) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload);
              const delta: string | undefined =
                json?.choices?.[0]?.delta?.content;
              if (delta) deltas.push(delta);
            } catch {
              // ignore non-JSON keepalive lines
            }
          }
        }

        if (deltas.length > 0) {
          const out = stripChannelPrefix(deltas.join(""));
          if (out) {
            controller.enqueue(out);
            return;
          }
        }
      }
      controller.close();
    },
    cancel() {
      done = true;
      reader.cancel().catch(() => {});
    },
  });
}

export function fallbackStream(text: string): ReadableStream<string> {
  const chars = Array.from(text);
  let i = 0;
  return new ReadableStream<string>({
    async pull(controller) {
      if (i >= chars.length) {
        controller.close();
        return;
      }
      const chunk = chars.slice(i, i + 2).join("");
      i += 2;
      controller.enqueue(chunk);
      await new Promise((r) => setTimeout(r, 25));
    },
  });
}
