import { jsonError, jsonOk, readJson } from "@/lib/engine/http";
import {
  householdFromBody,
  workloadRequestSchema,
} from "@/lib/engine/request";
import { simulateWorkload } from "@/lib/engine/simulations/workload";

export async function POST(request: Request) {
  try {
    const body = workloadRequestSchema.parse(await readJson(request));
    const household = householdFromBody(body);
    const result = await simulateWorkload(
      household,
      body.personIndex,
      body.steps,
    );
    return jsonOk(result);
  } catch (error) {
    return jsonError(error);
  }
}
