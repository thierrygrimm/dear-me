const CERT_KEY = "dm-has-cert";
const CERT_VALUES_KEY = "dm-cert-values";

export type CertValues = {
  insuredSalary: number;
  savings: number;
  pensionAt65: number;
  conversionRate: number;
  buyIn: number;
};

export const sampleCert: CertValues = {
  insuredSalary: 78400,
  savings: 126400,
  pensionAt65: 2840,
  conversionRate: 5.2,
  buyIn: 38200,
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
