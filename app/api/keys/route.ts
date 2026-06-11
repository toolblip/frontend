import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

async function tokenOrError() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  return token;
}

export async function GET() {
  try {
    const token = await tokenOrError();
    if (token instanceof Response) return token;

    const laravelRes = await fetch(`${LARAVEL_URL}/api/keys`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const data = await laravelRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to load API keys." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const token = await tokenOrError();
    if (token instanceof Response) return token;

    const body = await req.json().catch(() => ({}));

    const laravelRes = await fetch(`${LARAVEL_URL}/api/keys`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const data = await laravelRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to generate API key." }, { status: 500 });
  }
}
