export type LessonId =
  | "three-sources"
  | "part-time"
  | "certificate"
  | "pillar-3a";

export type LessonMeta = {
  id: LessonId;
  title: string;
  time: string;
  art: "pillars" | "part-time" | "certificate" | "nut";
  background: string;
};

export const LESSONS: LessonMeta[] = [
  {
    id: "three-sources",
    title: "Three sources of your pension",
    time: "2 min",
    art: "pillars",
    background: "var(--espressosatz)",
  },
  {
    id: "part-time",
    title: "Why part-time costs more",
    time: "2 min",
    art: "part-time",
    background: "var(--neonweste)",
  },
  {
    id: "certificate",
    title: "Your certificate in 5 numbers",
    time: "3 min",
    art: "certificate",
    background: "var(--rosa-brille)",
  },
  {
    id: "pillar-3a",
    title: "Saving tax with Pillar 3a",
    time: "2 min",
    art: "nut",
    background: "var(--brombeerkompott)",
  },
];

export type LessonStep = {
  artBg: string;
  headline: string;
  body: string;
  cta: string;
  kind: "stacks" | "bars" | "grow" | "quiz" | "certs" | "tax";
};

export type LessonContent = {
  id: LessonId;
  steps: LessonStep[];
  doneTitle: string;
  doneBody: string;
  doneCta: string;
  doneCtaHref: string;
};

export const LESSON_CONTENT: Record<LessonId, LessonContent> = {
  "three-sources": {
    id: "three-sources",
    steps: [
      {
        kind: "stacks",
        artBg: "var(--rosa-brille)",
        headline: "Your pension has three sources.",
        body: "The state (AHV) for everyone, your employer's fund (PK) through your job, and your own savings (3a). Each bar is about CHF 200 a month at 65.",
        cta: "Next",
      },
      {
        kind: "bars",
        artBg: "var(--neonweste)",
        headline: "Part-time hits the fund harder.",
        body: "Your fund first takes off a fixed amount. Work 60 % and your salary drops by 40 %, but what is insured drops by more than half.",
        cta: "Next",
      },
      {
        kind: "grow",
        artBg: "var(--briefpapier)",
        headline: "Time does a lot of the work.",
        body: "Black is what you pay in, pink is interest. The earlier a franc goes in, the longer it grows. That's why small steps at 32 matter.",
        cta: "Next",
      },
      {
        kind: "quiz",
        artBg: "var(--espressosatz)",
        headline: "Quick check",
        body: "One tap. No grades, just a nudge.",
        cta: "Finish",
      },
    ],
    doneTitle: "You know the three sources.",
    doneBody: "Next: see what part-time changes for you at 60 %.",
    doneCta: "Show my numbers",
    doneCtaHref: "/compare",
  },
  "part-time": {
    id: "part-time",
    steps: [
      {
        kind: "bars",
        artBg: "var(--neonweste)",
        headline: "Part-time hits the fund harder.",
        body: "Your fund first takes off a fixed amount. Work 60 % and your salary drops by 40 %, but what is insured drops by more than half.",
        cta: "Next",
      },
      {
        kind: "stacks",
        artBg: "var(--rosa-brille)",
        headline: "The fund is the one that moves.",
        body: "AHV stays roughly the same. Your own 3a stays yours. The employer's fund shrinks fastest when hours drop.",
        cta: "Next",
      },
      {
        kind: "quiz",
        artBg: "var(--espressosatz)",
        headline: "Quick check",
        body: "One tap. No grades, just a nudge.",
        cta: "Finish",
      },
    ],
    doneTitle: "You know why part-time costs more.",
    doneBody: "Next: see what it means for you at 60 %.",
    doneCta: "Show my numbers",
    doneCtaHref: "/compare",
  },
  certificate: {
    id: "certificate",
    steps: [
      {
        kind: "certs",
        artBg: "var(--rosa-brille)",
        headline: "Five numbers that matter.",
        body: "Insured salary, projected pension, disability cover, survivors' cover, and what you've saved so far. Everything else is detail.",
        cta: "Next",
      },
      {
        kind: "grow",
        artBg: "var(--briefpapier)",
        headline: "The projection is a path, not a promise.",
        body: "Your certificate shows where you land if nothing changes. Change your hours or pay, and that line moves with you.",
        cta: "Finish",
      },
    ],
    doneTitle: "You can read your certificate.",
    doneBody: "Next: add yours and we'll explain each line.",
    doneCta: "Add certificate",
    doneCtaHref: "/certificate",
  },
  "pillar-3a": {
    id: "pillar-3a",
    steps: [
      {
        kind: "tax",
        artBg: "var(--brombeerkompott)",
        headline: "3a lowers this year's tax.",
        body: "What you pay in comes off your taxable income. The room left this year is the amount that still helps.",
        cta: "Next",
      },
      {
        kind: "grow",
        artBg: "var(--briefpapier)",
        headline: "And it keeps working later.",
        body: "The same francs sit and grow until retirement. Tax relief now, income later — one pot, two jobs.",
        cta: "Finish",
      },
    ],
    doneTitle: "You know what 3a is for.",
    doneBody: "Next: see how much room you still have this year.",
    doneCta: "Show my numbers",
    doneCtaHref: "/compare",
  },
};

const DONE_KEY = "dm-lessons-done";

export function readDoneLessons(): LessonId[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(DONE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LessonId[];
  } catch {
    return [];
  }
}

export function markLessonDone(id: LessonId): LessonId[] {
  const next = Array.from(new Set([...readDoneLessons(), id]));
  sessionStorage.setItem(DONE_KEY, JSON.stringify(next));
  return next;
}
