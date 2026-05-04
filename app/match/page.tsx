"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MessageCircle, ChevronRight, Star } from "lucide-react";
import { TRADIES, CHATS } from "@/lib/mockData";
import { MatchOverlay } from "@/components/MatchOverlay";

export default function MatchPage() {
  const [previewId, setPreviewId] = useState<string | null>(TRADIES[0].id);
  const matched = TRADIES.filter((t) =>
    CHATS.some((c) => c.tradieId === t.id)
  ).concat(TRADIES.slice(2, 6));

  const preview = previewId ? TRADIES.find((t) => t.id === previewId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-orange-50/30 to-white">
      <div className="max-w-3xl mx-auto px-5 py-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-orange flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              {matched.length} matches
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-1">
              Your matches
            </h1>
          </div>
          <button
            onClick={() => setPreviewId(TRADIES[0].id)}
            className="px-4 py-2 rounded-xl bg-orange text-white text-sm font-bold shadow-glow btn-press"
          >
            Replay match 🎉
          </button>
        </div>

        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {matched.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="group relative rounded-2xl bg-white border border-navy/8 overflow-hidden hover:shadow-card transition-all"
            >
              <div className="flex">
                <div className="relative w-24 h-32 shrink-0">
                  <img
                    src={t.photo}
                    alt={t.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="font-bold text-navy truncate">
                        {t.name}
                      </div>
                      <div className="text-xs text-navy/55 font-semibold">
                        {t.trade} · {t.suburb}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 shrink-0">
                      <Star className="w-3 h-3 fill-orange text-orange" />
                      <span className="text-xs font-bold">{t.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-navy/60 line-clamp-2 mt-2 leading-snug">
                    {t.bio}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-[10px] text-success font-bold uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      New match
                    </div>
                    <Link
                      href="/chat"
                      className="text-xs font-bold text-orange flex items-center gap-0.5 group-hover:gap-1.5 transition-all"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      Message
                      <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {preview && (
          <MatchOverlay
            tradie={preview}
            onClose={() => setPreviewId(null)}
            onMessage={() => setPreviewId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
