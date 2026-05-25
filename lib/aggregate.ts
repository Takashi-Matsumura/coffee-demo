import seedOrders from "@/data/seed-orders.json";
import { findMenu } from "./menu";
import { listSessionOrders } from "./orders";
import { getTier } from "./policy";
import type { AdminSummary, Order } from "./types";

const seed = seedOrders as Order[];

export function currentMonthKey(): string {
  if (process.env.OCC_DEMO_MONTH) return process.env.OCC_DEMO_MONTH;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function listAllOrders(): Order[] {
  return [...seed, ...listSessionOrders()];
}

export function buildSummary(monthKey: string = currentMonthKey()): AdminSummary {
  const inMonth = listAllOrders().filter((o) => o.createdAt.startsWith(monthKey));
  const totalCups = inMonth.length;
  const totalCompanyCost = inMonth.reduce((s, o) => s + o.companyPaid, 0);
  const totalEmployeeCost = inMonth.reduce((s, o) => s + o.employeePaid, 0);
  const avgUnitPrice = totalCups
    ? Math.round((totalCompanyCost + totalEmployeeCost) / totalCups)
    : 0;

  // departments
  const deptCount = new Map<string, number>();
  for (const o of inMonth) {
    deptCount.set(o.department, (deptCount.get(o.department) ?? 0) + 1);
  }
  const topDepartments = Array.from(deptCount.entries())
    .map(([name, cups]) => ({
      name,
      cups,
      share: totalCups ? cups / totalCups : 0,
    }))
    .sort((a, b) => b.cups - a.cups);

  // menus
  const menuCount = new Map<string, number>();
  for (const o of inMonth) {
    menuCount.set(o.menuId, (menuCount.get(o.menuId) ?? 0) + 1);
  }
  const topMenus = Array.from(menuCount.entries())
    .map(([id, cups]) => ({
      id,
      name: findMenu(id)?.name ?? id,
      cups,
    }))
    .sort((a, b) => b.cups - a.cups)
    .slice(0, 5);

  // hourly distribution (24 buckets, by createdAt JST hour)
  const hourly = new Array(24).fill(0);
  for (const o of inMonth) {
    const hour = Number(o.createdAt.slice(11, 13));
    if (!Number.isNaN(hour)) hourly[hour] += 1;
  }
  const peakHours = [...hourly.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .filter(([, v]) => v > 0)
    .map(([h]) => h);

  // overBudget employees: those whose monthly cups exceed full+half coverage
  const cupsByEmp = new Map<string, { dept: string; cups: number }>();
  for (const o of inMonth) {
    const entry = cupsByEmp.get(o.employeeId) ?? {
      dept: o.department,
      cups: 0,
    };
    entry.cups += 1;
    cupsByEmp.set(o.employeeId, entry);
  }
  let overBudgetEmployees = 0;
  for (const { dept, cups } of cupsByEmp.values()) {
    const tier = getTier(dept);
    if (cups > tier.fullCoverageCups + tier.halfCoverageCups) {
      overBudgetEmployees += 1;
    }
  }

  return {
    period: monthKey,
    totalCups,
    totalCompanyCost,
    totalEmployeeCost,
    avgUnitPrice,
    topDepartments,
    topMenus,
    hourly,
    peakHours,
    overBudgetEmployees,
  };
}
