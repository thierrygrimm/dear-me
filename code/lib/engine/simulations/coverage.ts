import { hasLogismataCredentials } from "../env";
import { leaRiskScenarios } from "../fixtures";
import { logismataCall, toLogismataPerson } from "../logismata/client";
import { createTrace } from "../traces";
import type { CoverageSimulation, Household, RiskScenario } from "../types";

const LABELS: Record<number, string> = {
  1: "Partner 1 disabled by illness",
  2: "Partner 1 disabled by accident",
  3: "Partner 1 dies of illness",
  4: "Partner 1 dies in an accident",
  5: "Partner 2 disabled by illness",
  6: "Partner 2 disabled by accident",
  7: "Partner 2 dies of illness",
  8: "Partner 2 dies in an accident",
};

const KINDS: RiskScenario["kind"][] = [
  "disability-illness",
  "disability-accident",
  "death-illness",
  "death-accident",
  "disability-illness",
  "disability-accident",
  "death-illness",
  "death-accident",
];

export async function simulateCoverage(
  household: Household,
): Promise<CoverageSimulation> {
  if (hasLogismataCredentials()) {
    return fromLive(household);
  }
  return fromFixtures(household);
}

async function fromLive(household: Household): Promise<CoverageSimulation> {
  const body = {
    Persons: household.persons.map((p) => toLogismataPerson(p)),
    Children: household.children.map((c) => ({ BirthYear: c.birthYear })),
    Relationship: household.relationship,
    Needs: {
      DisabilityPc: household.needs.disabilityPc,
      DeathPc: household.needs.deathPc,
    },
    CurrentFortune: household.assets ?? 0,
  };

  const data = await logismataCall<{
    Scenarios?: {
      Id?: number;
      IncomeNeed?: number;
      IncomeTotal?: number;
      IncomeGap?: number;
      CapitalGap?: number;
    }[];
  }>("calculateRisk", body);

  const scenarios = (data.Scenarios ?? []).map((s, idx) => {
    const id = s.Id ?? idx + 1;
    const incomeNeedYr = s.IncomeNeed ?? 0;
    const incomeTotalYr = s.IncomeTotal ?? 0;
    const incomeGapYr = s.IncomeGap ?? Math.max(0, incomeNeedYr - incomeTotalYr);
    const capitalGap = s.CapitalGap ?? 0;
    return toScenario(id, incomeNeedYr, incomeTotalYr, incomeGapYr, capitalGap, household);
  });

  return { scenarios };
}

function fromFixtures(household: Household): CoverageSimulation {
  const scenarios = leaRiskScenarios.map((s) =>
    toScenario(
      s.id,
      s.incomeNeedYr,
      s.incomeTotalYr,
      Math.max(0, s.incomeNeedYr - s.incomeTotalYr),
      s.capitalGap,
      household,
      s.label,
      s.kind,
      s.personIndex,
    ),
  );
  return { scenarios };
}

function toScenario(
  id: number,
  incomeNeedYr: number,
  incomeTotalYr: number,
  incomeGapYr: number,
  capitalGap: number,
  household: Household,
  label = LABELS[id] ?? `Scenario ${id}`,
  kind = KINDS[id - 1] ?? "disability-illness",
  personIndex: 0 | 1 = id <= 4 ? 0 : 1,
): RiskScenario {
  const incomeNeedMo = Math.round(incomeNeedYr / 12);
  const incomeTotalMo = Math.round(incomeTotalYr / 12);
  const incomeGapMo = Math.round(incomeGapYr / 12);

  const trace = createTrace({
    label: `${label} — monthly gap`,
    value: incomeGapMo,
    unit: "CHF/mo",
    operation: "calculateRisk",
    responseField: `Scenario${id}.IncomeGap`,
    inputs: {
      IncomeNeed: incomeNeedYr,
      IncomeTotal: incomeTotalYr,
      DisabilityNeedPc: household.needs.disabilityPc,
      DeathNeedPc: household.needs.deathPc,
    },
    derivation: `(${fmt(incomeNeedYr)} - ${fmt(incomeTotalYr)}) / 12`,
    assumptions: [
      `Disability need ${household.needs.disabilityPc}% of income`,
      `Death need ${household.needs.deathPc}% of income`,
    ],
    sources: ["user"],
    explanation:
      incomeGapMo === 0
        ? `${label}: cover meets the need.`
        : `${label}: about CHF ${fmt(incomeGapMo)} a month would be missing.`,
  });

  return {
    id,
    label,
    personIndex,
    kind,
    incomeNeedMo,
    incomeTotalMo,
    incomeGapMo,
    capitalGap,
    traceId: trace.id,
  };
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("de-CH").replace(/,/g, "'");
}
