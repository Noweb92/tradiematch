"use client";

import { motion } from "framer-motion";
import { Undo2, X, Heart } from "lucide-react";
import { cn } from "@/lib/cn";

interface Props {
  onSkip: () => void;
  onMatch: () => void;
  onUndo?: () => void;
  disabled?: boolean;
  canUndo?: boolean;
  matchLabel?: string;
}

export function SwipeActions({
  onSkip,
  onMatch,
  onUndo,
  disabled,
  canUndo,
  matchLabel,
}: Props) {
  return (
    <div className="max-w-md mx-auto px-5 pt-6 pb-8">
      <div className="flex items-center justify-center gap-3">
        {onUndo && (
          <ActionButton
            onClick={onUndo}
            disabled={!canUndo}
            color="amber"
            size="sm"
            label="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </ActionButton>
        )}
        <ActionButton
          onClick={onSkip}
          disabled={disabled}
          color="red"
          size="lg"
          label="Skip"
        >
          <X className="w-7 h-7" strokeWidth={3} />
        </ActionButton>
        <ActionButton
          onClick={onMatch}
          disabled={disabled}
          color="green"
          size="lg"
          label={matchLabel ?? "Match"}
        >
          <Heart className="w-7 h-7 fill-current" />
        </ActionButton>
      </div>
      <div className="text-center mt-4 text-xs text-navy/50 font-medium">
        Swipe left to skip · right to match
      </div>
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
  color: "red" | "green" | "amber";
  size: "sm" | "lg";
  label: string;
}) {
  const sizeMap = {
    sm: "w-11 h-11",
    lg: "w-16 h-16",
  };
  const colorMap = {
    red: "bg-white text-red-500 border-red-100 hover:border-red-300 shadow-[0_8px_24px_-8px_rgba(239,68,68,0.4)]",
    green:
      "bg-white text-success border-green-100 hover:border-green-300 shadow-[0_8px_24px_-8px_rgba(0,200,83,0.4)]",
    amber:
      "bg-white text-amber-500 border-amber-100 hover:border-amber-300",
  };
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      whileHover={{ y: -2 }}
      aria-label={label}
      className={cn(
        "rounded-full grid place-items-center border-2 transition-all disabled:opacity-30 disabled:cursor-not-allowed",
        sizeMap[size],
        colorMap[color],
      )}
    >
      {children}
    </motion.button>
  );
}
