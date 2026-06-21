"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { AuroraOrbs, ParticleField } from "./WowEffects";

const STEPS = [
  "Connecting to Steam profile…",
  "Scanning your library…",
  "Hunting rare achievements…",
  "Calculating power level…",
  "Preparing the flex…",
];

export function LoadingScreen() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 8000);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(92, (elapsed / 90000) * 92);
      setProgress(pct);
      if (pct < 92) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div className="replay-slide-bg grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <AuroraOrbs intense />
      <ParticleField count={35} />

      <div className="relative z-10 w-full max-w-md text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.5em] text-[#5ce1e6]"
        >
          Steam Replay
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-black text-white md:text-4xl"
        >
          Building your
          <br />
          <span className="text-shimmer-gold">retrospective</span>
        </motion.h2>

        <motion.p
          key={step}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-6 h-5 text-sm text-white/45"
        >
          {STEPS[step]}
        </motion.p>

        <div className="mx-auto mt-8 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="power-bar-fill h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-4 text-[11px] text-white/25">
          ~1–2 min · large libraries take longer
        </p>
      </div>
    </div>
  );
}
