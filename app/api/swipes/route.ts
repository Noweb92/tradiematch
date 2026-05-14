import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SwipeResult } from "@/lib/matching/types";
import { sendNewMatchCustomer, sendNewMatchTradie } from "@/lib/email/send";

export const runtime = "nodejs";

const bodySchema = z.object({
  jobId: z.string().uuid(),
  tradieId: z.string().uuid(),
  direction: z.enum(["left", "right"]),
});

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Invalid swipe payload" },
      { status: 400 },
    );
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ ok: false, error: "Not signed in" }, { status: 401 });
  }

  // Determine role
  const profileRes = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  const role = (profileRes.data as { role?: string } | null)?.role;
  if (role !== "customer" && role !== "tradie") {
    return NextResponse.json(
      { ok: false, error: "Only customers and tradies can swipe" },
      { status: 403 },
    );
  }

  // For tradie swipers: verify they own the tradie row referenced
  if (role === "tradie") {
    const ownership = await supabase
      .from("tradies")
      .select("id")
      .eq("profile_id", user.id)
      .eq("id", parsed.data.tradieId)
      .maybeSingle();
    if (!(ownership.data as { id?: string } | null)?.id) {
      return NextResponse.json(
        { ok: false, error: "You can only swipe as your own tradie account" },
        { status: 403 },
      );
    }
  }

  // For customer swipers: verify they own the job
  if (role === "customer") {
    const jobRes = await supabase
      .from("jobs")
      .select("customer_id, customers(profile_id)")
      .eq("id", parsed.data.jobId)
      .maybeSingle();
    const row = jobRes.data as
      | { customer_id: string; customers: { profile_id: string } | null }
      | null;
    if (row?.customers?.profile_id !== user.id) {
      return NextResponse.json(
        { ok: false, error: "Not your job" },
        { status: 403 },
      );
    }
  }

  const { data, error } = await supabase.rpc("swipe_and_match", {
    p_job_id: parsed.data.jobId,
    p_tradie_id: parsed.data.tradieId,
    p_swiper_role: role,
    p_direction: parsed.data.direction,
  });

  if (error) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 },
    );
  }

  const result = data as SwipeResult;

  // Fire-and-forget match notifications (both sides).
  if (result.ok && result.matched && result.match_id) {
    void notifyMatch(supabase, result.match_id);
  }

  return NextResponse.json(result);
}

async function notifyMatch(
  supabase: ReturnType<typeof createSupabaseServerClient>,
  matchId: string,
) {
  try {
    const res = await supabase
      .from("matches")
      .select(
        `
        id,
        jobs ( title ),
        tradies ( business_name, profiles ( email, first_name ) ),
        customers ( profiles ( email, first_name ) )
      `,
      )
      .eq("id", matchId)
      .single();
    const m = res.data as
      | {
          jobs: { title: string } | null;
          tradies: {
            business_name: string | null;
            profiles: { email: string; first_name: string | null } | null;
          } | null;
          customers: {
            profiles: { email: string; first_name: string | null } | null;
          } | null;
        }
      | null;
    if (!m) return;
    const customerEmail = m.customers?.profiles?.email;
    const tradieEmail = m.tradies?.profiles?.email;
    const jobTitle = m.jobs?.title ?? "Your job";
    const business = m.tradies?.business_name ?? "Your tradie";
    if (customerEmail) {
      await sendNewMatchCustomer({
        to: customerEmail,
        tradieBusiness: business,
        jobTitle,
        matchId,
      });
    }
    if (tradieEmail) {
      await sendNewMatchTradie({
        to: tradieEmail,
        jobTitle,
        customerFirst: m.customers?.profiles?.first_name ?? null,
        matchId,
      });
    }
  } catch (err) {
    console.error("[notifyMatch]", err);
  }
}
