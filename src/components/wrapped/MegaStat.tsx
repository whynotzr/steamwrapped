"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { CountUp } from "./CountUp";

interface MegaStatProps {
  value: number;
  suffix?: string;
  label?: string;
  sublabel?: string;
  active?: boolean;
  variant?: "default" | "gold" | "cyan";
}

export function MegaStat({
  value,
  suffix = "",
  label,
  sublabel,
  active = true,
  variant = "default",
}: MegaStatProps) {
  const glowClass =
    variant === "gold"
      ? "wow-stat-gold"
      : variant === "cyan"
        ? "wow-stat-cyan"
        : "wow-stat-default";

  if (!active) return null;

  const digits = String(value).replace(/\s/g, "").length;
  const sizeClass =
    digits >= 6
      ? "text-5xl sm:text-6xl md:text-7xl"
      : digits >= 5
        ? "text-6xl sm:text-7xl md:text-8xl"
        : "text-7xl sm:text-8xl md:text-9xl";

  return (
    <div className="text-center">
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-2 text-[11px] font-bold uppercase tracking-[0.4em] text-white/45"
        >
          {label}
        </motion.p>
      )}
      <motion.div
        initial={{ scale: 0.5, opacity: 0, filter: "blur(20px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
        transition={{
          type: "spring",
          stiffness: 180,
          damping: 14,
          delay: 0.15,
        }}
        className={`${glowClass} ${sizeClass} font-black leading-none tracking-tighter tabular-nums`}
      >
        <CountUp key={value} value={value} duration={1800} />
        {suffix && (
          <span className="text-[#5ce1e6]">{suffix}</span>
        )}
      </motion.div>
      {sublabel && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-4 text-base text-white/55 sm:text-lg"
        >
          {sublabel}
        </motion.p>
      )}
    </div>
  );
}

export function WowFlexSlide({
  emoji,
  headline,
  stat,
  statLabel,
  punchline,
}: {
  emoji: string;
  headline: string;
  stat: ReactNode;
  statLabel: string;
  punchline: string;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <motion.span
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        className="mb-6 text-8xl drop-shadow-[0_0_60px_rgba(255,200,87,0.5)]"
      >
        {emoji}
      </motion.span>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-sm font-bold uppercase tracking-[0.35em] text-[#ffc857]"
      >
        {headline}
      </motion.p>

      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 150, damping: 12, delay: 0.45 }}
        className="wow-stat-gold my-6 text-7xl font-black sm:text-8xl md:text-9xl"
      >
        {stat}
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-lg font-bold text-white/80"
      >
        {statLabel}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="mt-4 max-w-sm text-sm italic text-white/45"
      >
        {punchline}
      </motion.p>
    </div>
  );
}
