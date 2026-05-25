import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12 md:py-16">
      <div className="flex flex-col items-center text-center max-w-5xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-cream-soft px-4 py-1.5 text-sm text-coffee">
          <span className="size-2 rounded-full bg-mint" />
          Local AI Demo — gemma on Mac Studio
        </span>

        <h1 className="font-display mt-6 text-5xl font-bold leading-tight text-espresso md:text-7xl">
          Office Coffee
          <br />
          Compass
        </h1>

        <p className="mt-5 max-w-xl text-base text-espresso/70 md:text-lg">
          AIが、あなたとあなたのオフィスにぴったりのコーヒーを「占う」。
          <br className="hidden md:block" />
          4つのモードから、いまの気分に合う診断をどうぞ。
        </p>

        <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
          <ModeCard
            href="/diagnose/personal"
            tag="Personal"
            title="今日のあなたに、この一杯。"
            description="気分とシーンを3タップ。あなたに合うコーヒーをAIが提案します。"
            accent="from-coffee to-espresso"
            tapHint="個人診断"
          />
          <ModeCard
            href="/diagnose/team"
            tag="Team"
            title="あなたのチーム、何型？"
            description="チーム規模と働き方から、オフィス全体のコーヒー像を診断します。"
            accent="from-coffee-light to-coffee"
            tapHint="チーム診断"
          />
          <ModeCard
            href="/diagnose/department"
            tag="Department"
            title="部署ごとの、コーヒー処方箋。"
            description="営業・開発・バックオフィスなど部署特性に合わせた処方箋を作成します。"
            accent="from-mint to-coffee-light"
            tapHint="部署診断"
          />
          <ModeCard
            href="/diagnose/meeting"
            tag="Meeting"
            title="会議に効く、コーヒー設計。"
            description="会議の目的と人数から、最適なコーヒー提供プランを設計します。"
            accent="from-crema to-coffee"
            tapHint="会議診断"
          />
        </div>

        <p className="mt-10 text-xs text-espresso/40">
          このデモは外部のクラウドAIを使用せず、ブース内のMac
          Studio上のローカルAIで動作しています。
        </p>
      </div>
    </main>
  );
}

function ModeCard({
  href,
  tag,
  title,
  description,
  accent,
  tapHint,
}: {
  href: string;
  tag: string;
  title: string;
  description: string;
  accent: string;
  tapHint: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col overflow-hidden rounded-3xl bg-cream-soft p-7 text-left shadow-sm ring-1 ring-coffee/10 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coffee-light">
        {tag}
      </span>
      <h2 className="font-display mt-2 text-2xl font-bold text-espresso md:text-[1.7rem]">
        {title}
      </h2>
      <p className="mt-3 text-sm text-espresso/70">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-cream transition group-hover:bg-coffee">
        {tapHint}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
