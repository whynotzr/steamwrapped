"use client";

import { motion } from "framer-motion";
import { LOCALE } from "@/lib/locale";
import type {
  StoryArchetype,
  StoryGraveyard,
  StoryPlaytime,
  StoryPodiumEntry,
  StoryProfile,
  StoryShareCard,
  StoryTopGame,
} from "@/types/story-wrapped";
import { CountUp } from "@/components/wrapped/CountUp";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export function IntroSlide({
  profile,
  headline,
  subheadline,
}: {
  profile: StoryProfile;
  headline: string;
  subheadline: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <motion.div {...fadeUp} className="mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarUrl}
          alt=""
          className="mx-auto h-28 w-28 rounded-full border-4 border-[#66c0f4]/40 shadow-[0_0_40px_rgba(102,192,244,0.25)] sm:h-36 sm:w-36"
        />
      </motion.div>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.12 }}
        className="mb-2 text-lg font-bold text-[#66c0f4]"
      >
        {profile.personaName}
      </motion.p>
      <motion.h2
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.22 }}
        className="max-w-sm text-2xl font-black leading-snug text-white sm:text-3xl"
      >
        {headline}
      </motion.h2>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.34 }}
        className="mt-4 max-w-xs text-sm text-white/45"
      >
        {subheadline}
      </motion.p>
    </div>
  );
}

export function PlaytimeSlide({ playtime }: { playtime: StoryPlaytime }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <motion.p
        {...fadeUp}
        className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40"
      >
        The scary number
      </motion.p>
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="text-6xl font-black tabular-nums text-white sm:text-7xl"
      >
        <CountUp value={playtime.totalHours} duration={1800} />
        <span className="ml-2 text-3xl text-[#66c0f4] sm:text-4xl">h</span>
      </motion.div>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.25 }}
        className="mt-3 text-lg text-white/60"
      >
        total playtime
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.4 }}
        className="mt-8 max-w-xs rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm italic text-white/55"
      >
        « {playtime.equivalence} »
      </motion.p>
    </div>
  );
}

export function Top1Slide({ game }: { game: StoryTopGame }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6">
      <motion.p
        {...fadeUp}
        className="mb-6 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/40"
      >
        L&apos;obsession
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.65, type: "spring", stiffness: 120 }}
        className="relative"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.libraryImage}
          alt={game.name}
          className="h-[280px] w-[186px] rounded-xl object-cover shadow-[0_20px_60px_rgba(0,0,0,0.6)] sm:h-[340px] sm:w-[226px]"
        />
        <div className="absolute -right-3 -bottom-3 rounded-xl bg-[#66c0f4] px-3 py-1.5 text-xs font-black text-[#171a21]">
          #{game.rank}
        </div>
      </motion.div>
      <motion.h3
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        className="mt-6 text-center text-xl font-black text-white"
      >
        {game.name}
      </motion.h3>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.3 }}
        className="mt-2 text-3xl font-black text-[#66c0f4]"
      >
        {game.hours.toLocaleString(LOCALE)}h
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.42 }}
        className="mt-5 max-w-sm text-center text-sm leading-relaxed text-white/55"
      >
        {game.conditionalPhrase}
      </motion.p>
    </div>
  );
}

