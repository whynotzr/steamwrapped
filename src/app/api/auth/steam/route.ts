import { NextRequest, NextResponse } from "next/server";
import { getSteamLoginUrl } from "@/lib/steam/auth";

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const returnUrl = `${origin}/api/auth/steam/callback`;
  const loginUrl = getSteamLoginUrl(returnUrl);
  return NextResponse.redirect(loginUrl);
}
