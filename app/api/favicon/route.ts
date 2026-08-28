import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

/** Hostname like `harun.dev`, or an X handle path `x.com/name`. */
const DOMAIN_RE = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
const HANDLE_RE = /^x\.com\/[a-z0-9_]{1,30}$/i;

/**
 * Same-origin favicon proxy for sponsor avatars.
 *
 * Cross-origin Google/unavatar image fetches break under Serwist's default
 * runtime cache (opaque redirects → SponsorAvatar letter tile). Serving the
 * bytes from /api/favicon keeps the <img> same-origin so even a stale SW
 * that NetworkOnlys /api/* will not mangle the response.
 */
export async function GET(request: NextRequest) {
  const domain = (request.nextUrl.searchParams.get('domain') || '').trim().toLowerCase();
  if (!domain || domain.length > 253) {
    return new NextResponse('Bad domain', { status: 400 });
  }

  const isHandle = HANDLE_RE.test(domain);
  if (!isHandle && !DOMAIN_RE.test(domain)) {
    return new NextResponse('Bad domain', { status: 400 });
  }

  const sizeRaw = Number(request.nextUrl.searchParams.get('sz') || 128);
  const size = Number.isFinite(sizeRaw) ? Math.min(256, Math.max(16, Math.round(sizeRaw))) : 128;

  const upstream = isHandle
    ? `https://unavatar.io/${domain}`
    : `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=${size}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(upstream, {
      signal: controller.signal,
      headers: {
        Accept: 'image/*,*/*;q=0.8',
        'User-Agent': 'ToolblipFavicon/1.0',
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return new NextResponse('Upstream error', { status: 502 });
    }

    const contentType = res.headers.get('content-type') || 'image/png';
    if (!contentType.startsWith('image/')) {
      return new NextResponse('Not an image', { status: 502 });
    }

    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (err) {
    console.error('Favicon proxy error:', err);
    return new NextResponse('Fetch failed', { status: 502 });
  }
}
