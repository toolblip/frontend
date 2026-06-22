import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to manage billing." },
        { status: 401 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/portal`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await laravelRes.json();

    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Billing portal proxy error:", err);
    return NextResponse.json(
      { error: "Unable to open billing portal. Please try again." },
      { status: 500 }
    );
  }
}
