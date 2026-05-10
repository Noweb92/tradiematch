"use client";

import { motion } from "framer-motion";
import {
  FileText,
  Layout,
  Users,
  Search,
  TrendingUp,
  ClipboardList,
  Target,
  ShieldCheck,
  Calendar,
  DollarSign,
  Check,
  ArrowRight,
  Lock,
  Clock,
  RefreshCw,
} from "lucide-react";

const DELIVERABLES = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Technical specification",
    desc: "50–80 pages, ready for engineering build-out. No ambiguity. No surprises.",
  },
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Validated wireframes",
    desc: "All 20+ key screens designed by a senior Australian product designer.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Customer discovery",
    desc: "15+ tradie interviews + 10+ customer interviews in the pilot city.",
  },
  {
    icon: <Search className="w-5 h-5" />,
    title: "Competitive deep-dive",
    desc: "Mystery shopping HiPages, Oneflare, Airtasker. Real screenshots, real pricing, real friction.",
  },
  {
    icon: <TrendingUp className="w-5 h-5" />,
    title: "Revised projections",
    desc: "Final business model with feedback-adjusted ARPU, CAC, retention and unit economics.",
  },
  {
    icon: <ClipboardList className="w-5 h-5" />,
    title: "Phase 1 build proposal",
    desc: "Fixed quote, milestone-based payment schedule, locked timeline.",
  },
  {
    icon: <Target className="w-5 h-5" />,
    title: "Go-to-market plan",
    desc: "Channel-by-channel CAC modeling. Pilot city playbook with weekly KPIs.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Risk & compliance audit",
    desc: "Privacy Act, ABN verification, state license checks, App Store policy.",
  },
];

const TIMELINE = [
  {
    week: "Week 1",
    title: "Discovery & validation",
    items: [
      "Customer discovery interviews (Perth pilot)",
      "Concept validation with 15+ tradies",
      "Competitive teardown — HiPages / Airtasker / Oneflare",
      "Initial wireframes for 8 hero screens",
    ],
  },
  {
    week: "Week 2",
    title: "Architecture & costing",
    items: [
      "Technical architecture & stack selection",
      "Detailed wireframes for all 20+ screens",
      "Compliance audit (Privacy Act, licensing per state)",
      "Cost model & resource plan",
    ],
  },
  {
    week: "Week 3",
    title: "Compilation & delivery",
    items: [
      "Final document compilation",
      "Phase 1 quote preparation (fixed, milestone-locked)",
      "In-person presentation & Q&A with you",
      "Sign-off & Phase 1 kickoff (or walk away)",
    ],
  },
];

