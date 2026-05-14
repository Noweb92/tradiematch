"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AddressInput } from "@/components/shared/AddressInput";
import { LogoMark } from "@/components/Logo";

interface Props {
  firstName: string | null;
  email: string;
}

export function CustomerOnboardingWizard({ firstName }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [addressMeta, setAddressMeta] = useState<{
    city: string;
    state: string;
    postcode: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);

  async function complete() {
    if (!coords || !addressMeta) {
      toast.error("Please pick your address from the suggestions.");
      return;
    }
    setSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { data: auth } = await supabase.auth.getUser();
    if (!auth.user) {
      setSaving(false);
      return;
    }
    const { error } = await supabase
      .from("profiles")
      .update({
        city: addressMeta.city,
        state: addressMeta.state,
        postcode: addressMeta.postcode,
        latitude: coords.lat,
        longitude: coords.lon,
        onboarding_completed: true,
      })
      .eq("id", auth.user.id);

    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome to TradieMatch!");
    router.push("/app/customer/dashboard");
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <LogoMark size={36} />
        <div>
          <div className="font-black text-lg tracking-tight text-navy leading-none">
            TradieMatch
          </div>
          <div className="text-[10px] text-navy/50 font-bold uppercase tracking-wider mt-0.5">
            Customer setup · Step {step + 1} of 2
          </div>
        </div>
      </div>

      <div className="flex gap-1.5 mb-8">
        {[0, 1].map((i) => (
          <div
            key={i}
            className="flex-1 h-1.5 rounded-full bg-navy/8 overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: i <= step ? "100%" : 0 }}
              transition={{ duration: 0.4 }}
              className="h-full bg-orange rounded-full"
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.section
            key="s0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              G&apos;day{firstName ? `, ${firstName}` : ""} 👋
            </h1>
            <p className="text-navy/65 mt-2 text-base leading-relaxed">
              Where are you based? We&apos;ll match you with verified tradies
              who service your area.
            </p>

            <div className="mt-7 space-y-4">
              <AddressInput
                label="Your address"
                value={address}
                onChange={setAddress}
                onSelect={(s) => {
                  setCoords({ lat: s.lat, lon: s.lon });
                  setAddressMeta({
                    city: s.address?.city ?? s.address?.suburb ?? "",
                    state: s.address?.state ?? "",
                    postcode: s.address?.postcode ?? "",
                  });
                }}
              />

              {coords && addressMeta && (
                <div className="flex items-center gap-2 text-xs text-success font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    Located in {addressMeta.city || "your area"}
                    {addressMeta.state ? `, ${addressMeta.state}` : ""}
                    {addressMeta.postcode ? ` ${addressMeta.postcode}` : ""}
                  </span>
                </div>
              )}

              <button
                onClick={() => setStep(1)}
                disabled={!coords || !addressMeta}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-navy hover:bg-navy-700 text-white font-bold shadow-lg btn-press transition-all disabled:opacity-40 min-h-[48px]"
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.section>
        )}

        {step === 1 && (
          <motion.section
            key="s1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              You&apos;re all set.
            </h1>
            <p className="text-navy/65 mt-2 text-base leading-relaxed">
              You can post your first job now, or browse the dashboard first.
              Up to you.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              <button
                onClick={async () => {
                  await complete();
                  router.push("/app/customer/jobs/new");
                }}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all disabled:opacity-60 min-h-[48px]"
              >
                {saving ? "Saving…" : "Post my first job"}
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={complete}
                disabled={saving}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white border-2 border-navy/10 text-navy font-bold hover:border-navy/25 btn-press transition-all disabled:opacity-60"
              >
                Skip — take me to my dashboard
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {step > 0 && (
        <button
          onClick={() => setStep((s) => s - 1)}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-navy/55 hover:text-navy"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back
        </button>
      )}
    </div>
  );
}
