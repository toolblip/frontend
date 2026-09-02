import { NextResponse } from "next/server";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function GET() {
  try {
    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/archive`, {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    const data = await parseLaravelJsonResponse(laravelRes, "Unable to load the sponsors archive.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Sponsors archive proxy error:", err);
    return NextResponse.json({ message: "Unable to load the sponsors archive." }, { status: 500 });
  }
}
