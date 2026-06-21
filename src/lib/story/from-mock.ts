import { mockData } from "@/lib/mock-data";
import type { StoryWrappedData } from "@/types/story-wrapped";

export function getStoryDataFromMock(): StoryWrappedData {
  const { profile, slides, shareCard, loadingMessages } = mockData;

  return {
    profile: {
      steamId: profile.steamId,
      personaName: profile.personaName,
      avatarUrl: profile.avatarUrl,
      profileUrl: profile.profileUrl,
      accountAgeYears: profile.accountAgeYears,
    },
    intro: {
      headline: slides.intro.headline,
      subheadline: slides.intro.subheadline,
    },
    playtime: {
      totalHours: slides.playtime.totalHours,
      totalDays: slides.playtime.totalDays,
      equivalence: slides.playtime.equivalence,
    },
    top1: {
      rank: slides.top1.rank,
      appid: slides.top1.appid,
      name: slides.top1.name,
      hours: slides.top1.hours,
      playtimePercent: slides.top1.playtimePercent,
      libraryImage: slides.top1.libraryImage,
      headerImage: slides.top1.headerImage,
      conditionalPhrase: slides.top1.conditionalPhrase,
    },
    podium: slides.podium.map((g) => ({
      rank: g.rank,
      appid: g.appid,
      name: g.name,
      hours: g.hours,
      headerImage: g.headerImage,
      barPercent: g.barPercent,
    })),
    graveyard: {
      unplayedCount: slides.graveyard.unplayedCount,
      headline: slides.graveyard.headline,
      sampleUnplayed: slides.graveyard.sampleUnplayed,
    },
    archetype: {
      id: slides.archetype.id,
      title: slides.archetype.title,
      emoji: slides.archetype.emoji,
      description: slides.archetype.description,
      traits: slides.archetype.traits,
      badgeColor: slides.archetype.badgeColor,
    },
    shareCard: {
      title: shareCard.title,
      subtitle: shareCard.subtitle,
      top3: shareCard.top3,
      archetype: shareCard.archetype,
      archetypeEmoji: shareCard.archetypeEmoji,
      footerUrl: shareCard.footerUrl,
    },
    loadingMessages,
  };
}

/** Phrase conditionnelle pour le top 1 selon les heures. */
export function topGamePhrase(hours: number): string {
  if (hours > 500) {
    return "We genuinely hope someone pays you to play this much.";
  }
  if (hours < 30) {
    return "A minister's schedule, but still a gamer.";
  }
  return "Enough time in to know every corner of the map.";
}
