"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { Button } from "@/components/ui/Button";
import { fetchTrace } from "@/lib/engine";
import type { Trace } from "@/lib/engine/types";
import { formatCHF, formatSwiss } from "@/lib/format";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  traceId: string | null;
  fallbackTitle?: string;
};

function formatValue(trace: Trace) {
  if (trace.unit === "%") return `${formatSwiss(trace.value)} %`;
  if (trace.unit === "CHF/mo") return `${formatCHF(trace.value, { exact: true })} / mo`;
  if (trace.unit === "CHF/yr") return `${formatCHF(trace.value, { exact: true })} / yr`;
  return formatCHF(trace.value, { exact: true });
}

/**
 * Build Spec C1 — tap a number, see explanation, inputs, assumptions, engine line.
 */
export function TraceSheet({
  open,
  onClose,
  traceId,
  fallbackTitle = "Where this comes from",
}: Props) {
  const [trace, setTrace] = useState<Trace | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !traceId) {
      setTrace(null);
      setError(null);
      return;
    }
    let cancelled = false;
    fetchTrace(traceId)
      .then((t) => {
        if (!cancelled) {
          setTrace(t);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Trace missing");
          setTrace(null);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [open, traceId]);

  return (
    <BottomSheet
      open={open}
      onClose={onClose}
      title={trace?.label ?? fallbackTitle}
      description={trace?.explanation}
    >
      {error ? (
        <p className="dm-small dm-muted">{error}</p>
      ) : null}
      {trace ? (
        <div className="dm-stack" style={{ gap: 14 }}>
          <div>
            <span className="dm-label">Value</span>
            <b
              style={{
                display: "block",
                font: "800 28px/32px var(--font-display)",
                letterSpacing: "-.02em",
              }}
            >
              {formatValue(trace)}
            </b>
          </div>
          {trace.derivation ? (
            <div>
              <span className="dm-label">How we got it</span>
              <p className="dm-small" style={{ margin: 0 }}>
                {trace.derivation}
              </p>
            </div>
          ) : null}
          {Object.keys(trace.inputs).length > 0 ? (
            <div>
              <span className="dm-label">Inputs that mattered</span>
              <dl className="dm-kv" style={{ marginTop: 6 }}>
                {Object.entries(trace.inputs).map(([k, v]) => (
                  <div key={k} style={{ display: "contents" }}>
                    <dt>{k}</dt>
                    <dd>{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
          {trace.assumptions.length > 0 ? (
            <div>
              <span className="dm-label">Assumptions</span>
              <ul style={{ margin: "6px 0 0", paddingLeft: 18 }}>
                {trace.assumptions.map((a) => (
                  <li key={a} className="dm-small">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <p className="dm-small dm-muted" style={{ margin: 0 }}>
            Calculated with Pax&apos;s pension engine
            {trace.operation ? ` · ${trace.operation}` : ""}.
            {trace.sources.length
              ? ` Sources: ${trace.sources.join(", ")}.`
              : ""}
          </p>
        </div>
      ) : !error ? (
        <p className="dm-small dm-muted">Loading…</p>
      ) : null}
      <Button variant="secondary" block onClick={onClose}>
        Close
      </Button>
    </BottomSheet>
  );
}
