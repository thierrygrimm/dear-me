"use client";

import { CalculatingPanel } from "@/components/brand/Loading";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { NumberEdit } from "@/components/ui/NumberEdit";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { cn } from "@/lib/cn";
import { formatSwiss } from "@/lib/format";
import {
  isPaxConnected,
  markIntake,
  readCertificate,
  type IntakeValues,
} from "@/lib/session";
import { Pencil } from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type Phase = "ask" | "check" | "calc";

type Props = {
  onDone: () => void;
  onBack?: () => void;
  className?: string;
};

const PRESETS = [100, 80, 60] as const;

function StepProg({
  step,
  of,
  onBack,
}: {
  step: number;
  of: number;
  onBack?: () => void;
}) {
  const pct = Math.round((step / of) * 100);
  return (
    <div className="dm-qprog">
      <button type="button" className="bk" aria-label="Back" onClick={onBack}>
        <svg viewBox="0 0 24 24" aria-hidden>
          <path d="M15 5l-7 7 7 7" />
        </svg>
      </button>
      <div className="dm-qprog__bar" aria-hidden>
        <i style={{ width: `${Math.max(pct, 8)}%` }} />
      </div>
      <span>
        {step} of {of}
      </span>
    </div>
  );
}

/**
 * First-answer intake: one workload question → check it once → calculating.
 * Matches Flows / IntakeCard A + D for the demo path.
 */
