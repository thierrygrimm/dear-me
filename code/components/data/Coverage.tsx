"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { useState } from "react";

export type CoverageArea = {
  id: string;
  label: string;
  score: number; // 0–100
  thin?: boolean;
  /** Plain-language explanation shown in the expandable sheet. */
  explain?: string;
  /** Short source line under the explanation. */
  source?: string;
};

type Props = {
  areas: CoverageArea[];
  headline?: string;
  className?: string;
};

function wordFor(score: number) {
  return score >= 80 ? "Good" : score >= 50 ? "Okay" : "Thin";
}

function defaultExplain(area: CoverageArea) {
  const word = wordFor(area.score).toLowerCase();
  if (area.thin || area.score < 50) {
    return `${area.label} looks thin at about ${area.score} %. That is the open spot to look at first.`;
  }
  if (area.score < 80) {
    return `${area.label} is ${word} at about ${area.score} %. Solid enough for now, with room to strengthen.`;
  }
  return `${area.label} looks ${word} at about ${area.score} %. Nothing urgent here.`;
}

export function Coverage({ areas, headline, className }: Props) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = areas.find((a) => a.id === activeId) ?? null;

  return (
    <section className={cn("dm-cov", className)}>
      {headline ? (
        <p className="dm-covhead">
          <b>{headline}</b>
        </p>
      ) : null}
      {areas.map((a) => (
        <button
          key={a.id}
          type="button"
          className={cn("dm-covr", a.thin && "thin")}
          aria-haspopup="dialog"
          aria-expanded={activeId === a.id}
          onClick={() => setActiveId(a.id)}
        >
          <span>{a.label}</span>
          <span className="tr">
            <i style={{ width: `${Math.max(0, Math.min(100, a.score))}%` }} />
          </span>
          <em>{wordFor(a.score)}</em>
        </button>
      ))}

      <BottomSheet
        open={!!active}
        onClose={() => setActiveId(null)}
        title={
          active
            ? `Why is ${active.label.toLowerCase()} at ${active.score} %?`
            : undefined
        }
      >
        {active ? (
          <>
            <p>{active.explain ?? defaultExplain(active)}</p>
            {active.source ? (
              <span className="dm-small dm-muted">{active.source}</span>
            ) : (
              <span className="dm-small dm-muted">
                Tap the handle to see more. Figures come from what we know about
                you so far.
              </span>
            )}
            <Button
              variant="secondary"
              block
              style={{ marginTop: "auto" }}
              onClick={() => setActiveId(null)}
            >
              Close
            </Button>
          </>
        ) : null}
      </BottomSheet>
    </section>
  );
}
