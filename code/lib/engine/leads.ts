import { randomUUID } from "node:crypto";
import type { Household, Lead, Suggestion } from "./types";

const leads: Lead[] = [];

export function createLead(input: {
  entryPoint: string;
  contactPreference: Lead["contactPreference"];
  household: Household;
  gaps: Suggestion[];
  questions?: string[];
  traceIds?: string[];
}): Lead {
  const lead: Lead = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    entryPoint: input.entryPoint,
    contactPreference: input.contactPreference,
    household: structuredClone(input.household),
    gaps: input.gaps,
    questions: input.questions ?? [],
    traceIds: input.traceIds ?? input.gaps.flatMap((g) => g.traceIds),
  };
  leads.unshift(lead);
  return lead;
}

export function listLeads(limit = 50): Lead[] {
  return leads.slice(0, limit);
}

export function getLead(id: string): Lead | undefined {
  return leads.find((l) => l.id === id);
}
