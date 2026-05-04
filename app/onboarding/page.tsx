"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  MapPin,
  Camera,
} from "lucide-react";
import { TRADE_CATEGORIES, CITIES } from "@/lib/mockData";
import { cn } from "@/lib/cn";

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [trade, setTrade] = useState<string | null>("Plumber");
  const [description, setDescription] = useState(
    "Hot water system has been leaking for 2 days. Original Rheem 250L unit, about 11 years old. Need urgent replacement."
  );
  const [city, setCity] = useState("Sydney");
  const [urgency, setUrgency] = useState(75);
  const [photoAdded, setPhotoAdded] = useState(true);

  const next = () => setStep((s) => Math.min(s + 1, 2));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const urgencyLabel =
    urgency < 25 ? "Whenever" : urgency < 50 ? "This week" : urgency < 80 ? "ASAP" : "Emergency";

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/40 to-white">
      <div className="max-w-2xl mx-auto px-5 py-6 md:py-10">
        {/* header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="text-navy/60 hover:text-navy text-sm font-semibold flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="text-xs font-semibold text-navy/50">
            Step {step + 1} of 3
          </div>
        </div>

        {/* progress */}
        <div className="flex gap-1.5 mb-10">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 h-1.5 rounded-full bg-navy/8 overflow-hidden"
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: i <= step ? "100%" : 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="h-full bg-orange rounded-full"
              />
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div
              key="s0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                What do you need done?
              </h1>
              <p className="text-navy/60 mt-2">
                Pick your trade category. We&apos;ll match you with verified pros nearby.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8">
                {TRADE_CATEGORIES.map((t) => {
                  const active = trade === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTrade(t.id)}
                      className={cn(
                        "group relative aspect-[4/3.6] rounded-2xl border-2 p-4 text-left transition-all btn-press overflow-hidden",
                        active
                          ? "border-orange bg-orange/5 shadow-card"
                          : "border-navy/10 bg-white hover:border-navy/20 hover:shadow-soft"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="trade-glow"
                          className="absolute inset-0 bg-gradient-to-br from-orange/0 via-orange/5 to-orange/15 rounded-2xl"
                        />
                      )}
                      <div className="relative flex flex-col h-full justify-between">
                        <div className="text-3xl">{t.emoji}</div>
                        <div>
                          <div className="font-bold text-navy">{t.label}</div>
                          <div className="text-xs text-navy/50 mt-0.5">
                            {t.jobs.toLocaleString("en-US")} jobs/mo
                          </div>
                        </div>
                      </div>
                      {active && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-orange grid place-items-center">
                          <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div
              key="s1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Tell us the details.
              </h1>
              <p className="text-navy/60 mt-2">
                The more context, the better the match. Photos help a lot.
              </p>

              <div className="mt-8 space-y-5">
                <div>
                  <label className="text-sm font-semibold text-navy/80">
                    Describe the job
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="mt-2 w-full rounded-2xl border-2 border-navy/10 bg-white px-4 py-3 text-navy placeholder:text-navy/30 focus:border-orange focus:outline-none focus:ring-4 focus:ring-orange/15 transition-all resize-none"
                    placeholder="e.g. Hot water system leaking, need urgent fix..."
                  />
                  <div className="text-xs text-navy/40 mt-1.5 text-right">
                    {description.length} / 500
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-navy/80">
                    Add photos
                  </label>
                  <div className="mt-2 grid grid-cols-3 gap-3">
                    {photoAdded && (
                      <div className="aspect-square rounded-xl bg-gradient-to-br from-navy-100 to-navy-200 relative overflow-hidden group">
                        <img
                          src="https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=400&q=80"
                          alt="job photo"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => setPhotoAdded(false)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 grid place-items-center text-white text-xs hover:bg-black/80"
                        >
                          ×
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => setPhotoAdded(true)}
                      className="aspect-square rounded-xl border-2 border-dashed border-navy/15 hover:border-orange/50 hover:bg-orange/5 grid place-items-center text-navy/40 hover:text-orange transition-all"
                    >
                      <div className="flex flex-col items-center gap-1">
                        <Camera className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">Camera</span>
                      </div>
                    </button>
                    <button className="aspect-square rounded-xl border-2 border-dashed border-navy/15 hover:border-orange/50 hover:bg-orange/5 grid place-items-center text-navy/40 hover:text-orange transition-all">
                      <div className="flex flex-col items-center gap-1">
                        <ImageIcon className="w-5 h-5" />
                        <span className="text-[10px] font-semibold">Library</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="s2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                Where &amp; how soon?
              </h1>
              <p className="text-navy/60 mt-2">
                We&apos;ll surface tradies in your area sorted by urgency.
              </p>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="text-sm font-semibold text-navy/80">
                    City
                  </label>
                  <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {CITIES.map((c) => {
                      const active = city === c;
                      return (
                        <button
                          key={c}
                          onClick={() => setCity(c)}
                          className={cn(
                            "rounded-xl border-2 py-3 px-3 font-semibold flex items-center justify-center gap-1.5 btn-press transition-all",
                            active
                              ? "border-orange bg-orange/5 text-navy"
                              : "border-navy/10 bg-white text-navy/60 hover:border-navy/20"
                          )}
                        >
                          <MapPin
                            className={cn(
                              "w-4 h-4",
                              active ? "text-orange" : "text-navy/40"
                            )}
                          />
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-navy/80">
                      How urgent?
                    </label>
                    <div className="text-sm font-bold text-orange">
                      {urgencyLabel}
                    </div>
                  </div>
                  <div className="mt-3 relative">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={urgency}
                      onChange={(e) => setUrgency(Number(e.target.value))}
                      className="w-full appearance-none h-2 rounded-full bg-navy/10 outline-none accent-orange [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${urgency}%, rgba(10,37,64,0.1) ${urgency}%, rgba(10,37,64,0.1) 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-[11px] text-navy/40 mt-2 font-medium">
                      <span>Whenever</span>
                      <span>This week</span>
                      <span>ASAP</span>
                      <span>Emergency</span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-navy/[0.03] border border-navy/8 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-navy/50 mb-2">
                    Match preview
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-navy">
                    <Check className="w-4 h-4 text-success" />
                    <span>
                      {trade ?? "Job"} · {city} · {urgencyLabel}
                    </span>
                  </div>
                  <div className="text-xs text-navy/60 mt-1">
                    12 verified tradies match your criteria.
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* nav */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={back}
            disabled={step === 0}
            className="text-navy/60 hover:text-navy text-sm font-semibold disabled:opacity-30 flex items-center gap-1.5 px-4 py-2.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {step < 2 ? (
            <button
              onClick={next}
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-navy hover:bg-navy-700 text-white font-bold rounded-xl shadow-lg btn-press transition-all"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <Link
              href="/swipe"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-orange hover:bg-orange-600 text-white font-bold rounded-xl shadow-glow btn-press transition-all"
            >
              Find tradies
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
