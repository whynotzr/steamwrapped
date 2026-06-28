"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useMemo } from "react";

/* ─── Particules flottantes (positions déterministes → pas d'erreur hydration) ─── */

function seededUnit(index: number, salt: number): number {
  const raw = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return raw - Math.floor(raw);
}

export function ParticleField({ count = 40, color = "#5ce1e6" }: { count?: number; color?: string }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: seededUnit(i, 1) * 100,
        y: seededUnit(i, 2) * 100,
        size: seededUnit(i, 3) * 3 + 1,
        duration: seededUnit(i, 4) * 8 + 6,
        delay: seededUnit(i, 5) * 4,
      })),
    [count]
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: color,
            boxShadow: `0 0 ${p.size * 4}px ${color}`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.1, 0.7, 0.1],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─── Orbes aurora ─── */

export function AuroraOrbs({ intense = false }: { intense?: boolean }) {
  return (
    <>
      <div
        className={`wow-orb wow-orb-1 ${intense ? "wow-orb-intense" : ""}`}
      />
      <div className={`wow-orb wow-orb-2 ${intense ? "wow-orb-intense" : ""}`} />
      <div className={`wow-orb wow-orb-3 ${intense ? "wow-orb-intense" : ""}`} />
    </>
  );
}

/* ─── Flash blanc sur reveal ─── */

export function FlashReveal({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div
          key={trigger}
          initial={{ opacity: 0.6 }}
          animate={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="pointer-events-none fixed inset-0 z-[100] bg-white"
        />
      )}
    </AnimatePresence>
  );
}

/* ─── Confetti ─── */

const CONFETTI_COLORS = ["#5ce1e6", "#ffc857", "#ff6b9d", "#a8e063", "#66c0f4", "#c9a227"];

export function ConfettiBurst({ active }: { active: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => ({
        id: i,
        x: seededUnit(i, 10) * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        rotation: seededUnit(i, 11) * 360,
        delay: seededUnit(i, 12) * 0.4,
        size: seededUnit(i, 13) * 8 + 4,
        drift: (seededUnit(i, 14) - 0.5) * 200,
        duration: 2.5 + seededUnit(i, 15) * 1.5,
      })),
    []
  );

  if (!active) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[90] overflow-hidden">
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * 0.6,
            background: p.color,
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: "110vh",
            opacity: [1, 1, 0],
            rotate: p.rotation + 720,
            x: p.drift,
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        />
      ))}
    </div>
  );
}

/* ─── Indicateur swipe ─── */

export function SwipeHint({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      className="pointer-events-none fixed bottom-10 left-0 right-0 z-40 flex flex-col items-center gap-2"
    >
      <motion.div
        animate={{ x: [0, 12, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/35"
      >
        <span>Continue</span>
        <span className="text-lg">→</span>
      </motion.div>
    </motion.div>
  );
}

/* ─── Vibration légère (mobile) ─── */

export function useWowPulse(trigger: number, pattern = [30, 20, 50]) {
  useEffect(() => {
    if (trigger <= 0) return;
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(pattern);
    }
  }, [trigger, pattern]);
}

/* ─── Intro cinématique lettres ─── */

export function StaggerTitle({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const words = text.split(" ");

  return (
    <h1 className={className}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden">
          {word.split("").map((char, ci) => (
            <motion.span
              key={ci}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                delay: wi * 0.15 + ci * 0.04,
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="inline-block"
            >
              {char}
            </motion.span>
          ))}
          {wi < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </h1>
  );
}

/* ─── Badge multiplier pop ─── */

export function MultiplierBadge({
  ratio,
  delay = 0.6,
}: {
  ratio: number;
  delay?: number;
}) {
  if (ratio < 1.5) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -12 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 400, damping: 12 }}
      className="wow-multiplier-badge inline-flex items-center gap-1"
    >
      <span className="text-lg">🔥</span>
      <span>×{ratio} vs average</span>
    </motion.div>
  );
}

/* ─── Shine sweep sur cartes ─── */

export function ShineOverlay() {
  return <div className="wow-shine pointer-events-none absolute inset-0" />;
}
