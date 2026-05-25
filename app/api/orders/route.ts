import type { NextRequest } from "next/server";
import { findEmployee } from "@/lib/employees";
import { findMenu } from "@/lib/menu";
import { calcSplit } from "@/lib/policy";
import {
  countOrdersForEmployeeInPeriod,
  listSessionOrders,
  pushOrder,
} from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function currentMonthKey(): string {
  if (process.env.OCC_DEMO_MONTH) return process.env.OCC_DEMO_MONTH;
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export async function POST(req: NextRequest) {
  let body: { employeeId?: string; menuId?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "invalid json" }, { status: 400 });
  }

  const { employeeId, menuId } = body;
  if (!employeeId || !menuId) {
    return Response.json(
      { error: "employeeId and menuId are required" },
      { status: 400 },
    );
  }

  const employee = findEmployee(employeeId);
  const menu = findMenu(menuId);
  if (!employee) {
    return Response.json({ error: "employee not found" }, { status: 404 });
  }
  if (!menu) {
    return Response.json({ error: "menu not found" }, { status: 404 });
  }

  const monthKey = currentMonthKey();
  const monthCountSoFar = countOrdersForEmployeeInPeriod(
    employeeId,
    monthKey,
  );
  const split = calcSplit(employee.department, monthCountSoFar, menu.price);

  const order = pushOrder({
    employeeId,
    menuId,
    department: employee.department,
    price: menu.price,
    companyPaid: split.companyPaid,
    employeePaid: split.employeePaid,
  });

  return Response.json({ order, split });
}

export async function GET() {
  return Response.json({ orders: listSessionOrders() });
}
