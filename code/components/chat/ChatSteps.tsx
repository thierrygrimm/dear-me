import { cn } from "@/lib/cn";

export type StepLog = {
  id: string;
  label: string;
  done?: boolean;
};

type Props = {
  steps: StepLog[];
  collapsedSummary?: string;
  className?: string;
};

export function ChatSteps({ steps, collapsedSummary, className }: Props) {
  const allDone = steps.every((s) => s.done);
  if (allDone && collapsedSummary) {
    return (
      <p className={cn("dm-small dm-muted", className)}>{collapsedSummary}</p>
    );
  }
  return (
    <div className={cn("dm-steps-log", className)} aria-live="polite">
      {steps.map((s) => (
        <div
          key={s.id}
          className="dm-small"
          style={{
            color: s.done ? "var(--ink-muted)" : "var(--ink)",
            fontWeight: s.done ? 400 : 600,
          }}
        >
          {s.done ? "✓ " : "· "}
          {s.label}
        </div>
      ))}
    </div>
  );
}