export function IntakeFlow({ onDone, onBack, className }: Props) {
  const cert = useMemo(() => readCertificate(), []);
  const pax = isPaxConnected();

  const [phase, setPhase] = useState<Phase>("ask");
  const [mode, setMode] = useState<"type" | "speak">("type");
  const [today, setToday] = useState(100);
  const [after, setAfter] = useState(60);
  const [q, setQ] = useState<1 | 2>(1);
  const [editId, setEditId] = useState<"today" | "after" | null>(null);
  const [editDraft, setEditDraft] = useState("");

  const salary = cert?.insuredSalary ? Math.round(cert.insuredSalary * 1.5) : 92000;
  const savings = cert?.savings ?? 84300;

  useEffect(() => {
    if (phase !== "calc") return;
    const values: IntakeValues = {
      pensumToday: today,
      pensumAfter: after,
      salary,
      savings,
    };
    markIntake(values);
    const t = window.setTimeout(onDone, 2800);
    return () => window.clearTimeout(t);
  }, [phase, onDone, today, after, salary, savings]);

  function bump(delta: number) {
    const set = q === 1 ? setToday : setAfter;
    set((v) => Math.min(100, Math.max(20, v + delta)));
  }

  function openEdit(id: "today" | "after") {
    setEditId(id);
    setEditDraft(String(id === "today" ? today : after));
  }

  function saveEdit() {
    const n = Math.min(100, Math.max(20, Number.parseInt(editDraft, 10) || 60));
    if (editId === "today") setToday(n);
    if (editId === "after") setAfter(n);
    setEditId(null);
  }

  if (phase === "calc") {
    return (
      <div className={cn("dm-stage dm-app-shell--bleed", className)}>
        <CalculatingPanel
          label="One moment, we're doing the maths with you."
          steps={[
            "Reading your pension certificate",
            "Checking your AHV years",
            "Calculating 100 % and 60 %",
            "Comparing with your goal",
            "Writing your answer",
          ]}
          onCancel={onDone}
        />
      </div>
    );
  }

  const shell = (body: React.ReactNode) => (
    <div className={cn("dm-signup-shell", className)}>
      <div className="dm-signup">{body}</div>
    </div>
  );

  if (phase === "check") {
    const rows = [
      {
        id: "today" as const,
        label: "Workload today",
        source: "You typed it",
        value: `${today}`,
        unit: "%",
        edit: true,
      },
      {
        id: "after" as const,
        label: "After the baby",
        source: "You said it",
        value: `${after}`,
        unit: "%",
        edit: true,
      },
      {
        id: "salary" as const,
        label: "Salary",
        source: pax ? "From myPax" : "Estimated",
        value: formatSwiss(salary),
        unit: "",
        edit: false,
      },
      {
        id: "pk" as const,
        label: "Pension fund",
        source: pax ? "From your certificate" : "Estimated",
        value: formatSwiss(savings),
        unit: "",
        edit: false,
      },
      {
        id: "due" as const,
        label: "Baby due",
        source: "You said it",
        value: "March",
        unit: "",
        edit: false,
      },
    ];

    return shell(
      <>
        <p className="dm-q">Here&apos;s what we heard.</p>
        <span className="dm-small dm-muted">Tap a number to change it.</span>
        <div>
          {rows.map((row) => (
            <button
              key={row.id}
              type="button"
              className="dm-row-edit"
              data-edit={row.edit ? "" : undefined}
              onClick={() => {
                if (row.id === "today" || row.id === "after") openEdit(row.id);
              }}
            >
              <b>{row.label}</b>
              <span className="s">{row.source}</span>
              <em>
                <span className="val">{row.value}</span>
                {row.unit ? <span className="u">{row.unit}</span> : null}
              </em>
              {row.edit ? (
                <Pencil strokeWidth={1.75} aria-hidden />
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden>
                  <path d="M10.5 2.5l3 3L6 13H3v-3z" />
                </svg>
              )}
            </button>
          ))}
        </div>
        <Button
          variant="signal"
          size="lg"
          block
          className="dm-signup__cta"
          onClick={() => setPhase("calc")}
        >
          Calculate my answer
        </Button>

        <BottomSheet
          open={editId !== null}
          onClose={() => setEditId(null)}
          title={editId === "today" ? "Workload today" : "After the baby"}
        >
          <NumberEdit
            value={editDraft}
            onChange={setEditDraft}
            unit="%"
            allowDecimal={false}
            maxLength={3}
            onCancel={() => setEditId(null)}
            onSave={saveEdit}
            saveDisabled={!editDraft}
          />
        </BottomSheet>
      </>,
    );
  }

  const value = q === 1 ? today : after;
  const setValue = q === 1 ? setToday : setAfter;

  return shell(
    <>
      <StepProg
        step={q}
        of={2}
        onBack={() => {
          if (q === 2) {
            setQ(1);
            return;
          }
          onBack?.();
        }}
      />

      <div className="dm-mode" role="radiogroup" aria-label="Answer by">
        <button
          type="button"
          role="radio"
          aria-checked={mode === "speak"}
          onClick={() => setMode("speak")}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <rect x="6" y="2" width="4" height="7.5" rx="2" />
            <path d="M3.5 7.5a4.5 4.5 0 0 0 9 0M8 12v2" />
          </svg>
          Speak
        </button>
        <button
          type="button"
          role="radio"
          aria-checked={mode === "type"}
          onClick={() => setMode("type")}
        >
          <svg viewBox="0 0 16 16" aria-hidden>
            <rect x="1.5" y="4" width="13" height="8" rx="1.5" />
            <path d="M4.5 7h.01M8 7h.01M11.5 7h.01M5 9.5h6" />
          </svg>
          Type
        </button>
      </div>

      <p className="dm-q">
        {q === 1 ? "How much do you work today?" : "And after the baby?"}
      </p>

      {mode === "type" ? (
        <div className="dm-stack" style={{ gap: 14 }}>
          <div className="dm-stepper">
            <button type="button" aria-label="Less" onClick={() => bump(-10)}>
              −
            </button>
            <output>{value} %</output>
            <button type="button" aria-label="More" onClick={() => bump(10)}>
              +
            </button>
          </div>
          <div className="dm-row">
            {PRESETS.map((p) => (
              <Chip
                key={p}
                pressed={value === p}
                onClick={() => setValue(p)}
                data-v={p}
              >
                {p === 100 ? "Full time" : `${p} %`}
              </Chip>
            ))}
          </div>
        </div>
      ) : (
        <div className="dm-stack" style={{ gap: 14 }}>
          <p className="dm-small dm-muted" style={{ margin: 0 }}>
            Say it your way, for example &quot;four days a week&quot; or &quot;80
            percent&quot;.
          </p>
          <div
            style={{
              display: "grid",
              placeItems: "center",
              gap: 10,
              padding: "8px 0",
            }}
          >
            <button
              type="button"
              className="dm-speakbtn"
              aria-label="Start speaking"
              onClick={() => {
                // Demo: treat speak as picking 80 %
                setValue(80);
                setMode("type");
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden>
                <rect x="9" y="3" width="6" height="11" rx="3" />
                <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
              </svg>
            </button>
            <span className="dm-label">Tap and talk</span>
          </div>
        </div>
      )}

      <div className="dm-row" style={{ marginTop: "auto", flexWrap: "nowrap" }}>
        <Button
          variant="secondary"
          onClick={() => {
            if (q === 2) {
              setQ(1);
              return;
            }
            onBack?.();
          }}
        >
          Back
        </Button>
        <Button
          variant="primary"
          block
          onClick={() => {
            if (q === 1) {
              setQ(2);
              return;
            }
            setPhase("check");
          }}
        >
          Next
        </Button>
      </div>
    </>,
  );
}
