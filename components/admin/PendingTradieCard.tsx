"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Check,
  X,
  ShieldCheck,
  FileText,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { tradeLabel } from "@/lib/constants/trades";

interface Row {
  id: string;
  abn: string;
  abn_verified: boolean;
  abn_entity_name: string | null;
  business_name: string | null;
  trade_categories: string[];
  service_radius_km: number;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  bio: string | null;
  white_card_url: string | null;
  insurance_url: string | null;
  insurance_expiry: string | null;
  admin_rejection_reason: string | null;
  created_at: string;
  profiles: {
    email: string;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    city: string | null;
    state: string | null;
    postcode: string | null;
  } | null;
}

export function PendingTradieCard({ row }: { row: Row }) {
  const router = useRouter();
  const [busy, setBusy] = useState<"approve" | "reject" | null>(null);
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  async function act(action: "approve" | "reject") {
    setBusy(action);
    try {
      const res = await fetch(`/api/admin/tradies/${row.id}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason: action === "reject" ? reason : undefined,
        }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Failed");
      } else {
        toast.success(action === "approve" ? "Approved." : "Rejected.");
        router.refresh();
      }
    } finally {
      setBusy(null);
    }
  }

  const name =
    row.business_name ??
    [row.profiles?.first_name, row.profiles?.last_name].filter(Boolean).join(" ");
  const photo =
    row.profiles?.avatar_url ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || "Tradie")}&backgroundColor=0A2540&textColor=FFFFFF`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl bg-white border border-navy/8 p-4 sm:p-5 shadow-soft"
    >
      <div className="flex flex-wrap items-start gap-4">
        <img
          src={photo}
          alt=""
          className="w-14 h-14 rounded-2xl object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="font-black text-navy text-lg">{name}</div>
            {row.abn_verified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-success/10 text-success text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3" />
                ABN active
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[10px] font-bold">
                ABN unverified
              </span>
            )}
          </div>
          <div className="text-xs text-navy/55 mt-0.5">
            {row.profiles?.email} ·{" "}
            {row.profiles?.city
              ? `${row.profiles.city}${row.profiles?.state ? ", " + row.profiles.state : ""}${row.profiles?.postcode ? " " + row.profiles.postcode : ""}`
              : "—"}
          </div>
        </div>
        <div className="text-right text-[10px] text-navy/45 font-medium">
          Submitted {new Date(row.created_at).toLocaleDateString("en-AU")}
        </div>
      </div>

      <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
        <Field label="ABN">
          {row.abn} · {row.abn_entity_name ?? "—"}
        </Field>
        <Field label="Trades">
          {row.trade_categories.map(tradeLabel).join(" · ") || "—"}
        </Field>
        <Field label="Rate">
          ${row.hourly_rate_min ?? "—"}–${row.hourly_rate_max ?? "—"} / hr ·{" "}
          {row.years_experience ?? "?"} yrs
        </Field>
        <Field label="Service area">{row.service_radius_km} km radius</Field>
        <Field label="Insurance expiry">
          {row.insurance_expiry
            ? new Date(row.insurance_expiry).toLocaleDateString("en-AU")
            : "—"}
        </Field>
        <Field label="Bio">
          <span className="line-clamp-2">{row.bio ?? "—"}</span>
        </Field>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {row.white_card_url && (
          <a
            href={row.white_card_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/[0.05] hover:bg-navy/[0.10] text-xs font-bold text-navy"
          >
            <FileText className="w-3.5 h-3.5" />
            White card
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {row.insurance_url && (
          <a
            href={row.insurance_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy/[0.05] hover:bg-navy/[0.10] text-xs font-bold text-navy"
          >
            <FileText className="w-3.5 h-3.5" />
            Insurance
            <ExternalLink className="w-3 h-3" />
          </a>
        )}
        {!row.white_card_url && !row.insurance_url && (
          <span className="text-[11px] text-amber-700 font-bold">
            ⚠ No documents uploaded yet
          </span>
        )}
      </div>

      {rejectMode ? (
        <div className="mt-4 space-y-2">
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Why are we rejecting? (sent to the tradie)"
            rows={2}
            className="w-full rounded-xl border-2 border-red-200 bg-red-50 px-3 py-2 text-sm focus:outline-none focus:border-red-400 resize-none"
          />
          <div className="flex gap-2">
            <button
              onClick={() => {
                setRejectMode(false);
                setReason("");
              }}
              className="flex-1 px-4 py-2 rounded-xl border border-navy/15 text-sm font-bold text-navy hover:bg-navy/[0.03]"
            >
              Cancel
            </button>
            <button
              onClick={() => act("reject")}
              disabled={busy !== null}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-bold hover:bg-red-700 disabled:opacity-60"
            >
              {busy === "reject" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <X className="w-4 h-4" /> Confirm reject
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setRejectMode(true)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border-2 border-red-200 text-red-600 text-sm font-bold hover:bg-red-50 min-h-[44px]"
          >
            <X className="w-4 h-4" />
            Reject
          </button>
          <button
            onClick={() => act("approve")}
            disabled={busy !== null}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-success text-white text-sm font-bold hover:bg-success/90 disabled:opacity-60 min-h-[44px]"
          >
            {busy === "approve" ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Check className="w-4 h-4" strokeWidth={3} />
                Approve
              </>
            )}
          </button>
        </div>
      )}
    </motion.div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-navy/[0.03] px-3 py-2">
      <div className="text-[10px] font-bold uppercase tracking-wider text-navy/55">
        {label}
      </div>
      <div className="text-xs text-navy font-semibold mt-0.5 leading-snug">
        {children}
      </div>
    </div>
  );
}
