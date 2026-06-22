import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to cancel your subscription." },
        { status: 401 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(data, { status: laravelRes.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Subscription cancel proxy error:", err);
    return NextResponse.json(
      { error: "Unable to cancel subscription. Please try again." },
      { status: 500 }
    );
  }
}
