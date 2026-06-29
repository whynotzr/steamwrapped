"use client";

import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SteamLookup } from "./SteamLookup";

const TRUST_POINTS = [
  { value: "01", label: "Lifetime top games" },
  { value: "02", label: "Total hours decoded" },
  { value: "03", label: "Player archetype" },
  { value: "04", label: "Share-ready card" },
];

const PREVIEW_STATS = [
  { label: "Playtime", value: "8,742h" },
  { label: "Achievements", value: "1,184" },
  { label: "Rare unlock", value: "0.7%" },
];

const SEO_FEATURES = [
  "Turn your public Steam profile into a cinematic Steam Wrapped recap.",
  "See lifetime Steam stats, top games, playtime, achievements, rare unlocks, and your player archetype.",
  "Share a clean Steam Wrapped card with friends in one click.",
];

const FAQ_ITEMS = [
  {
    question: "What is Steam Wrapped?",
    answer:
      "Steam Wrapped is a personalized recap for your Steam profile. It turns your public Steam stats into animated slides with playtime, top games, achievements, rare unlocks, and a shareable summary card.",
  },
  {
    question: "How do I create my Steam Wrapped?",
    answer:
      "Paste your SteamID64, Steam vanity name, or Steam profile URL. SteamWrapped reads public Steam profile data and generates your gaming recap automatically.",
  },
  {
    question: "Is Steam Wrapped official?",
    answer:
      "SteamWrapped is not affiliated with Valve or Steam. It uses public Steam Web API data from profiles that have public profile and game details enabled.",
  },
];

export function LandingPage({ hasError }: { hasError?: boolean }) {
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#070a11] px-5 py-6 sm:px-8 sm:py-8">
      <HeroBackground />

      <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col">
        <SiteHeader />

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="relative grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16"
        >
          <section>
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              className="mb-6 inline-flex rounded-full border border-[#5ce1e6]/35 bg-[#5ce1e6]/10 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.28em] text-[#5ce1e6] shadow-[0_0_24px_rgba(92,225,230,0.15)]"
            >
              Wrapped / Your whole Steam life
            </motion.div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.94] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Steam Wrapped
              <span className="mt-3 block bg-gradient-to-r from-[#5ce1e6] via-white to-[#ffc857] bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-6xl">
                Your gaming life, exposed.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-white/62 sm:text-lg">
              Create your Steam Wrapped from your Steam profile. Get animated
              slides, lifetime Steam stats, top games, rare achievements,
              personality read, creator stats, and a shareable card built for
              the group chat.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
              {TRUST_POINTS.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-3 backdrop-blur-md"
                >
                  <div className="text-[10px] font-black text-[#5ce1e6]">
                    {item.value}
                  </div>
                  <p className="mt-1 text-[11px] font-semibold text-white/55">
                    {item.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <section className="relative">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="relative overflow-hidden rounded-lg border border-white/[0.08] bg-[#0d1621]/82 p-5 shadow-[0_28px_110px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-7"
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5ce1e6] to-transparent" />
              <div className="mb-5 grid grid-cols-3 gap-2">
                {PREVIEW_STATS.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-lg border border-white/[0.07] bg-black/18 p-3"
                  >
                    <p className="text-lg font-black text-white">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[9px] font-bold uppercase tracking-widest text-white/35">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>

              {hasError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
                >
                  Steam sign-in failed - try again or use your profile link.
                </motion.p>
              )}

              <SteamLookup />

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="mt-5 rounded-lg border border-amber-400/25 bg-amber-400/[0.07] px-4 py-3.5"
                role="alert"
              >
                <p className="text-xs leading-relaxed text-amber-100/90 sm:text-sm">
                  <strong className="font-semibold text-amber-200">
                    Public profile required.
                  </strong>{" "}
                  Your Steam profile and game details must be set to{" "}
                  <strong className="text-amber-200/90">&quot;Public&quot;</strong>{" "}
                  in Steam settings.
                </p>
              </motion.div>

              <p className="mt-5 text-center text-[11px] text-white/25">
                Based on{" "}
                <code className="rounded bg-white/5 px-1 py-0.5 text-[#5ce1e6]/80">
                  playtime_forever
                </code>{" "}
                - your whole career, not a calendar year.
              </p>
            </motion.div>
          </section>
        </motion.div>

        <section className="relative z-10 mx-auto w-full max-w-6xl pb-12 pt-2 sm:pb-16">
          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#5ce1e6]">
                Steam Wrapped stats
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-black tracking-tight text-white sm:text-4xl">
                A Steam Wrapped recap made for players who want the whole story.
              </h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {SEO_FEATURES.map((feature) => (
                <article
                  key={feature}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-4 text-sm leading-6 text-white/62 backdrop-blur-md"
                >
                  {feature}
                </article>
              ))}
            </div>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {FAQ_ITEMS.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-white/[0.08] bg-[#0d1621]/70 p-5 backdrop-blur-xl"
              >
                <h3 className="text-base font-black text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-6 text-white/55">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
}
