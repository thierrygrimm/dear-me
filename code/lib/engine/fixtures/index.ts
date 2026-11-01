import type { Household } from "../types";
import { leaHousehold } from "./lea";

const byId: Record<string, Household> = {
  lea: leaHousehold,
  lena: leaHousehold,
};

export function fixtureHousehold(id = "lea"): Household {
  return structuredClone(byId[id] ?? leaHousehold);
}

export { leaHousehold } from "./lea";
export {
  leaWorkloadPensionsYr,
  leaDisabilityCoverYr,
  leaRiskScenarios,
  leaRetirementByAge,
  leaTax3a,
} from "./lea";
