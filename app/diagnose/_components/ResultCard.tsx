"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { DiagnoseMode } from "@/lib/types";

type Props = {
  title: string;
  mode: DiagnoseMode;
  answers: Record<string, string>;
  onRetry: () => void;
};

export function ResultCard({ title, mode, answers, onRetry }: Props) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"streaming" | "done" | "error">(
    "streaming",
  );
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    (async () => {
      try {
        const res = await fetch("/api/diagnose", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode, answers }),
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
  }, [mode, answers]);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <span className="font-display text-xs uppercase tracking-[0.3em] text-coffee-light">
        {title}
      </span>

      <article className="mt-6 w-full overflow-hidden rounded-3xl bg-cream-soft p-10 shadow-lg ring-1 ring-coffee/10">
        <div className="flex items-center gap-3">
          <Cup spinning={status === "streaming"} />
          <span className="text-sm text-espresso/60">
            {status === "streaming"
              ? "AIが診断中..."
              : status === "done"
                ? "診断完了"
                : "AIに接続できませんでした"}
          </span>
        </div>

        <div className="font-display mt-8 whitespace-pre-wrap text-lg leading-9 text-espresso md:text-xl">
          {renderSections(text)}
          {status === "streaming" ? (
            <span className="ml-1 inline-block h-6 w-2 animate-pulse bg-coffee align-middle" />
          ) : null}
        </div>
      </article>

      <div className="mt-10 flex flex-col items-center gap-4 md:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="rounded-full bg-espresso px-7 py-3 text-sm font-medium text-cream transition hover:bg-coffee"
        >
          もう一度診断する
        </button>
        <Link
          href="/"
          className="rounded-full border border-coffee/30 px-7 py-3 text-sm font-medium text-espresso transition hover:bg-cream-soft"
        >
          トップへ戻る
        </Link>
      </div>
    </div>
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
          className="mt-4 block text-base font-bold tracking-wider text-coffee md:text-lg"
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

function Cup({ spinning }: { spinning: boolean }) {
  return (
    <span
      className={`inline-flex size-8 items-center justify-center rounded-full bg-coffee/10 text-coffee ${
        spinning ? "animate-pulse" : ""
      }`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
        <path d="M4 4h13v8a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V4Zm15 2h2a3 3 0 0 1 0 6h-2V6ZM3 20h17v2H3v-2Z" />
      </svg>
    </span>
  );
}
