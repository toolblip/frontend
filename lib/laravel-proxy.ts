import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function proxyLaravel(path: string, init: RequestInit = {}) {
  const token = (await cookies()).get("auth_token")?.value;
  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  const headers = new Headers(init.headers);
  headers.set("Accept", "application/json");
  headers.set("Authorization", `Bearer ${token}`);
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  try {
    const laravelRes = await fetch(`${LARAVEL_URL}${path}`, {
      ...init,
      headers,
      cache: "no-store",
    });
    const data = await laravelRes.json().catch(() => ({ message: "Unable to update lists." }));
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to reach the API." }, { status: 500 });
  }
}
