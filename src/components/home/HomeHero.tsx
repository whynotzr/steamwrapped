"use client";

import { motion } from "framer-motion";
import { SteamLookup } from "./SteamLookup";
import { HeroBackground } from "./HeroBackground";

const FEATURES = [
  { icon: "⏱", title: "Playtime", desc: "Heures & rang" },
  { icon: "🏆", title: "Succès", desc: "Total profil + rares" },
  { icon: "🎮", title: "Top jeux", desc: "Slides cinéma" },
  { icon: "✦", title: "Flex", desc: "Lien partageable" },
];

export function HomeHero({ hasError }: { hasError: boolean }) {
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 py-16">
      <HeroBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8 flex justify-center"
        >
          <span className="rounded-full border border-[#66c0f4]/30 bg-[#66c0f4]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.35em] text-[#66c0f4]">
            Rétrospective 2025
          </span>
        </motion.div>

        {/* Titre */}
        <h1 className="mb-4 text-center text-6xl font-black leading-[0.95] tracking-tight text-white md:text-8xl">
          STEAM
          <br />
          <span className="text-shimmer">REPLAY</span>
        </h1>

        <p className="mx-auto mb-10 max-w-md text-center text-lg text-white/50">
          Ta année gaming en slides cinématiques.
          <span className="text-white/70"> Flex instant.</span>
        </p>

        {hasError && (
          <p className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300">
            Connexion Steam échouée — réessaie.
          </p>
        )}

        {/* Carte principale */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="glass-panel mx-auto max-w-lg rounded-3xl p-8"
        >
          <SteamLookup />

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-white/25">
              ou
            </span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>

          <a
            href="/api/auth/steam"
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#1b2838] to-[#2a475e] py-4 text-sm font-semibold text-white transition hover:shadow-[0_0_30px_rgba(102,192,244,0.2)]"
          >
            <svg
              className="h-5 w-5 text-[#66c0f4] transition group-hover:scale-110"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
            </svg>
            Connexion Steam — 1 clic
          </a>
        </motion.div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-4 text-center backdrop-blur-sm transition hover:border-[#66c0f4]/20 hover:bg-white/[0.05]"
            >
              <div className="mb-2 text-2xl">{f.icon}</div>
              <p className="text-sm font-bold text-white">{f.title}</p>
              <p className="mt-0.5 text-[11px] text-white/35">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-10 text-center text-[11px] text-white/20">
          Profil public requis · Lien partageable · ~1 min d&apos;analyse
        </p>
      </motion.div>
    </main>
  );
}
