import { generateWrapped } from "./analyzer";
import { getCachedWrapped, setCachedWrapped } from "./cache";
import type { WrappedData } from "@/types/wrapped";

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
  if (!skipCache) {
    const cached = await getCachedWrapped(steamId);
    if (cached && !isBrokenCache(cached)) return cached;
  }

  const data = await generateWrapped(steamId);
  await setCachedWrapped(steamId, data);
  return data;
}
