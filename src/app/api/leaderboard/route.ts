import { NextResponse } from "next/server";
import { getLeaderboardSnapshot } from "@/lib/leaderboard/store";

export async function GET() {
  const snapshot = await getLeaderboardSnapshot();
  return NextResponse.json(snapshot);
}
