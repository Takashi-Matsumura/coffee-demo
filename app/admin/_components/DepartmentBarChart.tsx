import type { AdminSummary } from "@/lib/types";

export function DepartmentBarChart({ summary }: { summary: AdminSummary }) {
  const max = Math.max(1, ...summary.topDepartments.map((d) => d.cups));

  return (
    <div className="rounded-2xl bg-cream-soft p-5 ring-1 ring-coffee/10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-espresso">
          部署別 当月の杯数
        </h3>
        <span className="text-[11px] uppercase tracking-widest text-coffee-light">
          {summary.period}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {summary.topDepartments.map((d) => (
          <li key={d.name} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-sm text-espresso/80">{d.name}</span>
            <div className="relative h-7 flex-1 overflow-hidden rounded-md bg-white/50">
              <div
                className="h-full rounded-md bg-gradient-to-r from-coffee-light to-coffee"
                style={{ width: `${(d.cups / max) * 100}%` }}
                aria-hidden
              />
            </div>
            <span className="w-20 text-right text-sm tabular-nums text-espresso">
              {d.cups}杯
              <span className="ml-1 text-xs text-espresso/55">
                {(d.share * 100).toFixed(0)}%
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
