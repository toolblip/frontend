import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/submit-tool"];
const AUTH_ROUTES = ["/login", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const hostname = req.nextUrl.hostname;
  const protocol = req.nextUrl.protocol;

  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "::1" ||
    hostname.endsWith(".localhost");

  if (hostname.startsWith("www.") || (protocol === "http:" && !isLocalHost)) {
    const url = req.nextUrl.clone();

    if (hostname.startsWith("www.")) {
      url.hostname = hostname.slice(4);
    }

    if (protocol === "http:") {
      url.protocol = "https:";
    }

    return NextResponse.redirect(url, 301);
  }

  // Let Next.js API auth routes through — handled by route handlers
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const nextParam = req.nextUrl.searchParams.get("next");
    const redirectTo = nextParam && nextParam.startsWith("/") ? nextParam : "/";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Catch-all matcher: intercepts ALL routes so middleware runs on /account (not just /account/*)
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.svg|.*\..*).*)",
  ],
};
