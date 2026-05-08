import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      credentials: "include",
    });

    if (!laravelRes.ok) {
      // Token invalid or expired
      cookieStore.delete("auth_token");
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const data = await laravelRes.json();
    return NextResponse.json({ user: data.user ?? null, token });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
