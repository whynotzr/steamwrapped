"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CinematicSlideProps {
  children: ReactNode;
  backgroundImage?: string;
  tint?: "steam" | "dark" | "warm" | "cool" | "gold" | "purple";
  align?: "center" | "bottom";
  glow?: "blue" | "gold" | "purple" | "none";
}

const TINTS = {
  steam:
    "from-[#0a1018]/96 via-[#152535]/80 to-[#0a1018]/98",
  dark: "from-black/94 via-black/78 to-black/96",
  warm: "from-[#180600]/94 via-[#2d1808]/72 to-black/96",
  cool: "from-[#040c14]/94 via-[#0a1e30]/78 to-black/96",
  gold: "from-[#140e00]/92 via-[#2a2008]/72 to-black/96",
  purple: "from-[#0c0618]/94 via-[#1a0e30]/75 to-black/96",
};

const GLOW_COLORS = {
  blue: "rgba(102,192,244,0.22)",
  gold: "rgba(255,200,87,0.18)",
  purple: "rgba(168,120,255,0.2)",
  none: "transparent",
};

export function CinematicSlide({
  children,
  backgroundImage,
  tint = "steam",
  align = "center",
  glow = "blue",
}: CinematicSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.02 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98, filter: "blur(6px)" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative flex min-h-dvh w-full overflow-hidden"
    >
      {backgroundImage ? (
        <div className="absolute inset-0 overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={backgroundImage}
            alt=""
            className="animate-ken-burns h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-[#0a1018]" />
      )}

      <div className={`absolute inset-0 bg-gradient-to-b ${TINTS[tint]}`} />
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-[100px]"
        style={{ background: GLOW_COLORS[glow] }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(102,192,244,0.12),transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,rgba(0,0,0,0.65)_100%)]" />

      <div className="absolute top-0 left-0 right-0 z-20 h-[2px] bg-gradient-to-r from-transparent via-[#66c0f4]/70 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div
        className={`grain relative z-10 flex min-h-dvh w-full flex-col px-6 py-24 sm:px-10 ${
          align === "center"
            ? "items-center justify-center"
            : "items-start justify-end pb-28 sm:pb-36"
        }`}
      >
        <div className="w-full max-w-lg">{children}</div>
      </div>
    </motion.div>
  );
}

export function ReplayLabel({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.45 }}
      className="mb-3 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.45em] text-[#66c0f4] sm:text-[11px]"
    >
      <span className="h-px w-8 bg-gradient-to-r from-[#66c0f4]/70 to-transparent" />
      {children}
    </motion.p>
  );
}

export function ReplayHero({
  children,
  shimmer = false,
}: {
  children: ReactNode;
  shimmer?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`text-5xl font-black leading-[1.02] tracking-tight drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)] sm:text-7xl ${
        shimmer ? "text-shimmer" : "text-white"
      }`}
    >
      {children}
    </motion.div>
  );
}

export function ReplayBody({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38, duration: 0.5 }}
      className="mt-4 text-base leading-relaxed text-white/70 sm:mt-5 sm:text-lg"
    >
      {children}
    </motion.p>
  );
}

export function ReplayCard({
  children,
  delay = 0,
  accent = false,
  glow = false,
}: {
  children: ReactNode;
  delay?: number;
  accent?: boolean;
  glow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border p-4 backdrop-blur-xl sm:p-5 ${
        accent
          ? "border-[#ffc857]/30 bg-gradient-to-br from-[#ffc857]/10 to-black/50 shadow-[0_0_40px_rgba(255,200,87,0.08)]"
          : glow
            ? "border-[#66c0f4]/25 bg-gradient-to-br from-[#66c0f4]/8 to-black/50 shadow-[0_0_40px_rgba(102,192,244,0.1)]"
            : "border-white/10 bg-black/45 shadow-[0_8px_32px_rgba(0,0,0,0.35)]"
      }`}
    >
      {children}
    </motion.div>
  );
}

export function StatPill({
  label,
  value,
  delay = 0,
  highlight = false,
}: {
  label: string;
  value: string;
  delay?: number;
  highlight?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className={`rounded-xl border px-4 py-3.5 text-center backdrop-blur-md ${
        highlight
          ? "border-[#66c0f4]/30 bg-[#66c0f4]/10"
          : "border-white/10 bg-black/40"
      }`}
    >
      <p
        className={`text-2xl font-black ${highlight ? "text-[#66c0f4]" : "text-white"}`}
      >
        {value}
      </p>
      <p className="mt-1 text-[9px] uppercase tracking-[0.2em] text-white/40">
        {label}
      </p>
    </motion.div>
  );
}

export function PercentileBadge({
  percent,
  label,
}: {
  percent: number;
  label: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      className="relative mx-auto mt-8 flex h-36 w-36 items-center justify-center"
    >
      <div className="absolute inset-0 animate-pulse-glow rounded-full border-2 border-[#66c0f4]/40 bg-[#66c0f4]/5" />
      <div className="absolute inset-2 rounded-full border border-[#66c0f4]/20" />
      <div className="text-center">
        <p className="text-4xl font-black text-shimmer">Top {percent}%</p>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-white/50">
          {label.replace(/^Top \d+% /, "")}
        </p>
      </div>
    </motion.div>
  );
}

export function BigStat({
  value,
  suffix = "",
  label,
}: {
  value: ReactNode;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="text-6xl font-black leading-none text-white sm:text-8xl">
        {value}
        <span className="text-[#66c0f4]">{suffix}</span>
      </p>
      <p className="mt-3 text-xs font-bold uppercase tracking-[0.3em] text-white/45">
        {label}
      </p>
    </div>
  );
}
