export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
  rtime_last_played?: number;
  img_icon_url?: string;
  img_logo_url?: string;
}

export interface GameWithMeta extends SteamGame {
  genres: string[];
  developers?: string[];
  headerImage?: string;
  priceEstimate?: number;
  achievementTotal?: number;
  achievementUnlocked?: number;
  rareAchievements?: RareAchievement[];
  playtimePercent?: number;
  releaseYear?: number | null;
  releaseDate?: string;
}

export interface RareAchievement {
  name: string;
  description: string;
  percent: number;
  icon: string;
  gameName: string;
  appid?: number;
}

export interface GenreStat {
  genre: string;
  hours: number;
  percent: number;
  gameCount: number;
}

export interface GamingPersonality {
  title: string;
  description: string;
  traits: string[];
  emoji: string;
}

export interface WrappedInsight {
  type: "roast" | "praise" | "fact";
  text: string;
}

export interface ReplayCompareMetric {
  label: string;
  user: number;
  median: number;
  unit: string;
  ratio: number;
  beatMedian: boolean;
}

export interface CompletedGameEntry {
  appid: number;
  name: string;
  headerImage?: string;
  achievementUnlocked: number;
  achievementTotal: number;
}

export interface WorkshopItem {
  publishedFileId: string;
  title: string;
  previewUrl?: string;
  fileType: number;
  fileTypeLabel: string;
  appName?: string;
  subscriptions: number;
  favorites: number;
  views: number;
  votesUp: number;
  url: string;
}

export interface WorkshopStats {
  totalPublished: number;
  totalSubscriptions: number;
  totalFavorites: number;
  totalViews: number;
  topOverall: WorkshopItem[];
  topGuides: WorkshopItem[];
  topWallpapers: WorkshopItem[];
  topWorkshop: WorkshopItem[];
  topOther: WorkshopItem[];
  hasContent: boolean;
}

export interface GameSpotlight {
  rank: number;
  appid: number;
  name: string;
  headerImage: string;
  hours: number;
  playtimePercent: number;
  genres: string[];
  developers: string[];
  releaseDate?: string;
  releaseYear?: number | null;
  releaseCategory: "new" | "recent" | "classic";
  recentlyActive: boolean;
  lastPlayed: string | null;
  recentHours: number;
  achievementUnlocked?: number;
  achievementTotal?: number;
  achievementComplete?: boolean;
  achievementPercent?: number;
  priceLabel?: string;
  tagline: string;
}

export interface ReplayData {
  comparisons: ReplayCompareMetric[];
  playtimeEra: {
    new: { hours: number; percent: number };
    recent: { hours: number; percent: number };
    classic: { hours: number; percent: number };
  };
  genreRadar: { label: string; value: number; percent: number }[];
  byTheNumbers: { label: string; value: number }[];
  monthlyActivity: {
    months: number[];
    labels: string[];
    peakMonth: string;
  };
  gameSpotlights: GameSpotlight[];
  coverMosaic: string[];
  dashboardCards: {
    gamesPlayed: number;
    achievements: number;
    playtimeDays: number;
    rareAchievements: number;
    gamesWithAchievements: number;
    unplayedGames: number;
  };
  wowMoment: {
    emoji: string;
    headline: string;
    stat: number;
    statFormatted: string;
    statLabel: string;
    punchline: string;
    powerScore: number;
  };
  libraryRecords: {
    topGameHours: number;
    topGameName: string;
    oldestGame?: {
      appid: number;
      name: string;
      year: number;
      headerImage?: string;
    };
    newestGame?: {
      appid: number;
      name: string;
      year: number;
      headerImage?: string;
    };
    mostRecentGame?: {
      appid: number;
      name: string;
      lastPlayed: string;
      headerImage?: string;
    };
    mostExpensiveBacklog?: {
      appid: number;
      name: string;
      price: number;
      headerImage?: string;
    };
  };
}

export interface WrappedData {
  statsVersion: number;
  generatedAt: string;
  profile: {
    steamId: string;
    personaName: string;
    avatarUrl: string;
    profileUrl: string;
    accountCreated: string;
    accountAgeYears: number;
    steamLevel: number;
  };
  playtime: {
    totalMinutes: number;
    totalHours: number;
    totalDays: number;
    equivalentMovies: number;
    equivalentWorkWeeks: number;
    rank: string;
  };
  library: {
    totalGames: number;
    playedGames: number;
    unplayedGames: number;
    completedGames: number;
    playRate: number;
    backlogPercent: number;
    estimatedBacklogValue: number;
    estimatedLibraryValue: number;
  };
  topGames: GameWithMeta[];
  genres: GenreStat[];
  achievements: {
    totalUnlocked: number;
    scannedCount: number;
    profileCount?: number | null;
    profilePerfectGames?: number | null;
    profilePerfectAchievements?: number | null;
    totalPossible: number;
    completionRate: number;
    gamesWithAchievements: number;
    completedGamesList: CompletedGameEntry[];
    completionScannedCount: number;
    libraryGamesWithSchema?: number;
    rarest: RareAchievement[];
    rareGamesScanned: number;
    statsGamesScanned: number;
    fromProfile?: boolean;
  };
  workshop: WorkshopStats;
  activity: {
    recentlyPlayedGames: number;
    mostActiveMonth: string;
    mostActiveMonthCount: number;
    badgesEarned: number;
    gamesPlayedLastTwoWeeks: number;
    minutesLastTwoWeeks: number;
  };
  personality: GamingPersonality;
  insights: WrappedInsight[];
  summary: {
    headline: string;
    subheadline: string;
  };
  extras: {
    playtimeTopPercent: number;
    playtimeTopLabel: string;
    avgHoursPerPlayedGame: number;
    topGameSharePercent: number;
    totalBadges: number;
    totalBadgeXp: number;
    freeGamesCount: number;
    hoursPerDayLifetime: number;
    topDeveloper: { name: string; hours: number; percent: number } | null;
    rarestSpotlight: RareAchievement | null;
    ultraRareCount: number;
    funFacts: string[];
    uniqueFacts: string[];
  };
  replay: ReplayData;
}
