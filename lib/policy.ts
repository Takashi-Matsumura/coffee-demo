import policyData from "@/data/policy.json";
import type { Policy, PolicyTier, SplitResult } from "./types";

const policy = policyData as Policy;

export function getPolicy(): Policy {
  return policy;
}

export function getTier(department: string): PolicyTier {
  return policy.departmentOverrides[department] ?? policy.default;
}

/**
 * Compute company/employee split for the *next* cup, given how many cups
 * the employee has already consumed this month.
 *
 *  - cups 1..fullCoverageCups          → company pays 100%
 *  - next halfCoverageCups             → company pays 50%
 *  - beyond                            → employee pays 100%
 */
export function calcSplit(
  department: string,
  monthCountSoFar: number,
  price: number,
): SplitResult {
  const tier = getTier(department);
  const nextCupIndex = monthCountSoFar + 1; // 1-based
  let companyPaid = 0;
  let employeePaid = price;
  let coverage: SplitResult["coverage"] = "self";

  if (nextCupIndex <= tier.fullCoverageCups) {
    companyPaid = price;
    employeePaid = 0;
    coverage = "full";
  } else if (
    nextCupIndex <=
    tier.fullCoverageCups + tier.halfCoverageCups
  ) {
    companyPaid = Math.round(price / 2);
    employeePaid = price - companyPaid;
    coverage = "half";
  }

  const remainingFullCoverage = Math.max(
    tier.fullCoverageCups - monthCountSoFar,
    0,
  );
  const remainingHalfCoverage = Math.max(
    tier.fullCoverageCups + tier.halfCoverageCups - monthCountSoFar -
      Math.max(tier.fullCoverageCups - monthCountSoFar, 0),
    0,
  );

  return {
    companyPaid,
    employeePaid,
    coverage,
    monthCountSoFar,
    policy: tier,
    remainingFullCoverage,
    remainingHalfCoverage,
  };
}
