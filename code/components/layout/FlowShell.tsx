"use client";

import { Logo } from "@/components/brand/Logo";
import { AppShell } from "@/components/layout/AppShell";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Pane = "card" | "center" | "question" | "full" | "col" | "lesson";

type Props = {
  children: ReactNode;
  /** Top-bar step label, e.g. "Connect myPax" or "Set up your plan · 2 of 3" */
  step: string;
  /** 0–100 progress; omit to hide the bar (e.g. Log in) */
  progress?: number;
  /** Save and exit */
  onExit?: () => void;
  /** Pane modifier matching DS `.pg.fl-*` */
  pane?: Pane;
  /** Full-bleed loaders / celebration (`.fl-bleed`) */
  bleed?: boolean;
  className?: string;
};

/**
 * ResponsiveStart flow shell (900px+): slim top bar + centred column.
 * Phone keeps the children's own appbars; `.fl-top` is hidden under 900px.
 */
export function FlowShell({
  children,
  step,
  progress,
  onExit,
  pane = "col",
  bleed,
  className,
}: Props) {
  const paneClass =
    pane === "card"
      ? "fl-card"
      : pane === "center"
        ? "fl-center"
        : pane === "question"
          ? "fl-question"
          : pane === "full"
            ? "fl-full"
            : pane === "lesson"
              ? "lesson"
              : "fl-col";

  return (
    <AppShell
      variant="flowapp"
      hideNav
      flush
      className={cn(bleed && "fl-bleed", className)}
    >
      <div className="fl-top">
        <Logo className="fl-lk" />
        <span className="fl-mid">
          {progress != null ? (
            <span className="fl-prog" aria-hidden>
              <i style={{ width: `${Math.max(progress, 4)}%` }} />
            </span>
          ) : null}
          <span className="fl-step">{step}</span>
        </span>
        {onExit ? (
          <button type="button" className="fl-exit" onClick={onExit}>
            Save and exit
          </button>
        ) : (
          <span />
        )}
      </div>
      <div
        className={
          pane === "lesson"
            ? cn("pg", "lesson")
            : cn("pg", "fl", paneClass)
        }
      >
        {children}
      </div>
    </AppShell>
  );
}
