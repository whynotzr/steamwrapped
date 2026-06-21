"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SlideProps {
  children: ReactNode;
  gradient: string;
  className?: string;
}

export function Slide({ children, gradient, className = "" }: SlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden px-6 py-16 ${className}`}
      style={{ background: gradient }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.08),transparent_50%)]" />
      <div className="relative z-10 w-full max-w-lg">{children}</div>
    </motion.div>
  );
}

export function SlideTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="mb-2 text-center text-sm font-semibold uppercase tracking-[0.3em] text-white/60"
    >
      {children}
    </motion.h2>
  );
}

export function SlideBigText({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.7, type: "spring", bounce: 0.3 }}
      className="text-center text-6xl font-black tracking-tight text-white md:text-8xl"
    >
      {children}
    </motion.div>
  );
}

export function SlideSubtext({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="mt-4 text-center text-lg text-white/70 md:text-xl"
    >
      {children}
    </motion.p>
  );
}

export function StaggerItem({
  children,
  delay = 0,
}: {
  children: ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
}
