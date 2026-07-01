import { mkdir, readFile, writeFile } from "fs/promises";
import os from "os";
import path from "path";
import type { WrappedData } from "@/types/wrapped";

const STORE_DIR = path.join(os.tmpdir(), "steamwrapped-cache");
const STORE_FILE = path.join(STORE_DIR, "leaderboard.json");

export interface LeaderboardEntry {
  steamId: string;
  personaName: string;
  avatarUrl: string;
  profileUrl: string;
  totalHours: number;
  totalGames: number;
  playedGames: number;
  achievements: number;
  steamLevel: number;
  profileViews: number;
  workshopViews: number;
  lastSeenAt: string;
}

export interface LeaderboardSnapshot {
  entries: LeaderboardEntry[];
  topHours: LeaderboardEntry[];
  topGames: LeaderboardEntry[];
  topViews: LeaderboardEntry[];
  topLevels: LeaderboardEntry[];
  topWorkshopViews: LeaderboardEntry[];
  totals: {
    accounts: number;
    totalHours: number;
    totalGames: number;
    playedGames: number;
    achievements: number;
    profileViews: number;
    workshopViews: number;
    averageSteamLevel: number;
  };
}

interface StoreFile {
  entries: Record<string, LeaderboardEntry>;
}

function emptyStore(): StoreFile {
  return { entries: {} };
}

async function readStore(): Promise<StoreFile> {
  try {
    const raw = await readFile(STORE_FILE, "utf-8");
    const parsed = JSON.parse(raw) as StoreFile;
    return parsed.entries ? parsed : emptyStore();
  } catch {
    return emptyStore();
  }
}

async function writeStore(store: StoreFile): Promise<void> {
  try {
    await mkdir(STORE_DIR, { recursive: true });
    await writeFile(STORE_FILE, JSON.stringify(store), "utf-8");
  } catch {
    // Leaderboard writes are best-effort until a durable database is attached.
  }
}

function byNumber(
  key: keyof Pick<
    LeaderboardEntry,
    | "totalHours"
    | "totalGames"
    | "profileViews"
    | "steamLevel"
    | "workshopViews"
  >
) {
  return (a: LeaderboardEntry, b: LeaderboardEntry) => {
    const diff = b[key] - a[key];
    if (diff !== 0) return diff;
    return a.personaName.localeCompare(b.personaName);
  };
}

function buildSnapshot(entries: LeaderboardEntry[]): LeaderboardSnapshot {
  const totals = entries.reduce(
    (acc, entry) => {
      acc.totalHours += entry.totalHours;
      acc.totalGames += entry.totalGames;
      acc.playedGames += entry.playedGames;
      acc.achievements += entry.achievements;
      acc.profileViews += entry.profileViews;
      acc.workshopViews += entry.workshopViews;
      acc.averageSteamLevel += entry.steamLevel;
      return acc;
    },
    {
      accounts: entries.length,
      totalHours: 0,
      totalGames: 0,
      playedGames: 0,
      achievements: 0,
      profileViews: 0,
      workshopViews: 0,
      averageSteamLevel: 0,
    }
  );

  totals.averageSteamLevel =
    entries.length > 0 ? Math.round(totals.averageSteamLevel / entries.length) : 0;

  return {
    entries,
    topHours: [...entries].sort(byNumber("totalHours")).slice(0, 10),
    topGames: [...entries].sort(byNumber("totalGames")).slice(0, 10),
    topViews: [...entries].sort(byNumber("profileViews")).slice(0, 10),
    topLevels: [...entries].sort(byNumber("steamLevel")).slice(0, 10),
    topWorkshopViews: [...entries].sort(byNumber("workshopViews")).slice(0, 10),
    totals,
  };
}

export async function recordLeaderboardEntry(
  data: WrappedData,
  { countView = true }: { countView?: boolean } = {}
): Promise<void> {
  const store = await readStore();
  const previous = store.entries[data.profile.steamId];
  store.entries[data.profile.steamId] = {
    steamId: data.profile.steamId,
    personaName: data.profile.personaName,
    avatarUrl: data.profile.avatarUrl,
    profileUrl: data.profile.profileUrl,
    totalHours: data.playtime.totalHours,
    totalGames: data.library.totalGames,
    playedGames: data.library.playedGames,
    achievements: data.achievements.totalUnlocked,
    steamLevel: data.profile.steamLevel,
    profileViews: (previous?.profileViews ?? 0) + (countView ? 1 : 0),
    workshopViews: data.workshop.totalViews,
    lastSeenAt: new Date().toISOString(),
  };

  await writeStore(store);
}

export async function getLeaderboardSnapshot(): Promise<LeaderboardSnapshot> {
  const store = await readStore();
  return buildSnapshot(Object.values(store.entries));
}
