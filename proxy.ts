/** Live edge entry for Next.js 16+ (middleware.ts is forbidden alongside this file). */
import { NextRequest, NextResponse } from "next/server";
import { classifyUserAgent, crawlBudget } from "./lib/ai-crawlers";
import { clientIp } from "./lib/client-ip";
import { isSafeNext } from "./lib/safe-next";

// /submit-tool is left out: its page is public (indexed) and asks for sign in itself.
const PROTECTED_PREFIXES = ["/account", "/dashboard", "/lists"];
const AUTH_ROUTES = ["/login", "/login/email", "/signup", "/signup/email", "/register"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("auth_token")?.value;
  // `next start` builds req.nextUrl from its own bind address ("localhost"), so the real host only shows in the Host header.
  // www -> apex and http -> https are done by Cloudflare in front of Railway.
  const hostname = (req.headers.get("host") ?? req.nextUrl.host).toLowerCase().replace(/:\d+$/, "");

  const isLocalHost =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "[::1]" ||
    hostname.endsWith(".localhost");

  if (!isLocalHost && pathname !== "/frontend-health") {
    const ip = clientIp(req.headers);
    if (ip) {
      const crawlClass = classifyUserAgent(req.headers.get("user-agent") ?? "");
      // Link prefetches get their own bucket so they can't use up a reader's page views. The header is client-set, so that bucket is capped too.
      const prefetch = req.headers.get("next-router-prefetch") === "1" ? "|prefetch" : "";
      const slot = crawlBudget.take(`${ip}|${crawlClass}${prefetch}`, crawlClass);
      if (!slot.allowed) {
        return new NextResponse("Too many requests. Identified AI and search crawlers can read public pages within a higher budget.", {
          status: 429,
          headers: {
            "Retry-After": String(slot.retryAfterSec),
            "Cache-Control": "no-store",
            "Content-Type": "text/plain; charset=utf-8",
          },
        });
      }
    }
  }

  // Let Next.js API auth routes through - handled by route handlers
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  const sharedList = pathname.match(/^\/user\/([a-z0-9][a-z0-9-]{1,28}[a-z0-9])\/([a-z0-9][a-z0-9-]{0,78}[a-z0-9])$/i);
  if (sharedList && !token) {
    const login = req.nextUrl.clone();
    login.pathname = "/login";
    login.search = "";
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  if (isProtected && !token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    // The query belongs to the page being protected (e.g. ?plan=ultra), so it goes inside next.
    url.search = "";
    url.searchParams.set("next", pathname + req.nextUrl.search);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const nextParam = req.nextUrl.searchParams.get("next");
    const redirectTo = isSafeNext(nextParam) && !AUTH_ROUTES.includes(nextParam.split("?")[0]) ? nextParam : "/dashboard";
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Catch-all matcher: intercepts ALL routes so middleware runs on /account (not just /account/*)
  matcher: [
    // "\\." so the regex sees an escaped dot: skip files like /robots.txt. A bare "\." became "." and matched nothing but "/".
    "/((?!api/auth|_next/static|_next/image|favicon.svg|.*\\..*).*)",
  ],
};
