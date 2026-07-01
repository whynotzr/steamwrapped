"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LOCALE } from "@/lib/locale";
import type {
  LeaderboardEntry,
  LeaderboardSnapshot,
} from "@/lib/leaderboard/store";

type BoardKey =
  | "topHours"
  | "topGames"
  | "topViews"
  | "topLevels"
  | "topWorkshopViews";

const BOARDS: {
  key: BoardKey;
  title: string;
  label: string;
  value: (entry: LeaderboardEntry) => string;
}[] = [
  {
    key: "topHours",
    title: "Most hours",
    label: "lifetime playtime",
    value: (entry) => `${entry.totalHours.toLocaleString(LOCALE)}h`,
  },
  {
    key: "topGames",
    title: "Biggest libraries",
    label: "games owned",
    value: (entry) => entry.totalGames.toLocaleString(LOCALE),
  },
  {
    key: "topViews",
    title: "Most viewed",
    label: "SteamWrapped profile views",
    value: (entry) => entry.profileViews.toLocaleString(LOCALE),
  },
  {
    key: "topLevels",
    title: "Highest Steam levels",
    label: "Steam level",
    value: (entry) => entry.steamLevel.toLocaleString(LOCALE),
  },
  {
    key: "topWorkshopViews",
    title: "Creator views",
    label: "Workshop views",
    value: (entry) => entry.workshopViews.toLocaleString(LOCALE),
  },
];

const STAT_CARDS = [
  {
    label: "Accounts indexed",
    value: (snapshot: LeaderboardSnapshot) =>
      snapshot.totals.accounts.toLocaleString(LOCALE),
  },
  {
    label: "Cumulative hours",
    value: (snapshot: LeaderboardSnapshot) =>
      `${snapshot.totals.totalHours.toLocaleString(LOCALE)}h`,
  },
  {
    label: "Games tracked",
    value: (snapshot: LeaderboardSnapshot) =>
      snapshot.totals.totalGames.toLocaleString(LOCALE),
  },
  {
    label: "Achievements",
    value: (snapshot: LeaderboardSnapshot) =>
      snapshot.totals.achievements.toLocaleString(LOCALE),
  },
  {
    label: "Profile views",
    value: (snapshot: LeaderboardSnapshot) =>
      snapshot.totals.profileViews.toLocaleString(LOCALE),
  },
  {
    label: "Avg. Steam level",
    value: (snapshot: LeaderboardSnapshot) =>
      snapshot.totals.averageSteamLevel.toLocaleString(LOCALE),
  },
];

export function LeaderboardLivePage({
  initialSnapshot,
  mode,
}: {
  initialSnapshot: LeaderboardSnapshot;
  mode: "leaderboard" | "statistics";
}) {
  const [snapshot, setSnapshot] = useState(initialSnapshot);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LeaderboardSnapshot | null) => {
        if (data) setSnapshot(data);
      })
      .catch(() => undefined);
  }, []);

  return mode === "leaderboard" ? (
    <LeaderboardPageView snapshot={snapshot} />
  ) : (
    <StatisticsPageView snapshot={snapshot} />
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-white/[0.08] bg-white/[0.035] p-6 text-center">
      <p className="text-lg font-black text-white">No accounts indexed yet</p>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-white/55">
        Generate or open a Steam Wrapped profile and it will appear here.
      </p>
      <Link
        href="/"
        className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-xs font-black text-[#07111f] transition hover:bg-[#dff6ff]"
      >
        Generate a profile
      </Link>
    </div>
  );
}

function PlayerRow({
  entry,
  index,
  value,
}: {
  entry: LeaderboardEntry;
  index: number;
  value: string;
}) {
  return (
    <Link
      href={`/u/${entry.steamId}`}
      className="grid grid-cols-[2rem_1fr_auto] items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.035] p-3 transition hover:border-[#5ce1e6]/30 hover:bg-white/[0.06]"
    >
      <div className="text-center text-sm font-black text-white/40">
        {index + 1}
      </div>
      <div className="flex min-w-0 items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={entry.avatarUrl}
          alt=""
          width={38}
          height={38}
          className="rounded-lg"
        />
        <div className="min-w-0">
          <p className="truncate text-sm font-black text-white">
            {entry.personaName}
          </p>
          <p className="mt-0.5 text-[11px] text-white/35">
            {entry.playedGames.toLocaleString(LOCALE)} played / level{" "}
            {entry.steamLevel.toLocaleString(LOCALE)}
          </p>
        </div>
      </div>
      <p className="text-right text-sm font-black text-[#5ce1e6]">{value}</p>
    </Link>
  );
}

