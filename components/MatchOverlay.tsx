"use client";

import { motion } from "framer-motion";
import { MessageCircle, ArrowRight } from "lucide-react";
import type { Tradie } from "@/lib/mockData";
import { Confetti } from "./Confetti";

const CUSTOMER_PHOTO =
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80";

export function MatchOverlay({
  tradie,
  onClose,
  onMessage,
}: {
  tradie: Tradie;
  onClose: () => void;
  onMessage: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-[100] grid place-items-center p-6"
    >
      {/* dim + gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange via-orange-600 to-navy" />
      <div className="absolute inset-0 dot-grid opacity-30" />
      <Confetti />

      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 22 }}
        className="relative text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.05 }}
          className="text-white text-xs uppercase font-black tracking-[0.3em] mb-2"
        >
          ★ ★ ★ ★ ★
        </motion.div>
        <h1 className="text-6xl md:text-7xl font-black tracking-tight text-white drop-shadow-xl leading-[0.9]">
          It&apos;s a
          <br />
          <span className="text-white italic">Match!</span>
        </h1>
        <p className="text-white/85 mt-4 text-base md:text-lg font-medium">
          You and{" "}
          <span className="font-black">{tradie.name.split(" ")[0]}</span>{" "}
          are about to build something great.
        </p>

        {/* avatars */}
        <div className="mt-10 flex items-center justify-center gap-3 relative">
          <motion.div
            initial={{ x: -60, opacity: 0, rotate: -10 }}
            animate={{ x: 0, opacity: 1, rotate: -6 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl"
          >
            <img
              src={CUSTOMER_PHOTO}
              alt="You"
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.45, type: "spring", stiffness: 200 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white grid place-items-center shadow-2xl z-10"
          >
            <span className="text-3xl">❤️</span>
          </motion.div>

          <motion.div
            initial={{ x: 60, opacity: 0, rotate: 10 }}
            animate={{ x: 0, opacity: 1, rotate: 6 }}
            transition={{ delay: 0.25, type: "spring", stiffness: 150 }}
            className="w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-white shadow-2xl"
          >
            <img
              src={tradie.photo}
              alt={tradie.name}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-10 space-y-3"
        >
          <button
            onClick={onMessage}
            className="group w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white text-navy font-black rounded-xl shadow-2xl btn-press hover:bg-orange-50 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Send first message
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
          <button
            onClick={onClose}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/25 text-white font-bold rounded-xl btn-press transition-all"
          >
            Keep swiping
          </button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
