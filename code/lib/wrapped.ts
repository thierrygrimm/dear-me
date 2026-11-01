import type { PersonaId } from "@/lib/personas";

/** Demo copy for "Your 2026, wrapped" — one story per persona. */
export type WrappedStoryData = {
  firstName: string;
  putAway: number;
  putAwayLabel: string;
  nuts: number;
  momentTitle: string;
  firstQuestion: string;
  topQuestions: [string, string, string];
  askNote: string;
  changeLead: string;
  changeValue: string;
  changeBody: string;
  plannerType: string;
  plannerBody: string;
  letter: string;
  letterCta: string;
  shareMoment: string;
  sharePlanner: string;
};

export const WRAPPED: Record<PersonaId, WrappedStoryData> = {
  lena: {
    firstName: "Lena",
    putAway: 14200,
    putAwayLabel: "CHF 14'200",
    nuts: 71,
    momentTitle: "Baby on the way.",
    firstQuestion:
      'Your first question, at 23:41: "Can I go to 60 % after the baby?"',
    topQuestions: [
      "Can I go to 60 % after the baby?",
      "Who should reduce, me or Marco?",
      "Do we need cover for the baby?",
    ],
    askNote: "You asked 9 questions. 6 of them after 22:00.",
    changeLead: "Your pension at 65 grew by",
    changeValue: "+ CHF 180",
    changeBody:
      "a month. Even at 60 % after the baby, the two of you stay above your goal.",
    plannerType: "The Early Squirrel.",
    plannerBody: "You sorted things out months before you had to.",
    letter: "Dear us, before we decide who stays home.",
    letterCta: "Let's talk about it in January",
    shareMoment: "Baby",
    sharePlanner: "Early Squirrel",
  },
  noah: {
    firstName: "Noah",
    putAway: 3800,
    putAwayLabel: "CHF 3'800",
    nuts: 19,
    momentTitle: "Your first real salary.",
    firstQuestion:
      'Your first question: "Do I need a 3a at 24?" (Short answer: it helps a lot.)',
    topQuestions: [
      "Do I need a 3a at 24?",
      "What does my pension fund actually do?",
      "What if I get sick and can't work?",
    ],
    askNote: "You asked 5 questions. All on your lunch break.",
    changeLead: "Starting at 24 instead of 34 is worth",
    changeValue: "CHF 41'000",
    changeBody:
      "more at 65, from the same CHF 100 a month. Time did most of the work.",
    plannerType: "The Head Start.",
    plannerBody: "Most people start ten years later. You didn't.",
    letter: "Dear me at 65, I started early. You're welcome.",
    letterCta: "Keep the CHF 100 a month going",
    shareMoment: "First job",
    sharePlanner: "Head Start",
  },
  sandra: {
    firstName: "Sandra",
    putAway: 9600,
    putAwayLabel: "CHF 9'600",
    nuts: 48,
    momentTitle: "You're your own boss now.",
    firstQuestion:
      'Your first question: "What replaces the pension fund?"',
    topQuestions: [
      "What replaces the pension fund?",
      "Can I still save in 3a?",
      "What if I couldn't work?",
    ],
    askNote: "You asked 7 questions between client calls.",
    changeLead: "Your own 3a this year closed",
    changeValue: "CHF 7'200",
    changeBody:
      "of the gap the fund used to cover. Still room to grow next year.",
    plannerType: "The Independent.",
    plannerBody: "You took the cover with you when you left.",
    letter: "I'm my own boss now. That includes your pension.",
    letterCta: "Check the 3a ceiling again in spring",
    shareMoment: "Self-employed",
    sharePlanner: "Independent",
  },
  ruth: {
    firstName: "Ruth",
    putAway: 21500,
    putAwayLabel: "CHF 21'500",
    nuts: 107,
    momentTitle: "Lump sum or pension?",
    firstQuestion: 'Your first question: "How long will 380\'000 last?"',
    topQuestions: [
      "How long will 380'000 last?",
      "Pension or lump sum, or both?",
      "Can I still pay into 3a at 63?",
    ],
    askNote: "You asked 11 questions, and read every answer twice.",
    changeLead: "With your plan, your money lasts until",
    changeValue: "Age 91",
    changeBody: "instead of 79 without one. A part of it is guaranteed.",
    plannerType: "The Steady Hand.",
    plannerBody: "You took your time, and it paid off.",
    letter: "Dear me, the money's here. Now let's make it last.",
    letterCta: "Check in again in spring",
    shareMoment: "Retiring",
    sharePlanner: "Steady Hand",
  },
};

export function wrappedFor(id: PersonaId): WrappedStoryData {
  return WRAPPED[id] ?? WRAPPED.lena;
}
