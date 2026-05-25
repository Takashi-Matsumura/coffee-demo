"use client";

import { useRouter } from "next/navigation";
import type { Employee } from "@/lib/types";
import { setCurrentEmployeeId } from "@/lib/employee-session";

export function EmployeeCard({ employee }: { employee: Employee }) {
  const router = useRouter();

  function handleSelect() {
    setCurrentEmployeeId(employee.id);
    router.push(`/employee/${employee.id}`);
  }

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="group flex items-center gap-4 rounded-2xl border border-coffee/15 bg-cream-soft p-4 text-left transition hover:-translate-y-0.5 hover:border-coffee/40 hover:shadow-lg"
    >
      <span
        className="flex size-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-cream"
        style={{
          background: `hsl(${employee.avatarHue}, 55%, 38%)`,
        }}
        aria-hidden
      >
        {employee.name.slice(0, 1)}
      </span>
      <span className="flex-1">
        <span className="block font-display text-base font-bold text-espresso">
          {employee.name}
        </span>
        <span className="block text-xs text-espresso/60">
          {employee.department} ・ {employee.role}
        </span>
        <span className="mt-1 block text-[11px] text-coffee">
          月{employee.monthlyBenefitCups}杯まで福利厚生
        </span>
      </span>
      <span
        aria-hidden
        className="text-coffee/40 transition group-hover:text-coffee"
      >
        →
      </span>
    </button>
  );
}
