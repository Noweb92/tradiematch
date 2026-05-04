"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Undo2, X, Star, Heart, MapPin, SlidersHorizontal } from "lucide-react";
import { TRADIES } from "@/lib/mockData";
import { SwipeCard } from "@/components/SwipeCard";
import { MatchOverlay } from "@/components/MatchOverlay";
import { cn } from "@/lib/cn";

type Direction = "left" | "right" | "up";

export default function SwipePage() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<{ id: string; dir: Direction }[]>([]);
  const [matched, setMatched] = useState<string | null>(null);

  const remaining = useMemo(() => TRADIES.slice(index, index + 3), [index]);

  const handleSwipe = (dir: Direction) => {
    const tradie = TRADIES[index];
    setHistory((h) => [...h, { id: tradie.id, dir }]);
    if (dir === "right" || dir === "up") {
      setMatched(tradie.id);
    }
    setIndex((i) => Math.min(i + 1, TRADIES.length));
  };

  const handleUndo = () => {
    if (index === 0) return;
    setIndex((i) => i - 1);
    setHistory((h) => h.slice(0, -1));
  };

  const trigger = (dir: Direction) => {
    if (index >= TRADIES.length) return;
    handleSwipe(dir);
  };

  const matchTradie = matched ? TRADIES.find((t) => t.id === matched) : null;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-orange-50/50 via-white to-white overflow-hidden">
      {/* Top header */}
      <div className="px-5 pt-6 pb-4 max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-navy/50 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" />
              Sydney · 5km
            </div>
            <h1 className="text-2xl font-black tracking-tight mt-0.5 tabular-nums">
              {TRADIES.length - index} tradies in your area
            </h1>
          </div>
          <button className="w-10 h-10 rounded-full bg-white border border-navy/10 grid place-items-center hover:bg-navy/[0.03] btn-press shadow-soft">
            <SlidersHorizontal className="w-4 h-4 text-navy" />
          </button>
        </div>

        {/* filter chips */}
        <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar">
          {["All trades", "$$ Affordable", "4.8★+", "Available today", "ABN verified"].map(
            (chip, i) => (
              <button
                key={chip}
                className={cn(
                  "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold border transition-all",
                  i === 0
                    ? "bg-navy text-white border-navy"
                    : "bg-white text-navy/70 border-navy/10 hover:border-navy/25"
                )}
              >
                {chip}
              </button>
            )
          )}
        </div>
      </div>

      {/* card stack */}
      <div className="relative max-w-md mx-auto px-5">
        <div className="relative w-full aspect-[3/4.4] max-h-[640px]">
          {index >= TRADIES.length ? (
            <EmptyState onReset={() => { setIndex(0); setHistory([]); }} />
          ) : (
            <AnimatePresence>
              {remaining
                .slice()
                .reverse()
                .map((tradie, i) => {
                  const stackIndex = remaining.length - 1 - i;
                  return (
                    <SwipeCard
                      key={tradie.id}
                      tradie={tradie}
                      active={stackIndex === 0}
                      offset={stackIndex}
                      zIndex={10 - stackIndex}
                      onSwipe={handleSwipe}
                    />
                  );
                })}
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* action buttons */}
      <div className="max-w-md mx-auto px-5 pt-6 pb-8">
        <div className="flex items-center justify-center gap-3">
          <ActionButton
            onClick={handleUndo}
            disabled={index === 0}
            color="amber"
            size="sm"
            label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </ActionButton>
          <ActionButton
            onClick={() => trigger("left")}
            color="red"
            size="lg"
            label="Skip"
          >
            <X className="w-7 h-7" strokeWidth={3} />
          </ActionButton>
          <ActionButton
            onClick={() => trigger("up")}
            color="orange"
            size="md"
            label="Super"
          >
            <Star className="w-5 h-5 fill-current" />
          </ActionButton>
          <ActionButton
            onClick={() => trigger("right")}
            color="green"
            size="lg"
            label="Match"
          >
            <Heart className="w-7 h-7 fill-current" />
          </ActionButton>
          <ActionButton color="blue" size="sm" label="Boost">
            <span className="text-base font-black">⚡</span>
          </ActionButton>
        </div>

        <div className="text-center mt-5 text-xs text-navy/50 font-medium">
          Swipe right to match · Swipe up for super-like · Tap to view profile
        </div>
      </div>

      {/* match overlay */}
      <AnimatePresence>
        {matchTradie && (
          <MatchOverlay
            tradie={matchTradie}
            onClose={() => setMatched(null)}
            onMessage={() => router.push("/chat")}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  color,
  size,
  label,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  color: "red" | "green" | "orange" | "amber" | "blue";
  size: "sm" | "md" | "lg";
  label: string;
}) {
  const sizeMap = {
    sm: "w-11 h-11",
    md: "w-14 h-14",
    lg: "w-16 h-16",
  };
  const colorMap = {
    red: "bg-white text-red-500 border-red-100 hover:border-red-300 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.4)]",
    green: "bg-white text-success border-green-100 hover:border-green-300 shadow-[0_8px_24px_-8px_rgba(0,200,83,0.4)]",
    orange: "bg-white text-orange border-orange-100 hover:border-orange-300 shadow-[0_8px_24px_-8px_rgba(255,107,53,0.4)]",
    amber: "bg-white text-amber-500 border-amber-100 hover:border-amber-300",
    blue: "bg-white text-sky-500 border-sky-100 hover:border-sky-300",
  };
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2 }}
      aria-label={label}
      className={cn(
        "rounded-full grid place-items-center border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        sizeMap[size],
        colorMap[color]
      )}
    >
      {children}
    </motion.button>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-navy to-navy-700 grid place-items-center text-white p-8 text-center">
      <div>
        <div className="text-5xl mb-3">🎉</div>
        <h3 className="text-2xl font-black tracking-tight">
          You&apos;ve seen everyone!
        </h3>
        <p className="text-white/70 mt-2 text-sm">
          Check your matches or expand your search radius.
        </p>
        <button
          onClick={onReset}
          className="mt-6 px-5 py-2.5 rounded-xl bg-orange hover:bg-orange-600 font-bold text-sm btn-press"
        >
          Start over
        </button>
      </div>
    </div>
  );
}
