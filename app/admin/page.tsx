import Link from "next/link";
import { IntegrationBadges } from "@/app/_components/IntegrationBadges";
import { buildSummary } from "@/lib/aggregate";
import { DepartmentBarChart } from "./_components/DepartmentBarChart";
import { HourlyHeatmap } from "./_components/HourlyHeatmap";
import { InsightSection } from "./_components/InsightSection";
import { IntegrationActions } from "./_components/IntegrationActions";
import { SummaryCards } from "./_components/SummaryCards";
import { TopMenus } from "./_components/TopMenus";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  const summary = buildSummary();

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10 md:py-14">
      <div className="flex w-full max-w-5xl flex-col">
        <Link
          href="/"
          className="self-start rounded-full px-3 py-1 text-sm text-espresso/50 transition hover:bg-cream-soft"
        >
          ← トップへ
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
              Office Benefit Dashboard
            </span>
            <h1 className="font-display mt-1 text-3xl font-bold text-espresso md:text-4xl">
              総務ダッシュボード
            </h1>
            <p className="mt-2 text-sm text-espresso/60">
              当月のオフィスコーヒー利用状況を、部署別・時間帯別に俯瞰します。
            </p>
          </div>
          <div className="text-right text-xs text-espresso/55">
            集計対象：{summary.period}
            <br />
            データソース：seed + session
          </div>
        </div>

        <div className="mt-8">
          <SummaryCards summary={summary} />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <DepartmentBarChart summary={summary} />
          <TopMenus summary={summary} />
        </div>

        <div className="mt-4">
          <HourlyHeatmap summary={summary} />
        </div>

        <div className="mt-6">
          <InsightSection />
        </div>

        <div className="mt-6">
          <IntegrationActions />
        </div>

        <IntegrationBadges keys={["hr", "policy", "expense", "slack", "bi"]} />
      </div>
    </main>
  );
}
