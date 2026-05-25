import type { AdminSummary } from "@/lib/types";

export function TopMenus({ summary }: { summary: AdminSummary }) {
  const max = Math.max(1, ...summary.topMenus.map((m) => m.cups));
  return (
    <div className="rounded-2xl bg-cream-soft p-5 ring-1 ring-coffee/10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-espresso">
          人気メニュー Top5
        </h3>
        <span className="text-[11px] uppercase tracking-widest text-coffee-light">
          {summary.period}
        </span>
      </div>
      <ul className="flex flex-col gap-2">
        {summary.topMenus.map((m, i) => (
          <li key={m.id} className="flex items-center gap-3">
            <span className="font-display w-6 text-sm font-bold text-coffee">
              {i + 1}
            </span>
            <span className="flex-1 text-sm text-espresso">{m.name}</span>
            <div className="h-2 w-24 overflow-hidden rounded-full bg-white/50">
              <div
                className="h-full rounded-full bg-coffee-light"
                style={{ width: `${(m.cups / max) * 100}%` }}
                aria-hidden
              />
            </div>
            <span className="w-12 text-right text-sm tabular-nums text-espresso/80">
              {m.cups}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
