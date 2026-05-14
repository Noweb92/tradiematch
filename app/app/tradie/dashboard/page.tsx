import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Sparkles,
  Star,
  Wallet,
  Zap,
  Heart,
  AlertCircle,
} from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";
import { tradeLabel } from "@/lib/constants/trades";
import { ManageSubscriptionButton } from "@/components/tradie/ManageSubscriptionButton";

export const metadata = { title: "Dashboard · TradieMatch" };

export default async function TradieDashboard() {
  const { user, supabase } = await requireRole("tradie");

  const tradieRes = await supabase
    .from("tradies")
    .select(
      "id, business_name, trade_categories, admin_verified, subscription_tier, subscription_status, matches_quota_monthly, matches_used_this_period, rating_average, rating_count, available",
    )
    .eq("profile_id", user.id)
    .maybeSingle();
  const tradie = tradieRes.data as
    | {
        id: string;
        business_name: string | null;
        trade_categories: string[];
        admin_verified: boolean;
        subscription_tier: string;
        subscription_status: string | null;
        matches_quota_monthly: number;
        matches_used_this_period: number;
        rating_average: number;
        rating_count: number;
        available: boolean;
      }
    | null;

  if (!tradie) redirect("/app/tradie/onboarding");
  if (!tradie.admin_verified) redirect("/app/tradie/awaiting");

  const quotaRemaining = Math.max(
    tradie.matches_quota_monthly - tradie.matches_used_this_period,
    0,
  );
  const noSub =
    tradie.subscription_tier === "none" || !tradie.subscription_status;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/15 to-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/tradie/dashboard" />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
              Tradie dashboard
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
              {tradie.business_name ?? "Welcome back"}
            </h1>
            <div className="text-xs text-navy/55 mt-1">
              {tradie.trade_categories.map(tradeLabel).join(" · ")}
            </div>
          </div>
          {!noSub && (
            <Link
              href="/app/tradie/swipe"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press"
            >
              <Heart className="w-4 h-4" />
              Start swiping
            </Link>
          )}
        </div>

        {noSub && (
          <div className="mb-6 rounded-2xl bg-orange/8 border-2 border-orange/30 p-5 flex flex-wrap items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange text-white grid place-items-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-navy">Pick a subscription to start swiping.</div>
              <div className="text-xs text-navy/65 mt-0.5">
                Basic $49 · Pro $89 · Elite $149 — all month-to-month, cancel anytime.
              </div>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange text-white text-sm font-bold shadow-glow btn-press"
            >
              Choose plan
            </Link>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard
            icon={<Sparkles className="w-4 h-4" />}
            value={`${tradie.matches_used_this_period} / ${tradie.matches_quota_monthly || "—"}`}
            label="Matches used"
            tone="orange"
          />
          <StatCard
            icon={<Star className="w-4 h-4" />}
            value={tradie.rating_average ? tradie.rating_average.toFixed(1) : "—"}
            label={`Rating · ${tradie.rating_count} reviews`}
            tone="amber"
          />
          <StatCard
            icon={<Wallet className="w-4 h-4" />}
            value={tradie.subscription_tier === "none" ? "—" : tradie.subscription_tier.toUpperCase()}
            label="Current plan"
            tone="navy"
          />
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            value={tradie.available ? "Live" : "Paused"}
            label="Availability"
            tone={tradie.available ? "success" : "navy"}
          />
        </div>

        <div className="rounded-2xl bg-white border border-navy/8 p-5 shadow-soft">
          <h2 className="text-lg font-black tracking-tight">Quick actions</h2>
          <div className="mt-4 grid sm:grid-cols-2 gap-2.5">
            <Link
              href="/app/tradie/swipe"
              className="rounded-xl border border-navy/10 hover:border-orange/40 hover:bg-orange/5 p-4 transition-all"
            >
              <div className="font-bold text-navy">Browse jobs</div>
              <div className="text-xs text-navy/55 mt-0.5">
                Swipe through open jobs in your service area.
              </div>
            </Link>
            <Link
              href="/app/tradie/account"
              className="rounded-xl border border-navy/10 hover:border-orange/40 hover:bg-orange/5 p-4 transition-all"
            >
              <div className="font-bold text-navy">Edit profile &amp; portfolio</div>
              <div className="text-xs text-navy/55 mt-0.5">
                Update rates, bio, photos, availability.
              </div>
            </Link>
            {tradie.subscription_tier === "none" ? (
              <Link
                href="/pricing"
                className="rounded-xl border border-navy/10 hover:border-orange/40 hover:bg-orange/5 p-4 transition-all"
              >
                <div className="font-bold text-navy">Choose subscription</div>
                <div className="text-xs text-navy/55 mt-0.5">
                  Basic $49 · Pro $89 · Elite $149 per month
                </div>
              </Link>
            ) : (
              <div className="rounded-xl border border-navy/10 p-4 flex flex-col gap-2">
                <div>
                  <div className="font-bold text-navy">
                    Manage subscription
                  </div>
                  <div className="text-xs text-navy/55 mt-0.5">
                    Switch plan, update card, cancel — via Stripe.
                  </div>
                </div>
                <ManageSubscriptionButton />
              </div>
            )}
            <Link
              href="/app/tradie/matches"
              className="rounded-xl border border-navy/10 hover:border-orange/40 hover:bg-orange/5 p-4 transition-all"
            >
              <div className="font-bold text-navy">View your matches</div>
              <div className="text-xs text-navy/55 mt-0.5">
                Quote, schedule, message customers.
              </div>
            </Link>
          </div>
        </div>

        <p className="mt-6 text-[11px] text-navy/40 text-center">
          {quotaRemaining} of {tradie.matches_quota_monthly || "—"} matches remaining this period.
        </p>
      </main>
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
  tone,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone: "orange" | "success" | "amber" | "navy";
}) {
  const map = {
    orange: "bg-orange/10 text-orange",
    success: "bg-success/10 text-success",
    amber: "bg-amber-100 text-amber-600",
    navy: "bg-navy/8 text-navy",
  };
  return (
    <div className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft">
      <div className={`w-8 h-8 rounded-lg grid place-items-center ${map[tone]}`}>
        {icon}
      </div>
      <div className="mt-3 text-xl sm:text-2xl font-black tracking-tight tabular-nums">
        {value}
      </div>
      <div className="text-[11px] text-navy/55 font-medium mt-0.5">{label}</div>
    </div>
  );
}
