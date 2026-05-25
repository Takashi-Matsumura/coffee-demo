"use client";

import { useEffect, useRef, useState } from "react";

export function InsightSection() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"streaming" | "done" | "error">(
    "streaming",
  );
  const [reloadKey, setReloadKey] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    startedRef.current = false;
    setText("");
    setStatus("streaming");
  }, [reloadKey]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/admin/insight", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        });
        if (!res.ok || !res.body) {
          setStatus("error");
          return;
        }
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          setText((prev) => prev + decoder.decode(value, { stream: true }));
        }
        setStatus("done");
      } catch {
        setStatus("error");
      }
    })();
  }, [reloadKey]);

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
        {renderSections(text)}
        {status === "streaming" ? (
          <span className="ml-1 inline-block h-5 w-2 animate-pulse bg-coffee align-middle" />
        ) : null}
      </div>
    </section>
  );
}

function renderSections(text: string) {
  if (!text) return null;
  const parts = text.split(/(【[^】]+】)/g).filter(Boolean);
  return parts.map((p, i) => {
    if (/^【[^】]+】$/.test(p)) {
      return (
        <span
          key={i}
          className="mt-3 block text-sm font-bold tracking-wider text-coffee md:text-base"
        >
          {p}
        </span>
      );
    }
    return (
      <span key={i} className="block">
        {p.replace(/^\s+/, "")}
      </span>
    );
  });
}
