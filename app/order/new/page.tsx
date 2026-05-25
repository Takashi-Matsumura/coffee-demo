"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IntegrationBadges } from "@/app/_components/IntegrationBadges";
import { getCurrentEmployeeId } from "@/lib/employee-session";
import { listEmployees } from "@/lib/employees";
import { matchMenu, type MenuMatch } from "@/lib/menu";
import type { Employee, PersonalAnswers } from "@/lib/types";

const ANSWERS_KEY = "occ_last_personal_answers";

export default function OrderNewPage() {
  const router = useRouter();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [answers, setAnswers] = useState<PersonalAnswers | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = getCurrentEmployeeId();
    const emp = id ? listEmployees().find((e) => e.id === id) ?? null : null;
    setEmployee(emp);

    try {
      const raw = sessionStorage.getItem(ANSWERS_KEY);
      if (raw) setAnswers(JSON.parse(raw) as PersonalAnswers);
    } catch {
      // ignore
    }
  }, []);

  const recommendations: MenuMatch[] = useMemo(
    () => (answers ? matchMenu(answers, 3) : []),
    [answers],
  );

  useEffect(() => {
    if (recommendations.length > 0 && !selectedId) {
      setSelectedId(recommendations[0].item.id);
    }
  }, [recommendations, selectedId]);

  async function handleConfirm() {
    if (!employee || !selectedId) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          employeeId: employee.id,
          menuId: selectedId,
        }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        setError(body.error ?? "注文に失敗しました");
        setSubmitting(false);
        return;
      }
      const { order } = (await res.json()) as { order: { id: string } };
      router.push(`/order/done?orderId=${encodeURIComponent(order.id)}`);
    } catch {
      setError("通信エラーが発生しました");
      setSubmitting(false);
    }
  }

  if (!employee) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md rounded-3xl bg-cream-soft p-8 ring-1 ring-coffee/10">
          <p className="text-sm text-espresso/70">
            社員プロファイルが選ばれていません。最初に社員モードから始めてください。
          </p>
          <Link
            href="/employee"
            className="mt-4 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-cream"
          >
            社員選択へ
          </Link>
        </div>
      </main>
    );
  }

  if (!answers) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md rounded-3xl bg-cream-soft p-8 ring-1 ring-coffee/10">
          <p className="text-sm text-espresso/70">
            診断結果が見つかりません。まずは個人診断を行ってください。
          </p>
          <Link
            href="/diagnose/personal"
            className="mt-4 inline-flex rounded-full bg-espresso px-5 py-2.5 text-sm font-medium text-cream"
          >
            個人診断へ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10 md:py-14">
      <div className="flex w-full max-w-3xl flex-col">
        <Link
          href="/diagnose/personal"
          className="self-start rounded-full px-3 py-1 text-sm text-espresso/50 transition hover:bg-cream-soft"
        >
          ← 診断結果へ戻る
        </Link>

        <div className="mt-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
            Step 3 / Order
          </span>
          <h1 className="font-display mt-2 text-3xl font-bold text-espresso md:text-4xl">
            AIが選んだ一杯を、注文する
          </h1>
          <p className="mt-2 text-sm text-espresso/60">
            {employee.name} さん（{employee.department}）として、診断結果から AI が選んだ Top3 メニューです。
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3">
          {recommendations.map((m, idx) => (
            <RecommendCard
              key={m.item.id}
              rank={idx + 1}
              menu={m}
              selected={selectedId === m.item.id}
              onSelect={() => setSelectedId(m.item.id)}
            />
          ))}
        </div>

        <div className="mt-8 rounded-3xl bg-cream-soft p-6 ring-1 ring-coffee/10">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-espresso/80">
              次の1杯が確定すると…
            </span>
            <span className="text-xs text-coffee-light">
              Powered by Benefit Policy Engine
            </span>
          </div>
          <p className="mt-2 text-xs text-espresso/55">
            選んだメニューを「注文する」と、サーバが累計杯数を確認し、福利厚生ポリシーに基づいて会社負担／自己負担を確定します。
          </p>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-coffee/30 bg-cream-soft p-3 text-center text-sm text-coffee">
            {error}
          </div>
        ) : null}

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            disabled={!selectedId || submitting}
            onClick={handleConfirm}
            className="rounded-full bg-coffee px-8 py-3 text-sm font-medium text-cream transition hover:bg-espresso disabled:bg-coffee/40"
          >
            {submitting ? "注文中..." : "この一杯を注文する"}
          </button>
        </div>

        <IntegrationBadges keys={["policy", "expense"]} />
      </div>
    </main>
  );
}

function RecommendCard({
  rank,
  menu,
  selected,
  onSelect,
}: {
  rank: number;
  menu: MenuMatch;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-2xl border p-5 text-left transition ${
        selected
          ? "border-coffee bg-cream-soft shadow-md"
          : "border-coffee/15 bg-white/40 hover:border-coffee/40"
      }`}
    >
      <div className="flex items-start gap-4">
        <span className="font-display flex size-8 shrink-0 items-center justify-center rounded-full bg-coffee text-sm font-bold text-cream">
          {rank}
        </span>
        <div className="flex-1">
          <div className="flex flex-wrap items-baseline gap-x-3">
            <span className="font-display text-lg font-bold text-espresso">
              {menu.item.name}
            </span>
            <span className="text-sm text-coffee">¥{menu.item.price}</span>
            {menu.score > 0 ? (
              <span className="text-[11px] uppercase tracking-widest text-coffee-light">
                match {menu.score}
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-espresso/70">{menu.item.description}</p>
        </div>
        <span
          className={`mt-1 flex size-5 items-center justify-center rounded-full border ${
            selected ? "border-coffee bg-coffee text-cream" : "border-coffee/30"
          }`}
          aria-hidden
        >
          {selected ? "✓" : ""}
        </span>
      </div>
    </button>
  );
}
