import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseLaravelJsonResponse } from "@/lib/adminApi";
import {
  loadShortLinks,
  saveShortLinks,
  generateShortCode,
  type ShortLinkEntry,
} from "@/lib/shortLinks";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) {
    return null;
  }

  // Verify admin via Laravel
  const laravelRes = await fetch(`${LARAVEL_URL}/api/admin/users`, {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!laravelRes.ok) return null;
  return token;
}

export async function GET() {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const data = loadShortLinks();
    const links = Object.values(data.links).sort(
      (a, b) => new Date(b.created).getTime() - new Date(a.created).getTime()
    );

    return NextResponse.json({ data: links });
  } catch {
    return NextResponse.json(
      { message: "Unable to load short links." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const body = await request.json();
    const { url, code: customCode } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { message: "URL is required." },
        { status: 400 }
      );
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { message: "Invalid URL." },
        { status: 400 }
      );
    }

    const data = loadShortLinks();

    let code = customCode || generateShortCode();

    // Validate custom code
    if (customCode) {
      if (!/^[a-zA-Z0-9_-]{1,32}$/.test(customCode)) {
        return NextResponse.json(
          { message: "Invalid code. Use alphanumeric characters, hyphens, or underscores (1-32 chars)." },
          { status: 400 }
        );
      }
    }

    // Check uniqueness
    if (data.links[code]) {
      return NextResponse.json(
        { message: `Code "${code}" is already taken.` },
        { status: 409 }
      );
    }

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

    return NextResponse.json({ data: entry }, { status: 201 });
  } catch {
    return NextResponse.json(
      { message: "Unable to create short link." },
      { status: 500 }
    );
  }
}
