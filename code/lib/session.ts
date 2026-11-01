import { getPersona, readPersonaId } from "@/lib/personas";

const CERT_KEY = "dm-has-cert";
const CERT_VALUES_KEY = "dm-cert-values";
const SIGNED_IN_KEY = "dm-signed-in";
const PROVIDER_KEY = "dm-auth-provider";
const MOMENTS_KEY = "dm-moments";
const ONBOARDED_KEY = "dm-onboarded";
const NAME_KEY = "dm-name";
const INTAKE_KEY = "dm-intake";
const SHARE_PAX_KEY = "dm-share-pax";
const SCOPE_KEY = "dm-planning-scope";
const LEAD_KEY = "dm-lead-id";
const CHAT_HISTORY_KEY = "dm-chat-history";

/** First name from the active demo persona (e.g. "Ruth" from "Ruth, 61"). */
function nameFromActivePersona(): string {
  const who = getPersona(readPersonaId()).who;
  const first = who.split(",")[0]?.trim();
  return first || "Lena";
}

export type PlanningScope = "me" | "us" | "family";
export type AuthProvider = "pax" | "apple" | "google" | "email" | "guest";

export type LifeMoment =
  | "child"
  | "less"
  | "home"
  | "together"
  | "firstjob"
  | "selfemployed"
  | "separating"
  | "bonus"
  | "caring"
  | "grandchild"
  | "catchup"
  | "retire";

export type CertValues = {
  insuredSalary: number;
  savings: number;
  pensionAt65: number;
  conversionRate: number;
  buyIn: number;
};

/** Fictional sample from the design-system Certificate preview */
export const sampleCert: CertValues = {
  insuredSalary: 61365,
  savings: 84300,
  pensionAt65: 1680,
  conversionRate: 6.0,
  buyIn: 42800,
};

export const suggestedMoments: {
  id: LifeMoment;
  label: string;
}[] = [
  { id: "child", label: "Expecting a child" },
  { id: "less", label: "Working less" },
  { id: "home", label: "Buying a home" },
  { id: "together", label: "Living together, not married" },
];

export const moreMoments: {
  id: LifeMoment;
  label: string;
}[] = [
  { id: "firstjob", label: "First job" },
  { id: "selfemployed", label: "Going self-employed" },
  { id: "separating", label: "Separating" },
  { id: "bonus", label: "A bonus or inheritance" },
  { id: "grandchild", label: "Saving for a grandchild" },
  { id: "catchup", label: "Saving more before retirement" },
  { id: "retire", label: "Retiring in the next few years" },
  { id: "caring", label: "Caring for a parent" },
];

/** @deprecated use suggestedMoments / moreMoments */
export const momentLabels: Record<LifeMoment, string> = {
  child: "Expecting a child",
  less: "Working less",
  home: "Buying a home",
  together: "Living together, not married",
  firstjob: "First job",
  selfemployed: "Going self-employed",
  separating: "Separating",
  bonus: "A bonus or inheritance",
  grandchild: "Saving for a grandchild",
  catchup: "Saving more before retirement",
  retire: "Retiring in the next few years",
  caring: "Caring for a parent",
};

/**
 * Age eligibility from LifeMoments design system.
 * Unknown age → show moments that don't need a band (or treat employed/partner as eligible).
 */
function momentEligible(id: LifeMoment, age: number | null): boolean {
  switch (id) {
    case "firstjob":
      return age === null || age < 30;
    case "together":
      return true; // unmarried-context unknown → show
    case "child":
      return age === null || (age >= 18 && age <= 45);
    case "less":
      return true; // employed unknown → always eligible
    case "home":
      return age === null || (age >= 25 && age <= 60);
    case "selfemployed":
      return age === null || age < 60;
    case "separating":
      return true; // partner context unknown → show
    case "bonus":
      return true;
    case "grandchild":
      return age !== null && age >= 45;
    case "catchup":
      return age !== null && age >= 50;
    case "retire":
      return age !== null && age >= 58;
    case "caring":
      return age !== null && age >= 40;
    default:
      return true;
  }
}

/** Fill order when a preferred set has fewer than four eligible moments. */
const SUGGEST_FILL: LifeMoment[] = [
  "child",
  "less",
  "home",
  "together",
  "firstjob",
  "selfemployed",
  "separating",
  "bonus",
  "grandchild",
  "catchup",
  "retire",
  "caring",
];

