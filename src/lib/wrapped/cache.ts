import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import type { WrappedData } from "@/types/wrapped";

const CACHE_DIR = path.join(process.cwd(), ".cache", "wrapped");
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

interface CacheEntry {
  cachedAt: string;
  data: WrappedData;
}

function cachePath(steamId: string): string {
  return path.join(CACHE_DIR, `${steamId}.json`);
}

export async function getCachedWrapped(
  steamId: string
): Promise<WrappedData | null> {
  try {
    const raw = await readFile(cachePath(steamId), "utf-8");
    const entry: CacheEntry = JSON.parse(raw);
    const age = Date.now() - new Date(entry.cachedAt).getTime();
    if (age > CACHE_TTL_MS) return null;
    return entry.data;
  } catch {
    return null;
  }
}

export async function setCachedWrapped(
  steamId: string,
  data: WrappedData
): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  const entry: CacheEntry = { cachedAt: new Date().toISOString(), data };
  await writeFile(cachePath(steamId), JSON.stringify(entry), "utf-8");
}
