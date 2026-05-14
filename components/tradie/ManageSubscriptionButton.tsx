"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Wallet, Loader2 } from "lucide-react";

interface Props {
  className?: string;
  label?: string;
}

export function ManageSubscriptionButton({ className, label }: Props) {
  const [busy, setBusy] = useState(false);

  async function open() {
    setBusy(true);
    try {
      const res = await fetch("/api/stripe/create-portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        toast.error(data.error ?? "Could not open billing portal");
        setBusy(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      toast.error("Network error");
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className={
        className ??
        "inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-navy hover:bg-navy-700 text-white text-sm font-bold btn-press disabled:opacity-60 min-h-[44px]"
      }
    >
      {busy ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <>
          <Wallet className="w-4 h-4" />
          {label ?? "Manage billing"}
        </>
      )}
    </button>
  );
}
