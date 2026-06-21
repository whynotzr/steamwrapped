import {
  getProfileShowcaseStats,
} from "./profile";
import {
  getAchievementSchema,
  getAppDetailsBatchConcurrent,
  getGlobalAchievementPercentages,
  getPlayerAchievements,
  getUserStatsForGame,
} from "./api";
import type { AchievementProgressEntry } from "./types";
import type { SteamAchievement, SteamAchievementSchema } from "./types";
import type { CompletedGameEntry, RareAchievement } from "@/types/wrapped";
import { buildAchievementIconUrl } from "./achievement-icons";

const SCAN_CONCURRENCY = 14;
const COMPLETION_SCAN_CONCURRENCY = 14;
const SCHEMA_PREFILTER_CONCURRENCY = 20;
const SCAN_DELAY_MS = 25;
const COMPLETION_SCAN_DELAY_MS = 22;
const SCHEMA_PREFILTER_DELAY_MS = 15;
const MAX_GAMES_STATS_SCAN = 120;
const MAX_GAMES_RARE_SCAN = 200;
const RARE_BATCH = 12;

function isAchievementUnlocked(achieved: number | boolean | undefined): boolean {
  return achieved === 1 || achieved === true;
}

function countUnlockedAgainstNames(
  achievementNames: string[],
  playerAch: SteamAchievement[]
): { unlocked: number; total: number } {
  const total = achievementNames.length;
  if (total === 0) return { unlocked: 0, total: 0 };

  const playerMap = new Map(playerAch.map((a) => [a.apiname, a]));
  let unlocked = 0;
  for (const name of achievementNames) {
    if (isAchievementUnlocked(playerMap.get(name)?.achieved)) unlocked++;
  }
  return { unlocked, total };
}

async function fetchPlayerAchievementData(
  steamId: string,
  appId: number
): Promise<{
  playerApiSuccess: boolean;
  achievements: SteamAchievement[];
}> {
  const [player, stats] = await Promise.all([
    getPlayerAchievements(steamId, appId),
    getUserStatsForGame(steamId, appId),
  ]);

  let achievements = player.success ? player.achievements : (stats?.achievements ?? []);
  if ((stats?.achievements?.length ?? 0) > achievements.length) {
    achievements = stats?.achievements ?? achievements;
  }

  return { playerApiSuccess: player.success, achievements };
}

function evaluateCompletion(
  catalog: string[],
  playerAch: SteamAchievement[],
  playerApiSuccess: boolean
): { unlocked: number; total: number; complete: boolean } {
  if (catalog.length === 0 && playerAch.length === 0) {
    return { unlocked: 0, total: 0, complete: false };
  }

  // Chemin fiable : GetPlayerAchievements a répondu success=1
  if (playerApiSuccess && playerAch.length > 0) {
    if (catalog.length > 0) {
      const { unlocked, total } = countUnlockedAgainstNames(catalog, playerAch);
      const complete = total > 0 && unlocked === total;
      return { unlocked, total, complete };
    }

    const unlocked = playerAch.filter((a) => isAchievementUnlocked(a.achieved)).length;
    const total = playerAch.length;
    return {
      unlocked,
      total,
      complete: total > 0 && unlocked === total,
    };
  }

  if (catalog.length === 0) {
    return { unlocked: 0, total: 0, complete: false };
  }

  const { unlocked, total } = countUnlockedAgainstNames(catalog, playerAch);
  if (total === 0 || unlocked !== total || playerAch.length === 0) {
    return { unlocked, total, complete: false };
  }

  // Fallback stats API : chaque succès du schéma doit être présent dans la réponse
  const playerMap = new Map(playerAch.map((a) => [a.apiname, a]));
  const complete = catalog.every((name) =>
    isAchievementUnlocked(playerMap.get(name)?.achieved)
  );
  return { unlocked, total, complete };
}

async function scanOneGameAccurate(
  steamId: string,
  appId: number,
  schema?: SteamAchievementSchema[]
): Promise<AchievementProgressEntry | null> {
  try {
    const resolvedSchema = schema ?? (await getAchievementSchema(appId));
    if (resolvedSchema.length === 0) return null;

    const playerData = await fetchPlayerAchievementData(steamId, appId);
    const catalog = resolvedSchema.map((s) => s.name);
    if (catalog.length === 0 && playerData.achievements.length === 0) {
      return null;
    }

    const { unlocked, total, complete } = evaluateCompletion(
      catalog,
      playerData.achievements,
      playerData.playerApiSuccess
    );

    return {
      appid: appId,
      unlocked,
      total,
      verified: complete,
    };
  } catch {
    return null;
  }
}

