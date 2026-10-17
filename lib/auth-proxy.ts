import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type ForwardOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** Send the auth_token cookie as a Bearer token; 401 when it is missing. */
  auth?: boolean;
  /** When Laravel returns a token on success, store it in the auth_token cookie. */
  session?: boolean;
};

/** Proxies a request to the Laravel API, mirroring the login/register route handlers. */
export async function forwardToLaravel(
  path: string,
  req: NextRequest | null,
  { method = "POST", auth = false, session = false }: ForwardOptions = {}
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (auth && !token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: (method === "POST" || method === "PATCH") && req ? await req.text() : undefined,
    });

    if (laravelRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await laravelRes.json().catch(() => ({ message: "Unexpected response." }));

    if (session && laravelRes.ok && data.token) {
      cookieStore.set("auth_token", data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });
    }

    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
