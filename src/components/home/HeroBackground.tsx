"use client";

import { motion } from "framer-motion";

export function HeroBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="glow-orb -left-32 top-0 h-96 w-96 bg-[#66c0f4]/25 animate-pulse-glow" />
      <div
        className="glow-orb -right-20 bottom-20 h-80 w-80 bg-[#4a9fd4]/15 animate-pulse-glow"
        style={{ animationDelay: "2s" }}
      />
      <div className="glow-orb left-1/2 top-1/3 h-64 w-64 -translate-x-1/2 bg-[#1b2838]/80" />

      {/* Grille perspective */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(102,192,244,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(102,192,244,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0e1419]/40 to-[#0e1419]" />
    </div>
  );
}
