import { recordSuggestions } from "@/lib/engine/audit";
import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  householdFromBody,
  recommendationsRequestSchema,
} from "@/lib/engine/request";
import { evaluateRules, RULES_VERSION } from "@/lib/engine/rules";
import { simulateCoverage } from "@/lib/engine/simulations/coverage";
import { simulateTax3a } from "@/lib/engine/simulations/tax3a";
import { simulateWorkload } from "@/lib/engine/simulations/workload";

export async function POST(request: Request) {
  try {
    const body = recommendationsRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);

    const [workload, coverage, tax3a] = await Promise.all([
      body.includeWorkload
        ? simulateWorkload(household, body.personIndex)
        : Promise.resolve(undefined),
      body.includeCoverage
        ? simulateCoverage(household)
        : Promise.resolve(undefined),
      body.includeTax3a
        ? simulateTax3a(household, body.personIndex)
        : Promise.resolve(undefined),
    ]);

    const suggestions = evaluateRules({
      household,
      workload,
      coverage,
      tax3a,
      askedForPerson: body.askedForPerson,
    });

    const audit = recordSuggestions(suggestions, household);

    return jsonOk({
      rulesVersion: RULES_VERSION,
      suggestions,
      auditIds: audit.map((a) => a.id),
      workload,
      coverage,
      tax3a,
    });
  } catch (error) {
    return jsonError(error);
  }
}
