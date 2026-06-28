"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { WrappedData } from "@/types/wrapped";
import { LOCALE } from "@/lib/locale";
import { playtimeHours } from "@/lib/wrapped/playtime-stats";
import { CountUp } from "./CountUp";
import { ProgressBar } from "./ProgressBar";
import { ShareButton } from "./ShareButton";
import { CopyLinkButton } from "./CopyLinkButton";
import { LoadingScreen } from "./LoadingScreen";
import { FlexCard } from "./FlexCard";
import { MegaStat, WowFlexSlide } from "./MegaStat";
import {
  ReplayHeroTitle,
  ReplayIntroText,
  ReplaySectionTitle,
  ReplaySlide,
  PowerScoreBar,
} from "./ReplaySlide";
import {
  ByTheNumbers,
  CompletedGamesList,
  CompareBar,
  DashboardGameCard,
  DashboardStatCard,
  EraDonut,
  GameDeepDive,
  GenreRadar,
  MonthlyBars,
  WorkshopShowcase,
} from "./ReplayVisuals";
import { AchievementIcon } from "./AchievementIcon";
import {
  ConfettiBurst,
  FlashReveal,
  ShineOverlay,
  StaggerTitle,
  SwipeHint,
  useWowPulse,
} from "./WowEffects";

const TAIL_SLIDES = 8;

function formatHours(h: number): string {
  return h.toLocaleString(LOCALE);
}

function formatRarePercent(percent: unknown): string {
  const n = Number(percent);
  if (!Number.isFinite(n)) return "—";
  if (n < 0.1) return "<0.1";
  return `${n.toFixed(n < 1 ? 2 : 1)}%`;
}

function formatPerfectGamesSummary(data: WrappedData): string {
  const detected = data.library.completedGames;
  const scanned = data.achievements.completionScannedCount;
  const steam = data.achievements.profilePerfectGames;
  let line = `${detected.toLocaleString(LOCALE)} detected · ${scanned.toLocaleString(LOCALE)} games scanned`;
  if (steam != null && steam > 0) {
    line += ` · Steam ${steam.toLocaleString(LOCALE)}`;
  }
  return line;
}

function formatAchievementSummary(data: WrappedData): string {
  const parts: string[] = [];
  if (data.achievements.fromProfile && data.achievements.profileCount) {
    parts.push("Steam profile total");
  }
  if (data.achievements.profilePerfectAchievements) {
    parts.push(
      `${data.achievements.profilePerfectAchievements.toLocaleString(LOCALE)} from 100% games`
    );
  }
  parts.push(formatPerfectGamesSummary(data));
  parts.push(`${data.extras?.ultraRareCount ?? 0} ultra-rare`);
  return parts.join(" · ");
}

interface WrappedExperienceProps {
  steamId: string;
}

