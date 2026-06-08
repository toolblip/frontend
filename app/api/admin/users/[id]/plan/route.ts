import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Admin plan mutation. Proxies to Laravel POST /api/admin/users/{id}/plan with
 * { action: "set" | "cancel", tier?, reason? } and returns the updated admin
 * user view plus an audit record. Backend must enforce the admin role.
 */
export async function POST(req: Request, context: RouteContext) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await req.text();
    const laravelRes = await fetch(`${LARAVEL_URL}/api/admin/users/${encodeURIComponent(id)}/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to update plan." }, { status: 500 });
  }
}
