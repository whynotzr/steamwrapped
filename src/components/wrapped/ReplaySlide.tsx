"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { MosaicBackground } from "./ReplayVisuals";
import { AuroraOrbs, ParticleField } from "./WowEffects";

interface ReplaySlideProps {
  children: ReactNode;
  backgroundImage?: string;
  mosaic?: string[];
  align?: "center" | "top";
  intense?: boolean;
  particles?: boolean;
}

export function ReplaySlide({
  children,
  backgroundImage,
  mosaic,
  align = "top",
  intense = false,
  particles = true,
}: ReplaySlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.06, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.96, filter: "blur(6px)" }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="replay-slide-bg relative flex min-h-dvh w-full overflow-hidden"
    >
      <AuroraOrbs intense={intense} />
      {particles && <ParticleField count={intense ? 55 : 28} />}

      {mosaic && mosaic.length > 0 && <MosaicBackground images={mosaic} />}

      {backgroundImage && (
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1.05 }}
            transition={{ duration: 8, ease: "easeOut" }}
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120810]/70 via-[#120810]/88 to-[#0a0510]/98" />
        </div>
      )}

      <div className="pointer-events-none absolute top-0 left-0 right-0 z-20 h-px bg-gradient-to-r from-transparent via-[#5ce1e6]/50 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_20%,rgba(0,0,0,0.5)_100%)]" />

      <div
        className={`grain relative z-10 flex min-h-dvh w-full flex-col px-5 py-20 sm:px-8 sm:py-24 ${
          align === "center" ? "justify-center" : "justify-start"
        }`}
      >
        <div className="relative mx-auto w-full max-w-2xl">{children}</div>
      </div>
    </motion.div>
  );
}

export function ReplaySectionTitle({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="text-3xl font-black tracking-tight text-white sm:text-4xl"
      >
        {children}
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="mt-2 max-w-xl text-sm leading-relaxed text-white/50"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

export function ReplayHeroTitle({ children }: { children: ReactNode }) {
  return (
    <motion.h1
      initial={{ opacity: 0, y: 24, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="text-center text-5xl font-black uppercase tracking-tight text-shimmer-gold sm:text-6xl md:text-7xl"
    >
      {children}
    </motion.h1>
  );
}

export function ReplayIntroText({ children }: { children: ReactNode }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.45 }}
      className="mx-auto mt-4 max-w-xl text-center text-sm leading-relaxed text-white/55 sm:text-base"
    >
      {children}
    </motion.p>
  );
}

export function PowerScoreBar({ score }: { score: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="mt-6"
    >
      <div className="mb-1.5 flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/35">
        <span>Power level</span>
        <span className="text-[#5ce1e6]">{score}/100</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/8">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ delay: 0.7, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="power-bar-fill h-full rounded-full"
        />
      </div>
    </motion.div>
  );
}
