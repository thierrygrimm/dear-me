"use client";

import { Logo } from "@/components/brand/Logo";
import { copy } from "@/lib/copy";
import { readName } from "@/lib/session";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  name?: string;
  onLook?: () => void;
  onBook?: () => void;
  onLesson?: () => void;
};

/**
 * HomeHero C · Words first — greeting, one marked sentence, one CTA, two quiet rows.
 * No picture, no demo pulse.
 */
export function HomeHero({ name: nameProp, onLook, onBook, onLesson }: Props) {
  const router = useRouter();
  const [name] = useState(() => nameProp ?? readName());
  const [hour, setHour] = useState(9);

  useEffect(() => {
    setHour(new Date().getHours());
  }, []);

  const greeting = copy.home.greeting(name === "there" ? "there" : name, hour);
  const [hello, who] = greeting.split("\n");

  return (
    <div className="hh hh--words">
      <span className="hh-corner" aria-hidden />
      <div className="hh-top">
        <Logo />
        <span className="dm-pair" aria-hidden>
          <span style={{ background: "var(--neonweste)" }}>
            {(name[0] || "L").toUpperCase()}
          </span>
          <span
            style={{
              background: "var(--rosa-brille)",
              color: "var(--pflaumenkuchen)",
            }}
          >
            M
          </span>
        </span>
      </div>

      <h1 className="hh-h">
        {hello}
        <br />
        {who}
      </h1>

      <p className="hh-say">
        {copy.home.say} <mark>{copy.home.sayMark}</mark>
      </p>

      <button
        type="button"
        className="dm-btn dm-btn--primary"
        style={{ alignSelf: "flex-start" }}
        onClick={() => {
          if (onLook) {
            onLook();
            return;
          }
          sessionStorage.setItem(
            "dm-ask-q",
            "What if I couldn't work?",
          );
          router.push("/ask");
        }}
      >
        {copy.home.heroCta}
      </button>

      <div className="hh-rows">
        <button
          type="button"
          onClick={() => {
            if (onBook) onBook();
            else router.push("/me/book");
          }}
        >
          <span className="av">SK</span>
          <span>
            <b>{copy.home.appointmentTitle}</b>
            <small>{copy.home.appointmentMeta}</small>
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
            3′
          </span>
          <span>
            <b>{copy.home.lessonTitle}</b>
            <small>{copy.home.lessonMeta}</small>
          </span>
          <svg viewBox="0 0 16 16" aria-hidden>
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
