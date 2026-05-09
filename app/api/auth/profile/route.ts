import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function PATCH(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const body = await req.json();
    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/profile`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
