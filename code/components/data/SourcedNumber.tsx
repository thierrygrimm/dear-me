"use client";

import { BottomSheet } from "@/components/feedback/BottomSheet";
import { TraceSheet } from "@/components/data/TraceSheet";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatCHF } from "@/lib/format";
import {
  useState,
  type ButtonHTMLAttributes,
  type MouseEvent,
} from "react";

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
  /** Prefer live Build Spec C1 trace over static sources. */
  traceId?: string | null;
  /** Also show the source list inline under the number. */
  showSources?: boolean;
  sheetTitle?: string;
  sheetDescription?: string;
};

export function SourcedNumber({
  amount,
  cue,
  exact,
  sources,
  traceId,
  showSources,
  sheetTitle = "Where this comes from",
  sheetDescription,
  className,
  onClick,
  ...rest
}: Props) {
  const [open, setOpen] = useState(false);
  const hasTrace = Boolean(traceId);
  const hasSources = !!sources && sources.length > 0;
  const canOpen = hasTrace || hasSources;

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    if (canOpen) setOpen(true);
  };

  return (
    <div>
      <button
        type="button"
        className={cn("dm-srcnum", className)}
        onClick={handleClick}
        aria-haspopup={canOpen ? "dialog" : undefined}
        aria-expanded={canOpen ? open : undefined}
        {...rest}
      >
        {formatCHF(amount, { exact })}
        {cue ? <small>{cue}</small> : null}
      </button>
      {showSources && hasSources ? (
        <ul className="dm-srclist">
          {sources!.map((s) => (
            <li key={s.label}>
              <b>{s.label}</b>
              <em>{formatCHF(s.amount, { exact: true })}</em>
              <span>{s.detail}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {hasTrace ? (
        <TraceSheet
          open={open}
          onClose={() => setOpen(false)}
          traceId={traceId ?? null}
          fallbackTitle={sheetTitle}
        />
      ) : hasSources ? (
        <BottomSheet
          open={open}
          onClose={() => setOpen(false)}
          title={sheetTitle}
          description={sheetDescription}
        >
          <ul className="dm-srclist" style={{ margin: 0 }}>
            {sources!.map((s) => (
              <li key={s.label}>
                <b>{s.label}</b>
                <em>{formatCHF(s.amount, { exact: true })}</em>
                <span>{s.detail}</span>
              </li>
            ))}
          </ul>
          <Button variant="secondary" block onClick={() => setOpen(false)}>
            Close
          </Button>
        </BottomSheet>
      ) : null}
    </div>
  );
}
