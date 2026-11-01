import { randomUUID } from "node:crypto";
import type { Trace } from "./types";

const traces = new Map<string, Trace>();

export function createTrace(
  partial: Omit<Trace, "id" | "createdAt"> & { id?: string },
): Trace {
  const trace: Trace = {
    ...partial,
    id: partial.id ?? randomUUID(),
    createdAt: new Date().toISOString(),
  };
  traces.set(trace.id, trace);
  return trace;
}

export function getTrace(id: string): Trace | undefined {
  return traces.get(id);
}

export function listTraces(): Trace[] {
  return [...traces.values()];
}
