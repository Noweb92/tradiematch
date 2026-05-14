"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  Sparkles,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { uploadImage } from "@/lib/storage/upload";
import { TRADE_CATEGORIES } from "@/lib/constants/trades";
import { FormField } from "@/components/auth/FormField";
import { FileDrop } from "@/components/shared/FileDrop";
import { cn } from "@/lib/cn";
import type { ABNVerificationResult } from "@/lib/abn/verify";

interface Existing {
  id?: string;
  abn?: string;
  abn_verified?: boolean;
  abn_entity_name?: string;
  business_name?: string;
  trade_categories?: string[];
  service_radius_km?: number;
  hourly_rate_min?: number;
  hourly_rate_max?: number;
  years_experience?: number;
  bio?: string;
  white_card_url?: string;
  insurance_url?: string;
  insurance_expiry?: string;
  admin_verified?: boolean;
}

interface Props {
  userId: string;
  firstName: string | null;
  existing: Existing | null;
}

const STEPS = [
  "Business",
  "ABN check",
  "Trades",
  "Service area",
  "Rates & bio",
  "Documents",
  "Submit",
];

export function TradieOnboardingWizard({ firstName, existing }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Form state (with resume)
  const [businessName, setBusinessName] = useState(existing?.business_name ?? "");
  const [abn, setAbn] = useState(existing?.abn ?? "");
  const [abnResult, setAbnResult] = useState<ABNVerificationResult | null>(
    existing?.abn_verified
      ? {
          valid: true,
          abn: existing.abn,
          entityName: existing.abn_entity_name,
          gstRegistered: true,
        }
      : null,
  );
  const [verifyingAbn, setVerifyingAbn] = useState(false);

  const [trades, setTrades] = useState<string[]>(existing?.trade_categories ?? []);
  const [radius, setRadius] = useState(existing?.service_radius_km ?? 25);
  const [postcode, setPostcode] = useState("");

  const [rateMin, setRateMin] = useState(String(existing?.hourly_rate_min ?? ""));
  const [rateMax, setRateMax] = useState(String(existing?.hourly_rate_max ?? ""));
  const [years, setYears] = useState(String(existing?.years_experience ?? ""));
  const [bio, setBio] = useState(existing?.bio ?? "");

  const [whiteCard, setWhiteCard] = useState<File[]>([]);
  const [insurance, setInsurance] = useState<File[]>([]);
  const [insuranceExpiry, setInsuranceExpiry] = useState(
    existing?.insurance_expiry ?? "",
  );

  const [submitting, setSubmitting] = useState(false);

  async function verifyAbnNow() {
    if (!abn.trim()) return;
    setVerifyingAbn(true);
    try {
      const res = await fetch("/api/abn/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ abn }),
      });
      const data: ABNVerificationResult = await res.json();
      setAbnResult(data);
      if (!data.valid) {
        toast.error(data.error ?? "ABN not valid");
      } else if (!data.gstRegistered) {
        toast.error(
          "ABN valid but not GST-registered. TradieMatch requires GST registration.",
        );
      } else {
        toast.success(`Verified: ${data.entityName}`);
      }
    } catch (err) {
      toast.error("Network error verifying ABN");
    } finally {
      setVerifyingAbn(false);
    }
  }

  function toggleTrade(id: string) {
    setTrades((prev) =>
      prev.includes(id)
        ? prev.filter((t) => t !== id)
        : prev.length < 5
        ? [...prev, id]
        : prev,
    );
  }

  const canContinue: Record<number, boolean> = {
    0: businessName.trim().length > 0,
    1: !!abnResult?.valid && !!abnResult.gstRegistered,
    2: trades.length > 0,
    3: radius >= 5 && radius <= 50 && /^\d{4}$/.test(postcode),
    4:
      Number(rateMin) > 0 &&
      Number(rateMax) >= Number(rateMin) &&
      Number(years) >= 0 &&
      bio.trim().length >= 20,
    5: (whiteCard.length > 0 || !!existing?.white_card_url) &&
       (insurance.length > 0 || !!existing?.insurance_url) &&
       !!insuranceExpiry,
    6: true,
  };

  async function submitAll() {
    if (!abnResult?.valid || !abnResult.gstRegistered) {
      toast.error("ABN verification incomplete.");
      return;
    }
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();

    // Upload white card + insurance (private bucket)
    let whiteCardUrl = existing?.white_card_url ?? null;
    if (whiteCard.length > 0) {
      const up = await uploadImage({
        supabase,
        bucket: "tradie-documents",
        file: whiteCard[0],
        pathPrefix: `${(await supabase.auth.getUser()).data.user?.id}/white-card`,
        publicUrl: false,
      });
      if (!up.ok) {
        toast.error(up.error ?? "White card upload failed");
        setSubmitting(false);
        return;
      }
      whiteCardUrl = up.path ?? null;
    }

    let insuranceUrl = existing?.insurance_url ?? null;
    if (insurance.length > 0) {
      const up = await uploadImage({
        supabase,
        bucket: "tradie-documents",
        file: insurance[0],
        pathPrefix: `${(await supabase.auth.getUser()).data.user?.id}/insurance`,
        publicUrl: false,
      });
      if (!up.ok) {
        toast.error(up.error ?? "Insurance upload failed");
        setSubmitting(false);
        return;
      }
      insuranceUrl = up.path ?? null;
    }

    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSubmitting(false);
      return;
    }

    const payload = {
      profile_id: auth.user.id,
      abn: abnResult.abn,
      abn_verified: true,
      abn_verified_at: new Date().toISOString(),
      abn_entity_name: abnResult.entityName,
      abn_entity_type: abnResult.entityType,
      abn_gst_registered: abnResult.gstRegistered,
      business_name: businessName,
      trade_categories: trades,
      service_radius_km: radius,
      hourly_rate_min: Number(rateMin),
      hourly_rate_max: Number(rateMax),
      years_experience: Number(years),
      bio,
      white_card_url: whiteCardUrl,
      insurance_url: insuranceUrl,
      insurance_expiry: insuranceExpiry || null,
      available: true,
    };

    let dbError: unknown;
    if (existing?.id) {
      const { error } = await supabase
        .from("tradies")
        .update(payload)
        .eq("id", existing.id);
      dbError = error;
    } else {
      const { error } = await supabase.from("tradies").insert(payload);
      dbError = error;
    }

    if (dbError) {
      toast.error((dbError as { message?: string })?.message ?? "Could not save");
      setSubmitting(false);
      return;
    }

    // Mark profile onboarding completed + save postcode
    await supabase
      .from("profiles")
      .update({ postcode, onboarding_completed: true })
      .eq("id", auth.user.id);

    setSubmitting(false);
    toast.success("Profile submitted! Awaiting admin verification.");
    router.push("/app/tradie/awaiting");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-navy/50">
          {STEPS[step]} · Step {step + 1} of {STEPS.length}
        </span>
        <span className="text-[10px] font-bold text-navy/40">
          Welcome{firstName ? `, ${firstName}` : ""}
        </span>
      </div>
      <div className="flex gap-1 mb-7">
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
        {/* 0 — Business */}
        {step === 0 && (
          <Step key="0" title="Your business" subtitle="Tell us your trading name. This is what customers will see.">
            <FormField
              label="Business / trading name"
              placeholder="e.g. Liam's Plumbing"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
          </Step>
        )}

        {/* 1 — ABN */}
        {step === 1 && (
          <Step
            key="1"
            title="Verify your ABN"
            subtitle="We check the Australian Business Register in real time. Your ABN must be active and GST-registered."
          >
            <div className="flex flex-col sm:flex-row gap-2 items-end">
              <div className="flex-1 w-full">
                <FormField
                  label="ABN (11 digits)"
                  placeholder="51 824 753 556"
                  inputMode="numeric"
                  value={abn}
                  onChange={(e) => setAbn(e.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={verifyAbnNow}
                disabled={verifyingAbn || !abn}
                className="px-5 py-3 rounded-xl bg-navy hover:bg-navy-700 text-white font-bold text-sm btn-press disabled:opacity-50 min-h-[44px] sm:min-w-[120px] inline-flex items-center justify-center gap-2"
              >
                {verifyingAbn ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                Verify
              </button>
            </div>

            {abnResult && (
              <div
                className={cn(
                  "mt-2 rounded-xl border-2 p-4",
                  abnResult.valid && abnResult.gstRegistered
                    ? "border-success/30 bg-success/5"
                    : "border-amber-300 bg-amber-50",
                )}
              >
                {abnResult.valid && abnResult.gstRegistered ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-success" strokeWidth={3} />
                      <span className="font-black text-navy">Verified</span>
                    </div>
                    <div className="mt-2 space-y-1 text-sm">
                      <Row label="Entity name" value={abnResult.entityName ?? "—"} />
                      <Row label="Entity type" value={abnResult.entityType ?? "—"} />
                      <Row label="ABN status" value={abnResult.abnStatus ?? "—"} />
                      <Row label="GST" value="Registered" />
                      <Row label="State" value={abnResult.state ?? "—"} />
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-black text-amber-700">Not verified</div>
                      <div className="text-sm text-amber-700/85 mt-0.5">
                        {abnResult.error ??
                          (!abnResult.gstRegistered
                            ? "ABN is active but not GST-registered. TradieMatch requires GST registration."
                            : "Couldn't verify ABN.")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Step>
        )}

        {/* 2 — Trades */}
        {step === 2 && (
          <Step
            key="2"
            title="Which trades?"
            subtitle="Pick up to 5. Only customers needing these categories will see you."
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TRADE_CATEGORIES.map((t) => {
                const active = trades.includes(t.id);
                return (
                  <button
                    key={t.id}
                    onClick={() => toggleTrade(t.id)}
                    className={cn(
                      "relative aspect-square sm:aspect-[4/3.5] rounded-2xl border-2 p-3 text-left transition-all btn-press",
                      active
                        ? "border-orange bg-orange/5"
                        : "border-navy/10 bg-white hover:border-navy/25",
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
            <div className="text-[11px] text-navy/50 text-right">
              {trades.length} / 5 selected
            </div>
          </Step>
        )}

        {/* 3 — Service area */}
        {step === 3 && (
          <Step
            key="3"
            title="Where do you work?"
            subtitle="Your service centre + radius. We surface you to customers within this area."
          >
            <FormField
              label="Base postcode (4 digits)"
              placeholder="6000"
              inputMode="numeric"
              maxLength={4}
              value={postcode}
              onChange={(e) => setPostcode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            />
            <div>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-navy/75 tracking-wide">
                  Service radius
                </label>
                <span className="text-sm font-bold text-orange tabular-nums">
                  {radius} km
                </span>
              </div>
              <input
                type="range"
                min={5}
                max={50}
                step={5}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="mt-2 w-full appearance-none h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF6B35 0%, #FF6B35 ${
                    ((radius - 5) / 45) * 100
                  }%, rgba(10,37,64,0.1) ${
                    ((radius - 5) / 45) * 100
                  }%, rgba(10,37,64,0.1) 100%)`,
                }}
              />
              <div className="flex justify-between text-[10px] text-navy/40 mt-1 font-bold">
                <span>5 km</span>
                <span>25 km</span>
                <span>50 km</span>
              </div>
            </div>
          </Step>
        )}

        {/* 4 — Rates & bio */}
        {step === 4 && (
          <Step
            key="4"
            title="Rates &amp; bio"
            subtitle="Set your hourly rate range and tell customers about you. Tone matters — keep it real."
          >
            <div className="grid grid-cols-2 gap-3">
              <FormField
                label="Hourly rate min ($AUD)"
                type="number"
                inputMode="numeric"
                placeholder="80"
                value={rateMin}
                onChange={(e) => setRateMin(e.target.value)}
              />
              <FormField
                label="Hourly rate max ($AUD)"
                type="number"
                inputMode="numeric"
                placeholder="140"
                value={rateMax}
                onChange={(e) => setRateMax(e.target.value)}
              />
            </div>
            <FormField
              label="Years of experience"
              type="number"
              inputMode="numeric"
              placeholder="12"
              value={years}
              onChange={(e) => setYears(e.target.value)}
            />
            <div>
              <label className="text-xs font-bold text-navy/75 tracking-wide">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                placeholder="Quick intro: speciality, years in the trade, what makes you good."
                className="mt-1.5 w-full rounded-xl border-2 border-navy/10 bg-white px-3.5 py-3 text-sm focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/15 transition-all resize-none"
              />
              <div className="text-[11px] text-navy/45 mt-1 text-right">
                {bio.length} chars · min 20
              </div>
            </div>
          </Step>
        )}

        {/* 5 — Documents */}
        {step === 5 && (
          <Step
            key="5"
            title="Upload your documents"
            subtitle="Private to TradieMatch. Reviewed manually by our team. You'll be live within 24 hours."
          >
            <FileDrop
              label="White card (front)"
              hint="Required for any work on a construction site."
              files={whiteCard}
              onChange={setWhiteCard}
              existingUrls={existing?.white_card_url ? [] : []}
            />
            <FileDrop
              label="Insurance certificate"
              hint="Public liability — most policies have $10–20M cover. Upload a clear photo or PDF screenshot."
              files={insurance}
              onChange={setInsurance}
            />
            <FormField
              label="Insurance expiry date"
              type="date"
              value={insuranceExpiry}
              onChange={(e) => setInsuranceExpiry(e.target.value)}
              hint="We'll remind you 30, 14 and 7 days before expiry."
            />
          </Step>
        )}

        {/* 6 — Submit */}
        {step === 6 && (
          <Step
            key="6"
            title="Ready to go live."
            subtitle="When you submit, our team reviews your documents (usually within 24h). You'll get an email when you're approved."
          >
            <div className="rounded-2xl bg-gradient-to-br from-orange/8 to-orange/[0.03] border border-orange/20 p-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange text-white grid place-items-center shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-black text-navy">
                    {businessName}
                  </div>
                  <div className="text-xs text-navy/65 mt-0.5">
                    {abnResult?.entityName} · ABN {abnResult?.abn}
                  </div>
                  <div className="text-xs text-navy/65 mt-2">
                    {trades.length} trade{trades.length === 1 ? "" : "s"} ·{" "}
                    {radius} km radius · ${rateMin}-${rateMax} / hr
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs text-navy/55 leading-relaxed">
              After approval, you&apos;ll choose a subscription tier (Basic /
              Pro / Elite) before going live. No money is taken until you
              choose a plan.
            </p>
          </Step>
        )}
      </AnimatePresence>

      <div className="mt-8 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(s - 1, 0))}
          disabled={step === 0}
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-navy/65 hover:text-navy disabled:opacity-30"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => canContinue[step] && setStep((s) => s + 1)}
            disabled={!canContinue[step]}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy hover:bg-navy-700 text-white font-bold shadow-lg btn-press disabled:opacity-40 min-h-[44px]"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={submitAll}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press disabled:opacity-60 min-h-[44px]"
          >
            {submitting ? "Submitting…" : "Submit for review"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Step({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div>
        <h2
          className="text-2xl sm:text-3xl font-black tracking-tight"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        {subtitle && (
          <p
            className="text-sm sm:text-base text-navy/65 mt-1.5 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: subtitle }}
          />
        )}
      </div>
      {children}
    </motion.section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-2 text-sm">
      <span className="text-navy/55 font-medium">{label}</span>
      <span className="text-navy font-bold text-right truncate max-w-[60%]">
        {value}
      </span>
    </div>
  );
}
