import { getPlayerSummary } from "@/lib/steam/api";
import { getCachedWrapped } from "@/lib/wrapped/cache";
import { LOCALE } from "@/lib/locale";
import type { WrappedData } from "@/types/wrapped";
import type { SteamPlayerSummary } from "@/lib/steam/types";

export type PreviewData =
  | { kind: "full"; wrapped: WrappedData }
  | { kind: "minimal"; profile: SteamPlayerSummary };

export async function getWrappedPreview(
  steamId: string
): Promise<PreviewData | null> {
  const cached = await getCachedWrapped(steamId);
  if (cached) return { kind: "full", wrapped: cached };

  const profile = await getPlayerSummary(steamId);
  if (!profile) return null;
  return { kind: "minimal", profile };
}

export function buildWrappedMetadata(
  steamId: string,
  preview: PreviewData
): {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
} {
  if (preview.kind === "full") {
    const { wrapped } = preview;
    const title = `${wrapped.profile.personaName} — Steam Wrapped`;
    const description = `${wrapped.playtime.totalHours.toLocaleString(LOCALE)}h played · ${wrapped.library.totalGames} games · ${wrapped.achievements.totalUnlocked} achievements · ${wrapped.personality.title}`;
    return {
      title,
      description,
      ogTitle: `${wrapped.profile.personaName} — Steam Wrapped`,
      ogDescription: `${wrapped.summary.headline} — ${wrapped.summary.subheadline}`,
    };
  }

  const { profile } = preview;
  return {
    title: `${profile.personaname} — Steam Wrapped`,
    description: `Discover ${profile.personaname}'s Steam Wrapped`,
    ogTitle: `${profile.personaname} — Steam Wrapped`,
    ogDescription: `Playtime, top games, rare achievements, and roasts — click to view.`,
  };
}
