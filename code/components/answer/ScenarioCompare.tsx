"use client";

import { SourcedNumber } from "@/components/data/SourcedNumber";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { formatCHF, formatSwiss } from "@/lib/format";
import { getPersona, readPersonaId, type PersonaId } from "@/lib/personas";
import { useEffect, useMemo, useState } from "react";

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

type Mode = "pensum" | "disability" | "retire";

function modeFor(id: PersonaId): Mode {
  if (id === "ruth") return "retire";
  if (id === "noah" || id === "sandra") return "disability";
  return "pensum";
}

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
  mode?: Mode;
  onTalk?: () => void;
  onDone?: () => void;
  className?: string;
};

export function ScenarioCompare({
  initialPensum = 60,
  variant = "segment",
  mode: modeProp,
  onTalk,
  onDone,
  className,
}: Props) {
  const [personaId, setPersonaId] = useState<PersonaId>("lena");
  const [pensum, setPensum] = useState(initialPensum);
  const [retireMix, setRetireMix] = useState<"cash" | "mix" | "pension">("mix");

  useEffect(() => {
    setPersonaId(readPersonaId());
  }, []);

  const mode = modeProp ?? modeFor(personaId);
  const money = useMemo(() => moneyAt(pensum), [pensum]);
  const next = useMemo(() => scoresAt(pensum), [pensum]);
  const first = getPersona(personaId).hi.replace(/\.$/, "");

  if (mode === "retire") {
    const lasts =
      retireMix === "cash" ? 79 : retireMix === "mix" ? 91 : 94;
    const guaranteed =
      retireMix === "cash" ? 0 : retireMix === "mix" ? 42 : 70;
    return (
      <div className={cn("dm-stack", className)} style={{ gap: 14 }}>
        <div className="dm-seg3" role="group" aria-label="How you take the money">
          {(
            [
              ["cash", "All cash"],
              ["mix", "Mixed"],
              ["pension", "Mostly pension"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              aria-pressed={retireMix === id}
              onClick={() => setRetireMix(id)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="dm-money2">
          <div>
            <small>Money lasts until</small>
            <b>Age {lasts}</b>
            <em className={lasts < 85 ? "neg" : undefined}>
              {lasts < 85 ? "Runs short" : "Comfortable"}
            </em>
          </div>
          <div>
            <small>Guaranteed share</small>
            <SourcedNumber
              amount={guaranteed}
              cue="%"
              exact
              sheetTitle="How we size the mix"
              sheetDescription="Demo figures from the payout path. Live engine later."
              sources={[
                {
                  label: "Pension slice",
                  detail: "AHV + fund annuity",
                  amount: guaranteed,
                },
                {
                  label: "Flexible cash",
                  detail: "Rest of the CHF 380'000",
                  amount: 100 - guaranteed,
                },
              ]}
            />
          </div>
        </div>
        <p className="dm-insight">
          For {first}, taking{" "}
          {retireMix === "cash"
            ? "everything as cash"
            : retireMix === "mix"
              ? "a mixed plan"
              : "mostly pension"}{" "}
          means the money lasts to about <b>age {lasts}</b>
          {guaranteed > 0
            ? `, with about ${guaranteed} % guaranteed.`
            : "."}
        </p>
        <span className="dm-small dm-muted">
          Illustrative. Your advisor confirms the exact split.
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

  if (mode === "disability") {
    const incomeToday = personaId === "sandra" ? 7200 : 5200;
    const ifSick = personaId === "sandra" ? 2100 : 3300;
    return (
      <div className={cn("dm-stack", className)} style={{ gap: 14 }}>
        <div className="dm-money2">
          <div>
            <small>Income today / month</small>
            <SourcedNumber
              amount={incomeToday}
              exact
              sheetTitle="Where this comes from"
              sources={[
                {
                  label: "Salary",
                  detail: "Said · full time",
                  amount: incomeToday,
                },
              ]}
            />
          </div>
          <div>
            <small>If you couldn&apos;t work</small>
            <SourcedNumber
              amount={ifSick}
              exact
              sheetTitle="If you couldn't work"
              sheetDescription="AHV/IV plus any fund disability. Demo fixture."
              sources={[
                {
                  label: "AHV / IV",
                  detail: "Estimated",
                  amount: Math.round(ifSick * 0.55),
                },
                {
                  label: "Pension fund",
                  detail:
                    personaId === "sandra" ? "None · self-employed" : "myPax",
                  amount: Math.round(ifSick * 0.45),
                },
              ]}
            />
            <em className="neg">
              −{formatSwiss(incomeToday - ifSick)} / month
            </em>
          </div>
        </div>
        <div className="dm-db">
          {AREAS.map((area) => {
            const b =
              area.id === "dis"
                ? 28
                : area.id === "ret"
                  ? area.today - 8
                  : area.today;
            const lo = Math.min(area.today, b);
            const hi = Math.max(area.today, b);
            return (
              <div key={area.id} className="dm-dbr">
                <span>{area.label}</span>
                <span className="tr">
                  <span
                    className="seg"
                    style={{ left: `${lo}%`, width: `${hi - lo}%` }}
                  />
                  <span className="was" style={{ left: `${area.today}%` }} />
                  <span
                    className="now"
                    style={{ left: `${b}%`, background: area.color }}
                  />
                </span>
                <span className="v">
                  <small>{area.today} →</small>
                  {b}%
                </span>
              </div>
            );
          })}
        </div>
        <p className="dm-insight">
          For {first}, the soft spot is disability: about{" "}
          <b>
            {formatCHF(incomeToday - ifSick)} a month
          </b>{" "}
          would be missing.
        </p>
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
          <SourcedNumber
            amount={money.income}
            exact
            sheetTitle="Income at this pensum"
            sources={[
              {
                label: "Salary",
                detail: `${pensum} % of CHF 6'700`,
                amount: money.income,
              },
            ]}
          />
          <em className={money.incomeDelta < 0 ? "neg" : undefined}>
            {money.incomeDelta === 0
              ? "same as today"
              : `${money.incomeDelta > 0 ? "+" : "−"}${formatSwiss(Math.abs(money.incomeDelta))}`}
          </em>
        </div>
        <div>
          <small>Pension at 65 / month</small>
          <SourcedNumber
            amount={money.pension}
            exact
            sheetTitle="Pension fund at 65"
            sheetDescription="Coordination deduction makes part-time cost more than the salary cut."
            sources={[
              {
                label: "Pension fund",
                detail: "calculateRetirementBase · demo",
                amount: money.pension,
              },
              {
                label: "Drop vs 100 %",
                detail: "For life",
                amount: Math.abs(money.pensionDelta),
              },
            ]}
          />
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
