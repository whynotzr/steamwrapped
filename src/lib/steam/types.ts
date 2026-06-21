export interface SteamPlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  communityvisibilitystate: number;
  profilestate?: number;
  lastlogoff?: number;
  timecreated?: number;
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  rtime_last_played?: number;
  img_icon_url?: string;
  img_logo_url?: string;
}

export interface SteamAchievement {
  apiname: string;
  achieved: number;
  unlocktime: number;
}

export interface SteamAchievementSchema {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  icongray: string;
}

export interface SteamBadge {
  badgeid: number;
  level: number;
  completion_time?: number;
  xp: number;
}

export interface SteamAppDetails {
  name: string;
  genres?: { id: string; description: string }[];
  developers?: string[];
  publishers?: string[];
  header_image?: string;
  price_overview?: { final: number; currency: string };
  is_free?: boolean;
  release_date?: { date: string; coming_soon: boolean };
}

export interface AchievementProgressEntry {
  appid: number;
  unlocked: number;
  total: number;
  /** true si l'API a renvoyé la liste complète des succès (pas de réponse partielle). */
  verified?: boolean;
}

export interface TopAchievementEntry {
  name: string;
  description: string;
  icon: string;
  percent: number;
  appid: number;
}
