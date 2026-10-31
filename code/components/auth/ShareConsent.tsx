"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { Check } from "lucide-react";
import { useState } from "react";

type Category = {
  id: string;
  label: string;
  detail: string;
};

const defaults: Category[] = [
  {
    id: "profile",
    label: "Who you are",
    detail: "Name, age, household",
  },
  {
    id: "numbers",
    label: "The francs we calculated",
    detail: "Sources stay attached",
  },
  {
    id: "gaps",
    label: "Open soft spots",
    detail: "Only what still needs a look",
  },
];

type Props = {
  categories?: Category[];
  onConfirm?: (selected: string[]) => void;
  className?: string;
};

export function ShareConsent({
  categories = defaults,
  onConfirm,
  className,
}: Props) {
  const [selected, setSelected] = useState<string[]>(() =>
    categories.map((c) => c.id),
  );

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  return (
    <div className={cn("dm-stack", className)}>
      <h2 className="dm-hello" style={{ fontSize: 22 }}>
        Choose what they see
      </h2>
      <p className="dm-muted" style={{ margin: 0 }}>
        Nothing is shared without a tap per category.
      </p>
      {categories.map((c) => {
        const on = selected.includes(c.id);
        return (
          <button
            key={c.id}
            type="button"
            className="dm-crow"
            role="checkbox"
            aria-checked={on}
            onClick={() => toggle(c.id)}
          >
            <span className="dm-cb">
              {on ? <Check strokeWidth={2.5} /> : null}
            </span>
            <span>
              {c.label}
              <small>{c.detail}</small>
            </span>
          </button>
        );
      })}
      <Button
        variant="primary"
        block
        disabled={selected.length === 0}
        onClick={() => onConfirm?.(selected)}
      >
        Continue
      </Button>
    </div>
  );
}
