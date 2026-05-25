import type { AdminSummary } from "@/lib/types";

export function SummaryCards({ summary }: { summary: AdminSummary }) {
  const items = [
    {
      label: "今月の総杯数",
      value: `${summary.totalCups}`,
      unit: "杯",
      hint: `${summary.period}（シード ＋ セッション合算）`,
    },
    {
      label: "会社負担額",
      value: `¥${summary.totalCompanyCost.toLocaleString()}`,
      unit: "",
      hint: `平均単価 ¥${summary.avgUnitPrice}/杯`,
    },
    {
      label: "自己負担額",
      value: `¥${summary.totalEmployeeCost.toLocaleString()}`,
      unit: "",
      hint: "全社の社員自己負担合計",
    },
    {
      label: "上限超過者",
      value: `${summary.overBudgetEmployees}`,
      unit: "名",
      hint: "半額補助上限を超えている社員",
    },
  ];
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-2xl bg-cream-soft p-4 ring-1 ring-coffee/10"
        >
          <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-coffee-light">
            {it.label}
          </div>
          <div className="font-display mt-2 text-2xl font-bold text-espresso md:text-3xl">
            {it.value}
            <span className="ml-1 text-base font-normal text-espresso/60">
              {it.unit}
            </span>
          </div>
          <div className="mt-1 text-xs text-espresso/55">{it.hint}</div>
        </div>
      ))}
    </div>
  );
}
