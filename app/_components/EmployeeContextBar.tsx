"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  clearCurrentEmployeeId,
  getCurrentEmployeeId,
} from "@/lib/employee-session";
import { findEmployee } from "@/lib/employees";

const SHOW_ON = [
  /^\/employee/,
  /^\/diagnose\/personal/,
  /^\/order/,
];

export function EmployeeContextBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [employeeId, setEmployeeId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setEmployeeId(getCurrentEmployeeId());
  }, [pathname]);

  if (!mounted) return null;
  if (!employeeId) return null;
  if (!SHOW_ON.some((re) => re.test(pathname))) return null;

  const emp = findEmployee(employeeId);
  if (!emp) return null;

  function handleSwitch() {
    clearCurrentEmployeeId();
    setEmployeeId(null);
    router.push("/employee");
  }

  return (
    <div className="sticky top-0 z-30 w-full border-b border-coffee/10 bg-cream-soft/90 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-espresso/80">
          <span
            className="flex size-6 items-center justify-center rounded-full text-[10px] font-bold text-cream"
            style={{ background: `hsl(${emp.avatarHue}, 55%, 38%)` }}
            aria-hidden
          >
            {emp.name.slice(0, 1)}
          </span>
          <span>
            <span className="font-bold text-espresso">{emp.name}</span>
            <span className="ml-2 text-espresso/55">
              {emp.department} ・ {emp.role}
            </span>
          </span>
        </div>
        <button
          type="button"
          onClick={handleSwitch}
          className="rounded-full border border-coffee/30 px-3 py-1 text-[11px] text-espresso transition hover:bg-cream"
        >
          ゲストを切替
        </button>
      </div>
    </div>
  );
}
