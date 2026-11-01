/**
 * Per-lesson one-tap quizzes for the original four learn modules.
 * New lessons (three-pillars / AHV) own their quiz steps in LESSON_CONTENT.
 * Certificate and pillar-3a quiz steps live in lessons.ts; this module keeps
 * the shared prompt copy for reference and /dev previews.
 */

export type LessonQuizOption = {
  label: string;
  ok: boolean;
};

export type LessonQuiz = {
  prompt: string;
  options: LessonQuizOption[];
  /** Shown after a correct tap. */
  right: string;
  /** Shown after a wrong tap. */
  wrong: string;
};

/** Quizzes keyed by original lesson ids only. */
const QUIZZES: Record<string, LessonQuiz> = {
  "three-sources": {
    prompt: "Quick check: which source shrinks most when you go part-time?",
    options: [
      { label: "AHV", ok: false },
      { label: "Employer fund", ok: true },
      { label: "Pillar 3a", ok: false },
    ],
    right: "Right. The fixed deduction makes the fund shrink fastest.",
    wrong: "Close. It's the employer fund — the fixed deduction hits it hardest.",
  },
  "part-time": {
    prompt: "Quick check: which source shrinks most when you go part-time?",
    options: [
      { label: "AHV", ok: false },
      { label: "Employer fund", ok: true },
      { label: "Pillar 3a", ok: false },
    ],
    right: "Right. The fixed deduction makes the fund shrink fastest.",
    wrong: "Close. It's the employer fund — the fixed deduction hits it hardest.",
  },
  certificate: {
    prompt: "Quick check: how many numbers on your certificate matter most?",
    options: [
      { label: "Two", ok: false },
      { label: "Five", ok: true },
      { label: "All of them", ok: false },
    ],
    right: "Right. Five numbers tell the story; the rest is detail.",
    wrong:
      "Almost. Focus on five: insured salary, projected pension, disability, survivors, and saved so far.",
  },
  "pillar-3a": {
    prompt: "Quick check: what does the tax room on 3a mean this year?",
    options: [
      { label: "Interest you'll earn later", ok: false },
      { label: "How much you can still pay in for a tax cut", ok: true },
      { label: "Your AHV contribution", ok: false },
    ],
    right:
      "Right. What's left in the room still lowers this year's taxable income.",
    wrong:
      "Close. Tax room is how much you can still put into 3a this year for a tax cut.",
  },
};

/** Return the one-tap quiz for a lesson, or null if none is defined here. */
export function getLessonQuiz(id: string): LessonQuiz | null {
  return QUIZZES[id] ?? null;
}
