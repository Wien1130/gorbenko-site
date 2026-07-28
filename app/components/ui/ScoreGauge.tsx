"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import Counter from "./Counter";

/** Animated Lighthouse-style circular score gauge (0-100). */
export default function ScoreGauge({
  score,
  label,
  size = 110,
}: {
  score: number;
  label: string;
  size?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();

  const color = score >= 90 ? "#00d4aa" : score >= 50 ? "#fbbf24" : "#fb7185";
  const r = size / 2 - 6;
  const circumference = 2 * Math.PI * r;

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeOpacity={0.12}
            strokeWidth={7}
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: reduce ? circumference * (1 - score / 100) : circumference }}
            animate={
              inView
                ? { strokeDashoffset: circumference * (1 - score / 100) }
                : undefined
            }
            transition={{ duration: 1.4, ease: "easeOut" }}
          />
        </svg>
        <div
          className="absolute inset-0 flex items-center justify-center font-display text-2xl font-bold"
          style={{ color }}
        >
          <Counter value={score} duration={1.4} />
        </div>
      </div>
      <p className="text-xs text-[var(--muted)]">{label}</p>
    </div>
  );
}
