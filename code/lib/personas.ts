/** Demo lives from DS Home · "Try another life". */

import { personaTextFor } from "@/lib/i18n/personaCopy";
import { LESSONS } from "@/lib/lessons";
import type { LifeMoment } from "@/lib/session";
import {
  clearMomentAnswers,
  clearMomentAsked,
  markMoments,
  syncNameFromPersona,
} from "@/lib/session";
import { readLanguage, type AppLanguage } from "@/lib/settingsPrefs";

export type PersonaId = "lena" | "noah" | "sandra" | "ruth";

export type PersonaAvatar = {
  initial: string;
  background: string;
  color: string;
};

export type Persona = {
  id: PersonaId;
  avatars: PersonaAvatar[];
  name: string;
  who: string;
  tag: string;
  side: string;
  /** First name with trailing period, for the greeting line. */
  hi: string;
  sub: string;
  topic: string;
  topicDetail: string;
  net: string;
  lesson: string;
  lessonTime: string;
  /**
   * Preferred Learn deep-link id (may include upcoming lessons).
   * Use {@link lessonIdForPersona} so missing ids fall back to a shipped lesson.
   */
  lessonId: string;
  appointment: {
    avatar: string;
    title: string;
    meta: string;
  };
  letterTitle: string;
  letterBody: string;
  letterFrom: string;
  /** Canonical life-moment story for this demo persona (order = primary first). */
  moments: LifeMoment[];
  /** Earlier-chat seeds for Ask history and the laptop sidebar. */
  earlierChats: string[];
};

/** Closest shipped lesson when the preferred id is not in LESSONS yet. */
const LESSON_FALLBACK: Record<PersonaId, string> = {
  lena: "part-time",
  noah: "pillar-3a",
  sandra: "pillar-3a",
  ruth: "three-sources",
};

export const PERSONA_ORDER: PersonaId[] = ["lena", "noah", "sandra", "ruth"];

export const PERSONAS: Record<PersonaId, Persona> = {
  lena: {
    id: "lena",
    avatars: [
      {
        initial: "L",
        background: "var(--neonweste)",
        color: "var(--espressosatz)",
      },
      {
        initial: "M",
        background: "var(--rosa-brille)",
        color: "var(--pflaumenkuchen)",
      },
    ],
    name: "Lena and Marco",
    who: "Lena, 34",
    tag: "Expecting a child",
    side: "Planning together",
    hi: "Lena.",
    sub: "Most of it looks good. One thing is worth a look.",
    topic: "If you go to 60 %",
    topicDetail:
      "About CHF 600 less a month at 65 — before you decide who stays home.",
    net: "Strong, with one soft spot",
    lesson: "Why part-time costs more",
    lessonTime: "3 minutes",
    lessonId: "part-time",
    appointment: {
      avatar: "SK",
      title: "Tuesday with Sara",
      meta: "10:30 · video call",
    },
    letterTitle: "Dear us",
    letterBody: "Before we decide who stays home.",
    letterFrom: "A letter from the two of you to later",
    moments: ["child", "less"],
    earlierChats: [
      "Can I go to 60 %?",
      "Who should reduce?",
      "Is Marco covered?",
    ],
  },
  noah: {
    id: "noah",
    avatars: [
      {
        initial: "N",
        background: "var(--neonweste)",
        color: "var(--espressosatz)",
      },
    ],
    name: "Noah",
    who: "Noah, 24",
    tag: "First job",
    side: "Planning alone",
    hi: "Noah.",
    sub: "A good start. One thing is worth setting up early.",
    topic: "If you couldn't work",
    topicDetail:
      "In your first years the fund covers little. CHF 1'900 a month would be missing.",
    net: "Off to a start, one soft spot",
    lesson: "Why a 3a at 24 pays off",
    lessonTime: "2 minutes",
    lessonId: "pillar-3a",
    appointment: {
      avatar: "",
      title: "Bring in your certificate",
      meta: "Makes every number exact",
    },
    letterTitle: "Dear me at 65",
    letterBody: "I started early. You're welcome.",
    letterFrom: "A letter to your future self",
    moments: ["firstjob"],
    earlierChats: [
      "Do I need a 3a at 24?",
      "What does my pension fund do?",
      "What if I can't work?",
    ],
  },
  sandra: {
    id: "sandra",
    avatars: [
      {
        initial: "S",
        background: "var(--rosa-brille)",
        color: "var(--pflaumenkuchen)",
      },
    ],
    name: "Sandra",
    who: "Sandra, 41",
    tag: "Self-employed",
    side: "Planning alone",
    hi: "Sandra.",
    sub: "Your business is yours now. So is your pension.",
    topic: "No pension fund any more",
    topicDetail: "If you couldn't work, only AHV/IV would pay.",
    net: "One big gap: income",
    lesson: "The bigger 3a when you're self-employed",
    lessonTime: "3 minutes",
    lessonId: "pillar-3a",
    appointment: {
      avatar: "JM",
      title: "Thursday with Jonas",
      meta: "14:00 · Pax office, Basel",
    },
    letterTitle: "Dear me",
    letterBody: "I'm my own boss now. That includes your pension.",
    letterFrom: "A letter to your future self",
    moments: ["selfemployed"],
    earlierChats: [
      "What replaces the pension fund?",
      "Can I still save in 3a?",
      "What if I couldn't work?",
    ],
  },
  ruth: {
    id: "ruth",
    avatars: [
      {
        initial: "R",
        background: "var(--hafermilch)",
        color: "var(--espressosatz)",
      },
      {
        initial: "P",
        background: "var(--rosa-brille)",
        color: "var(--pflaumenkuchen)",
      },
    ],
    name: "Ruth and Peter",
    who: "Ruth, 61",
    tag: "Retiring soon",
    side: "Planning together",
    hi: "Ruth.",
    sub: "Two years to go. One choice to make.",
    topic: "Lump sum or pension?",
    topicDetail:
      "How you take your CHF 380'000 decides how long it lasts.",
    net: "Strong, check the payout",
    lesson: "AHV for couples and at 65",
    lessonTime: "4 minutes",
    lessonId: "ahv-part-2",
    appointment: {
      avatar: "SK",
      title: "Friday with Sara",
      meta: "09:00 · phone call",
    },
    letterTitle: "Dear us",
    letterBody: "The money's here. Now let's make it last.",
    letterFrom: "A letter from the two of you to later",
    moments: ["retire"],
    earlierChats: [
      "How long will 380'000 last?",
      "Pension or lump sum?",
      "Can I still pay into 3a?",
    ],
  },
};

