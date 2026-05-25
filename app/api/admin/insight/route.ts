import type { NextRequest } from "next/server";
import { buildSummary } from "@/lib/aggregate";
import { fallbackStream, streamLlamaChat } from "@/lib/llm";
import { buildAdminInsightMessages } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const FALLBACK = `【今月の傾向】 当月の総杯数は集計対象期間内で安定しており、会社負担額が支出の大半を占めています。
【気付き】 利用が午前と午後の特定時間帯に集中しており、ピーク時の補充オペレーションがボトルネックになりやすい傾向があります。
【次月への提案】 ピーク前の補充スケジュール最適化と、補助上限超過者への利用ガイド配布を検討すると、満足度と運用効率の両方が改善できます。`;

export async function POST(req: NextRequest) {
  let monthKey: string | undefined;
  try {
    const body = (await req.json().catch(() => ({}))) as {
      monthKey?: string;
    };
    monthKey = body.monthKey;
  } catch {
    // ignore
  }

  const summary = buildSummary(monthKey);
  const messages = buildAdminInsightMessages(summary);

  let textStream: ReadableStream<string>;
  try {
    textStream = await streamLlamaChat(messages, req.signal);
  } catch (err) {
    console.warn("[admin/insight] falling back:", err);
    textStream = fallbackStream(FALLBACK);
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
