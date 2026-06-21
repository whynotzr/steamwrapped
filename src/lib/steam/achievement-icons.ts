const ICON_CDN_BASES = [
  "https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps",
  "https://cdn.steamstatic.com/steamcommunity/public/images/apps",
  "https://steamcdn-a.akamaihd.net/steamcommunity/public/images/apps",
] as const;

function normalizeIconFile(icon: string): string {
  const trimmed = icon.trim();
  if (!trimmed) return "";
  if (trimmed.includes("/")) return trimmed.split("/").pop() ?? trimmed;
  return trimmed.includes(".") ? trimmed : `${trimmed}.jpg`;
}

/** URLs Steam valides pour l'icône d'un succès (schéma → CDN). */
export function getAchievementIconUrls(
  appId: number,
  icon?: string
): string[] {
  if (!icon) return [];
  if (icon.startsWith("http")) return [icon];

  const file = normalizeIconFile(icon);
  if (!file) return [];

  return ICON_CDN_BASES.map((base) => `${base}/${appId}/${file}`);
}

export function buildAchievementIconUrl(appId: number, icon?: string): string {
  return getAchievementIconUrls(appId, icon)[0] ?? "";
}
