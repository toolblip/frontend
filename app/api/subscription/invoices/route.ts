import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Please sign in to view invoices." },
        { status: 401 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/subscription/invoices`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch (err) {
    console.error("Invoices proxy error:", err);
    return NextResponse.json(
      { error: "Unable to fetch invoices. Please try again." },
      { status: 500 }
    );
  }
}
