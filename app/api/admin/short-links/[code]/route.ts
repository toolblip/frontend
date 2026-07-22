import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import {
  loadShortLinks,
  saveShortLinks,
} from "@/lib/shortLinks";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;

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

type RouteContext = { params: Promise<{ code: string }> };

export async function PUT(request: Request, context: RouteContext) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { code } = await context.params;
    const body = await request.json();
    const { url, code: newCode } = body;

    const data = loadShortLinks();
    const existing = data.links[code];

    if (!existing) {
      return NextResponse.json(
        { message: "Short link not found." },
        { status: 404 }
      );
    }

    // Validate new URL if provided
    if (url) {
      try {
        new URL(url);
      } catch {
        return NextResponse.json(
          { message: "Invalid URL." },
          { status: 400 }
        );
      }
      existing.url = url;
    }

    // Handle code change
    if (newCode && newCode !== code) {
      if (!/^[a-zA-Z0-9_-]{1,32}$/.test(newCode)) {
        return NextResponse.json(
          { message: "Invalid code. Use alphanumeric characters, hyphens, or underscores (1-32 chars)." },
          { status: 400 }
        );
      }
      if (data.links[newCode]) {
        return NextResponse.json(
          { message: `Code "${newCode}" is already taken.` },
          { status: 409 }
        );
      }
      // Move entry to new code
      existing.code = newCode;
      data.links[newCode] = existing;
      delete data.links[code];
    }

    saveShortLinks(data);

    const updatedCode = newCode || code;
    return NextResponse.json({ data: data.links[updatedCode] });
  } catch {
    return NextResponse.json(
      { message: "Unable to update short link." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { code } = await context.params;
    const data = loadShortLinks();

    if (!data.links[code]) {
      return NextResponse.json(
        { message: "Short link not found." },
        { status: 404 }
      );
    }

    delete data.links[code];
    saveShortLinks(data);

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Unable to delete short link." },
      { status: 500 }
    );
  }
}
