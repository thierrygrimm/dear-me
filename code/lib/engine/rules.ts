import type {
  CoverageSimulation,
  Household,
  Suggestion,
  Tax3aResult,
  WorkloadSimulation,
} from "./types";

export const RULES_VERSION = "1";

type RuleContext = {
  household: Household;
  workload?: WorkloadSimulation;
  coverage?: CoverageSimulation;
  tax3a?: Tax3aResult;
  askedForPerson?: boolean;
};

function roundUp(n: number, step: number): number {
  return Math.ceil(n / step) * step;
}

/** Product, "you don't need this", and handover suggestions from versioned rules. */
export function evaluateRules(ctx: RuleContext): Suggestion[] {
  const out: Suggestion[] = [];
  const { household, coverage, workload, tax3a, askedForPerson } = ctx;
  const depends =
    household.relationship !== "single" || household.children.length > 0;
  const person = household.persons[1] ?? household.persons[0]!;
  const age = new Date().getFullYear() - person.birthYear;
  const estimateShare = estimateRatio(household);

  // N1 — no death cover
  if (!depends) {
    out.push({
      ruleId: "N1",
      kind: "not-needed",
      title: "No death cover needed",
      body: "Nobody depends on your income right now.",
      traceIds: [],
    });
  }

  if (coverage) {
    const deathIllness = coverage.scenarios.find(
      (s) => s.kind === "death-illness" && s.incomeGapMo > 0,
    );
    const disabilityIllness = coverage.scenarios.find(
      (s) => s.kind === "disability-illness" && s.incomeGapMo > 0,
    );
    const accidentOk = coverage.scenarios
      .filter((s) => s.kind.includes("accident"))
      .every((s) => s.incomeGapMo === 0);

    // P1
    if (deathIllness && depends) {
      const lump = roundUp(deathIllness.capitalGap, 10_000);
      out.push({
        ruleId: "P1",
        kind: "product",
        title: "Risk cover for death",
        body: "Illness would leave a gap for people who depend on you.",
        amount: lump,
        amountUnit: "CHF",
        productHint: "Pax risk cover for death (3b)",
        traceIds: [deathIllness.traceId],
      });
      if (lump > 200_000) {
        out.push(handover("H2", "Suggested death cover exceeds CHF 200,000.", [
          deathIllness.traceId,
        ]));
      }
    }

    // P2
    if (disabilityIllness) {
      const annual = roundUp(disabilityIllness.incomeGapMo * 12, 1_000);
      out.push({
        ruleId: "P2",
        kind: "product",
        title: "Disability cover",
        body: "After day 720, illness would still leave a monthly gap.",
        amount: annual,
        amountUnit: "CHF/yr",
        productHint: "Pax disability cover (3b), 24-month waiting period",
        traceIds: [disabilityIllness.traceId],
      });
      if (annual > 200_000) {
        out.push(
          handover("H2", "Suggested disability cover exceeds CHF 200,000.", [
            disabilityIllness.traceId,
          ]),
        );
      }
    }

    // N3
    if (accidentOk) {
      out.push({
        ruleId: "N3",
        kind: "not-needed",
        title: "Accident is already covered",
        body: "Your employer's insurance covers accident scenarios.",
        traceIds: coverage.scenarios
          .filter((s) => s.kind.includes("accident"))
          .map((s) => s.traceId),
      });
    }
  }

  if (workload) {
    const at60 = workload.steps.find((s) => s.workloadPc === 60);
    const belowFull = workload.steps.some(
      (s) => s.workloadPc < 100 && s.monthlyDiff > 0,
    );
    if (belowFull && at60) {
      const monthly = Math.min(
        at60.monthlyDiff,
        Math.round((tax3a?.maxContribution ?? 7258) / 12),
      );
      out.push({
        ruleId: "P4",
        kind: "product",
        title: "3a top-up while you work less",
        body: "A monthly 3a amount that softens the pension drop, capped at the legal limit.",
        amount: monthly,
        amountUnit: "CHF/mo",
        productHint: "3a with FondsStar or LifeStar",
        traceIds: [at60.traces.monthlyDiff],
      });
    }
  }

  if (tax3a && tax3a.taxSaved > 0) {
    out.push({
      ruleId: "T1",
      kind: "product",
      title: "3a for tax this year",
      body: "Room left in this year's 3a maximum.",
      amount: tax3a.maxContribution,
      amountUnit: "CHF",
      productHint: "Pillar 3a",
      traceIds: [tax3a.traceId],
    });
  }

  // Handovers
  if (out.some((s) => /FondsStar|fund/i.test(s.productHint ?? ""))) {
    out.push(
      handover(
        "H1",
        "A fund-based product needs a suitability check with a person.",
        out.flatMap((s) => s.traceIds),
      ),
    );
  }
  if (age >= 55) {
    out.push(handover("H3", "Age 55 or older — a person should review.", []));
  }
  if (estimateShare > 0.5) {
    out.push(
      handover(
        "H4",
        "More than half the inputs are still estimates.",
        [],
      ),
    );
  }
  if (askedForPerson) {
    out.push(handover("H5", "You asked to talk to a person.", []));
  }

  return dedupe(out);
}

function handover(
  ruleId: string,
  body: string,
  traceIds: string[],
): Suggestion {
  return {
    ruleId,
    kind: "handover",
    title: "Talk it through with someone",
    body,
    traceIds,
  };
}

function estimateRatio(household: Household): number {
  let total = 0;
  let estimates = 0;
  for (const person of household.persons) {
    for (const src of Object.values(person.source)) {
      total += 1;
      if (src === "estimate") estimates += 1;
    }
  }
  return total === 0 ? 1 : estimates / total;
}

function dedupe(items: Suggestion[]): Suggestion[] {
  const seen = new Set<string>();
  return items.filter((s) => {
    const key = `${s.ruleId}:${s.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
