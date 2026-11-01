"use client";

import { AskBar } from "@/components/answer/AskBar";
import { Logo } from "@/components/brand/Logo";
import { Squirrel } from "@/components/brand/Squirrel";
import { LifeSheet } from "@/components/home/LifeSheet";
import { copy } from "@/lib/copy";
import { seedForAsk } from "@/lib/lifeMoments";
import {
  applyPersona,
  getPersona,
  lessonPathForPersona,
  readPersonaId,
  type Persona,
  type PersonaId,
} from "@/lib/personas";
import { readAskedMoments, readMoments } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  onLook?: () => void;
  onBook?: () => void;
  onLesson?: () => void;
};

const HOME_STARTERS = [
  "Can I go to 60 %?",
  "Am I covered if I can't work?",
  "What should I do this month?",
] as const;

function helloFor(hour: number) {
  if (hour >= 18) return "Good evening,";
  if (hour >= 12) return "Good afternoon,";
  return "Good morning,";
}

/** Research / topic card — suppress seed while C1 LifeMomentAsk is pending. */
function goAskResearch(
  router: ReturnType<typeof useRouter>,
  research?: string,
) {
  const seed = seedForAsk(readMoments(), readAskedMoments(), research);
  if (seed) {
    sessionStorage.setItem("dm-ask-q", seed);
    sessionStorage.removeItem("dm-ask-free");
  } else {
    sessionStorage.removeItem("dm-ask-q");
    sessionStorage.removeItem("dm-ask-free");
  }
  router.push("/ask");
}

/** User-typed AskBar — free question may skip pending C1. */
function goAskFree(router: ReturnType<typeof useRouter>, q: string) {
  const trimmed = q.trim();
  if (!trimmed) return;
  sessionStorage.setItem("dm-ask-q", trimmed);
  sessionStorage.setItem("dm-ask-free", "1");
  router.push("/ask");
}

function TopicArt() {
  return (
    <svg viewBox="0 0 320 210" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <rect width="320" height="210" fill="var(--neonweste)" />
      <circle cx="270" cy="40" r="70" fill="var(--rosa-brille)" opacity=".7" />
      <path d="M90 120a70 70 0 0 1 140 0z" fill="var(--pflaumenkuchen)" />
      <path
        d="M90 120a23 14 0 0 1 46 0a24 14 0 0 1 48 0a23 14 0 0 1 46 0"
        fill="var(--neonweste)"
      />
      <path
        d="M160 120v52a12 12 0 0 1-24 0"
        fill="none"
        stroke="var(--espressosatz)"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <g fill="var(--espressosatz)">
        <rect x="60" y="40" width="4" height="16" rx="2" transform="rotate(20 62 48)" />
        <rect x="110" y="20" width="4" height="16" rx="2" transform="rotate(20 112 28)" />
        <rect x="190" y="30" width="4" height="16" rx="2" transform="rotate(20 192 38)" />
        <rect x="40" y="90" width="4" height="16" rx="2" transform="rotate(20 42 98)" />
        <rect x="250" y="120" width="4" height="16" rx="2" transform="rotate(20 252 128)" />
      </g>
    </svg>
  );
}

function NetArt() {
  return (
    <svg viewBox="0 0 120 110" aria-hidden>
      <polygon
        points="60,8 112,46 92,104 28,104 8,46"
        fill="none"
        stroke="var(--line-strong)"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      <polygon
        points="60,16 92,50 80,88 34,92 20,48"
        fill="var(--neonweste)"
        stroke="var(--espressosatz)"
        strokeWidth="2"
      />
      <circle
        cx="92"
        cy="50"
        r="6"
        fill="var(--abschlusspink)"
        stroke="var(--surface-card)"
        strokeWidth="2"
      />
    </svg>
  );
}

