import { NextResponse } from "next/server";
import {
  getLeaderboardSnapshot,
  recordLeaderboardEntry,
} from "@/lib/leaderboard/store";
import type { WrappedData } from "@/types/wrapped";

export async function GET() {
  const snapshot = await getLeaderboardSnapshot();
  return NextResponse.json(snapshot);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { data?: WrappedData };
    if (!body.data?.profile?.steamId) {
      return NextResponse.json({ error: "Invalid profile" }, { status: 400 });
    }

    await recordLeaderboardEntry(body.data, { countView: true });
    const snapshot = await getLeaderboardSnapshot();
    return NextResponse.json(snapshot);
  } catch {
    return NextResponse.json(
      { error: "Could not update leaderboard" },
      { status: 500 }
    );
  }
}
