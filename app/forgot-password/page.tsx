"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, MailCheck } from "lucide-react";
import {
  forgotPasswordSchema,
  type ForgotPasswordInput,
} from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(values: ForgotPasswordInput) {
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <AuthCard
      title="Forgot password?"
      subtitle="Enter your email and we'll send a reset link."
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-orange font-bold hover:underline">
            Back to log in
          </Link>
        </>
      }
    >
      {sent ? (
        <div className="rounded-2xl bg-success/10 border border-success/30 p-5 flex flex-col items-center text-center">
          <MailCheck className="w-10 h-10 text-success mb-2" />
          <div className="font-black text-navy">Check your inbox</div>
          <p className="text-sm text-navy/65 mt-1 leading-relaxed">
            We sent a password reset link to{" "}
            <span className="font-bold">{getValues("email")}</span>. The link
            expires in 1 hour.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
          <FormField
            label="Email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            {...register("email")}
            error={errors.email?.message}
          />
          <button
            type="submit"
            disabled={submitting}
            className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all disabled:opacity-60 min-h-[48px]"
          >
            {submitting ? (
              "Sending…"
            ) : (
              <>
                Send reset link
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}
    </AuthCard>
  );
}
