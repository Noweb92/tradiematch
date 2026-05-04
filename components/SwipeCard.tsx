"use client";

import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import {
  Star,
  ShieldCheck,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  BadgeCheck,
  Quote,
  Calendar,
} from "lucide-react";
import type { Tradie } from "@/lib/mockData";

type Direction = "left" | "right" | "up";

interface Props {
  tradie: Tradie;
  active: boolean;
  zIndex: number;
  offset: number;
  onSwipe: (dir: Direction) => void;
}

export function SwipeCard({ tradie, active, zIndex, offset, onSwipe }: Props) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-18, 18]);
  const likeOpacity = useTransform(x, [20, 140], [0, 1]);
  const nopeOpacity = useTransform(x, [-140, -20], [1, 0]);
  const superOpacity = useTransform(y, [-140, -20], [1, 0]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const sx = info.offset.x;
    const sy = info.offset.y;
    const vx = info.velocity.x;
    if (sy < -120 && Math.abs(sx) < 100) {
      onSwipe("up");
    } else if (sx > 120 || vx > 600) {
      onSwipe("right");
    } else if (sx < -120 || vx < -600) {
      onSwipe("left");
    }
  };

  const stackScale = 1 - offset * 0.04;
  const stackY = offset * 12;

  const availColor =
    tradie.availability === "Available now"
      ? "bg-success text-white"
      : tradie.availability === "Available this week"
      ? "bg-success/90 text-white"
      : "bg-amber-500/95 text-white";

  return (
    <motion.div
      className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
      style={{
        x: active ? x : 0,
        y: active ? y : stackY,
        rotate: active ? rotate : 0,
        scale: active ? 1 : stackScale,
        zIndex,
      }}
      drag={active}
      dragElastic={0.6}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      initial={false}
    >
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-navy shadow-card select-none">
        <img
          src={tradie.photo}
          alt={tradie.name}
          draggable={false}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/40 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          <div className="flex flex-wrap gap-1.5 max-w-[75%]">
            {tradie.badges.abn && (
              <Badge color="success" icon={<BadgeCheck className="w-3 h-3" />}>
                ABN
              </Badge>
            )}
            {tradie.badges.whiteCard && (
              <Badge color="white" icon={<ShieldCheck className="w-3 h-3" />}>
                White card
              </Badge>
            )}
            {tradie.badges.insurance && <Badge color="navy">$20M insured</Badge>}
            {tradie.badges.police && <Badge color="navy">Police ✓</Badge>}
          </div>
          <div
            className={`shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${availColor} shadow-lg`}
          >
            <Calendar className="w-3 h-3" />
            <span className="whitespace-nowrap">{tradie.availability}</span>
          </div>
        </div>

        {/* like / nope overlays */}
        {active && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-20 right-6 px-4 py-2 rounded-2xl border-4 border-success bg-success/10 backdrop-blur-sm rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-success tracking-tight">
                MATCH
              </span>
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-20 left-6 px-4 py-2 rounded-2xl border-4 border-red-500 bg-red-500/10 backdrop-blur-sm -rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-red-500 tracking-tight">
                SKIP
              </span>
            </motion.div>
            <motion.div
              style={{ opacity: superOpacity }}
              className="absolute top-20 left-1/2 -translate-x-1/2 px-4 py-2 rounded-2xl border-4 border-orange bg-orange/10 backdrop-blur-sm pointer-events-none"
            >
              <span className="text-3xl font-black text-orange tracking-tight">
                SUPER ⭐
              </span>
            </motion.div>
          </>
        )}

        {/* portfolio strip — 4 thumbs */}
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
          {tradie.portfolio.slice(0, 4).map((p, i) => (
            <motion.div
              key={i}
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.05 * i + 0.1 }}
              className="w-12 h-12 rounded-xl border-2 border-white/40 overflow-hidden shadow-lg backdrop-blur-sm"
            >
              <img
                src={p}
                alt=""
                draggable={false}
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
        </div>

        {/* bottom info */}
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 text-white">
          {/* Featured review pill */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-3 mr-16 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 px-3 py-2"
          >
            <div className="flex items-start gap-2">
              <Quote className="w-3.5 h-3.5 text-orange-300 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-[12px] leading-snug text-white/95 line-clamp-2 italic">
                  &ldquo;{tradie.featuredReview.text}&rdquo;
                </div>
                <div className="text-[10px] text-orange-200 font-semibold mt-1">
                  — {tradie.featuredReview.author}, {tradie.featuredReview.suburb}
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-none">
                  {tradie.name}
                </h2>
                <BadgeCheck
                  className="w-5 h-5 text-orange shrink-0 drop-shadow"
                  fill="currentColor"
                />
              </div>
              <div className="text-orange-300 font-semibold mt-1.5 text-sm">
                {tradie.trade} · {tradie.suburb}, {tradie.city}
              </div>
            </div>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/15 backdrop-blur shrink-0">
              <Star className="w-3.5 h-3.5 fill-orange text-orange" />
              <span className="text-sm font-bold tabular-nums">
                {tradie.rating}
              </span>
              <span className="text-[10px] text-white/60 tabular-nums">
                ({tradie.reviews})
              </span>
            </div>
          </div>

          <p className="text-white/85 text-xs sm:text-sm leading-snug mt-2 line-clamp-2">
            {tradie.bio}
          </p>

          <div className="grid grid-cols-4 gap-1.5 mt-3">
            <Stat
              icon={<Briefcase className="w-3 h-3" />}
              value={`${tradie.yearsExp}y`}
              label="exp"
            />
            <Stat
              icon={<MapPin className="w-3 h-3" />}
              value={`${tradie.distanceKm}km`}
              label="away"
            />
            <Stat
              icon={<DollarSign className="w-3 h-3" />}
              value={`$${tradie.hourlyRate}`}
              label="/hr"
            />
            <Stat
              icon={<Clock className="w-3 h-3" />}
              value={`${tradie.jobsDone}`}
              label="jobs"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Badge({
  color,
  icon,
  children,
}: {
  color: "success" | "white" | "navy";
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const map = {
    success: "bg-success/95 text-white",
    white: "bg-white/95 text-navy",
    navy: "bg-navy/80 text-white backdrop-blur",
  } as const;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${map[color]}`}
    >
      {icon}
      {children}
    </span>
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
    <div className="rounded-lg bg-white/10 backdrop-blur px-2 py-1.5 border border-white/10">
      <div className="text-white/70 flex items-center gap-1 text-[9px] uppercase tracking-wide font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-white font-black text-sm sm:text-base mt-0.5 tabular-nums">
        {value}
      </div>
    </div>
  );
}
