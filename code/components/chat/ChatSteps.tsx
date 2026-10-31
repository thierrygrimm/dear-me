"use client";

import { cn } from "@/lib/cn";
import { useState } from "react";

export type StepLog = {
  id: string;
  label: string;
  /** wait = dashed nut, run = spinning, done = solid */
  status?: "wait" | "run" | "done";
  /** @deprecated prefer status */
  done?: boolean;
  duration?: string;
};

type Props = {
  steps: StepLog[];
  /** Header while open or collapsed, e.g. "Worked it out in 4.8 seconds" */
  summary?: string;
  /** Alias used by older call sites when all steps are done */
  collapsedSummary?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

function resolveStatus(step: StepLog): "wait" | "run" | "done" {
  if (step.status) return step.status;
  if (step.done) return "done";
  return "wait";
}

export function ChatSteps({
  steps,
  summary,
  collapsedSummary,
  open: openControlled,
  defaultOpen = false,
  onOpenChange,
  className,
}: Props) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);
  const isOpen = openControlled ?? uncontrolledOpen;

  const anyRunning = steps.some((s) => resolveStatus(s) === "run");
  const allDone = steps.every((s) => resolveStatus(s) === "done");
  const header =
    summary ??
    collapsedSummary ??
    (anyRunning || !allDone ? "Working on it" : "Done");

  function toggle() {
    const next = !isOpen;
    if (openControlled === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  return (
    <div
      className={cn("dm-steps-log", className)}
      data-open={isOpen ? "true" : "false"}
      aria-live="polite"
    >
      <button type="button" aria-expanded={isOpen} onClick={toggle}>
        <span>{header}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true">
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>
      <ol>
        {steps.map((s) => {
          const status = resolveStatus(s);
          return (
            <li
              key={s.id}
              className={status === "done" ? undefined : status}
            >
              <i aria-hidden />
              <span>{s.label}</span>
              <em>{status === "done" ? (s.duration ?? "") : ""}</em>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
