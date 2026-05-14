"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import {
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  DollarSign,
  BadgeCheck,
} from "lucide-react";
import { tradeLabel } from "@/lib/constants/trades";
import type { TradieCard } from "@/lib/matching/types";

interface Props {
  tradie: TradieCard;
  active: boolean;
  zIndex: number;
  offset: number;
  onSwipe: (dir: "left" | "right") => void;
}

export function TradieSwipeCard({ tradie, active, zIndex, offset, onSwipe }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const sx = info.offset.x;
    const vx = info.velocity.x;
    if (sx > 120 || vx > 600) onSwipe("right");
    else if (sx < -120 || vx < -600) onSwipe("left");
  }

  const stackScale = 1 - offset * 0.04;
  const stackY = offset * 12;

  const name = [tradie.first_name, tradie.last_name].filter(Boolean).join(" ");
  const photo =
    tradie.avatar_url ??
    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || tradie.business_name || "Tradie")}&backgroundColor=0A2540&textColor=FFFFFF`;

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{
        x: active ? x : 0,
        y: active ? 0 : stackY,
        rotate: active ? rotate : 0,
        scale: active ? 1 : stackScale,
        zIndex,
      }}
      drag={active ? "x" : false}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      initial={false}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-navy shadow-card select-none">
        <img
          src={photo}
          alt={name || "Tradie"}
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-success/95 text-white text-[10px] font-bold">
            <BadgeCheck className="w-3 h-3" />
            ABN verified
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-white/95 text-navy text-[10px] font-bold">
            <ShieldCheck className="w-3 h-3" />
            Insured
          </span>
        </div>

        {/* Overlays */}
        {active && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-20 right-6 px-4 py-2 rounded-2xl border-4 border-success bg-success/10 backdrop-blur-sm rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-success">MATCH</span>
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-20 left-6 px-4 py-2 rounded-2xl border-4 border-red-500 bg-red-500/10 backdrop-blur-sm -rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-red-500">SKIP</span>
            </motion.div>
          </>
        )}

        {/* Portfolio strip */}
        {tradie.portfolio.length > 0 && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
            {tradie.portfolio.slice(0, 3).map((p, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-xl border-2 border-white/40 overflow-hidden shadow-lg"
              >
                <img src={p} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  {tradie.business_name ?? name ?? "Tradie"}
                </h2>
                <BadgeCheck className="w-5 h-5 text-orange shrink-0" fill="currentColor" />
              </div>
              <div className="text-orange-300 font-semibold mt-1.5 text-sm">
                {tradie.trade_categories.slice(0, 2).map(tradeLabel).join(" · ")}
                {tradie.city ? ` · ${tradie.city}` : ""}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur shrink-0">
              <Star className="w-3.5 h-3.5 fill-orange text-orange" />
              <span className="text-sm font-bold tabular-nums">
                {tradie.rating_average?.toFixed(1) ?? "—"}
              </span>
              <span className="text-[10px] text-white/60">
                ({tradie.rating_count ?? 0})
              </span>
            </div>
          </div>

          {tradie.bio && (
            <p className="text-white/85 text-sm leading-snug mt-3 line-clamp-2">
              {tradie.bio}
            </p>
          )}

          <div className="grid grid-cols-4 gap-2 mt-4">
            <Stat
              icon={<Briefcase className="w-3.5 h-3.5" />}
              value={tradie.years_experience != null ? `${tradie.years_experience}y` : "—"}
              label="exp"
            />
            <Stat
              icon={<MapPin className="w-3.5 h-3.5" />}
              value={tradie.distance_km != null ? `${tradie.distance_km.toFixed(1)}km` : "—"}
              label="away"
            />
            <Stat
              icon={<DollarSign className="w-3.5 h-3.5" />}
              value={
                tradie.hourly_rate_min != null
                  ? `$${tradie.hourly_rate_min}`
                  : "—"
              }
              label="/hr"
            />
            <Stat
              icon={<Star className="w-3.5 h-3.5" />}
              value={`${Math.round(tradie.response_rate)}%`}
              label="resp"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/10 backdrop-blur px-2.5 py-2 border border-white/10">
      <div className="text-white/70 flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white font-black text-base mt-0.5 tabular-nums">{value}</div>
    </div>
  );
}
