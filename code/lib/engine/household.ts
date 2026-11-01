import { z } from "zod";
import type { Household, Person, Relationship } from "./types";

const sourceSchema = z.record(
  z.string(),
  z.enum(["estimate", "user", "document"]),
);

const pillar2Schema = z
  .object({
    pensionAt65: z.number().optional(),
    currentCapital: z.number().optional(),
    disability: z.number().optional(),
    disabilityChildren: z.number().optional(),
    widow: z.number().optional(),
    orphan: z.number().optional(),
    coverageCapital: z.number().optional(),
  })
  .optional();

const personSchema = z.object({
  sex: z.union([z.literal(1), z.literal(2)]),
  birthYear: z.number().int().min(1920).max(2020),
  fullTimeIncome: z.number().nonnegative(),
  workloadPc: z.number().min(0).max(100),
  withBVG: z.boolean(),
  retirementAge: z.number().int().min(58).max(70).optional(),
  pillar2: pillar2Schema,
  source: sourceSchema.default({}),
});

export const householdSchema = z.object({
  relationship: z.enum([
    "single",
    "married",
    "partnership",
    "cohabiting",
  ] as const satisfies readonly Relationship[]),
  sinceYear: z.number().int().optional(),
  persons: z.union([
    z.tuple([personSchema]),
    z.tuple([personSchema, personSchema]),
  ]),
  children: z.array(z.object({ birthYear: z.number().int() })).default([]),
  postcode: z.string().optional(),
  churchTax: z.boolean().optional(),
  assets: z.number().nonnegative().optional(),
  needs: z
    .object({
      disabilityPc: z.number().min(0).max(100),
      deathPc: z.number().min(0).max(100),
      retirementPc: z.number().min(0).max(100),
    })
    .optional(),
});

export type HouseholdInput = z.input<typeof householdSchema>;

export function parseHousehold(input: unknown): Household {
  const raw = householdSchema.parse(input);
  const depends =
    raw.relationship !== "single" || raw.children.length > 0;
  const needs = raw.needs ?? {
    disabilityPc: 80,
    deathPc: depends ? 70 : 0,
    retirementPc: 80,
  };
  return { ...raw, needs } as Household;
}

export function grossIncome(person: Person, workloadPc = person.workloadPc): number {
  return Math.round((person.fullTimeIncome * workloadPc) / 100);
}

export function defaultNeeds(household: Pick<Household, "relationship" | "children">) {
  const depends =
    household.relationship !== "single" || household.children.length > 0;
  return {
    disabilityPc: 80,
    deathPc: depends ? 70 : 0,
    retirementPc: 80,
  };
}
