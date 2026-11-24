/**
 * Small helpers shared by the /api/admin route handlers.
 */
import { NextResponse } from "next/server";
import { z } from "zod";
import { AdminError } from "@/lib/admin-products";

/** Read the request body as JSON, or null if it is not valid JSON. */
export async function readJson(request: Request): Promise<unknown | null> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

/** 400 response for a body that is not JSON. */
export function invalidJson() {
  return NextResponse.json({ error: "INVALID_JSON" }, { status: 400 });
}

/** 422 response listing each field's error so the form can show it next to the field. */
export function validationError(error: z.ZodError) {
  return NextResponse.json(
    { error: "VALIDATION", fieldErrors: z.flattenError(error).fieldErrors },
    { status: 422 },
  );
}

/** Turn a thrown error into a JSON response without leaking internals. */
export function handleAdminError(error: unknown, where: string) {
  if (error instanceof AdminError) {
    return NextResponse.json({ error: error.code, message: error.message }, { status: error.status });
  }
  console.error(`[${where}]`, error instanceof Error ? error.message : "unknown error");
  return NextResponse.json(
    { error: "SERVER_ERROR", message: "Something went wrong. Please try again." },
    { status: 500 },
  );
}
