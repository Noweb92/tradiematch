"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { signupSchema, type SignupInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { FormField, FormCheckbox } from "./FormField";
import { GoogleButton } from "./GoogleButton";

interface Props {
  role: "customer" | "tradie";
}

export function SignupForm({ role }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? undefined;
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
    defaultValues: { accept_tos: false, marketing_opt_in: false },
  });

  async function onSubmit(values: SignupInput) {
    setSubmitting(true);

    const supabase = createSupabaseBrowserClient();
    const emailRedirectTo = `${window.location.origin}/auth/callback${
      next ? `?next=${encodeURIComponent(next)}` : ""
    }`;

    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo,
        data: {
          role,
          first_name: values.first_name,
          last_name: values.last_name,
          marketing_opt_in: values.marketing_opt_in,
        },
      },
    });

    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    toast.success("Account created. Check your email to confirm.");
    router.push(`/login?signup=success&email=${encodeURIComponent(values.email)}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleButton role={role} redirectTo={next} />

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-navy/8" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40">
          or with email
        </span>
        <div className="flex-1 h-px bg-navy/8" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <div className="grid grid-cols-2 gap-3">
          <FormField
            label="First name"
            placeholder="Jack"
            autoComplete="given-name"
            {...register("first_name")}
            error={errors.first_name?.message}
          />
          <FormField
            label="Last name"
            placeholder="Thompson"
            autoComplete="family-name"
            {...register("last_name")}
            error={errors.last_name?.message}
          />
        </div>

        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <FormField
          label="Password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
          hint={errors.password ? undefined : "Use 8+ characters"}
        />

        <FormCheckbox
          label={
            <span>
              I accept the{" "}
              <a
                href="/legal/terms"
                target="_blank"
                rel="noreferrer"
                className="text-orange font-bold hover:underline"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/legal/privacy"
                target="_blank"
                rel="noreferrer"
                className="text-orange font-bold hover:underline"
              >
                Privacy Policy
              </a>
              .
            </span>
          }
          checked={watch("accept_tos")}
          onChange={(v) => setValue("accept_tos", v, { shouldValidate: true })}
          error={errors.accept_tos?.message}
        />

        <FormCheckbox
          label="Email me product updates &amp; tips (optional)"
          checked={watch("marketing_opt_in") ?? false}
          onChange={(v) => setValue("marketing_opt_in", v)}
        />

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all disabled:opacity-60 min-h-[48px]"
        >
          {submitting ? (
            "Creating account…"
          ) : (
            <>
              Create my {role} account
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
