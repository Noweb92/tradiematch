import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyAbn } from "@/lib/abn/verify";

const bodySchema = z.object({ abn: z.string().min(1) });

export const runtime = "nodejs";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { valid: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { valid: false, error: "Provide an ABN as a string" },
      { status: 400 },
    );
  }

  const result = await verifyAbn(parsed.data.abn);
  // 200 even when valid:false — the caller treats this as a result, not an error.
  return NextResponse.json(result, { status: 200 });
}
