import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type ForwardOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  /** Send the auth_token cookie as a Bearer token; 401 when it is missing. */
  auth?: boolean;
  /** When Laravel returns a token on success, store it in the auth_token cookie. */
  session?: boolean;
  /** Fields merged into the JSON body before it is sent. */
  extraBody?: Record<string, unknown>;
};

const MAGIC_NONCE_COOKIE = "tb_magic_nonce";

/** Nonce cookie of the browser that asks for a magic link; only that browser may sign in with it without a click. */
export async function magicLinkNonce(create: boolean): Promise<string | null> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(MAGIC_NONCE_COOKIE)?.value;
  if (existing || !create) return existing ?? null;
  const nonce = crypto.randomUUID();
  cookieStore.set(MAGIC_NONCE_COOKIE, nonce, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });
  return nonce;
}

/** Proxies a request to the Laravel API, mirroring the login/register route handlers. */
export async function forwardToLaravel(
  path: string,
  req: NextRequest | null,
  { method = "POST", auth = false, session = false, extraBody }: ForwardOptions = {}
): Promise<NextResponse> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (auth && !token) {
      return NextResponse.json({ message: "Unauthenticated." }, { status: 401 });
    }

    let body = (method === "POST" || method === "PATCH") && req ? await req.text() : undefined;
    if (extraBody) {
      let parsed: unknown = {};
      try {
        parsed = body ? JSON.parse(body) : {};
      } catch {
        // Not JSON: forward it untouched and let Laravel reject it.
      }
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) body = JSON.stringify({ ...parsed, ...extraBody });
    }

    const laravelRes = await fetch(`${LARAVEL_URL}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body,
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
