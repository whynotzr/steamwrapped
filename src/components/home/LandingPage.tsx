"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HeroBackground } from "./HeroBackground";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";
import { SteamLookup } from "./SteamLookup";

const HERO_STATS = [
  { label: "Lifetime hours", value: "8,742" },
  { label: "Games decoded", value: "186" },
  { label: "Rare unlock", value: "0.7%" },
];

const PREVIEW_GAMES = [
  { name: "Sea of Thieves", hours: "256h", accent: "#5ce1e6" },
  { name: "Counter-Strike 2", hours: "192h", accent: "#ffc857" },
  { name: "Wallpaper Engine", hours: "88h", accent: "#66c0f4" },
];

const FEATURE_ROWS = [
  {
    kicker: "01",
    title: "Steam Wrapped generator",
    text: "Paste a Steam profile and generate a clean Steam Wrapped recap with top games, time sinks, unplayed backlog, oldest games, newest games, and library value.",
  },
  {
    kicker: "02",
    title: "Achievements with bite",
    text: "Total unlocks, perfect games, rarest achievements, and enough context to make your Steam stats worth sharing.",
  },
  {
    kicker: "03",
    title: "Leaderboard ready",
    text: "Publish your Steam Wrapped card, compare total hours, games, profile level, views, and help build the global SteamWrapped statistics.",
  },
];

const FAQ_ITEMS = [
  {
    question: "What is Steam Wrapped?",
    answer:
      "Steam Wrapped is a personalized recap for your Steam profile. It turns public Steam stats into animated slides with playtime, top games, achievements, rare unlocks, and a shareable summary card.",
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

function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative mx-auto w-full max-w-[430px]"
    >
      <div className="relative overflow-hidden rounded-lg border border-white/10 bg-[#07111f]/86 shadow-[0_35px_130px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#5ce1e6] to-transparent" />
        <div className="flex items-center justify-between border-b border-white/[0.07] p-4">
          <div className="flex items-center gap-3">
            <Image
              src="/steamwrapped-logo.png"
              alt=""
              width={42}
              height={42}
              className="rounded-lg"
              priority
            />
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5ce1e6]">
                Steam Wrapped
              </p>
              <p className="mt-1 text-lg font-black text-white">Preview run</p>
            </div>
          </div>
          <div className="rounded-full border border-[#ffc857]/30 bg-[#ffc857]/10 px-3 py-1 text-[11px] font-black text-[#ffc857]">
            94 PWR
          </div>
        </div>

        <div className="p-5">
          <div className="grid grid-cols-3 gap-2">
            {HERO_STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-white/[0.08] bg-white/[0.045] p-3"
              >
                <p className="text-xl font-black text-white">{stat.value}</p>
                <p className="mt-1 text-[9px] font-bold uppercase tracking-wider text-white/35">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/[0.08] bg-black/22 p-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.26em] text-white/35">
                  Main character stat
                </p>
                <p className="mt-2 text-5xl font-black leading-none text-[#ffc857] drop-shadow-[0_0_28px_rgba(255,200,87,0.32)]">
                  x7
                </p>
              </div>
              <p className="max-w-[9rem] text-right text-sm font-semibold leading-5 text-white/58">
                above average lifetime playtime
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            {PREVIEW_GAMES.map((game, index) => (
              <motion.div
                key={game.name}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42 + index * 0.08 }}
                className="flex items-center gap-3 rounded-lg border border-white/[0.06] bg-white/[0.035] p-3"
              >
                <div
                  className="h-10 w-1.5 rounded-full"
                  style={{ backgroundColor: game.accent }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-black text-white">
                    #{index + 1} {game.name}
                  </p>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${88 - index * 22}%`,
                        backgroundColor: game.accent,
                      }}
                    />
                  </div>
                </div>
                <p className="text-sm font-black text-white/75">{game.hours}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LandingPage({ hasError }: { hasError?: boolean }) {
  return (
    <main className="grain relative flex min-h-dvh flex-col items-center overflow-hidden bg-[#050814] px-5 py-6 sm:px-8 sm:py-8">
      <HeroBackground />

      <div className="relative z-10 flex w-full max-w-6xl flex-1 flex-col">
        <SiteHeader />

        <section className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.02fr_0.98fr] lg:py-16">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#5ce1e6]/28 bg-[#5ce1e6]/8 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-[#5ce1e6] shadow-[0_0_24px_rgba(92,225,230,0.12)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#5ce1e6] shadow-[0_0_14px_#5ce1e6]" />
              Lifetime Steam recap
            </div>

            <h1 className="max-w-4xl text-5xl font-black leading-[0.92] text-white sm:text-7xl lg:text-8xl">
              Steam Wrapped
              <span className="mt-4 block bg-gradient-to-r from-[#5ce1e6] via-white to-[#ffc857] bg-clip-text text-3xl text-transparent sm:text-5xl lg:text-6xl">
                turn your Steam profile into a flex.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
              Paste a Steam profile and get a cinematic replay of your gaming
              life: top games, lifetime hours, achievements, rare unlocks,
              backlog, personality, and a share-ready recap card.
            </p>

            <div className="mt-8 max-w-2xl rounded-lg border border-white/[0.08] bg-[#081321]/76 p-3 shadow-[0_24px_90px_rgba(0,0,0,0.34)] backdrop-blur-xl">
              {hasError && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-center text-sm text-red-300"
                >
                  Steam sign-in failed - try again or use your profile link.
                </motion.p>
              )}
              <SteamLookup />
            </div>

            <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white/35">
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                Public profiles
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                Steam Web API
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.035] px-3 py-1.5">
                Share PNG
              </span>
            </div>
          </motion.div>

          <PreviewCard />
        </section>

        <section className="relative z-10 mx-auto w-full max-w-6xl pb-12 pt-2 sm:pb-16">
          <div className="grid gap-4 lg:grid-cols-3">
            {FEATURE_ROWS.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-lg border border-white/[0.08] bg-white/[0.035] p-5 shadow-[0_18px_70px_rgba(0,0,0,0.22)] backdrop-blur-xl transition hover:-translate-y-1 hover:border-[#5ce1e6]/25 hover:bg-white/[0.055]"
              >
                <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#5ce1e6]">
                  {feature.kicker}
                </p>
                <h2 className="mt-4 text-2xl font-black text-white">
                  {feature.title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-white/58">
                  {feature.text}
                </p>
              </article>
            ))}
          </div>

          <section className="mt-6 rounded-lg border border-white/[0.08] bg-[#07111f]/64 p-5 backdrop-blur-xl sm:p-6">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#ffc857]">
              Steam stats recap
            </p>
            <h2 className="mt-3 text-2xl font-black text-white sm:text-3xl">
              A Steam Wrapped for your profile, your friends, and the leaderboard.
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 text-white/58 sm:text-base">
              SteamWrapped turns public Steam profile data into a fast gaming
              recap: lifetime hours, most played games, achievement records,
              recent activity, profile views, Steam level, global statistics,
              and a shareable card built for search, screenshots, and bragging
              rights.
            </p>
          </section>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {FAQ_ITEMS.map((item) => (
              <article
                key={item.question}
                className="rounded-lg border border-white/[0.08] bg-[#07111f]/72 p-5 backdrop-blur-xl"
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
