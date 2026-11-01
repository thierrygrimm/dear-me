"use client";

import {
  householdForDemo,
  simulateCoverageClient,
} from "@/lib/engine";
import type { CoverageSimulation, RiskScenario } from "@/lib/engine/types";
import { readPersonaId } from "@/lib/personas";
import { useEffect, useState } from "react";

export function useCoverageSimulation() {
  const [data, setData] = useState<CoverageSimulation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const personaId = readPersonaId();
    simulateCoverageClient({
      household: householdForDemo(personaId),
      personaId,
    })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Coverage failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  /** Partner 2 disability by illness — Build Spec B2 demo scenario. */
  function partner2Illness(): RiskScenario | null {
    return data?.scenarios.find((s) => s.id === 5) ?? null;
  }

  return { data, loading, error, partner2Illness };
}
