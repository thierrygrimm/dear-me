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
  | "caring";

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
  caring: "Caring for a parent",
};

export function hasCertificate(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(CERT_KEY) === "1";
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
    sessionStorage.setItem(NAME_KEY, "Lena");
  }
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
