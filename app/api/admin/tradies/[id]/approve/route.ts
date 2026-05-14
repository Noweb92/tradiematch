import { NextResponse } from "next/server";
import { z } from "zod";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendTradieApprovedEmail } from "@/lib/email/send";

export const runtime = "nodejs";

const bodySchema = z.object({
  action: z.enum(["approve", "reject"]),
  reason: z.string().max(500).optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const meRes = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if ((meRes.data as { role?: string } | null)?.role !== "admin") {
    return NextResponse.json({ error: "Admins only" }, { status: 403 });
  }

  if (parsed.data.action === "approve") {
    const upd = await supabase
      .from("tradies")
      .update({
        admin_verified: true,
        admin_verified_at: new Date().toISOString(),
        admin_verified_by: user.id,
        admin_rejection_reason: null,
      })
      .eq("id", params.id)
      .select("profile_id, business_name")
      .single();
    if (upd.error) {
      return NextResponse.json({ error: upd.error.message }, { status: 500 });
    }
    const tradie = upd.data as { profile_id: string; business_name: string | null };

    // Audit log
    await supabase.from("admin_actions").insert({
      admin_id: user.id,
      action: "approve_tradie",
      target_type: "tradie",
      target_id: params.id,
    });

    // Email
    const profileRes = await supabase
      .from("profiles")
      .select("email, first_name")
      .eq("id", tradie.profile_id)
      .single();
    const profile = profileRes.data as
      | { email: string; first_name: string | null }
      | null;
    if (profile?.email) {
      await sendTradieApprovedEmail({
        to: profile.email,
        firstName: profile.first_name,
        businessName: tradie.business_name,
      });
    }

    return NextResponse.json({ ok: true });
  }

  // reject
  const upd = await supabase
    .from("tradies")
    .update({
      admin_verified: false,
      admin_rejection_reason: parsed.data.reason ?? "Documents did not meet our verification standard.",
    })
    .eq("id", params.id)
    .select("profile_id, business_name")
    .single();
  if (upd.error) {
    return NextResponse.json({ error: upd.error.message }, { status: 500 });
  }
  await supabase.from("admin_actions").insert({
    admin_id: user.id,
    action: "reject_tradie",
    target_type: "tradie",
    target_id: params.id,
    metadata: { reason: parsed.data.reason },
  });
  return NextResponse.json({ ok: true });
}
