import type { Household, Person } from "./types";

/**
 * Strip names, contact and postcode before any model call.
 * Persons become Partner 1 / Partner 2 only.
 */
export function redactHouseholdForModel(household: Household): unknown {
  return {
    relationship: household.relationship,
    sinceYear: household.sinceYear,
    churchTax: household.churchTax,
    assets: household.assets,
    needs: household.needs,
    children: household.children,
    persons: household.persons.map((p, i) => redactPerson(p, i)),
  };
}

function redactPerson(person: Person, index: number) {
  return {
    label: `Partner ${index + 1}`,
    sex: person.sex,
    birthYear: person.birthYear,
    fullTimeIncome: person.fullTimeIncome,
    workloadPc: person.workloadPc,
    withBVG: person.withBVG,
    retirementAge: person.retirementAge,
    pillar2: person.pillar2,
    source: person.source,
  };
}

/** Pull every CHF / % style number out of explanation text for grounding. */
export function extractNumbers(text: string): number[] {
  const matches = text.match(/-?\d[\d'’\s]*\.?\d*/g) ?? [];
  return matches
    .map((m) => Number(m.replace(/[\s'’]/g, "")))
    .filter((n) => Number.isFinite(n));
}

export function numbersGrounded(
  text: string,
  allowed: number[],
  tolerance = 1,
): boolean {
  const found = extractNumbers(text);
  return found.every((n) =>
    allowed.some((a) => Math.abs(a - n) <= tolerance),
  );
}
