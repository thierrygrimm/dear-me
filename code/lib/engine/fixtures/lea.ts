import type { Household } from "../types";

/** Demo household: Lea (32) and partner, first child due, she plans 60%. */
export const leaHousehold: Household = {
  relationship: "married",
  sinceYear: 2021,
  persons: [
    {
      sex: 1,
      birthYear: 1992,
      fullTimeIncome: 100_000,
      workloadPc: 100,
      withBVG: true,
      retirementAge: 65,
      source: {
        fullTimeIncome: "user",
        workloadPc: "user",
        birthYear: "user",
      },
    },
    {
      sex: 2,
      birthYear: 1994,
      fullTimeIncome: 90_000,
      workloadPc: 100,
      withBVG: true,
      retirementAge: 65,
      source: {
        fullTimeIncome: "user",
        workloadPc: "user",
        birthYear: "user",
      },
    },
  ],
  children: [{ birthYear: new Date().getFullYear() + 1 }],
  postcode: "4051",
  churchTax: false,
  assets: 20_000,
  needs: {
    disabilityPc: 80,
    deathPc: 70,
    retirementPc: 80,
  },
};

/**
 * Verified Logismata retirement-base pensions for Lea (Person 2)
 * at full-time CHF 90,000 — build-spec B1.
 * Intermediate steps interpolated between verified points.
 */
export const leaWorkloadPensionsYr: Record<number, number> = {
  100: 26_506,
  90: 22_806,
  80: 19_107,
  70: 15_386,
  60: 11_666,
  50: 7_945,
  40: 4_224,
};

/** Disability cover (illness) scales with insured salary — illustrative fixture. */
export const leaDisabilityCoverYr: Record<number, number> = {
  100: 42_000,
  90: 36_800,
  80: 31_500,
  70: 26_000,
  60: 20_400,
  50: 14_700,
  40: 8_900,
};

export const leaRiskScenarios = [
  {
    id: 1,
    label: "Partner 1 disabled by illness",
    personIndex: 0 as const,
    kind: "disability-illness" as const,
    incomeNeedYr: 80_000,
    incomeTotalYr: 62_000,
    capitalGap: 180_000,
  },
  {
    id: 2,
    label: "Partner 1 disabled by accident",
    personIndex: 0 as const,
    kind: "disability-accident" as const,
    incomeNeedYr: 80_000,
    incomeTotalYr: 80_000,
    capitalGap: 0,
  },
  {
    id: 3,
    label: "Partner 1 dies of illness",
    personIndex: 0 as const,
    kind: "death-illness" as const,
    incomeNeedYr: 70_000,
    incomeTotalYr: 48_000,
    capitalGap: 220_000,
  },
  {
    id: 4,
    label: "Partner 1 dies in an accident",
    personIndex: 0 as const,
    kind: "death-accident" as const,
    incomeNeedYr: 70_000,
    incomeTotalYr: 70_000,
    capitalGap: 0,
  },
  {
    id: 5,
    label: "Partner 2 disabled by illness",
    personIndex: 1 as const,
    kind: "disability-illness" as const,
    incomeNeedYr: 72_000,
    incomeTotalYr: 41_000,
    capitalGap: 310_000,
  },
  {
    id: 6,
    label: "Partner 2 disabled by accident",
    personIndex: 1 as const,
    kind: "disability-accident" as const,
    incomeNeedYr: 72_000,
    incomeTotalYr: 72_000,
    capitalGap: 0,
  },
  {
    id: 7,
    label: "Partner 2 dies of illness",
    personIndex: 1 as const,
    kind: "death-illness" as const,
    incomeNeedYr: 63_000,
    incomeTotalYr: 39_000,
    capitalGap: 240_000,
  },
  {
    id: 8,
    label: "Partner 2 dies in an accident",
    personIndex: 1 as const,
    kind: "death-accident" as const,
    incomeNeedYr: 63_000,
    incomeTotalYr: 63_000,
    capitalGap: 0,
  },
];

export const leaRetirementByAge: Record<
  number,
  { p1: number; p2: number; gap: number; capital: number }
> = {
  60: { p1: 18_400, p2: 14_200, gap: 22_000, capital: 440_000 },
  61: { p1: 19_100, p2: 15_000, gap: 18_500, capital: 370_000 },
  62: { p1: 19_800, p2: 15_900, gap: 15_000, capital: 300_000 },
  63: { p1: 20_600, p2: 16_800, gap: 11_200, capital: 224_000 },
  64: { p1: 21_400, p2: 17_800, gap: 7_200, capital: 144_000 },
  65: { p1: 22_200, p2: 18_900, gap: 3_000, capital: 60_000 },
  66: { p1: 22_900, p2: 19_700, gap: 0, capital: 0 },
  67: { p1: 23_500, p2: 20_400, gap: 0, capital: 0 },
  68: { p1: 24_000, p2: 21_000, gap: 0, capital: 0 },
  69: { p1: 24_400, p2: 21_500, gap: 0, capital: 0 },
  70: { p1: 24_800, p2: 22_000, gap: 0, capital: 0 },
};

export const leaTax3a = {
  maxWithBVG: 7_258,
  maxWithoutBVG: 36_288,
  taxSavedAtMax: 1_820,
  taxLocationId: "4051-BS",
};
