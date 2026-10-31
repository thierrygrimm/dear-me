"use client";

import { Squirrel } from "@/components/brand/Squirrel";
import { Button } from "@/components/ui/Button";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

type SplashProps = {
  className?: string;
  tagline?: string;
};

/** C · Cold-start splash (lime, under ~1.5s) */
export function Splash({
  className,
  tagline = "For the big moments.",
}: SplashProps) {
  return (
    <div className={cn("dm-splash", className)}>
      <Squirrel state="idle" size={96} />
      <span className="wm">{copy.brand}</span>
      <small>{tagline}</small>
    </div>
  );
}

type BrandLoaderProps = {
  label?: string;
  detail?: string;
  className?: string;
};

/** A · Brand loader (espressosatz, nuts → squirrel loop) */
export function BrandLoader({
  label = "Getting things ready",
  detail = copy.brand,
  className,
}: BrandLoaderProps) {
  return (
    <div className={cn("dm-loader", className)} role="status" aria-live="polite">
      <div className="stage" aria-hidden>
        <span className="nut" />
        <span className="nut" />
        <span className="nut" />
        <svg className="sq" viewBox="0 0 100 100">
          <path className="t" d="M6,8 H32 L42,18 V44 L22,64 V92 H6 Z" />
          <path className="b" d="M30,92 V66 L50,46 H64 V58 L84,78 V92 Z" />
          <path className="h" d="M54,41 V22 L60,12 L66,22 H78 L90,34 V41 Z" />
        </svg>
      </div>
      <p>{label}</p>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

/** @deprecated use BrandLoader */
export const Calculating = BrandLoader;

const DOT_COLORS = [
  "var(--abschlusspink)",
  "var(--neonweste)",
  "var(--kaugummi)",
  "var(--neonweste)",
] as const;

type SigningInProps = {
  label?: string;
  detail?: string;
  className?: string;
};

/** B · Signing in (dot ring around the squirrel) */
export function SigningIn({
  label = "Signing you in with myPax",
  detail = "This takes a few seconds",
  className,
}: SigningInProps) {
  return (
    <div className={cn("dm-loader", className)} role="status" aria-live="polite">
      <div className="dm-dotring" aria-hidden>
        {Array.from({ length: 16 }, (_, i) => (
          <i
            key={i}
            style={{
              ["--p" as string]: `rotate(${i * 22.5}deg) translateY(-62px)`,
              animationDelay: `${i * 0.1}s`,
              background: DOT_COLORS[i % DOT_COLORS.length],
            }}
          />
        ))}
        <svg viewBox="0 0 100 100">
          <path className="t" d="M6,8 H32 L42,18 V44 L22,64 V92 H6 Z" />
          <path className="b" d="M30,92 V66 L50,46 H64 V58 L84,78 V92 Z" />
          <path className="h" d="M54,41 V22 L60,12 L66,22 H78 L90,34 V41 Z" />
        </svg>
      </div>
      <p>{label}</p>
      {detail ? <small>{detail}</small> : null}
    </div>
  );
}

type CalculatingPanelProps = {
  steps?: string[];
  label?: string;
  onCancel?: () => void;
  className?: string;
  stepMs?: number;
};

/** D · Calculating with real step labels and nut progress */
export function CalculatingPanel({
  steps = [
    "Reading your pension certificate",
    "Checking your AHV years",
    "Calculating 100 % and 60 %",
    "Comparing with your goal",
    "Writing your answer",
  ],
  label = copy.waiting,
  onCancel,
  className,
  stepMs = 1100,
}: CalculatingPanelProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, steps.length));
    }, stepMs);
    return () => window.clearInterval(id);
  }, [stepMs, steps.length]);

  const filled = Math.min(step, steps.length);
  const detail =
    step >= steps.length
      ? "Still working, this one takes a little longer."
      : steps[Math.min(step, steps.length - 1)];

  return (
    <div
      className={cn(className)}
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding: "20px 16px 16px",
        gap: 18,
        boxSizing: "border-box",
        background: "var(--surface)",
      }}
      role="status"
      aria-live="polite"
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 18,
          textAlign: "center",
        }}
      >
        <Squirrel state="thinking" size={72} />
        <p
          style={{
            margin: 0,
            font: "600 20px/26px var(--font-display)",
            maxWidth: 280,
          }}
        >
          {label}
        </p>
        <p className="dm-small dm-muted" style={{ margin: 0, minHeight: 18 }}>
          {detail}
        </p>
        <div className="dm-nutbar" aria-hidden>
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i < filled ? "on" : undefined} />
          ))}
        </div>
      </div>
      {onCancel ? (
        <Button variant="text" className="dm-small" onClick={onCancel}>
          Cancel
        </Button>
      ) : null}
    </div>
  );
}

type SkeletonProps = {
  className?: string;
  height?: number | string;
  width?: number | string;
  radius?: number | string;
};

export function Skeleton({
  className,
  height = 16,
  width,
  radius,
}: SkeletonProps) {
  return (
    <div
      className={cn("dm-skel", className)}
      style={{ height, width, borderRadius: radius }}
      aria-hidden
    />
  );
}

/** E · Home-shaped skeleton screen (under ~2s) */
export function HomeSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn("dm-stack", className)}
      style={{ gap: 14, paddingTop: 4 }}
      aria-busy
      aria-label="Loading"
    >
      <div className="dm-row" style={{ justifyContent: "space-between" }}>
        <Skeleton width={90} height={16} />
        <Skeleton width={64} height={28} radius={999} />
      </div>
      <Skeleton width="70%" height={12} />
      <Skeleton height={150} radius="var(--radius-card)" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 12,
          alignItems: "end",
          height: 120,
        }}
      >
        <Skeleton height="100%" />
        <Skeleton height="70%" />
        <Skeleton height="25%" />
      </div>
      <Skeleton width="100%" height={10} />
      <Skeleton width="60%" height={10} />
      <Skeleton
        height={56}
        radius={999}
        className="mt-auto"
        width="100%"
      />
    </div>
  );
}
