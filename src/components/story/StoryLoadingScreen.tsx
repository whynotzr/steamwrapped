"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface StoryLoadingScreenProps {
  messages: string[];
  onComplete?: () => void;
  /** Durée minimale avant de passer au Wrapped (ms). */
  minDurationMs?: number;
}

export function StoryLoadingScreen({
  messages,
  onComplete,
  minDurationMs = 4000,
}: StoryLoadingScreenProps) {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    let done = false;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(100, (elapsed / minDurationMs) * 100);
      setProgress(pct);
      if (elapsed >= minDurationMs) {
        if (!done) {
          done = true;
          onComplete?.();
        }
        return;
      }
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [minDurationMs, onComplete]);

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#171a21] px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-[#66c0f4]/20 blur-[100px]" />
        <div className="absolute -right-16 bottom-1/4 h-64 w-64 rounded-full bg-[#1b2838] blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-3 text-[10px] font-bold uppercase tracking-[0.45em] text-[#66c0f4]"
        >
          SteamWrapped
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-black text-white sm:text-3xl"
        >
          Analyzing…
        </motion.h2>

        <div className="relative mx-auto mt-8 h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.35 }}
              className="text-sm text-white/50"
            >
              {messages[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-10 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full rounded-full bg-[#66c0f4]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
