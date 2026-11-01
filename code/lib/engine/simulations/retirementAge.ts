import { hasLogismataCredentials } from "../env";
import { leaRetirementByAge } from "../fixtures";
import { logismataCall, toLogismataPerson } from "../logismata/client";
import { createTrace } from "../traces";
import type { Household, RetirementAgeSimulation } from "../types";

const DEFAULT_AGES = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70];

export async function simulateRetirementAge(
  household: Household,
  personIndex: number,
  ages: number[] = DEFAULT_AGES,
): Promise<RetirementAgeSimulation> {
  const person = household.persons[personIndex];
  if (!person) throw new Error(`No person at index ${personIndex}`);

  if (hasLogismataCredentials()) {
    const steps = await Promise.all(
      ages.map(async (age) => {
        const body = {
          Persons: household.persons.map((p, i) =>
            toLogismataPerson(
              i === personIndex ? { ...p, retirementAge: age } : p,
            ),
          ),
          Children: household.children.map((c) => ({ BirthYear: c.birthYear })),
          Relationship: household.relationship,
          Needs: { RetirementPc: household.needs.retirementPc },
          CurrentFortune: household.assets ?? 0,
        };
        const data = await logismataCall<{
          IncomePillar1?: number;
          IncomePillar2?: number;
          IncomeGap?: number;
          CapitalNeeded?: number;
        }>("calculateRetirement", body);
        return buildStep(
          age,
          data.IncomePillar1 ?? 0,
          data.IncomePillar2 ?? 0,
          data.IncomeGap ?? 0,
          data.CapitalNeeded ?? 0,
          household.needs.retirementPc,
        );
      }),
    );
    return { personIndex, steps };
  }

  const steps = ages.map((age) => {
    const row = leaRetirementByAge[age] ?? leaRetirementByAge[65]!;
    const p1 = personIndex === 0 ? row.p1 : row.p2;
    const p2 = personIndex === 0 ? row.p2 : row.p1;
    return buildStep(
      age,
      p1,
      p2,
      row.gap,
      row.capital,
      household.needs.retirementPc,
    );
  });

  return { personIndex, steps };
}

function buildStep(
  age: number,
  incomePillar1Yr: number,
  incomePillar2Yr: number,
  incomeGapYr: number,
  capitalNeeded: number,
  retirementPc: number,
) {
  const total = incomePillar1Yr + incomePillar2Yr;
  const trace = createTrace({
    label: `Income at retirement age ${age}`,
    value: total,
    unit: "CHF/yr",
    operation: "calculateRetirement",
    responseField: "IncomePillar1+IncomePillar2",
    inputs: {
      DesiredRetirementAge: age,
      IncomePillar1: incomePillar1Yr,
      IncomePillar2: incomePillar2Yr,
      IncomeGap: incomeGapYr,
    },
    assumptions: [`Retirement need ${retirementPc}% of income`],
    sources: ["estimate"],
    explanation:
      incomeGapYr > 0
        ? `At ${age}, about CHF ${fmt(incomeGapYr)} a year would still be missing.`
        : `At ${age}, retirement income covers the need.`,
  });

  return {
    age,
    incomePillar1Yr,
    incomePillar2Yr,
    incomeGapYr,
    capitalNeeded,
    traceId: trace.id,
  };
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("de-CH").replace(/,/g, "'");
}
