import type { Metadata } from "next";
import { LeaderboardLivePage } from "@/components/leaderboard/LeaderboardViews";
import { getLeaderboardSnapshot } from "@/lib/leaderboard/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Steam Wrapped Statistics",
  description:
    "See global SteamWrapped statistics: cumulative hours, games, achievements, views, and indexed accounts.",
  alternates: {
    canonical: "/statistics",
  },
  openGraph: {
    title: "Steam Wrapped Statistics",
    description:
      "All indexed SteamWrapped accounts added together: cumulative hours, games, achievements, and views.",
    url: "/statistics",
  },
};

export default async function StatisticsPage() {
  const snapshot = await getLeaderboardSnapshot();
  return <LeaderboardLivePage initialSnapshot={snapshot} mode="statistics" />;
}
