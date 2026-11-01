"use client";

import { Squirrel } from "@/components/brand/Squirrel";
import { Button } from "@/components/ui/Button";
import {
  LESSON_CONTENT,
  type LessonId,
  markLessonDone,
} from "@/lib/lessons";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

type Props = {
  lessonId: LessonId;
  doneCount: number;
  totalCount: number;
  onClose: () => void;
  onComplete: (id: LessonId) => void;
};

const STACK = {
  state: 9,
  employer: 6,
  own: 3,
} as const;

const GROW = [
  { h: "8%", int: "2%", delay: "0.10s" },
  { h: "14%", int: "4%", delay: "0.17s" },
  { h: "20%", int: "7%", delay: "0.24s" },
  { h: "27%", int: "9%", delay: "0.31s" },
  { h: "35%", int: "12%", delay: "0.38s" },
  { h: "44%", int: "15%", delay: "0.45s" },
  { h: "55%", int: "19%", delay: "0.52s" },
  { h: "67%", int: "23%", delay: "0.59s" },
  { h: "80%", int: "28%", delay: "0.66s" },
  { h: "96%", int: "33%", delay: "0.73s" },
];

export function LessonPlayer({
  lessonId,
  doneCount,
  totalCount,
  onClose,
  onComplete,
}: Props) {
  const router = useRouter();
  const lesson = LESSON_CONTENT[lessonId];
  const [step, setStep] = useState(0);
  const [finished, setFinished] = useState(false);
  const [insuredWidth, setInsuredWidth] = useState("70%");
  const [quizPicked, setQuizPicked] = useState<null | boolean>(null);
  const [feedback, setFeedback] = useState(lesson.steps[lesson.steps.length - 1]?.body ?? "");

  const current = lesson.steps[step];
  const total = lesson.steps.length;

  useEffect(() => {
    if (current?.kind !== "bars") return;
    setInsuredWidth("70%");
    const t = window.setTimeout(() => setInsuredWidth("22%"), 500);
    return () => window.clearTimeout(t);
  }, [current?.kind, step]);

  function advance() {
    if (step < total - 1) {
      setStep((s) => s + 1);
      return;
    }
    markLessonDone(lessonId);
    onComplete(lessonId);
    setFinished(true);
  }

  if (finished) {
    return (
      <div
        className="dm-app-full"
        style={{
          background: "var(--neonweste)",
          padding: "24px 20px 18px",
          gap: 12,
        }}
      >
        <div style={{ flex: 1 }} className="ig-done">
          <div className="medal">
            <Squirrel state="done" size={72} />
          </div>
        </div>
        <small style={{ font: "600 12px/16px var(--font-text)" }}>
          Lesson done · {doneCount} of {totalCount}
        </small>
        <h4
          style={{
            margin: 0,
            font: "700 26px/30px var(--font-display)",
            letterSpacing: "-0.02em",
          }}
        >
          {lesson.doneTitle}
        </h4>
        <p style={{ margin: 0, font: "400 15px/22px var(--font-text)" }}>
          {lesson.doneBody}
        </p>
        <Button
          variant="primary"
          block
          onClick={() => router.push(lesson.doneCtaHref)}
        >
          {lesson.doneCta}
        </Button>
        <Button variant="text" className="dm-small" onClick={onClose}>
          Back to lessons
        </Button>
      </div>
    );
  }

  return (
    <div className="dm-app-full">
      <div className="dm-lesson" style={{ flex: 1, minHeight: 0 }}>
        <div className="dm-lesson__top">
          <div className="dm-lesson__bars" aria-hidden>
            {lesson.steps.map((_, i) => (
              <span key={i} className={i <= step ? "on" : undefined} />
            ))}
          </div>
          <button type="button" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 16 16" aria-hidden>
              <path d="M4 4l8 8M12 4l-8 8" />
            </svg>
          </button>
        </div>

        <div className="dm-step on" style={{ flexDirection: "column", height: "100%" }}>
          <div className="dm-lesson__art" style={{ background: current.artBg }}>
            {current.kind === "stacks" ? <StacksArt /> : null}
            {current.kind === "bars" ? (
              <BarsArt insuredWidth={insuredWidth} />
            ) : null}
            {current.kind === "grow" ? <GrowArt /> : null}
            {current.kind === "quiz" ? (
              <QuizArt
                answered={quizPicked !== null}
                onPick={(ok) => {
                  setQuizPicked(ok);
                  setFeedback(
                    ok
                      ? "Right. The fixed deduction makes the fund shrink fastest."
                      : "Close. It's the employer's fund, because of the fixed deduction.",
                  );
                }}
              />
            ) : null}
            {current.kind === "certs" ? <CertsArt /> : null}
            {current.kind === "tax" ? <TaxArt /> : null}
          </div>

          <div className="dm-lesson__body">
            <small>
              {step + 1} of {total}
            </small>
            <h4>{current.headline}</h4>
            <p className="qf">
              {current.kind === "quiz" && quizPicked !== null
                ? feedback
                : current.body}
            </p>
            <Button
              variant="primary"
              block
              style={{ marginTop: "auto" }}
              onClick={advance}
              disabled={current.kind === "quiz" && quizPicked === null}
            >
              {current.cta}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StackColumn({
  label,
  count,
  color,
  startDelay,
}: {
  label: string;
  count: number;
  color: string;
  startDelay: number;
}) {
  return (
    <div>
      {/* First in DOM + column-reverse ⇒ label sits under the stack */}
      <span>{label}</span>
      {Array.from({ length: count }, (_, i) => (
        <i
          key={`${label}-${i}`}
          style={{
            background: color,
            animationDelay: `${startDelay + i * 0.12}s`,
          }}
        />
      ))}
    </div>
  );
}

function StacksArt() {
  return (
    <div className="ig-stacks">
      <StackColumn
        label="The state"
        count={STACK.state}
        color="var(--espressosatz)"
        startDelay={0.2}
      />
      <StackColumn
        label="Employer"
        count={STACK.employer}
        color="var(--neonweste)"
        startDelay={0.25}
      />
      <StackColumn
        label="Your 3a"
        count={STACK.own}
        color="var(--kaugummi)"
        startDelay={0.3}
      />
    </div>
  );
}

function BarsArt({ insuredWidth }: { insuredWidth: string }) {
  return (
    <>
      <div className="ig-bars">
        <div className="row">
          Full time · salary CHF 92&apos;000
          <div className="bar">
            <span className="fix" />
            <span className="ins" />
          </div>
        </div>
        <div className="row">
          60 % · salary CHF 55&apos;200
          <div className="bar">
            <span className="fix" />
            <span className="ins" style={{ width: insuredWidth }} />
          </div>
        </div>
      </div>
      <div className="ig-legend">
        <span>
          <i
            style={{
              background:
                "repeating-linear-gradient(135deg,rgba(10,5,7,.35) 0 4px,rgba(10,5,7,.15) 4px 8px)",
            }}
          />
          Fixed deduction
        </span>
        <span>
          <i style={{ background: "#0A0507" }} />
          What your fund insures
        </span>
      </div>
    </>
  );
}

function GrowArt() {
  return (
    <>
      <div className="ig-grow">
        {GROW.map((g, i) => (
          <i
            key={i}
            style={
              {
                "--h": g.h,
                "--int": g.int,
                animationDelay: g.delay,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className="ig-years">
        <span>32</span>
        <span>45</span>
        <span>55</span>
        <span>65</span>
      </div>
    </>
  );
}

function QuizArt({
  answered,
  onPick,
}: {
  answered: boolean;
  onPick: (ok: boolean) => void;
}) {
  const options = [
    { label: "The state (AHV)", ok: false },
    { label: "Your employer's fund", ok: true },
    { label: "Your own 3a", ok: false },
  ];

  return (
    <div
      className="dm-quiz"
      style={{
        position: "absolute",
        left: 20,
        right: 20,
        top: 70,
        color: "#FAF7F0",
      }}
    >
      <p
        style={{
          margin: "0 0 6px",
          font: "700 20px/24px var(--font-display)",
        }}
      >
        Quick check: which source shrinks most when you go part-time?
      </p>
      {options.map((o) => (
        <button
          key={o.label}
          type="button"
          className={answered ? (o.ok ? "right" : "wrong") : undefined}
          disabled={answered}
          onClick={() => onPick(o.ok)}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function CertsArt() {
  const lines = [
    "Insured salary",
    "Projected pension",
    "Disability cover",
    "Survivors' cover",
    "Saved so far",
  ];
  return (
    <div
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        top: 72,
        bottom: 24,
        background: "#fff",
        borderRadius: 10,
        padding: "16px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        boxShadow: "0 8px 20px rgba(10,5,7,.1)",
      }}
    >
      {lines.map((label, i) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            font: "600 13px/16px var(--font-text)",
          }}
        >
          <span>{label}</span>
          <i
            style={{
              flex: 1,
              height: 6,
              borderRadius: 3,
              background: i === 1 ? "var(--neonweste)" : "var(--hafermilch)",
              maxWidth: 88,
            }}
          />
        </div>
      ))}
    </div>
  );
}

function TaxArt() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
      }}
    >
      <div style={{ textAlign: "center", color: "var(--neuschnee)" }}>
        <i
          style={{
            display: "block",
            width: 84,
            height: 104,
            margin: "0 auto 14px",
            background: "var(--kaugummi)",
            clipPath: "polygon(50% 0,100% 50%,50% 100%,0 50%)",
          }}
        />
        <b
          style={{
            display: "block",
            font: "700 22px/26px var(--font-display)",
          }}
        >
          About CHF 1&apos;900
        </b>
        <span style={{ font: "500 13px/18px var(--font-text)", opacity: 0.85 }}>
          tax room this year
        </span>
      </div>
    </div>
  );
}
