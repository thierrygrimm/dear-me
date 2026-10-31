"use client";

import { cn } from "@/lib/cn";
import { formatPercent } from "@/lib/format";

type Props = {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  className?: string;
};

export function PensumSlider({
  value,
  onChange,
  min = 40,
  max = 100,
  step = 10,
  label = "Workload",
  className,
}: Props) {
  const fill = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn("dm-slider", className)}>
      <div className="dm-slider__head">
        <span className="dm-label">{label}</span>
        <span className="dm-slider__val">{formatPercent(value)}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--fill" as string]: `${fill}%` }}
        aria-label={label}
      />
      <div className="dm-slider__scale">
        <span>{formatPercent(min)}</span>
        <span>{formatPercent(max)}</span>
      </div>
    </div>
  );
}
