"use client";

import { Squirrel } from "@/components/brand/Squirrel";
import { Button } from "@/components/ui/Button";
import { getPersona, readPersonaId, type PersonaId } from "@/lib/personas";
import { wrappedFor, type WrappedStoryData } from "@/lib/wrapped";
import { Pause, Play, X } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const SLIDE_MS = 5200;
const SLIDE_COUNT = 9;
const LIGHT = /lime|blush|gum|cream|pink/;

type Props = {
  open: boolean;
  onClose: () => void;
  personaId?: PersonaId;
};

function formatChf(n: number) {
  return `CHF ${Math.round(n).toLocaleString("de-CH").replace(/,/g, "'")}`;
}

function NutRain({ count }: { count: number }) {
  const n = Math.min(count, 72);
  return (
    <div className="dm-rain" aria-hidden>
      {Array.from({ length: n }, (_, i) => (
        <i
          key={i}
          style={{ animationDelay: `${0.25 + ((i * 17) % 140) / 100}s` }}
        />
      ))}
    </div>
  );
}

function CountUp({ to, active }: { to: number; active: boolean }) {
  const [text, setText] = useState("CHF 0");
  useEffect(() => {
    if (!active) {
      setText("CHF 0");
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0 - 300) / 1400);
      const eased = p < 0 ? 0 : 1 - Math.pow(1 - Math.max(0, p), 3);
      setText(formatChf(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, active]);
  return <span className="dm-count dm-rise d1">{text}</span>;
}

function TypeLine({ text, active }: { text: string; active: boolean }) {
  const [out, setOut] = useState("");
  useEffect(() => {
    if (!active) {
      setOut("");
      return;
    }
    let k = 0;
    const timers: number[] = [];
    timers.push(
      window.setTimeout(function step() {
        k += 1;
        setOut(text.slice(0, k));
        if (k < text.length) timers.push(window.setTimeout(step, 28));
      }, 900),
    );
    return () => timers.forEach(clearTimeout);
  }, [text, active]);
  return <p className="dm-type dm-rise d2">{out}</p>;
}

function Slide({
  tone,
  on,
  children,
  style,
}: {
  tone: string;
  on: boolean;
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section
      className={`dm-slide dm-slide--${tone}${on ? " on" : ""}`}
      style={style}
      aria-hidden={!on}
    >
      {children}
    </section>
  );
}

function StorySlides({
  data,
  index,
}: {
  data: WrappedStoryData;
  index: number;
}) {
  const on = (i: number) => index === i;
  return (
    <>
      <Slide tone="espresso" on={on(0)}>
        <div className="bg">
          <div className="dm-marq l" style={{ top: 70, color: "var(--neonweste)" }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>2026</span>
            ))}
          </div>
          <div className="dm-marq r o" style={{ top: 190 }}>
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>2026</span>
            ))}
          </div>
          <div
            className="dm-marq l"
            style={{ top: 310, color: "var(--abschlusspink)" }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <span key={i}>2026</span>
            ))}
          </div>
        </div>
        <div style={{ marginTop: "auto" }} className="dm-rise d2">
          <span className="dm-small" style={{ opacity: 0.75 }}>
            dear me
          </span>
          <h3>
            {data.firstName}&apos;s year,
            <br />
            wrapped.
          </h3>
        </div>
        <div
          className="dm-rise d3"
          style={{ alignSelf: "flex-end", color: "var(--neonweste)" }}
        >
          <Squirrel state="progress" size={80} />
        </div>
      </Slide>

      <Slide tone="lime" on={on(1)}>
        <div className="bg">
          <div className="dm-rays" />
        </div>
        <p className="dm-rise">This year you put away</p>
        <CountUp to={data.putAway} active={on(1)} />
        <p className="dm-rise d2">
          for future you. AHV, pension fund and your own 3a together.
        </p>
        <div
          className="dm-pop"
          style={{ marginTop: "auto", alignSelf: "flex-start", animationDelay: "1.6s" }}
        >
          <Squirrel state="done" size={72} />
        </div>
      </Slide>

      <Slide tone="berry" on={on(2)}>
        <p className="dm-rise">That&apos;s</p>
        <span className="dm-count dm-rise d1" style={{ color: "var(--neonweste)" }}>
          {data.nuts} nuts
        </span>
        <p className="dm-rise d2">
          if you were a squirrel. Which, honestly, you kind of are.
        </p>
        {on(2) ? <NutRain count={data.nuts} /> : null}
      </Slide>

      <Slide tone="pink" on={on(3)}>
        <div className="bg">
          <div className="dm-rings">
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="dm-rise">Your biggest moment</p>
        <h3 className="dm-rise d1">{data.momentTitle}</h3>
        <TypeLine text={data.firstQuestion} active={on(3)} />
        <div
          style={{
            marginTop: "auto",
            alignSelf: "center",
            color: "var(--pflaumenkuchen)",
          }}
          className="dm-pop"
        >
          <Squirrel state="idle" size={84} />
        </div>
      </Slide>

      <Slide tone="blush" on={on(4)}>
        <div className="bg">
          <div className="dm-cuts">
            <i />
            <i />
            <i />
          </div>
        </div>
        <p className="dm-rise">Your top questions</p>
        <ol className="dm-rank">
          {data.topQuestions.map((q, i) => (
            <li key={q}>
              <b>{i + 1}</b>
              <span>{q}</span>
            </li>
          ))}
        </ol>
        <p className="dm-rise d4 dm-small" style={{ marginTop: 14 }}>
          {data.askNote}
        </p>
      </Slide>

      <Slide tone="espresso" on={on(5)}>
        <div className="bg">
          <div className="dm-stairs">
            {[18, 26, 34, 44, 56, 70, 86, 100].map((h, i) => (
              <i
                key={h}
                style={
                  {
                    "--h": `${h}%`,
                    animationDelay: `${0.2 + i * 0.08}s`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
        <p className="dm-rise">{data.changeLead}</p>
        <span
          className="dm-count dm-pop d1"
          style={{ color: "var(--neonweste)", animationDelay: ".4s" }}
        >
          {data.changeValue}
        </span>
        <p className="dm-rise d2">{data.changeBody}</p>
      </Slide>

      <Slide tone="gum" on={on(6)}>
        <p className="dm-rise">Your planner type</p>
        <h3 className="dm-rise d1">{data.plannerType}</h3>
        <div className="dm-badge dm-pop" style={{ animationDelay: ".5s" }}>
          <span className="disc" />
          <span className="orbit">
            {Array.from({ length: 12 }, (_, i) => (
              <i key={i} style={{ transform: `rotate(${i * 30}deg)` }} />
            ))}
          </span>
          <Squirrel state="idle" size={84} />
        </div>
        <p className="dm-rise d3" style={{ textAlign: "center" }}>
          {data.plannerBody}
        </p>
      </Slide>

      <Slide tone="cream" on={on(7)}>
        <div className="bg">
          <div className="dm-stripes" />
        </div>
        <div style={{ marginTop: 90 }} className="dm-stack">
          <p className="dm-rise">A letter for next year</p>
          <div className="dm-letter dm-rise d1" style={{ color: "var(--ink)" }}>
            <small>Dear me</small>
            <p>{data.letter}</p>
          </div>
          <button
            type="button"
            className="dm-btn dm-btn--secondary dm-rise d3"
            style={{ alignSelf: "flex-start", marginTop: 10 }}
          >
            {data.letterCta}
          </button>
        </div>
      </Slide>

      <Slide tone="espresso" on={on(8)}>
        <div className="dm-sharecard dm-pop">
          <span className="dm-lockup" style={{ fontSize: 16 }}>
            dear me
          </span>
          <div className="dm-collage">
            <i style={{ background: "var(--neonweste)" }} />
            <i style={{ background: "var(--abschlusspink)" }} />
            <i style={{ background: "var(--brombeerkompott)" }} />
            <i style={{ background: "var(--kaugummi)" }} />
          </div>
          <b
            style={{
              font: "700 22px/26px var(--font-display)",
              letterSpacing: "-.02em",
            }}
          >
            {data.firstName}&apos;s 2026, wrapped
          </b>
          <dl>
            <div>
              <dt>Put away</dt>
              <dd>{data.putAwayLabel}</dd>
            </div>
            <div>
              <dt>Biggest moment</dt>
              <dd>{data.shareMoment}</dd>
            </div>
            <div>
              <dt>Nuts</dt>
              <dd>{data.nuts}</dd>
            </div>
            <div>
              <dt>Planner type</dt>
              <dd>{data.sharePlanner}</dd>
            </div>
          </dl>
        </div>
      </Slide>
    </>
  );
}

/**
 * Full-screen "Your year, wrapped" story player (Flows #8).
 * Nine slides with progress bars; tap left/right, pause, replay.
 */
export function WrappedStory({ open, onClose, personaId }: Props) {
  const id = personaId ?? (typeof window !== "undefined" ? readPersonaId() : "lena");
  const data = wrappedFor(id);
  const [index, setIndex] = useState(0);
  const [running, setRunning] = useState(true);
  const [shareNote, setShareNote] = useState(false);
  const [fill, setFill] = useState(0);
  const acc = useRef(0);
  const last = useRef(0);
  const indexRef = useRef(0);
  const runningRef = useRef(true);

  const show = useCallback((k: number) => {
    const next = Math.max(0, Math.min(SLIDE_COUNT - 1, k));
    indexRef.current = next;
    setIndex(next);
    acc.current = 0;
    setFill(next === SLIDE_COUNT - 1 ? 100 : 0);
  }, []);

  useEffect(() => {
    if (!open) return;
    indexRef.current = 0;
    setIndex(0);
    setRunning(true);
    runningRef.current = true;
    setShareNote(false);
    acc.current = 0;
    setFill(0);
    last.current = performance.now();
  }, [open, id]);

  useEffect(() => {
    runningRef.current = running;
  }, [running]);

  useEffect(() => {
    if (!open) return;
    let raf = 0;
    const tick = (now: number) => {
      const dt = now - last.current;
      last.current = now;
      const i = indexRef.current;
      if (runningRef.current && i < SLIDE_COUNT - 1) {
        acc.current += dt;
        const pct = Math.min(100, (acc.current / SLIDE_MS) * 100);
        setFill(pct);
        if (acc.current >= SLIDE_MS) show(i + 1);
      } else if (i === SLIDE_COUNT - 1) {
        setFill(100);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, show]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") show(index + 1);
      if (e.key === "ArrowLeft") show(index - 1);
      if (e.key === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, onClose, show]);

  if (!open) return null;

  const tones = [
    "espresso",
    "lime",
    "berry",
    "pink",
    "blush",
    "espresso",
    "gum",
    "cream",
    "espresso",
  ];
  const light = LIGHT.test(tones[index] ?? "espresso");

  const barWidth = (i: number) => {
    if (i < index) return "100%";
    if (i > index) return "0%";
    return `${fill}%`;
  };

  return (
    <div
      className="dm-wrapped-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${data.firstName}'s 2026, wrapped`}
    >
      <div
        className="dm-story"
        style={{ color: light ? "#0A0507" : "#FAF7F0" }}
      >
        <div className="dm-story__bars">
          {Array.from({ length: SLIDE_COUNT }, (_, i) => (
            <span key={i}>
              <i style={{ width: barWidth(i) }} />
            </span>
          ))}
        </div>
        <div className="dm-story__top">
          <span>Your 2026</span>
          <span className="dm-row" style={{ gap: 2 }}>
            <button
              type="button"
              aria-label={running ? "Pause" : "Play"}
              onClick={() => setRunning((r) => !r)}
            >
              {running ? (
                <Pause size={16} strokeWidth={2} />
              ) : (
                <Play size={16} strokeWidth={2} />
              )}
            </button>
            <button type="button" aria-label="Close" onClick={onClose}>
              <X size={16} strokeWidth={2} />
            </button>
          </span>
        </div>

        <StorySlides data={data} index={index} />

        <button
          type="button"
          className="dm-story__tap l"
          aria-label="Previous slide"
          onClick={() => show(index - 1)}
        />
        <button
          type="button"
          className="dm-story__tap r"
          aria-label="Next slide"
          onClick={() => show(index + 1)}
        />

        {index === SLIDE_COUNT - 1 ? (
          <div
            className="dm-row dm-rise d2"
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 28,
              zIndex: 4,
              justifyContent: "center",
              gap: 10,
            }}
          >
            <Button
              variant="primary"
              onClick={() => {
                setShareNote(true);
                window.setTimeout(() => setShareNote(false), 2200);
              }}
            >
              Share
            </Button>
            <Button
              variant="secondary"
              onClick={() => {
                show(0);
                setRunning(true);
              }}
            >
              Replay
            </Button>
          </div>
        ) : null}
        {shareNote ? (
          <p
            className="dm-small"
            style={{
              position: "absolute",
              left: 20,
              right: 20,
              bottom: 8,
              zIndex: 4,
              textAlign: "center",
              opacity: 0.85,
            }}
          >
            Sharing hides amounts unless you turn them on.
          </p>
        ) : null}
      </div>
      <button type="button" className="dm-wrapped-scrim" aria-label="Close" onClick={onClose} />
    </div>
  );
}

/** Entry card for the Home feed. */
export function WrappedEntry({ onOpen }: { onOpen: () => void }) {
  const persona = getPersona(readPersonaId());
  return (
    <button type="button" className="dm-wrapped-entry" onClick={onOpen}>
      <b>Your 2026, wrapped</b>
      <span style={{ font: "400 14px/20px var(--font-text)", opacity: 0.85 }}>
        One minute for {persona.hi.replace(/\.$/, "")} · just for fun
      </span>
      <span
        style={{
          position: "absolute",
          right: 12,
          bottom: 4,
          color: "var(--neonweste)",
        }}
      >
        <Squirrel state="progress" size={56} />
      </span>
    </button>
  );
}
