import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing required query parameter: url" },
      { status: 400 }
    );
  }

  // Restrict to same-origin requests from Toolblip (prevents open proxy abuse)
  const origin = request.headers.get("origin") || "";
  const referer = request.headers.get("referer") || "";
  const host = request.headers.get("host") || "";
  const isFromToolblip =
    origin.includes("toolblip.com") ||
    referer.includes("toolblip.com") ||
    host === "localhost:3000" ||
    host === "127.0.0.1:3000";
  if (!isFromToolblip) {
    return NextResponse.json(
      { error: "This endpoint is restricted to toolblip.com" },
      { status: 403 }
    );
  }

  try {
    // Basic validation — ensure it's a valid absolute URL
    let targetUrl: URL;
    try {
      targetUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL provided" },
        { status: 400 }
      );
    }

    // Block requests to internal / private addresses
    const hostname = targetUrl.hostname;
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname === "0.0.0.0" ||
      hostname.startsWith("10.") ||
      hostname.startsWith("172.16.") ||
      hostname.startsWith("192.168.") ||
      hostname.endsWith(".local")
    ) {
      return NextResponse.json(
        { error: "Requests to private or internal addresses are not allowed" },
        { status: 403 }
      );
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(targetUrl.toString(), {
      signal: controller.signal,
      headers: {
        "User-Agent": "ToolblipProxy/1.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    clearTimeout(timeout);

    const body = await response.text();

    return new NextResponse(body, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") || "text/html; charset=utf-8",
        "X-Proxy-Status": `${response.status}`,
      },
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.name === "AbortError"
          ? "Request timed out"
          : error.message
        : "An unexpected error occurred";

    return NextResponse.json(
      { error: message },
      { status: 504 }
    );
  }
}
