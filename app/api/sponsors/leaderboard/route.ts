import { NextResponse } from "next/server";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/leaderboard?page=${encodeURIComponent(page)}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await parseLaravelJsonResponse(laravelRes, "Unable to load the sponsors leaderboard.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Sponsors leaderboard proxy error:", err);
    return NextResponse.json({ message: "Unable to load the sponsors leaderboard." }, { status: 500 });
  }
}
