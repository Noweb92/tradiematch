"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";
import { QuoteModal } from "./QuoteModal";

export function TradieMatchActions({ matchId }: { matchId: string }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1.5">
        <button
          onClick={() => setOpen(true)}
          className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange text-white text-xs font-bold shadow-glow btn-press"
        >
          <Receipt className="w-3.5 h-3.5" />
          Send quote
        </button>
        <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/[0.06] text-navy text-xs font-bold hover:bg-navy/[0.10]">
          📅 Schedule visit
        </button>
        <button className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-navy/[0.06] text-navy text-xs font-bold hover:bg-navy/[0.10]">
          📷 Send photo
        </button>
      </div>
      <QuoteModal open={open} matchId={matchId} onClose={() => setOpen(false)} />
    </>
  );
}
