"use client";

import { useState } from "react";
import type { IntegrationKey } from "@/lib/types";

type Item = { key: IntegrationKey; label: string; hint: string };

const ITEMS: Item[] = [
  {
    key: "expense",
    label: "経費精算SaaSに送信",
    hint: "自己負担分を月末締めの経費レポートへ",
  },
  {
    key: "slack",
    label: "Slackに通知",
    hint: "本人と総務チャンネルに領収書を共有",
  },
];

export function OrderIntegrations({ orderId }: { orderId: string }) {
  const [busy, setBusy] = useState<IntegrationKey | null>(null);
  const [done, setDone] = useState<Record<IntegrationKey, boolean>>(
    {} as Record<IntegrationKey, boolean>,
  );
  const [toast, setToast] = useState<string | null>(null);

  async function fire(item: Item) {
    setBusy(item.key);
    try {
      const res = await fetch("/api/integrations/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key, orderId }),
      });
      const json = (await res.json()) as { message?: string };
      setDone((prev) => ({ ...prev, [item.key]: true }));
      setToast(json.message ?? "送信しました（モック）");
    } catch {
      setToast("通信エラーが発生しました");
    } finally {
      setBusy(null);
      setTimeout(() => setToast(null), 2400);
    }
  }

  return (
    <section className="rounded-3xl bg-cream-soft p-5 ring-1 ring-coffee/10">
      <div className="mb-3 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-light">
            Integrations
          </span>
          <h3 className="font-display text-base font-bold text-espresso">
            この注文を、他のシステムへ
          </h3>
        </div>
        <span className="text-xs text-espresso/55">モック動作</span>
      </div>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={busy !== null || done[item.key]}
            onClick={() => fire(item)}
            className="flex items-center justify-between rounded-2xl border border-coffee/20 bg-white/40 px-4 py-3 text-left transition hover:border-coffee/40 disabled:opacity-60"
          >
            <span>
              <span className="block font-display text-sm font-bold text-espresso">
                {item.label}
              </span>
              <span className="block text-xs text-espresso/60">{item.hint}</span>
            </span>
            <span className="text-sm text-coffee">
              {done[item.key] ? "✓ 送信済" : busy === item.key ? "..." : "送信"}
            </span>
          </button>
        ))}
      </div>
      {toast ? (
        <div className="mt-3 rounded-xl border border-mint/40 bg-mint/15 px-3 py-2 text-xs text-espresso">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
