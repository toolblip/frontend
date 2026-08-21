import { NextResponse } from "next/server";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

// Public, unauthenticated read, keyed on whatever the bidder is currently
// typing — no cookies to forward, never cached (the result must reflect the
// live current-period balance at the moment of the keystroke).
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url") || "";

    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/lookup?url=${encodeURIComponent(url)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await parseLaravelJsonResponse(laravelRes, "Unable to look up this sponsor.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Sponsors lookup proxy error:", err);
    return NextResponse.json({ message: "Unable to look up this sponsor." }, { status: 500 });
  }
}