/** Age-band preference for the four suggested tiles (Lena ~34 vs Ruth ~61). */
function suggestPrefer(age: number | null): LifeMoment[] {
  if (age !== null && age >= 58) {
    return ["retire", "catchup", "bonus", "caring"];
  }
  if (age !== null && age >= 50) {
    return ["catchup", "caring", "bonus", "grandchild"];
  }
  if (age !== null && age >= 40) {
    return ["caring", "home", "less", "bonus"];
  }
  if (age !== null && age < 30) {
    return ["firstjob", "together", "home", "bonus"];
  }
  // ~30–39 or unknown → Lena-like default
  return ["child", "less", "home", "together"];
}

/**
 * Split eligible moments into up to four suggested tiles and the rest for “Something else”.
 */
export function momentsForAge(age: number | null): {
  suggested: LifeMoment[];
  more: LifeMoment[];
} {
  const eligible = SUGGEST_FILL.filter((id) => momentEligible(id, age));
  const suggested: LifeMoment[] = [];
  for (const id of suggestPrefer(age)) {
    if (suggested.length >= 4) break;
    if (eligible.includes(id) && !suggested.includes(id)) suggested.push(id);
  }
  for (const id of eligible) {
    if (suggested.length >= 4) break;
    if (!suggested.includes(id)) suggested.push(id);
  }
  const more = eligible.filter((id) => !suggested.includes(id));
  return { suggested, more };
}

export function hasCertificate(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CERT_KEY) === "1";
}

/**
 * First Home after signup: topic + net + lesson (+ bring certificate),
 * before appointment, letter, and Wrapped join the feed.
 * myPax signs in with a certificate already, so day-one is "no life
 * moment asked yet" — not "no certificate".
 */
export function isHomeDay1(): boolean {
  if (typeof window === "undefined") return false;
  return readAskedMoments().length === 0;
}

export function markCertificate(values: CertValues = sampleCert): void {
  sessionStorage.setItem(CERT_KEY, "1");
  sessionStorage.setItem(CERT_VALUES_KEY, JSON.stringify(values));
}

export function readCertificate(): CertValues | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(CERT_VALUES_KEY);
  if (!raw) return hasCertificate() ? sampleCert : null;
  try {
    return JSON.parse(raw) as CertValues;
  } catch {
    return sampleCert;
  }
}

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SIGNED_IN_KEY) === "1";
}

export function readProvider(): AuthProvider | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(PROVIDER_KEY);
  if (
    v === "pax" ||
    v === "apple" ||
    v === "google" ||
    v === "email" ||
    v === "guest"
  ) {
    return v;
  }
  return null;
}

export function markSignedIn(provider: AuthProvider): void {
  sessionStorage.setItem(SIGNED_IN_KEY, "1");
  sessionStorage.setItem(PROVIDER_KEY, provider);
  sessionStorage.setItem("dm-booted", "1");
  if (provider === "pax") {
    // With myPax, cover arrives with login — no certificate scan.
    markCertificate();
    // Age-banded moment tiles key off this name (Lena/Noah/Sandra/Ruth).
    sessionStorage.setItem(NAME_KEY, nameFromActivePersona());
  }
}

/** Keep dm-name aligned when "Try another life" switches persona. */
export function syncNameFromPersona(): void {
  if (typeof window === "undefined") return;
  if (readProvider() !== "pax") return;
  sessionStorage.setItem(NAME_KEY, nameFromActivePersona());
}

export function isPaxConnected(): boolean {
  return readProvider() === "pax" && hasCertificate();
}

function isLifeMoment(v: string): v is LifeMoment {
  return v in momentLabels;
}

export function readMoments(): LifeMoment[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(MOMENTS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is LifeMoment => typeof x === "string" && isLifeMoment(x));
  } catch {
    return [];
  }
}

/** Primary moment for copy (first selected). */
export function readMoment(): LifeMoment | null {
  return readMoments()[0] ?? null;
}

export function markMoments(moments: LifeMoment[]): void {
  sessionStorage.setItem(MOMENTS_KEY, JSON.stringify(moments));
}

/** @deprecated use markMoments */
export function markMoment(moment: LifeMoment): void {
  markMoments([moment]);
}

export function isOnboarded(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(ONBOARDED_KEY) === "1";
}

export function markOnboarded(): void {
  sessionStorage.setItem(ONBOARDED_KEY, "1");
}

export function readName(): string {
  if (typeof window === "undefined") return "there";
  return sessionStorage.getItem(NAME_KEY) || "there";
}