async function scanOneGameQuick(
  steamId: string,
  appId: number,
  schema?: SteamAchievementSchema[]
): Promise<AchievementProgressEntry | null> {
  try {
    const resolvedSchema = schema ?? (await getAchievementSchema(appId));
    if (resolvedSchema.length === 0) return null;

    const playerData = await fetchPlayerAchievementData(steamId, appId);
    if (playerData.achievements.length === 0) return null;

    const catalog = resolvedSchema.map((s) => s.name);
    const { unlocked, total } = countUnlockedAgainstNames(
      catalog,
      playerData.achievements
    );

    return { appid: appId, unlocked, total, verified: false };
  } catch {
    return null;
  }
}

async function scanInBatches(
  steamId: string,
  appIds: number[],
  scanFn: (steamId: string, appId: number) => Promise<AchievementProgressEntry | null>,
  concurrency: number,
  delayMs: number
): Promise<AchievementProgressEntry[]> {
  const results: AchievementProgressEntry[] = [];

  for (let i = 0; i < appIds.length; i += concurrency) {
    const chunk = appIds.slice(i, i + concurrency);
    const batch = await Promise.all(
      chunk.map((appId) => scanFn(steamId, appId))
    );
    results.push(
      ...batch.filter((e): e is AchievementProgressEntry => e !== null)
    );
    if (delayMs > 0 && i + concurrency < appIds.length) {
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return results;
}

async function scanAllAchievements(
  steamId: string,
  appIds: number[]
): Promise<AchievementProgressEntry[]> {
  const unique = [...new Set(appIds)].slice(0, MAX_GAMES_STATS_SCAN);
  return scanInBatches(
    steamId,
    unique,
    scanOneGameQuick,
    SCAN_CONCURRENCY,
    SCAN_DELAY_MS
  );
}

async function filterGamesWithAchievementSchema(
  appIds: number[]
): Promise<number[]> {
  const unique = [...new Set(appIds)];
  const withSchema: number[] = [];

  for (let i = 0; i < unique.length; i += SCHEMA_PREFILTER_CONCURRENCY) {
    const chunk = unique.slice(i, i + SCHEMA_PREFILTER_CONCURRENCY);
    const batch = await Promise.all(
      chunk.map(async (appId) => {
        const schema = await getAchievementSchema(appId);
        return schema.length > 0 ? appId : null;
      })
    );
    withSchema.push(...batch.filter((id): id is number => id !== null));
    if (SCHEMA_PREFILTER_DELAY_MS > 0 && i + SCHEMA_PREFILTER_CONCURRENCY < unique.length) {
      await new Promise((r) => setTimeout(r, SCHEMA_PREFILTER_DELAY_MS));
    }
  }

  return withSchema;
}

function orderCompletionScanIds(
  candidateAppIds: number[],
  progressQuick: AchievementProgressEntry[],
  playtimeByAppId: Map<number, number> = new Map()
): number[] {
  const fullyUnlocked = new Set(
    progressQuick
      .filter((p) => p.total > 0 && p.unlocked === p.total)
      .map((p) => p.appid)
  );
  const nearComplete = new Set(
    progressQuick
      .filter((p) => p.total > 0 && p.unlocked / p.total >= 0.85)
      .map((p) => p.appid)
  );
  const withProgress = new Set(
    progressQuick
      .filter((p) => p.total > 0 && p.unlocked > 0)
      .map((p) => p.appid)
  );

  const unique = [...new Set(candidateAppIds)];
  return unique.sort((a, b) => {
    const score = (id: number) => {
      if (fullyUnlocked.has(id)) return 0;
      if (nearComplete.has(id)) return 1;
      if (withProgress.has(id)) return 2;
      return 3;
    };
    const sa = score(a);
    const sb = score(b);
    if (sa !== sb) return sa - sb;
    return (playtimeByAppId.get(b) ?? 0) - (playtimeByAppId.get(a) ?? 0);
  });
}

async function scanAllCompletedGames(
  steamId: string,
  orderedAppIds: number[]
): Promise<AchievementProgressEntry[]> {
  return scanInBatches(
    steamId,
    orderedAppIds,
    scanOneGameAccurate,
    COMPLETION_SCAN_CONCURRENCY,
    COMPLETION_SCAN_DELAY_MS
  );
}

export async function fetchRarestProfileAchievements(
  steamId: string,
  games: { appid: number; name: string }[],
  limit = 8
): Promise<{ rarest: RareAchievement[]; gamesScanned: number }> {
  const targets = games.slice(0, MAX_GAMES_RARE_SCAN);
  const pool: RareAchievement[] = [];

  for (let i = 0; i < targets.length; i += RARE_BATCH) {
    const chunk = targets.slice(i, i + RARE_BATCH);
    const batchResults = await Promise.all(
      chunk.map(async (game) => {
        try {
          const [playerData, percents, schema] = await Promise.all([
            fetchPlayerAchievementData(steamId, game.appid),
            getGlobalAchievementPercentages(game.appid),
            getAchievementSchema(game.appid),
          ]);

          if (playerData.achievements.length === 0) return [];

          const schemaMap = new Map(schema.map((s) => [s.name, s]));
          const pctMap = new Map(
            percents.map((p) => [p.name, Number(p.percent) || 0])
          );
          const found: RareAchievement[] = [];

          for (const ach of playerData.achievements) {
            if (!isAchievementUnlocked(ach.achieved)) continue;
            const percent = pctMap.get(ach.apiname) ?? 100;
            const info = schemaMap.get(ach.apiname);
            found.push({
              name: info?.displayName ?? ach.apiname,
              description: info?.description ?? "",
              percent,
              icon: buildAchievementIconUrl(game.appid, info?.icon),
              gameName: game.name,
              appid: game.appid,
            });
          }
          return found;
        } catch {
          return [];
        }
      })
    );

    pool.push(...batchResults.flat());
    if (i + RARE_BATCH < targets.length) {
      await new Promise((r) => setTimeout(r, 30));
    }
  }

  const rarest = pool
    .sort((a, b) => a.percent - b.percent)
    .slice(0, limit);

  return { rarest, gamesScanned: targets.length };
}

function isFullyComplete(entry: AchievementProgressEntry): boolean {
  return entry.verified === true && entry.total > 0 && entry.unlocked === entry.total;
}

function buildCompletedGamesList(
  progress: AchievementProgressEntry[],
  gameNames: Map<number, string>,
  headerByAppId: Map<number, string>
): CompletedGameEntry[] {
  const byAppId = new Map<number, CompletedGameEntry>();

  for (const p of progress) {
    if (!isFullyComplete(p)) continue;
    byAppId.set(p.appid, {
      appid: p.appid,
      name: gameNames.get(p.appid) ?? `App ${p.appid}`,
      headerImage: headerByAppId.get(p.appid),
      achievementUnlocked: p.unlocked,
      achievementTotal: p.total,
    });
  }

  return [...byAppId.values()].sort(
    (a, b) => b.achievementTotal - a.achievementTotal
  );
}

async function enrichCompletedGameHeaders(
  completed: CompletedGameEntry[]
): Promise<Map<number, string>> {
  const missing = completed
    .filter((g) => !g.headerImage)
    .map((g) => g.appid);
  if (missing.length === 0) return new Map();

  const details = await getAppDetailsBatchConcurrent(missing, 8, 40);
  const headers = new Map<number, string>();
  for (const appId of missing) {
    const img =
      details.get(appId)?.header_image ??
      `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;
    headers.set(appId, img);
  }
  return headers;
}

function aggregateAchievementStats(progress: AchievementProgressEntry[]) {
  let totalUnlocked = 0;
  let totalPossible = 0;
  let gamesWithAchievements = 0;

  for (const p of progress) {
    if (p.total <= 0) continue;
    gamesWithAchievements++;
    totalUnlocked += p.unlocked;
    totalPossible += p.total;
  }

  return {
    totalUnlocked,
    totalPossible,
    gamesWithAchievements,
    completionRate:
      totalPossible > 0
        ? Math.round((totalUnlocked / totalPossible) * 100)
        : 0,
  };
}

export async function resolveAchievementTotals(
  steamId: string,
  ownedAppIds: number[],
  gamesForRare: { appid: number; name: string }[],
  headerByAppId: Map<number, string> = new Map(),
  playtimeByAppId: Map<number, number> = new Map()
) {
  const topToScan = [...ownedAppIds].slice(0, MAX_GAMES_STATS_SCAN);
  const gameNames = new Map(gamesForRare.map((g) => [g.appid, g.name]));

  const [profileShowcase, progressQuick, schemaAppIds] = await Promise.all([
      getProfileShowcaseStats(steamId),
      scanAllAchievements(steamId, topToScan),
      filterGamesWithAchievementSchema(ownedAppIds),
    ]);

  const profileTotal = profileShowcase.totalAchievements;

  const completionScanIds = orderCompletionScanIds(
    schemaAppIds,
    progressQuick,
    playtimeByAppId
  );
  const completionProgress = await scanAllCompletedGames(
    steamId,
    completionScanIds
  );

  const completedIds = new Set(
    completionProgress.filter(isFullyComplete).map((p) => p.appid)
  );
  const rescanCandidates = progressQuick
    .filter(
      (p) =>
        p.total > 0 &&
        p.unlocked === p.total &&
        !completedIds.has(p.appid)
    )
    .map((p) => p.appid);

  let extraCompletion: AchievementProgressEntry[] = [];
  if (rescanCandidates.length > 0) {
    extraCompletion = await scanInBatches(
      steamId,
      rescanCandidates,
      scanOneGameAccurate,
      COMPLETION_SCAN_CONCURRENCY,
      COMPLETION_SCAN_DELAY_MS
    );
  }

  const rareResult = await fetchRarestProfileAchievements(
    steamId,
    gamesForRare
  );

  const allCompletionCandidates = [...completionProgress, ...extraCompletion];

  let completedGamesList = buildCompletedGamesList(
    allCompletionCandidates,
    gameNames,
    headerByAppId
  );

  const extraHeaders = await enrichCompletedGameHeaders(completedGamesList);
  if (extraHeaders.size > 0) {
    completedGamesList = completedGamesList.map((g) => ({
      ...g,
      headerImage: g.headerImage ?? extraHeaders.get(g.appid),
    }));
  }

  const completedGames = completedGamesList.length;
  const scanned = aggregateAchievementStats(progressQuick);

  const progressByAppId = new Map<number, AchievementProgressEntry>();
  for (const p of progressQuick) progressByAppId.set(p.appid, p);
  for (const p of completionProgress) progressByAppId.set(p.appid, p);
  for (const p of extraCompletion) progressByAppId.set(p.appid, p);

  const fullLibraryAgg = aggregateAchievementStats([...progressByAppId.values()]);
  const completedAchievementsSum = completedGamesList.reduce(
    (sum, game) => sum + game.achievementUnlocked,
    0
  );

  const totalUnlocked = Math.max(
    profileTotal ?? 0,
    profileShowcase.perfectAchievements ?? 0,
    completedAchievementsSum,
    fullLibraryAgg.totalUnlocked,
    scanned.totalUnlocked
  );

  return {
    totalUnlocked,
    totalPossible: fullLibraryAgg.totalPossible || scanned.totalPossible,
    completedGames,
    completedGamesList,
    gamesWithAchievements:
      fullLibraryAgg.gamesWithAchievements || scanned.gamesWithAchievements,
    completionRate:
      fullLibraryAgg.totalPossible > 0
        ? Math.round(
            (fullLibraryAgg.totalUnlocked / fullLibraryAgg.totalPossible) * 100
          )
        : scanned.completionRate,
    scannedCount: fullLibraryAgg.totalUnlocked || scanned.totalUnlocked,
    profileCount: profileTotal,
    profilePerfectGames: profileShowcase.perfectGames,
    profilePerfectAchievements: profileShowcase.perfectAchievements,
    fromProfile:
      profileTotal !== null && profileTotal >= (fullLibraryAgg.totalUnlocked || 0),
    rarest: rareResult.rarest,
    rareGamesScanned: rareResult.gamesScanned,
    statsGamesScanned: topToScan.length,
    completionScannedCount: completionScanIds.length,
    libraryGamesWithSchema: schemaAppIds.length,
    progressByAppId,
  };
}
