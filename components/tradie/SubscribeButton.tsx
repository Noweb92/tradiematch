"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/cn";
import type { Tier } from "@/lib/stripe/tiers";

interface Props {
  tier: Tier;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

/**
 * Routes the right Subscribe action based on auth state:
 *   - Anonymous → /signup/tradie?next=/pricing
 *   - Customer  → tradie-only error
 *   - Tradie without onboarding → /app/tradie/onboarding
 *   - Tradie ready → Stripe Checkout
 */
export function SubscribeButton({
  tier,
  label,
  variant = "primary",
  className,
}: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function onClick() {
    setBusy(true);
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.push(`/signup/tradie?next=${encodeURIComponent("/pricing")}`);
      setBusy(false);
      return;
    }

    const profileRes = await supabase
      .from("profiles")
      .select("role, onboarding_completed")
      .eq("id", auth.user.id)
      .single();
    const profile = profileRes.data as
      | { role?: string; onboarding_completed?: boolean }
      | null;

    if (profile?.role === "customer") {
      toast.error("Subscriptions are for tradies. Sign in with a tradie account.");
      setBusy(false);
      return;
    }

    if (profile?.role !== "tradie") {
      router.push(`/signup/tradie?next=${encodeURIComponent("/pricing")}`);
      setBusy(false);
      return;
    }

    if (!profile.onboarding_completed) {
      router.push("/app/tradie/onboarding");
      setBusy(false);
      return;
    }

    // All clear — hit checkout endpoint
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Checkout failed");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Network error. Try again.");
      setBusy(false);
    }
  }

  const base =
    "w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm btn-press transition-all min-h-[44px] disabled:opacity-60";
  const styles =
    variant === "primary"
      ? "bg-orange hover:bg-orange-600 text-white shadow-glow"
      : "bg-navy hover:bg-navy-700 text-white";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={busy}
      className={cn(base, styles, className)}
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          {label ?? `Get ${tier[0].toUpperCase() + tier.slice(1)}`}
          <ArrowRight className="w-4 h-4" />
        </>
      )}
    </button>
  );
}
