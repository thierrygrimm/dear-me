"use client";

import {
  fetchRecommendations,
  type RecommendationsResult,
} from "@/lib/engine";
import { readPersonaId } from "@/lib/personas";
import { useEffect, useState } from "react";

export function useRecommendations(enabled = true) {
  const [data, setData] = useState<RecommendationsResult | null>(null);
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
    fetchRecommendations({ personaId })
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Recommendations failed",
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [enabled]);

  const product = data?.suggestions.find((s) => s.kind === "product") ?? null;
  const notNeeded =
    data?.suggestions.find((s) => s.kind === "not-needed") ?? null;

  return { data, loading, error, product, notNeeded, tax3a: data?.tax3a };
}
