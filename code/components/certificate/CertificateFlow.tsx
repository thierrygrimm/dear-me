"use client";

import { Button } from "@/components/ui/Button";
import { ChatSteps } from "@/components/chat/ChatSteps";
import { SourceTag } from "@/components/data/SourceTag";
import { formatCHF, formatPercent } from "@/lib/format";
import { markCertificate, sampleCert, type CertValues } from "@/lib/session";
import { cn } from "@/lib/cn";
import {
  Camera,
  ChevronLeft,
  ChevronRight,
  FileUp,
  KeyRound,
  Mail,
  Pencil,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Step = "choose" | "scan" | "explain" | "confirm";

type Way = {
  id: string;
  title: string;
  time: string;
  fastest?: boolean;
  Icon: typeof Camera;
  action: Step | "estimate";
};

const ways: Way[] = [
  {
    id: "scan",
    title: "Scan your certificate",
    time: "About 1 min",
    fastest: true,
    Icon: Camera,
    action: "scan",
  },
  {
    id: "upload",
    title: "Upload the PDF",
    time: "About 1 min",
    Icon: FileUp,
    action: "scan",
  },
  {
    id: "mypax",
    title: "Log in with myPax",
    time: "About 2 min",
    Icon: KeyRound,
    action: "explain",
  },
  {
    id: "type",
    title: "Type three numbers",
    time: "About 2 min",
    Icon: Pencil,
    action: "confirm",
  },
  {
    id: "hr",
    title: "Ask your employer",
    time: "We draft the email",
    Icon: Mail,
    action: "estimate",
  },
];

type Story = {
  id: string;
  term: string;
  title: string;
  value: string;
  body: string;
  cue: string;
  ground: string;
  ink?: string;
};

function storiesFrom(v: CertValues): Story[] {
  return [
    {
      id: "salary",
      term: "Versicherter Lohn",
      title: "Insured salary",
      value: formatCHF(v.insuredSalary, { exact: true }),
      body: "The pay your fund uses for the maths — not always your full salary.",
      cue: "Like nuts for winter: about 16 months of your salary in savings later.",
      ground: "var(--hafermilch)",
    },
    {
      id: "savings",
      term: "Altersguthaben",
      title: "Savings today",
      value: formatCHF(v.savings, { exact: true }),
      body: "What has already been put aside in your employer's fund.",
      cue: "This number grows with every contribution and the fund's return.",
      ground: "var(--rosa-brille)",
      ink: "var(--on-family-soft)",
    },
    {
      id: "pension",
      term: "Voraussichtliche Rente",
      title: "Pension at 65",
      value: `${formatCHF(v.pensionAt65)} / mo`,
      body: "A projection from the fund — marked Calculated, not a promise.",
      cue: "We'll compare this with what you might need later on.",
      ground: "var(--neonweste)",
    },
    {
      id: "rate",
      term: "Umwandlungssatz",
      title: "Conversion rate",
      value: formatPercent(v.conversionRate),
      body: "How savings turn into a monthly pension. Small shifts matter a lot.",
      cue: "Tap any number later to see where it came from.",
      ground: "var(--hafermilch)",
    },
    {
      id: "buyin",
      term: "Einkaufspotenzial",
      title: "Buy-in potential",
      value: formatCHF(v.buyIn, { exact: true }),
      body: "Room left to pay in more, often with a tax effect.",
      cue: "You don't need to fill it. Knowing the room is enough for now.",
      ground: "var(--espressosatz)",
      ink: "var(--briefpapier)",
    },
  ];
}

type Props = {
  onDone?: (values: CertValues) => void;
  onEstimate?: () => void;
  onClose?: () => void;
};

export function CertificateFlow({ onDone, onEstimate, onClose }: Props) {
  const [step, setStep] = useState<Step>("choose");
  const [card, setCard] = useState(0);
  const [scanPhase, setScanPhase] = useState<"aim" | "lock" | "flash" | "read">(
    "aim",
  );
  const [values, setValues] = useState<CertValues>(sampleCert);
  const stories = useMemo(() => storiesFrom(values), [values]);

  useEffect(() => {
    if (step !== "scan") return;
    const t1 = window.setTimeout(() => setScanPhase("lock"), 900);
    const t2 = window.setTimeout(() => setScanPhase("flash"), 1600);
    const t3 = window.setTimeout(() => setScanPhase("read"), 2100);
    const t4 = window.setTimeout(() => {
      setCard(0);
      setStep("explain");
    }, 4200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [step]);

  function choose(way: Way) {
    if (way.action === "estimate") {
      onEstimate?.();
      return;
    }
    if (way.action === "scan") {
      setScanPhase("aim");
      setStep("scan");
    } else if (way.action === "explain") {
      setCard(0);
      setStep("explain");
    } else setStep("confirm");
  }

  function confirm() {
    markCertificate(values);
    onDone?.(values);
  }

  if (step === "choose") {
    return (
      <div className="dm-stack" style={{ gap: 12 }}>
        <header className="dm-appbar">
          {onClose ? (
            <button type="button" aria-label="Back" onClick={onClose}>
              <ChevronLeft strokeWidth={1.75} />
            </button>
          ) : (
            <span />
          )}
          <span className="dm-label">Your certificate</span>
          <span />
        </header>
        <h1 className="dm-hello" style={{ fontSize: 26 }}>
          How do you want to start?
        </h1>
        <p className="dm-muted" style={{ margin: 0 }}>
          We only keep the numbers you confirm. Photos are processed and then
          deleted.
        </p>
        <div className="dm-stack" style={{ gap: 8 }}>
          {ways.map((w) => (
            <button
              key={w.id}
              type="button"
              className="dm-way"
              onClick={() => choose(w)}
            >
              <span className="ic">
                <w.Icon strokeWidth={1.75} />
              </span>
              <b>{w.title}</b>
              <small>{w.time}</small>
              {w.fastest ? <em>Fastest</em> : <em style={{ opacity: 0 }}>—</em>}
            </button>
          ))}
        </div>
        <Button variant="text" onClick={() => onEstimate?.()}>
          Don&apos;t have it? An estimate works too.
        </Button>
      </div>
    );
  }

  if (step === "scan") {
    return (
      <div className="dm-stack" style={{ gap: 14, flex: 1, minHeight: 0 }}>
        <header className="dm-appbar">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setStep("choose")}
          >
            <ChevronLeft strokeWidth={1.75} />
          </button>
          <span className="dm-label">Scan</span>
          <span />
        </header>
        <div
          className={cn(
            "dm-cam",
            scanPhase === "lock" && "is-lock",
            scanPhase === "flash" && "is-shot",
          )}
          style={{ minHeight: 360, borderRadius: 20 }}
        >
          <div className="dm-cam__hint">
            {scanPhase === "aim" && "Hold still"}
            {scanPhase === "lock" && "Locking onto the page"}
            {scanPhase === "flash" && "Got it"}
            {scanPhase === "read" && "Found 5 numbers"}
          </div>
          <div className="dm-cam__doc" aria-hidden>
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="dm-cam__frame" aria-hidden>
            <b />
            <b />
            <b />
            <b />
          </div>
          <div className="dm-cam__flash" />
          <button type="button" className="dm-cam__shutter" aria-label="Capture">
            <i />
          </button>
        </div>
        {scanPhase === "read" ? (
          <ChatSteps
            steps={[
              { id: "1", label: "Reading the page", done: true },
              { id: "2", label: "Finding the five numbers", done: true },
              { id: "3", label: "Preparing your story cards", done: true },
            ]}
            collapsedSummary="Found 5 numbers on your certificate."
          />
        ) : null}
      </div>
    );
  }

  if (step === "explain") {
    const s = stories[card]!;
    const last = card === stories.length - 1;
    return (
      <div className="dm-cx" style={{ minHeight: 520 }}>
        <header className="dm-appbar">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setStep("choose")}
          >
            <ChevronLeft strokeWidth={1.75} />
          </button>
          <span className="dm-label">Understand</span>
          <SourceTag label="Certificate" />
        </header>

        <div className="dm-cx__paper" aria-hidden>
          <h5>Pension certificate · sample</h5>
          {stories.map((line, i) => (
            <div
              key={line.id}
              className={cn(
                "dm-cx__ln",
                i === card && "on",
                i < card && "seen",
              )}
              onClick={() => setCard(i)}
              onKeyDown={() => undefined}
              role="presentation"
            >
              <span>{line.title}</span>
              <span>{line.value}</span>
            </div>
          ))}
        </div>

        <div className="dm-cx__stage">
          <article
            className="dm-cx__card"
            style={{ background: s.ground, color: s.ink ?? "var(--ink)" }}
          >
            <small>{s.term}</small>
            <h3>{s.title}</h3>
            <div className="num">{s.value}</div>
            <p>{s.body}</p>
            <div className="you">
              <svg viewBox="0 0 20 20" aria-hidden className="dm-glyph">
                <path d="M10 2 L18 10 L10 18 L2 10 Z" />
              </svg>
              <span>{s.cue}</span>
            </div>
          </article>
        </div>

        <div className="dm-cx__nav">
          <button
            type="button"
            aria-label="Previous"
            disabled={card === 0}
            onClick={() => setCard((c) => Math.max(0, c - 1))}
          >
            <ChevronLeft strokeWidth={2} />
          </button>
          <div className="dm-cx__dots" aria-hidden>
            {stories.map((_, i) => (
              <i
                key={i}
                className={cn(i === card && "on", i < card && "seen")}
              />
            ))}
          </div>
          <button
            type="button"
            className={last ? "fw" : undefined}
            aria-label={last ? "Continue" : "Next"}
            onClick={() => {
              if (last) setStep("confirm");
              else setCard((c) => c + 1);
            }}
          >
            <ChevronRight strokeWidth={2} />
          </button>
        </div>
      </div>
    );
  }

  // confirm
  return (
    <div className="dm-read">
      <header className="dm-appbar">
        <button
          type="button"
          aria-label="Back"
          onClick={() => setStep("explain")}
        >
          <ChevronLeft strokeWidth={1.75} />
        </button>
        <span className="dm-label">Check</span>
        <span />
      </header>
      <h2>Did we read it right?</h2>
      <div className="dm-thumbdoc" aria-hidden>
        <i className="hl" />
        <i className="hl" />
        <i />
        <i className="hl" />
        <i />
      </div>
      {(
        [
          ["Insured salary", "insuredSalary"],
          ["Savings today", "savings"],
          ["Conversion rate", "conversionRate"],
        ] as const
      ).map(([label, key]) => (
        <button
          key={key}
          type="button"
          className="dm-row-edit"
          onClick={() => {
            const next = window.prompt(`Edit ${label}`, String(values[key]));
            if (!next) return;
            const n = Number(next.replace(/[^0-9.]/g, ""));
            if (!Number.isFinite(n)) return;
            setValues((v) => ({ ...v, [key]: n }));
          }}
        >
          <b>{label}</b>
          <span>From your certificate</span>
          <em>
            {key === "conversionRate"
              ? formatPercent(values[key])
              : formatCHF(values[key], { exact: true })}
          </em>
          <Pencil size={14} strokeWidth={1.75} aria-hidden />
        </button>
      ))}
      <button type="button" className="more">
        Fund projections are marked Calculated. <u>How?</u>
      </button>
      <Button variant="signal" block onClick={confirm}>
        Yes, that&apos;s right
      </Button>
      <Button variant="tonal" block onClick={() => setStep("scan")}>
        Take the photo again
      </Button>
    </div>
  );
}
