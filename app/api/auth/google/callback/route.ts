import { isSafeNext } from "@/lib/safe-next";
import { NextRequest, NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

function safeNext(value: string | undefined): string {
  if (isSafeNext(value)) {
    return value;
  }
  return "/dashboard";
}

function appOrigin(req: NextRequest): string {
  return new URL(req.url).origin;
}

function safeOrigin(req: NextRequest): string {
  const origin = req.cookies.get("oauth_origin")?.value;
  if (origin) {
    try {
      const parsed = new URL(origin);
      if (parsed.protocol === "http:" || parsed.protocol === "https:") {
        return parsed.origin;
      }
    } catch {
      // fall through to request origin
    }
  }
  return appOrigin(req);
}

function redirectToLogin(req: NextRequest, reason: string) {
  const response = NextResponse.redirect(new URL(`/login?oauth_error=${reason}`, safeOrigin(req)));
  response.cookies.delete("oauth_state");
  response.cookies.delete("oauth_next");
  response.cookies.delete("oauth_origin");
  return response;
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const expectedState = req.cookies.get("oauth_state")?.value;
  const next = safeNext(req.cookies.get("oauth_next")?.value);

  if (!code || !state || !expectedState || state !== expectedState) {
    return redirectToLogin(req, "invalid_state");
  }

  try {
    const redirectUri = new URL("/api/auth/google/callback", safeOrigin(req)).toString();
    const laravelRes = await fetch(`${LARAVEL_URL}/api/auth/google/callback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ code, redirect_uri: redirectUri }),
    });
    const data = await laravelRes.json();

    if (!laravelRes.ok || !data.token) {
      return redirectToLogin(req, "callback_failed");
    }

    // Google accounts without a passkey get the optional setup screen; passkey_setup is "suggested" for them.
    const target =
      data.passkey_setup === "suggested"
        ? `/setup-passkey?mode=suggested&next=${encodeURIComponent(next)}`
        : next;
    const response = NextResponse.redirect(new URL(target, safeOrigin(req)));
    response.cookies.set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_next");
    response.cookies.delete("oauth_origin");
    return response;
  } catch {
    return redirectToLogin(req, "callback_failed");
  }
}
