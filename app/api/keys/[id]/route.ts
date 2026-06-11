import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ id: string }> };

async function tokenOrError() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
  }

  return token;
}

export async function DELETE(_req: Request, context: RouteContext) {
  try {
    const token = await tokenOrError();
    if (token instanceof Response) return token;

    const { id } = await context.params;

    const laravelRes = await fetch(`${LARAVEL_URL}/api/keys/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await laravelRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to revoke API key." }, { status: 500 });
  }
}
