import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Hourly cron — expires inactive matches past their `exclusive_until` and
 * returns the underlying job to status='open'. Calls the SQL function
 * expire_matches() defined in supabase/migrations/0002_matching.sql.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceRoleClient();
  const { data, error } = await supabase.rpc("expire_matches");
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ expired: data ?? 0 });
}
