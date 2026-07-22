import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { loadShortLinks } from "@/lib/shortLinks";

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

export async function GET(_request: Request, context: RouteContext) {
  try {
    const token = await requireAdmin();
    if (!token) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { code } = await context.params;
    const data = loadShortLinks();
    const entry = data.links[code];

    if (!entry) {
      return NextResponse.json(
        { message: "Short link not found." },
        { status: 404 }
      );
    }

    // Build stats
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const last7Days = entry.click_history.filter(
      (h) => new Date(h.date) >= sevenDaysAgo
    );
    const last30Days = entry.click_history.filter(
      (h) => new Date(h.date) >= thirtyDaysAgo
    );

    // Fill in missing days with 0 for the last 7 days
    const dailyBreakdown7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = last7Days.find((h) => h.date === dateStr);
      dailyBreakdown7.push({ date: dateStr, count: found?.count || 0 });
    }

    // Fill in missing days for 30 days
    const dailyBreakdown30 = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const found = last30Days.find((h) => h.date === dateStr);
      dailyBreakdown30.push({ date: dateStr, count: found?.count || 0 });
    }

    // Top referrers sorted by count
    const topReferrers = Object.entries(entry.referrers)
      .map(([domain, count]) => ({ domain, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return NextResponse.json({
      data: {
        code: entry.code,
        url: entry.url,
        total_clicks: entry.clicks,
        daily_breakdown_7d: dailyBreakdown7,
        daily_breakdown_30d: dailyBreakdown30,
        top_referrers: topReferrers,
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to load stats." },
      { status: 500 }
    );
  }
}
