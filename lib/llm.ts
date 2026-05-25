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

  return new ReadableStream<string>({
    async pull(controller) {
      while (!done) {
        const { done: streamDone, value } = await reader.read();
        if (streamDone) {
          done = true;
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
          controller.enqueue(deltas.join(""));
          return;
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
