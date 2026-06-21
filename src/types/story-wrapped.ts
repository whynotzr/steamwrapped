export interface StoryProfile {
  steamId: string;
  personaName: string;
  avatarUrl: string;
  profileUrl: string;
  accountAgeYears: number;
}

export interface StoryPlaytime {
  totalHours: number;
  totalDays: number;
  equivalence: string;
}

export interface StoryTopGame {
  rank: number;
  appid: number;
  name: string;
  hours: number;
  playtimePercent: number;
  libraryImage: string;
  headerImage: string;
  conditionalPhrase: string;
}

export interface StoryPodiumEntry {
  rank: number;
  appid: number;
  name: string;
  hours: number;
  headerImage: string;
  barPercent: number;
}

export interface StoryGraveyard {
  unplayedCount: number;
  headline: string;
  sampleUnplayed: { appid: number; name: string; priceEur?: number }[];
}

export interface StoryArchetype {
  id: string;
  title: string;
  emoji: string;
  description: string;
  traits: string[];
  badgeColor: string;
}

export interface StoryShareCard {
  title: string;
  subtitle: string;
  top3: { rank: number; name: string; hours: number }[];
  archetype: string;
  archetypeEmoji: string;
  footerUrl: string;
}

export interface StoryWrappedData {
  profile: StoryProfile;
  intro: {
    headline: string;
    subheadline: string;
  };
  playtime: StoryPlaytime;
  top1: StoryTopGame;
  podium: StoryPodiumEntry[];
  graveyard: StoryGraveyard;
  archetype: StoryArchetype;
  shareCard: StoryShareCard;
  loadingMessages: string[];
}
