const STEAM_API = "https://api.steampowered.com";

/** Types UGC Steam — voir EWorkshopFileType */
export const WORKSHOP_FILE_TYPES = {
  community: 0,
  collection: 2,
  art: 3,
  screenshot: 5,
  webGuide: 9,
  integratedGuide: 10,
} as const;

export interface SteamPublishedFile {
  publishedfileid: string;
  title: string;
  preview_url?: string;
  file_type: number;
  app_name?: string;
  consumer_appid?: number;
  subscriptions: number;
  favorited: number;
  views: number;
  lifetime_subscriptions: number;
  lifetime_favorited: number;
  tags?: { tag: string }[];
  vote_data?: { votes_up: number; votes_down: number; score: number };
  time_updated?: number;
  url?: string;
}

function getApiKey(): string {
  const key = process.env.STEAM_API_KEY;
  if (!key) throw new Error("STEAM_API_KEY manquant dans .env.local");
  return key;
}

function parseFile(raw: Record<string, unknown>): SteamPublishedFile | null {
  if (raw.result !== 1 && raw.result !== "1") return null;
  const id = String(raw.publishedfileid ?? "");
  if (!id) return null;

  return {
    publishedfileid: id,
    title: String(raw.title ?? "Sans titre"),
    preview_url: raw.preview_url ? String(raw.preview_url) : undefined,
    file_type: Number(raw.file_type ?? 0),
    app_name: raw.app_name ? String(raw.app_name) : undefined,
    consumer_appid: raw.consumer_appid
      ? Number(raw.consumer_appid)
      : undefined,
    subscriptions: Number(raw.subscriptions ?? 0),
    favorited: Number(raw.favorited ?? 0),
    views: Number(raw.views ?? 0),
    lifetime_subscriptions: Number(raw.lifetime_subscriptions ?? 0),
    lifetime_favorited: Number(raw.lifetime_favorited ?? 0),
    tags: Array.isArray(raw.tags)
      ? (raw.tags as { tag: string }[])
      : undefined,
    vote_data: raw.vote_data as SteamPublishedFile["vote_data"],
    time_updated: raw.time_updated ? Number(raw.time_updated) : undefined,
    url: `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`,
  };
}

export async function getUserPublishedFiles(
  steamId: string,
  options: {
    appid?: number;
    filetype?: number;
    page?: number;
    numperpage?: number;
    sortmethod?: string;
  } = {}
): Promise<{ total: number; files: SteamPublishedFile[] }> {
  const key = getApiKey();
  const params = new URLSearchParams({
    key,
    steamid: steamId,
    page: String(options.page ?? 1),
    numperpage: String(options.numperpage ?? 50),
    return_previews: "1",
    return_vote_data: "1",
    return_tags: "1",
    sortmethod: options.sortmethod ?? "subscriptions",
    language: "french",
  });

  if (options.appid !== undefined) params.set("appid", String(options.appid));
  if (options.filetype !== undefined)
    params.set("filetype", String(options.filetype));

  try {
    const res = await fetch(
      `${STEAM_API}/IPublishedFileService/GetUserFiles/v1/?${params}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return { total: 0, files: [] };

    const data = (await res.json()) as {
      response?: {
        total?: number;
        publishedfiledetails?: Record<string, unknown>[];
      };
    };

    const files = (data.response?.publishedfiledetails ?? [])
      .map(parseFile)
      .filter((f): f is SteamPublishedFile => f !== null);

    return { total: data.response?.total ?? files.length, files };
  } catch {
    return { total: 0, files: [] };
  }
}

/** Récupère tout le contenu publié par l'utilisateur (plusieurs pages si besoin). */
export async function fetchAllUserPublishedContent(
  steamId: string,
  maxItems = 120
): Promise<SteamPublishedFile[]> {
  const all: SteamPublishedFile[] = [];
  const seen = new Set<string>();

  for (let page = 1; page <= 3 && all.length < maxItems; page++) {
    const { files } = await getUserPublishedFiles(steamId, {
      page,
      numperpage: 50,
      sortmethod: "subscriptions",
    });
    if (files.length === 0) break;
    for (const f of files) {
      if (!seen.has(f.publishedfileid)) {
        seen.add(f.publishedfileid);
        all.push(f);
      }
    }
    if (files.length < 50) break;
  }

  return all.slice(0, maxItems);
}
