/** Demo lives from DS Home · "Try another life". */

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
  appointment: {
    avatar: string;
    title: string;
    meta: string;
  };
  letterTitle: string;
  letterBody: string;
  letterFrom: string;
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
    topic: "If you couldn't work",
    topicDetail: "You'd have less than half your income.",
    net: "Strong, with one soft spot",
    lesson: "Why part-time costs more",
    lessonTime: "3 minutes",
    appointment: {
      avatar: "SK",
      title: "Tuesday with Sara",
      meta: "10:30 · video call",
    },
    letterTitle: "Dear us",
    letterBody: "Before we decide who stays home.",
    letterFrom: "A letter from the two of you to later",
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
    appointment: {
      avatar: "",
      title: "Bring in your certificate",
      meta: "Makes every number exact",
    },
    letterTitle: "Dear me at 65",
    letterBody: "I started early. You're welcome.",
    letterFrom: "A letter to your future self",
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
    appointment: {
      avatar: "JM",
      title: "Thursday with Jonas",
      meta: "14:00 · Pax office, Basel",
    },
    letterTitle: "Dear me",
    letterBody: "I'm my own boss now. That includes my pension.",
    letterFrom: "A letter to your future self",
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
    lesson: "Lump sum, pension or both",
    lessonTime: "4 minutes",
    appointment: {
      avatar: "SK",
      title: "Friday with Sara",
      meta: "09:00 · phone call",
    },
    letterTitle: "Dear us",
    letterBody: "The money's here. Now let's make it last.",
    letterFrom: "A letter from the two of you to later",
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

export function getPersona(id?: PersonaId): Persona {
  return PERSONAS[id ?? readPersonaId()];
}
