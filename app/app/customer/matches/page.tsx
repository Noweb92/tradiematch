import Link from "next/link";
import { ArrowRight, Sparkles, ChevronRight } from "lucide-react";
import { requireRole } from "@/lib/auth/current-user";
import { AppHeader } from "@/components/shared/AppHeader";

export const metadata = { title: "Your matches · TradieMatch" };

interface MatchRow {
  id: string;
  matched_at: string;
  exclusive_until: string;
  status: string;
  jobs: { title: string; trade_category: string } | null;
  tradies: {
    business_name: string | null;
    profiles: {
      first_name: string | null;
      avatar_url: string | null;
      city: string | null;
    } | null;
  } | null;
}

export default async function CustomerMatchesPage() {
  const { user, supabase } = await requireRole("customer");

  const customerRes = await supabase
    .from("customers")
    .select("id")
    .eq("profile_id", user.id)
    .single();
  const customer = customerRes.data as { id: string } | null;

  let matches: MatchRow[] = [];
  if (customer?.id) {
    const res = await supabase
      .from("matches")
      .select(
        `
        id, matched_at, exclusive_until, status,
        jobs ( title, trade_category ),
        tradies ( business_name, profiles ( first_name, avatar_url, city ) )
      `,
      )
      .eq("customer_id", customer.id)
      .order("matched_at", { ascending: false });
    matches = (res.data ?? []) as unknown as MatchRow[];
  }

  return (
    <div className="min-h-screen bg-white">
      <AppHeader email={user.email} firstName={user.first_name} homeHref="/app/customer/dashboard" />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-orange flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            {matches.length} match{matches.length === 1 ? "" : "es"}
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight mt-1">
            Your matches
          </h1>
        </div>

        {matches.length === 0 ? (
          <div className="rounded-2xl bg-white border-2 border-dashed border-navy/10 p-8 text-center">
            <div className="text-3xl mb-2">📭</div>
            <div className="font-black text-navy">No matches yet</div>
            <p className="text-sm text-navy/55 mt-1.5">
              Post a job, swipe through tradies, and your matches show up here.
            </p>
            <Link
              href="/app/customer/dashboard"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange hover:bg-orange-600 text-white text-sm font-bold shadow-glow btn-press"
            >
              Back to dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {matches.map((m) => (
              <MatchRowLink key={m.id} match={m} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function MatchRowLink({ match }: { match: MatchRow }) {
  const t = match.tradies;
  const j = match.jobs;
  const photo =
    t?.profiles?.avatar_url ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t?.business_name ?? t?.profiles?.first_name ?? "Tradie")}&backgroundColor=0A2540&textColor=FFFFFF`;

  return (
    <Link
      href={`/app/customer/matches/${match.id}`}
      className="group flex items-center gap-3 rounded-2xl bg-white border border-navy/8 px-4 py-3 hover:border-navy/20 hover:shadow-soft transition-all"
    >
      <img src={photo} alt="" className="w-12 h-12 rounded-2xl object-cover" />
      <div className="flex-1 min-w-0">
        <div className="font-bold text-navy truncate">
          {t?.business_name ?? t?.profiles?.first_name ?? "Tradie"}
        </div>
        <div className="text-xs text-navy/55 truncate">
          {j?.title ?? "Job"} · {t?.profiles?.city ?? ""}
        </div>
        <div className="text-[10px] text-success font-bold uppercase tracking-wider mt-0.5">
          {match.status === "active"
            ? "Active match · Reply within 48h"
            : match.status}
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-navy/40 group-hover:text-orange group-hover:translate-x-0.5 transition-all" />
    </Link>
  );
}
