import { createLead, listLeads } from "@/lib/engine/leads";
import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  householdFromBody,
  leadRequestSchema,
} from "@/lib/engine/request";
import { evaluateRules } from "@/lib/engine/rules";
import { simulateCoverage } from "@/lib/engine/simulations/coverage";
import { simulateTax3a } from "@/lib/engine/simulations/tax3a";
import { simulateWorkload } from "@/lib/engine/simulations/workload";
import { recordSuggestions } from "@/lib/engine/audit";

export async function GET() {
  return jsonOk({ leads: listLeads() });
}

export async function POST(request: Request) {
  try {
    const body = leadRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);

    const personIndex = household.persons.length > 1 ? 1 : 0;
    const [workload, coverage, tax3a] = await Promise.all([
      simulateWorkload(household, personIndex),
      simulateCoverage(household),
      simulateTax3a(household, personIndex),
    ]);

    const gaps = evaluateRules({
      household,
      workload,
      coverage,
      tax3a,
      askedForPerson: body.askedForPerson,
    });

    recordSuggestions(gaps, household);

    const lead = createLead({
      entryPoint: body.entryPoint,
      contactPreference: body.contactPreference,
      household,
      gaps,
      questions: body.questions,
    });

    return jsonOk({ lead });
  } catch (error) {
    return jsonError(error);
  }
}
