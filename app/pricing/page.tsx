"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap, ArrowRight, Star } from "lucide-react";
import { cn } from "@/lib/cn";

interface Tier {
  id: string;
  name: string;
  monthly: number;
  yearly: number;
  tagline: string;
  popular?: boolean;
  features: { label: string; included: boolean; emphasis?: boolean }[];
  icon: React.ReactNode;
  accent: string;
}

const TIERS: Tier[] = [
  {
    id: "basic",
    name: "Basic",
    monthly: 49,
    yearly: 39,
    tagline: "For tradies getting started.",
    icon: <Zap className="w-5 h-5" />,
    accent: "navy",
    features: [
      { label: "5 matches per month", included: true, emphasis: true },
      { label: "Basic profile", included: true },
      { label: "Standard support (48h)", included: true },
      { label: "Verified pro badge", included: false },
      { label: "Priority placement", included: false },
      { label: "Job analytics", included: false },
      { label: "Lead exclusivity", included: false },
      { label: "Dedicated success manager", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 89,
    yearly: 71,
    tagline: "Most tradies pick this.",
    popular: true,
    icon: <Sparkles className="w-5 h-5" />,
    accent: "orange",
    features: [
      { label: "25 matches per month", included: true, emphasis: true },
      { label: "Verified pro badge", included: true, emphasis: true },
      { label: "Priority placement", included: true },
      { label: "Job analytics &amp; insights", included: true },
      { label: "Quote &amp; invoice tools", included: true },
      { label: "Standard support (24h)", included: true },
      { label: "Lead exclusivity", included: false },
      { label: "Dedicated success manager", included: false },
    ],
  },
  {
    id: "elite",
    name: "Elite",
    monthly: 149,
    yearly: 119,
    tagline: "For serious operators.",
    icon: <Crown className="w-5 h-5" />,
    accent: "navy-dark",
    features: [
      { label: "Unlimited matches", included: true, emphasis: true },
      { label: "Top-of-list placement", included: true, emphasis: true },
      { label: "Lead exclusivity (60 min)", included: true, emphasis: true },
      { label: "Dedicated success manager", included: true },
      { label: "Verified pro badge", included: true },
      { label: "Job analytics &amp; insights", included: true },
      { label: "Quote &amp; invoice tools", included: true },
      { label: "Priority support (4h)", included: true },
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-6xl mx-auto px-5 py-12 md:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange/10 text-orange text-xs font-bold mb-4">
            <Sparkles className="w-3 h-3" />
            Tradie subscriptions
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Pick your gear.
            <br />
            <span className="bg-gradient-to-r from-navy to-orange bg-clip-text text-transparent">
              Get to work.
            </span>
          </h1>
          <p className="text-navy/60 text-lg mt-4">
            Join 1,247 verified tradies booking premium jobs every week.
          </p>

          {/* Billing toggle */}
          <div className="mt-8 inline-flex items-center gap-1 p-1 rounded-full bg-navy/[0.06] border border-navy/8">
            {(["monthly", "yearly"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setBilling(opt)}
                className={cn(
                  "relative px-5 py-2 rounded-full text-sm font-bold transition-colors",
                  billing === opt ? "text-white" : "text-navy/60"
                )}
              >
                {billing === opt && (
                  <motion.div
                    layoutId="billing-pill"
                    className="absolute inset-0 bg-navy rounded-full"
                    transition={{ type: "spring", stiffness: 350, damping: 28 }}
                  />
                )}
                <span className="relative">
                  {opt === "monthly" ? "Monthly" : "Yearly"}
                  {opt === "yearly" && (
                    <span className="ml-1.5 text-[10px] text-orange-300">−20%</span>
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tiers */}
        <div className="mt-12 grid md:grid-cols-3 gap-5 items-stretch">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "relative rounded-3xl border-2 p-6 flex flex-col",
                tier.popular
                  ? "border-orange bg-white shadow-card md:scale-105 z-10"
                  : "border-navy/8 bg-white"
              )}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-orange text-white text-[10px] font-bold uppercase tracking-wider shadow-glow">
                  ⭐ Most popular
                </div>
              )}
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-10 h-10 rounded-xl grid place-items-center",
                    tier.accent === "orange"
                      ? "bg-orange text-white shadow-glow"
                      : tier.accent === "navy-dark"
                      ? "bg-navy text-orange-300"
                      : "bg-navy/[0.06] text-navy"
                  )}
                >
                  {tier.icon}
                </div>
                <div>
                  <div className="font-black text-lg">{tier.name}</div>
                  <div className="text-xs text-navy/55 font-medium">
                    {tier.tagline}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-black tracking-tight">
                    ${billing === "monthly" ? tier.monthly : tier.yearly}
                  </span>
                  <span className="text-navy/55 font-bold text-sm">
                    /mo
                  </span>
                </div>
                {billing === "yearly" && (
                  <div className="text-xs text-success font-bold mt-1">
                    Save ${(tier.monthly - tier.yearly) * 12}/year
                  </div>
                )}
              </div>

              <button
                className={cn(
                  "mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm btn-press",
                  tier.popular
                    ? "bg-orange hover:bg-orange-600 text-white shadow-glow"
                    : "bg-navy hover:bg-navy-700 text-white"
                )}
              >
                Get {tier.name}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="mt-6 space-y-2.5">
                {tier.features.map((f, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "flex items-start gap-2 text-sm",
                      !f.included && "opacity-40"
                    )}
                  >
                    <div
                      className={cn(
                        "w-4 h-4 rounded-full grid place-items-center shrink-0 mt-0.5",
                        f.included ? "bg-success/15 text-success" : "bg-navy/10 text-navy/40"
                      )}
                    >
                      {f.included ? (
                        <Check className="w-3 h-3" strokeWidth={3} />
                      ) : (
                        <span className="text-[10px]">·</span>
                      )}
                    </div>
                    <span
                      className={cn(
                        "leading-snug",
                        f.emphasis && f.included
                          ? "text-navy font-bold"
                          : "text-navy/75"
                      )}
                      dangerouslySetInnerHTML={{ __html: f.label }}
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Social proof */}
        <div className="mt-16 rounded-3xl bg-navy text-white p-8 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-orange/30 blur-3xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex gap-0.5 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-orange text-orange" />
                ))}
              </div>
              <blockquote className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
                &ldquo;Pro tier paid for itself in week one. I&apos;ve booked
                $14k of work this month — without lifting a finger on
                marketing.&rdquo;
              </blockquote>
              <div className="mt-5 flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=200&q=80"
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold">Jack Thompson</div>
                  <div className="text-xs text-white/60">
                    Electrician · Surry Hills, NSW
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { v: "1,247", l: "Tradies on Pro+" },
                { v: "94%", l: "Renew yearly" },
                { v: "$487K", l: "GMV last 30d" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white/5 border border-white/10 p-4 backdrop-blur"
                >
                  <div className="text-2xl font-black tracking-tight">
                    {s.v}
                  </div>
                  <div className="text-[10px] text-white/55 font-bold uppercase tracking-wider mt-0.5">
                    {s.l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
