"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { loginSchema, type LoginInput } from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { FormField } from "./FormField";
import { GoogleButton } from "./GoogleButton";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next");
  const signupSuccess = params.get("signup") === "success";
  const signupEmail = params.get("email");
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: signupEmail ?? "" },
  });

  async function onSubmit(values: LoginInput) {
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      toast.error(error.message);
      setSubmitting(false);
      return;
    }

    // Decide post-login redirect based on profile role
    const userId = data.user?.id;
    if (userId) {
      const profileRes = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("id", userId)
        .single();
      const profile = profileRes.data as
        | { role?: string; onboarding_completed?: boolean }
        | null;
      const fallback = redirectForRole(
        profile?.role,
        profile?.onboarding_completed,
      );
      router.push(next ?? fallback);
    } else {
      router.push(next ?? "/");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {signupSuccess && (
        <div className="rounded-xl bg-success/10 border border-success/30 px-3.5 py-3 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
          <div className="text-sm text-success leading-snug">
            <span className="font-bold">Account created.</span> Check your inbox
            to confirm your email — then log in below.
          </div>
        </div>
      )}

      <GoogleButton redirectTo={next ?? undefined} />

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-navy/8" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-navy/40">
          or with email
        </span>
        <div className="flex-1 h-px bg-navy/8" />
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <FormField
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <div>
          <FormField
            label="Password"
            type="password"
            placeholder="Your password"
            autoComplete="current-password"
            {...register("password")}
            error={errors.password?.message}
          />
          <div className="text-right mt-2">
            <Link
              href="/forgot-password"
              className="text-xs font-bold text-orange hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all disabled:opacity-60 min-h-[48px]"
        >
          {submitting ? (
            "Logging in…"
          ) : (
            <>
              Log in
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

function redirectForRole(role?: string | null, onboarded?: boolean | null) {
  if (role === "admin") return "/app/admin/dashboard";
  if (role === "tradie") {
    return onboarded ? "/app/tradie/dashboard" : "/app/tradie/onboarding";
  }
  if (role === "customer") {
    return onboarded ? "/app/customer/dashboard" : "/app/customer/onboarding";
  }
  return "/";
}
