"use client";

import { useEffect, useRef, useState } from "react";
import {
  SURVEY_QUESTIONS,
  SurveyQuestion,
  type SurveyOption,
} from "./surveyConfig";

type Answers = Record<string, string | string[]>;

const QUESTIONS = SURVEY_QUESTIONS;
const COMPLETE_INDEX = QUESTIONS.length + 1; // 0:ホーム, 1..N:設問, N+1:完了
const LAST_INDEX = COMPLETE_INDEX;
const TOTAL_SLIDES = COMPLETE_INDEX + 1;

export function HomeDeck({ homeSlide }: { homeSlide: React.ReactNode }) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const downRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const movedRef = useRef(false);
  const submittedRef = useRef(false);

  // 完了スライドに到達したら一度だけ保存する。
  useEffect(() => {
    if (index === COMPLETE_INDEX && !submittedRef.current) {
      submittedRef.current = true;
      fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers }),
      }).catch(() => {
        /* 展示用途では送信失敗でも体験を止めない */
      });
    }
  }, [index, answers]);

  function goTo(i: number) {
    setIndex(Math.max(0, Math.min(LAST_INDEX, i)));
  }

  function reset() {
    setAnswers({});
    submittedRef.current = false;
    setIndex(0);
  }

  function handleSingle(qid: string, value: string, slideIndex: number) {
    setAnswers((a) => ({ ...a, [qid]: value }));
    // タップのフィードバックを見せてから自動で次へ。
    window.setTimeout(() => {
      setIndex((cur) =>
        cur === slideIndex ? Math.min(LAST_INDEX, cur + 1) : cur
      );
    }, 280);
  }

  function toggleMulti(qid: string, value: string) {
    setAnswers((a) => {
      const arr = Array.isArray(a[qid]) ? [...(a[qid] as string[])] : [];
      const at = arr.indexOf(value);
      if (at >= 0) arr.splice(at, 1);
      else arr.push(value);
      return { ...a, [qid]: arr };
    });
  }

  // --- スワイプ（ポインタ）操作 ---
  function onPointerDown(e: React.PointerEvent) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    downRef.current = true;
    movedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    setDragging(true);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!downRef.current) return;
    const dx = e.clientX - startXRef.current;
    const dy = e.clientY - startYRef.current;
    if (!movedRef.current && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) {
      movedRef.current = true;
    }
    if (!movedRef.current) return;
    // 端での過剰スワイプには抵抗をかける。
    let eff = dx;
    if ((index === 0 && dx > 0) || (index === LAST_INDEX && dx < 0)) {
      eff = dx * 0.35;
    }
    setDragPx(eff);
  }

  function endDrag() {
    if (!downRef.current) return;
    downRef.current = false;
    const width = containerRef.current?.offsetWidth ?? window.innerWidth;
    const threshold = Math.min(90, width * 0.18);
    const dx = dragPx;
    setDragging(false);
    setDragPx(0);
    if (dx <= -threshold) goTo(index + 1);
    else if (dx >= threshold) goTo(index - 1);
  }

  // ドラッグ後の click はリンク/ボタンを誤発火させないよう握りつぶす。
  function onClickCapture(e: React.MouseEvent) {
    if (movedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      movedRef.current = false;
    }
  }

  return (
    <div className="relative flex h-[100dvh] flex-col">
      <div
        ref={containerRef}
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{ touchAction: "pan-y" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onClickCapture={onClickCapture}
      >
        <div
          className="flex h-full"
          style={{
            transform: `translateX(calc(${-index * 100}% + ${dragPx}px))`,
            transition: dragging
              ? "none"
              : "transform 350ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* スライド0: 既存ホーム */}
          <section className="h-full w-full shrink-0 overflow-y-auto">
            <div className="px-6 py-8 md:py-10">{homeSlide}</div>
          </section>

          {/* スライド1..N: 設問 */}
          {QUESTIONS.map((q, qi) => (
            <QuestionSlide
              key={q.id}
              question={q}
              position={qi + 1}
              total={QUESTIONS.length}
              answer={answers[q.id]}
              onSingle={(value) => handleSingle(q.id, value, qi + 1)}
              onToggle={(value) => toggleMulti(q.id, value)}
            />
          ))}

          {/* 最終スライド: 完了 */}
          <CompleteSlide onReset={reset} />
        </div>

        {/* 大型ナビ矢印（ドラッグ中は dragPx≠0 なので隠れ、タップ時は残る） */}
        {index > 0 && dragPx === 0 && (
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="前へ戻る"
            className="absolute left-3 top-1/2 z-10 flex size-16 -translate-y-1/2 items-center justify-center rounded-full bg-espresso/85 text-3xl text-cream shadow-lg transition hover:bg-coffee active:scale-95 md:left-6"
          >
            ←
          </button>
        )}

        {index === 0 && dragPx === 0 && (
          <button
            type="button"
            onClick={() => goTo(1)}
            aria-label="アンケートへ進む"
            className="absolute right-3 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-1 rounded-3xl bg-espresso px-6 py-5 text-cream shadow-xl transition hover:bg-coffee active:scale-95 md:right-6"
          >
            <span className="animate-pulse text-3xl leading-none">→</span>
            <span className="text-xs font-semibold tracking-widest">
              アンケート
            </span>
          </button>
        )}

        {index > 0 && index < LAST_INDEX && dragPx === 0 && (
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label={index === COMPLETE_INDEX - 1 ? "回答を送信" : "次へ進む"}
            className="absolute right-3 top-1/2 z-10 flex size-16 -translate-y-1/2 items-center justify-center rounded-full bg-espresso text-3xl text-cream shadow-lg transition hover:bg-coffee active:scale-95 md:right-6"
          >
            →
          </button>
        )}
      </div>

      {/* 進捗インジケータ（常時表示・画面下部にピン留め） */}
      <nav className="flex shrink-0 items-center justify-center gap-2 border-t border-coffee/10 bg-cream-soft/80 py-4 backdrop-blur">
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`スライド ${i + 1}`}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-7 bg-coffee" : "w-2.5 bg-coffee/25"
            }`}
          />
        ))}
      </nav>
    </div>
  );
}

function QuestionSlide({
  question,
  position,
  total,
  answer,
  onSingle,
  onToggle,
}: {
  question: SurveyQuestion;
  position: number;
  total: number;
  answer: string | string[] | undefined;
  onSingle: (value: string) => void;
  onToggle: (value: string) => void;
}) {
  return (
    <section className="h-full w-full shrink-0 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-center px-6 py-10">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
            {question.eyebrow}
          </span>
          <span className="text-xs text-espresso/40">
            {position} / {total}
          </span>
        </div>

        <h2 className="font-display mt-2 text-3xl font-bold leading-tight text-espresso md:text-4xl">
          {question.title}
        </h2>
        {question.description && (
          <p className="mt-2 text-sm text-espresso/60">{question.description}</p>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {question.options.map((opt) =>
            question.type === "single" ? (
              <SingleOption
                key={opt.value}
                option={opt}
                selected={answer === opt.value}
                onSelect={() => onSingle(opt.value)}
              />
            ) : (
              <MultiOption
                key={opt.value}
                option={opt}
                selected={
                  Array.isArray(answer) && answer.includes(opt.value)
                }
                onToggle={() => onToggle(opt.value)}
              />
            )
          )}
        </div>

        {question.type === "multi" && (
          <p className="mt-4 text-center text-xs text-espresso/40">
            選び終えたら「次へ」を押してください
          </p>
        )}
      </div>
    </section>
  );
}

function SingleOption({
  option,
  selected,
  onSelect,
}: {
  option: SurveyOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-2xl px-5 py-4 text-left text-lg font-medium transition ${
        selected
          ? "bg-coffee text-cream shadow-md"
          : "bg-cream-soft text-espresso ring-1 ring-coffee/15 hover:ring-coffee/40"
      }`}
    >
      {option.label}
    </button>
  );
}

