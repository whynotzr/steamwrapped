import { NextRequest, NextResponse } from "next/server";
import { resolveSteamId } from "@/lib/steam/resolve";
import { getWrapped } from "@/lib/wrapped/get-wrapped";
import { getSession } from "@/lib/session";

export const maxDuration = 300;

export async function GET(request: NextRequest) {
  const session = await getSession();
  const params = request.nextUrl.searchParams;
  const refresh = params.get("refresh") === "1";

  let steamId = params.get("steamId") ?? session.steamId;

  const query = params.get("q");
  if (!steamId && query) {
    try {
      steamId = await resolveSteamId(query);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Profile not found";
      return NextResponse.json({ error: message }, { status: 400 });
    }
  }

  if (!steamId) {
    return NextResponse.json(
      { error: "Enter a Steam username or sign in." },
      { status: 400 }
    );
  }

  try {
    const data = await getWrapped(steamId, { skipCache: refresh });
    return NextResponse.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate Wrapped";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
