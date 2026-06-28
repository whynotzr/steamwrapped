import { LOCALE } from "@/lib/locale";
import type {
  GameSpotlight,
  GenreStat,
  ReplayCompareMetric,
  ReplayData,
  WrappedData,
} from "@/types/wrapped";
import type { GameWithMeta } from "@/types/wrapped";
import type { SteamOwnedGame } from "@/lib/steam/types";
import {
  computePlaytimeEraFromLibrary,
  formatLastPlayed,
  playtimeHours,
} from "./playtime-stats";

const MEDIANS = {
  achievements: 11,
  gamesPlayed: 25,
  playtimeDays: 50,
  rareAchievements: 3,
};

export function parseReleaseYear(dateStr?: string): number | null {
  if (!dateStr) return null;
  const match = dateStr.match(/\d{4}/);
  return match ? parseInt(match[0], 10) : null;
}

export function releaseCategory(
  year: number | null,
  currentYear: number
): "new" | "recent" | "classic" {
  if (!year) return "classic";
  if (year >= currentYear) return "new";
  if (year >= currentYear - 3) return "recent";
  return "classic";
}

function compareMetric(
  user: number,
  median: number,
  label: string,
  unit: string
): ReplayCompareMetric {
  const ratio = median > 0 ? user / median : user;
  return {
    label,
    user,
    median,
    unit,
    ratio: Math.round(ratio * 10) / 10,
    beatMedian: user >= median,
  };
}

function buildGameSpotlights(topGames: GameWithMeta[]): GameSpotlight[] {
  const currentYear = new Date().getFullYear();

  return topGames.slice(0, 3).map((game, i) => {
    const hours = playtimeHours(game.playtime_forever);
    const playtimePercent = game.playtimePercent ?? 0;
    const lastPlayed = formatLastPlayed(game.rtime_last_played);
    const cat = releaseCategory(game.releaseYear ?? null, currentYear);
    const achTotal = game.achievementTotal ?? 0;
    const achUnlocked = game.achievementUnlocked ?? 0;
    const taglines = [
      "Your most played game.",
      "Second place on the leaderboard.",
      "Third place, but still in the top.",
    ];

    let priceLabel: string | undefined;
    if (game.priceEstimate === 0) priceLabel = "Free";
    else if (game.priceEstimate && game.priceEstimate > 0)
      priceLabel = `~${Math.round(game.priceEstimate)}`;

    return {
      rank: i + 1,
      appid: game.appid,
      name: game.name,
      headerImage: game.headerImage ?? "",
      hours,
      playtimePercent,
      genres: game.genres.length > 0 ? game.genres.slice(0, 4) : ["Other"],
      developers: (game.developers ?? []).slice(0, 2),
      releaseDate: game.releaseDate,
      releaseYear: game.releaseYear,
      releaseCategory: cat,
      recentlyActive: (game.playtime_2weeks ?? 0) > 0,
      lastPlayed,
      recentHours: playtimeHours(game.playtime_2weeks ?? 0),
      achievementUnlocked: achTotal > 0 ? achUnlocked : undefined,
      achievementTotal: achTotal > 0 ? achTotal : undefined,
      achievementComplete:
        achTotal > 0 && achUnlocked === achTotal ? true : undefined,
      achievementPercent:
        achTotal > 0
          ? Math.round((achUnlocked / achTotal) * 100)
          : undefined,
      priceLabel,
      tagline: taglines[i] ?? "",
    };
  });
}

function buildGenreRadar(genres: GenreStat[]): ReplayData["genreRadar"] {
  const top = genres.slice(0, 6);
  const max = top[0]?.percent ?? 100;
  return top.map((g) => ({
    label: g.genre.length > 12 ? g.genre.slice(0, 11) + "…" : g.genre,
    value: max > 0 ? Math.round((g.percent / max) * 100) : 0,
    percent: g.percent,
  }));
}

