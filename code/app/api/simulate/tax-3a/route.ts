import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  householdFromBody,
  tax3aRequestSchema,
} from "@/lib/engine/request";
import { simulateTax3a } from "@/lib/engine/simulations/tax3a";

export async function POST(request: Request) {
  try {
    const body = tax3aRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);
    const result = await simulateTax3a(household, body.personIndex);
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
