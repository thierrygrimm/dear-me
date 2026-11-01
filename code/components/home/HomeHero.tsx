"use client";

import { Logo } from "@/components/brand/Logo";
import { LifeSheet } from "@/components/home/LifeSheet";
import { seedForAsk } from "@/lib/lifeMoments";
import {
  getPersona,
  markPersonaId,
  readPersonaId,
  type Persona,
  type PersonaId,
} from "@/lib/personas";
import {
  readAskedMoments,
  readMoments,
} from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  onLook?: () => void;
  onBook?: () => void;
  onLesson?: () => void;
};

function helloFor(hour: number) {
  if (hour >= 18) return "Good evening,";
  if (hour >= 12) return "Good afternoon,";
  return "Good morning,";
}

/**
 * HomeHero C · Words first — greeting, one marked sentence, one CTA, two quiet rows.
 * Top-right `.dm-pair` opens DS `.dm-psheet` ("Try another life").
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
    markPersonaId(id);
    setPersona(getPersona(id));
  }

  const hello = helloFor(hour);

  return (
    <div className="hh hh--words">
      <span className="hh-corner" aria-hidden />
      <div className="hh-top">
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

      <h1 className="hh-h">
        {hello}
        <br />
        {persona.hi}
      </h1>

      <p className="hh-say">{persona.sub}</p>

      <button
        type="button"
        className="dm-btn dm-btn--primary"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (onLook) {
            onLook();
            return;
          }
          const seed = seedForAsk(
            readMoments(),
            readAskedMoments(),
            persona.topic,
          );
          if (seed) sessionStorage.setItem("dm-ask-q", seed);
          else sessionStorage.setItem("dm-ask-q", persona.topic);
          router.push("/ask");
        }}
      >
        Let&apos;s look at it
      </button>

      <div className="hh-rows">
        <button
          type="button"
          onClick={() => {
            if (onBook) onBook();
            else if (persona.appointment.avatar) router.push("/me/book");
            else router.push("/certificate");
          }}
        >
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
            <small>{persona.appointment.meta}</small>
          </span>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => {
            if (onLesson) onLesson();
            else router.push("/learn?lesson=part-time");
          }}
        >
          <span
            className="av"
            style={{
              background: "var(--pflaumenkuchen)",
              color: "var(--briefpapier)",
            }}
          >
            {persona.lessonTime.replace(/ minutes?/, "′")}
          </span>
          <span>
            <b>{persona.lesson}</b>
            <small>A short lesson</small>
          </span>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
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
