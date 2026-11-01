/** Browser helpers for Build Spec demo APIs (fixtures via DEMO_CACHE). */

import type {
  CoverageSimulation,
  Household,
  Lead,
  Suggestion,
  Trace,
  WorkloadSimulation,
} from "./types";
import { fixtureHousehold } from "./fixtures";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : `Request failed (${res.status})`,
    );
  }
  return data;
}

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(path);
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) {
    throw new Error(
      typeof data === "object" && data && "error" in data && data.error
        ? String(data.error)
        : `Request failed (${res.status})`,
    );
  }
  return data;
}

export function demoHousehold(personaId = "lena"): Household {
  return fixtureHousehold(personaId === "lena" ? "lea" : personaId);
}

export async function simulateWorkloadClient(opts?: {
  household?: Household;
  personaId?: string;
  personIndex?: number;
  steps?: number[];
}): Promise<WorkloadSimulation> {
  const personaId = opts?.personaId ?? "lena";
  const data = await postJson<WorkloadSimulation>("/api/simulate/workload", {
    household: opts?.household ?? demoHousehold(personaId),
    personaId,
    personIndex: opts?.personIndex ?? 1,
    steps: opts?.steps ?? [100, 80, 60],
  });
  return data;
}

export async function simulateCoverageClient(opts?: {
  household?: Household;
  personaId?: string;
}): Promise<CoverageSimulation> {
  const personaId = opts?.personaId ?? "lena";
  return postJson<CoverageSimulation>("/api/simulate/coverage", {
    household: opts?.household ?? demoHousehold(personaId),
    personaId,
  });
}

export async function fetchTrace(id: string): Promise<Trace> {
  const data = await getJson<{ trace: Trace }>(`/api/trace/${id}`);
  return data.trace;
}

export async function fetchRecommendations(opts?: {
  household?: Household;
  personaId?: string;
  askedForPerson?: boolean;
}): Promise<{ suggestions: Suggestion[] }> {
  const personaId = opts?.personaId ?? "lena";
  return postJson("/api/recommendations", {
    household: opts?.household ?? demoHousehold(personaId),
    personaId,
    personIndex: 1,
    askedForPerson: opts?.askedForPerson ?? false,
    includeWorkload: true,
    includeCoverage: true,
    includeTax3a: true,
  });
}

export async function createLeadClient(opts: {
  household?: Household;
  personaId?: string;
  entryPoint?: string;
  contactPreference?: Lead["contactPreference"];
  questions?: string[];
  askedForPerson?: boolean;
}): Promise<Lead> {
  const personaId = opts.personaId ?? "lena";
  const data = await postJson<{ lead: Lead }>("/api/leads", {
    household: opts.household ?? demoHousehold(personaId),
    entryPoint: opts.entryPoint ?? "book",
    contactPreference: opts.contactPreference ?? "video",
    questions: opts.questions ?? [],
    askedForPerson: opts.askedForPerson ?? true,
  });
  return data.lead;
}

export async function fetchLead(id: string): Promise<Lead> {
  const data = await getJson<{ lead: Lead }>(`/api/leads/${id}`);
  return data.lead;
}

export async function fetchLeads(): Promise<Lead[]> {
  const data = await getJson<{ leads: Lead[] }>("/api/leads");
  return data.leads;
}

export async function fetchAudit(): Promise<
  { id: string; createdAt: string; ruleId: string; suggestion: Suggestion }[]
> {
  const data = await getJson<{
    entries: {
      id: string;
      createdAt: string;
      ruleId: string;
      suggestion: Suggestion;
    }[];
  }>("/api/audit");
  return data.entries ?? [];
}
