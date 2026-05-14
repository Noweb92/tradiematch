"use client";

import { motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Clock,
  Zap,
  CalendarRange,
} from "lucide-react";
import { tradeLabel } from "@/lib/constants/trades";
import type { JobCard } from "@/lib/matching/types";

interface Props {
  job: JobCard;
  active: boolean;
  zIndex: number;
  offset: number;
  onSwipe: (dir: "left" | "right") => void;
}

const URGENCY_STYLES: Record<JobCard["urgency"], { color: string; icon: React.ReactNode; label: string }> = {
  asap: {
    color: "bg-red-500 text-white",
    icon: <Zap className="w-3 h-3" />,
    label: "ASAP",
  },
  within_week: {
    color: "bg-amber-500 text-white",
    icon: <Clock className="w-3 h-3" />,
    label: "This week",
  },
  flexible: {
    color: "bg-success text-white",
    icon: <CalendarRange className="w-3 h-3" />,
    label: "Flexible",
  },
};

export function JobSwipeCard({ job, active, zIndex, offset, onSwipe }: Props) {
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
  const urgency = URGENCY_STYLES[job.urgency];

  const headerImage = job.photos[0];

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
      <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white shadow-card border border-navy/8 select-none flex flex-col">
        {/* Photo header (or fallback) */}
        <div className="relative h-44 sm:h-52 shrink-0 bg-gradient-to-br from-navy to-navy-700">
          {headerImage ? (
            <img
              src={headerImage}
              alt=""
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 dot-grid opacity-30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${urgency.color} shadow-lg`}
            >
              {urgency.icon}
              {urgency.label}
            </span>
            {job.photos.length > 1 && (
              <span className="px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-bold backdrop-blur">
                +{job.photos.length - 1} photo{job.photos.length - 1 === 1 ? "" : "s"}
              </span>
            )}
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-white/85">
              {tradeLabel(job.trade_category)}
            </div>
            <div className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5 line-clamp-1">
              {job.title}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 p-4 sm:p-5 overflow-hidden">
          <p className="text-sm text-navy/75 leading-relaxed line-clamp-4">
            {job.description}
          </p>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <Info
              icon={<MapPin className="w-3.5 h-3.5" />}
              label="Location"
              value={
                job.distance_km != null
                  ? `${job.distance_km.toFixed(1)} km away`
                  : job.customer_city ?? "—"
              }
            />
            <Info
              icon={<DollarSign className="w-3.5 h-3.5" />}
              label="Budget"
              value={
                job.budget_min || job.budget_max
                  ? `$${job.budget_min ?? 0} – $${job.budget_max ?? "?"}`
                  : "Not specified"
              }
            />
          </div>

          {job.customer_first_name && (
            <div className="mt-4 pt-3 border-t border-navy/8 text-xs text-navy/55">
              Posted by <span className="font-bold text-navy">{job.customer_first_name}</span>{" "}
              · {new Date(job.created_at).toLocaleDateString("en-AU")}
            </div>
          )}
        </div>

        {/* Overlays */}
        {active && (
          <>
            <motion.div
              style={{ opacity: likeOpacity }}
              className="absolute top-24 right-6 px-4 py-2 rounded-2xl border-4 border-success bg-success/10 backdrop-blur-sm rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-success">QUOTE</span>
            </motion.div>
            <motion.div
              style={{ opacity: nopeOpacity }}
              className="absolute top-24 left-6 px-4 py-2 rounded-2xl border-4 border-red-500 bg-red-500/10 backdrop-blur-sm -rotate-12 pointer-events-none"
            >
              <span className="text-3xl font-black text-red-500">PASS</span>
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function Info({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-navy/[0.04] px-3 py-2">
      <div className="text-navy/55 flex items-center gap-1 text-[10px] uppercase tracking-wide font-bold">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-navy font-bold text-sm mt-0.5 truncate">{value}</div>
    </div>
  );
}
