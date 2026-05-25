import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-8 py-16">
      <div className="flex flex-col items-center text-center max-w-3xl">
        <span className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-cream-soft px-4 py-1.5 text-sm text-coffee">
          <span className="size-2 rounded-full bg-mint" />
          Local AI Demo — gemma on Mac Studio
        </span>

        <h1 className="font-display mt-8 text-6xl font-bold leading-tight text-espresso md:text-7xl">
          Office Coffee
          <br />
          Compass
        </h1>

        <p className="mt-6 max-w-xl text-lg text-espresso/70 md:text-xl">
          AIがあなたとチームに合わせて、
          <br className="hidden md:block" />
          「今日の一杯」と「オフィスの一日」を診断します。
        </p>

        <div className="mt-14 flex w-full max-w-2xl flex-col gap-4 md:flex-row">
          <ModeCard
            href="/diagnose/personal"
            tag="個人向け"
            title="今日のあなたに、この一杯。"
            description="気分とシーンを3タップ。あなたに合うコーヒーをAIが提案します。"
            accent="from-coffee to-espresso"
            tapHint="個人診断をはじめる"
          />
          <ModeCard
            href="/diagnose/team"
            tag="オフィス向け"
            title="あなたのチーム、何型？"
            description="チーム規模と働き方から、最適なオフィスコーヒー像を診断します。"
            accent="from-coffee-light to-coffee"
            tapHint="チーム診断をはじめる"
          />
        </div>

        <p className="mt-12 text-xs text-espresso/40">
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
      className="group relative flex flex-1 flex-col overflow-hidden rounded-3xl bg-cream-soft p-8 text-left shadow-sm ring-1 ring-coffee/10 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <span className="text-xs font-medium uppercase tracking-widest text-coffee-light">
        {tag}
      </span>
      <h2 className="font-display mt-3 text-2xl font-bold text-espresso md:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-sm text-espresso/70">{description}</p>
      <span className="mt-8 inline-flex items-center gap-2 self-start rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-cream transition group-hover:bg-coffee">
        {tapHint}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
