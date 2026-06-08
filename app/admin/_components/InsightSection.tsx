"use client";

import { useState } from "react";
import {
  renderStreamSections,
  useStreamingText,
} from "@/app/_components/streaming";

export function InsightSection() {
  const [reloadKey, setReloadKey] = useState(0);
  const { text, status } = useStreamingText(
    "/api/admin/insight",
    {},
    reloadKey,
  );

  return (
    <section className="rounded-3xl bg-cream-soft p-6 shadow-sm ring-1 ring-coffee/10">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-coffee-light">
            AI Insight
          </span>
          <h3 className="font-display text-xl font-bold text-espresso">
            ローカルAIによる、今月の所見
          </h3>
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className="rounded-full border border-coffee/30 px-3 py-1 text-xs text-espresso transition hover:bg-cream"
          disabled={status === "streaming"}
        >
          再生成
        </button>
      </div>

      <div className="mt-1 flex items-center gap-2 text-xs text-espresso/55">
        <span
          className={`inline-block size-2 rounded-full ${
            status === "streaming" ? "animate-pulse bg-mint" : "bg-coffee/40"
          }`}
        />
        {status === "streaming"
          ? "AIが分析中..."
          : status === "done"
            ? "分析完了"
            : "AIに接続できませんでした（事前文言を表示中）"}
      </div>

      <div className="font-display mt-5 whitespace-pre-wrap text-base leading-8 text-espresso md:text-lg">
        {renderStreamSections(
          text,
          "mt-3 block text-sm font-bold tracking-wider text-coffee md:text-base",
        )}
        {status === "streaming" ? (
          <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-coffee align-middle" />
        ) : null}
      </div>
    </section>
  );
}
