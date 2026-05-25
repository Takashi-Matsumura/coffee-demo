import type { NextRequest } from "next/server";
import { fallbackStream, streamLlamaChat } from "@/lib/llm";
import {
  buildPersonalMessages,
  buildTeamMessages,
} from "@/lib/prompts";
import type { DiagnoseRequest } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK_PERSONAL = `【今日の一杯】 ミディアムローストのドリップコーヒー、ミルクを少量
【おすすめの淹れ方】 92℃で20gの豆を3分かけてゆっくり抽出。香りを立たせて。
【一言メッセージ】 集中したいときは香りから入るのがコツ。深呼吸して、最初の一口で頭をリセットしましょう。きっと午後の時間がもっと豊かになります。`;

const FALLBACK_TEAM = `【診断結果】 アイデア対話型オフィス：会話と集中が交互に訪れる、創造のリズムを持つチームです。
【推奨機材構成】 全自動エスプレッソマシン1台と、ドリップ式コーヒーサーバーを併設。来客対応用にカプセル式を1台。
【一日のコーヒー体験】 朝はエスプレッソで立ち上がり、昼の打合せにはドリップを大きめのポットで。夕方は集中時間のお供にもう一杯。`;

export async function POST(req: NextRequest) {
  let body: DiagnoseRequest;
  try {
    body = (await req.json()) as DiagnoseRequest;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const messages =
    body.mode === "personal"
      ? buildPersonalMessages(body.answers)
      : buildTeamMessages(body.answers);

  const fallback =
    body.mode === "personal" ? FALLBACK_PERSONAL : FALLBACK_TEAM;

  let textStream: ReadableStream<string>;
  try {
    textStream = await streamLlamaChat(messages, req.signal);
  } catch (err) {
    console.warn("[diagnose] falling back:", err);
    textStream = fallbackStream(fallback);
  }

  const encoder = new TextEncoder();
  const bodyStream = textStream.pipeThrough(
    new TransformStream<string, Uint8Array>({
      transform(chunk, controller) {
        controller.enqueue(encoder.encode(chunk));
      },
    }),
  );

  return new Response(bodyStream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
