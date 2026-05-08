import { NextRequest, NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await laravelRes.json();

    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
