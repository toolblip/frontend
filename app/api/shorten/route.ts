import { NextResponse } from "next/server";
import {
  loadShortLinks,
  saveShortLinks,
  generateShortCode,
  type ShortLinkEntry,
} from "@/lib/shortLinks";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { url } = body;
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }

    const data = loadShortLinks();

    // Check if this URL already has a short code
    for (const [code, entry] of Object.entries(data.links)) {
      if (entry.url === url) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com";
        return NextResponse.json({
          short_url: `${baseUrl}/s/${code}`,
          code,
        });
      }
    }

    // Generate a unique code
    let code: string;
    let attempts = 0;
    do {
      code = generateShortCode();
      attempts++;
      if (attempts > 100) {
        return NextResponse.json(
          { error: "Failed to generate unique code" },
          { status: 500 }
        );
      }
    } while (data.links[code]);

    const entry: ShortLinkEntry = {
      url,
      code,
      created: new Date().toISOString(),
      clicks: 0,
      click_history: [],
      referrers: {},
    };

    data.links[code] = entry;
    saveShortLinks(data);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://toolblip.com";
    return NextResponse.json({
      short_url: `${baseUrl}/s/${code}`,
      code,
    });
  } catch (err) {
    console.error("Shorten API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
