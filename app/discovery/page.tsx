"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  FileText,
  Layout,
  Code2,
  Cpu,
  ShieldCheck,
  Users,
  Calendar,
  DollarSign,
  Check,
  ArrowRight,
  Lock,
  Clock,
  RefreshCw,
  Download,
  Mail,
  Rocket,
  TrendingUp,
} from "lucide-react";
import { TRANCHES } from "@/lib/mockData";

const TRANCHE_1_DELIVERABLES = [
  {
    icon: <FileText className="w-5 h-5" />,
    title: "Final spec & architecture",
    desc: "Complete technical specification, API design, data model, and infrastructure plan.",
  },
  {
    icon: <Layout className="w-5 h-5" />,
    title: "Full product design",
    desc: "20+ key screens designed by a senior AU product designer. iOS + Android. Pixel-perfect.",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "Initial development sprints",
    desc: "Mobile app skeleton (RN + Expo). Backend API foundations. Verification flow stubs.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Customer discovery",
    desc: "15+ tradie interviews + 10+ customer interviews in Perth. Validated unit economics.",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "Stack & vendor lock",
    desc: "Final tech stack, design partner contracted, offshore engineering team onboarded.",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: "Compliance audit",
    desc: "Privacy Act, ABN verification, state license checks, App Store policy review.",
  },
];

const PROTECTIONS = [
  { t: "100% milestone-gated", d: "Tranche 2 unlocks only when Tranche 1 is delivered and audited." },
  { t: "Independent technical audit", d: "Hire any technical advisor of your choosing to verify deliverables." },
  { t: "All IP belongs to you", d: "No retention by Marwan. No licensing back. No parallel commercialization." },
  { t: "Walk away with assets", d: "Stop after T1 → you keep the spec, design, app skeleton, and full team handover." },
];

// Pre-baked email body for Sign Tranche 1
const TRANCHE_1_SUBJECT = encodeURIComponent(
  "TradieMatch — Tranche 1 sign-off ($200K AUD)"
);
const TRANCHE_1_BODY = encodeURIComponent(
  `Marwan,\n\nI've reviewed the v2 business plan and the live platform. Let's proceed with Tranche 1 ($200,000 AUD over Months 1–4).\n\nPlease send through:\n1. Engagement agreement for signature.\n2. Stripe / wire details for the $200K release.\n3. Project kickoff date (target: this week).\n\n— Braxton`
);
const SIGN_HREF = `mailto:hello@tradiematch.com.au?subject=${TRANCHE_1_SUBJECT}&body=${TRANCHE_1_BODY}`;

