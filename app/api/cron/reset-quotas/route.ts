import { NextResponse } from "next/server";
import { createSupabaseServiceRoleClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Safety-net cron run daily (Vercel Cron). The primary quota reset path is the
 * `invoice.payment_succeeded` webhook, but if a webhook is missed for any
 * reason this catches up. Idempotent.
 *
 * Call with header `x-cron-secret` matching env var CRON_SECRET.
 */
export async function GET(request: Request) {
  const auth = request.headers.get("x-cron-secret");
  if (!process.env.CRON_SECRET || auth !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseServiceRoleClient();

  // Find active subs whose current period has ended.
  const now = new Date().toISOString();
  const res = await supabase
    .from("tradies")
    .select("id, subscription_status, subscription_current_period_end")
    .in("subscription_status", ["active", "trialing"])
    .lt("subscription_current_period_end", now);

  const rows = (res.data ?? []) as Array<{ id: string }>;
  if (rows.length === 0) {
    return NextResponse.json({ reset: 0 });
  }

  const ids = rows.map((r) => r.id);
  await supabase
    .from("tradies")
    .update({ matches_used_this_period: 0 })
    .in("id", ids);

  return NextResponse.json({ reset: ids.length });
}
