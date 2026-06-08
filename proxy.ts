import { NextRequest, NextResponse } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/dashboard", "/submit-tool"];
const AUTH_ROUTES = ["/login", "/signup", "/register"];
const NOINDEX_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/verify-email",
  "/reset-password",
];

function setNoindexHeader(response: NextResponse, shouldNoindex: boolean) {
  if (shouldNoindex) {
    response.headers.set("x-robots-tag", "noindex, nofollow");
  }
  return response;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  const hostname = req.nextUrl.hostname;
  const protocol = req.nextUrl.protocol;
  const shouldNoindex =
    NOINDEX_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

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

    return setNoindexHeader(NextResponse.redirect(url, 301), shouldNoindex);
  }

  // Let Next.js API auth routes through - handled by route handlers
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = req.nextUrl.search;
    url.searchParams.set("next", `${pathname}${req.nextUrl.search}`);
    return setNoindexHeader(NextResponse.redirect(url), shouldNoindex);
  }

  if (isAuthRoute && token) {
    const nextParam = req.nextUrl.searchParams.get("next");
    const redirectTo = nextParam && nextParam.startsWith("/") ? nextParam : "/dashboard";
    return setNoindexHeader(NextResponse.redirect(new URL(redirectTo, req.url)), shouldNoindex);
  }

  return setNoindexHeader(NextResponse.next(), shouldNoindex);
}

export const config = {
  // Catch-all matcher: intercepts ALL routes so middleware runs on /account (not just /account/*)
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.svg|.*\..*).*)",
  ],
};
