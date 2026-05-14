import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/auth/admin";
import { sendWelcomeCustomer, sendWelcomeTradie } from "@/lib/email/send";

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

  // Admin auto-promotion (ADMIN_EMAILS env)
  if (isAdminEmail(data.user.email)) {
    await supabase
      .from("profiles")
      .update({ role: "admin", onboarding_completed: true })
      .eq("id", data.user.id);
    return NextResponse.redirect(new URL("/app/admin/dashboard", url));
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
    .select("role, onboarding_completed, first_name")
    .eq("id", data.user.id)
    .single();
  const profile = profileRes.data as
    | { role?: string; onboarding_completed?: boolean; first_name?: string | null }
    | null;

  // Fire welcome email on first email-confirm sign-in (idempotent if Resend is
  // configured — Resend will dedupe by recipient if we hit a rate limit).
  // We send only when this is the user's first session by checking created_at.
  if (data.user.email && data.user.created_at) {
    const ageMs = Date.now() - new Date(data.user.created_at).getTime();
    if (ageMs < 5 * 60 * 1000) {
      if (profile?.role === "customer") {
        void sendWelcomeCustomer(data.user.email, profile.first_name ?? null);
      } else if (profile?.role === "tradie") {
        void sendWelcomeTradie(data.user.email, profile.first_name ?? null);
      }
    }
  }

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