export default function TrancheOnePage() {
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
            Tranche 1 of 4 · First commitment
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.05]"
          >
            Tranche 1.
            <br />
            <span className="bg-gradient-to-r from-orange-300 to-orange-500 bg-clip-text text-transparent">
              $200K. 4 months.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mt-5 text-base sm:text-lg text-white/75 max-w-2xl leading-relaxed"
          >
            The first of four conditional tranches. You release $200K to fund
            Discovery, full product design, technical architecture, and the
            initial development sprints. Tranche 2 unlocks only on milestone
            delivery — your downside is capped at $200K, not $935K.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26 }}
            className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl"
          >
            {[
              { v: "$200K", l: "Tranche 1", color: "orange" },
              { v: "4 months", l: "M1 – M4", color: "white" },
              { v: "$160K", l: "Project budget", color: "white" },
              { v: "$40K", l: "Marwan retainer", color: "white" },
            ].map((s) => (
              <div
                key={s.l}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-4"
              >
                <div
                  className={`text-2xl sm:text-3xl font-black tracking-tight tabular-nums ${
                    s.color === "orange" ? "text-orange-300" : "text-white"
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
            <a
              href={SIGN_HREF}
              className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-glow btn-press transition-all min-h-[52px]"
            >
              <Mail className="w-4 h-4" />
              Sign Tranche 1 Agreement
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/TradieMatch_Business_Plan.docx"
              download="TradieMatch_Business_Plan_v2.docx"
              className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold rounded-xl backdrop-blur-sm btn-press transition-all min-h-[52px]"
            >
              <Download className="w-4 h-4" />
              Download Business Plan v2
            </a>
          </motion.div>
        </div>
      </div>

      {/* What Tranche 1 funds */}
      <section className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange mb-2">
            6 deliverables · 4 months · 1 fixed price
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            What Tranche 1 funds.
          </h2>
          <p className="text-navy/60 mt-3 text-base sm:text-lg">
            By the end of Month 4 you have a fully designed product, tested
            architecture, and an app skeleton ready to go to MVP build.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {TRANCHE_1_DELIVERABLES.map((d, i) => (
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

      {/* Capital plan — 4 tranches */}
      <section className="bg-gradient-to-b from-orange-50/50 to-white">
        <div className="max-w-5xl mx-auto px-5 sm:px-6 py-14 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-orange mb-2">
              Phased capital · Stop-go gates
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
              You commit $200K today. Not $935K.
            </h2>
            <p className="text-navy/60 mt-3 text-base sm:text-lg">
              The full $935K is deployed in 4 conditional tranches. Each
              unlocks only when the previous milestone is independently
              verified. Maximum exposure at any decision point: $300K.
            </p>
          </div>

          <div className="space-y-3">
            {TRANCHES.map((t, i) => (
              <motion.div
                key={t.n}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-2xl border-2 p-5 ${
                  t.n === 1
                    ? "border-orange bg-gradient-to-r from-orange/5 to-white shadow-card"
                    : "border-navy/8 bg-white"
                }`}
              >
                <div className="grid md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-2 flex md:flex-col items-center md:items-start gap-3 md:gap-1">
                    <div
                      className={`w-12 h-12 rounded-2xl grid place-items-center font-black text-xl shrink-0 ${
                        t.n === 1
                          ? "bg-orange text-white shadow-glow"
                          : "bg-navy/[0.06] text-navy"
                      }`}
                    >
                      T{t.n}
                    </div>
                    <div>
                      <div
                        className={`text-2xl font-black tracking-tight tabular-nums ${
                          t.n === 1 ? "text-orange" : "text-navy"
                        }`}
                      >
                        {t.amount}
                      </div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-navy/50">
                        {t.months}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-6 min-w-0">
                    <div className="font-black text-navy text-base">
                      {t.title}
                    </div>
                    <div className="text-xs text-orange font-bold mt-0.5">
                      Trigger: {t.trigger}
                    </div>
                    <p className="text-sm text-navy/65 mt-2 leading-snug">
                      {t.desc}
                    </p>
                  </div>

                  <div className="md:col-span-4 flex md:flex-col gap-2 md:gap-1 text-xs">
                    <div className="flex-1 rounded-lg bg-navy/[0.04] px-3 py-2">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-navy/50">
                        Project
                      </div>
                      <div className="font-black text-navy tabular-nums">
                        {t.project}
                      </div>
                    </div>
                    <div className="flex-1 rounded-lg bg-orange/10 px-3 py-2">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-orange">
                        Marwan
                      </div>
                      <div className="font-black text-orange tabular-nums">
                        {t.fees}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-navy text-white p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-orange grid place-items-center text-white shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-orange-300">
                  Total program
                </div>
                <div className="font-black text-2xl tabular-nums">
                  $935K AUD <span className="text-white/50 text-sm font-normal">over 18 months</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wider text-white/55 font-bold">
                Your Tranche 1 commitment
              </div>
              <div className="font-black text-3xl text-orange-300 tabular-nums">
                $200K
              </div>
            </div>
          </div>
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
                Capped downside.
                <br />
                Open upside.
              </h2>
              <p className="text-white/85 mt-5 text-base sm:text-lg leading-relaxed max-w-xl">
                Tranche 1 is fully recoverable in real working assets — spec,
                wireframes, design system, app skeleton — even if the project
                halts at Month 4. Every subsequent tranche requires
                independently verified milestones.
              </p>
              <div className="mt-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-xs font-bold">
                <Lock className="w-3 h-3" />
                No equity dilution at this stage. No IP claims by Marwan.
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 gap-3">
              {PROTECTIONS.map((b) => (
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
          Sign the engagement agreement and release Tranche 1.
          Discovery interviews start within 7 days. First weekly progress
          report in your inbox by end of Week 1.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={SIGN_HREF}
            className="group inline-flex items-center justify-center gap-2 px-7 py-4 bg-navy hover:bg-navy-700 text-white font-bold rounded-xl shadow-lg btn-press transition-all min-h-[52px]"
          >
            <Mail className="w-4 h-4" />
            Sign Tranche 1 Agreement
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
          <Link
            href="/investor"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white border-2 border-navy/10 hover:border-navy/30 text-navy font-bold rounded-xl btn-press transition-all min-h-[52px]"
          >
            <Rocket className="w-4 h-4" />
            Review investor metrics
          </Link>
        </div>
        <p className="text-[11px] text-navy/40 font-medium mt-6">
          &mdash; Marwan, Co-founder &amp; Head of Product
        </p>
      </section>
    </div>
  );
}
