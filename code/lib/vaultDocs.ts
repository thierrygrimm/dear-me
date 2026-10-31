export type DocType = "pension" | "ahv" | "3a" | "ins";

export type DocStatus = "new" | "ok" | "old" | "waiting";

export type VaultDoc = {
  id: string;
  type: DocType;
  title: string;
  detail: string;
  status?: DocStatus;
  statusLabel?: string;
  missing?: boolean;
  /** Colour strip on the paper thumb */
  strip: string;
  values?: { label: string; value: string }[];
  scannedAt?: string;
  reading?: boolean;
  /** Hide from main list; show under Coming up / Asked for you */
  upcoming?: boolean;
  requested?: boolean;
};

export const TYPE_STRIP: Record<DocType, string> = {
  pension: "var(--neonweste)",
  ahv: "var(--hafermilch)",
  "3a": "var(--kaugummi)",
  ins: "var(--rosa-brille)",
};

export const SEED_DOCS: VaultDoc[] = [
  {
    id: "pk-2026",
    type: "pension",
    title: "Pension fund certificate",
    detail: "2026 · 9 values read",
    status: "new",
    statusLabel: "Up to date",
    strip: "var(--neonweste)",
    scannedAt: "scanned 12 Oct",
    values: [
      { label: "Insured salary", value: "61'365" },
      { label: "Savings today", value: "84'300" },
      { label: "Pension at 65", value: "1'680 / mo" },
      { label: "Conversion rate", value: "6.0 %" },
    ],
  },
  {
    id: "3a-2025",
    type: "3a",
    title: "Pillar 3a statement",
    detail: "2025 · 2 values read",
    status: "ok",
    statusLabel: "OK",
    strip: "var(--kaugummi)",
    scannedAt: "scanned 3 Mar",
    values: [
      { label: "Balance", value: "18'420" },
      { label: "Paid in 2025", value: "7'258" },
    ],
  },
  {
    id: "pk-2025",
    type: "pension",
    title: "Pension fund certificate",
    detail: "2025 · replaced",
    status: "old",
    statusLabel: "Older",
    strip: "var(--hafermilch)",
    scannedAt: "scanned last year",
    values: [
      { label: "Insured salary", value: "58'200" },
      { label: "Savings then", value: "71'100" },
    ],
  },
  {
    id: "ahv-missing",
    type: "ahv",
    title: "AHV statement",
    detail: "Missing · we can request it for you",
    missing: true,
    strip: "var(--hafermilch)",
  },
];

export const UPCOMING_DOCS: VaultDoc[] = [
  {
    id: "up-pk",
    type: "pension",
    title: "New pension fund certificate",
    detail: "Usually arrives in January. We'll ask you to scan it.",
    missing: true,
    statusLabel: "Jan",
    strip: "var(--hafermilch)",
    upcoming: true,
  },
  {
    id: "up-3a",
    type: "3a",
    title: "Pillar 3a, last day to pay in",
    detail: "31 December · up to 7'258",
    missing: true,
    status: "old",
    statusLabel: "Dec",
    strip: "var(--hafermilch)",
    upcoming: true,
  },
];

export const REQUESTED_DOCS: VaultDoc[] = [
  {
    id: "req-ahv",
    type: "ahv",
    title: "AHV statement",
    detail: "Requested 28 Oct · usually 2 weeks",
    status: "waiting",
    statusLabel: "Waiting",
    strip: "var(--line)",
    requested: true,
  },
];

export const FILTERS: { id: DocType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "pension", label: "Pension fund" },
  { id: "ahv", label: "AHV" },
  { id: "3a", label: "Pillar 3a" },
  { id: "ins", label: "Insurance" },
];
