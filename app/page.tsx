"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Star,
  ShieldCheck,
  Zap,
  MapPin,
  Hammer,
  Award,
  Users,
} from "lucide-react";
import { TRADIES, PRESS } from "@/lib/mockData";
import { LogoMark } from "@/components/Logo";
import { CountUp } from "@/components/CountUp";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden hero-gradient text-white">
      {/* Background grid */}
      <div className="absolute inset-0 dot-grid opacity-60" />
      <SouthernCross className="absolute top-12 right-[18%] opacity-30 hidden md:block" />
      <SouthernCross className="absolute bottom-32 left-[8%] opacity-20 hidden lg:block" />

      {/* Floating glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-orange/30 blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-8 md:pt-14 pb-24">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2.5">
            <LogoMark size={36} />
            <span className="font-black tracking-tight text-lg">TradieMatch</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-white/70">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span>Live in Sydney, Melbourne, Brisbane &amp; Perth</span>
          </div>
        </motion.div>

        {/* Hero */}
        <div className="mt-12 md:mt-24 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm text-[11px] sm:text-xs font-semibold text-white/85 mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
              Australia&apos;s tradie marketplace · Series A
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-[44px] leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight"
            >
              Swipe.
              <br />
              Match.
              <br />
              <span className="bg-gradient-to-r from-orange-300 via-orange-400 to-orange-500 bg-clip-text text-transparent">
                Build.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
              className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-white/70 max-w-xl leading-relaxed"
            >
              The smartest way to find the right tradie. Skip the
              quotes-and-callbacks circus — find your match in 60 seconds.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.26 }}
              className="mt-8 sm:mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/onboarding"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-4 bg-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-glow btn-press transition-all min-h-[52px]"
              >
                I need a tradie
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/dashboard"
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm btn-press transition-all min-h-[52px]"
              >
                <Hammer className="w-4 h-4" />
                I am a tradie
              </Link>
            </motion.div>

            {/* Trust signals */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="mt-8 sm:mt-10 grid grid-cols-3 gap-2 max-w-xl"
            >
              {[
                { icon: <ShieldCheck className="w-4 h-4" />, label: "ABN Verified" },
                { icon: <Award className="w-4 h-4" />, label: "Insurance Checked" },
                { icon: <Users className="w-4 h-4" />, label: "Police Cleared" },
              ].map((t, i) => (
                <div
                  key={t.label}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-2 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-sm text-[11px] sm:text-xs font-bold text-white/85"
                >
                  <span className="text-orange-300 shrink-0">{t.icon}</span>
                  <span className="leading-tight">{t.label}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-white/60"
            >
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-orange-300" />
                <span>Match in 60s</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-orange-300 fill-orange-300" />
                <span>Avg 4.8★ rating</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-orange-300" />
                <span>1,247 tradies live</span>
              </div>
            </motion.div>
          </div>

          {/* Phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 24, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: 4 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 80 }}
            className="lg:col-span-5 hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-8 bg-orange/20 blur-3xl rounded-full animate-pulse" />
              <div className="relative w-[280px] h-[560px] bg-navy-700 rounded-[44px] p-3 shadow-2xl border border-white/10">
                <div className="w-full h-full rounded-[36px] bg-gradient-to-b from-navy-400 to-navy overflow-hidden relative">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10" />
                  <div className="absolute inset-4 top-12 bottom-20 rounded-3xl overflow-hidden">
                    <img
                      src={TRADIES[0].photo}
                      alt={TRADIES[0].name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-success/95 backdrop-blur-sm text-[10px] font-bold flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> Verified
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-white text-xl font-black leading-tight">
                        {TRADIES[0].name}
                      </div>
                      <div className="text-orange-300 text-xs font-semibold">
                        {TRADIES[0].trade} · {TRADIES[0].suburb}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-white">
                        <Star className="w-3 h-3 fill-orange text-orange" />
                        <span className="font-bold">{TRADIES[0].rating}</span>
                        <span className="text-white/60">
                          ({TRADIES[0].reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-white grid place-items-center text-2xl">
                      ✕
                    </div>
                    <div className="w-11 h-11 rounded-full bg-orange grid place-items-center shadow-glow text-white text-xl">
                      ♥
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Press / "As featured in" */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-16 md:mt-24"
        >
          <div className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-bold text-white/40 text-center">
            As featured in
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 sm:gap-x-12">
            {PRESS.map((p) => (
              <div
                key={p.name}
                className="text-white/55 hover:text-white/80 font-bold text-sm sm:text-base tracking-tight transition-colors"
                style={{ fontFamily: "Georgia, serif" }}
              >
                {p.display}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stat ribbon */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-14 md:mt-20 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-r from-white/[0.04] via-white/[0.08] to-white/[0.04] backdrop-blur-sm"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            <RibbonStat value={1247} label="Verified tradies" />
            <RibbonStat value={8932} label="Happy customers" />
            <RibbonStat value={487} label="GMV / mo" prefix="$" suffix="K" />
            <RibbonStat value={4.8} label="Avg rating" suffix="★" decimals={1} />
          </div>
          <div className="px-5 sm:px-8 py-3 border-t border-white/10 text-center text-[11px] sm:text-xs font-medium text-white/55">
            <span className="text-white/85 font-bold">1,247</span> verified tradies. <span className="text-white/85 font-bold">8,932</span> happy customers. Across all of Australia.
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function RibbonStat({
  value,
  label,
  prefix,
  suffix,
  decimals = 0,
}: {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  return (
    <div className="px-5 sm:px-6 py-5 sm:py-6 text-left">
      <div className="text-3xl sm:text-4xl font-black tracking-tight">
        <CountUp
          value={value}
          prefix={prefix}
          suffix={suffix}
          decimals={decimals}
        />
      </div>
      <div className="text-[10px] sm:text-xs text-white/55 mt-1 font-bold uppercase tracking-wider">
        {label}
      </div>
    </div>
  );
}

function SouthernCross({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 80"
      width="60"
      height="80"
      className={className}
      aria-hidden
    >
      {/* Star positions approximate the Southern Cross constellation */}
      {[
        { x: 30, y: 8, r: 2.2 },
        { x: 18, y: 32, r: 2 },
        { x: 42, y: 38, r: 1.8 },
        { x: 30, y: 56, r: 2.5 },
        { x: 33, y: 72, r: 1.4 },
      ].map((s, i) => (
        <g key={i}>
          <circle
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill="white"
            opacity="0.9"
          />
          <circle
            cx={s.x}
            cy={s.y}
            r={s.r * 3}
            fill="white"
            opacity="0.15"
          />
        </g>
      ))}
    </svg>
  );
}
