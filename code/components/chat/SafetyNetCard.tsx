"use client";

import { cn } from "@/lib/cn";
import { copy } from "@/lib/copy";
import { useRouter } from "next/navigation";

type Props = {
  className?: string;
  /** Collapsed (hidden) while the thread is scrolled */
  minimized?: boolean;
  onActivate?: () => void;
};

/** Compact safety-net summary shown above the Ask thread (`.dm-netw`). */
export function SafetyNetCard({ className, minimized, onActivate }: Props) {
  const router = useRouter();

  return (
    <div
      className={cn("dm-netw", minimized && "min", className)}
      role="button"
      tabIndex={0}
      aria-label={copy.home.safetyNetOpen}
      aria-hidden={minimized || undefined}
      onClick={() => {
        onActivate?.();
        router.push("/compare");
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate?.();
          router.push("/compare");
        }
      }}
    >
      <svg
        className="dm-spider"
        viewBox="0 0 140 140"
        role="img"
        aria-label={copy.home.safetyNet}
      >
        <polygon
          className="web"
          points="70.0,48.0 96.6,67.3 86.5,98.7 53.5,98.7 43.4,67.3"
        />
        <polygon
          className="web"
          points="70.0,20.0 123.3,58.7 102.9,121.3 37.1,121.3 16.7,58.7"
        />
        <line className="web" x1="70.0" y1="76.0" x2="70.0" y2="20.0" />
        <line className="web" x1="70.0" y1="76.0" x2="123.3" y2="58.7" />
        <line className="web" x1="70.0" y1="76.0" x2="102.9" y2="121.3" />
        <line className="web" x1="70.0" y1="76.0" x2="37.1" y2="121.3" />
        <line className="web" x1="70.0" y1="76.0" x2="16.7" y2="58.7" />
        <polygon
          className="goal"
          points="70.0,28.4 115.3,61.3 98.0,114.5 42.0,114.5 24.7,61.3"
        />
        <polygon
          className="now"
          points="70.0,30.1 94.5,68.0 93.0,107.7 50.3,103.2 40.2,66.3"
        />
        <circle className="pt" cx="70.0" cy="30.1" r="6" />
        <circle className="pt thin" cx="94.5" cy="68.0" r="9" />
        <circle className="pt" cx="93.0" cy="107.7" r="6" />
        <circle className="pt" cx="50.3" cy="103.2" r="6" />
        <circle className="pt" cx="40.2" cy="66.3" r="6" />
      </svg>
      <div>
        <h4>{copy.home.safetyNet}</h4>
        <div className="dm-hl">
          <span>
            <i style={{ background: "var(--espressosatz)" }} />
            <b>{copy.home.safetyLater}</b>
            <small>{copy.home.safetyLaterSub}</small>
          </span>
          <span>
            <i style={{ background: "var(--abschlusspink)" }} />
            <b>{copy.home.safetyWork}</b>
            <small>{copy.home.safetyWorkSub}</small>
          </span>
        </div>
        <div className="go">{copy.home.safetySee}</div>
      </div>
    </div>
  );
}

/** Mini pill in the chat app bar; expands the net card when tapped. */
export function SafetyNetPill({
  show,
  onClick,
}: {
  show: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={cn("dm-mini-pill", show && "show")}
      onClick={onClick}
      aria-hidden={!show}
      tabIndex={show ? 0 : -1}
    >
      <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden>
        <polygon
          points="10,2 18,8 15,18 5,18 2,8"
          fill="none"
          stroke="var(--line-strong)"
          strokeDasharray="2 2"
        />
        <polygon
          points="10,4 15,9 13,15 7,16 5,9"
          fill="var(--neonweste)"
          stroke="var(--ink)"
        />
      </svg>
      {copy.home.safetyNetShort}
    </button>
  );
}
