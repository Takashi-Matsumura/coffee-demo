export type PersonalAnswers = {
  mood: string;
  scene: string;
  taste: string;
};

export type TeamAnswers = {
  size: string;
  style: string;
  meetings: string;
};

export type DepartmentAnswers = {
  department: string;
  size: string;
  style: string;
};

export type MeetingAnswers = {
  meetingType: string;
  attendees: string;
  timing: string;
};

export type DiagnoseMode = "personal" | "team" | "department" | "meeting";

export type DiagnoseRequest =
  | { mode: "personal"; answers: PersonalAnswers }
  | { mode: "team"; answers: TeamAnswers }
  | { mode: "department"; answers: DepartmentAnswers }
  | { mode: "meeting"; answers: MeetingAnswers };

// --- Welfare / office workflow ---

export type Employee = {
  id: string;
  name: string;
  department: string;
  role: string;
  monthlyBenefitCups: number;
  avatarHue: number;
};

export type MenuCategory =
  | "drip"
  | "espresso"
  | "milk"
  | "cold"
  | "sweet";

export type MenuItem = {
  id: string;
  name: string;
  category: MenuCategory;
  price: number;
  profile: {
    taste: string[];
    scene: string[];
    mood: string[];
  };
  description: string;
};

export type PolicyTier = {
  fullCoverageCups: number;
  halfCoverageCups: number;
};

export type Policy = {
  policyName: string;
  default: PolicyTier;
  departmentOverrides: Record<string, PolicyTier>;
};

export type OrderSource = "seed" | "session";

export type Order = {
  id: string;
  employeeId: string;
  menuId: string;
  department: string;
  price: number;
  companyPaid: number;
  employeePaid: number;
  createdAt: string; // ISO 8601
  source: OrderSource;
};

export type SplitResult = {
  companyPaid: number;
  employeePaid: number;
  coverage: "full" | "half" | "self";
  monthCountSoFar: number;
  policy: PolicyTier;
  remainingFullCoverage: number;
  remainingHalfCoverage: number;
};

export type AdminSummary = {
  period: string; // e.g. "2026-05"
  totalCups: number;
  totalCompanyCost: number;
  totalEmployeeCost: number;
  avgUnitPrice: number;
  topDepartments: { name: string; cups: number; share: number }[];
  topMenus: { id: string; name: string; cups: number }[];
  hourly: number[]; // length 24
  peakHours: number[];
  overBudgetEmployees: number;
};

export type IntegrationKey =
  | "hr"
  | "policy"
  | "expense"
  | "slack"
  | "bi";
