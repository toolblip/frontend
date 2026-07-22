import { NextResponse } from "next/server";
import {
  loadShortLinks,
  saveShortLinks,
  trackClick,
} from "@/lib/shortLinks";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const data = loadShortLinks();
  const entry = data.links[code];

  if (!entry) {
    return NextResponse.json(
      { error: "Short link not found" },
      { status: 404 }
    );
  }

  // Track the click
  const referrer = request.headers.get("referer") || undefined;
  trackClick(data, code, referrer);
  saveShortLinks(data);

  return NextResponse.redirect(entry.url, 302);
}
