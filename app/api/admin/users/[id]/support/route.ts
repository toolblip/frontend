import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseLaravelJsonResponse } from "@/lib/adminApi";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Admin support actions for a single user. Proxies to Laravel
 * POST /api/admin/users/{id}/support with { action: "note" | "resend_verification", note? }
 * and returns the updated admin user view, recorded notes, and an audit record.
 * Backend must enforce the admin role.
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
    const laravelRes = await fetch(`${LARAVEL_URL}/api/admin/users/${encodeURIComponent(id)}/support`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    const data = await parseLaravelJsonResponse(laravelRes, "Unable to complete support action.");
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Unable to complete support action." }, { status: 500 });
  }
}
