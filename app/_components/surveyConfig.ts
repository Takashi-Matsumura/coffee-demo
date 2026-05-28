// 展示ブース用「Office Coffee 興味アンケート」の設問定義。
// 横デック（HomeDeck）と保存 API の双方から参照する純データ。

export type SurveyOption = {
  value: string;
  label: string;
};

export type SurveyQuestion = {
  id: string;
  eyebrow: string;
  title: string;
  description?: string;
  type: "single" | "multi";
  options: SurveyOption[];
};

export const SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    id: "role",
    eyebrow: "Q1",
    title: "あなたのお立場は？",
    type: "single",
    options: [
      { value: "exec", label: "経営層" },
      { value: "admin", label: "総務・管理部門" },
      { value: "staff", label: "現場の社員" },
      { value: "industry", label: "コーヒー機材・サービス業界" },
      { value: "other", label: "その他" },
    ],
  },
  {
    id: "company_size",
    eyebrow: "Q2",
    title: "会社の規模は？",
    type: "single",
    options: [
      { value: "lt50", label: "〜50名" },
      { value: "50to300", label: "50〜300名" },
      { value: "300to1000", label: "300〜1000名" },
      { value: "gt1000", label: "1000名〜" },
    ],
  },
  {
    id: "current_setup",
    eyebrow: "Q3",
    title: "今のオフィスの「コーヒー事情」は？",
    description: "あてはまるものをすべて選んでください。",
    type: "multi",
    options: [
      { value: "vending", label: "自販機" },
      { value: "convenience", label: "各自コンビニ等で購入" },
      { value: "drip_machine", label: "ドリップマシン" },
      { value: "instant", label: "インスタント・ティーサーバー" },
      { value: "none", label: "特になし" },
    ],
  },
  {
    id: "expectation",
    eyebrow: "Q4",
    title: "Office Coffee に一番期待することは？",
    type: "single",
    options: [
      { value: "quality", label: "味・品質" },
      { value: "cost", label: "コスト" },
      { value: "welfare", label: "福利厚生・満足度" },
      { value: "communication", label: "コミュニケーション活性化" },
      { value: "health", label: "健康配慮" },
      { value: "operation", label: "管理の手間削減" },
    ],
  },
  {
    id: "highlight",
    eyebrow: "Q5",
    title: "今日のデモで一番刺さった機能は？",
    type: "single",
    options: [
      { value: "diagnose", label: "AI診断（占い）" },
      { value: "order", label: "注文〜会社負担計算" },
      { value: "welfare", label: "福利厚生連携" },
      { value: "admin", label: "総務ダッシュボード" },
      { value: "local_ai", label: "ローカルAI（データを社外に出さない）" },
    ],
  },
];
