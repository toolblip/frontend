import { NextRequest, NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, token, password, password_confirmation } = body;

    if (!email || !token || !password || !password_confirmation) {
      return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    if (password !== password_confirmation) {
      return NextResponse.json({ message: "Passwords do not match." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters." }, { status: 400 });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, token, password, password_confirmation }),
    });

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
