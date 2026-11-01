"use client";

import { Button } from "@/components/ui/Button";
import { NumberEdit } from "@/components/ui/NumberEdit";
import { BottomSheet } from "@/components/feedback/BottomSheet";
import { ChatSteps } from "@/components/chat/ChatSteps";
import { useToast } from "@/components/feedback/Toast";
import { formatSwiss } from "@/lib/format";
import { markCertificate, sampleCert, type CertValues } from "@/lib/session";
import { cn } from "@/lib/cn";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type Step = "choose" | "scan" | "explain" | "confirm";
type SheetId = "scan" | "pdf" | "pax" | "type" | "mail" | "edit" | "why" | null;

type Way = {
  id: SheetId & string;
  title: string;
  time: string;
  fastest?: boolean;
  icon: ReactNode;
};

const wayIcon = {
  scan: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
      <circle cx="12" cy="13" r="3.5" />
    </svg>
  ),
  pdf: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 13h6M9 17h6" />
    </svg>
  ),
  pax: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <circle cx="8" cy="12" r="3.5" />
      <path d="M11.5 12H21M17 12v3M20 12v2" />
    </svg>
  ),
  type: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <path d="M15 4l5 5-11 11H4v-5z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
};

const ways: Way[] = [
  {
    id: "scan",
    title: "Scan your certificate",
    time: "Paper or screen, 20 seconds",
    fastest: true,
    icon: wayIcon.scan,
  },
  {
    id: "pdf",
    title: "Upload the PDF",
    time: "From your email or files",
    icon: wayIcon.pdf,
  },
  {
    id: "pax",
    title: "Log in with myPax",
    time: "If you're insured with Pax",
    icon: wayIcon.pax,
  },
  {
    id: "type",
    title: "Type three numbers",
    time: "We show you where to find them",
    icon: wayIcon.type,
  },
  {
    id: "mail",
    title: "Ask your employer",
    time: "We write the email for you",
    icon: wayIcon.mail,
  },
];

const pdfFiles = [
  {
    name: "Pensionskassenausweis_2026.pdf",
    meta: "Downloads · 12 Oct",
    toast: "Reading Pensionskassenausweis_2026.pdf…",
  },
  {
    name: "Lohnausweis_2025.pdf",
    meta: "Downloads · 3 Feb",
    toast: "Reading Lohnausweis_2025.pdf…",
  },
  {
    name: "Vorsorgeausweis_alt.pdf",
    meta: "Mail · 2025",
    toast: "Reading Vorsorgeausweis_alt.pdf…",
  },
];

