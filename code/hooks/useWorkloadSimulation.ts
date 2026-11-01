"use client";

import {
  householdForDemo,
  simulateWorkloadClient,
} from "@/lib/engine";
import type { WorkloadSimulation, WorkloadStep } from "@/lib/engine/types";
import { readPersonaId } from "@/lib/personas";
import { useEffect, useState } from "react";

export function useWorkloadSimulation(steps = [100, 80, 60]) {
  const [data, setData] = useState<WorkloadSimulation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const personaId = readPersonaId();
    simulateWorkloadClient({
      household: householdForDemo(personaId),
      personaId,
      personIndex: 1,
      steps,
    })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Simulation failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- steps joined
  }, [steps.join(",")]);

  function stepFor(pensum: number): WorkloadStep | null {
    if (!data) return null;
    return (
      data.steps.find((s) => s.workloadPc === pensum) ??
      data.steps[data.steps.length - 1] ??
      null
    );
  }

  return { data, loading, error, stepFor };
}
