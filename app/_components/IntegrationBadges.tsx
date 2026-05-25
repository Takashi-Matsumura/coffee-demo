import { listIntegrations } from "@/lib/integrations";
import type { IntegrationKey } from "@/lib/types";

export function IntegrationBadges({
  keys,
  title = "Powered by",
}: {
  keys: IntegrationKey[];
  title?: string;
}) {
  const items = listIntegrations(keys);
  return (
    <div className="mt-8 flex w-full flex-col items-center gap-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
        {title}
      </div>
      <ul className="flex flex-wrap justify-center gap-2">
        {items.map((it) => (
          <li
            key={it.key}
            className="inline-flex items-center gap-2 rounded-full border border-coffee/20 bg-cream-soft px-3 py-1.5 text-xs text-espresso/80"
          >
            <span
              className={`inline-block size-1.5 rounded-full ${it.dotClass}`}
              aria-hidden
            />
            <span className="font-medium">{it.label}</span>
            <span className="text-espresso/55">・{it.caption}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
