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

  // Track the click - best-effort. The redirect target is already known, so
  // a failure recording the click (e.g. the volume being briefly
  // unwritable) should never turn a working redirect into a 500.
  try {
    const referrer = request.headers.get("referer") || undefined;
    trackClick(data, code, referrer);
    saveShortLinks(data);
  } catch (err) {
    console.error(`[shortLinks] failed to record click for ${code}:`, err);
  }

  return NextResponse.redirect(entry.url, 302);
}
