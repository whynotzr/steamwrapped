import { resolveVanityUrl } from "./api";

/** Transforme pseudo, URL ou Steam ID en Steam ID64. */
export async function resolveSteamId(input: string): Promise<string> {
  const trimmed = decodeURIComponent(input.trim());

  const profileMatch = trimmed.match(
    /steamcommunity\.com\/profiles\/(\d{17})/i
  );
  if (profileMatch) return profileMatch[1];

  const vanityUrlMatch = trimmed.match(
    /steamcommunity\.com\/id\/([^/?#\s]+)/i
  );
  if (vanityUrlMatch) {
    return resolveVanityUrl(vanityUrlMatch[1]);
  }

  if (/^7656\d{13}$/.test(trimmed)) return trimmed;

  if (/^[a-zA-Z0-9_-]{2,32}$/.test(trimmed)) {
    return resolveVanityUrl(trimmed);
  }

  throw new Error(
    "Format invalide. Colle un pseudo Steam, une URL de profil, ou un Steam ID."
  );
}
