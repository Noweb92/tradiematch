"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Zap,
  Clock,
  CalendarRange,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/storage/upload";
import { TRADE_CATEGORIES, URGENCY_OPTIONS } from "@/lib/constants/trades";
import { AddressInput } from "@/components/shared/AddressInput";
import { FileDrop } from "@/components/shared/FileDrop";
import { FormField } from "@/components/auth/FormField";
import { cn } from "@/lib/cn";

interface Props {
  customerId: string;
  defaultAddress: string;
  defaultCoords: { lat: number; lon: number } | null;
}

const STEPS = ["Category", "Details", "Location", "Urgency", "Budget", "Review"];

export function JobCreationWizard({
  customerId,
  defaultAddress,
  defaultCoords,
}: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const [category, setCategory] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [address, setAddress] = useState(defaultAddress);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    defaultCoords,
  );
  const [urgency, setUrgency] = useState<"flexible" | "within_week" | "asap">(
    "flexible",
  );
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");

  const canContinue: Record<number, boolean> = {
    0: !!category,
    1: title.length > 0 && description.length > 10,
    2: !!coords,
    3: !!urgency,
    4: true, // budget optional
    5: true,
  };

  function next() {
    if (!canContinue[step]) return;
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submit() {
    if (!category || !coords || !customerId) {
      toast.error("Missing required fields. Please go back and check.");
      return;
    }
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();

    // Upload photos
    const photoUrls: string[] = [];
    for (const f of photos) {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth.user) continue;
      const res = await uploadImage({
        supabase,
        bucket: "job-photos",
        file: f,
        pathPrefix: `${auth.user.id}/jobs`,
      });
      if (res.ok && res.url) photoUrls.push(res.url);
    }

    const { data: created, error } = await supabase
      .from("jobs")
      .insert({
        customer_id: customerId,
        title,
        description,
        trade_category: category,
        photos: photoUrls,
        location_address: address || null,
        latitude: coords.lat,
        longitude: coords.lon,
        urgency,
        budget_min: budgetMin ? Number(budgetMin) : null,
        budget_max: budgetMax ? Number(budgetMax) : null,
        status: "open",
      })
      .select("id")
      .single();

    setSubmitting(false);

    if (error || !created) {
      toast.error(error?.message ?? "Could not create job");
      return;
    }
    toast.success("Job posted! Finding tradies in your area…");
    router.push(`/app/customer/jobs/${(created as { id: string }).id}/swipe`);
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
          {STEPS[step]} · Step {step + 1} of {STEPS.length}
        </span>
        <button
          onClick={() => router.push("/app/customer/dashboard")}
          className="text-xs font-bold text-navy/55 hover:text-navy"
        >
          Cancel
        </button>
      </div>
      <div className="flex gap-1 mb-8">
        {STEPS.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full bg-navy/8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: i <= step ? "100%" : 0 }}
              transition={{ duration: 0.3 }}
              className="h-full bg-orange rounded-full"
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Category */}
        {step === 0 && (
          <Step key="0" title="What do you need done?">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TRADE_CATEGORIES.map((t) => {
                const active = category === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setCategory(t.id)}
                    className={cn(
                      "aspect-square sm:aspect-[4/3.5] rounded-2xl border-2 p-3 text-left transition-all btn-press",
                      active
                        ? "border-orange bg-orange/5 shadow-card"
                        : "border-navy/10 bg-white hover:border-navy/20",
                    )}
                  >
                    <div className="text-2xl">{t.emoji}</div>
                    <div className="mt-1 font-bold text-navy text-sm">
                      {t.label}
                    </div>
                    {active && (
                      <div className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-orange grid place-items-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* Details */}
        {step === 1 && (
          <Step key="1" title="Tell us the details">
            <FormField
              label="Job title"
              placeholder="e.g. Burst pipe in laundry"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div>
              <label className="text-xs font-bold text-navy/75 tracking-wide">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="When did it start? What have you tried? Any access notes?"
                className="mt-1.5 w-full rounded-xl border-2 border-navy/10 bg-white px-3.5 py-3 text-sm text-navy placeholder:text-navy/30 focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/15 transition-all resize-none"
              />
              <div className="text-[11px] text-navy/45 mt-1 text-right">
                {description.length} chars
              </div>
            </div>
            <FileDrop
              label="Photos (optional but recommended)"
              hint="Photos help tradies give accurate quotes upfront."
              multiple
              maxFiles={5}
              files={photos}
              onChange={setPhotos}
            />
          </Step>
        )}

        {/* Location */}
        {step === 2 && (
          <Step key="2" title="Where is the job?">
            <AddressInput
              label="Job address"
              value={address}
              onChange={setAddress}
              onSelect={(s) => setCoords({ lat: s.lat, lon: s.lon })}
            />
            <p className="text-xs text-navy/55">
              We default to your saved address. Change it if the job is at a different location.
            </p>
          </Step>
        )}

        {/* Urgency */}
        {step === 3 && (
          <Step key="3" title="How urgent is it?">
            <div className="grid gap-2.5">
              {URGENCY_OPTIONS.map((opt) => {
                const active = urgency === opt.id;
                const Icon = opt.id === "asap" ? Zap : opt.id === "within_week" ? Clock : CalendarRange;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setUrgency(opt.id as typeof urgency)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 text-left transition-all btn-press",
                      active
                        ? "border-orange bg-orange/5"
                        : "border-navy/10 bg-white hover:border-navy/25",
                    )}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-xl grid place-items-center shrink-0",
                        active ? "bg-orange text-white" : "bg-navy/[0.06] text-navy",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-navy">{opt.label}</div>
                      <div className="text-xs text-navy/55 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {active && <Check className="w-4 h-4 text-orange" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </Step>
        )}

        {/* Budget */}
        {step === 4 && (
          <Step key="4" title="Budget? (optional)">
            <p className="text-sm text-navy/65 -mt-3">
              Helps tradies prioritise. You&apos;ll receive a final quote in chat.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Min ($AUD)"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={budgetMin}
                onChange={(e) => setBudgetMin(e.target.value)}
              />
              <FormField
                label="Max ($AUD)"
                type="number"
                inputMode="numeric"
                placeholder="0"
                value={budgetMax}
                onChange={(e) => setBudgetMax(e.target.value)}
              />
            </div>
          </Step>
        )}

        {/* Review */}
        {step === 5 && (
          <Step key="5" title="Review &amp; post">
            <div className="rounded-2xl bg-navy/[0.03] border border-navy/8 p-4 space-y-2.5">
              <Row label="Category" value={TRADE_CATEGORIES.find((c) => c.id === category)?.label ?? "—"} />
              <Row label="Title" value={title || "—"} />
              <Row label="Description" value={description ? `${description.slice(0, 80)}…` : "—"} />
              <Row label="Photos" value={`${photos.length} attached`} />
              <Row label="Location" value={address || "—"} />
              <Row label="Urgency" value={URGENCY_OPTIONS.find((u) => u.id === urgency)?.label ?? "—"} />
              <Row
                label="Budget"
                value={
                  budgetMin || budgetMax
                    ? `$${budgetMin || "0"} – $${budgetMax || "?"}`
                    : "Not specified"
                }
              />
            </div>
          </Step>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={back}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-navy/65 hover:text-navy disabled:opacity-30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={next}
            disabled={!canContinue[step]}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy hover:bg-navy-700 text-white font-bold shadow-lg btn-press disabled:opacity-40 min-h-[44px]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press disabled:opacity-60 min-h-[44px]"
          >
            {submitting ? "Posting…" : "Post job &amp; find tradies"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="relative space-y-4"
    >
      <h2
        className="text-2xl sm:text-3xl font-black tracking-tight"
        dangerouslySetInnerHTML={{ __html: title }}
      />
      {children}
    </motion.section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3 text-sm">
      <span className="text-navy/55 font-medium shrink-0">{label}</span>
      <span className="text-navy font-bold text-right line-clamp-2">{value}</span>
    </div>
  );
}
