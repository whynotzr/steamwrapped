import type {
  SteamAchievement,
  SteamAchievementSchema,
  SteamAppDetails,
  SteamBadge,
  SteamOwnedGame,
  SteamPlayerSummary,
} from "./types";

const STEAM_API = "https://api.steampowered.com";
const STORE_API = "https://store.steampowered.com/api/appdetails";

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) throw new Error("STEAM_API_KEY manquant dans .env.local");
  return key;
}

async function steamFetch<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status} (GET ${url.split("?")[0]})`);
  }
  return res.json() as Promise<T>;
}

export async function resolveVanityUrl(vanityUrl: string): Promise<string> {
  const key = getApiKey();
  const data = await steamFetch<{
    response: { success: number; steamid?: string; message?: string };
  }>(
    `${STEAM_API}/ISteamUser/ResolveVanityURL/v0001/?key=${key}&vanityurl=${encodeURIComponent(vanityUrl)}`
  );

  if (data.response.success !== 1 || !data.response.steamid) {
    throw new Error(`Steam profile not found: "${vanityUrl}"`);
  }

  return data.response.steamid;
}

export async function getPlayerSummary(
  steamId: string
): Promise<SteamPlayerSummary | null> {
  const key = getApiKey();
  const data = await steamFetch<{
    response: { players: SteamPlayerSummary[] };
  }>(
    `${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/?key=${key}&steamids=${steamId}`
  );
  return data.response.players[0] ?? null;
}

export async function getOwnedGames(steamId: string): Promise<SteamOwnedGame[]> {
  const key = getApiKey();
  const data = await steamFetch<{
    response: { game_count: number; games?: SteamOwnedGame[] };
  }>(
    `${STEAM_API}/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1&skip_unvetted_apps=false`
  );
  return data.response.games ?? [];
}

export async function getSteamLevel(steamId: string): Promise<number> {
  const key = getApiKey();
  const data = await steamFetch<{ response: { player_level: number } }>(
    `${STEAM_API}/IPlayerService/GetSteamLevel/v1/?key=${key}&steamid=${steamId}`
  );
  return data.response.player_level;
}

export async function getBadges(steamId: string): Promise<SteamBadge[]> {
  const key = getApiKey();
  const data = await steamFetch<{
    response: { badges?: SteamBadge[] };
  }>(`${STEAM_API}/IPlayerService/GetBadges/v1/?key=${key}&steamid=${steamId}`);
  return data.response.badges ?? [];
}

export async function getRecentlyPlayedGames(
  steamId: string,
  count = 0
): Promise<SteamOwnedGame[]> {
  const key = getApiKey();
  const data = await steamFetch<{
    response: { total_count?: number; games?: SteamOwnedGame[] };
  }>(
    `${STEAM_API}/IPlayerService/GetRecentlyPlayedGames/v1/?key=${key}&steamid=${steamId}&count=${count}`
  );
  return data.response.games ?? [];
}

function isSteamApiSuccess(value: unknown): boolean {
  return value === 1 || value === true;
}

export async function getPlayerAchievements(
  steamId: string,
  appId: number
): Promise<{ success: boolean; achievements: SteamAchievement[] }> {
  const key = getApiKey();
  const data = await steamFetch<{
    playerstats?: {
      success?: number | boolean;
      achievements?: SteamAchievement[];
    };
  }>(
    `${STEAM_API}/ISteamUserStats/GetPlayerAchievements/v1/?key=${key}&steamid=${steamId}&appid=${appId}`
  );
  const stats = data.playerstats;
  return {
    success: isSteamApiSuccess(stats?.success),
    achievements: stats?.achievements ?? [],
  };
}

/** Stats complètes d'un jeu — fiable avec clé API standard. */
export async function getUserStatsForGame(
  steamId: string,
  appId: number
): Promise<{
  gameName?: string;
  achievements?: SteamAchievement[];
} | null> {
  const key = getApiKey();
  const data = await steamFetch<{
    playerstats?: {
      gameName?: string;
      achievements?: SteamAchievement[];
    };
  }>(
    `${STEAM_API}/ISteamUserStats/GetUserStatsForGame/v2/?key=${key}&steamid=${steamId}&appid=${appId}`
  );
  return data.playerstats ?? null;
}

export async function getAchievementSchema(
  appId: number
): Promise<SteamAchievementSchema[]> {
  const key = getApiKey();
  const data = await steamFetch<{
    game?: {
      availableGameStats?: {
        achievements?: SteamAchievementSchema[];
      };
    };
  }>(
    `${STEAM_API}/ISteamUserStats/GetSchemaForGame/v2/?key=${key}&appid=${appId}`
  );
  return data.game?.availableGameStats?.achievements ?? [];
}

export async function getGlobalAchievementPercentages(
  appId: number
): Promise<{ name: string; percent: number }[]> {
  try {
    const data = await steamFetch<{
      achievementpercentages?: {
        achievements: { name: string; percent: number }[];
      };
    }>(
      `${STEAM_API}/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v2/?gameid=${appId}`
    );
    return data.achievementpercentages?.achievements ?? [];
  } catch {
    return [];
  }
}

const appDetailsCache = new Map<number, SteamAppDetails | null>();

export async function getAppDetails(
  appId: number
): Promise<SteamAppDetails | null> {
  if (appDetailsCache.has(appId)) return appDetailsCache.get(appId) ?? null;

  try {
    const res = await fetch(`${STORE_API}?appids=${appId}&cc=fr&l=french`, {
      next: { revalidate: 86400 },
    });
    const json = await res.json();
    const entry = json[appId.toString()];
    const details: SteamAppDetails | null = entry?.success
      ? entry.data
      : null;
    appDetailsCache.set(appId, details);
    return details;
  } catch {
    appDetailsCache.set(appId, null);
    return null;
  }
}

export async function getAppDetailsBatch(
  appIds: number[],
  delayMs = 0
): Promise<Map<number, SteamAppDetails | null>> {
  return getAppDetailsBatchConcurrent(appIds, 10, delayMs);
}

export async function getAppDetailsBatchConcurrent(
  appIds: number[],
  concurrency = 10,
  delayBetweenChunksMs = 40
): Promise<Map<number, SteamAppDetails | null>> {
  const result = new Map<number, SteamAppDetails | null>();

  for (let i = 0; i < appIds.length; i += concurrency) {
    const chunk = appIds.slice(i, i + concurrency);
    const details = await Promise.all(chunk.map((id) => getAppDetails(id)));
    chunk.forEach((id, idx) => result.set(id, details[idx]));
    if (delayBetweenChunksMs > 0 && i + concurrency < appIds.length) {
      await new Promise((r) => setTimeout(r, delayBetweenChunksMs));
    }
  }

  return result;
}
