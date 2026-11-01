import { z } from "zod";
import { householdSchema, parseHousehold } from "./household";

export const simulateBaseSchema = z.object({
  household: householdSchema,
  personaId: z.string().optional(),
});

export const workloadRequestSchema = simulateBaseSchema.extend({
  personIndex: z.number().int().min(0).max(1).default(1),
  steps: z.array(z.number().min(40).max(100)).optional(),
});

export const coverageRequestSchema = simulateBaseSchema;

export const retirementAgeRequestSchema = simulateBaseSchema.extend({
  personIndex: z.number().int().min(0).max(1).default(1),
  ages: z.array(z.number().int().min(58).max(70)).optional(),
});

export const tax3aRequestSchema = simulateBaseSchema.extend({
  personIndex: z.number().int().min(0).max(1).default(1),
});

export const recommendationsRequestSchema = simulateBaseSchema.extend({
  personIndex: z.number().int().min(0).max(1).default(1),
  askedForPerson: z.boolean().optional(),
  includeWorkload: z.boolean().default(true),
  includeCoverage: z.boolean().default(true),
  includeTax3a: z.boolean().default(true),
});

export const leadRequestSchema = z.object({
  household: householdSchema,
  entryPoint: z.string().min(1).default("ask"),
  contactPreference: z
    .enum(["call", "video", "office", "message"])
    .default("video"),
  questions: z.array(z.string()).default([]),
  askedForPerson: z.boolean().default(true),
});

export function householdFromBody(body: { household: unknown; personaId?: string }) {
  return parseHousehold(body.household);
}
