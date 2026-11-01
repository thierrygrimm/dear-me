"use client";

import { simulateTax3aClient } from "@/lib/engine";
import type { Tax3aResult } from "@/lib/engine/types";
import { readPersonaId } from "@/lib/personas";
import { useEffect, useState } from "react";

export function useTax3aSimulation(enabled = true) {
  const [data, setData] = useState<Tax3aResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(enabled);

  useEffect(() => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const personaId = readPersonaId();
    simulateTax3aClient({ personaId })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Tax 3a failed");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  return { data, loading, error };
}
