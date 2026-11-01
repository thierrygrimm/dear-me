"use client";

import { readCertificate, readIntake } from "@/lib/session";
import { demoHousehold } from "./demoClient";
import type { Household } from "./types";

/**
 * Demo household: Lea fixture patched with intake salary/pensum and cert.
 * Other personas keep the fixture clone until we add their packs.
 */
export function householdForDemo(personaId = "lena"): Household {
  const h = demoHousehold(personaId);
  if (personaId !== "lena" && personaId !== "lea") return h;

  const intake = readIntake();
  const cert = readCertificate();
  const her = h.persons[1];
  if (!her) return h;

  if (intake?.salary) {
    her.fullTimeIncome = intake.salary;
    her.source.fullTimeIncome = "user";
  }
  if (intake?.pensumAfter != null) {
    her.workloadPc = intake.pensumAfter;
    her.source.workloadPc = "user";
  }
  if (cert) {
    her.pillar2 = {
      pensionAt65: cert.pensionAt65,
      currentCapital: cert.savings,
      ...her.pillar2,
    };
    her.source.pillar2 = "document";
  }
  return h;
}
