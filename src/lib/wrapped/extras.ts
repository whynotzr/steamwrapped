import type { RareAchievement } from "@/types/wrapped";
import type { SteamOwnedGame } from "@/lib/steam/types";
import { playtimePercent } from "./playtime-stats";

export interface WrappedExtras {
  playtimeTopPercent: number;
  playtimeTopLabel: string;
  avgHoursPerPlayedGame: number;
  topGameSharePercent: number;
  totalBadges: number;
  totalBadgeXp: number;
  freeGamesCount: number;
  hoursPerDayLifetime: number;
  topDeveloper: { name: string; hours: number; percent: number } | null;
  rarestSpotlight: RareAchievement | null;
  ultraRareCount: number;
  funFacts: string[];
}

export function estimatePlaytimePercentile(hours: number): {
  topPercent: number;
  label: string;
} {
  if (hours >= 8000) return { topPercent: 1, label: "Top 1% worldwide" };
  if (hours >= 4000) return { topPercent: 3, label: "Top 3% worldwide" };
  if (hours >= 2000) return { topPercent: 8, label: "Top 8% worldwide" };
  if (hours >= 1000) return { topPercent: 15, label: "Top 15% worldwide" };
  if (hours >= 500) return { topPercent: 30, label: "Top 30% worldwide" };
  if (hours >= 200) return { topPercent: 50, label: "Top 50% worldwide" };
  return { topPercent: 70, label: "Rising player" };
}

export function computeExtras(
  totalHours: number,
  accountAgeYears: number,
  playedGames: number,
  topGame: { playtime_forever: number; name: string } | undefined,
  played: SteamOwnedGame[],
  devByAppId: Map<number, string[] | undefined>,
  totalMinutes: number,
  badges: { xp: number }[],
  freeCount: number,
  rarest: RareAchievement[]
): WrappedExtras {
  const percentile = estimatePlaytimePercentile(totalHours);
  const topShare = topGame
    ? playtimePercent(topGame.playtime_forever, totalMinutes)
    : 0;

  const devMap = new Map<string, number>();
  for (const g of played) {
    const h = g.playtime_forever / 60;
    if (h <= 0) continue;
    const devs = devByAppId.get(g.appid)?.filter(Boolean) ?? [];
    const labels = devs.length > 0 ? devs : [];
    if (labels.length === 0) continue;
    const share = h / labels.length;
    for (const d of labels) {
      devMap.set(d, (devMap.get(d) ?? 0) + share);
    }
  }
  const topDev = [...devMap.entries()].sort((a, b) => b[1] - a[1])[0];
  const totalHoursFloat = totalMinutes / 60;

  const accountDays = Math.max(accountAgeYears * 365, 1);
  const hoursPerDay = Math.round((totalHours / accountDays) * 10) / 10;

  const ultraRare = rarest.filter((r) => r.percent <= 1).length;

  const funFacts: string[] = [];
  if (totalHours >= 5000)
    funFacts.push(
      `You've played the equivalent of ${Math.round(totalHours / 24)} days non-stop`
    );
  if (topShare >= 40 && topGame)
    funFacts.push(`${topShare}% of your time = ${topGame.name}`);
  if (freeCount > 50)
    funFacts.push(`${freeCount} free games in your library`);
  if (hoursPerDay >= 3)
    funFacts.push(`${hoursPerDay}h/day on average since you joined`);

  return {
    playtimeTopPercent: percentile.topPercent,
    playtimeTopLabel: percentile.label,
    avgHoursPerPlayedGame:
      playedGames > 0 ? Math.round(totalHours / playedGames) : 0,
    topGameSharePercent: topShare,
    totalBadges: badges.length,
    totalBadgeXp: badges.reduce((s, b) => s + (b.xp ?? 0), 0),
    freeGamesCount: freeCount,
    hoursPerDayLifetime: hoursPerDay,
    topDeveloper: topDev
      ? {
          name: topDev[0],
          hours: Math.round(topDev[1]),
          percent:
            totalHoursFloat > 0
              ? Math.round((topDev[1] / totalHoursFloat) * 100)
              : 0,
        }
      : null,
    rarestSpotlight: rarest[0] ?? null,
    ultraRareCount: ultraRare,
    funFacts,
  };
}
