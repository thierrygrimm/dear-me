const CERT_KEY = "dm-has-cert";
const CERT_VALUES_KEY = "dm-cert-values";
const SIGNED_IN_KEY = "dm-signed-in";
const PROVIDER_KEY = "dm-auth-provider";
const MOMENT_KEY = "dm-moment";
const ONBOARDED_KEY = "dm-onboarded";
const NAME_KEY = "dm-name";

export type AuthProvider = "pax" | "apple" | "google" | "email" | "guest";

export type LifeMoment =
  | "baby"
  | "together"
  | "job"
  | "checking";

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

export const momentLabels: Record<LifeMoment, string> = {
  baby: "We're expecting a baby",
  together: "Moving in together",
  job: "New job or going part-time",
  checking: "Just checking I'm okay",
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

export function readMoment(): LifeMoment | null {
  if (typeof window === "undefined") return null;
  const v = sessionStorage.getItem(MOMENT_KEY);
  if (v === "baby" || v === "together" || v === "job" || v === "checking") {
    return v;
  }
  return null;
}

export function markMoment(moment: LifeMoment): void {
  sessionStorage.setItem(MOMENT_KEY, moment);
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
