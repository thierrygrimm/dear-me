import { getLead } from "@/lib/engine/leads";
import { jsonOk } from "@/lib/engine/http";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const lead = getLead(id);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }
  return jsonOk({ lead });
}
