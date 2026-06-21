import { NextRequest, NextResponse } from "next/server";
import { verifySteamOpenId } from "@/lib/steam/auth";
import { getSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const steamId = await verifySteamOpenId(params);

  if (!steamId) {
    return NextResponse.redirect(
      new URL("/?error=auth_failed", request.nextUrl.origin)
    );
  }

  const session = await getSession();
  session.steamId = steamId;
  await session.save();

  return NextResponse.redirect(new URL(`/u/${steamId}`, request.nextUrl.origin));
}
