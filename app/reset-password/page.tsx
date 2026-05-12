"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  resetPasswordSchema,
  type ResetPasswordInput,
} from "@/lib/validation/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthCard } from "@/components/auth/AuthCard";
import { FormField } from "@/components/auth/FormField";
import { ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({ resolver: zodResolver(resetPasswordSchema) });

  async function onSubmit(values: ResetPasswordInput) {
    setSubmitting(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated. Logging you in…");
    router.push("/");
  }

  return (
    <AuthCard
      title="Set a new password."
      subtitle="Enter your new password below."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3.5">
        <FormField
          label="New password"
          type="password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
        />
        <FormField
          label="Confirm password"
          type="password"
          placeholder="Type it again"
          autoComplete="new-password"
          {...register("confirm_password")}
          error={errors.confirm_password?.message}
        />
        <button
          type="submit"
          disabled={submitting}
          className="mt-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold shadow-glow btn-press transition-all disabled:opacity-60 min-h-[48px]"
        >
          {submitting ? "Saving…" : <>Save new password <ArrowRight className="w-4 h-4" /></>}
        </button>
      </form>
    </AuthCard>
  );
}