export function LeaderboardPageView({
  snapshot,
}: {
  snapshot: LeaderboardSnapshot;
}) {
  return (
    <main className="grain min-h-dvh bg-[#050814] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <LeaderboardHeader active="leaderboard" />

        <section className="py-12">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#5ce1e6]">
            Global rankings
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none sm:text-6xl">
            SteamWrapped leaderboard
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
            Classements des profils Steam Wrapped deja generes: heures, jeux,
            vues, niveaux Steam et vues Workshop.
          </p>
        </section>

        {snapshot.entries.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {BOARDS.map((board) => (
              <section
                key={board.key}
                className="rounded-lg border border-white/[0.08] bg-[#07111f]/72 p-4 shadow-[0_18px_70px_rgba(0,0,0,0.22)]"
              >
                <div className="mb-4 flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white">
                      {board.title}
                    </h2>
                    <p className="mt-1 text-xs text-white/38">{board.label}</p>
                  </div>
                  <Link
                    href="/statistics"
                    className="text-xs font-bold text-[#5ce1e6]/75 hover:text-[#5ce1e6]"
                  >
                    Stats
                  </Link>
                </div>
                <div className="space-y-2">
                  {snapshot[board.key].map((entry, index) => (
                    <PlayerRow
                      key={`${board.key}-${entry.steamId}`}
                      entry={entry}
                      index={index}
                      value={board.value(entry)}
                    />
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

export function StatisticsPageView({
  snapshot,
}: {
  snapshot: LeaderboardSnapshot;
}) {
  const top = snapshot.topHours[0];
  return (
    <main className="grain min-h-dvh bg-[#050814] px-5 py-6 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <LeaderboardHeader active="statistics" />

        <section className="py-12">
          <p className="text-[10px] font-black uppercase tracking-[0.32em] text-[#ffc857]">
            Global statistics
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-black leading-none sm:text-6xl">
            All indexed Steam lives, added together.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/58">
            Toutes les heures cumulees, jeux, achievements et vues des comptes
            deja passes dans SteamWrapped.
          </p>
        </section>

        {snapshot.entries.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {STAT_CARDS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-white/[0.08] bg-white/[0.04] p-5"
                >
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35">
                    {stat.label}
                  </p>
                  <p className="mt-3 text-3xl font-black text-white">
                    {stat.value(snapshot)}
                  </p>
                </div>
              ))}
            </div>

            <section className="mt-6 rounded-lg border border-white/[0.08] bg-[#07111f]/72 p-5">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5ce1e6]">
                    Combined archive
                  </p>
                  <p className="mt-4 text-4xl font-black text-[#ffc857]">
                    {snapshot.totals.totalHours.toLocaleString(LOCALE)}h
                  </p>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    That is every indexed account&apos;s lifetime Steam playtime
                    stacked into one absurd number.
                  </p>
                </div>
                {top && (
                  <div className="rounded-lg border border-[#5ce1e6]/20 bg-[#5ce1e6]/8 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#5ce1e6]">
                      Current hours leader
                    </p>
                    <PlayerRow
                      entry={top}
                      index={0}
                      value={`${top.totalHours.toLocaleString(LOCALE)}h`}
                    />
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function LeaderboardHeader({ active }: { active: "leaderboard" | "statistics" }) {
  return (
    <header className="flex items-center justify-between rounded-lg border border-white/[0.07] bg-[#06101b]/55 px-3 py-3 backdrop-blur-xl">
      <Link href="/" className="flex items-center gap-2 text-sm font-black">
        <Image
          src="/steamwrapped-logo.png"
          alt=""
          width={34}
          height={34}
          className="rounded-lg"
          priority
        />
        SteamWrapped
      </Link>
      <nav className="flex items-center gap-2 text-[11px] font-bold">
        <Link
          href="/leaderboard"
          className={`rounded-full px-3 py-1.5 transition ${
            active === "leaderboard"
              ? "bg-white text-[#07111f]"
              : "border border-white/10 text-white/60 hover:text-white"
          }`}
        >
          Leaderboard
        </Link>
        <Link
          href="/statistics"
          className={`rounded-full px-3 py-1.5 transition ${
            active === "statistics"
              ? "bg-white text-[#07111f]"
              : "border border-white/10 text-white/60 hover:text-white"
          }`}
        >
          Statistics
        </Link>
      </nav>
    </header>
  );
}
