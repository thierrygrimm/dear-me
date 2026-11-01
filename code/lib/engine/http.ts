import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { LogismataError } from "./logismata/client";

export function jsonOk<T>(data: T, init?: ResponseInit) {
  return NextResponse.json(data, { status: 200, ...init });
}

export function jsonError(error: unknown, fallback = "Request failed") {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "Invalid request",
        issues: error.issues.map((i) => ({
          path: i.path.join("."),
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  if (error instanceof LogismataError) {
    return NextResponse.json(
      { error: error.message, operation: error.operation },
      { status: error.status && error.status >= 400 ? error.status : 502 },
    );
  }
  const message = error instanceof Error ? error.message : fallback;
  return NextResponse.json({ error: message }, { status: 500 });
}

export async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new Error("Body must be JSON");
  }
}
