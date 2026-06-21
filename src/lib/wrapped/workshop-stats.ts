import {
  fetchAllUserPublishedContent,
  WORKSHOP_FILE_TYPES,
  type SteamPublishedFile,
} from "@/lib/steam/workshop";
import type { WorkshopItem, WorkshopStats } from "@/types/wrapped";

const FILE_TYPE_LABELS: Record<number, string> = {
  0: "Workshop",
  2: "Collection",
  3: "Art / Poster",
  5: "Screenshot",
  9: "Web guide",
  10: "Integrated guide",
};

function isWallpaper(file: SteamPublishedFile): boolean {
  const tags = (file.tags ?? []).map((t) => t.tag.toLowerCase());
  if (tags.some((t) => t.includes("wallpaper"))) return true;
  if (file.app_name?.toLowerCase().includes("wallpaper")) return true;
  if (file.consumer_appid === 431960) return true;
  return file.file_type === WORKSHOP_FILE_TYPES.art;
}

function isGuide(file: SteamPublishedFile): boolean {
  return (
    file.file_type === WORKSHOP_FILE_TYPES.webGuide ||
    file.file_type === WORKSHOP_FILE_TYPES.integratedGuide
  );
}

function toWorkshopItem(file: SteamPublishedFile): WorkshopItem {
  const subs = Math.max(
    file.lifetime_subscriptions,
    file.subscriptions
  );
  const favs = Math.max(file.lifetime_favorited, file.favorited);

  return {
    publishedFileId: file.publishedfileid,
    title: file.title,
    previewUrl: file.preview_url,
    fileType: file.file_type,
    fileTypeLabel: FILE_TYPE_LABELS[file.file_type] ?? "UGC",
    appName: file.app_name,
    subscriptions: subs,
    favorites: favs,
    views: file.views,
    votesUp: file.vote_data?.votes_up ?? 0,
    url: file.url ?? "",
  };
}

function topBy(
  files: SteamPublishedFile[],
  limit: number
): WorkshopItem[] {
  return [...files]
    .sort(
      (a, b) =>
        Math.max(b.lifetime_subscriptions, b.subscriptions) -
        Math.max(a.lifetime_subscriptions, a.subscriptions)
    )
    .slice(0, limit)
    .map(toWorkshopItem);
}

export async function resolveWorkshopStats(
  steamId: string
): Promise<WorkshopStats> {
  const files = await fetchAllUserPublishedContent(steamId);

  const guides = files.filter(isGuide);
  const wallpapers = files.filter(isWallpaper);
  const workshop = files.filter(
    (f) =>
      f.file_type === WORKSHOP_FILE_TYPES.community &&
      !isWallpaper(f) &&
      !isGuide(f)
  );
  const other = files.filter(
    (f) => !isGuide(f) && !isWallpaper(f) && f.file_type !== 0
  );

  const topOverall = topBy(files, 6);

  return {
    totalPublished: files.length,
    totalSubscriptions: files.reduce(
      (s, f) => s + Math.max(f.lifetime_subscriptions, f.subscriptions),
      0
    ),
    totalFavorites: files.reduce(
      (s, f) => s + Math.max(f.lifetime_favorited, f.favorited),
      0
    ),
    totalViews: files.reduce((s, f) => s + f.views, 0),
    topOverall,
    topGuides: topBy(guides, 5),
    topWallpapers: topBy(wallpapers, 5),
    topWorkshop: topBy(workshop, 5),
    topOther: topBy(other, 4),
    hasContent: files.length > 0,
  };
}
