"use client";

import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

interface Props {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  format?: "number" | "compact" | "money" | "moneyK" | "percent";
  className?: string;
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1.6,
  format = "number",
  className,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setDisplay(0);
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
    // run once on mount per value change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const fmt = (n: number) => {
    if (format === "compact") {
      if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
      return Math.round(n).toString();
    }
    if (format === "moneyK") return `$${Math.round(n)}K`;
    if (format === "money") return `$${Math.round(n).toLocaleString("en-US")}`;
    if (format === "percent") return `${n.toFixed(decimals)}%`;
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {prefix}
      {fmt(display)}
      {suffix}
    </span>
  );
}
