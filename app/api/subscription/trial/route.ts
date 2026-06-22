import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to start a free trial." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const priceId = body?.price_id;

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing required field: price_id" },
        { status: 400 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/trial`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ price_id: priceId }),
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(data, { status: laravelRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Trial proxy error:", err);
    return NextResponse.json(
      { error: "Unable to start free trial. Please try again." },
      { status: 500 }
    );
  }
}
