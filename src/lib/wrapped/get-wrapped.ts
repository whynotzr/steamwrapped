import { generateWrapped } from "./analyzer";
import { getCachedWrapped, setCachedWrapped } from "./cache";
import type { WrappedData } from "@/types/wrapped";
import { playtimeHours } from "./playtime-stats";

function repairCachedWrapped(data: WrappedData): WrappedData {
  const byNumberLabels = new Set(data.replay.byTheNumbers.map((n) => n.label));
  const extraNumbers = [
    {
      label: "Active games (2 weeks)",
      value: data.activity.gamesPlayedLastTwoWeeks ?? 0,
    },
    {
      label: "Recent hours",
      value: Math.round((data.activity.minutesLastTwoWeeks ?? 0) / 60),
    },
    {
      label: "Library value",
      value: data.library.estimatedLibraryValue,
    },
    {
      label: "Backlog value",
      value: data.library.estimatedBacklogValue,
    },
  ].filter((item) => !byNumberLabels.has(item.label));

  const repaired = {
    ...data,
    statsVersion: Math.max(data.statsVersion ?? 1, 11),
    activity: {
      ...data.activity,
      gamesPlayedLastTwoWeeks: data.activity.gamesPlayedLastTwoWeeks ?? 0,
      minutesLastTwoWeeks: data.activity.minutesLastTwoWeeks ?? 0,
    },
    replay: {
      ...data.replay,
      byTheNumbers: [...data.replay.byTheNumbers, ...extraNumbers],
      libraryRecords: data.replay.libraryRecords ?? {
        topGameHours: data.topGames[0]
          ? playtimeHours(data.topGames[0].playtime_forever)
          : 0,
        topGameName: data.topGames[0]?.name ?? "Unknown",
      },
    },
  };

  return repaired;
}

function isBrokenCache(data: WrappedData): boolean {
  if (
    data.achievements.totalUnlocked === 0 &&
    data.library.playedGames > 30
  ) {
    return true;
  }

  if (data.achievements.profileCount === undefined) {
    return true;
  }

  if (
    data.achievements.profileCount &&
    data.achievements.profileCount >
      data.achievements.totalUnlocked + 500
  ) {
    return true;
  }

  if (!data.extras?.playtimeTopLabel) {
    return true;
  }

  // Ancien format avec sélecteur d'année
  if ("year" in (data as unknown as Record<string, unknown>)) {
    return true;
  }

  if (!data.extras.uniqueFacts) {
    return true;
  }

  if ((data.statsVersion ?? 1) < 11) {
    return true;
  }

  if (!data.workshop) {
    return true;
  }

  if (!data.achievements.completedGamesList) {
    return true;
  }

  if (data.achievements.completionScannedCount === undefined) {
    return true;
  }

  if (!data.replay.libraryRecords) {
    return true;
  }

  return false;
}

export async function getWrapped(
  steamId: string,
  { skipCache = false }: { skipCache?: boolean } = {}
): Promise<WrappedData> {
  const cached = await getCachedWrapped(steamId);

  if (!skipCache) {
    if (cached && !isBrokenCache(cached)) return cached;
  }

  try {
    const data = await generateWrapped(steamId);
    await setCachedWrapped(steamId, data);
    return data;
  } catch (error) {
    if (cached) {
      const repaired = repairCachedWrapped(cached);
      await setCachedWrapped(steamId, repaired);
      return repaired;
    }
    throw error;
  }
}
