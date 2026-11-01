import { hasLogismataCredentials } from "../env";
import { leaTax3a } from "../fixtures";
import { grossIncome } from "../household";
import { logismataCall, toLogismataPerson } from "../logismata/client";
import { createTrace } from "../traces";
import type { Household, Tax3aResult } from "../types";

export async function simulateTax3a(
  household: Household,
  personIndex: number,
): Promise<Tax3aResult> {
  const person = household.persons[personIndex];
  if (!person) throw new Error(`No person at index ${personIndex}`);

  const daysLeft = daysToYearEnd();

  if (hasLogismataCredentials()) {
    const limits = await logismataCall<{
      WithBVG?: number;
      WithoutBVG?: number;
    }>("getSaving3aLimits", {});

    let taxLocationId: string | undefined;
    if (household.postcode) {
      const loc = await logismataCall<{ TaxLocationID?: string }>(
        "searchLocation",
        { Postcode: household.postcode },
      );
      taxLocationId = loc.TaxLocationID;
    }

    const maxContribution = person.withBVG
      ? (limits.WithBVG ?? leaTax3a.maxWithBVG)
      : (limits.WithoutBVG ?? leaTax3a.maxWithoutBVG);

    const saving = await logismataCall<{ TaxSaved?: number }>(
      "calculateSaving3a",
      {
        Duration: 1,
        IncomeType: "Employment",
        Income: grossIncome(person),
        TaxLocationID: taxLocationId,
        Relationship: household.relationship,
        Confession1: household.churchTax ? "Church" : "None",
        NumberOfChildren: household.children.length,
        Sex: person.sex,
        BirthYear: person.birthYear,
        Contribution: maxContribution,
      },
    );

    return finish(
      personIndex,
      maxContribution,
      saving.TaxSaved ?? 0,
      daysLeft,
      taxLocationId,
    );
  }

  const maxContribution = person.withBVG
    ? leaTax3a.maxWithBVG
    : leaTax3a.maxWithoutBVG;

  return finish(
    personIndex,
    maxContribution,
    leaTax3a.taxSavedAtMax,
    daysLeft,
    leaTax3a.taxLocationId,
  );
}

function finish(
  personIndex: number,
  maxContribution: number,
  taxSaved: number,
  daysLeft: number,
  taxLocationId?: string,
): Tax3aResult {
  const trace = createTrace({
    label: "3a tax saving this year",
    value: taxSaved,
    unit: "CHF/yr",
    operation: "calculateSaving3a",
    responseField: "TaxSaved",
    inputs: {
      MaxContribution: maxContribution,
      DaysLeft: daysLeft,
      TaxLocationID: taxLocationId ?? "",
    },
    assumptions: ["Contribution at this year's legal maximum"],
    sources: ["user"],
    explanation: `Paying the maximum 3a this year saves about CHF ${fmt(taxSaved)} in tax. ${daysLeft} days left in the year.`,
  });

  return {
    personIndex,
    maxContribution,
    taxSaved,
    daysLeft,
    taxLocationId,
    traceId: trace.id,
  };
}

function daysToYearEnd(): number {
  const now = new Date();
  const end = new Date(now.getFullYear(), 11, 31);
  const ms = end.getTime() - now.getTime();
  return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
}

function fmt(n: number): string {
  return Math.round(n).toLocaleString("de-CH").replace(/,/g, "'");
}
