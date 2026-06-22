import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to change your plan." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const planTier = body?.plan_tier;
    const billing = body?.billing;

    if (!planTier || !billing) {
      return NextResponse.json(
        { error: "Missing required fields: plan_tier and billing" },
        { status: 400 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/switch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ plan_tier: planTier, billing }),
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(data, { status: laravelRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Subscription switch proxy error:", err);
    return NextResponse.json(
      { error: "Unable to switch plans. Please try again." },
      { status: 500 }
    );
  }
}
