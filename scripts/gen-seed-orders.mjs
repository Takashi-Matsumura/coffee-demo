// Generate data/seed-orders.json with deterministic pseudo-random data.
// Run once: `node scripts/gen-seed-orders.mjs`

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const employees = JSON.parse(
  fs.readFileSync(path.join(root, "data/employees.json"), "utf8"),
);
const menu = JSON.parse(
  fs.readFileSync(path.join(root, "data/menu.json"), "utf8"),
);
const policy = JSON.parse(
  fs.readFileSync(path.join(root, "data/policy.json"), "utf8"),
);

// Deterministic PRNG (mulberry32)
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(20260526);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];

// Hour weights: peak around 9-10, 14-15, smaller bumps at 12 and 16
const HOUR_WEIGHTS = [
  0, 0, 0, 0, 0, 0, 0.2, 0.6, 1.2, 2.2, 2.1, 1.4, 1.6, 1.0, 1.8, 1.7, 1.2, 0.8,
  0.5, 0.3, 0.2, 0.1, 0.1, 0.05,
];
const totalWeight = HOUR_WEIGHTS.reduce((s, v) => s + v, 0);
function pickHour() {
  let r = rng() * totalWeight;
  for (let h = 0; h < HOUR_WEIGHTS.length; h++) {
    r -= HOUR_WEIGHTS[h];
    if (r <= 0) return h;
  }
  return 14;
}

function tierFor(department) {
  return policy.departmentOverrides[department] ?? policy.default;
}

function splitFor(department, monthCountSoFar, price) {
  const tier = tierFor(department);
  const next = monthCountSoFar + 1;
  if (next <= tier.fullCoverageCups) {
    return { companyPaid: price, employeePaid: 0 };
  }
  if (next <= tier.fullCoverageCups + tier.halfCoverageCups) {
    const c = Math.round(price / 2);
    return { companyPaid: c, employeePaid: price - c };
  }
  return { companyPaid: 0, employeePaid: price };
}

// Generate orders for the period.
// Adjust month here: change MONTH constant to match OCC_DEMO_MONTH at runtime.
const PERIOD_YEAR = 2026;
const PERIOD_MONTH = 5; // May
const DAYS_IN_MONTH = new Date(PERIOD_YEAR, PERIOD_MONTH, 0).getDate();
const SKIP_WEEKENDS = true;

// per-employee target cups for the month (give some variance)
function targetForEmployee(e) {
  const base = e.monthlyBenefitCups;
  // 60%~120% of benefit, with department bias
  let factor;
  if (e.department === "営業部") factor = 0.85 + rng() * 0.5;       // heavy
  else if (e.department === "開発部") factor = 0.7 + rng() * 0.6;
  else if (e.department === "カスタマーサクセス") factor = 0.6 + rng() * 0.5;
  else if (e.department === "企画部") factor = 0.55 + rng() * 0.45;
  else factor = 0.4 + rng() * 0.4;                                  // backoffice light
  return Math.max(2, Math.round(base * factor));
}

const orders = [];
let seq = 0;
const monthCounts = new Map();

for (const e of employees) {
  const target = targetForEmployee(e);
  const days = [];
  // pick `target` random days (with replacement) in the month
  for (let i = 0; i < target; i++) {
    let day = 1 + Math.floor(rng() * DAYS_IN_MONTH);
    if (SKIP_WEEKENDS) {
      const dow = new Date(PERIOD_YEAR, PERIOD_MONTH - 1, day).getDay();
      if (dow === 0 || dow === 6) {
        day = 1 + Math.floor(rng() * DAYS_IN_MONTH);
      }
    }
    days.push(day);
  }
  days.sort((a, b) => a - b);

  for (const day of days) {
    const hour = pickHour();
    const minute = Math.floor(rng() * 60);
    const date = new Date(
      Date.UTC(PERIOD_YEAR, PERIOD_MONTH - 1, day, hour - 9, minute),
    );
    // JST offset baked into createdAt string
    const createdAt =
      `${PERIOD_YEAR}-${String(PERIOD_MONTH).padStart(2, "0")}-${String(day).padStart(2, "0")}T` +
      `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}:00+09:00`;

    // pick menu with a small bias per department
    const candidates = (() => {
      if (e.department === "営業部")
        return menu.filter((m) => ["drip", "espresso"].includes(m.category));
      if (e.department === "開発部")
        return menu.filter((m) => ["drip", "cold", "espresso"].includes(m.category));
      if (e.department === "企画部")
        return menu.filter((m) => ["milk", "sweet", "drip"].includes(m.category));
      if (e.department === "カスタマーサクセス")
        return menu.filter((m) => ["milk", "drip"].includes(m.category));
      return menu;
    })();
    const m = pick(candidates);

    const so = monthCounts.get(e.id) ?? 0;
    const split = splitFor(e.department, so, m.price);
    monthCounts.set(e.id, so + 1);
    seq += 1;

    orders.push({
      id: `ord_seed_${String(seq).padStart(4, "0")}`,
      employeeId: e.id,
      menuId: m.id,
      department: e.department,
      price: m.price,
      companyPaid: split.companyPaid,
      employeePaid: split.employeePaid,
      createdAt,
      source: "seed",
      _ts: date.getTime(),
    });
  }
}

orders.sort((a, b) => a._ts - b._ts);
for (const o of orders) delete o._ts;

const out = path.join(root, "data/seed-orders.json");
fs.writeFileSync(out, JSON.stringify(orders, null, 2) + "\n", "utf8");
console.log(`Wrote ${orders.length} seed orders to ${out}`);
