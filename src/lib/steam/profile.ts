const PROFILE_FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept-Language": "en-US,en;q=0.9",
  Accept: "text/html,application/xhtml+xml",
  Referer: "https://steamcommunity.com/",
};

function normalizeLabel(label: string): string {
  return label
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/\s+/g, " ")
    .trim();
}

function parseLocalizedInt(raw: string): number | null {
  const cleaned = raw.replace(/[\s.,\u00a0\u202f?]/g, "");
  const num = parseInt(cleaned, 10);
  return Number.isNaN(num) ? null : num;
}

async function fetchProfileHtml(steamId: string): Promise<string | null> {
  const urls = [
    `https://steamcommunity.com/profiles/${steamId}?l=english`,
    `https://steamcommunity.com/profiles/${steamId}/?l=english`,
    `https://steamcommunity.com/profiles/${steamId}/stats/?tab=achievements&l=english`,
    `https://steamcommunity.com/profiles/${steamId}?l=french`,
    `https://steamcommunity.com/profiles/${steamId}/stats/?tab=achievements&l=french`,
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: PROFILE_FETCH_HEADERS,
        cache: "no-store",
      });
      if (!res.ok) continue;
      const html = await res.text();
      if (html.includes("fatalerror") || html.includes("profile_private_info")) {
        continue;
      }
      return html;
    } catch {
      continue;
    }
  }

  return null;
}

export interface ProfileShowcaseStats {
  totalAchievements: number | null;
  perfectGames: number | null;
  perfectAchievements: number | null;
}

function parseShowcaseStatsFromHtml(html: string): ProfileShowcaseStats {
  let totalAchievements: number | null = null;
  let perfectGames: number | null = null;
  let perfectAchievements: number | null = null;

  const labelPairs = html.matchAll(
    /class="value">([\d\s.,\u00a0\u202f?]+)<\/div>\s*<div class="label">([^<]+)<\/div>/gi
  );

  for (const match of labelPairs) {
    const value = parseLocalizedInt(match[1]);
    const label = normalizeLabel(match[2]);
    if (value === null) continue;

    if (label === "achievements" || label === "succes") {
      totalAchievements = Math.max(totalAchievements ?? 0, value);
      continue;
    }

    if (
      (label.includes("games completed") || label.includes("jeux termin")) &&
      label.includes("100") &&
      !label.includes("achiev") &&
      !label.includes("succ")
    ) {
      perfectGames = Math.max(perfectGames ?? 0, value);
      continue;
    }

    if (
      (label.includes("achiev") || label.includes("succ")) &&
      label.includes("100")
    ) {
      perfectAchievements = Math.max(perfectAchievements ?? 0, value);
    }
  }

  const jsonPatterns: {
    key: RegExp;
    target: keyof ProfileShowcaseStats;
  }[] = [
    { key: /"nAchievements"\s*:\s*(\d+)/i, target: "totalAchievements" },
    { key: /"total_achievements"\s*:\s*(\d+)/i, target: "totalAchievements" },
    { key: /"nPerfectGames"\s*:\s*(\d+)/i, target: "perfectGames" },
    { key: /"perfect_games"\s*:\s*(\d+)/i, target: "perfectGames" },
    {
      key: /"nAchievementCompletedGames"\s*:\s*(\d+)/i,
      target: "perfectGames",
    },
    {
      key: /"nAchievementsFromCompletedGames"\s*:\s*(\d+)/i,
      target: "perfectAchievements",
    },
  ];

  for (const { key, target } of jsonPatterns) {
    const match = html.match(key);
    if (!match) continue;
    const value = parseLocalizedInt(match[1]);
    if (value === null) continue;
    if (target === "totalAchievements") {
      totalAchievements = Math.max(totalAchievements ?? 0, value);
    } else if (target === "perfectGames") {
      perfectGames = Math.max(perfectGames ?? 0, value);
    } else {
      perfectAchievements = Math.max(perfectAchievements ?? 0, value);
    }
  }

  return { totalAchievements, perfectGames, perfectAchievements };
}

const profileHtmlCache = new Map<string, Promise<string | null>>();

function fetchProfileHtmlCached(steamId: string): Promise<string | null> {
  let pending = profileHtmlCache.get(steamId);
  if (!pending) {
    pending = fetchProfileHtml(steamId).finally(() => {
      profileHtmlCache.delete(steamId);
    });
    profileHtmlCache.set(steamId, pending);
  }
  return pending;
}

/** Compteurs vitrine profil Steam (Succès, jeux 100%, etc.). */
export async function getProfileShowcaseStats(
  steamId: string
): Promise<ProfileShowcaseStats> {
  const html = await fetchProfileHtmlCached(steamId);
  if (!html) {
    return {
      totalAchievements: null,
      perfectGames: null,
      perfectAchievements: null,
    };
  }
  return parseShowcaseStatsFromHtml(html);
}

/** Total succès affiché sur le profil Steam (source officielle). */
export async function getCommunityAchievementCount(
  steamId: string
): Promise<number | null> {
  const stats = await getProfileShowcaseStats(steamId);
  return stats.totalAchievements;
}
