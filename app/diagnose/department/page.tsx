import { Wizard, type Step } from "../_components/Wizard";

const steps: Step[] = [
  {
    key: "department",
    question: "あなたの部署は？",
    choices: [
      { value: "営業部・カスタマーサクセス", label: "営業 / CS", hint: "顧客対応の最前線" },
      { value: "開発部・エンジニアリング", label: "開発", hint: "コードと向き合う時間が長い" },
      { value: "企画・マーケティング", label: "企画・マーケ", hint: "アイデアを練る部署" },
      { value: "人事・総務・経理などのバックオフィス", label: "バックオフィス", hint: "会社の屋台骨" },
    ],
  },
  {
    key: "size",
    question: "部署の人数は？",
    choices: [
      { value: "5名以下の少数精鋭", label: "〜5名", hint: "顔の見えるチーム" },
      { value: "6〜15名の機動チーム", label: "6〜15名", hint: "ちょうど良い規模" },
      { value: "16〜40名のしっかり組織", label: "16〜40名", hint: "複数のチームに分かれる" },
      { value: "40名超の大所帯", label: "40名超", hint: "部署内が島で分かれる" },
    ],
  },
  {
    key: "style",
    question: "この部署の働き方は？",
    choices: [
      { value: "外出・出張・来客対応が多い", label: "外向き多め", hint: "オフィスを出入りする" },
      { value: "デスクで集中して作業する時間が長い", label: "集中作業多め", hint: "黙々と進めるタイプ" },
      { value: "ミーティングや雑談が頻繁", label: "対話多め", hint: "話しながら進める" },
      { value: "シフト制や交代制で常時稼働", label: "常時稼働", hint: "誰かしらは席にいる" },
    ],
  },
];

export default function DepartmentDiagnosePage() {
  return (
    <Wizard
      title="Department Prescription"
      subtitle="部署の働き方に合わせた、コーヒー処方箋をAIが作ります。"
      steps={steps}
      mode="department"
      resultTitle="Your Department's Prescription"
    />
  );
}
