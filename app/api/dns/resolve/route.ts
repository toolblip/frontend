import { NextRequest, NextResponse } from "next/server";
import {
  DnsAnswer,
  validateDnsQuery,
} from "@/lib/network-tools";

const GOOGLE_DNS_RESOLVER = "https://dns.google/resolve";
const RESOLVER_TIMEOUT_MS = 5000;
const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

function isDnsResponse(value: unknown): value is { Status: number; Answer?: DnsAnswer[] } {
  if (!value || typeof value !== "object") return false;
  const response = value as { Status?: unknown; Answer?: unknown };
  if (!Number.isInteger(response.Status)) return false;
  if (response.Answer === undefined) return true;
  return (
    Array.isArray(response.Answer) &&
    response.Answer.every((answer) => {
      if (!answer || typeof answer !== "object") return false;
      const record = answer as Record<string, unknown>;
      return (
        Number.isInteger(record.type) &&
        typeof record.data === "string" &&
        Number.isFinite(record.TTL)
      );
    })
  );
}

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const query = validateDnsQuery(
    request.nextUrl.searchParams.get("name"),
    request.nextUrl.searchParams.get("type"),
  );
  if (!query) {
    return NextResponse.json(
      { error: "A valid name and type are required." },
      { status: 400, headers: NO_STORE_HEADERS },
    );
  }

  const upstreamUrl = new URL(GOOGLE_DNS_RESOLVER);
  upstreamUrl.searchParams.set("name", query.name);
  upstreamUrl.searchParams.set("type", query.type);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESOLVER_TIMEOUT_MS);

  try {
    const response = await fetch(upstreamUrl, {
      signal: controller.signal,
      headers: { Accept: "application/dns-json" },
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        { error: "The DNS resolver returned an upstream error." },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    const data: unknown = await response.json();
    if (!isDnsResponse(data)) {
      return NextResponse.json(
        { error: "The DNS resolver returned an invalid response." },
        { status: 502, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(data, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "The DNS resolver request failed or timed out." },
      { status: 502, headers: NO_STORE_HEADERS },
    );
  } finally {
    clearTimeout(timeout);
  }
}
