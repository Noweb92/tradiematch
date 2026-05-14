"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { X, Receipt, Loader2 } from "lucide-react";
import { FormField } from "@/components/auth/FormField";

interface Props {
  open: boolean;
  matchId: string;
  onClose: () => void;
}

export function QuoteModal({ open, matchId, onClose }: Props) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [sending, setSending] = useState(false);

  async function submit() {
    const amt = Number(amount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matchId,
          amount: amt,
          description: description || undefined,
          validUntil: validUntil || undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Could not send quote");
      } else {
        toast.success("Quote sent.");
        setAmount("");
        setDescription("");
        setValidUntil("");
        onClose();
      }
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-50 bg-navy/40 backdrop-blur-sm grid place-items-center p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-white shadow-card overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-navy/8 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange text-white grid place-items-center">
                <Receipt className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-black text-navy">Send a quote</div>
                <div className="text-[11px] text-navy/55">
                  Shown to the customer in the chat thread.
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full grid place-items-center text-navy/55 hover:bg-navy/[0.05]"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <FormField
                label="Amount (AUD)"
                type="number"
                inputMode="decimal"
                placeholder="2380"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div>
                <label className="text-xs font-bold text-navy/75 tracking-wide">
                  Job description / scope
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="e.g. Replace 250L hot water unit incl. removal of old + compliance cert"
                  className="mt-1.5 w-full rounded-xl border-2 border-navy/10 bg-white px-3.5 py-3 text-sm focus:outline-none focus:border-orange focus:ring-4 focus:ring-orange/15 transition-all resize-none"
                />
              </div>
              <FormField
                label="Valid until (optional)"
                type="date"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <div className="px-5 pb-5 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-navy/10 text-navy font-bold text-sm hover:border-navy/25 btn-press"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={sending}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange hover:bg-orange-600 text-white font-bold text-sm shadow-glow btn-press disabled:opacity-60"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send quote"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
