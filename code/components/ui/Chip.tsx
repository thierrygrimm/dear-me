"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  pressed?: boolean;
};

export function Chip({ pressed, className, type = "button", ...rest }: Props) {
  return (
    <button
      type={type}
      className={cn("dm-chip", className)}
      aria-pressed={pressed ?? false}
      {...rest}
    />
  );
}
