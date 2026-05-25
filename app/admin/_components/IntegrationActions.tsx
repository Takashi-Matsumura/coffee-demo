"use client";

import { useState } from "react";
import type { IntegrationKey } from "@/lib/types";

type Item = {
  key: IntegrationKey;
  label: string;
  hint: string;
};

const ITEMS: Item[] = [
  {
    key: "expense",
    label: "経費精算SaaSに送信",
    hint: "今月の社員別自己負担を経費SaaSへ反映",
  },
  {
    key: "slack",
    label: "Slack に通知",
    hint: "総務チャンネルに当月レポートを投稿",
  },
  {
    key: "bi",
    label: "BIにエクスポート",
    hint: "CSVで集計データを BI 基盤へ転送",
  },
];

export function IntegrationActions() {
  const [toast, setToast] = useState<string | null>(null);
  const [busy, setBusy] = useState<IntegrationKey | null>(null);

  async function fire(item: Item) {
    setBusy(item.key);
    try {
      const res = await fetch("/api/integrations/mock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.key }),
      });
      const json = (await res.json()) as { message?: string };
      setToast(json.message ?? "送信しました（モック）");
    } catch {
      setToast("通信エラーが発生しました");
    } finally {
      setBusy(null);
      setTimeout(() => setToast(null), 2400);
    }
  }

  return (
    <section className="rounded-3xl bg-cream-soft p-6 shadow-sm ring-1 ring-coffee/10">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-light">
            Integrations
          </span>
          <h3 className="font-display text-xl font-bold text-espresso">
            連携先システムへ送信
          </h3>
        </div>
        <span className="text-xs text-espresso/55">モック動作・実送信なし</span>
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {ITEMS.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={busy !== null}
            onClick={() => fire(item)}
            className="group flex flex-col items-start rounded-2xl border border-coffee/20 bg-white/40 p-4 text-left transition hover:-translate-y-0.5 hover:border-coffee/40 disabled:opacity-50"
          >
            <span className="font-display text-base font-bold text-espresso">
              {item.label}
            </span>
            <span className="mt-1 text-xs text-espresso/60">{item.hint}</span>
            <span className="mt-3 text-xs font-medium text-coffee group-hover:text-espresso">
              {busy === item.key ? "送信中..." : "送信する →"}
            </span>
          </button>
        ))}
      </div>

      {toast ? (
        <div className="mt-4 rounded-2xl border border-mint/40 bg-mint/15 px-4 py-3 text-sm text-espresso">
          {toast}
        </div>
      ) : null}
    </section>
  );
}
