import { Wizard, type Step } from "../_components/Wizard";

const steps: Step[] = [
  {
    key: "meetingType",
    question: "どんな会議ですか？",
    choices: [
      { value: "役員会議・経営会議のような意思決定の場", label: "役員・意思決定", hint: "結論を出す場" },
      { value: "アイデア出しのブレインストーミング", label: "ブレスト", hint: "発想を広げたい" },
      { value: "1on1や少人数の対話", label: "1on1・対話", hint: "じっくり聴く時間" },
      { value: "来客対応・商談・面接", label: "来客・商談", hint: "もてなしの場" },
    ],
  },
  {
    key: "attendees",
    question: "参加人数は？",
    choices: [
      { value: "2〜3名のごく少人数", label: "2〜3名", hint: "膝を突き合わせて" },
      { value: "4〜8名の少人数", label: "4〜8名", hint: "テーブル一つで収まる" },
      { value: "9〜20名の中規模", label: "9〜20名", hint: "ロの字型で囲む" },
      { value: "20名超の大規模", label: "20名超", hint: "会議室いっぱい" },
    ],
  },
  {
    key: "timing",
    question: "いつ開催されますか？",
    choices: [
      { value: "朝一番（始業直後）", label: "朝イチ", hint: "頭を起こす時間" },
      { value: "午前中の中盤", label: "午前中", hint: "頭がフレッシュ" },
      { value: "ランチ後の午後", label: "午後", hint: "眠気との戦い" },
      { value: "夕方〜終業前", label: "夕方", hint: "疲労が溜まる時間帯" },
    ],
  },
];

export default function MeetingDiagnosePage() {
  return (
    <Wizard
      title="Meeting Coordination"
      subtitle="会議の目的に合わせたコーヒー提供プランを、AIが設計します。"
      steps={steps}
      mode="meeting"
      resultTitle="Meeting Coffee Plan"
    />
  );
}
