import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface CurrentUser {
  id: string;
  email: string;
  role: "customer" | "tradie" | "admin" | null;
  first_name: string | null;
  last_name: string | null;
  onboarding_completed: boolean;
  avatar_url: string | null;
}

/**
 * Server-side helper. Returns the logged-in user + their profile, or redirects
 * to `/login` if not signed in. Use inside Server Components and route handlers.
 */
export async function requireUser(): Promise<{
  user: CurrentUser;
  supabase: ReturnType<typeof createSupabaseServerClient>;
}> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const profileRes = await supabase
    .from("profiles")
    .select(
      "role, first_name, last_name, onboarding_completed, avatar_url",
    )
    .eq("id", authUser.id)
    .single();

  const profile = profileRes.data as
    | Pick<
        CurrentUser,
        "role" | "first_name" | "last_name" | "onboarding_completed" | "avatar_url"
      >
    | null;

  return {
    user: {
      id: authUser.id,
      email: authUser.email ?? "",
      role: profile?.role ?? null,
      first_name: profile?.first_name ?? null,
      last_name: profile?.last_name ?? null,
      onboarding_completed: profile?.onboarding_completed ?? false,
      avatar_url: profile?.avatar_url ?? null,
    },
    supabase,
  };
}

export async function requireRole(role: "customer" | "tradie" | "admin") {
  const ctx = await requireUser();
  if (ctx.user.role !== role) {
    if (ctx.user.role === "tradie") redirect("/app/tradie/dashboard");
    if (ctx.user.role === "customer") redirect("/app/customer/dashboard");
    if (ctx.user.role === "admin") redirect("/app/admin/dashboard");
    redirect("/login");
  }
  return ctx;
}
