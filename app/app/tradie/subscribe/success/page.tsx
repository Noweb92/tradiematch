import Link from "next/link";
import { CheckCircle2, Heart, ArrowRight, Sparkles } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "Welcome to TradieMatch · Subscription active" };

export default async function SubscribeSuccessPage() {
  const { user, supabase } = await requireRole("tradie");
  const tradieRes = await supabase
    .from("tradies")
    .select("business_name, subscription_tier, matches_quota_monthly, admin_verified")
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | {
        business_name: string | null;
        subscription_tier: string;
        matches_quota_monthly: number;
        admin_verified: boolean;
      }
    | null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50/40 via-white to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/dashboard" />

      <main className="max-w-xl mx-auto px-5 py-12 sm:py-16 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-success/10 text-success mb-5">
          <CheckCircle2 className="w-8 h-8" strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          You&apos;re live, mate.
        </h1>
        <p className="text-navy/65 mt-3 text-base leading-relaxed">
          Your <span className="font-bold text-orange capitalize">{tradie?.subscription_tier ?? "Pro"}</span>{" "}
          subscription is active. You&apos;ve got{" "}
          <span className="font-bold text-navy tabular-nums">
            {tradie?.matches_quota_monthly ?? "—"}
          </span>{" "}
          matches this month.
        </p>

        <div className="mt-8 rounded-2xl bg-white border border-navy/8 p-5 shadow-soft text-left">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-orange text-white grid place-items-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-navy">
                {tradie?.business_name ?? "Your business"}
              </div>
              <div className="text-xs text-navy/55 capitalize">
                {tradie?.subscription_tier} plan · Active
              </div>
            </div>
          </div>
          <div className="text-xs text-navy/65 leading-relaxed">
            {tradie?.admin_verified
              ? "Approved &amp; verified. You'll start appearing in customer swipe decks immediately."
              : "Pending admin review (usually under 24h). We'll email you once verified."}
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {tradie?.admin_verified ? (
            <Link
              href="/app/tradie/swipe"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press min-h-[48px]"
            >
              <Heart className="w-4 h-4" />
              Start swiping
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link
              href="/app/tradie/awaiting"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-navy hover:bg-navy-700 text-white font-bold shadow-lg btn-press min-h-[48px]"
            >
              Check verification status
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/app/tradie/dashboard"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white border-2 border-navy/10 text-navy font-bold hover:border-navy/25 btn-press min-h-[48px]"
          >
            Go to dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
