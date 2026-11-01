import { listAudit } from "@/lib/engine/audit";
import { jsonOk } from "@/lib/engine/http";

export async function GET() {
  return jsonOk({ entries: listAudit() });
}
