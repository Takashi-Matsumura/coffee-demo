"use client";

import Link from "next/link";
import { useState } from "react";
import type { DiagnoseMode } from "@/lib/types";
import { ResultCard } from "./ResultCard";

export type Choice = { value: string; label: string; hint?: string };
export type Step = { key: string; question: string; choices: Choice[] };

type Props = {
  title: string;
  subtitle: string;
  steps: Step[];
  mode: DiagnoseMode;
  resultTitle: string;
};

export function Wizard({ title, subtitle, steps, mode, resultTitle }: Props) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = steps.length;
  const current = steps[stepIndex];

  function handlePick(value: string) {
    const next = { ...answers, [current.key]: value };
    setAnswers(next);
    if (stepIndex + 1 < totalSteps) {
      setStepIndex(stepIndex + 1);
    } else {
      setSubmitted(true);
    }
  }

  function handleReset() {
    setStepIndex(0);
    setAnswers({});
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <ResultCard
        title={resultTitle}
        mode={mode}
        answers={answers}
        onRetry={handleReset}
      />
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col items-center">
      <div className="flex w-full items-center justify-between text-sm text-espresso/50">
        <Link
          href="/"
          className="rounded-full px-3 py-1 transition hover:bg-cream-soft"
        >
          ← トップへ
        </Link>
        <span>
          {stepIndex + 1} / {totalSteps}
        </span>
      </div>

      <span className="font-display mt-8 text-xs uppercase tracking-[0.3em] text-coffee-light">
        {title}
      </span>
      <p className="mt-2 text-sm text-espresso/60">{subtitle}</p>

      <h1 className="font-display mt-10 text-center text-4xl font-bold text-espresso md:text-5xl">
        {current.question}
      </h1>

      <div className="mt-12 grid w-full grid-cols-1 gap-4 md:grid-cols-2">
        {current.choices.map((c) => (
          <button
            key={c.value}
            type="button"
            onClick={() => handlePick(c.value)}
            className="group rounded-2xl border border-coffee/15 bg-cream-soft p-6 text-left transition hover:-translate-y-0.5 hover:border-coffee/40 hover:shadow-lg"
          >
            <div className="font-display text-xl font-bold text-espresso">
              {c.label}
            </div>
            {c.hint ? (
              <div className="mt-1 text-sm text-espresso/60">{c.hint}</div>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-12 flex w-full justify-center">
        <ProgressDots total={totalSteps} index={stepIndex} />
      </div>
    </div>
  );
}

function ProgressDots({ total, index }: { total: number; index: number }) {
  return (
    <div className="flex items-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`h-1.5 rounded-full transition-all ${
            i === index
              ? "w-8 bg-coffee"
              : i < index
                ? "w-4 bg-coffee/50"
                : "w-4 bg-coffee/15"
          }`}
        />
      ))}
    </div>
  );
}