export function PodiumSlide({ games }: { games: StoryPodiumEntry[] }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-6 py-8">
      <motion.p
        {...fadeUp}
        className="mb-8 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-white/40"
      >
        The podium · Top 2–5
      </motion.p>
      <div className="mx-auto w-full max-w-md space-y-5">
        {games.map((game, i) => (
          <motion.div
            key={game.appid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1, duration: 0.45 }}
            className="flex items-center gap-3"
          >
            <span className="w-6 shrink-0 text-center text-sm font-black text-white/30">
              {game.rank}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={game.headerImage}
              alt=""
              className="h-10 w-[72px] shrink-0 rounded-md object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="mb-1.5 flex items-baseline justify-between gap-2">
                <p className="truncate text-sm font-bold text-white">
                  {game.name}
                </p>
                <p className="shrink-0 text-xs font-bold text-[#66c0f4]">
                  {game.hours.toLocaleString(LOCALE)}h
                </p>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${game.barPercent}%` }}
                  transition={{ delay: 0.25 + i * 0.1, duration: 0.7 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#66c0f4] to-[#4a9fd4]"
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function GraveyardSlide({ graveyard }: { graveyard: StoryGraveyard }) {
  return (
    <div className="flex flex-1 flex-col justify-center px-8">
      <motion.p
        {...fadeUp}
        className="mb-4 text-center text-[10px] font-bold uppercase tracking-[0.4em] text-red-400/80"
      >
        The graveyard of unknown soldiers
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.1 }}
        className="text-center text-7xl font-black text-white sm:text-8xl"
      >
        {graveyard.unplayedCount}
      </motion.p>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        className="mt-4 text-center text-base leading-relaxed text-white/60"
      >
        {graveyard.headline}
      </motion.p>
      <motion.div
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.35 }}
        className="mt-8 space-y-2"
      >
        {graveyard.sampleUnplayed.slice(0, 4).map((g) => (
          <div
            key={g.appid}
            className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.03] px-4 py-2.5"
          >
            <span className="truncate text-sm text-white/70">{g.name}</span>
            <span className="shrink-0 text-xs text-white/30">0 min</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function ArchetypeSlide({ archetype }: { archetype: StoryArchetype }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
      <motion.p
        {...fadeUp}
        className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em] text-white/40"
      >
        The diagnosis
      </motion.p>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 140, delay: 0.1 }}
        className="mb-6 flex h-28 w-28 items-center justify-center rounded-full text-5xl shadow-[0_0_60px_rgba(102,192,244,0.3)]"
        style={{ backgroundColor: `${archetype.badgeColor}22`, border: `2px solid ${archetype.badgeColor}55` }}
      >
        {archetype.emoji}
      </motion.div>
      <motion.h2
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.2 }}
        className="text-3xl font-black text-white"
      >
        {archetype.title}
      </motion.h2>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.32 }}
        className="mt-4 max-w-sm text-sm leading-relaxed text-white/55"
      >
        {archetype.description}
      </motion.p>
      <motion.ul
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.44 }}
        className="mt-6 space-y-2 text-left"
      >
        {archetype.traits.map((t) => (
          <li
            key={t}
            className="flex items-center gap-2 text-xs text-white/45"
          >
            <span className="text-[#66c0f4]">▸</span>
            {t}
          </li>
        ))}
      </motion.ul>
      <motion.p
        {...fadeUp}
        transition={{ ...fadeUp.transition, delay: 0.55 }}
        className="mt-8 text-xs text-white/30"
      >
        Swipe for your share card →
      </motion.p>
    </div>
  );
}

export function ShareCardPreview({
  profile,
  shareCard,
  cardId,
}: {
  profile: StoryProfile;
  shareCard: StoryShareCard;
  cardId: string;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-6">
      <div
        id={cardId}
        className="flex aspect-[9/16] w-full max-w-[320px] flex-col overflow-hidden rounded-2xl bg-gradient-to-b from-[#1b2838] to-[#171a21] p-6 shadow-[0_0_60px_rgba(102,192,244,0.15)]"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#66c0f4]">
          {shareCard.title}
        </p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={profile.avatarUrl}
          alt=""
          className="mx-auto mt-5 h-16 w-16 rounded-full border-2 border-[#66c0f4]/50"
        />
        <p className="mt-3 text-center text-lg font-black text-white">
          {profile.personaName}
        </p>
        <p className="mt-1 text-center text-xs text-white/45">
          {shareCard.subtitle}
        </p>
        <div className="mt-6 space-y-2.5">
          {shareCard.top3.map((g) => (
            <div
              key={g.rank}
              className="flex items-center justify-between rounded-lg bg-white/5 px-3 py-2"
            >
              <span className="text-sm text-white/80">
                #{g.rank} {g.name}
              </span>
              <span className="text-xs font-bold text-[#66c0f4]">
                {g.hours.toLocaleString(LOCALE)}h
              </span>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-[#66c0f4]/30 bg-[#66c0f4]/10 px-4 py-3 text-center">
          <span className="text-2xl">{shareCard.archetypeEmoji}</span>
          <p className="mt-1 text-sm font-bold text-[#66c0f4]">
            {shareCard.archetype}
          </p>
        </div>
        <p className="mt-auto pt-4 text-center text-[10px] text-white/25">
          {shareCard.footerUrl}
        </p>
      </div>
    </div>
  );
}