function LessonArt() {
  return (
    <svg viewBox="0 0 120 100" aria-hidden>
      <rect x="10" y="50" width="22" height="44" rx="4" fill="var(--kaugummi)" />
      <rect x="40" y="30" width="22" height="64" rx="4" fill="var(--rosa-brille)" />
      <rect x="70" y="60" width="22" height="34" rx="4" fill="var(--neonweste)" />
      <circle cx="104" cy="22" r="10" fill="var(--rosa-brille)" />
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      viewBox="0 0 16 16"
      style={{ width: 14, height: 14, fill: "none", stroke: "currentColor", strokeWidth: 2 }}
      aria-hidden
    >
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

/**
 * Home · `.dm-morn` — phone glow hero + feed; laptop calm column via dm.css.
 */
export function HomeHero({ onLook, onBook, onLesson }: Props) {
  const router = useRouter();
  const [hour, setHour] = useState(9);
  const [persona, setPersona] = useState<Persona>(() => getPersona("lena"));
  const [sheetOpen, setSheetOpen] = useState(false);

  useEffect(() => {
    setHour(new Date().getHours());
    setPersona(getPersona(readPersonaId()));
  }, []);

  function selectPersona(id: PersonaId) {
    applyPersona(id);
    setPersona(getPersona(id));
  }

  function lookAtTopic() {
    if (onLook) {
      onLook();
      return;
    }
    goAskResearch(router, persona.topic);
  }

  function openBook() {
    if (onBook) {
      onBook();
      return;
    }
    if (persona.appointment.avatar) router.push("/me/book");
    else router.push("/certificate");
  }

  function openLesson() {
    if (onLesson) onLesson();
    else router.push(lessonPathForPersona(persona.id));
  }

  const hello = helloFor(hour);

  return (
    <div className="dm-morn">
      <div className="dm-hero" data-bg="glow">
        <div className="top">
          <Logo />
          <button
            type="button"
            className="dm-pair"
            data-ps="1"
            aria-label="Switch profile"
            onClick={() => setSheetOpen(true)}
          >
            {persona.avatars.map((a) => (
              <span
                key={a.initial}
                style={{ background: a.background, color: a.color }}
              >
                {a.initial}
              </span>
            ))}
            <i className="chev" aria-hidden />
          </button>
        </div>

        <h1>
          {hello} <br />
          {persona.hi}
        </h1>
        <p>{persona.sub}</p>

        <div className="bgl glow" data-v="glow" aria-hidden>
          <i />
          <i />
        </div>
      </div>

      <div className="home-ask">
        <AskBar
          placeholder="Ask anything about your pension"
          onAttach={() => router.push("/certificate")}
          onSubmit={(value) => goAskFree(router, value)}
        />
        <div className="chips">
          {HOME_STARTERS.map((q) => (
            <button
              key={q}
              type="button"
              className="dm-chip"
              aria-pressed="false"
              onClick={() => goAskResearch(router, q)}
            >
              {q}
            </button>
          ))}
        </div>
      </div>

      <div className="dm-feed2">
        <button type="button" className="dm-tcard" onClick={lookAtTopic}>
          <span className="img">
            <TopicArt />
          </span>
          <span className="body">
            <h3>{persona.topic}</h3>
            <p>{persona.topicDetail}</p>
            <span className="go">
              {copy.home.heroCta}
              <svg viewBox="0 0 24 24" aria-hidden>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>
        </button>

        <div className="dm-duo">
          <button
            type="button"
            onClick={() => goAskResearch(router, persona.topic)}
          >
            <span className="art2">
              <NetArt />
            </span>
            <b>Your safety net</b>
            <span className="sub">{persona.net}</span>
          </button>
          <button type="button" className="plum" onClick={openLesson}>
            <span className="art2">
              <LessonArt />
            </span>
            <b>{persona.lesson}</b>
            <span className="sub">{persona.lessonTime}</span>
          </button>
        </div>

        <button type="button" className="dm-tsmall" onClick={openBook}>
          <span
            className="av"
            style={
              persona.appointment.avatar
                ? undefined
                : { background: "var(--hafermilch)" }
            }
          >
            {persona.appointment.avatar || (
              <svg
                viewBox="0 0 24 24"
                style={{
                  width: 22,
                  height: 22,
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: 1.75,
                }}
                aria-hidden
              >
                <path d="M6 3h8l4 4v14H6z" />
                <path d="M14 3v4h4" />
              </svg>
            )}
          </span>
          <span>
            <b>{persona.appointment.title}</b>
            <span>{persona.appointment.meta}</span>
          </span>
          <Chevron />
        </button>

        <h2>From the two of you</h2>
        <div className="dm-letter" style={{ margin: "10px 4px 6px" }}>
          <small>{persona.letterTitle}</small>
          <p>{persona.letterBody}</p>
          <span>{persona.letterFrom}</span>
        </div>

        <button
          type="button"
          className="dm-tsmall"
          onClick={() => goAskResearch(router, "How did my year look?")}
        >
          <span
            className="av"
            style={{
              background: "var(--neonweste)",
              color: "var(--espressosatz)",
            }}
          >
            26
          </span>
          <span>
            <b>Your 2026, wrapped</b>
            <span>One minute, just for fun</span>
          </span>
          <Chevron />
        </button>

        <div className="dm-end">
          <span style={{ color: "var(--ink)" }}>
            <Squirrel state="idle" size={44} />
          </span>
          {copy.thatsAll}
        </div>
      </div>

      <LifeSheet
        open={sheetOpen}
        current={persona.id}
        onClose={() => setSheetOpen(false)}
        onSelect={selectPersona}
      />
    </div>
  );
}
