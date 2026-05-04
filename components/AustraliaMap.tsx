"use client";

import { motion } from "framer-motion";
import { CITY_HEAT } from "@/lib/mockData";

// Stylised Australia outline path (simplified). Coordinates roughly map to a
// 100×100 viewBox so we can position city dots in % easily.
const AU_PATH =
  "M14,52 C12,46 10,40 14,34 C18,30 22,26 28,22 C34,18 42,14 50,12 C56,10 62,11 68,14 C74,16 80,20 84,26 C88,32 90,38 89,44 C92,46 94,50 92,55 C90,60 86,62 82,60 C80,66 76,72 70,76 C66,82 60,86 54,86 C50,90 44,92 38,90 C32,89 28,84 26,78 C20,76 16,70 14,64 C12,60 13,56 14,52 Z";

export function AustraliaMap() {
  return (
    <div className="relative w-full aspect-[1.05/1] rounded-2xl bg-gradient-to-br from-navy to-navy-700 overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-20" />
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        <div>
          <div className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
            Live activity
          </div>
          <div className="text-white font-black text-lg leading-tight mt-0.5">
            Australia
          </div>
        </div>
        <div className="px-2 py-1 rounded-full bg-success/95 text-[10px] font-bold flex items-center gap-1 text-white">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          Live
        </div>
      </div>

      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 w-full h-full p-6"
      >
        <defs>
          <linearGradient id="mapFill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0.04" />
          </linearGradient>
          <radialGradient id="cityGlow">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#FF6B35" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path
          d={AU_PATH}
          fill="url(#mapFill)"
          stroke="rgba(255,107,53,0.5)"
          strokeWidth="0.4"
          strokeDasharray="0.8 0.8"
        />

        {/* Glow halos */}
        {CITY_HEAT.map((c) => (
          <circle
            key={`glow-${c.city}`}
            cx={c.x}
            cy={c.y}
            r={6 + c.intensity * 7}
            fill="url(#cityGlow)"
            opacity={c.intensity}
          />
        ))}

        {/* Pulse rings */}
        {CITY_HEAT.slice(0, 4).map((c) => (
          <motion.circle
            key={`pulse-${c.city}`}
            cx={c.x}
            cy={c.y}
            r="1"
            fill="none"
            stroke="#FF6B35"
            strokeWidth="0.4"
            initial={{ r: 0.5, opacity: 0.8 }}
            animate={{ r: 6 + c.intensity * 4, opacity: 0 }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: Math.random() * 1.5,
            }}
          />
        ))}

        {/* Dots */}
        {CITY_HEAT.map((c, i) => (
          <g key={c.city}>
            <motion.circle
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              cx={c.x}
              cy={c.y}
              r={1 + c.intensity * 1.4}
              fill="#FF6B35"
              stroke="white"
              strokeWidth="0.3"
            />
          </g>
        ))}
      </svg>

      {/* City labels */}
      {CITY_HEAT.filter((c) => c.intensity >= 0.5).map((c, i) => (
        <motion.div
          key={`label-${c.city}`}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.06 }}
          className="absolute text-[10px] font-bold text-white pointer-events-none"
          style={{
            left: `calc(${c.x}% + 12px)`,
            top: `calc(${c.y}% - 6px)`,
          }}
        >
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-md px-1.5 py-0.5 leading-none">
            <div className="text-white">{c.city}</div>
            <div className="text-orange-300 text-[9px] mt-0.5">
              {c.count.toLocaleString("en-US")}
            </div>
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] text-white/60 font-medium">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange/30" />
            <span>Low</span>
          </div>
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-orange/30 via-orange/60 to-orange" />
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-orange" />
            <span>High</span>
          </div>
        </div>
        <div className="text-[10px] text-white/55 font-medium">
          8 metros · 12,272 active
        </div>
      </div>
    </div>
  );
}
