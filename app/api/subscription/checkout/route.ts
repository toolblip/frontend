import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get("auth_token")?.value;
    const authHeader = req.headers.get("authorization") || "";
    const bearerToken = authHeader.toLowerCase().startsWith("bearer ")
      ? authHeader.slice(7).trim()
      : "";
    const token = bearerToken || cookieToken;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { price_id } = body;

    if (!price_id || typeof price_id !== "string") {
      return NextResponse.json({ message: "price_id is required." }, { status: 400 });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/checkout`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price_id }),
    });

    const data = await laravelRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
