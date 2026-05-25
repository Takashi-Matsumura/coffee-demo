import { Wizard, type Step } from "../_components/Wizard";

const steps: Step[] = [
  {
    key: "size",
    question: "チームの規模は？",
    choices: [
      { value: "10名以下のスモールチーム", label: "〜10名", hint: "スタートアップ的" },
      { value: "11〜30名の中規模オフィス", label: "11〜30名", hint: "1フロア収まる規模" },
      { value: "31〜100名の組織", label: "31〜100名", hint: "部門が分かれる規模" },
      { value: "100名超の大規模オフィス", label: "100名超", hint: "複数フロア・拠点" },
    ],
  },
  {
    key: "style",
    question: "働き方の中心は？",
    choices: [
      { value: "営業・対外活動が多い", label: "営業中心", hint: "外出と来客が多め" },
      { value: "開発・制作などの集中作業", label: "開発・制作中心", hint: "黙々と作る時間が長い" },
      { value: "コラボ・ディスカッション中心", label: "対話中心", hint: "会議や雑談が活発" },
      { value: "ハイブリッドで日によって違う", label: "ハイブリッド", hint: "在宅と出社が混在" },
    ],
  },
  {
    key: "meetings",
    question: "会議や来客の頻度は？",
    choices: [
      { value: "ほぼ毎日、来客や会議がある", label: "とても多い", hint: "応接需要あり" },
      { value: "週に数回程度", label: "そこそこ", hint: "定例会議が中心" },
      { value: "あまり多くない", label: "少なめ", hint: "個人ワークが主体" },
      { value: "オンライン会議がほとんど", label: "オンライン中心", hint: "対面はまれ" },
    ],
  },
];

export default function TeamDiagnosePage() {
  return (
    <Wizard
      title="Team Diagnosis"
      subtitle="3つの質問で、あなたのオフィスのコーヒー像が見えます。"
      steps={steps}
      mode="team"
      resultTitle="Your Office Type"
    />
  );
}
