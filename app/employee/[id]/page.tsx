import Link from "next/link";
import { notFound } from "next/navigation";
import { IntegrationBadges } from "@/app/_components/IntegrationBadges";
import { findEmployee } from "@/lib/employees";
import { getTier } from "@/lib/policy";

export default async function EmployeeSummaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const employee = findEmployee(id);
  if (!employee) return notFound();

  const tier = getTier(employee.department);

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10 md:py-14">
      <div className="flex w-full max-w-2xl flex-col">
        <Link
          href="/employee"
          className="self-start rounded-full px-3 py-1 text-sm text-espresso/50 transition hover:bg-cream-soft"
        >
          ← 社員選択へ戻る
        </Link>

        <div className="mt-6 flex items-center gap-5 rounded-3xl bg-cream-soft p-6 shadow-sm ring-1 ring-coffee/10">
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-cream"
            style={{
              background: `hsl(${employee.avatarHue}, 55%, 38%)`,
            }}
            aria-hidden
          >
            {employee.name.slice(0, 1)}
          </span>
          <div className="flex-1">
            <div className="font-display text-2xl font-bold text-espresso">
              {employee.name}
            </div>
            <div className="text-sm text-espresso/60">
              {employee.department} ・ {employee.role}
            </div>
            <div className="mt-1 text-[11px] uppercase tracking-widest text-coffee-light">
              ID: {employee.id}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
          <Stat
            label="全額補助"
            value={`月 ${tier.fullCoverageCups} 杯`}
            hint="ここまで会社が全額負担します"
          />
          <Stat
            label="半額補助"
            value={`+${tier.halfCoverageCups} 杯`}
            hint="続く杯数は会社が半額負担"
          />
        </div>

        <div className="mt-8 rounded-3xl border border-coffee/15 bg-white/40 p-6">
          <h2 className="font-display text-lg font-bold text-espresso">
            このまま、AI診断 → 注文へ進む
          </h2>
          <p className="mt-2 text-sm text-espresso/70">
            あなたの今の気分とシーンに合った一杯をAIが提案します。気に入れば、その場で「注文」して福利厚生の計算結果を確認できます。
          </p>
          <Link
            href="/diagnose/personal"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-coffee"
          >
            個人診断をはじめる →
          </Link>
        </div>

        <p className="mt-6 text-xs text-espresso/40">
          ※ プロファイルは架空のものです。料金・福利厚生ルールも展示用のサンプル設定です。
        </p>

        <IntegrationBadges keys={["hr", "policy"]} />
      </div>
    </main>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-2xl bg-cream-soft p-4 ring-1 ring-coffee/10">
      <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coffee-light">
        {label}
      </div>
      <div className="font-display mt-1 text-xl font-bold text-espresso">
        {value}
      </div>
      <div className="mt-1 text-xs text-espresso/55">{hint}</div>
    </div>
  );
}
