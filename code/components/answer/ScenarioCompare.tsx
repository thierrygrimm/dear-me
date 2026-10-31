"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatCHF, formatSwiss } from "@/lib/format";
import { useMemo, useState } from "react";

export type AreaScore = {
  id: string;
  label: string;
  color: string;
  today: number;
};

const AREAS: AreaScore[] = [
  { id: "ret", label: "Retirement", color: "var(--brombeerkompott)", today: 82 },
  { id: "dis", label: "Disability", color: "var(--kaugummi)", today: 46 },
  { id: "fam", label: "Family", color: "var(--pflaumenkuchen)", today: 70 },
  { id: "sav", label: "Savings", color: "var(--espressosatz)", today: 55 },
  { id: "tax", label: "Taxes", color: "var(--neonweste)", today: 78 },
];

/** Fictional demo curve from the design-system ScenarioCompare preview */
function scoresAt(pensum: number): number[] {
  const t = (100 - pensum) / 40;
  return [
    Math.round(82 - t * 19),
    Math.round(46 - t * 12),
    Math.round(70 - t * 10),
    Math.round(55 - t * 8),
    Math.round(78 - t * 6),
  ];
}

function moneyAt(pensum: number) {
  const fullIncome = 6700;
  const fullPension = 1680;
  const income = Math.round(fullIncome * (pensum / 100));
  const pension = Math.round(fullPension - ((100 - pensum) / 40) * 620);
  return {
    income,
    incomeDelta: income - fullIncome,
    pension,
    pensionDelta: pension - fullPension,
  };
}

type Props = {
  initialPensum?: number;
  variant?: "segment" | "drag";
  onTalk?: () => void;
  onDone?: () => void;
  className?: string;
};

export function ScenarioCompare({
  initialPensum = 60,
  variant = "segment",
  onTalk,
  onDone,
  className,
}: Props) {
  const [pensum, setPensum] = useState(initialPensum);
  const money = useMemo(() => moneyAt(pensum), [pensum]);
  const next = useMemo(() => scoresAt(pensum), [pensum]);

  return (
    <div className={cn("dm-stack", className)} style={{ gap: 14 }}>
      {variant === "segment" ? (
        <div className="dm-seg3" role="group" aria-label="Workload after the baby">
          {[100, 80, 60].map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={pensum === v}
              onClick={() => setPensum(v)}
            >
              {v} %
            </button>
          ))}
        </div>
      ) : (
        <div>
          <input
            className="dm-range"
            type="range"
            min={40}
            max={100}
            step={10}
            value={pensum}
            aria-label="Workload"
            onChange={(e) => setPensum(Number(e.target.value))}
            style={{
              width: "100%",
              appearance: "auto",
              height: 28,
              accentColor: "var(--espressosatz)",
            }}
          />
          <div
            className="dm-ticks"
            style={{
              display: "flex",
              justifyContent: "space-between",
              font: "500 11px/14px var(--font-text)",
              color: "var(--ink-muted)",
            }}
          >
            <span>40 %</span>
            <span>60 %</span>
            <span>80 %</span>
            <span>100 %</span>
          </div>
        </div>
      )}

      <div className="dm-money2">
        <div>
          <small>Income now / month</small>
          <b>{formatSwiss(money.income)}</b>
          <em className={money.incomeDelta < 0 ? "neg" : undefined}>
            {money.incomeDelta === 0
              ? "same as today"
              : `${money.incomeDelta > 0 ? "+" : "−"}${formatSwiss(Math.abs(money.incomeDelta))}`}
          </em>
        </div>
        <div>
          <small>Pension at 65 / month</small>
          <b>{formatSwiss(money.pension)}</b>
          <em className={money.pensionDelta < 0 ? "neg" : undefined}>
            {money.pensionDelta === 0
              ? "same as today"
              : `−${formatSwiss(Math.abs(money.pensionDelta))} for life`}
          </em>
        </div>
      </div>

      <div className="dm-db">
        {AREAS.map((area, i) => {
          const a = area.today;
          const b = next[i];
          const lo = Math.min(a, b);
          const hi = Math.max(a, b);
          return (
            <div key={area.id} className="dm-dbr">
              <span>{area.label}</span>
              <span className="tr">
                <span
                  className="seg"
                  style={{ left: `${lo}%`, width: `${hi - lo}%` }}
                />
                <span className="was" style={{ left: `${a}%` }} />
                <span
                  className="now"
                  style={{ left: `${b}%`, background: area.color }}
                />
              </span>
              <span className="v">
                <small>{a} →</small>
                {b}%
              </span>
            </div>
          );
        })}
      </div>

      <div className="dm-dblegend">
        <span>
          <i style={{ boxShadow: "inset 0 0 0 2px var(--ink-muted)" }} />
          Today
        </span>
        <span>
          <i style={{ background: "var(--ink)" }} />
          At {pensum} %
        </span>
      </div>

      <p className="dm-insight">
        At {pensum} % your pension drops by{" "}
        <b>{formatCHF(Math.abs(money.pensionDelta))} a month, for life</b>
        {next[1] < AREAS[1].today
          ? `, and disability falls to ${next[1]} %: your biggest new gap.`
          : "."}
      </p>

      <span className="dm-small dm-muted">
        Pension fund only. AHV is about the same in both cases.
      </span>

      {onTalk ? (
        <Button variant="primary" block onClick={onTalk}>
          Talk it through
        </Button>
      ) : null}
      {onDone ? (
        <Button variant="text" className="dm-small" onClick={onDone}>
          Back
        </Button>
      ) : null}
    </div>
  );
}
