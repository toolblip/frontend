import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ slug: string }> };

async function applyAuthHeader(headers: Headers) {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return headers;
}

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const { slug } = await context.params;
    const body = await req.json().catch(() => ({}));
    const laravelRes = await fetch(`${LARAVEL_URL}/api/tools/${encodeURIComponent(slug)}/share`, {
      method: "POST",
      headers: await applyAuthHeader(new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
      })),
      body: JSON.stringify({ channel: body.channel ?? "copy" }),
    });
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to record tool share." }, { status: 500 });
  }
}
