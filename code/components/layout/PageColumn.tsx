import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  /** Page-specific width: plan (default 760), learn, cmp, docs, book, cert, wwk, auth */
  kind?: "plan" | "learn" | "cmp" | "docs" | "book" | "cert" | "wwk" | "auth" | string;
  title?: string;
  subtitle?: string;
};

/**
 * Laptop calm column (`.pg`). On phone `display:contents` so children stay
 * in the normal flow; from 900px the design-system CSS sizes the column.
 */
export function PageColumn({
  children,
  className,
  kind = "plan",
  title,
  subtitle,
}: Props) {
  return (
    <div className={cn("pg", kind, className)}>
      {title ? <h1 className="pg-h">{title}</h1> : null}
      {subtitle ? <p className="pg-p">{subtitle}</p> : null}
      {children}
    </div>
  );
}
