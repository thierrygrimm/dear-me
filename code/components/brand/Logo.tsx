import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";

type Props = {
  markOnly?: boolean;
  className?: string;
  /** Pixel size of the mark when markOnly; lockup scales via CSS otherwise */
  size?: number;
  /** 32px cover/splash lockup; default in-app is 16px */
  hero?: boolean;
};

export function Mark({ className, size }: { className?: string; size?: number }) {
  return (
    <svg
      className={cn("dm-mark", className)}
      viewBox="0 0 100 100"
      aria-hidden
      style={size ? { width: size, height: size } : undefined}
    >
      <path d="M6,8 H32 L42,18 V44 L22,64 V92 H6 Z" />
      <path d="M30,92 V66 L50,46 H64 V58 L84,78 V92 Z" />
      <path d="M54,41 V22 L60,12 L66,22 H78 L90,34 V41 Z" />
    </svg>
  );
}

export function Logo({ markOnly, className, size, hero }: Props) {
  if (markOnly) {
    return <Mark className={className} size={size} />;
  }
  return (
    <span
      className={cn("dm-lockup", hero && "dm-lockup--hero", className)}
      aria-label={copy.brand}
    >
      <Mark size={size} />
      {copy.brand}
    </span>
  );
}
