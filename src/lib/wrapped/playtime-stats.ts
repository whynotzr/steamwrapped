import { LOCALE } from "@/lib/locale";
import type { GameWithMeta, GenreStat } from "@/types/wrapped";
import type { SteamOwnedGame } from "@/lib/steam/types";

function releaseCategory(
  year: number | null,
  currentYear: number
): "new" | "recent" | "classic" {
  if (!year) return "classic";
  if (year >= currentYear) return "new";
  if (year >= currentYear - 3) return "recent";
  return "classic";
}

/** Enrichissement Store API — top jeux par playtime */
export const ENRICH_PLAYED_LIMIT = 48;
export const ENRICH_UNPLAYED_LIMIT = 8;

export function playtimeHours(minutes: number): number {
  return Math.round(minutes / 60);
}

export function playtimePercent(
  minutes: number,
  totalMinutes: number
): number {
  if (totalMinutes <= 0 || minutes <= 0) return 0;
  return Math.round((minutes / totalMinutes) * 100);
}

export function computeGenresFromLibrary(
  played: SteamOwnedGame[],
  genreByAppId: Map<number, string[]>
): GenreStat[] {
  const map = new Map<string, { hours: number; count: number }>();
  let genreHoursTotal = 0;

  for (const game of played) {
    const hours = game.playtime_forever / 60;
    if (hours <= 0) continue;

    const genres = genreByAppId.get(game.appid)?.filter(Boolean) ?? [];
    const labels = genres.length > 0 ? genres : ["Other"];
    const share = hours / labels.length;
    genreHoursTotal += hours;

    for (const genre of labels) {
      const existing = map.get(genre) ?? { hours: 0, count: 0 };
      existing.hours += share;
      existing.count += 1;
      map.set(genre, existing);
    }
  }

  return Array.from(map.entries())
    .map(([genre, data]) => ({
      genre,
      hours: Math.round(data.hours),
      percent:
        genreHoursTotal > 0
          ? Math.round((data.hours / genreHoursTotal) * 100)
          : 0,
      gameCount: data.count,
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 8);
}

export function computePlaytimeEraFromLibrary(
  played: SteamOwnedGame[],
  releaseYearByAppId: Map<number, number | null | undefined>
): {
  new: { hours: number; percent: number };
  recent: { hours: number; percent: number };
  classic: { hours: number; percent: number };
} {
  const currentYear = new Date().getFullYear();
  let newH = 0;
  let recentH = 0;
  let classicH = 0;

  for (const g of played) {
    const h = g.playtime_forever / 60;
    if (h <= 0) continue;
    const releaseYear = releaseYearByAppId.get(g.appid) ?? null;
    const cat = releaseCategory(releaseYear ?? null, currentYear);
    if (cat === "new") newH += h;
    else if (cat === "recent") recentH += h;
    else classicH += h;
  }

  const total = newH + recentH + classicH || 1;
  return {
    new: { hours: Math.round(newH), percent: Math.round((newH / total) * 100) },
    recent: {
      hours: Math.round(recentH),
      percent: Math.round((recentH / total) * 100),
    },
    classic: {
      hours: Math.round(classicH),
      percent: Math.round((classicH / total) * 100),
    },
  };
}

export function attachPlaytimeMeta(
  games: GameWithMeta[],
  totalMinutes: number
): GameWithMeta[] {
  return games.map((game) => ({
    ...game,
    playtimePercent: playtimePercent(game.playtime_forever, totalMinutes),
  }));
}

export function buildMetaMaps(enriched: GameWithMeta[]): {
  genreByAppId: Map<number, string[]>;
  releaseYearByAppId: Map<number, number | null | undefined>;
} {
  const genreByAppId = new Map<number, string[]>();
  const releaseYearByAppId = new Map<number, number | null | undefined>();

  for (const g of enriched) {
    genreByAppId.set(g.appid, g.genres);
    releaseYearByAppId.set(g.appid, g.releaseYear);
  }

  return { genreByAppId, releaseYearByAppId };
}

export function computeTopDeveloper(
  played: SteamOwnedGame[],
  devByAppId: Map<number, string[] | undefined>,
  totalMinutes: number
): { name: string; hours: number; percent: number } | null {
  const devMap = new Map<string, number>();

  for (const g of played) {
    const h = g.playtime_forever / 60;
    if (h <= 0) continue;
    const devs = devByAppId.get(g.appid)?.filter(Boolean) ?? [];
    const labels = devs.length > 0 ? devs : ["Unknown"];
    const share = h / labels.length;
    for (const d of labels) {
      devMap.set(d, (devMap.get(d) ?? 0) + share);
    }
  }

  const top = [...devMap.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top || top[0] === "Unknown") return null;

  const totalHours = totalMinutes / 60;
  return {
    name: top[0],
    hours: Math.round(top[1]),
    percent:
      totalHours > 0 ? Math.round((top[1] / totalHours) * 100) : 0,
  };
}

export function buildRollingMonthlyActivity(games: SteamOwnedGame[]): {
  months: number[];
  labels: string[];
  peakMonth: string;
  peakCount: number;
} {
  const now = new Date();
  const buckets = new Array(12).fill(0);
  const labels: string[] = [];

  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(d.toLocaleDateString(LOCALE, { month: "long" }));
  }

  for (const g of games) {
    if (!g.rtime_last_played) continue;
    const played = new Date(g.rtime_last_played * 1000);

    for (let i = 0; i < 12; i++) {
      const start = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const end = new Date(
        now.getFullYear(),
        now.getMonth() - (11 - i) + 1,
        0,
        23,
        59,
        59
      );
      if (played >= start && played <= end) {
        buckets[i]++;
        break;
      }
    }
  }

  const peakIdx = buckets.indexOf(Math.max(...buckets));
  return {
    months: buckets,
    labels,
    peakMonth: labels[peakIdx] ?? "—",
    peakCount: buckets[peakIdx] ?? 0,
  };
}

export function formatLastPlayed(unix?: number): string | null {
  if (!unix) return null;
  const d = new Date(unix * 1000);
  return d.toLocaleDateString(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