export function WrappedExperience({ steamId }: WrappedExperienceProps) {
  const [data, setData] = useState<WrappedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [slide, setSlide] = useState(0);
  const [flash, setFlash] = useState(0);
  const shareUrl =
    typeof window === "undefined" ? "" : `${window.location.origin}/u/${steamId}`;

  const spotlightCount = data?.replay.gameSpotlights.length ?? 3;
  const totalSlides = 8 + spotlightCount + TAIL_SLIDES;

  const idx = useMemo(() => {
    const spotStart = 8;
    const afterSpot = spotStart + spotlightCount;
    return {
      intro: 0,
      flex: 1,
      dashboard: 2,
      compare: 3,
      era: 4,
      dna: 5,
      monthly: 6,
      uniques: 7,
      spotStart,
      afterSpot,
      achievements: afterSpot,
      completed: afterSpot + 1,
      rare: afterSpot + 2,
      workshop: afterSpot + 3,
      personality: afterSpot + 4,
      roast: afterSpot + 5,
      summary: afterSpot + 6,
      share: afterSpot + 7,
    };
  }, [spotlightCount]);

  const loadWrapped = useCallback(
    (refresh = false) => {
      setLoading(true);
      setError(null);
      setSlide(0);
      const qs = refresh ? "?refresh=1" : "";
      fetch(`/api/wrapped?steamId=${steamId}${qs}`)
        .then(async (res) => {
          if (!res.ok) {
            const body = await res.json();
            throw new Error(body.error ?? "Error");
          }
          return res.json();
        })
        .then((payload: WrappedData) => {
          setData(payload);
        })
        .catch((e: Error) => setError(e.message))
        .finally(() => setLoading(false));
    },
    [steamId]
  );

  useEffect(() => {
    queueMicrotask(() => loadWrapped());
  }, [loadWrapped]);

  useEffect(() => {
    const wowSlides = [idx.flex, idx.achievements, idx.summary];
    if (wowSlides.includes(slide)) {
      queueMicrotask(() => setFlash((f) => f + 1));
    }
  }, [slide, idx.flex, idx.achievements, idx.summary]);

  useWowPulse(flash);

  const next = useCallback(() => {
    setSlide((s) => Math.min(s + 1, totalSlides - 1));
  }, [totalSlides]);

  const prev = useCallback(() => {
    setSlide((s) => Math.max(s - 1, 0));
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  if (loading) return <LoadingScreen />;

  if (error || !data) {
    const isPrivate =
      error?.includes("private") ||
      error?.includes("empty") ||
      error?.includes("public");

    return (
      <div className="replay-slide-bg flex min-h-dvh flex-col items-center justify-center gap-4 px-6">
        <p className="text-xl text-red-400">{error ?? "Unknown error"}</p>
        {isPrivate ? (
          <div className="max-w-md space-y-4 text-center">
            <p className="text-white/50">
              A <strong className="text-white">public</strong> profile and
              library are required.
            </p>
            <a
              href={`https://steamcommunity.com/profiles/${steamId}/edit/settings`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-[#5ce1e6] px-6 py-3 text-sm font-bold text-[#0a0510]"
            >
              Steam settings
            </a>
            <button
              onClick={() => window.location.reload()}
              className="block w-full text-sm text-[#5ce1e6] underline"
            >
              Reload
            </button>
          </div>
        ) : (
          <p className="max-w-md text-center text-white/50">
            Try again in a few moments.
          </p>
        )}
        <Link href="/" className="mt-4 text-sm text-white/40 underline">
          ← Back to menu
        </Link>
      </div>
    );
  }

  const { replay, extras } = data;
  const wow = replay.wowMoment;
  const spotIdx = slide - idx.spotStart;
  const spotlight =
    spotIdx >= 0 && spotIdx < replay.gameSpotlights.length
      ? replay.gameSpotlights[spotIdx]
      : null;

  return (
    <div
      className="relative min-h-dvh cursor-pointer select-none bg-[#0a0510]"
      onClick={(e) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        if (e.clientX - rect.left > rect.width / 2) next();
        else prev();
      }}
    >
      <FlashReveal trigger={flash} />
      <ConfettiBurst active={slide === idx.summary} />
      <ProgressBar current={slide} total={totalSlides} />
      <SwipeHint visible={slide <= 2} />

      <AnimatePresence mode="wait">
        {slide === idx.intro && (
          <ReplaySlide key="intro" intense align="center">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="relative mx-auto mb-8 inline-block"
              >
                <div className="absolute -inset-4 animate-pulse-glow rounded-full bg-[#5ce1e6]/25 blur-xl" />
                <img
                  src={data.profile.avatarUrl}
                  alt=""
                  className="relative h-28 w-28 rounded-full ring-4 ring-[#5ce1e6]/60 sm:h-32 sm:w-32"
                />
              </motion.div>
              <p className="mb-3 text-sm font-medium text-white/50">
                {data.profile.personaName}
              </p>
              <StaggerTitle
                text="Steam Wrapped"
                className="text-4xl font-black uppercase tracking-tight text-shimmer-gold sm:text-5xl md:text-6xl"
              />
              <ReplayIntroText>
                Your personalized gaming retrospective is ready.
                <br />
                Time to flex.
              </ReplayIntroText>
              <PowerScoreBar score={wow.powerScore} />
            </div>
          </ReplaySlide>
        )}

        {slide === idx.flex && (
          <ReplaySlide key="flex" intense align="center">
            <WowFlexSlide
              emoji={wow.emoji}
              headline={wow.headline}
              stat={
                wow.stat >= 1000 && !wow.statFormatted.includes("%") && !wow.statFormatted.startsWith("×") ? (
                  <>
                    <CountUp key={wow.stat} value={wow.stat} duration={2000} />
                    {wow.statFormatted.endsWith("h") ? "h" : ""}
                  </>
                ) : (
                  wow.statFormatted
                )
              }
              statLabel={wow.statLabel}
              punchline={wow.punchline}
            />
          </ReplaySlide>
        )}

        {slide === idx.dashboard && (
          <ReplaySlide key="dash" mosaic={replay.coverMosaic} intense>
            <div className="text-center">
              <ReplayHeroTitle>Steam Wrapped</ReplayHeroTitle>
              <ReplayIntroText>
                {data.library.playedGames} games played ·{" "}
                {data.achievements.totalUnlocked.toLocaleString(LOCALE)} achievements ·{" "}
                {extras.playtimeTopLabel}
              </ReplayIntroText>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-2">
              <DashboardStatCard
                title="Games played"
                value={replay.dashboardCards.gamesPlayed}
                subtitle={`${replay.dashboardCards.unplayedGames} never launched`}
                delay={0.25}
              />
              <DashboardStatCard
                title="Achievements"
                value={replay.dashboardCards.achievements.toLocaleString(LOCALE)}
                subtitle={`${replay.dashboardCards.rareAchievements} ultra-rare`}
                delay={0.35}
              />
              <DashboardStatCard
                title="Days played"
                value={replay.dashboardCards.playtimeDays}
                subtitle={`${formatHours(data.playtime.totalHours)}h total`}
                delay={0.45}
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {data.topGames.slice(0, 3).map((g, i) => (
                <DashboardGameCard
                  key={g.appid}
                  name={g.name}
                  image={g.headerImage}
                  percent={g.playtimePercent ?? 0}
                  hours={playtimeHours(g.playtime_forever)}
                  delay={0.5 + i * 0.1}
                />
              ))}
            </div>
          </ReplaySlide>
        )}

        {slide === idx.compare && (
          <ReplaySlide key="compare">
            <ReplaySectionTitle subtitle="You vs the Steam average — get ready to flex.">
              How you compare
            </ReplaySectionTitle>
            <div className="space-y-8">
              {replay.comparisons.map((m, i) => (
                <CompareBar key={m.label} metric={m} index={i} />
              ))}
            </div>
          </ReplaySlide>
        )}

        {slide === idx.era && (
          <ReplaySlide key="era">
            <ReplaySectionTitle subtitle="New releases, recent hits, or classics — where your time goes.">
              Playtime breakdown
            </ReplaySectionTitle>
            <EraDonut era={replay.playtimeEra} />
          </ReplaySlide>
        )}

        {slide === idx.dna && (
          <ReplaySlide key="dna" intense>
            <ReplaySectionTitle subtitle="Your gaming DNA at a glance.">
              You are what you play
            </ReplaySectionTitle>
            <GenreRadar data={replay.genreRadar} />
            <div className="replay-card-wow relative mt-6 p-5">
              <ShineOverlay />
              <p className="relative mb-4 text-xs font-bold uppercase tracking-widest text-white/40">
                By the numbers
              </p>
              <ByTheNumbers items={replay.byTheNumbers.slice(0, 7)} />
            </div>
          </ReplaySlide>
        )}

        {slide === idx.monthly && (
          <ReplaySlide key="monthly">
            <ReplaySectionTitle
              subtitle={`Peak in ${replay.monthlyActivity.peakMonth} · last 12 months`}
            >
              Monthly activity
            </ReplaySectionTitle>
            <div className="replay-card-wow relative p-5">
              <MonthlyBars
                months={replay.monthlyActivity.months}
                labels={replay.monthlyActivity.labels}
              />
            </div>
          </ReplaySlide>
        )}

        {slide === idx.uniques && (
          <ReplaySlide key="uniques" intense>
            <ReplaySectionTitle subtitle="Your most standout stats.">
              What makes you unique
            </ReplaySectionTitle>
            <div className="space-y-3">
              {extras.uniqueFacts.map((fact, i) => (
                <motion.div
                  key={fact}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  className="replay-card-wow relative p-4"
                >
                  <p className="text-sm leading-relaxed text-white/85">{fact}</p>
                </motion.div>
              ))}
            </div>
            {extras.topDeveloper && (
              <p className="mt-4 text-center text-xs italic text-[#5ce1e6]/70">
                Favorite studio: {extras.topDeveloper.name} (
                {extras.topDeveloper.percent}% of your time)
              </p>
            )}
          </ReplaySlide>
        )}

        {spotlight && (
          <ReplaySlide
            key={`spot-${spotlight.appid}`}
            backgroundImage={spotlight.headerImage}
            intense
          >
            <span className="wow-rank-watermark">#{spotlight.rank}</span>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative mb-1 text-xs font-bold uppercase tracking-[0.35em] text-[#5ce1e6]"
            >
              Top #{spotlight.rank}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="relative text-3xl font-black text-white drop-shadow-lg sm:text-5xl"
            >
              {spotlight.name}
            </motion.h2>
            <p className="relative mt-2 text-sm italic text-white/50">
              {spotlight.tagline}
            </p>
            <div className="relative mt-6">
              <GameDeepDive game={spotlight} />
            </div>
          </ReplaySlide>
        )}

        {slide === idx.achievements && (
          <ReplaySlide key="ach" mosaic={replay.coverMosaic} intense align="center">
            <MegaStat
              value={data.achievements.totalUnlocked}
              label="Steam achievements"
              sublabel={formatAchievementSummary(data)}
              variant="cyan"
            />
          </ReplaySlide>
        )}

        {slide === idx.completed && (
          <ReplaySlide key="completed" intense>
            <ReplaySectionTitle subtitle={formatPerfectGamesSummary(data)}>
              Perfect games
            </ReplaySectionTitle>
            <CompletedGamesList
              games={data.achievements.completedGamesList}
              scannedCount={data.achievements.completionScannedCount}
              profilePerfectGames={data.achievements.profilePerfectGames}
              libraryGamesWithSchema={data.achievements.libraryGamesWithSchema}
            />
          </ReplaySlide>
        )}

        {slide === idx.rare && (
          <ReplaySlide key="rare" intense>
            <ReplaySectionTitle subtitle="Less than 1% of players have these.">
              Hall of Fame
            </ReplaySectionTitle>
            {data.achievements.rarest.length > 0 ? (
              <div className="max-h-[55vh] space-y-2 overflow-y-auto">
                {data.achievements.rarest.slice(0, 8).map((ach, i) => (
                  <motion.div
                    key={ach.name + i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * i, type: "spring" }}
                    className="replay-card-wow flex items-center gap-3 p-3"
                  >
                    {ach.icon || ach.appid ? (
                      <AchievementIcon
                        appId={ach.appid}
                        iconUrl={ach.icon}
                        highlight={i === 0}
                      />
                    ) : (
                      <AchievementIcon highlight={i === 0} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-white">{ach.name}</p>
                      <p className="truncate text-xs text-white/40">
                        {ach.gameName}
                      </p>
                    </div>
                    <p className="shrink-0 text-lg font-black text-[#ffc857]">
                      {formatRarePercent(ach.percent)}
                    </p>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-white/45">No rare achievements detected.</p>
            )}
          </ReplaySlide>
        )}

        {slide === idx.workshop && (
          <ReplaySlide key="workshop" intense>
            <ReplaySectionTitle
              subtitle={
                data.workshop.hasContent
                  ? `${data.workshop.totalPublished} creations · Workshop, guides & art`
                  : "Steam creator profile"
              }
            >
              Your Workshop
            </ReplaySectionTitle>
            <WorkshopShowcase workshop={data.workshop} />
          </ReplaySlide>
        )}

        {slide === idx.personality && (
          <ReplaySlide key="pers" align="center" intense>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 150 }}
              className="text-center"
            >
              <p className="text-8xl drop-shadow-[0_0_50px_rgba(92,225,230,0.4)]">
                {data.personality.emoji}
              </p>
              <ReplaySectionTitle>{data.personality.title}</ReplaySectionTitle>
              <p className="text-white/65">{data.personality.description}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {data.personality.traits.map((t, i) => (
                  <motion.span
                    key={t}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="replay-pill replay-pill-accent"
                  >
                    {t}
                  </motion.span>
                ))}
              </div>
              <p className="mt-6 text-lg font-black text-shimmer-gold">
                {extras.playtimeTopLabel}
              </p>
            </motion.div>
          </ReplaySlide>
        )}

        {slide === idx.roast && (
          <ReplaySlide key="roast">
            <ReplaySectionTitle>Hard truths</ReplaySectionTitle>
            <div className="space-y-3">
              {data.insights.slice(0, 4).map((ins, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.12 * i }}
                  className="replay-card-wow p-4"
                >
                  <p
                    className={`text-center text-sm leading-relaxed ${
                      ins.type === "roast"
                        ? "text-red-300"
                        : ins.type === "praise"
                          ? "text-emerald-300"
                          : "text-white/85"
                    }`}
                  >
                    {ins.type === "roast" && "🔥 "}
                    {ins.type === "praise" && "✨ "}
                    {ins.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </ReplaySlide>
        )}

        {slide === idx.summary && (
          <ReplaySlide
            key="summary"
            backgroundImage={data.topGames[0]?.headerImage}
            align="center"
            intense
          >
            <div className="text-center">
              <motion.p
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-bold uppercase tracking-[0.45em] text-[#5ce1e6]"
              >
                Recap
              </motion.p>
              <p className="mt-4 text-3xl font-black text-shimmer-gold sm:text-5xl">
                {data.summary.headline}
              </p>
              <p className="mt-3 text-white/55">{data.summary.subheadline}</p>
              <PowerScoreBar score={wow.powerScore} />
              <div className="mt-8 grid grid-cols-2 gap-2.5">
                {[
                  { v: formatHours(data.playtime.totalHours) + "h", l: "Playtime" },
                  {
                    v: data.achievements.totalUnlocked.toLocaleString(LOCALE),
                    l: "Achievements",
                  },
                  { v: String(data.library.totalGames), l: "Games" },
                  { v: extras.playtimeTopLabel, l: "Rank" },
                ].map((s, i) => (
                  <motion.div
                    key={s.l}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + i * 0.08 }}
                    className="replay-card-wow p-3.5"
                  >
                    <p className="text-lg font-black text-white">{s.v}</p>
                    <p className="text-[9px] uppercase text-white/35">{s.l}</p>
                  </motion.div>
                ))}
              </div>
              <p className="mt-6 text-sm text-white/30">Swipe to share →</p>
            </div>
          </ReplaySlide>
        )}

        {slide === idx.share && (
          <ReplaySlide key="share" align="center" mosaic={replay.coverMosaic} intense>
            <div className="text-center" onClick={(e) => e.stopPropagation()}>
              <ReplayHeroTitle>Flex time</ReplayHeroTitle>
              <ReplayIntroText>
                Your recap card — download or share
              </ReplayIntroText>
              <div className="my-6 flex justify-center">
                <FlexCard data={data} shareUrl={shareUrl} exportMode />
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                <ShareButton
                  targetId="wrapped-summary-card"
                  filename={`steam-wrapped-${data.profile.personaName.replace(/\W/g, "")}.png`}
                />
                <CopyLinkButton url={shareUrl} />
                <button
                  onClick={() => loadWrapped(true)}
                  className="rounded-full border border-white/15 px-4 py-2 text-xs text-white/50 hover:border-white/30"
                >
                  Regenerate
                </button>
                <Link
                  href="/"
                  className="rounded-full border border-[#66c0f4]/40 bg-[#66c0f4]/10 px-6 py-2.5 text-sm font-bold text-[#66c0f4] transition hover:bg-[#66c0f4]/20"
                >
                  ← Back to menu
                </Link>
              </div>
            </div>
          </ReplaySlide>
        )}
      </AnimatePresence>
    </div>
  );
}