/** Headline for the Your plan screen, based on selected moments. */
export function planHeadline(name: string, moments: LifeMoment[]): string {
  const who = name === "there" ? "Let's" : `${name}, let's`;
  if (moments.includes("child")) return `${who} look at the baby together.`;
  if (moments.includes("less")) return `${who} look at working less together.`;
  if (moments.includes("home")) return `${who} look at the home together.`;
  if (moments.includes("together")) return `${who} look at living together.`;
  if (moments.includes("firstjob")) return `${who} look at your first job together.`;
  if (moments.includes("selfemployed")) return `${who} look at working for yourself.`;
  if (moments.includes("separating")) return `${who} look at the new numbers together.`;
  if (moments.includes("bonus")) return `${who} look at that money together.`;
  if (moments.includes("grandchild")) return `${who} look at saving for a grandchild.`;
  if (moments.includes("catchup")) return `${who} look at catching up before retirement.`;
  if (moments.includes("retire")) return `${who} look at making the money last.`;
  if (moments.includes("caring")) return `${who} look at caring and your pension.`;
  return `${who} get your plan started.`;
}

export type IntakeValues = {
  pensumToday: number;
  pensumAfter: number;
  salary: number;
  savings: number;
};

export function markIntake(values: IntakeValues): void {
  sessionStorage.setItem(INTAKE_KEY, JSON.stringify(values));
}

export function readIntake(): IntakeValues | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(INTAKE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as IntakeValues;
  } catch {
    return null;
  }
}

export function readSharePax(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(SHARE_PAX_KEY) === "1";
}

export function markSharePax(on: boolean): void {
  if (on) sessionStorage.setItem(SHARE_PAX_KEY, "1");
  else sessionStorage.removeItem(SHARE_PAX_KEY);
}

export function readLeadId(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(LEAD_KEY);
}

export function markLeadId(id: string): void {
  sessionStorage.setItem(LEAD_KEY, id);
}

export function readChatHistory(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(CHAT_HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((x): x is string => typeof x === "string")
      : [];
  } catch {
    return [];
  }
}

export function pushChatHistory(question: string): void {
  const q = question.trim();
  if (!q) return;
  const next = [q, ...readChatHistory().filter((x) => x !== q)].slice(0, 12);
  sessionStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(next));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("dm-chat-history"));
  }
}

export function readPlanningScope(): PlanningScope {
  if (typeof window === "undefined") return "me";
  const v = sessionStorage.getItem(SCOPE_KEY);
  if (v === "me" || v === "us" || v === "family") return v;
  return "me";
}

export function markPlanningScope(scope: PlanningScope): void {
  sessionStorage.setItem(SCOPE_KEY, scope);
}

/** Heading that follows the who-is-planning control (Segmented README). */
export function planningScopeHeading(scope: PlanningScope): string {
  if (scope === "us") return "Your joint pension at 65";
  if (scope === "family") return "Your family's plan, three of you";
  return "Your pension at 65";
}

const MOMENT_ASKED_KEY = "dm-moment-asked";
const MOMENT_ANSWERS_KEY = "dm-moment-answers";

/** Moments that already finished the LifeMoments C1 ask-before-telling flow. */
export function readAskedMoments(): LifeMoment[] {
  if (typeof window === "undefined") return [];
  const raw = sessionStorage.getItem(MOMENT_ASKED_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((x): x is LifeMoment => typeof x === "string" && isLifeMoment(x));
  } catch {
    return [];
  }
}

export function markMomentAsked(moment: LifeMoment): void {
  const next = Array.from(new Set([...readAskedMoments(), moment]));
  sessionStorage.setItem(MOMENT_ASKED_KEY, JSON.stringify(next));
}

/** Reset C1 asked state — used when "Try another life" switches persona. */
export function clearMomentAsked(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MOMENT_ASKED_KEY);
}

export function readMomentAnswers(moment: LifeMoment): Record<string, string> {
  if (typeof window === "undefined") return {};
  const raw = sessionStorage.getItem(MOMENT_ANSWERS_KEY);
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw) as Record<string, Record<string, string>>;
    return parsed[moment] ?? {};
  } catch {
    return {};
  }
}

export function markMomentAnswers(
  moment: LifeMoment,
  answers: Record<string, string>,
): void {
  let all: Record<string, Record<string, string>> = {};
  if (typeof window !== "undefined") {
    const raw = sessionStorage.getItem(MOMENT_ANSWERS_KEY);
    if (raw) {
      try {
        all = JSON.parse(raw) as Record<string, Record<string, string>>;
      } catch {
        all = {};
      }
    }
  }
  all[moment] = answers;
  sessionStorage.setItem(MOMENT_ANSWERS_KEY, JSON.stringify(all));
}

/** Clear C1 answers so a new persona starts a fresh ask. */
export function clearMomentAnswers(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(MOMENT_ANSWERS_KEY);
}
