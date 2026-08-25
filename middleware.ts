import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/dashboard", "/submit-tool"];
const AUTH_ROUTES = ["/login", "/register"];

/**
 * Next.js 16 still executes `middleware.ts` here; `proxy.ts` compiles but
 * does not register (empty middleware-manifest). Keep this file as the
 * live edge entry — including www→apex, which `proxy.ts` already intended.
 */
export function middleware(req: NextRequest) {
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

    return NextResponse.redirect(url, 308);
  }

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
    const redirectTo =
      nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.svg|.*\\..*).*)",
  ],
};
