import { getTrace } from "@/lib/engine/traces";
import { jsonOk } from "@/lib/engine/http";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const trace = getTrace(id);
  if (!trace) {
    return NextResponse.json({ error: "Trace not found" }, { status: 404 });
  }
  return jsonOk({ trace });
}
