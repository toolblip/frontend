import { NextRequest, NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";
const OAUTH_COOKIE_MAX_AGE = 60 * 10;

function safeNext(value: string | null): string {
  if (value && value.startsWith("/") && !value.startsWith("//")) {
    return value;
  }
  return "/";
}

function appOrigin(req: NextRequest): string {
  const referer = req.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin;
    } catch {
      // fall through to Next's request origin
    }
  }
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const state = crypto.randomUUID();
  const next = safeNext(req.nextUrl.searchParams.get("next"));
  const origin = appOrigin(req);
  const redirectUri = new URL("/api/auth/google/callback", origin).toString();
  const upstream = new URL(`${LARAVEL_URL}/api/auth/google/redirect`);
  upstream.searchParams.set("state", state);
  upstream.searchParams.set("redirect_uri", redirectUri);

  try {
    const laravelRes = await fetch(upstream, {
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 (compatible; ToolblipOAuth/1.0; +https://toolblip.com)",
      },
    });
    const data = await laravelRes.json();

    if (!laravelRes.ok || !data.authorization_url) {
      return NextResponse.redirect(new URL("/login?oauth_error=google_unavailable", origin));
    }

    const response = NextResponse.redirect(data.authorization_url);
    response.cookies.set("oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OAUTH_COOKIE_MAX_AGE,
    });
    response.cookies.set("oauth_next", next, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OAUTH_COOKIE_MAX_AGE,
    });
    response.cookies.set("oauth_origin", origin, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: OAUTH_COOKIE_MAX_AGE,
    });
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?oauth_error=google_unavailable", origin));
  }
}
