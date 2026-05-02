import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, password_confirmation } = body;

    if (!name || !email || !password || !password_confirmation) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    const data = await laravelRes.json();

    if (!laravelRes.ok) {
      return NextResponse.json(data, { status: laravelRes.status });
    }

    // Set httpOnly cookie
    const cookieStore = await cookies();
    cookieStore.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return NextResponse.json({ user: data.user, token: data.token }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
