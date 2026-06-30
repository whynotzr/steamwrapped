import { LOCALE } from "@/lib/locale";
import {
  getAppDetailsBatchConcurrent,
  getBadges,
  getOwnedGames,
  getPlayerSummary,
  getSteamLevel,
} from "@/lib/steam/api";
import { resolveAchievementTotals } from "@/lib/steam/achievements";
import { computeExtras } from "./extras";
import { resolveWorkshopStats } from "./workshop-stats";
import {
  attachPlaytimeMeta,
  buildMetaMaps,
  buildRollingMonthlyActivity,
  computeGenresFromLibrary,
  computeTopDeveloper,
  ENRICH_PLAYED_LIMIT,
  ENRICH_UNPLAYED_LIMIT,
  playtimeHours,
} from "./playtime-stats";
import { computeReplayData, parseReleaseYear } from "./replay-stats";
import type { SteamOwnedGame } from "@/lib/steam/types";
import type {
  GameWithMeta,
  GenreStat,
  GamingPersonality,
  ReplayData,
  WrappedData,
  WrappedInsight,
} from "@/types/wrapped";

function formatDate(unix?: number): string {
  if (!unix) return "Unknown";
  return new Date(unix * 1000).toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getPlaytimeRank(hours: number): string {
  if (hours >= 10000) return "Steam Legend";
  if (hours >= 5000) return "Absolute Veteran";
  if (hours >= 2000) return "Hardcore gamer";
  if (hours >= 1000) return "Dedicated Player";
  if (hours >= 500) return "Regular Player";
  if (hours >= 100) return "Casual Player";
  return "Beginner";
}

function getAchievementRank(unlocked: number): string | null {
  if (unlocked >= 30000) return "Legendary Trophy Hunter";
  if (unlocked >= 15000) return "Achievement Master";
  if (unlocked >= 5000) return "Confirmed Achiever";
  if (unlocked >= 1000) return "Success Collector";
  return null;
}

function computePersonality(
  genres: GenreStat[],
  library: { playedGames: number; unplayedGames: number; totalGames: number },
  playtimeHours: number,
  achievements: { totalUnlocked: number; completionRate: number }
): GamingPersonality {
  const topGenre = genres[0]?.genre ?? "Other";
  const backlogRatio = library.unplayedGames / Math.max(library.totalGames, 1);

  if (achievements.totalUnlocked >= 10000) {
    return {
      title: "The Trophy Hunter",
      description: `${achievements.totalUnlocked.toLocaleString(LOCALE)} achievements unlocked. Steam should be paying you a salary.`,
      traits: ["Achiever", "Perfectionist", "Legend"],
      emoji: "🏆",
    };
  }

  if (backlogRatio > 0.7 && library.totalGames > 50) {
    return {
      title: "The Collector",
      description:
        "You buy more than you play. Your library is a museum, not an arcade.",
      traits: ["Sale hunter", "Infinite backlog", "Optimist"],
      emoji: "🏛️",
    };
  }

  if (achievements.completionRate > 60 && achievements.totalUnlocked > 500) {
    return {
      title: "The Perfectionist",
      description: "100% or nothing. Every achievement is a badge of honor.",
      traits: ["Meticulous", "Achiever", "Stubborn"],
      emoji: "💎",
    };
  }

  if (playtimeHours > 3000) {
    return {
      title: "The Legendary No-Lifer",
      description: `${playtimeHours.toLocaleString(LOCALE)} hours. The sun is a myth to you.`,
      traits: ["Enduring", "Devoted", "Insomniac"],
      emoji: "🔥",
    };
  }

  const genrePersonalities: Record<string, GamingPersonality> = {
    Action: {
      title: "The Adrenaline Junkie",
      description: "Steel reflexes, fingers on fire. Action is your drug.",
      traits: ["Reactive", "Competitive", "Intense"],
      emoji: "⚡",
    },
    RPG: {
      title: "The World Explorer",
      description: "Every quest matters, every lore page read. You live in these worlds.",
      traits: ["Curious", "Immersive", "Patient"],
      emoji: "🗡️",
    },
    Horror: {
      title: "The Horror Braveheart",
      description: "While others scream, you keep going. Solid.",
      traits: ["Brave", "Masochist", "Calm"],
      emoji: "👻",
    },
    Strategy: {
      title: "The Grand Strategist",
      description: "Always five moves ahead. Your brain is your weapon.",
      traits: ["Calculating", "Patient", "Tactician"],
      emoji: "♟️",
    },
    Indie: {
      title: "The Hidden Gem Hunter",
      description: "You find the rare gems everyone else misses.",
      traits: ["Original", "Discoverer", "Hipster"],
      emoji: "✨",
    },
  };

  return (
    genrePersonalities[topGenre] ?? {
      title: "The Versatile Gamer",
      description: `${topGenre} dominates, but you play a bit of everything. Eclectic.`,
      traits: ["Versatile", "Open-minded", "Gamer"],
      emoji: "🎮",
    }
  );
}

function generateInsights(
  library: WrappedData["library"],
  playtime: WrappedData["playtime"],
  achievements: WrappedData["achievements"],
  topGame: GameWithMeta | undefined
): WrappedInsight[] {
  const insights: WrappedInsight[] = [];

  const achRank = getAchievementRank(achievements.totalUnlocked);
  if (achRank) {
    insights.push({
      type: "praise",
      text: `${achievements.totalUnlocked.toLocaleString(LOCALE)} achievements. Rank: ${achRank}.`,
    });
  }

  if (library.unplayedGames > 20) {
    insights.push({
      type: "roast",
      text: `${library.unplayedGames} games never launched. That's not a Steam library, it's a graveyard.`,
    });
  }

  if (library.backlogPercent > 80 && library.totalGames > 30) {
    insights.push({
      type: "roast",
      text: `You've played ${library.playRate}% of your library. Steam sales own you.`,
    });
  }

  if (playtime.totalHours > 5000) {
    insights.push({
      type: "praise",
      text: `${playtime.totalHours.toLocaleString(LOCALE)} hours of playtime. You're officially at the top of the Steam food chain.`,
    });
  }

  if (library.completedGames > 50) {
    insights.push({
      type: "praise",
      text: `${library.completedGames} games completed at 100%. Respect.`,
    });
  }

  if (topGame) {
    const topH = playtimeHours(topGame.playtime_forever);
    insights.push({
      type: "fact",
      text: `${topGame.name} absorbed ${topH.toLocaleString(LOCALE)}h of your life. No regrets.`,
    });
  }

  if (library.estimatedBacklogValue > 500) {
    insights.push({
      type: "roast",
      text: `~${Math.round(library.estimatedBacklogValue)} in games collecting dust. Touch grass?`,
    });
  }

  insights.push({
    type: "fact",
    text: "Your Wrapped is ready. Get ready to flex on Discord.",
  });

  return insights;
}

async function enrichGames(
  games: SteamOwnedGame[],
  limit: number
): Promise<GameWithMeta[]> {
  const sorted = [...games].sort(
    (a, b) => b.playtime_forever - a.playtime_forever
  );
  const top = sorted.slice(0, limit);
  const appIds = top.map((g) => g.appid);
  const details = await getAppDetailsBatchConcurrent(appIds, 12, 30);

  return top.map((game) => {
    const detail = details.get(game.appid);
    const price = detail?.is_free
      ? 0
      : (detail?.price_overview?.final ?? 0) / 100;

    return {
      ...game,
      genres: detail?.genres?.map((g) => g.description) ?? [],
      developers:
        detail?.developers?.length
          ? detail.developers
          : detail?.publishers?.length
            ? detail.publishers
            : ["Indie"],
      headerImage:
        detail?.header_image ??
        `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.appid}/header.jpg`,
      priceEstimate: price,
      releaseDate: detail?.release_date?.date,
      releaseYear: parseReleaseYear(detail?.release_date?.date),
    };
  });
}

function estimateLibraryValue(
  allGames: SteamOwnedGame[],
  enriched: GameWithMeta[]
): { libraryValue: number; backlogValue: number } {
  const paidPrices = enriched
    .map((g) => g.priceEstimate ?? 0)
    .filter((p) => p > 0);
  const avgPaid =
    paidPrices.length > 0
      ? paidPrices.reduce((a, b) => a + b, 0) / paidPrices.length
      : 12;

  const enrichedMap = new Map(enriched.map((g) => [g.appid, g]));
  let knownValue = 0;

  for (const game of allGames) {
    const meta = enrichedMap.get(game.appid);
    if (meta && meta.priceEstimate !== undefined && meta.priceEstimate > 0) {
      knownValue += meta.priceEstimate;
    }
  }

  const unplayed = allGames.filter((g) => g.playtime_forever === 0).length;
  const enrichedUnplayedWithPrice = enriched.filter(
    (g) => g.playtime_forever === 0 && (g.priceEstimate ?? 0) > 0
  ).length;
  const unenrichedUnplayed = unplayed - enrichedUnplayedWithPrice;

  const backlogValue =
    enriched
      .filter((g) => g.playtime_forever === 0)
      .reduce(
        (s, g) =>
          s +
          (g.priceEstimate && g.priceEstimate > 0 ? g.priceEstimate : avgPaid),
        0
      ) + Math.max(0, unenrichedUnplayed) * avgPaid;

  const libraryValue =
    knownValue +
    (allGames.length - enriched.length) * avgPaid * 0.5 +
    backlogValue * 0.3;

  return {
    libraryValue: Math.round(Math.max(libraryValue, knownValue)),
    backlogValue: Math.round(backlogValue),
  };
}

function buildUniqueFacts(
  totalHours: number,
  playedGames: number,
  genres: GenreStat[],
  badges: { xp: number }[],
  topGame: GameWithMeta | undefined,
  unplayedGames: number
): string[] {
  const facts: string[] = [];

  facts.push(
    `${totalHours.toLocaleString(LOCALE)}h of playtime · ${playedGames} games with time logged`
  );

  if (genres[0]) {
    facts.push(
      `Top genre: ${genres[0].genre} (${genres[0].percent}% of your time)`
    );
  }

  if (topGame) {
    facts.push(
      `#1: ${topGame.name} — ${playtimeHours(topGame.playtime_forever).toLocaleString(LOCALE)}h`
    );
  }

  if (unplayedGames >= 10) {
    facts.push(`${unplayedGames} games in the backlog, never launched`);
  }

  const badgeXp = badges.reduce((s, b) => s + (b.xp ?? 0), 0);
  if (badges.length > 0) {
    facts.push(
      `${badges.length} Steam badges · ${badgeXp.toLocaleString(LOCALE)} XP`
    );
  }

  return facts;
}

function buildLibraryRecords(
  topGames: GameWithMeta[],
  enrichedGames: GameWithMeta[],
  recentlyPlayed: SteamOwnedGame[],
  allGameNames: Map<number, string>
): ReplayData["libraryRecords"] {
  const released = enrichedGames.filter(
    (g) => typeof g.releaseYear === "number"
  );
  const oldest = [...released].sort(
    (a, b) => (a.releaseYear ?? 9999) - (b.releaseYear ?? 9999)
  )[0];
  const newest = [...released].sort(
    (a, b) => (b.releaseYear ?? 0) - (a.releaseYear ?? 0)
  )[0];
  const mostRecentRaw = [...recentlyPlayed].sort(
    (a, b) => (b.rtime_last_played ?? 0) - (a.rtime_last_played ?? 0)
  )[0];
  const mostRecentMeta = mostRecentRaw
    ? enrichedGames.find((g) => g.appid === mostRecentRaw.appid)
    : undefined;
  const mostExpensiveBacklog = enrichedGames
    .filter((g) => g.playtime_forever === 0 && (g.priceEstimate ?? 0) > 0)
    .sort((a, b) => (b.priceEstimate ?? 0) - (a.priceEstimate ?? 0))[0];

  return {
    topGameHours: topGames[0] ? playtimeHours(topGames[0].playtime_forever) : 0,
    topGameName: topGames[0]?.name ?? "Unknown",
    oldestGame: oldest?.releaseYear
      ? {
          appid: oldest.appid,
          name: oldest.name,
          year: oldest.releaseYear,
          headerImage: oldest.headerImage,
        }
      : undefined,
    newestGame: newest?.releaseYear
      ? {
          appid: newest.appid,
          name: newest.name,
          year: newest.releaseYear,
          headerImage: newest.headerImage,
        }
      : undefined,
    mostRecentGame:
      mostRecentRaw && mostRecentRaw.rtime_last_played
        ? {
            appid: mostRecentRaw.appid,
            name:
              allGameNames.get(mostRecentRaw.appid) ??
              mostRecentRaw.name ??
              "Unknown game",
            lastPlayed: formatDate(mostRecentRaw.rtime_last_played),
            headerImage: mostRecentMeta?.headerImage,
          }
        : undefined,
    mostExpensiveBacklog: mostExpensiveBacklog
      ? {
          appid: mostExpensiveBacklog.appid,
          name: mostExpensiveBacklog.name,
          price: Math.round(mostExpensiveBacklog.priceEstimate ?? 0),
          headerImage: mostExpensiveBacklog.headerImage,
        }
      : undefined,
  };
}

export async function generateWrapped(steamId: string): Promise<WrappedData> {
  const [profile, games, level, badges] = await Promise.all([
    getPlayerSummary(steamId),
    getOwnedGames(steamId),
    getSteamLevel(steamId),
    getBadges(steamId),
  ]);

  if (!profile) throw new Error("Steam profile not found or private");
  if (games.length === 0) {
    throw new Error(
      "Empty or private library. Set your Steam profile to public."
    );
  }

  const playedGames = games.filter((g) => g.playtime_forever > 0);
  const unplayedGames = games.filter((g) => g.playtime_forever === 0);

  const totalMinutes = games.reduce((s, g) => s + g.playtime_forever, 0);
  const totalHours = Math.round(totalMinutes / 60);
  const totalDays = Math.round(totalHours / 24);

  const playedSorted = [...playedGames].sort(
    (a, b) => b.playtime_forever - a.playtime_forever
  );

  const allGamesSorted = [...games].sort(
    (a, b) => b.playtime_forever - a.playtime_forever
  );
  const allGameNames = new Map(games.map((g) => [g.appid, g.name]));

  const [enrichedPlayedRaw, enrichedUnplayed] = await Promise.all([
    enrichGames(playedSorted, ENRICH_PLAYED_LIMIT),
    enrichGames(unplayedGames, ENRICH_UNPLAYED_LIMIT),
  ]);

  const headerByAppId = new Map<number, string>();
  for (const g of enrichedPlayedRaw) {
    if (g.headerImage) headerByAppId.set(g.appid, g.headerImage);
  }

  const playtimeByAppId = new Map(
    games.map((g) => [g.appid, g.playtime_forever])
  );

  const [achievementStats, workshop] = await Promise.all([
    resolveAchievementTotals(
      steamId,
      allGamesSorted.map((g) => g.appid),
      allGamesSorted.map((g) => ({
        appid: g.appid,
        name: allGameNames.get(g.appid) ?? g.name,
      })),
      headerByAppId,
      playtimeByAppId
    ),
    resolveWorkshopStats(steamId),
  ]);

  for (const g of enrichedPlayedRaw) {
    const prog = achievementStats.progressByAppId.get(g.appid);
    if (prog) {
      g.achievementUnlocked = prog.unlocked;
      g.achievementTotal = prog.total;
    }
  }

  const enrichedPlayed = attachPlaytimeMeta(enrichedPlayedRaw, totalMinutes);
  const topGames = enrichedPlayed.slice(0, 5);
  const { genreByAppId, releaseYearByAppId } = buildMetaMaps(enrichedPlayed);
  const genres = computeGenresFromLibrary(playedGames, genreByAppId);

  const { libraryValue, backlogValue } = estimateLibraryValue(games, [
    ...enrichedPlayed,
    ...enrichedUnplayed,
  ]);

  const monthlyActivity = buildRollingMonthlyActivity(games);

  const twelveMonthsAgo = Date.now() / 1000 - 365 * 24 * 3600;
  const recentlyPlayed = games.filter(
    (g) => g.rtime_last_played && g.rtime_last_played >= twelveMonthsAgo
  );
  const gamesPlayedLastTwoWeeks = games.filter(
    (g) => (g.playtime_2weeks ?? 0) > 0
  );
  const minutesLastTwoWeeks = gamesPlayedLastTwoWeeks.reduce(
    (sum, game) => sum + (game.playtime_2weeks ?? 0),
    0
  );

  const devByAppId = new Map(
    enrichedPlayed.map((g) => [g.appid, g.developers])
  );
  const topDeveloper = computeTopDeveloper(
    playedGames,
    devByAppId,
    totalMinutes
  );

  const library = {
    totalGames: games.length,
    playedGames: playedGames.length,
    unplayedGames: unplayedGames.length,
    completedGames: achievementStats.completedGames,
    playRate: Math.round((playedGames.length / games.length) * 100),
    backlogPercent: Math.round((unplayedGames.length / games.length) * 100),
    estimatedBacklogValue: backlogValue,
    estimatedLibraryValue: libraryValue,
  };

  const playtime = {
    totalMinutes,
    totalHours,
    totalDays,
    equivalentMovies: Math.round(totalHours / 2),
    equivalentWorkWeeks: Math.round(totalHours / 40),
    rank: getPlaytimeRank(totalHours),
  };

  const accountCreated = formatDate(profile.timecreated);
  const accountAgeYears = profile.timecreated
    ? Math.floor(
        (Date.now() / 1000 - profile.timecreated) / (365.25 * 24 * 3600)
      )
    : 0;

  const achievements = {
    totalUnlocked: achievementStats.totalUnlocked,
    scannedCount: achievementStats.scannedCount,
    profileCount: achievementStats.profileCount,
    profilePerfectGames: achievementStats.profilePerfectGames,
    profilePerfectAchievements: achievementStats.profilePerfectAchievements,
    totalPossible: achievementStats.totalPossible,
    completionRate: achievementStats.completionRate,
    gamesWithAchievements: achievementStats.gamesWithAchievements,
    completedGamesList: achievementStats.completedGamesList,
    fromProfile: achievementStats.fromProfile,
    rarest: achievementStats.rarest,
    rareGamesScanned: achievementStats.rareGamesScanned,
    statsGamesScanned: achievementStats.statsGamesScanned,
    completionScannedCount: achievementStats.completionScannedCount,
    libraryGamesWithSchema: achievementStats.libraryGamesWithSchema,
  };

  const personality = computePersonality(
    genres,
    library,
    totalHours,
    achievements
  );

  const insights = generateInsights(
    library,
    playtime,
    achievements,
    topGames[0]
  );

  const achRank = getAchievementRank(achievementStats.totalUnlocked);
  const headline =
    achRank && achievementStats.totalUnlocked >= 5000
      ? achRank
      : playtime.rank;

  const freeCount =
    enrichedPlayed.filter((g) => g.priceEstimate === 0).length +
    enrichedUnplayed.filter((g) => g.priceEstimate === 0).length;

  const extrasBase = computeExtras(
    totalHours,
    accountAgeYears,
    playedGames.length,
    topGames[0],
    playedGames,
    devByAppId,
    totalMinutes,
    badges,
    freeCount,
    achievements.rarest
  );

  const uniqueFacts = buildUniqueFacts(
    totalHours,
    playedGames.length,
    genres,
    badges,
    topGames[0],
    unplayedGames.length
  );

  const extras = {
    ...extrasBase,
    topDeveloper: topDeveloper ?? extrasBase.topDeveloper,
    uniqueFacts: [...uniqueFacts, ...extrasBase.funFacts],
  };

  const baseData = {
    statsVersion: 11,
    generatedAt: new Date().toISOString(),
    profile: {
      steamId,
      personaName: profile.personaname,
      avatarUrl: profile.avatarfull,
      profileUrl: profile.profileurl,
      accountCreated,
      accountAgeYears,
      steamLevel: level,
    },
    playtime,
    library,
    topGames,
    genres,
    achievements,
    workshop,
    activity: {
      recentlyPlayedGames: recentlyPlayed.length,
      mostActiveMonth: monthlyActivity.peakMonth,
      mostActiveMonthCount: monthlyActivity.peakCount,
      badgesEarned: badges.length,
      gamesPlayedLastTwoWeeks: gamesPlayedLastTwoWeeks.length,
      minutesLastTwoWeeks,
    },
    personality,
    insights,
    summary: {
      headline,
      subheadline: `${totalHours.toLocaleString(LOCALE)}h of playtime · ${achievementStats.totalUnlocked.toLocaleString(LOCALE)} achievements · ${playedGames.length} games played`,
    },
    extras,
  };

  const replay = computeReplayData(
    baseData,
    games,
    playedGames,
    releaseYearByAppId,
    topGames,
    monthlyActivity
  );

  replay.libraryRecords = buildLibraryRecords(
    topGames,
    [...enrichedPlayed, ...enrichedUnplayed],
    recentlyPlayed,
    allGameNames
  );

  return { ...baseData, replay };
}
