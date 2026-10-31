"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function ChatWidget({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("dm-widget", className)}>{children}</div>;
}

type AnswerWidgetProps = {
  label: string;
  cue?: string;
  verdict: string;
  detail?: string;
  bars?: { height: number; gap?: boolean }[];
  openLabel?: string;
  onOpen?: () => void;
  className?: string;
};

/** Compact verdict + mini pillar bars + Open — one widget per answer. */
export function AnswerWidget({
  label,
  cue,
  verdict,
  detail,
  bars = [
    { height: 56 },
    { height: 6, gap: true },
    { height: 12 },
  ],
  openLabel = "Open",
  onOpen,
  className,
}: AnswerWidgetProps) {
  return (
    <ChatWidget className={cn("dm-fadein", className)}>
      <div className="dm-widget__head">
        <span className="dm-label">{label}</span>
        {cue ? <span className="dm-small dm-muted">{cue}</span> : null}
      </div>
      <div
        className="dm-row"
        style={{ justifyContent: "space-between", alignItems: "flex-end" }}
      >
        <div>
          <p
            style={{
              margin: 0,
              font: "700 22px/26px var(--font-display)",
              letterSpacing: "-0.02em",
            }}
          >
            {verdict}
          </p>
          {detail ? <span className="dm-small">{detail}</span> : null}
        </div>
        <div className="dm-mini-bars" style={{ width: 90 }} aria-hidden>
          {bars.map((b, i) => (
            <i
              key={i}
              className={b.gap ? "gap" : undefined}
              style={{ height: b.height }}
            />
          ))}
        </div>
      </div>
      {onOpen ? (
        <Button
          variant="primary"
          size="sm"
          onClick={onOpen}
          style={{ alignSelf: "flex-start" }}
        >
          {openLabel}
        </Button>
      ) : null}
    </ChatWidget>
  );
}

export function MemoryChip({
  text,
  onChange,
  className,
}: {
  text: string;
  onChange?: () => void;
  className?: string;
}) {
  return (
    <span className={cn("dm-memchip dm-fadein", className)}>
      <i aria-hidden />
      {text}
      {onChange ? (
        <button type="button" onClick={onChange}>
          Change
        </button>
      ) : null}
    </span>
  );
}
