import { NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

// Public, unauthenticated read — no cookies to forward. Not cached at the
// edge (no-store) since the leaderboard can change on any bid; the client
// caches the payload itself for the session (see SponsorStrip.tsx).
export async function GET() {
  try {
    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/top`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to load sponsors." }, { status: 500 });
  }
}
