"use client";

import { cn } from "@/lib/cn";
import { formatCHF } from "@/lib/format";
import type { ButtonHTMLAttributes } from "react";

export type SourceLine = {
  label: string;
  detail: string;
  amount: number;
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  amount: number;
  cue?: string;
  exact?: boolean;
  sources?: SourceLine[];
  showSources?: boolean;
};

export function SourcedNumber({
  amount,
  cue,
  exact,
  sources,
  showSources,
  className,
  ...rest
}: Props) {
  return (
    <div>
      <button type="button" className={cn("dm-srcnum", className)} {...rest}>
        {formatCHF(amount, { exact })}
        {cue ? <small>{cue}</small> : null}
      </button>
      {showSources && sources && sources.length > 0 ? (
        <ul className="dm-srclist">
          {sources.map((s) => (
            <li key={s.label}>
              <b>{s.label}</b>
              <em>{formatCHF(s.amount, { exact: true })}</em>
              <span>{s.detail}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