const NUT = (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path
      d="M5 10h14a7 8 0 0 1-7 11 7 8 0 0 1-7-11z"
      fill="var(--pflaumenkuchen)"
    />
    <rect
      x="4"
      y="6"
      width="16"
      height="5"
      rx="2.5"
      fill="var(--pflaumenkuchen)"
    />
    <path
      d="M12 6V3"
      stroke="var(--pflaumenkuchen)"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

type Story = {
  id: string;
  term: string;
  title: string;
  value: string;
  unit: string;
  body: string;
  cue: string;
  ground: string;
  ink?: string;
  art: ReactNode;
};

function storiesFrom(v: CertValues): Story[] {
  return [
    {
      id: "salary",
      term: "versicherter Lohn",
      title: "Insured salary",
      value: formatSwiss(v.insuredSalary),
      unit: "CHF",
      body: "The part of your salary your pension fund covers.",
      cue: "At 60 % it shrinks to about 30'000, because a fixed slice is taken off first.",
      ground: "var(--hafermilch)",
      art: (
        <svg className="art" viewBox="0 0 120 120" aria-hidden>
          <rect x="34" y="70" width="52" height="14" rx="7" fill="var(--brombeerkompott)" />
          <rect x="40" y="54" width="52" height="14" rx="7" fill="var(--kaugummi)" />
          <rect
            x="30"
            y="38"
            width="52"
            height="14"
            rx="7"
            fill="var(--brombeerkompott)"
            opacity=".5"
          />
        </svg>
      ),
    },
    {
      id: "savings",
      term: "Altersguthaben",
      title: "Savings today",
      value: formatSwiss(v.savings),
      unit: "CHF",
      body: "What you have put aside in your fund so far, with interest.",
      cue: "Like nuts for winter: about 16 months of your salary, already saved. It moves with you if you change jobs.",
      ground: "var(--rosa-brille)",
      art: (
        <svg className="art" viewBox="0 0 120 120" aria-hidden>
          <g fill="var(--brombeerkompott)">
            <path d="M40 52h24a12 12 0 0 1-12 22 12 12 0 0 1-12-22z" />
            <rect
              x="38"
              y="44"
              width="28"
              height="9"
              rx="4.5"
              fill="var(--pflaumenkuchen)"
            />
            <path
              d="M72 66h20a10 10 0 0 1-10 18 10 10 0 0 1-10-18z"
              opacity=".6"
            />
            <rect
              x="70"
              y="59"
              width="24"
              height="8"
              rx="4"
              fill="var(--pflaumenkuchen)"
              opacity=".6"
            />
          </g>
        </svg>
      ),
    },
    {
      id: "pension",
      term: "projizierte Altersrente",
      title: "Pension at 65",
      value: formatSwiss(v.pensionAt65),
      unit: "CHF / month",
      body: "What your fund expects to pay you every month from 65, if you keep working as today.",
      cue: "At 60 % after the baby it would be about 1'060 a month.",
      ground: "var(--neonweste)",
      art: (
        <svg className="art" viewBox="0 0 120 120" aria-hidden>
          <circle cx="70" cy="74" r="24" fill="var(--espressosatz)" />
          <g
            stroke="var(--espressosatz)"
            strokeWidth="5"
            strokeLinecap="round"
          >
            <path d="M70 36v-10M98 46l7-7M42 46l-7-7" />
          </g>
          <rect x="20" y="74" width="100" height="40" fill="var(--neonweste)" />
        </svg>
      ),
    },
    {
      id: "rate",
      term: "Umwandlungssatz",
      title: "Conversion rate",
      value: formatSwiss(v.conversionRate, 1),
      unit: "%",
      body: "How your savings turn into a pension.",
      cue: "Every 100'000 you save becomes 6'000 a year, that's 500 a month.",
      ground: "var(--hafermilch)",
      art: (
        <svg className="art" viewBox="0 0 120 120" aria-hidden>
          <path
            d="M34 34h56L68 64v22l-12 8V64z"
            fill="var(--brombeerkompott)"
          />
          <circle cx="48" cy="24" r="6" fill="var(--kaugummi)" />
          <circle cx="64" cy="20" r="6" fill="var(--kaugummi)" />
          <circle cx="78" cy="26" r="6" fill="var(--kaugummi)" />
        </svg>
      ),
    },
    {
      id: "buyin",
      term: "Einkaufspotenzial",
      title: "Buy-in potential",
      value: formatSwiss(v.buyIn),
      unit: "CHF",
      body: "How much you could pay in on top, voluntarily.",
      cue: "Every franc you pay in lowers your taxes. Not urgent now, nice to know for later.",
      ground: "var(--rosa-brille)",
      art: (
        <svg className="art" viewBox="0 0 120 120" aria-hidden>
          <rect
            x="56"
            y="30"
            width="18"
            height="60"
            rx="9"
            fill="var(--brombeerkompott)"
          />
          <rect
            x="35"
            y="51"
            width="60"
            height="18"
            rx="9"
            fill="var(--brombeerkompott)"
          />
        </svg>
      ),
    },
  ];
}

type EditField = "insuredSalary" | "savings" | "conversionRate";

type Props = {
  onDone?: (values: CertValues) => void;
  /** Kept for callers; estimate is reached from Home, not this footer. */
  onEstimate?: () => void;
  onClose?: () => void;
};

export function CertificateFlow({ onDone, onClose }: Props) {
  const toast = useToast();
  const [step, setStep] = useState<Step>("choose");
  const [sheet, setSheet] = useState<SheetId>(null);
  const [card, setCard] = useState(0);
  const [scanPhase, setScanPhase] = useState<"place" | "lock" | "flash" | "found">(
    "place",
  );
  const [values, setValues] = useState<CertValues>(sampleCert);
  const [typed, setTyped] = useState({
    insuredSalary: "",
    savings: "",
    conversionRate: "",
  });
  const [editField, setEditField] = useState<EditField | null>(null);
  const [editBuf, setEditBuf] = useState("");
  const swipeX = useRef<number | null>(null);

  const stories = useMemo(() => storiesFrom(values), [values]);
  const paperLines = useMemo(
    () => [
      { title: "Insured salary", value: formatSwiss(values.insuredSalary) },
      { title: "Savings today", value: formatSwiss(values.savings) },
      {
        title: "Pension at 65",
        value: `${formatSwiss(values.pensionAt65)} / mo`,
      },
      {
        title: "Conversion rate",
        value: `${formatSwiss(values.conversionRate, 1)} %`,
      },
      { title: "Buy-in potential", value: formatSwiss(values.buyIn) },
    ],
    [values],
  );

  useEffect(() => {
    if (step !== "scan") return;
    setScanPhase("place");
    const t1 = window.setTimeout(() => setScanPhase("lock"), 1400);
    const t2 = window.setTimeout(() => setScanPhase("flash"), 2600);
    const t3 = window.setTimeout(() => setScanPhase("found"), 4200);
    const t4 = window.setTimeout(() => {
      setCard(0);
      setStep("explain");
    }, 5200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(t4);
    };
  }, [step]);

  function closeSheet() {
    setSheet(null);
  }

  function startScan() {
    closeSheet();
    setScanPhase("place");
    setStep("scan");
  }

  function goExplain(message?: string, delayMs = 0) {
    closeSheet();
    if (message) toast.show({ message });
    const start = () => {
      setCard(0);
      setStep("explain");
    };
    if (delayMs > 0) window.setTimeout(start, delayMs);
    else start();
  }

  function pickPdf(file: (typeof pdfFiles)[number]) {
    goExplain(file.toast, 900);
  }

  function confirm() {
    markCertificate(values);
    onDone?.(values);
  }

  function openEdit(field: EditField) {
    setEditField(field);
    setEditBuf(String(values[field]));
    setSheet("edit");
  }

  function saveEdit() {
    if (!editField || editBuf === "") {
      closeSheet();
      return;
    }
    const n = Number(editBuf);
    if (!Number.isFinite(n)) {
      closeSheet();
      return;
    }
    setValues((v) => ({ ...v, [editField]: n }));
    closeSheet();
    toast.show({ message: "Updated · answers recalculated", undoLabel: "See" });
  }

  const scanHint =
    scanPhase === "place"
      ? "Place your certificate in the frame"
      : scanPhase === "lock"
        ? "Hold still…"
        : scanPhase === "flash"
          ? "Got it. Reading 5 numbers…"
          : "Found 5 numbers";

  /* ── B · Full-bleed scan ── */
  if (step === "scan") {
    return (
      <div className="dm-cert-main dm-cert-main--bleed">
        <div
          className={cn(
            "dm-cam",
            scanPhase === "lock" && "is-lock",
            (scanPhase === "flash" || scanPhase === "found") && "is-shot",
          )}
        >
          <div className="dm-cam__hint">{scanHint}</div>
          <div className="dm-cam__doc" aria-hidden>
            <b
              style={{
                font: "700 9px/1 var(--font-display)",
                color: "#0A0507",
              }}
            >
              Pension certificate 2026
            </b>
            <i style={{ width: "60%" }} />
            <i />
            <i style={{ width: "80%" }} />
            <i />
            <i style={{ width: "70%" }} />
            <i />
            <i style={{ width: "50%" }} />
            <i />
            <i style={{ width: "90%" }} />
          </div>
          <div className="dm-cam__frame" aria-hidden>
            <b />
            <b />
            <b />
            <b />
          </div>
          <div className="dm-cam__flash" />
          <button
            type="button"
            className="dm-cam__shutter"
            aria-label="Capture"
            onClick={() => {
              setScanPhase("place");
              setStep("scan");
            }}
          >
            <i />
          </button>
        </div>
        {scanPhase === "found" ? (
          <div
            style={{
              position: "absolute",
              left: 16,
              right: 16,
              bottom: 96,
              zIndex: 2,
            }}
          >
            <ChatSteps
              steps={[
                { id: "1", label: "Reading the page", done: true },
                { id: "2", label: "Finding the five numbers", done: true },
                { id: "3", label: "Preparing your story cards", done: true },
              ]}
              collapsedSummary="Found 5 numbers"
            />
          </div>
        ) : null}
        <button
          type="button"
          aria-label="Back"
          onClick={() => setStep("choose")}
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 3,
            all: "unset",
            cursor: "pointer",
            width: 40,
            height: 40,
            display: "grid",
            placeItems: "center",
            borderRadius: "50%",
            background: "rgba(0,0,0,.35)",
            color: "var(--briefpapier)",
          }}
        >
          <ChevronLeft strokeWidth={1.75} />
        </button>
      </div>
    );
  }

  /* ── C · Story cards ── */
  if (step === "explain") {
    const lastStory = card === stories.length;
    return (
      <div className="dm-cert-pane">
      <div className="dm-cert-main">
      <div className="dm-stack" style={{ gap: 12, flex: 1, minHeight: 0 }}>
        <header className="dm-appbar">
          <button
            type="button"
            aria-label="Back"
            onClick={() => setStep("choose")}
          >
            <ChevronLeft strokeWidth={1.75} />
          </button>
          <b style={{ font: "600 16px/20px var(--font-text)" }}>
            Your certificate
          </b>
          <span
            className="dm-small dm-muted"
            style={{ width: 36, textAlign: "right" }}
          >
            {lastStory ? "Done" : `${card + 1}/5`}
          </span>
        </header>

        <div className="dm-cx" style={{ flex: 1, minHeight: 0 }}>
          <div className="dm-cx__paper" aria-hidden>
            <h5>Pension certificate 2026</h5>
            <div className="dm-cx__bars">
              <i style={{ width: "70%" }} />
            </div>
            {paperLines.map((line, i) => (
              <div
                key={line.title}
                className={cn(
                  "dm-cx__ln",
                  i === card && !lastStory && "on",
                  i < card && "seen",
                )}
                onClick={() => setCard(i)}
                role="presentation"
              >
                <span>{line.title}</span>
                <span>{line.value}</span>
              </div>
            ))}
            <div className="dm-cx__bars">
              <i style={{ width: "90%" }} />
              <i style={{ width: "55%" }} />
            </div>
          </div>

          <div
            className="dm-cx__stage"
            onPointerDown={(e) => {
              swipeX.current = e.clientX;
            }}
            onPointerUp={(e) => {
              if (swipeX.current === null) return;
              const dx = e.clientX - swipeX.current;
              swipeX.current = null;
              if (dx < -40) setCard((c) => Math.min(stories.length, c + 1));
              else if (dx > 40) setCard((c) => Math.max(0, c - 1));
            }}
          >
            {stories.map((story, i) => (
              <article
                key={story.id}
                className={cn(
                  "dm-cx__card",
                  i < card && "left",
                  i > card && "right",
                )}
                style={{
                  background: story.ground,
                  color: story.ink ?? "var(--ink)",
                }}
              >
                {story.art}
                <small>{story.term}</small>
                <h3>{story.title}</h3>
                <div className="num">
                  {story.value}
                  <em>{story.unit}</em>
                </div>
                <p>{story.body}</p>
                <p className="you">
                  {NUT}
                  <span>{story.cue}</span>
                </p>
              </article>
            ))}
            <article
              className={cn(
                "dm-cx__card",
                card < stories.length && "right",
                card > stories.length && "left",
              )}
              style={{
                background: "var(--espressosatz)",
                color: "var(--briefpapier)",
              }}
            >
              <small style={{ opacity: 1, color: "var(--neonweste)" }}>
                5 of 5
              </small>
              <h3
                style={{
                  font: "700 26px/30px var(--font-display)",
                  marginTop: 8,
                }}
              >
                That&apos;s your whole certificate.
              </h3>
              <p style={{ opacity: 0.8 }}>
                You now know more about it than most people in Switzerland.
              </p>
              <Button
                variant="signal"
                block
                style={{ marginTop: "auto" }}
                onClick={() => setStep("confirm")}
              >
                See what 60 % does to it
              </Button>
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
              className={card >= stories.length - 1 ? "fw" : undefined}
              aria-label={lastStory ? "Continue" : "Next"}
              disabled={card >= stories.length}
              onClick={() => setCard((c) => Math.min(stories.length, c + 1))}
            >
              <ChevronRight strokeWidth={2} />
            </button>
          </div>
        </div>
      </div>
      </div>
      </div>
    );
  }

  /* ── D · Confirm ── */
  if (step === "confirm") {
    const editMeta: Record<
      EditField,
      { label: string; unit: string; dec: number; line: string }
    > = {
      insuredSalary: {
        label: "Insured salary",
        unit: "CHF",
        dec: 0,
        line: "Line 4",
      },
      savings: {
        label: "Savings today",
        unit: "CHF",
        dec: 0,
        line: "Line 7",
      },
      conversionRate: {
        label: "Conversion rate",
        unit: "%",
        dec: 1,
        line: "Line 12",
      },
    };

    return (
      <div className="dm-cert-pane">
        <div className="dm-cert-main">
          <div className="dm-read" style={{ flex: 1 }}>
            <header className="dm-appbar">
              <button
                type="button"
                aria-label="Back"
                onClick={() => setStep("explain")}
              >
                <ChevronLeft strokeWidth={1.75} />
              </button>
              <span />
              <span style={{ width: 36 }} />
            </header>

            <div className="dm-thumbdoc" aria-hidden>
              <i style={{ width: "60%" }} />
              <i className="hl" />
              <i />
              <i className="hl" style={{ width: "80%" }} />
              <i />
              <i className="hl" style={{ width: "70%" }} />
              <i style={{ width: "50%" }} />
            </div>

            <h2>Did we read it right?</h2>

            {(
              ["insuredSalary", "savings", "conversionRate"] as const
            ).map((key) => {
              const meta = editMeta[key];
              return (
                <button
                  key={key}
                  type="button"
                  className="dm-row-edit"
                  data-edit
                  onClick={() => openEdit(key)}
                >
                  <b>{meta.label}</b>
                  <span className="s">{meta.line}</span>
                  <em>
                    <span className="val">
                      {formatSwiss(values[key], meta.dec)}
                    </span>
                    <span className="u">{meta.unit}</span>
                  </em>
                  <svg viewBox="0 0 16 16" aria-hidden>
                    <path d="M10.5 2.5l3 3L6 13H3v-3z" />
                  </svg>
                </button>
              );
            })}

            <button
              type="button"
              className="more is-calc dm-fact"
              onClick={() => setSheet("why")}
            >
              Your fund also projects your pension. <u>How?</u>
            </button>

            <div
              style={{
                marginTop: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <Button variant="signal" block size="lg" onClick={confirm}>
                Yes, that&apos;s right
              </Button>
              <Button variant="text" onClick={startScan}>
                Take the photo again
              </Button>
            </div>
          </div>
        </div>

        <BottomSheet
          open={sheet === "edit" && !!editField}
          onClose={closeSheet}
        >
          {editField ? (
            <NumberEdit
              label={editMeta[editField].label}
              value={editBuf}
              onChange={setEditBuf}
              unit={editMeta[editField].unit}
              wasLabel={`On your certificate: ${formatSwiss(sampleCert[editField], editMeta[editField].dec)}`}
              allowDecimal={editField === "conversionRate"}
              maxLength={editField === "conversionRate" ? 5 : 8}
              onCancel={closeSheet}
              onSave={saveEdit}
              saveDisabled={
                editBuf === "" || Number(editBuf) === values[editField]
              }
            />
          ) : null}
        </BottomSheet>

        <BottomSheet open={sheet === "why"} onClose={closeSheet}>
          <div className="dm-why">
            <h4 className="t">Pension at 65</h4>
            <p className="d">
              Your fund projects this. It is not a fact you can change, it
              follows from the numbers above.
            </p>
            <div className="e">
              <div className="eq">
                <span>{formatSwiss(values.savings)} saved</span>
                <em>+</em>
                <span>future savings</span>
                <em>+</em>
                <span>interest</span>
                <em>×</em>
                <span>{formatSwiss(values.conversionRate, 1)} %</span>
              </div>
            </div>
            <p className="h" style={{ color: "var(--ink)" }}>
              Change your savings or conversion rate above and we recalculate.
              If your certificate is newer, scan it again.
            </p>
            <Button variant="secondary" block onClick={closeSheet}>
              Got it
            </Button>
          </div>
        </BottomSheet>
      </div>
    );
  }

  /* ── A · Choose how + preview sheets ── */
  return (
    <div className="dm-cert-pane">
      <div className="dm-cert-main dm-cert-main--choose">
        {onClose ? (
          <button
            type="button"
            className="dm-cert-back"
            aria-label="Back"
            onClick={onClose}
          >
            <ChevronLeft strokeWidth={1.75} />
          </button>
        ) : null}

        <p
          className="dm-q"
          style={{ fontSize: 22, lineHeight: "26px", margin: 0 }}
        >
          Let&apos;s get your pension fund numbers.
        </p>
        <span className="dm-small dm-muted">
          Pick what&apos;s easiest. You can always add more later.
        </span>

        <div className="dm-stack" style={{ gap: 8 }}>
          {ways.map((w) => (
            <button
              key={w.id}
              type="button"
              className="dm-way"
              onClick={() => setSheet(w.id)}
            >
              <span className="ic">{w.icon}</span>
              <b>{w.title}</b>
              <small>{w.time}</small>
              {w.fastest ? <em>Fastest</em> : null}
            </button>
          ))}
        </div>

        <p
          className="dm-small dm-muted"
          style={{ marginTop: "auto", marginBottom: 0 }}
        >
          Don&apos;t have it? An estimate works too.
        </p>
      </div>

      <BottomSheet
        open={sheet === "scan"}
        onClose={closeSheet}
        title="Scan your certificate"
        description="Lay it flat. We take the photo by ourselves."
      >
        <div className="dm-camsheet" aria-hidden>
          <span className="hint">Hold still…</span>
          <span className="doc" />
          <b style={{ top: 30, left: 70, borderRight: 0, borderBottom: 0 }} />
          <b style={{ top: 30, right: 70, borderLeft: 0, borderBottom: 0 }} />
          <b style={{ bottom: 30, left: 70, borderRight: 0, borderTop: 0 }} />
          <b style={{ bottom: 30, right: 70, borderLeft: 0, borderTop: 0 }} />
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={startScan}
        >
          Got it
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "pdf"}
        onClose={closeSheet}
        title="Add your certificate"
        description="A PDF or a photo of it works."
      >
        <button
          type="button"
          className="dm-browse"
          onClick={() => {
            toast.show({ message: "Opening your files…" });
            window.setTimeout(() => pickPdf(pdfFiles[0]), 700);
          }}
        >
          <svg viewBox="0 0 24 24" aria-hidden>
            <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
          </svg>
          Choose a file
          <small>PDF, JPG or PNG · from Files, Drive or email</small>
        </button>
        <p className="dm-recent">Recent</p>
        <div className="dm-filelist">
          {pdfFiles.map((f) => (
            <button
              key={f.name}
              type="button"
              className="dm-file"
              onClick={() => pickPdf(f)}
            >
              <span className="ic">PDF</span>
              <span>
                {f.name}
                <small>{f.meta}</small>
              </span>
              <span />
            </button>
          ))}
        </div>
      </BottomSheet>

      <BottomSheet open={sheet === "pax"} onClose={closeSheet}>
        <div className="dm-paxsheet">
          <span className="logo">Pax</span>
          <h4>Continue with myPax</h4>
          <p>We only read your pension certificate. Nothing else.</p>
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--paxfill dm-btn--block"
          onClick={() => goExplain("myPax connected · 9 numbers read")}
        >
          Continue to myPax
        </button>
        <button
          type="button"
          className="dm-btn dm-btn--text"
          onClick={closeSheet}
        >
          Not now
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "type"}
        onClose={closeSheet}
        title="Type three numbers"
        description="They are on your certificate, usually on the first page."
      >
        <div
          className="dm-thumbdoc"
          style={{ width: 96, height: 120, transform: "none" }}
          aria-hidden
        >
          <i style={{ width: "60%" }} />
          <i className="hl" />
          <i />
          <i className="hl" style={{ width: "80%" }} />
          <i className="hl" style={{ width: "70%" }} />
        </div>
        <div className="dm-field2">
          <label>Insured salary</label>
          <div>
            <input
              inputMode="decimal"
              placeholder="e.g. 61'365"
              value={typed.insuredSalary}
              onChange={(e) =>
                setTyped((t) => ({ ...t, insuredSalary: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="dm-field2">
          <label>Savings today</label>
          <div>
            <input
              inputMode="decimal"
              placeholder="e.g. 84'300"
              value={typed.savings}
              onChange={(e) =>
                setTyped((t) => ({ ...t, savings: e.target.value }))
              }
            />
          </div>
        </div>
        <div className="dm-field2">
          <label>Conversion rate</label>
          <div>
            <input
              inputMode="decimal"
              placeholder="e.g. 6.0 %"
              value={typed.conversionRate}
              onChange={(e) =>
                setTyped((t) => ({ ...t, conversionRate: e.target.value }))
              }
            />
          </div>
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            const next = { ...values };
            const sal = Number(typed.insuredSalary.replace(/[^0-9.]/g, ""));
            const sav = Number(typed.savings.replace(/[^0-9.]/g, ""));
            const rate = Number(typed.conversionRate.replace(/[^0-9.]/g, ""));
            if (Number.isFinite(sal) && sal > 0) next.insuredSalary = sal;
            if (Number.isFinite(sav) && sav > 0) next.savings = sav;
            if (Number.isFinite(rate) && rate > 0) next.conversionRate = rate;
            setValues(next);
            markCertificate(next);
            closeSheet();
            toast.show({ message: "Saved. You can scan it later." });
          }}
        >
          Save
        </button>
      </BottomSheet>

      <BottomSheet
        open={sheet === "mail"}
        onClose={closeSheet}
        title="We wrote it for you"
      >
        <div className="dm-mail">
          <span className="h">
            To <b>HR, your employer</b>
          </span>
          <span className="h">
            Subject <b>My pension fund certificate</b>
          </span>
          <span>
            Hello, could you send me my current pension fund certificate
            (Vorsorgeausweis) as a PDF? Thank you, Lena Meier
          </span>
        </div>
        <button
          type="button"
          className="dm-btn dm-btn--primary dm-btn--block"
          onClick={() => {
            closeSheet();
            toast.show({ message: "Opened in your mail app" });
          }}
        >
          Open in my mail app
        </button>
        <button
          type="button"
          className="dm-btn dm-btn--text"
          onClick={() => {
            const text =
              "Hello, could you send me my current pension fund certificate (Vorsorgeausweis) as a PDF? Thank you, Lena Meier";
            void navigator.clipboard?.writeText(text);
            toast.show({ message: "Copied" });
          }}
        >
          Copy text
        </button>
      </BottomSheet>
    </div>
  );
}
