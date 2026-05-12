import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Supabase auth callback (email confirmation + Google OAuth).
 * URL: /auth/callback?code=<code>&next=<path>&role=<role>
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next");
  const role = url.searchParams.get("role"); // 'customer' | 'tradie' (OAuth signup)

  if (!code) {
    return NextResponse.redirect(new URL("/login", url));
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(new URL(`/login?error=${error?.message ?? "auth"}`, url));
  }

  // If this is a fresh OAuth signup and role was passed via URL, write it into profile
  if (role && (role === "customer" || role === "tradie")) {
    const existing = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    const existingRole = (existing.data as { role?: string } | null)?.role;
    if (!existingRole) {
      await supabase.from("profiles").update({ role }).eq("id", data.user.id);
      if (role === "customer") {
        await supabase
          .from("customers")
          .upsert({ profile_id: data.user.id }, { onConflict: "profile_id" });
      }
    }
  }

  // Decide where to send the user
  if (next) {
    return NextResponse.redirect(new URL(next, url));
  }

  const profileRes = await supabase
    .from("profiles")
    .select("role, onboarding_completed")
    .eq("id", data.user.id)
    .single();
  const profile = profileRes.data as
    | { role?: string; onboarding_completed?: boolean }
    | null;

  let dest = "/";
  if (profile?.role === "admin") dest = "/app/admin/dashboard";
  else if (profile?.role === "tradie") {
    dest = profile.onboarding_completed
      ? "/app/tradie/dashboard"
      : "/app/tradie/onboarding";
  } else if (profile?.role === "customer") {
    dest = profile.onboarding_completed
      ? "/app/customer/dashboard"
      : "/app/customer/onboarding";
  }

  return NextResponse.redirect(new URL(dest, url));
}
