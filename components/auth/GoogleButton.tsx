"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface Props {
  role?: "customer" | "tradie";
  redirectTo?: string;
}

export function GoogleButton({ role, redirectTo }: Props) {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    const next = role ? `?role=${role}` : "";
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback${next}${
          redirectTo ? `&next=${encodeURIComponent(redirectTo)}` : ""
        }`,
      },
    });

    if (error) {
      toast.error(error.message);
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={signInWithGoogle}
      disabled={loading}
      className="w-full inline-flex items-center justify-center gap-3 px-5 py-3 rounded-xl border-2 border-navy/10 bg-white hover:border-navy/25 hover:bg-navy/[0.02] text-navy font-bold text-sm transition-all disabled:opacity-60 min-h-[48px]"
    >
      <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden>
        <path
          fill="#FFC107"
          d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.2 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.2-.1-2.3-.1-3.5z"
        />
        <path
          fill="#FF3D00"
          d="M6.3 14.1l6.6 4.8C14.6 15 18.9 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34 6.2 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.1z"
        />
        <path
          fill="#4CAF50"
          d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.6 39.6 16.3 44 24 44z"
        />
        <path
          fill="#1976D2"
          d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.7 36 44 30.5 44 24c0-1.2-.2-2.4-.4-3.5z"
        />
      </svg>
      {loading ? "Redirecting…" : "Continue with Google"}
    </button>
  );
}
