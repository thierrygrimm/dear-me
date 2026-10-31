"use client";

import { cn } from "@/lib/cn";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "signal"
  | "secondary"
  | "tonal"
  | "text"
  | "family"
  | "family-soft"
  | "joy"
  | "inverse"
  | "inverse-line"
  | "danger"
  | "pax";

export type ButtonSize = "sm" | "md" | "lg";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  block?: boolean;
  iconOnly?: boolean;
  icon?: ReactNode;
  iconAfter?: ReactNode;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: "dm-btn--primary",
  signal: "dm-btn--signal",
  secondary: "dm-btn--secondary",
  tonal: "dm-btn--tonal",
  text: "dm-btn--text",
  family: "dm-btn--family",
  "family-soft": "dm-btn--family-soft",
  joy: "dm-btn--joy",
  inverse: "dm-btn--inverse",
  "inverse-line": "dm-btn--inverse-line",
  danger: "dm-btn--danger",
  pax: "dm-btn--pax",
};

export function Button({
  variant = "primary",
  size = "md",
  block,
  iconOnly,
  icon,
  iconAfter,
  className,
  children,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      className={cn(
        "dm-btn",
        variantClass[variant],
        size === "lg" && "dm-btn--lg",
        size === "sm" && "dm-btn--sm",
        block && "dm-btn--block",
        iconOnly && "dm-btn--icon",
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
      {iconAfter}
    </button>
  );
}
