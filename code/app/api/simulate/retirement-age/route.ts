import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  householdFromBody,
  retirementAgeRequestSchema,
} from "@/lib/engine/request";
import { simulateRetirementAge } from "@/lib/engine/simulations/retirementAge";

export async function POST(request: Request) {
  try {
    const body = retirementAgeRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);
    const result = await simulateRetirementAge(
      household,
      body.personIndex,
      body.ages,
    );
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
