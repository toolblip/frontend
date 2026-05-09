import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const body = await req.json();
    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await laravelRes.json();
    const response = NextResponse.json(data, { status: laravelRes.status });

    if (laravelRes.ok) {
      response.cookies.delete("auth_token");
    }

    return response;
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
