"use client";

import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { useState } from "react";

export type PlanStep = {
  id: string;
  title: string;
  detail?: string;
  done?: boolean;
  /** Outside-the-app tasks use the checklist; in-app tasks open a screen */
  external?: boolean;
  onToggle?: () => void;
  onOpen?: () => void;
  onSkip?: () => void;
};

type Props = {
  title: string;
  subtitle?: string;
  steps: PlanStep[];
  /** A · action list (default), B · checklist, C · one step at a time */
  variant?: "actions" | "checklist" | "stepper";
  className?: string;
};

const RING = 2 * Math.PI * 22;

function CheckIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden>
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg className="go" viewBox="0 0 16 16" aria-hidden>
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

/** A · Action list — progress ring, tap opens the screen, ticks when done there. */
function ActionList({
  title,
  subtitle,
  steps,
  className,
}: {
  title: string;
  subtitle?: string;
  steps: PlanStep[];
  className?: string;
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const doneCount = steps.filter((s) => s.done).length;
  const offset = RING * (1 - doneCount / Math.max(steps.length, 1));

  return (
    <div className={cn("dm-todo", className)}>
      <div className="dm-todo__head">
        <div className="dm-todo__ring" aria-hidden>
          <svg viewBox="0 0 52 52">
            <circle className="trk" cx="26" cy="26" r="22" />
            <circle
              className="val"
              cx="26"
              cy="26"
              r="22"
              strokeDasharray={RING}
              strokeDashoffset={offset}
            />
          </svg>
          <em>
            {doneCount}/{steps.length}
          </em>
        </div>
        <div>
          <b>{title}</b>
          <span>{subtitle ?? copy.plan.listHint}</span>
        </div>
      </div>
      {steps.map((s) => (
        <button
          key={s.id}
          type="button"
          className={cn(
            "dm-task",
            s.done && "is-done",
            busyId === s.id && "is-busy",
          )}
          onClick={() => {
            if (s.done) return;
            setBusyId(s.id);
            window.setTimeout(() => {
              setBusyId(null);
              if (s.external) s.onToggle?.();
              else s.onOpen?.();
            }, 500);
          }}
        >
          <span className="ic">{s.done ? <CheckIcon /> : null}</span>
          <b>{s.title}</b>
          {s.detail ? <small>{s.detail}</small> : null}
          <ChevronIcon />
        </button>
      ))}
    </div>
  );
}

/** B · Simple checklist — for things done outside the app; tap to tick. */
function Checklist({
  steps,
  className,
}: {
  steps: PlanStep[];
  className?: string;
}) {
  const doneCount = steps.filter((s) => s.done).length;

  return (
    <div className={cn("dm-stack", className)} style={{ gap: 8 }}>
      {steps.map((s) => (
        <button
          key={s.id}
          type="button"
          className="dm-tick"
          role="checkbox"
          aria-checked={s.done ?? false}
          onClick={() => s.onToggle?.()}
        >
          <span>
            {s.title}
            {s.detail ? <small>{s.detail}</small> : null}
          </span>
          <i>
            <CheckIcon />
          </i>
        </button>
      ))}
      <p className="dm-small dm-muted" style={{ margin: "4px 0 0" }}>
        {copy.plan.doneCount(doneCount, steps.length)}
      </p>
    </div>
  );
}

/** C · One step at a time — only the current step shows actions. */
function Stepper({
  steps,
  className,
}: {
  steps: PlanStep[];
  className?: string;
}) {
  const firstOpen = steps.findIndex((s) => !s.done);
  const current = firstOpen === -1 ? steps.length : firstOpen;

  return (
    <div className={cn("dm-stepper-v", className)}>
      {steps.map((s, i) => {
        const isDone = Boolean(s.done);
        const isNow = i === current && !isDone;
        return (
          <div
            key={s.id}
            className={cn("dm-sv", isDone && "is-done", isNow && "is-now")}
          >
            <div className="rail">
              <span className="dot">
                {isDone ? <CheckIcon /> : i + 1}
              </span>
              {i < steps.length - 1 ? <span className="ln" /> : null}
            </div>
            <div className="body">
              <b>{s.title}</b>
              {s.detail ? <p>{s.detail}</p> : <p />}
              <div className="dm-row">
                <button
                  type="button"
                  className="dm-btn dm-btn--primary dm-btn--sm"
                  onClick={() => {
                    if (s.external) s.onToggle?.();
                    else s.onOpen?.();
                  }}
                >
                  {copy.plan.doNow}
                </button>
                <button
                  type="button"
                  className="dm-btn dm-btn--text dm-small"
                  onClick={() => s.onSkip?.() ?? s.onToggle?.()}
                >
                  {copy.plan.skip}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChatPlan({
  title,
  subtitle,
  steps,
  variant = "actions",
  className,
}: Props) {
  if (variant === "checklist") {
    return <Checklist steps={steps} className={className} />;
  }
  if (variant === "stepper") {
    return <Stepper steps={steps} className={className} />;
  }
  return (
    <ActionList
      title={title}
      subtitle={subtitle}
      steps={steps}
      className={className}
    />
  );
}
