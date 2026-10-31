import { formatCHF } from "@/lib/format";
import { cn } from "@/lib/cn";

export type Pillar = {
  id: string;
  label: string;
  amount: number;
  max: number;
  gap?: boolean;
  tone?: "ahv" | "pk" | "3a";
};

type Props = {
  pillars: Pillar[];
  className?: string;
};

const toneClass = {
  ahv: "dm-p-ahv",
  pk: "dm-p-pk",
  "3a": "dm-p-3a",
} as const;

export function PillarChart({ pillars, className }: Props) {
  return (
    <div className={cn("dm-pillars", className)}>
      {pillars.map((p) => {
        const pct = Math.max(0, Math.min(100, (p.amount / p.max) * 100));
        const gapPct = p.gap ? Math.max(0, 100 - pct) : 0;
        return (
          <div key={p.id} className="dm-pillar">
            <span className="dm-pillar__amt">{formatCHF(p.amount)}</span>
            {p.gap ? (
              <div
                className="dm-pillar__gap"
                style={{ height: `${gapPct}%` }}
                aria-hidden
              />
            ) : null}
            <div
              className={cn(
                "dm-pillar__bar",
                p.tone ? toneClass[p.tone] : undefined,
              )}
              style={{ height: `${pct}%` }}
            />
            <span className="dm-pillar__lbl">{p.label}</span>
          </div>
        );
      })}
    </div>
  );
}
