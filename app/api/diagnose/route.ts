import type { NextRequest } from "next/server";
import { fallbackStream, streamLlamaChat } from "@/lib/llm";
import {
  buildDepartmentMessages,
  buildMeetingMessages,
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

const FALLBACK_DEPARTMENT = `【部署診断】 対外コミュニケーション型チーム：常にお客様と向き合い、瞬発力が問われる部署です。
【処方される一杯】 すっきりとした浅煎りドリップに、必要に応じてミルクを足せる選択肢を。
【共有スペースの設計】 入り口近くに来客対応にも使えるカウンタータイプを設置し、社内動線と接客動線を兼ねる構成が効率的です。
【運用Tips】 商談前にすぐ出せる「定番の一杯」をチームで共有メニュー化しておくと、提供スピードが安定します。`;

const FALLBACK_MEETING = `【会議の性格】 意思決定を前に進める、緊張感のある対面会議。
【提供するコーヒー】 落ち着いた深煎りドリップを小ぶりなカップで。長丁場に備えて温かさが続くサーバー式が安心です。
【提供タイミング】 開始15分前にセットアップ完了。中盤に温め直しの一巡を挟むと、議論の沈み込みを防げます。
【演出のヒント】 砂糖・ミルク・水を一直線にレイアウトすると、所作の流れが整い、会議室全体に落ち着きが生まれます。`;

export async function POST(req: NextRequest) {
  let body: DiagnoseRequest;
  try {
    body = (await req.json()) as DiagnoseRequest;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  let messages;
  let fallback: string;
  switch (body.mode) {
    case "personal":
      messages = buildPersonalMessages(body.answers);
      fallback = FALLBACK_PERSONAL;
      break;
    case "team":
      messages = buildTeamMessages(body.answers);
      fallback = FALLBACK_TEAM;
      break;
    case "department":
      messages = buildDepartmentMessages(body.answers);
      fallback = FALLBACK_DEPARTMENT;
      break;
    case "meeting":
      messages = buildMeetingMessages(body.answers);
      fallback = FALLBACK_MEETING;
      break;
    default: {
      const _exhaustive: never = body;
      void _exhaustive;
      return new Response("unknown mode", { status: 400 });
    }
  }

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
