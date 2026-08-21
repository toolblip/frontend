import { NextResponse } from "next/server";

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
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to load the sponsors leaderboard." }, { status: 500 });
  }
}
