"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SteamLookup } from "./SteamLookup";

const TRUST_POINTS = [
  { icon: "🎮", label: "Top games (lifetime)" },
  { icon: "⏱", label: "Total hours" },
  { icon: "🏷", label: "Your archetype" },
  { icon: "📸", label: "9:16 PNG card" },
];

export function LandingPage({ hasError }: { hasError?: boolean }) {
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#171a21] px-6 py-8 sm:py-12">
      <HeroBackground />

      <div className="relative z-10 flex w-full max-w-xl flex-1 flex-col">
        <SiteHeader />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex flex-1 flex-col justify-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="mb-6 flex justify-center"
        >
          <span className="rounded-full border border-[#66c0f4]/35 bg-[#66c0f4]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#66c0f4] shadow-[0_0_24px_rgba(102,192,244,0.15)]">
            Wrapped · Your whole Steam life
          </span>
        </motion.div>

        <h1 className="mb-4 text-center text-3xl font-black leading-tight tracking-tight text-white sm:text-4xl md:text-[2.75rem]">
          SteamWrapped
          <span className="mt-1 block text-xl font-semibold text-[#66c0f4] sm:text-2xl">
            Your gaming life, exposed.
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-md text-center text-sm leading-relaxed text-white/50 sm:text-base">
          Animated slides, lifetime stats, roasts included. Paste your SteamID64
          or profile URL — results in one click.
        </p>

        {hasError && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
          >
            Steam sign-in failed — try again or use your profile link.
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.6 }}
          className="rounded-3xl border border-white/[0.06] bg-[#1b2838]/80 p-6 shadow-[0_0_60px_rgba(102,192,244,0.08)] backdrop-blur-md sm:p-8"
        >
          <SteamLookup />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3.5"
            role="alert"
          >
            <span className="mt-0.5 shrink-0 text-base" aria-hidden>
              ⚠️
            </span>
            <p className="text-xs leading-relaxed text-amber-100/90 sm:text-sm">
              <strong className="font-semibold text-amber-200">
                Public profile required.
              </strong>{" "}
              Your Steam profile and{" "}
              <strong className="text-amber-200/90">game details</strong> must
              be set to{" "}
              <strong className="text-amber-200/90">&quot;Public&quot;</strong>{" "}
              in Steam settings.
            </p>
          </motion.div>
        </motion.div>

        <div className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {TRUST_POINTS.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 + i * 0.07 }}
              className="rounded-xl border border-white/[0.05] bg-white/[0.02] px-3 py-3 text-center"
            >
              <div className="mb-1 text-lg">{item.icon}</div>
              <p className="text-[10px] font-medium text-white/45 sm:text-[11px]">
                {item.label}
              </p>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 text-center text-[11px] text-white/25">
          Data based on{" "}
          <code className="rounded bg-white/5 px-1 py-0.5 text-[#66c0f4]/80">
            playtime_forever
          </code>{" "}
          — your whole career, not a calendar year.
        </p>
      </motion.div>

      <SiteFooter />
      </div>
    </main>
  );
}
