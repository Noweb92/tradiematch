"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  ReferenceLine,
} from "recharts";
import {
  Users,
  Hammer,
  Sparkles,
  DollarSign,
  TrendingUp,
  Repeat,
  Flame,
  Download,
  ArrowUpRight,
  Check,
  X as XIcon,
  Quote as QuoteIcon,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  INVESTOR_GROWTH,
  MRR_PROJECTION,
  COMPETITORS,
  TESTIMONIALS,
} from "@/lib/mockData";
import { AustraliaMap } from "@/components/AustraliaMap";
import { CountUp } from "@/components/CountUp";
import { cn } from "@/lib/cn";

export default function InvestorPage() {
  const [resetKey, setResetKey] = useState(0);

  return (
    <div key={resetKey} className="min-h-screen bg-white">
      {/* Demo reset (visible on /investor only) */}
      <div className="fixed top-3 right-3 z-40 hidden md:block">
        <button
          onClick={() => setResetKey((k) => k + 1)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy text-white text-[11px] font-bold shadow-lg btn-press hover:bg-navy-700"
          title="Reset all animations for repeated demos"
        >
          <RotateCcw className="w-3 h-3" />
          Demo reset
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-8">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-navy/[0.06] text-navy/70 text-[11px] font-bold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Confidential · Pre-seed · Discovery Phase
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              TradieMatch metrics
            </h1>
            <p className="text-navy/55 mt-1 text-sm sm:text-base">
              Live snapshot ·{" "}
              {new Date().toLocaleDateString("en-AU", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3.5 py-2 rounded-xl bg-white border border-navy/10 hover:border-navy/25 text-navy text-sm font-bold flex items-center gap-1.5 btn-press">
              <Download className="w-3.5 h-3.5" />
              Export deck
            </button>
            <button className="px-3.5 py-2 rounded-xl bg-navy text-white text-sm font-bold flex items-center gap-1.5 btn-press">
              Schedule call
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <KpiCard
            icon={<Hammer className="w-4 h-4" />}
            label="Tradies registered"
            value={1247}
            delta="+34.7% MoM"
            tone="orange"
          />
          <KpiCard
            icon={<Users className="w-4 h-4" />}
            label="Active customers"
            value={8932}
            delta="+22.4% MoM"
            tone="success"
          />
          <KpiCard
            icon={<Sparkles className="w-4 h-4" />}
            label="Matches / month"
            value={3421}
            delta="+58% MoM"
            tone="amber"
          />
          <KpiCard
            icon={<DollarSign className="w-4 h-4" />}
            label="GMV"
            value={487}
            prefix="$"
            suffix="K"
            delta="+41% MoM"
            tone="navy"
          />
          <KpiCard
            icon={<Repeat className="w-4 h-4" />}
            label="MRR"
            value={43}
            prefix="$"
            suffix="K"
            delta="+38% MoM"
            tone="orange"
            highlight
          />
        </div>

        {/* Main split */}
        <div className="mt-6 grid lg:grid-cols-5 gap-5">
          {/* Growth chart */}
          <div className="lg:col-span-3 rounded-2xl bg-white border border-navy/8 p-5 shadow-soft">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                  Growth — last 8 months
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-black tracking-tight tabular-nums">
                    <CountUp value={8932} />
                  </h3>
                  <span className="text-xs font-bold text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +644% YTD
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-bold">
                <Legend dot="#0A2540" label="Customers" />
                <Legend dot="#FF6B35" label="Tradies" />
              </div>
            </div>

            <div className="h-72 -ml-2 mt-3">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={INVESTOR_GROWTH}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(10,37,64,0.08)"
                  />
                  <XAxis
                    dataKey="month"
                    fontSize={11}
                    stroke="rgba(10,37,64,0.45)"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    stroke="rgba(10,37,64,0.45)"
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 12px 40px -12px rgba(10,37,64,0.25)",
                      fontSize: 12,
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="customers"
                    stroke="#0A2540"
                    strokeWidth={3}
                    dot={{ fill: "#0A2540", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 6, fill: "#0A2540", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1400}
                  />
                  <Line
                    type="monotone"
                    dataKey="tradies"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    dot={{ fill: "#FF6B35", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 6, fill: "#FF6B35", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1400}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Map */}
          <div className="lg:col-span-2">
            <AustraliaMap />
          </div>
        </div>

        {/* Path to profitability */}
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-navy via-navy-600 to-navy-700 text-white p-6 md:p-8 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-orange/20 blur-3xl" />
          <div className="relative">
            <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange-300">
                  Path to profitability
                </div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight mt-1">
                  Break-even at month 14.
                </h2>
                <p className="text-white/65 text-sm mt-1 max-w-xl">
                  Realistic scenario: 1,500 paying tradies Year 1 &rarr; 13,500 Year 3.
                  $63 weighted ARPU, 85% gross margin, 4.2-month CAC payback.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-right">
                <Milestone label="Now" value="$43K" caption="MRR" tone="success" />
                <Milestone label="Month 14" value="$264K" caption="Break-even" tone="orange" highlight />
                <Milestone label="Month 24" value="$510K" caption="$6M ARR" tone="white" />
              </div>
            </div>

            <div className="h-60 -ml-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MRR_PROJECTION}>
                  <defs>
                    <linearGradient id="mrrBarActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00C853" />
                      <stop offset="100%" stopColor="#00C853" stopOpacity={0.6} />
                    </linearGradient>
                    <linearGradient id="mrrBarProj" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={0.5} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis
                    dataKey="label"
                    fontSize={10}
                    stroke="rgba(255,255,255,0.55)"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={10}
                    stroke="rgba(255,255,255,0.55)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.05)" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      background: "#0A2540",
                      boxShadow: "0 12px 40px -12px rgba(0,0,0,0.5)",
                      fontSize: 12,
                      color: "#fff",
                    }}
                    formatter={(v: number, _n, p: any) => [
                      `$${v}K MRR`,
                      p?.payload?.milestone ?? (p?.payload?.actual ? "Actual" : "Projected"),
                    ]}
                  />
                  <ReferenceLine
                    y={264}
                    stroke="#FF6B35"
                    strokeDasharray="4 4"
                    label={{
                      value: "Break-even ($264K)",
                      fill: "#FF6B35",
                      fontSize: 10,
                      fontWeight: 700,
                      position: "insideTopRight",
                    }}
                  />
                  <Bar dataKey="mrr" radius={[8, 8, 0, 0]} animationDuration={1400}>
                    {MRR_PROJECTION.map((d, i) => (
                      <Cell
                        key={i}
                        fill={d.actual ? "url(#mrrBarActual)" : "url(#mrrBarProj)"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Secondary row */}
        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* GMV chart */}
          <div className="rounded-2xl bg-white border border-navy/8 p-5 shadow-soft lg:col-span-2">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                  GMV trajectory
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-black tracking-tight">
                    <CountUp value={487} prefix="$" suffix="K" />
                  </h3>
                  <span className="text-xs font-bold text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    1,059% YTD
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                  Take rate
                </div>
                <div className="text-xl font-black tracking-tight tabular-nums">8.8%</div>
              </div>
            </div>
            <div className="h-44 -ml-2 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={INVESTOR_GROWTH}>
                  <defs>
                    <linearGradient id="gmvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(10,37,64,0.08)"
                  />
                  <XAxis
                    dataKey="month"
                    fontSize={11}
                    stroke="rgba(10,37,64,0.45)"
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    fontSize={11}
                    stroke="rgba(10,37,64,0.45)"
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${v}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 12px 40px -12px rgba(10,37,64,0.25)",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="gmv"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    fill="url(#gmvGrad)"
                    activeDot={{ r: 6, fill: "#FF6B35", stroke: "#fff", strokeWidth: 2 }}
                    animationDuration={1400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Unit economics */}
          <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-600 to-navy-700 text-white p-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-orange/30 blur-3xl" />
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="relative">
              <div className="text-[11px] font-bold uppercase tracking-wider text-orange-300 mb-3 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                Unit economics
              </div>
              <div className="space-y-3">
                <Metric label="ARPU (weighted)" value="$63 / mo" />
                <Metric label="CAC (blended)" value="$100" />
                <Metric label="LTV (18-mo)" value="$1,134" />
                <Metric label="LTV : CAC" value="10 : 1" highlight />
                <Metric label="Payback" value="4.2 months" />
                <Metric label="Gross margin" value="85%" />
              </div>
            </div>
          </div>
        </div>

        {/* Competitor comparison */}
        <div className="mt-6 rounded-2xl bg-white border border-navy/8 p-5 sm:p-6 shadow-soft">
          <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-navy/50">
                Competitive landscape
              </div>
              <h3 className="text-2xl font-black tracking-tight mt-1">
                We win on every dimension that matters.
              </h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange/10 text-orange text-xs font-bold">
              <Trophy className="w-3 h-3" />
              Only mobile-first subscription play in AU
            </div>
          </div>

          <div className="overflow-x-auto -mx-1">
            <table className="min-w-[640px] w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] font-bold uppercase tracking-wider text-navy/50 border-b border-navy/8">
                  <th className="px-3 py-2.5 font-bold">Player</th>
                  <th className="px-3 py-2.5 font-bold">Model</th>
                  <th className="px-3 py-2.5 font-bold">Matching</th>
                  <th className="px-3 py-2.5 font-bold">Mobile</th>
                  <th className="px-3 py-2.5 font-bold">Verification</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <tr
                    key={c.name}
                    className={cn(
                      "border-b border-navy/8 last:border-0 transition-colors",
                      c.self
                        ? "bg-orange/[0.07] hover:bg-orange/[0.10]"
                        : "hover:bg-navy/[0.02]"
                    )}
                  >
                    <td className="px-3 py-3 font-bold text-navy whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {c.self && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-orange text-white tracking-wider">
                            US
                          </span>
                        )}
                        <span className={c.self ? "text-orange" : ""}>
                          {c.name}
                        </span>
                      </div>
                      <div className="text-[10px] text-navy/45 font-medium mt-0.5">
                        Founded {c.founded}
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <CompCell win={c.self}>{c.model}</CompCell>
                    </td>
                    <td className="px-3 py-3">
                      <CompCell win={c.self}>{c.matching}</CompCell>
                    </td>
                    <td className="px-3 py-3">
                      <CompCell win={c.self || c.name === "Airtasker"}>{c.mobile}</CompCell>
                    </td>
                    <td className="px-3 py-3">
                      <CompCell win={c.self}>{c.quality}</CompCell>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-2xl bg-white border border-navy/8 p-5 shadow-soft hover:shadow-card transition-shadow relative"
            >
              <div className="absolute -top-3 left-5 w-9 h-9 rounded-xl bg-orange grid place-items-center shadow-glow">
                <QuoteIcon className="w-4 h-4 text-white" fill="currentColor" />
              </div>
              <p className="text-navy text-sm leading-relaxed pt-3">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-navy/8 flex items-center gap-3">
                <img
                  src={t.photo}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <div className="font-bold text-navy text-sm truncate">
                    {t.author}
                  </div>
                  <div className="text-[11px] text-navy/55 font-medium truncate">
                    {t.role}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider",
                    t.type === "tradie"
                      ? "bg-orange/10 text-orange"
                      : "bg-navy/[0.06] text-navy/65"
                  )}
                >
                  {t.type}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Investment ask */}
        <div className="mt-6 rounded-3xl bg-gradient-to-br from-orange via-orange-600 to-orange-700 text-white p-6 md:p-10 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          <div className="relative grid md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                The ask
              </div>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                Raising $850K AUD to capture
                <br />
                Australia&apos;s $2.5B tradie marketplace.
              </h2>
              <p className="text-white/85 mt-3 max-w-xl">
                Pilot in Perth · sequential rollout to Sydney, Melbourne &amp;
                Brisbane · target $9.8M ARR by Year 3 with 90&ndash;140&times; ROI.
              </p>
              <p className="text-white/65 mt-2 text-sm max-w-xl">
                First commitment: <span className="font-bold text-white">$12K Discovery Phase</span> &mdash;
                buildable spec, validated economics, phased capital plan in 21 days.
              </p>
            </div>
            <div className="md:col-span-5 grid grid-cols-2 gap-3">
              {[
                { v: "$850K", l: "Total raise" },
                { v: "$12K", l: "Discovery first" },
                { v: "18 mo", l: "Runway" },
                { v: "$9.8M", l: "Year 3 ARR" },
              ].map((s) => (
                <div
                  key={s.l}
                  className="rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 p-4"
                >
                  <div className="text-3xl font-black tracking-tight tabular-nums">
                    {s.v}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-white/70 font-bold mt-0.5">
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

function KpiCard({
  icon,
  label,
  value,
  delta,
  tone,
  highlight,
  prefix,
  suffix,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  delta: string;
  tone: "orange" | "success" | "amber" | "navy";
  highlight?: boolean;
  prefix?: string;
  suffix?: string;
}) {
  const toneMap = {
    orange: "bg-orange/10 text-orange",
    success: "bg-success/10 text-success",
    amber: "bg-amber-100 text-amber-600",
    navy: "bg-navy/8 text-navy",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-4 transition-all ${
        highlight
          ? "bg-navy text-white border-navy shadow-card"
          : "bg-white border-navy/8 shadow-soft hover:shadow-card hover:-translate-y-0.5"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-8 h-8 rounded-lg grid place-items-center ${
            highlight ? "bg-white/10 text-orange-300" : toneMap[tone]
          }`}
        >
          {icon}
        </div>
        <div
          className={`text-[10px] font-bold ${
            highlight ? "text-orange-300" : "text-success"
          }`}
        >
          {delta}
        </div>
      </div>
      <div className="mt-3 text-2xl md:text-3xl font-black tracking-tight">
        <CountUp value={value} prefix={prefix} suffix={suffix} />
      </div>
      <div
        className={`text-[11px] font-medium mt-0.5 ${
          highlight ? "text-white/65" : "text-navy/55"
        }`}
      >
        {label}
      </div>
    </motion.div>
  );
}

function Legend({ dot, label }: { dot: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5 text-navy/65">
      <span
        className="w-2.5 h-2.5 rounded-full"
        style={{ background: dot }}
      />
      {label}
    </div>
  );
}

function Metric({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-white/10 last:border-0">
      <span className="text-xs text-white/65 font-medium">{label}</span>
      <span
        className={`font-black tracking-tight tabular-nums ${
          highlight ? "text-orange-300 text-lg" : "text-white text-base"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

function Milestone({
  label,
  value,
  caption,
  tone,
  highlight,
}: {
  label: string;
  value: string;
  caption: string;
  tone: "success" | "orange" | "white";
  highlight?: boolean;
}) {
  const colorMap = {
    success: "text-success",
    orange: "text-orange-300",
    white: "text-white",
  };
  return (
    <div
      className={cn(
        "rounded-xl px-2.5 py-2 border text-right",
        highlight
          ? "bg-orange/15 border-orange/30"
          : "bg-white/5 border-white/10"
      )}
    >
      <div className="text-[9px] font-bold uppercase tracking-wider text-white/55">
        {label}
      </div>
      <div
        className={cn(
          "text-base sm:text-lg font-black tracking-tight tabular-nums",
          colorMap[tone]
        )}
      >
        {value}
      </div>
      <div className="text-[9px] text-white/55 font-bold uppercase tracking-wider">
        {caption}
      </div>
    </div>
  );
}

function CompCell({ children, win }: { children: React.ReactNode; win: boolean }) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5",
        win ? "text-navy font-semibold" : "text-navy/55"
      )}
    >
      {win ? (
        <Check className="w-3.5 h-3.5 text-success shrink-0" strokeWidth={3} />
      ) : (
        <XIcon className="w-3.5 h-3.5 text-navy/30 shrink-0" />
      )}
      <span>{children}</span>
    </div>
  );
}
