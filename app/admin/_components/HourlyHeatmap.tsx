import type { AdminSummary } from "@/lib/types";

export function HourlyHeatmap({ summary }: { summary: AdminSummary }) {
  const max = Math.max(1, ...summary.hourly);

  return (
    <div className="rounded-2xl bg-cream-soft p-5 ring-1 ring-coffee/10">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-base font-bold text-espresso">
          時間帯別 利用ヒートマップ
        </h3>
        <span className="text-[11px] uppercase tracking-widest text-coffee-light">
          0 — 23 時 (JST)
        </span>
      </div>
      <div className="grid grid-cols-12 gap-1 md:grid-cols-24">
        {summary.hourly.map((count, h) => {
          const intensity = count / max;
          const opacity = count === 0 ? 0.08 : 0.18 + intensity * 0.82;
          const isPeak = summary.peakHours.includes(h);
          return (
            <div
              key={h}
              className="relative flex aspect-square flex-col items-center justify-center rounded-md text-[10px]"
              style={{ background: `rgba(107, 58, 29, ${opacity})` }}
              title={`${h}時 ${count}杯`}
            >
              <span
                className={`tabular-nums ${
                  opacity > 0.5 ? "text-cream" : "text-espresso/60"
                }`}
              >
                {h}
              </span>
              {isPeak ? (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-mint" />
              ) : null}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs text-espresso/55">
        色の濃さが利用集中度。緑のドットはピーク時間帯（上位 4）。
      </p>
    </div>
  );
}
