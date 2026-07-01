import type { Metadata } from "next";
import { LeaderboardLivePage } from "@/components/leaderboard/LeaderboardViews";
import { getLeaderboardSnapshot } from "@/lib/leaderboard/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Steam Wrapped Leaderboard",
  description:
    "Discover the SteamWrapped leaderboard: most hours, biggest Steam libraries, profile views, Steam levels, and Workshop views.",
  alternates: {
    canonical: "/leaderboard",
  },
  openGraph: {
    title: "Steam Wrapped Leaderboard",
    description:
      "Rank SteamWrapped profiles by hours, games, views, Steam level, and Workshop views.",
    url: "/leaderboard",
  },
};

export default async function LeaderboardPage() {
  const snapshot = await getLeaderboardSnapshot();
  return <LeaderboardLivePage initialSnapshot={snapshot} mode="leaderboard" />;
}
