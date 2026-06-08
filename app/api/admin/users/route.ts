import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}/api/admin/users`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await parseLaravelJsonResponse(laravelRes, "Unable to load users.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to load users." }, { status: 500 });
  }
}
