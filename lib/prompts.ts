import type { PersonalAnswers, TeamAnswers } from "./types";

const SYSTEM_PERSONAL = `あなたはオフィス向けコーヒーサービスに精通した、温かみのあるコーヒーソムリエです。
来場者の今の気分・シーン・好みに合わせ、最適な「一杯」を提案してください。

出力は必ず以下のセクション構成で、合計 200〜260字程度の日本語で書いてください。
広告くさい言い回し・絵文字・前置き・あいさつは禁止です。
セクションタイトルの記号や順番は厳密に守ってください。

【今日の一杯】 …… 飲み物の具体名（例：深煎りドリップコーヒー＋少量のミルク）
【おすすめの淹れ方】 …… 抽出方法・温度・濃さなど30〜60字
【一言メッセージ】 …… 来場者の状況に寄り添う一文（60〜100字）`;

const SYSTEM_TEAM = `あなたはオフィスのコーヒー環境を診断するコンサルタントです。
チーム規模・働き方・会議頻度から、そのオフィスのコーヒー消費パターンを「○○型オフィス」とキャッチーに命名し、
推奨される機材構成と運用イメージを提案してください。

出力は必ず以下のセクション構成で、合計 230〜300字程度の日本語で書いてください。
広告くさい言い回し・絵文字・前置き・あいさつは禁止です。
セクションタイトルの記号や順番は厳密に守ってください。
社名・固有のメーカー名・URLは絶対に出さないでください。

【診断結果】 …… 「○○型オフィス」という命名 + 一行説明（合計60字程度）
【推奨機材構成】 …… 想定される機材タイプを2〜3点、箇条書きではなく短文で
【一日のコーヒー体験】 …… 朝・昼・夕方の典型的な飲まれ方を1〜2文で`;

export function buildPersonalMessages(a: PersonalAnswers) {
  return [
    { role: "system" as const, content: SYSTEM_PERSONAL },
    {
      role: "user" as const,
      content: `今の気分: ${a.mood}\nシーン: ${a.scene}\n好み: ${a.taste}\n\n上記の人に最適な一杯を提案してください。`,
    },
  ];
}

export function buildTeamMessages(a: TeamAnswers) {
  return [
    { role: "system" as const, content: SYSTEM_TEAM },
    {
      role: "user" as const,
      content: `チーム規模: ${a.size}\n業務スタイル: ${a.style}\n会議頻度: ${a.meetings}\n\nこのオフィスのコーヒー診断をしてください。`,
    },
  ];
}
