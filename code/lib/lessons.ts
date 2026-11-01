import { ahvPart1Content } from "@/lib/lessons/ahv-part-1";
import { ahvPart2Content } from "@/lib/lessons/ahv-part-2";
import { threePillarsContent } from "@/lib/lessons/three-pillars";

export type LessonId =
  | "three-pillars"
  | "ahv-part-1"
  | "ahv-part-2"
  | "three-sources"
  | "part-time"
  | "certificate"
  | "pillar-3a";

export type LessonArtKey =
  | "pillars-equal"
  | "three-pillars"
  | "ahv"
  | "thirteen"
  | "pillars"
  | "part-time"
  | "certificate"
  | "nut";

export type LessonMeta = {
  id: LessonId;
  title: string;
  time: string;
  art: LessonArtKey;
  background: string;
  isNew?: boolean;
};

export const LESSONS: LessonMeta[] = [
  {
    id: "three-pillars",
    title: "The three pillars",
    time: "4 min",
    art: "pillars-equal",
    background: "var(--rosa-brille)",
    isNew: true,
  },
  {
    id: "ahv-part-1",
    title: "The state pension (AHV)",
    time: "4 min · part 1",
    art: "ahv",
    background: "var(--neonweste)",
    isNew: true,
  },
  {
    id: "ahv-part-2",
    title: "AHV for couples and at 65",
    time: "4 min · part 2",
    art: "thirteen",
    background: "var(--brombeerkompott)",
    isNew: true,
  },
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

export type LessonStepKind =
  | "stacks"
  | "bars"
  | "grow"
  | "quiz"
  | "certs"
  | "tax"
  | "lp"
  | "lq";

export type LessonStep = {
  artBg: string;
  headline: string;
  body: string;
  cta: string;
  kind: LessonStepKind;
  /** Light quiz (.lq) or dark quiz options */
  options?: string[];
  correctIndex?: number;
  /** Dark quiz question shown in the art panel */
  question?: string;
  okFeedback?: string;
  noFeedback?: string;
};

export type LessonDataGen = "pillars" | "ahv1" | "ahv2";

export type LessonContent = {
  id: LessonId;
  steps: LessonStep[];
  doneTitle: string;
  doneBody: string;
  doneCta: string;
  doneCtaHref: string;
  /** DS data-gen for lp lessons */
  dataGen?: LessonDataGen;
  /** Lesson-level quiz feedback (DS data-ok / data-no) */
  okFeedback?: string;
  noFeedback?: string;
};

export const LESSON_CONTENT: Record<LessonId, LessonContent> = {
  "three-pillars": threePillarsContent as unknown as LessonContent,
  "ahv-part-1": ahvPart1Content as unknown as LessonContent,
  "ahv-part-2": ahvPart2Content as unknown as LessonContent,
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
        question:
          "Quick check: which source shrinks most when you go part-time?",
        options: [
          "The state (AHV)",
          "Your employer's fund",
          "Your own 3a",
        ],
        correctIndex: 1,
        okFeedback:
          "Right. The fixed deduction makes the fund shrink fastest.",
        noFeedback:
          "Close. It's the employer's fund, because of the fixed deduction.",
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
        body: "Your fund first takes off a fixed amount. Work 60 % and what is insured drops by more than half.",
        cta: "Next",
      },
      {
        kind: "stacks",
        artBg: "var(--rosa-brille)",
        headline: "The fund is the one that moves.",
        body: "AHV stays put. Your 3a stays yours. The employer's fund shrinks fastest.",
        cta: "Next",
      },
      {
        kind: "quiz",
        artBg: "var(--espressosatz)",
        headline: "Quick check",
        body: "One tap. No grades, just a nudge.",
        cta: "Finish",
        question:
          "Quick check: which source shrinks most when you go part-time?",
        options: [
          "The state (AHV)",
          "Your employer's fund",
          "Your own 3a",
        ],
        correctIndex: 1,
        okFeedback:
          "Right. The fixed deduction makes the fund shrink fastest.",
        noFeedback:
          "Close. It's the employer's fund, because of the fixed deduction.",
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
        body: "Insured salary, projected pension, disability, survivors, and saved so far.",
        cta: "Next",
      },
      {
        kind: "grow",
        artBg: "var(--briefpapier)",
        headline: "The projection is a path, not a promise.",
        body: "Change your hours or pay, and that line moves with you.",
        cta: "Next",
      },
      {
        kind: "quiz",
        artBg: "var(--espressosatz)",
        headline: "Quick check",
        body: "One tap. No grades, just a nudge.",
        cta: "Finish",
        question:
          "Quick check: how many numbers on your certificate matter most?",
        options: ["Two", "Five", "All of them"],
        correctIndex: 1,
        okFeedback:
          "Right. Five numbers tell the story; the rest is detail.",
        noFeedback:
          "Almost. Focus on five: insured salary, projected pension, disability, survivors, and saved so far.",
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
        body: "What you pay in comes off your taxable income.",
        cta: "Next",
      },
      {
        kind: "grow",
        artBg: "var(--briefpapier)",
        headline: "And it keeps working later.",
        body: "Tax relief now, income later. One pot, two jobs.",
        cta: "Next",
      },
      {
        kind: "quiz",
        artBg: "var(--espressosatz)",
        headline: "Quick check",
        body: "One tap. No grades, just a nudge.",
        cta: "Finish",
        question:
          "Quick check: what does the tax room on 3a mean this year?",
        options: [
          "Interest you'll earn later",
          "How much you can still pay in for a tax cut",
          "Your AHV contribution",
        ],
        correctIndex: 1,
        okFeedback:
          "Right. What's left in the room still lowers this year's taxable income.",
        noFeedback:
          "Close. Tax room is how much you can still put into 3a this year for a tax cut.",
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
