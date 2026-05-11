import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ slug: string }> };

async function applyAuthHeader(headers: Headers) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const laravelRes = await fetch(`${LARAVEL_URL}/api/tools/${encodeURIComponent(slug)}/view`, {
      method: "POST",
      headers: await applyAuthHeader(new Headers({
        Accept: "application/json",
      })),
    });
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to record tool view." }, { status: 500 });
  }
}
