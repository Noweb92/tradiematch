import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";

export const runtime = "nodejs";

/**
 * Idempotent — called by the login form right after sign-in to upgrade the
 * profile to admin if their email is in ADMIN_EMAILS. Returns the current role
 * either way so the client knows where to redirect.
 */
export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  if (isAdminEmail(user.email)) {
    await supabase
      .from("profiles")
      .update({ role: "admin", onboarding_completed: true })
      .eq("id", user.id);
  }

  const profileRes = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", user.id)
    .single();
  const profile = profileRes.data as
    | { role?: string; onboarding_completed?: boolean }
    | null;
  return NextResponse.json({
    role: profile?.role,
    onboarding_completed: profile?.onboarding_completed,
  });
}
