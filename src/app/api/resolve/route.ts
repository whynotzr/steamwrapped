import { NextRequest, NextResponse } from "next/server";
import { resolveSteamId } from "@/lib/steam/resolve";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q?.trim()) {
    return NextResponse.json({ error: "Query parameter q is required" }, { status: 400 });
  }

  try {
    const steamId = await resolveSteamId(q);
    return NextResponse.json({ steamId });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Profile not found";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
