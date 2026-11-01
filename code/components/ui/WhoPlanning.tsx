"use client";

import { Squirrel } from "@/components/brand/Squirrel";
import { Segmented } from "@/components/ui/Segmented";
import { cn } from "@/lib/cn";
import type { PlanningScope } from "@/lib/session";

type Props = {
  value: PlanningScope;
  onChange: (value: PlanningScope) => void;
  className?: string;
  /** Compact Me / Us pill for answer headers (Segmented A). */
  variant?: "tiles" | "pill";
};

const TILES: {
  id: PlanningScope;
  label: string;
  squirrels: { size: number; flip?: boolean }[];
}[] = [
  { id: "me", label: "Me", squirrels: [{ size: 28 }] },
  {
    id: "us",
    label: "Us",
    squirrels: [
      { size: 28 },
      { size: 28, flip: true },
    ],
  },
  {
    id: "family",
    label: "Us + baby",
    squirrels: [
      { size: 28 },
      { size: 16 },
      { size: 28, flip: true },
    ],
  },
];

/**
 * DS Segmented C · Who is planning — Me / Us / Us + baby tiles with squirrels.
 * Pill variant is Me / Us for guided-answer headers (Segmented A).
 */
export function WhoPlanning({
  value,
  onChange,
  className,
  variant = "tiles",
}: Props) {
  if (variant === "pill") {
    return (
      <Segmented
        className={className}
        aria-label="Who is planning"
        options={[
          { value: "me", label: "Me" },
          { value: "us", label: "Us" },
        ]}
        value={value === "family" ? "us" : value}
        onChange={(v) => onChange(v as PlanningScope)}
      />
    );
  }

  return (
    <div
      className={cn("dm-who", className)}
      role="radiogroup"
      aria-label="Who is planning"
    >
      {TILES.map((tile) => (
        <button
          key={tile.id}
          type="button"
          role="radio"
          aria-checked={value === tile.id}
          onClick={() => onChange(tile.id)}
        >
          <span className="dm-row" style={{ gap: 2, flexWrap: "nowrap" }}>
            {tile.squirrels.map((s, i) => (
              <Squirrel
                key={i}
                size={s.size}
                className={s.flip ? "dm-who-flip" : undefined}
              />
            ))}
          </span>
          {tile.label}
        </button>
      ))}
    </div>
  );
}
