import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ slug: string }> };

async function tokenOrResponse() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  return token;
}

async function forwardFavorite(method: "POST" | "DELETE", context: RouteContext) {
  try {
    const token = await tokenOrResponse();
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const { slug } = await context.params;
    const laravelRes = await fetch(`${LARAVEL_URL}/api/tools/${encodeURIComponent(slug)}/favorite`, {
      method,
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to update favorite." }, { status: 500 });
  }
}

export async function POST(_req: Request, context: RouteContext) {
  return forwardFavorite("POST", context);
}

export async function DELETE(_req: Request, context: RouteContext) {
  return forwardFavorite("DELETE", context);
}
