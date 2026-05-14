import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { TradieSwipeRunner } from "@/components/tradie/SwipeRunner";

export const metadata = { title: "Browse jobs · TradieMatch" };

export default async function TradieSwipePage() {
  const { user, supabase } = await requireRole("tradie");

  const tradieRes = await supabase
    .from("tradies")
    .select(
      "id, admin_verified, subscription_status, subscription_tier, matches_quota_monthly, matches_used_this_period",
    )
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | {
        id: string;
        admin_verified: boolean;
        subscription_status: string | null;
        subscription_tier: string;
        matches_quota_monthly: number;
        matches_used_this_period: number;
      }
    | null;

  if (!tradie) redirect("/app/tradie/onboarding");
  if (!tradie.admin_verified) redirect("/app/tradie/awaiting");
  if (tradie.subscription_tier === "none" || !tradie.subscription_status) {
    redirect("/pricing");
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/dashboard" />
      <TradieSwipeRunner
        tradieId={tradie.id}
        quotaTotal={tradie.matches_quota_monthly}
        quotaUsed={tradie.matches_used_this_period}
      />
    </div>
  );
}