export default function DiscoveryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy via-navy-600 to-navy-700 text-white">
        <div className="absolute inset-0 dot-grid opacity-20" />
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-orange/30 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full bg-orange/20 blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-5 sm:px-6 py-12 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/15 border border-orange/30 backdrop-blur-sm text-xs font-bold text-orange-300 mb-5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse" />
            Step 1 of 5 · Pre-investment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
          >
            The Discovery Phase.
            <br />
            <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              $12K. 21 days.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-5 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed"
          >
            Before you commit $850K AUD, we de-risk every assumption.
            In three weeks you receive a complete, buildable plan &mdash;
            yours to act on, shop elsewhere, or shelve.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
          >
            {[
              { v: "$12K", l: "Total cost", color: "orange" },
              { v: "$6K", l: "Deposit (50%)", color: "white" },
              { v: "21 days", l: "End-to-end", color: "white" },
              { v: "100%", l: "Deductible from Phase 1", color: "success" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4"
              >
                <div
                  className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${
                    s.color === "orange"
                      ? "text-orange-300"
                      : s.color === "success"
                      ? "text-success"
                      : "text-white"
                  }`}
                >
                  {s.v}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/65 font-bold mt-0.5">
                  {s.l}
                </div>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34 }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <button className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-glow btn-press transition-all min-h-[52px]">
              Sign Discovery Agreement
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm btn-press transition-all min-h-[52px]">
              Download proposal PDF
            </button>
          </motion.div>
        </div>
      </div>

      {/* What you receive */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange mb-2">
            8 deliverables · 1 fixed price
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            What you receive.
          </h2>
          <p className="text-navy/60 mt-3 text-base sm:text-lg">
            Every output is yours to keep, regardless of whether we proceed
            to Phase 1 together.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {DELIVERABLES.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group rounded-2xl bg-white border border-navy/8 p-5 hover:border-orange/30 hover:shadow-card transition-all"
            >
              <div className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-xl bg-orange/10 text-orange grid place-items-center group-hover:bg-orange group-hover:text-white transition-colors">
                  {d.icon}
                </div>
                <div className="min-w-0">
                  <div className="font-black text-navy text-base">{d.title}</div>
                  <p className="text-sm text-navy/60 mt-1 leading-relaxed">
                    {d.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange mb-2">
              Timeline
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              Three weeks. Locked.
            </h2>
            <p className="text-navy/60 mt-3 text-base sm:text-lg">
              From signed agreement to in-person Q&amp;A presentation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {TIMELINE.map((t, i) => (
              <motion.div
                key={t.week}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-2xl bg-white border border-navy/8 p-6 shadow-soft"
              >
                <div className="absolute -top-3 left-6 px-3 py-1 rounded-full bg-navy text-white text-[10px] font-bold uppercase tracking-wider">
                  {t.week}
                </div>
                <h3 className="font-black text-lg mt-2">{t.title}</h3>
                <ul className="mt-4 space-y-2">
                  {t.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-navy/75"
                    >
                      <Check className="w-4 h-4 text-success shrink-0 mt-0.5" strokeWidth={3} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Investment terms */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange mb-2">
              Investment terms
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              Clean. Fixed.
              <br />
              Refundable into Phase 1.
            </h2>
            <p className="text-navy/60 mt-4 text-base leading-relaxed">
              The $12K is 100% credited toward your Phase 1 build if we
              proceed. If you walk away after Discovery, you keep the
              spec, the wireframes, the interviews, and the model. No
              lock-in. No retainer.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-xs font-bold">
              <Lock className="w-3 h-3" />
              No equity. No IP claims. No hidden fees.
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-white border-2 border-navy/8 shadow-card overflow-hidden"
          >
            <div className="bg-gradient-to-br from-navy to-navy-700 text-white p-6">
              <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-orange-300">
                Discovery agreement
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-5xl font-black tracking-tight tabular-nums">
                  $12,000
                </span>
                <span className="text-orange-300 text-sm font-bold">AUD</span>
              </div>
              <div className="text-xs text-white/55 mt-1">
                One fixed price. No add-ons. No surprises.
              </div>
            </div>

            <div className="divide-y divide-navy/8">
              <TermsRow
                icon={<DollarSign className="w-4 h-4" />}
                label="Deposit (on signature)"
                value="$6,000"
                tag="50%"
              />
              <TermsRow
                icon={<Calendar className="w-4 h-4" />}
                label="Balance (on delivery, week 3)"
                value="$6,000"
                tag="50%"
              />
              <TermsRow
                icon={<RefreshCw className="w-4 h-4" />}
                label="Credit toward Phase 1 build"
                value="100%"
                tag="Deductible"
                tone="success"
              />
              <TermsRow
                icon={<Clock className="w-4 h-4" />}
                label="Delivery window"
                value="21 days"
                tag="From signature"
              />
            </div>

            <div className="p-5 bg-orange/5 border-t border-orange/15">
              <button className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all min-h-[48px]">
                Sign &amp; release $6K deposit
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[10px] text-navy/55 text-center mt-2 font-medium">
                DocuSign + Stripe · Encrypted · Australian-incorporated
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why this protects you */}
      <section className="bg-gradient-to-br from-orange via-orange-600 to-orange-700 text-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20 relative overflow-hidden">
          <div className="absolute inset-0 dot-grid opacity-20" />
          <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-white/10 blur-3xl" />

          <div className="relative grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/70 mb-2">
                Why this protects you
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                $12K is the cost of certainty
                <br />
                before $850K of commitment.
              </h2>
              <p className="text-white/85 mt-5 text-base sm:text-lg leading-relaxed max-w-xl">
                If, after Discovery, you decide not to proceed: you walk
                away with a complete, professionally-documented business
                plan and technical specification &mdash; yours to use,
                shop to other partners, or shelve.
              </p>
              <p className="text-white/70 mt-3 text-sm sm:text-base leading-relaxed max-w-xl">
                If you proceed: the $12K is fully credited and we begin
                Phase 1 with zero ambiguity, a fixed-quote build proposal,
                and a validated go-to-market plan.
              </p>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {[
                { t: "You keep all deliverables", d: "Spec, wireframes, interviews, model — yours." },
                { t: "100% refundable as credit", d: "Deducted from Phase 1 if we proceed." },
                { t: "No equity. No IP claims.", d: "Clean cash transaction. Australian law." },
                { t: "Fixed price. Fixed timeline.", d: "21 days. Not 22. Not 30." },
              ].map((b) => (
                <div
                  key={b.t}
                  className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4"
                >
                  <div className="shrink-0 w-7 h-7 rounded-full bg-white/20 grid place-items-center mt-0.5">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm">{b.t}</div>
                    <div className="text-xs text-white/75 mt-0.5 leading-snug">
                      {b.d}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-5 sm:px-6 py-14 md:py-20 text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
          Ready when you are, Braxton.
        </h2>
        <p className="text-navy/60 mt-4 text-base sm:text-lg max-w-xl mx-auto">
          Sign today. We start customer discovery interviews this week.
          You see the first wireframes by Day 7.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <button className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-navy hover:bg-navy-700 text-white font-bold rounded-xl shadow-lg btn-press transition-all min-h-[52px]">
            Sign Discovery Agreement
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-navy/10 hover:border-navy/30 text-navy font-bold rounded-xl btn-press transition-all min-h-[52px]">
            Schedule a call instead
          </button>
        </div>
        <p className="text-[11px] text-navy/40 font-medium mt-6">
          &mdash; Marwan, Co-founder &amp; Head of Product
        </p>
      </section>
    </div>
  );
}

function TermsRow({
  icon,
  label,
  value,
  tag,
  tone,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  tag: string;
  tone?: "success";
}) {
  return (
    <div className="flex items-center gap-3 px-5 py-3.5">
      <div
        className={`shrink-0 w-8 h-8 rounded-lg grid place-items-center ${
          tone === "success" ? "bg-success/10 text-success" : "bg-navy/8 text-navy"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-navy">{label}</div>
      </div>
      <div className="text-right shrink-0">
        <div className="font-black text-navy text-base tabular-nums">{value}</div>
        <div
          className={`text-[10px] font-bold uppercase tracking-wider ${
            tone === "success" ? "text-success" : "text-navy/45"
          }`}
        >
          {tag}
        </div>
      </div>
    </div>
  );
}
