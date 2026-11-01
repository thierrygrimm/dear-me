import { randomUUID } from "node:crypto";
import type { AuditEntry, Household, Suggestion } from "./types";

const entries: AuditEntry[] = [];

export function recordRecommendation(
  ruleId: string,
  suggestion: Suggestion,
  household: Household,
): AuditEntry {
  const entry: AuditEntry = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ruleId,
    suggestion,
    householdSnapshot: structuredClone(household),
    traceIds: [...suggestion.traceIds],
  };
  entries.unshift(entry);
  return entry;
}

export function recordSuggestions(
  suggestions: Suggestion[],
  household: Household,
): AuditEntry[] {
  return suggestions
    .filter((s) => s.kind === "product" || s.kind === "handover")
    .map((s) => recordRecommendation(s.ruleId, s, household));
}

export function listAudit(limit = 50): AuditEntry[] {
  return entries.slice(0, limit);
}

export function getAudit(id: string): AuditEntry | undefined {
  return entries.find((e) => e.id === id);
}
