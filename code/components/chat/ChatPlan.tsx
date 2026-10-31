"use client";

import { cn } from "@/lib/cn";
import { Check } from "lucide-react";

export type PlanStep = {
  id: string;
  title: string;
  done?: boolean;
  external?: boolean;
  onToggle?: () => void;
  onOpen?: () => void;
};

type Props = {
  title: string;
  steps: PlanStep[];
  className?: string;
};

export function ChatPlan({ title, steps, className }: Props) {
  return (
    <section className={cn("dm-widget", className)}>
      <div className="dm-widget__head">
        <b>{title}</b>
      </div>
      <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {steps.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className="dm-crow"
              role="checkbox"
              aria-checked={s.done ?? false}
              onClick={() => {
                if (s.external) s.onToggle?.();
                else s.onOpen?.();
              }}
            >
              <span
                className="dm-cb"
                aria-hidden
                style={{
                  background: s.done ? "var(--signal)" : undefined,
                  boxShadow: s.done
                    ? "inset 0 0 0 1.5px var(--ink)"
                    : undefined,
                }}
              >
                {s.done ? <Check strokeWidth={2.5} /> : null}
              </span>
              <span>
                {s.title}
                {s.external ? (
                  <small>Tick when done outside the app</small>
                ) : null}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