function buildWowMoment(
  data: Omit<WrappedData, "replay">,
  comparisons: ReplayCompareMetric[]
): ReplayData["wowMoment"] {
  const ach = data.achievements.totalUnlocked;
  const hours = data.playtime.totalHours;
  const top = data.topGames[0];
  const topShare = data.extras.topGameSharePercent;
  const bestCompare = [...comparisons].sort((a, b) => b.ratio - a.ratio)[0];

  const powerScore = Math.min(
    100,
    Math.round(
      Math.log10(Math.max(ach, 1)) * 10 +
        Math.log10(Math.max(hours, 1)) * 12 +
        data.library.playedGames * 0.5 +
        (bestCompare?.ratio ?? 1) * 4
    )
  );

  if (ach >= 20000) {
    return {
      emoji: "👑",
      headline: "Absolute legend",
      stat: ach,
      statFormatted: ach.toLocaleString(LOCALE),
      statLabel: "achievements unlocked on Steam",
      punchline: "Steam should send you a statue.",
      powerScore: Math.max(powerScore, 95),
    };
  }

  if (ach >= 5000) {
    return {
      emoji: "🏆",
      headline: "Trophy hunter",
      stat: ach,
      statFormatted: ach.toLocaleString(LOCALE),
      statLabel: "achievements · more than 99% of players",
      punchline: `${bestCompare?.ratio ?? 1}x the Steam median. Respect.`,
      powerScore: Math.max(powerScore, 85),
    };
  }

  if (hours >= 5000) {
    return {
      emoji: "⏳",
      headline: "Lifetime invested",
      stat: hours,
      statFormatted: hours.toLocaleString(LOCALE) + "h",
      statLabel: `≈ ${Math.round(hours / 24)} days of non-stop gaming`,
      punchline: data.extras.playtimeTopLabel,
      powerScore: Math.max(powerScore, 80),
    };
  }

  if (topShare >= 40 && top) {
    return {
      emoji: "🎯",
      headline: "One game to rule them all",
      stat: topShare,
      statFormatted: `${topShare}%`,
      statLabel: `of your time on ${top.name}`,
      punchline: `${playtimeHours(top.playtime_forever).toLocaleString(LOCALE)} hours. No regrets.`,
      powerScore: Math.max(powerScore, 75),
    };
  }

  if (bestCompare && bestCompare.ratio >= 5) {
    return {
      emoji: "🚀",
      headline: "Above average",
      stat: Math.round(bestCompare.ratio),
      statFormatted: `×${Math.round(bestCompare.ratio)}`,
      statLabel: bestCompare.label.toLowerCase(),
      punchline: "You're not an average player.",
      powerScore: Math.max(powerScore, 70),
    };
  }

  return {
    emoji: "🎮",
    headline: "Your gaming profile",
    stat: data.library.playedGames,
    statFormatted: String(data.library.playedGames),
    statLabel: "games with time logged",
    punchline: top ? `#1: ${top.name}` : data.personality.title,
    powerScore,
  };
}

export function computeReplayData(
  data: Omit<WrappedData, "replay">,
  _games: SteamOwnedGame[],
  playedGames: SteamOwnedGame[],
  releaseYearByAppId: Map<number, number | null | undefined>,
  topGames: GameWithMeta[],
  monthlyActivity: {
    months: number[];
    labels: string[];
    peakMonth: string;
    peakCount: number;
  }
): ReplayData {
  const playtimeDays = Math.max(1, data.playtime.totalDays);
  const mosaic = topGames
    .slice(0, 12)
    .map((g) => g.headerImage)
    .filter(Boolean) as string[];

  const comparisons = [
    compareMetric(
      data.library.playedGames,
      MEDIANS.gamesPlayed,
      "Games played",
      "games"
    ),
    compareMetric(
      data.achievements.totalUnlocked,
      MEDIANS.achievements,
      "Achievements unlocked",
      "achievements"
    ),
    compareMetric(
      playtimeDays,
      MEDIANS.playtimeDays,
      "Days of playtime (lifetime)",
      "days"
    ),
  ];

  return {
    comparisons,
    playtimeEra: computePlaytimeEraFromLibrary(
      playedGames,
      releaseYearByAppId
    ),
    genreRadar: buildGenreRadar(data.genres),
    byTheNumbers: [
      { label: "Total hours", value: data.playtime.totalHours },
      { label: "Games played", value: data.library.playedGames },
      { label: "Games never launched", value: data.library.unplayedGames },
      { label: "Games completed 100%", value: data.library.completedGames },
      { label: "Genres explored", value: data.genres.length },
      { label: "Achievements unlocked", value: data.achievements.totalUnlocked },
      { label: "Steam badges", value: data.activity.badgesEarned },
      { label: "Badge XP", value: data.extras.totalBadgeXp },
      { label: "Steam level", value: data.profile.steamLevel },
      {
        label: "Active games (12 months)",
        value: data.activity.recentlyPlayedGames,
      },
    ],
    monthlyActivity: {
      months: monthlyActivity.months,
      labels: monthlyActivity.labels,
      peakMonth: monthlyActivity.peakMonth,
    },
    gameSpotlights: buildGameSpotlights(topGames),
    coverMosaic: mosaic,
    dashboardCards: {
      gamesPlayed: data.library.playedGames,
      achievements: data.achievements.totalUnlocked,
      playtimeDays,
      rareAchievements: data.extras.ultraRareCount,
      gamesWithAchievements: data.achievements.gamesWithAchievements,
      unplayedGames: data.library.unplayedGames,
    },
    wowMoment: buildWowMoment(data, comparisons),
  };
}