function MultiOption({
  option,
  selected,
  onToggle,
}: {
  option: SurveyOption;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 text-left text-lg font-medium transition ${
        selected
          ? "bg-coffee/10 text-espresso ring-2 ring-coffee"
          : "bg-cream-soft text-espresso ring-1 ring-coffee/15 hover:ring-coffee/40"
      }`}
    >
      <span
        className={`flex size-6 shrink-0 items-center justify-center rounded-md border-2 text-sm ${
          selected
            ? "border-coffee bg-coffee text-cream"
            : "border-coffee/30 text-transparent"
        }`}
        aria-hidden
      >
        ✓
      </span>
      {option.label}
    </button>
  );
}

function CompleteSlide({ onReset }: { onReset: () => void }) {
  return (
    <section className="h-full w-full shrink-0 overflow-y-auto">
      <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center px-6 py-10 text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-mint/20 text-4xl text-mint">
          ✓
        </div>
        <h2 className="font-display mt-6 text-3xl font-bold text-espresso md:text-4xl">
          ご回答ありがとうございます
        </h2>
        <p className="mt-4 text-base leading-relaxed text-espresso/70">
          Office Coffee にご興味をお持ちいただき感謝します。
          <br />
          続きは、ぜひ<strong className="text-espresso">お近くのスタッフ</strong>に
          お声がけください。
          <br />
          導入のご相談や詳しいご案内をいたします。
        </p>
        <button
          type="button"
          onClick={onReset}
          className="mt-8 rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-coffee"
        >
          最初に戻る
        </button>
      </div>
    </section>
  );
}
