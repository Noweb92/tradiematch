"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Briefcase } from "lucide-react";
import Link from "next/link";
import { JobSwipeCard } from "@/components/swipe/JobSwipeCard";
import { SwipeActions } from "@/components/swipe/SwipeActions";
import type { JobCard, SwipeResult } from "@/lib/matching/types";

interface Props {
  tradieId: string;
  quotaTotal: number;
  quotaUsed: number;
}

export function TradieSwipeRunner({ tradieId, quotaTotal, quotaUsed: initialUsed }: Props) {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobCard[] | null>(null);
  const [index, setIndex] = useState(0);
  const [used, setUsed] = useState(initialUsed);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let aborted = false;
    (async () => {
      const res = await fetch("/api/tradie/swipe-deck", { cache: "no-store" });
      if (!res.ok) {
        toast.error("Couldn't load jobs");
        setJobs([]);
        return;
      }
      const data = (await res.json()) as { jobs: JobCard[] };
      if (!aborted) setJobs(data.jobs);
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const remaining = useMemo(
    () => jobs?.slice(index, index + 3) ?? [],
    [jobs, index],
  );
  const quotaRemaining = Math.max(quotaTotal - used, 0);

  async function handleSwipe(dir: "left" | "right") {
    if (!jobs || index >= jobs.length || pending) return;
    const job = jobs[index];

    if (dir === "right" && quotaRemaining <= 0) {
      toast.error("Match quota exceeded this period. Upgrade or wait until renewal.");
      return;
    }

    setPending(true);
    setIndex((i) => i + 1);

    try {
      const res = await fetch("/api/swipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId: job.id, tradieId, direction: dir }),
      });
      const data = (await res.json()) as SwipeResult;

      if (!data.ok) {
        if (data.code === "QUOTA_EXCEEDED") {
          toast.error("Match quota exceeded. Upgrade to keep swiping.");
        } else if (data.code === "NO_SUBSCRIPTION") {
          toast.error("Active subscription required");
          router.push("/pricing");
        } else {
          toast.error(data.error ?? "Swipe failed");
        }
      } else if (data.matched && dir === "right") {
        setUsed((u) => u + 1);
        toast.success("It's a match! Heading to the conversation…");
        setTimeout(() => {
          if (data.match_id) router.push(`/app/tradie/matches/${data.match_id}`);
        }, 600);
      }
    } catch {
      toast.error("Network error");
    } finally {
      setPending(false);
    }
  }

  if (jobs === null) {
    return (
      <div className="max-w-md mx-auto px-5 py-16 grid place-items-center text-navy/55">
        <Loader2 className="w-6 h-6 animate-spin" />
        <p className="mt-3 text-sm">Loading open jobs…</p>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <main className="max-w-md mx-auto px-5 pt-6 pb-12">
        <BackNav />
        <div className="mt-12 text-center">
          <div className="text-5xl mb-3">📭</div>
          <h2 className="text-2xl font-black tracking-tight">
            No open jobs right now
          </h2>
          <p className="text-navy/60 mt-2 text-sm leading-relaxed">
            Check back soon — new jobs land throughout the day. We&apos;ll send
            you push notifications when one matches your trades.
          </p>
        </div>
      </main>
    );
  }

  const done = index >= jobs.length;

  return (
    <>
      <main className="max-w-md mx-auto px-5 pt-5 pb-2">
        <BackNav />
        <header className="mt-4 mb-3 flex items-end justify-between gap-3">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50 flex items-center gap-1.5">
              <Briefcase className="w-3 h-3" />
              Browse jobs
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5 tabular-nums">
              {jobs.length - index} jobs in your area
            </h1>
          </div>
          <div className="rounded-xl bg-orange/10 px-2.5 py-1.5 text-right">
            <div className="text-[10px] font-bold uppercase tracking-wider text-orange">
              Quota
            </div>
            <div className="text-sm font-black text-orange tabular-nums">
              {quotaRemaining} / {quotaTotal}
            </div>
          </div>
        </header>

        <div className="relative w-full aspect-[3/4] max-h-[600px] mt-3">
          {done ? (
            <EmptyState onBack={() => router.push("/app/tradie/dashboard")} />
          ) : (
            <AnimatePresence>
              {remaining
                .slice()
                .reverse()
                .map((job, i) => {
                  const stackIndex = remaining.length - 1 - i;
                  return (
                    <JobSwipeCard
                      key={job.id}
                      job={job}
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
          matchLabel="Quote this job"
        />
      )}
    </>
  );
}

function BackNav() {
  return (
    <Link
      href="/app/tradie/dashboard"
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
        <div className="text-5xl mb-3">✅</div>
        <h3 className="text-2xl font-black tracking-tight">
          You&apos;re caught up
        </h3>
        <p className="text-white/70 mt-2 text-sm">
          More jobs land throughout the day. We&apos;ll email when there&apos;s a hot one.
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