const PERSONA_KEY = "dm-persona";

export function isPersonaId(v: string): v is PersonaId {
  return v === "lena" || v === "noah" || v === "sandra" || v === "ruth";
}

export function readPersonaId(): PersonaId {
  if (typeof window === "undefined") return "lena";
  const v = sessionStorage.getItem(PERSONA_KEY);
  if (v && isPersonaId(v)) return v;
  return "lena";
}

export function markPersonaId(id: PersonaId): void {
  sessionStorage.setItem(PERSONA_KEY, id);
}

export function getPersona(
  id?: PersonaId,
  language: AppLanguage = typeof window === "undefined"
    ? "English"
    : readLanguage(),
): Persona {
  const base = PERSONAS[id ?? readPersonaId()];
  const text = personaTextFor(base.id, language);
  return text ? { ...base, ...text } : base;
}

/**
 * Resolve a Learn deep-link for this persona.
 * Uses the preferred lessonId when that module exists; otherwise the closest shipped lesson.
 */
export function lessonIdForPersona(id?: PersonaId): string {
  const persona = getPersona(id);
  if (LESSONS.some((l) => l.id === persona.lessonId)) return persona.lessonId;
  return LESSON_FALLBACK[persona.id];
}

export function lessonPathForPersona(id?: PersonaId): string {
  return `/learn?lesson=${lessonIdForPersona(id)}`;
}

/** Canonical dm-moments for a demo persona (order = primary first). */
export function momentsForPersona(id: PersonaId): LifeMoment[] {
  return [...PERSONAS[id].moments];
}

/** Partner first name for shared-plan UI, or null when planning alone. */
export function partnerNameFor(id?: PersonaId): string | null {
  const p = getPersona(id);
  if (p.id === "lena") return "Marco";
  if (p.id === "ruth") return "Peter";
  return null;
}

/** Default advisor shown on book / Home for this life. */
export function advisorForPersona(id?: PersonaId): {
  name: string;
  role: string;
  about: string;
  noteDefault: string;
} {
  const p = getPersona(id);
  if (p.id === "sandra") {
    return {
      name: "Jonas Meier",
      role: "Pension advisor at Pax · Basel",
      about: p.topic,
      noteDefault:
        "I went self-employed. What replaces the pension fund, and what should I set up first?",
    };
  }
  if (p.id === "noah") {
    return {
      name: "Sara Keller",
      role: "Pension advisor at Pax · Basel",
      about: p.topic,
      noteDefault:
        "First job, first salary. Do I need a 3a at 24, and what if I couldn't work?",
    };
  }
  if (p.id === "ruth") {
    return {
      name: "Sara Keller",
      role: "Pension advisor at Pax · Basel",
      about: p.topic,
      noteDefault:
        "How should we take the CHF 380'000 — lump sum, pension, or both?",
    };
  }
  return {
    name: "Sara Keller",
    role: "Pension advisor at Pax · Basel",
    about: "Can I go to 60 % after the baby?",
    noteDefault:
      "Can I go to 60 % from March without a gap in my pension?",
  };
}

/**
 * Switch demo life: persona id + name, sync moments, clear C1 asked/answers
 * so Chat opens a fresh LifeMomentAsk for that story.
 */
export function applyPersona(id: PersonaId): void {
  markPersonaId(id);
  syncNameFromPersona();
  markMoments(momentsForPersona(id));
  clearMomentAsked();
  clearMomentAnswers();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("dm-persona"));
  }
}
