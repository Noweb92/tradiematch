"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft, MapPin } from "lucide-react";
import Link from "next/link";
import { TradieSwipeCard } from "@/components/swipe/TradieSwipeCard";
import { SwipeActions } from "@/components/swipe/SwipeActions";
import { MatchOverlay } from "@/components/MatchOverlay";
import type { TradieCard, SwipeResult } from "@/lib/matching/types";

interface Props {
  jobId: string;
  jobTitle: string;
}

export function CustomerSwipeRunner({ jobId, jobTitle }: Props) {
  const router = useRouter();
  const [tradies, setTradies] = useState<TradieCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [matched, setMatched] = useState<TradieCard | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let aborted = false;
    (async () => {
      const res = await fetch(`/api/customer/swipe-deck/${jobId}`, {
        cache: "no-store",
      });
      if (!res.ok) {
        toast.error("Couldn't load tradies");
        setTradies([]);
        return;
      }
      const data = (await res.json()) as { tradies: TradieCard[] };
      if (!aborted) setTradies(data.tradies);
    })();
    return () => {
      aborted = true;
    };
  }, [jobId]);

  const remaining = useMemo(
    () => tradies?.slice(index, index + 3) ?? [],
    [tradies, index],
  );

  async function handleSwipe(dir: "left" | "right") {
    if (!tradies || index >= tradies.length || pending) return;
    const tradie = tradies[index];
    setPending(true);
    setIndex((i) => i + 1); // optimistic next-card

    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, tradieId: tradie.id, direction: dir }),
      });
      const data = (await res.json()) as SwipeResult;
      if (!data.ok) {
        toast.error(data.error ?? "Swipe failed");
      } else if (data.matched && dir === "right") {
        setMatched(tradie);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setPending(false);
    }
  }

  if (tradies === null) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 grid place-items-center text-navy/55">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="mt-3 text-sm">Finding tradies in your area…</p>
      </div>
    );
  }

  if (tradies.length === 0) {
    return (
      <main className="max-w-md mx-auto px-5 pt-6 pb-12">
        <BackNav />
        <div className="mt-12 text-center">
          <div className="text-5xl mb-3">😬</div>
          <h2 className="text-2xl font-black tracking-tight">
            No tradies available right now
          </h2>
          <p className="text-navy/60 mt-2 text-sm leading-relaxed">
            Nobody&apos;s online in your service area for this trade. Try
            widening the search later — we&apos;ll email you when new tradies
            join.
          </p>
        </div>
      </main>
    );
  }

  const done = index >= tradies.length;

  return (
    <>
      <main className="max-w-md mx-auto px-5 pt-5 pb-2">
        <BackNav />
        <header className="mt-4 mb-3">
          <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50 flex items-center gap-1.5">
            <MapPin className="w-3 h-3" />
            For your job
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5 line-clamp-1">
            {jobTitle}
          </h1>
          <div className="text-xs text-navy/55 mt-0.5 tabular-nums">
            {tradies.length - index} tradies remaining
          </div>
        </header>

        <div className="relative w-full aspect-[3/4.4] max-h-[640px] mt-3">
          {done ? (
            <EmptyState onBack={() => router.push("/app/customer/dashboard")} />
          ) : (
            <AnimatePresence>
              {remaining
                .slice()
                .reverse()
                .map((tradie, i) => {
                  const stackIndex = remaining.length - 1 - i;
                  return (
                    <TradieSwipeCard
                      key={tradie.id}
                      tradie={tradie}
                      active={stackIndex === 0}
                      offset={stackIndex}
                      zIndex={10 - stackIndex}
                      onSwipe={handleSwipe}
                    />
                  );
                })}
            </AnimatePresence>
          )}
        </div>
      </main>

      {!done && (
        <SwipeActions
          onSkip={() => handleSwipe("left")}
          onMatch={() => handleSwipe("right")}
          disabled={pending}
        />
      )}

      <AnimatePresence>
        {matched && (
          <MatchOverlay
            tradie={
              {
                // adapter for the legacy MatchOverlay (uses the mock Tradie shape)
                id: matched.id,
                name:
                  matched.business_name ??
                  [matched.first_name, matched.last_name].filter(Boolean).join(" "),
                trade: (matched.trade_categories[0] ?? "Tradie") as never,
                photo:
                  matched.avatar_url ??
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(matched.business_name ?? matched.first_name ?? "Tradie")}`,
                suburb: matched.city ?? "",
                city: matched.state ?? "",
                rating: matched.rating_average,
                reviews: matched.rating_count,
                yearsExp: matched.years_experience ?? 0,
                distanceKm: matched.distance_km ?? 0,
                hourlyRate: matched.hourly_rate_min ?? 0,
                bio: matched.bio ?? "",
                portfolio: matched.portfolio,
                badges: { abn: true, whiteCard: true, insurance: true, police: true },
                specialties: matched.trade_categories,
                responseTime: `${Math.round(matched.response_rate)}% response`,
                jobsDone: 0,
                availability: "Available now",
                featuredReview: { text: "", author: "", suburb: "" },
              } as never
            }
            onClose={() => {
              setMatched(null);
              router.push("/app/customer/dashboard");
            }}
            onMessage={() => router.push("/app/customer/matches")}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function BackNav() {
  return (
    <Link
      href="/app/customer/dashboard"
      className="inline-flex items-center gap-1.5 text-sm font-bold text-navy/55 hover:text-navy"
    >
      <ArrowLeft className="w-4 h-4" />
      Dashboard
    </Link>
  );
}

function EmptyState({ onBack }: { onBack: () => void }) {
  return (
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy to-navy-700 grid place-items-center text-white p-8 text-center">
      <div>
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-2xl font-black tracking-tight">
          You&apos;ve seen everyone
        </h3>
        <p className="text-white/70 mt-2 text-sm">
          New tradies join every day. We&apos;ll email you when more arrive.
        </p>
        <button
          onClick={onBack}
          className="mt-6 px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-600 font-bold text-sm btn-press"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
