import Link from "next/link";
import { IntegrationBadges } from "@/app/_components/IntegrationBadges";
import { listEmployees } from "@/lib/employees";
import { EmployeeCard } from "./_components/EmployeeCard";

export default function EmployeeSelectPage() {
  const employees = listEmployees();
  const byDepartment = employees.reduce<Record<string, typeof employees>>(
    (acc, e) => {
      (acc[e.department] ??= []).push(e);
      return acc;
    },
    {},
  );

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10 md:py-14">
      <div className="flex w-full max-w-4xl flex-col">
        <Link
          href="/"
          className="self-start rounded-full px-3 py-1 text-sm text-espresso/50 transition hover:bg-cream-soft"
        >
          ← トップへ
        </Link>

        <div className="mt-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
            Step 1 / Employee Login
          </span>
          <h1 className="font-display mt-2 text-3xl font-bold text-espresso md:text-4xl">
            今日は、誰として体験しますか？
          </h1>
          <p className="mt-3 text-sm text-espresso/60">
            架空の社員プロファイルから1名を選んでください。選んだ社員として診断・注文・福利厚生計算を体験できます。
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-8">
          {Object.entries(byDepartment).map(([dept, members]) => (
            <section key={dept}>
              <h2 className="mb-3 px-1 text-sm font-bold text-espresso/70">
                {dept}
              </h2>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {members.map((emp) => (
                  <EmployeeCard key={emp.id} employee={emp} />
                ))}
              </div>
            </section>
          ))}
        </div>

        <IntegrationBadges keys={["hr"]} />
      </div>
    </main>
  );
}
