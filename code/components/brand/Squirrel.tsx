import { cn } from "@/lib/cn";

export type SquirrelState =
  | "idle"
  | "listening"
  | "thinking"
  | "progress"
  | "done"
  | "peek";

const stateClass: Record<SquirrelState, string> = {
  idle: "is-idle",
  listening: "is-listen",
  thinking: "is-think",
  progress: "is-hop",
  done: "is-cheer",
  peek: "is-peek",
};

type Props = {
  state?: SquirrelState;
  size?: number;
  className?: string;
  showNut?: boolean;
};

export function Squirrel({
  state = "idle",
  size = 72,
  className,
  showNut,
}: Props) {
  return (
    <span className={cn("relative inline-flex", className)}>
      {showNut || state === "done" ? (
        <span className="dm-nutdrop" style={{ position: "absolute", left: "62%", bottom: 0 }} />
      ) : null}
      <svg
        className={cn("dm-sq", stateClass[state])}
        viewBox="0 0 100 100"
        width={size}
        height={size}
        aria-hidden
      >
        <path className="t" d="M6,8 H32 L42,18 V44 L22,64 V92 H6 Z" />
        <path className="b" d="M30,92 V66 L50,46 H64 V58 L84,78 V92 Z" />
        <path className="h" d="M54,41 V22 L60,12 L66,22 H78 L90,34 V41 Z" />
      </svg>
    </span>
  );
}
