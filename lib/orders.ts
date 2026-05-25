import type { Order } from "./types";

type StoreShape = { orders: Order[] };

// Use globalThis so the store survives Next.js dev HMR re-evaluation.
const g = globalThis as unknown as { __occOrderStore?: StoreShape };
if (!g.__occOrderStore) {
  g.__occOrderStore = { orders: [] };
}
const store = g.__occOrderStore;

let seq = 0;

function nextId(): string {
  seq += 1;
  return `ord_sess_${Date.now()}_${seq}`;
}

function jstIsoString(now = new Date()): string {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  return jst.toISOString().replace("Z", "+09:00");
}

export function pushOrder(
  partial: Omit<Order, "id" | "source" | "createdAt"> &
    Partial<Pick<Order, "id" | "source" | "createdAt">>,
): Order {
  const order: Order = {
    id: partial.id ?? nextId(),
    source: partial.source ?? "session",
    createdAt: partial.createdAt ?? jstIsoString(),
    employeeId: partial.employeeId,
    menuId: partial.menuId,
    department: partial.department,
    price: partial.price,
    companyPaid: partial.companyPaid,
    employeePaid: partial.employeePaid,
  };
  store.orders.push(order);
  return order;
}

export function listSessionOrders(): Order[] {
  return store.orders;
}

export function findSessionOrder(id: string): Order | undefined {
  return store.orders.find((o) => o.id === id);
}

export function countOrdersForEmployeeInPeriod(
  employeeId: string,
  monthKey: string,
): number {
  return store.orders.filter(
    (o) => o.employeeId === employeeId && o.createdAt.startsWith(monthKey),
  ).length;
}
