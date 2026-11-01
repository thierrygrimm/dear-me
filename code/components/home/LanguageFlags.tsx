"use client";

import type { AppLanguage } from "@/lib/settingsPrefs";
import { useId } from "react";

export const LANGUAGES: {
  id: AppLanguage;
  code: string;
  label: string;
  hello: string;
}[] = [
  { id: "English", code: "en", label: "Default", hello: "Hello, Lena" },
  { id: "Deutsch", code: "de", label: "German", hello: "Hallo Lena" },
  { id: "Français", code: "fr", label: "French", hello: "Bonjour Lena" },
  { id: "Italiano", code: "it", label: "Italian", hello: "Ciao Lena" },
];

/** Round language flag from DS Settings language sheet. */
export function LangFlag({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  const raw = useId().replace(/:/g, "");
  const clip = `fc${code}${raw}`;

  if (code === "en") {
    return (
      <span className={className ?? "fl"}>
        <svg viewBox="0 0 60 60" aria-hidden>
          <defs>
            <clipPath id={clip}>
              <circle cx="30" cy="30" r="30" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="60" height="60" fill="#012169" />
            <path
              d="M0 0L60 60M60 0L0 60"
              stroke="#fff"
              strokeWidth="12"
            />
            <path
              d="M0 0L60 60M60 0L0 60"
              stroke="#C8102E"
              strokeWidth="4"
            />
            <path d="M30 0V60M0 30H60" stroke="#fff" strokeWidth="18" />
            <path d="M30 0V60M0 30H60" stroke="#C8102E" strokeWidth="10" />
          </g>
        </svg>
      </span>
    );
  }

  if (code === "de") {
    return (
      <span className={className ?? "fl"}>
        <svg viewBox="0 0 60 60" aria-hidden>
          <defs>
            <clipPath id={clip}>
              <circle cx="30" cy="30" r="30" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="60" height="20" fill="#000" />
            <rect y="20" width="60" height="20" fill="#DD0000" />
            <rect y="40" width="60" height="20" fill="#FFCE00" />
          </g>
        </svg>
      </span>
    );
  }

  if (code === "fr") {
    return (
      <span className={className ?? "fl"}>
        <svg viewBox="0 0 60 60" aria-hidden>
          <defs>
            <clipPath id={clip}>
              <circle cx="30" cy="30" r="30" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clip})`}>
            <rect width="20" height="60" fill="#0055A4" />
            <rect x="20" width="20" height="60" fill="#fff" />
            <rect x="40" width="20" height="60" fill="#EF4135" />
          </g>
        </svg>
      </span>
    );
  }

  return (
    <span className={className ?? "fl"}>
      <svg viewBox="0 0 60 60" aria-hidden>
        <defs>
          <clipPath id={clip}>
            <circle cx="30" cy="30" r="30" />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clip})`}>
          <rect width="20" height="60" fill="#009246" />
          <rect x="20" width="20" height="60" fill="#fff" />
          <rect x="40" width="20" height="60" fill="#CE2B37" />
        </g>
      </svg>
    </span>
  );
}

export function flagCodeFor(lang: AppLanguage): string {
  return LANGUAGES.find((l) => l.id === lang)?.code ?? "en";
}
