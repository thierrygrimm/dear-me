import { hasLogismataCredentials } from "../env";
import {
  leaDisabilityCoverYr,
  leaWorkloadPensionsYr,
} from "../fixtures";
import { grossIncome } from "../household";
import { logismataCall, toLogismataPerson } from "../logismata/client";
import { createTrace } from "../traces";
import type { Household, WorkloadSimulation } from "../types";

const DEFAULT_STEPS = [100, 90, 80, 70, 60, 50, 40];
const RETIREMENT_YEARS = 20;

export async function simulateWorkload(
  household: Household,
  personIndex: number,
  steps: number[] = DEFAULT_STEPS,
): Promise<WorkloadSimulation> {
  const person = household.persons[personIndex];
  if (!person) {
    throw new Error(`No person at index ${personIndex}`);
  }

  const ordered = [...steps].sort((a, b) => b - a);
  const pensions = hasLogismataCredentials()
    ? await fetchLivePensions(household, personIndex, ordered)
    : ordered.map((pc) => leaWorkloadPensionsYr[pc] ?? estimatePension(person.fullTimeIncome, pc));

  const disability = ordered.map(
    (pc) => leaDisabilityCoverYr[pc] ?? Math.round(pensions[ordered.indexOf(pc)]! * 1.6),
  );

  const baseline = pensions[ordered.indexOf(100)] ?? pensions[0]!;

  const resultSteps = ordered.map((workloadPc, i) => {
    const pillar2PensionYr = pensions[i]!;
    const salaryDropPc = Number((1 - workloadPc / 100).toFixed(4));
    const pensionDropPc =
      baseline > 0
        ? Number((1 - pillar2PensionYr / baseline).toFixed(4))
        : 0;
    const monthlyDiff = Math.round((baseline - pillar2PensionYr) / 12);
    const overRetirement = monthlyDiff * 12 * RETIREMENT_YEARS;
    const income = grossIncome(person, workloadPc);

    const pensionTrace = createTrace({
      label: `Your pension fund pension at ${workloadPc}%`,
      value: pillar2PensionYr,
      unit: "CHF/yr",
      operation: "calculateRetirementBase",
      responseField: `Person${personIndex + 1}.Pension`,
      inputs: {
        GrossIncome: income,
        WorkloadPc: workloadPc,
        FullTimeIncome: person.fullTimeIncome,
      },
      derivation:
        workloadPc === 100
          ? undefined
          : `(${fmt(baseline)} - ${fmt(pillar2PensionYr)})`,
      assumptions: [
        "Need 80% of income at retirement unless you change it",
        person.source.pillar2 === "document"
          ? "Pension fund from your statement"
          : "Pension fund estimated from salary",
        "Calculated with Pax's pension engine",
      ],
      sources: [person.source.fullTimeIncome ?? "estimate"],
      explanation:
        workloadPc === 100
          ? `At full time your pension fund would pay about CHF ${fmt(pillar2PensionYr)} a year.`
          : `At ${workloadPc}% the coordination deduction cuts the insured salary harder, so the fund pension falls to about CHF ${fmt(pillar2PensionYr)} a year.`,
    });

    const diffTrace = createTrace({
      label: `Monthly difference at ${workloadPc}% vs 100%`,
      value: monthlyDiff,
      unit: "CHF/mo",
      operation: "calculateRetirementBase",
      responseField: `Person${personIndex + 1}.Pension`,
      inputs: {
        PensionAt100: baseline,
        PensionAtStep: pillar2PensionYr,
      },
      derivation: `(${fmt(baseline)} - ${fmt(pillar2PensionYr)}) / 12`,
      assumptions: [
        `Undiscounted over ${RETIREMENT_YEARS} retirement years for the long view`,
      ],
      sources: [person.source.fullTimeIncome ?? "estimate"],
      explanation:
        monthlyDiff === 0
          ? "No monthly difference at full time."
          : `About CHF ${fmt(monthlyDiff)} less a month later on, for life.`,
    });

    return {
      workloadPc,
      grossIncome: income,
      pillar2PensionYr,
      salaryDropPc,
      pensionDropPc,
      monthlyDiff,
      overRetirement,
      disabilityCoverYr: disability[i],
      traces: {
        pillar2Pension: pensionTrace.id,
        monthlyDiff: diffTrace.id,
      },
    };
  });

  return {
    personIndex,
    steps: resultSteps,
    baselinePensionYr: baseline,
  };
}

async function fetchLivePensions(
  household: Household,
  personIndex: number,
  steps: number[],
): Promise<number[]> {
  const results = await Promise.all(
    steps.map(async (pc) => {
      const body = {
        Persons: household.persons.map((p, i) =>
          toLogismataPerson(p, i === personIndex ? pc : undefined),
        ),
        Children: household.children.map((c) => ({ BirthYear: c.birthYear })),
        Relationship: household.relationship,
        CurrentFortune: household.assets ?? 0,
      };
      const data = await logismataCall<{
        Persons?: { Pension?: number }[];
      }>("calculateRetirementBase", body);
      const pension = data.Persons?.[personIndex]?.Pension;
      if (typeof pension !== "number") {
        throw new Error("calculateRetirementBase returned no pension");
      }
      return pension;
    }),
  );
  return results;
}

function estimatePension(fullTimeIncome: number, workloadPc: number): number {
  const coordination = 25_725;
  const insured = Math.max(0, (fullTimeIncome * workloadPc) / 100 - coordination);
  return Math.round(insured * 0.45);
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("de-CH").replace(/,/g, "'");
}
