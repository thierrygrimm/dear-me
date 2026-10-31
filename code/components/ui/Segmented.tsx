"use client";

import { cn } from "@/lib/cn";
import { useLayoutEffect, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
  "aria-label"?: string;
};

export function Segmented({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState({ width: 0, x: 0 });
  const index = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const buttons = root.querySelectorAll("button");
    const btn = buttons[index] as HTMLButtonElement | undefined;
    if (!btn) return;
    setThumb({ width: btn.offsetWidth, x: btn.offsetLeft - 3 });
  }, [index, options.length, value]);

  return (
    <div
      ref={rootRef}
      className={cn("dm-seg", className)}
      role="radiogroup"
      aria-label={ariaLabel}
    >
      <i
        aria-hidden
        style={{
          width: thumb.width || undefined,
          transform: `translateX(${thumb.x}px)`,
        }}
      />
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={opt.value === value}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
