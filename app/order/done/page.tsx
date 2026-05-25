import Link from "next/link";
import { notFound } from "next/navigation";
import { IntegrationBadges } from "@/app/_components/IntegrationBadges";
import { findEmployee } from "@/lib/employees";
import { findMenu } from "@/lib/menu";
import { findSessionOrder } from "@/lib/orders";
import { getTier } from "@/lib/policy";
import { OrderIntegrations } from "./OrderIntegrations";

export default async function OrderDonePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string }>;
}) {
  const { orderId } = await searchParams;
  if (!orderId) return notFound();

  const order = findSessionOrder(orderId);
  if (!order) {
    return (
      <main className="flex flex-1 items-center justify-center px-6 py-16 text-center">
        <div className="max-w-md rounded-3xl bg-cream-soft p-8 ring-1 ring-coffee/10">
          <p className="text-sm text-espresso/70">
            この注文は表示できません（サーバが再起動するとセッション内の注文は消えます）。
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

  const employee = findEmployee(order.employeeId);
  const menu = findMenu(order.menuId);
  const tier = employee ? getTier(employee.department) : null;

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-10 md:py-14">
      <div className="flex w-full max-w-2xl flex-col">
        <Link
          href="/"
          className="self-start rounded-full px-3 py-1 text-sm text-espresso/50 transition hover:bg-cream-soft"
        >
          ← トップへ
        </Link>

        <div className="mt-6 text-center">
          <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-coffee-light">
            Order Completed
          </span>
          <h1 className="font-display mt-2 text-3xl font-bold text-espresso md:text-4xl">
            注文が確定しました
          </h1>
          <p className="mt-2 text-sm text-espresso/60">
            福利厚生ポリシーに基づいて、会社負担と自己負担が確定しました。
          </p>
        </div>

        <article className="mt-8 overflow-hidden rounded-3xl bg-cream-soft shadow-lg ring-1 ring-coffee/10">
          <div className="border-b border-coffee/10 p-6">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-coffee-light">
                  Order ID
                </div>
                <div className="font-display text-base font-bold text-espresso">
                  {order.id}
                </div>
              </div>
              <div className="text-right text-xs text-espresso/55">
                {new Date(order.createdAt).toLocaleString("ja-JP")}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-coffee-light">
                注文者
              </div>
              <div className="font-display mt-1 text-lg font-bold text-espresso">
                {employee?.name ?? order.employeeId}
              </div>
              <div className="text-sm text-espresso/60">
                {order.department}
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-widest text-coffee-light">
                メニュー
              </div>
              <div className="font-display mt-1 text-lg font-bold text-espresso">
                {menu?.name ?? order.menuId}
              </div>
              <div className="text-sm text-espresso/60">¥{order.price}</div>
            </div>
          </div>

          <div className="border-t border-coffee/10 bg-white/40 p-6">
            <div className="grid grid-cols-2 gap-4">
              <PriceCell label="会社負担" value={`¥${order.companyPaid}`} tone="primary" />
              <PriceCell label="自己負担" value={`¥${order.employeePaid}`} tone="muted" />
            </div>
            {tier ? (
              <p className="mt-4 text-xs text-espresso/55">
                {employee?.department} の福利厚生上限：全額補助 月 {tier.fullCoverageCups} 杯 / 半額補助 +{tier.halfCoverageCups} 杯
              </p>
            ) : null}
          </div>
        </article>

        <div className="mt-6">
          <OrderIntegrations orderId={order.id} />
        </div>

        <div className="mt-8 flex flex-col items-center gap-3 md:flex-row md:justify-center">
          <Link
            href="/diagnose/personal"
            className="rounded-full bg-espresso px-6 py-3 text-sm font-medium text-cream transition hover:bg-coffee"
          >
            もう一杯、診断する
          </Link>
          <Link
            href="/admin"
            className="rounded-full border border-coffee/30 px-6 py-3 text-sm font-medium text-espresso transition hover:bg-cream-soft"
          >
            総務ダッシュボードを見る →
          </Link>
        </div>

        <IntegrationBadges keys={["expense", "slack"]} />
      </div>
    </main>
  );
}

function PriceCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "primary" | "muted";
}) {
  return (
    <div
      className={`rounded-2xl p-4 ring-1 ${
        tone === "primary"
          ? "bg-coffee text-cream ring-coffee/40"
          : "bg-cream-soft ring-coffee/15"
      }`}
    >
      <div
        className={`text-[11px] uppercase tracking-[0.2em] ${
          tone === "primary" ? "text-cream/70" : "text-coffee-light"
        }`}
      >
        {label}
      </div>
      <div
        className={`font-display mt-1 text-2xl font-bold ${
          tone === "primary" ? "text-cream" : "text-espresso"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
