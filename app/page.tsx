import Link from "next/link";
import { AdVideoPlayer } from "./_components/AdVideoPlayer";
import { IntegrationBadges } from "./_components/IntegrationBadges";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col px-6 py-8 md:py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-14">
        <aside className="flex flex-col items-center text-center lg:sticky lg:top-8 lg:self-start lg:items-start lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-cream-soft px-4 py-1.5 text-sm text-coffee">
            <span className="size-2 rounded-full bg-mint" />
            Local AI Demo — gemma on Mac Studio
          </span>

          <h1 className="font-display mt-5 text-5xl font-bold leading-[1.05] text-espresso md:text-6xl">
            Office Coffee
            <br />
            Compass
          </h1>

          <p className="mt-4 max-w-xl text-base text-espresso/70 md:text-lg">
            AIが「占う」一杯から、オフィス全体のデータ連携まで。
            <br className="hidden md:block" />
            6つのモードで、機材とITが繋がる体験を。
          </p>

          <div className="mt-6 w-full">
            <IntegrationBadges keys={["hr", "policy", "expense", "slack", "bi"]} />
          </div>

          <div className="mt-6 w-full">
            <AdVideoPlayer />
          </div>

          <p className="mt-4 text-xs text-espresso/40">
            このデモは外部のクラウドAIを使用せず、ブース内のMac
            Studio上のローカルAIで動作しています。
          </p>
        </aside>

        <div className="flex flex-col gap-10">
          <Section
            eyebrow="Fortune"
            title="占い体験"
            description="気分やシーンを答えるだけ。AIが言葉でコーヒーを紡ぎます。"
          >
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
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
          </Section>

          <Section
            eyebrow="Workflow"
            title="業務体験"
            description="社員として注文し、総務として全社の利用を見守る。福利厚生と社内データ連携を体験できます。"
          >
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <ModeCard
                href="/employee"
                tag="Employee"
                title="社員として注文する。"
                description="架空社員でログインし、AI診断→注文→会社負担計算までを体験できます。"
                accent="from-mint to-coffee"
                tapHint="社員モードを開く"
              />
              <ModeCard
                href="/admin"
                tag="Admin"
                title="総務として全社を見る。"
                description="部署別の利用状況、福利厚生コスト、AIによる傾向要約を確認できます。"
                accent="from-espresso to-coffee-light"
                tapHint="総務ダッシュボードへ"
              />
            </div>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="w-full">
      <div className="mb-4 flex flex-col items-start">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
          {eyebrow}
        </span>
        <h2 className="font-display mt-1 text-2xl font-bold text-espresso md:text-3xl">
          {title}
        </h2>
        <p className="mt-1.5 max-w-xl text-sm text-espresso/60">{description}</p>
      </div>
      {children}
    </section>
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
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-cream-soft p-5 text-left shadow-sm ring-1 ring-coffee/10 transition hover:-translate-y-1 hover:shadow-xl"
    >
      <div
        className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${accent}`}
      />
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coffee-light">
        {tag}
      </span>
      <h2 className="font-display mt-1.5 text-xl font-bold text-espresso md:text-[1.35rem]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-espresso/70">
        {description}
      </p>
      <span className="mt-4 inline-flex items-center gap-2 self-start rounded-full bg-espresso px-4 py-2 text-xs font-medium text-cream transition group-hover:bg-coffee">
        {tapHint}
        <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
