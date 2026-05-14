import { NextResponse } from "next/server";
import { searchAU } from "@/lib/geo/nominatim";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q") ?? "";
  const results = await searchAU(q);
  return NextResponse.json({ results });
}
