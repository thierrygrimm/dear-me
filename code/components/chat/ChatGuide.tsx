"use client";

import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { cn } from "@/lib/cn";
import { useState } from "react";

export type GuideStep = {
  id: string;
  question: string;
  options: { id: string; label: string }[];
};

type Props = {
  steps: GuideStep[];
  onComplete?: (answers: Record<string, string>) => void;
  className?: string;
};

export function ChatGuide({ steps, onComplete, className }: Props) {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const step = steps[index];
  if (!step) return null;

  const progress = ((index + 1) / steps.length) * 100;

  return (
    <div className={cn("dm-stack", className)}>
      <div className="dm-qprog">
        <div className="dm-qprog__bar">
          <i style={{ width: `${progress}%` }} />
        </div>
        <span>
          {index + 1}/{steps.length}
        </span>
      </div>
      <h2 className="dm-q">{step.question}</h2>
      <div className="dm-row">
        {step.options.map((o) => (
          <Chip
            key={o.id}
            pressed={answers[step.id] === o.id}
            onClick={() =>
              setAnswers((prev) => ({ ...prev, [step.id]: o.id }))
            }
          >
            {o.label}
          </Chip>
        ))}
      </div>
      <Button
        variant="primary"
        block
        disabled={!answers[step.id]}
        onClick={() => {
          if (index < steps.length - 1) setIndex((i) => i + 1);
          else onComplete?.(answers);
        }}
      >
        {index < steps.length - 1 ? "Next" : "See the answer"}
      </Button>
    </div>
  );
}
