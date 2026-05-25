import { Wizard, type Step } from "../_components/Wizard";

const steps: Step[] = [
  {
    key: "mood",
    question: "今、どんな気分ですか？",
    choices: [
      { value: "眠くて頭がぼんやり", label: "ぼんやり", hint: "まだ目が覚めきっていない" },
      { value: "集中したい", label: "集中したい", hint: "これから一気に進めたい" },
      { value: "ちょっと一息つきたい", label: "ひと息", hint: "気持ちを落ち着けたい" },
      { value: "気分を上げたい", label: "上げていきたい", hint: "テンション高めにいきたい" },
    ],
  },
  {
    key: "scene",
    question: "これから何をしますか？",
    choices: [
      { value: "朝の業務スタート", label: "朝の始業", hint: "メール処理や予定確認" },
      { value: "重要なプレゼンや会議", label: "会議・商談", hint: "頭をクリアに" },
      { value: "深い作業や思考", label: "集中作業", hint: "コードや資料づくり" },
      { value: "誰かと雑談・休憩", label: "休憩・雑談", hint: "リフレッシュ" },
    ],
  },
  {
    key: "taste",
    question: "好みの味は？",
    choices: [
      { value: "苦味しっかり", label: "しっかり苦め", hint: "深煎り・エスプレッソ系" },
      { value: "酸味のある爽やか系", label: "酸味・華やか", hint: "浅煎り・フルーティ" },
      { value: "ミルクでまろやか", label: "ミルク多め", hint: "ラテ・カプチーノ" },
      { value: "甘さがほしい", label: "甘め", hint: "シロップやチョコの香り" },
    ],
  },
];

export default function PersonalDiagnosePage() {
  return (
    <Wizard
      title="Personal Diagnosis"
      subtitle="3つの質問に答えるだけ。あなたに合う一杯をAIが選びます。"
      steps={steps}
      mode="personal"
      resultTitle="Your Cup for Today"
    />
  );
}
