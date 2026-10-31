import { Squirrel } from "@/components/brand/Squirrel";
import { Logo } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { cn } from "@/lib/cn";

type SplashProps = {
  className?: string;
  tagline?: string;
};

export function Splash({ className, tagline = "for life's big moments" }: SplashProps) {
  return (
    <div className={cn("dm-splash", className)}>
      <Squirrel state="idle" size={96} />
      <span className="wm">{copy.brand}</span>
      <small>{tagline}</small>
    </div>
  );
}

type CalculatingProps = {
  label?: string;
  detail?: string;
  className?: string;
};

export function Calculating({
  label = copy.waiting,
  detail,
  className,
}: CalculatingProps) {
  return (
    <div className={cn("dm-loader", className)}>
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

type SkeletonProps = {
  className?: string;
  height?: number | string;
};

export function Skeleton({ className, height = 16 }: SkeletonProps) {
  return (
    <div
      className={cn("dm-skel", className)}
      style={{ height }}
      aria-hidden
    />
  );
}

export function LoadingMark() {
  return <Logo markOnly size={40} />;
}
