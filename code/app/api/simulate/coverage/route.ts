import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  coverageRequestSchema,
  householdFromBody,
} from "@/lib/engine/request";
import { simulateCoverage } from "@/lib/engine/simulations/coverage";

export async function POST(request: Request) {
  try {
    const body = coverageRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);
    const result = await simulateCoverage(household);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
