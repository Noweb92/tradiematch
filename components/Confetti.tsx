"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const COLORS = ["#FF6B35", "#FFD700", "#00C853", "#FFFFFF", "#FF8E5C"];

interface Piece {
  id: number;
  x: number;
  delay: number;
  duration: number;
  rotate: number;
  size: number;
  color: string;
  shape: "circle" | "square";
  drift: number;
}

export function Confetti({ count = 60 }: { count?: number }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    setPieces(
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.6,
        duration: 2.5 + Math.random() * 2,
        rotate: Math.random() * 720 - 360,
        size: 6 + Math.random() * 8,
        color: COLORS[i % COLORS.length],
        shape: Math.random() > 0.5 ? "square" : "circle",
        drift: (Math.random() - 0.5) * 80,
      }))
    );
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          initial={{ x: `${p.x}vw`, y: -40, rotate: 0, opacity: 0 }}
          animate={{
            x: `${p.x + p.drift / 10}vw`,
            y: "110vh",
            rotate: p.rotate,
            opacity: [0, 1, 1, 1, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: "easeIn",
            repeat: Infinity,
            repeatDelay: 1.2,
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.shape === "circle" ? "50%" : "2px",
            boxShadow: `0 0 8px ${p.color}55`,
          }}
        />
      ))}
    </div>
  );
}
