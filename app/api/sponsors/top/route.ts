import { NextResponse } from "next/server";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

// Public, unauthenticated read - no cookies to forward. Shared for 30s in the
// Next data cache so concurrent new visitors make one upstream call; the
// client caches the payload itself for the session (see SponsorStrip.tsx).
export async function GET() {
  try {
    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/top`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 30 },
    });
    const data = await parseLaravelJsonResponse(laravelRes, "Unable to load sponsors.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Sponsors top proxy error:", err);
    return NextResponse.json({ message: "Unable to load sponsors." }, { status: 500 });
  }
}
