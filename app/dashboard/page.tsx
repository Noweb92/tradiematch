"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Star,
  Wallet,
  Zap,
  ArrowUpRight,
  Crown,
  ChevronRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { TRADIES, CHATS, DASHBOARD_CHART } from "@/lib/mockData";
import { CountUp } from "@/components/CountUp";

export default function DashboardPage() {
  const me = TRADIES[1]; // "you" = Jack the sparky for the demo

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/20 to-white">
      <div className="max-w-6xl mx-auto px-5 py-8">
        {/* Top */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <img
              src={me.photo}
              alt=""
              className="w-14 h-14 rounded-2xl object-cover shadow-soft"
            />
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                Tradie dashboard
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">
                Welcome back, {me.name.split(" ")[0]}
              </h1>
            </div>
          </div>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-navy to-navy-700 text-white text-sm font-bold shadow-lg btn-press"
          >
            <Crown className="w-4 h-4 text-orange-300" />
            Upgrade plan
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard
            icon={<Sparkles className="w-4 h-4" />}
            label="Matches this month"
            value={<CountUp value={23} />}
            delta="+18%"
            color="orange"
          />
          <StatCard
            icon={<Wallet className="w-4 h-4" />}
            label="Jobs booked"
            value={<CountUp value={8400} prefix="$" />}
            delta="+12%"
            color="success"
          />
          <StatCard
            icon={<Star className="w-4 h-4" />}
            label="Rating"
            value={<><CountUp value={4.9} decimals={1} />★</>}
            delta="32 reviews"
            color="amber"
          />
          <StatCard
            icon={<Zap className="w-4 h-4" />}
            label="Response time"
            value={<><CountUp value={8} /> min</>}
            delta="Top 5%"
            color="navy"
          />
        </div>

        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          {/* Chart */}
          <div className="lg:col-span-2 rounded-2xl bg-white border border-navy/8 p-5 shadow-soft">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                  Matches over time
                </div>
                <div className="text-2xl font-black tracking-tight mt-0.5 tabular-nums">
                  <CountUp value={143} /> matches
                </div>
                <div className="text-xs text-success font-bold flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  +47% vs. last 14d
                </div>
              </div>
              <div className="flex gap-1 text-xs">
                {["7d", "14d", "30d", "All"].map((p, i) => (
                  <button
                    key={p}
                    className={`px-2.5 py-1 rounded-lg font-bold ${
                      i === 1
                        ? "bg-navy text-white"
                        : "text-navy/55 hover:bg-navy/[0.05]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-56 mt-4 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={DASHBOARD_CHART}>
                  <defs>
                    <linearGradient id="matchesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#FF6B35" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#FF6B35" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(10,37,64,0.08)"
                  />
                  <XAxis
                    dataKey="day"
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
                  <Area
                    type="monotone"
                    dataKey="matches"
                    stroke="#FF6B35"
                    strokeWidth={3}
                    fill="url(#matchesGrad)"
                    dot={{ fill: "#FF6B35", strokeWidth: 0, r: 3 }}
                    activeDot={{ r: 6, fill: "#FF6B35", stroke: "#fff", strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscription card */}
          <div className="rounded-2xl bg-gradient-to-br from-navy via-navy-600 to-navy-700 text-white p-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-orange/30 blur-3xl" />
            <div className="absolute inset-0 dot-grid opacity-30" />
            <div className="relative">
              <div className="flex items-center justify-between">
                <div className="text-[11px] font-bold uppercase tracking-wider text-orange-300">
                  Current plan
                </div>
                <div className="px-2 py-0.5 rounded-full bg-success/95 text-[10px] font-bold">
                  Active
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-black">Pro</span>
                <span className="text-orange-300 text-sm font-bold">/ $89 mo</span>
              </div>
              <div className="text-xs text-white/65 mt-1">
                Renews in 12 days · 25 matches/mo
              </div>

              <div className="mt-5 space-y-2">
                <Feature>Verified pro badge</Feature>
                <Feature>Priority placement</Feature>
                <Feature>Job analytics &amp; insights</Feature>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-2">
                <button className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-bold backdrop-blur-sm border border-white/15">
                  Manage
                </button>
                <Link
                  href="/pricing"
                  className="px-3 py-2 rounded-lg bg-orange hover:bg-orange-600 text-xs font-bold text-center shadow-glow"
                >
                  Upgrade to Elite
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Active conversations */}
        <div className="mt-6 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-2xl bg-white border border-navy/8 p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
                  Active conversations
                </div>
                <h3 className="font-black text-lg mt-0.5">7 hot leads</h3>
              </div>
              <Link
                href="/chat"
                className="text-xs font-bold text-orange flex items-center gap-1"
              >
                View all
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="mt-4 divide-y divide-navy/8">
              {CHATS.concat(CHATS.slice(0, 1)).slice(0, 4).map((c, i) => {
                const t = TRADIES.find((x) => x.id === c.tradieId)!;
                const last = c.messages[c.messages.length - 1];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 py-3"
                  >
                    <img
                      src={t.photo}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-navy/55 truncate">
                        {last.type === "quote"
                          ? `Quote sent · $${last.meta?.price?.toLocaleString("en-US")}`
                          : last.text}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-navy/40 font-medium">
                        {last.time}
                      </div>
                      {c.unread > 0 ? (
                        <div className="mt-1 inline-block min-w-[18px] h-[18px] px-1.5 rounded-full bg-orange text-white text-[10px] font-bold grid place-items-center">
                          {c.unread}
                        </div>
                      ) : (
                        <div className="text-[10px] text-success mt-1 font-bold uppercase tracking-wider">
                          Replied
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Recent matches */}
          <div className="rounded-2xl bg-white border border-navy/8 p-5 shadow-soft">
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
              Recent matches
            </div>
            <h3 className="font-black text-lg mt-0.5">+5 today</h3>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80",
                "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80",
              ].map((src, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl overflow-hidden relative group"
                >
                  <img
                    src={src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity grid place-items-end p-2">
                    <MessageCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/chat"
              className="mt-4 w-full inline-flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-navy/[0.04] hover:bg-navy/[0.07] text-sm font-bold text-navy"
            >
              Message new matches
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  delta,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  delta: string;
  color: "orange" | "success" | "amber" | "navy";
}) {
  const colorMap = {
    orange: "bg-orange/10 text-orange",
    success: "bg-success/10 text-success",
    amber: "bg-amber-100 text-amber-600",
    navy: "bg-navy/8 text-navy",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-navy/8 p-4 shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div
          className={`w-8 h-8 rounded-lg grid place-items-center ${colorMap[color]}`}
        >
          {icon}
        </div>
        <div className="text-[10px] text-navy/50 font-bold">{delta}</div>
      </div>
      <div className="mt-3 text-2xl font-black tracking-tight tabular-nums">{value}</div>
      <div className="text-[11px] text-navy/55 font-medium">{label}</div>
    </motion.div>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/85">
      <span className="w-4 h-4 rounded-full bg-success/30 grid place-items-center shrink-0">
        <span className="block w-1.5 h-1.5 rounded-full bg-success" />
      </span>
      {children}
    </div>
  );
}
