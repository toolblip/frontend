const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON." }, { status: 400 });
  }
  const domain = body && typeof body === 'object' && 'domain' in body ? body.domain : null;
  // Validate a hostname here; the API owns the configured placeholder allowlist.
  if (typeof domain !== 'string' || domain.length > 253 ||
      !/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i.test(domain)) {
    return Response.json({ message: "Invalid placeholder domain." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${LARAVEL_URL}/api/sponsors/placeholder-click`, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ domain }),
      cache: 'no-store',
      redirect: 'error',
    });
    if (!upstream.ok) {
      return new Response(upstream.body, {
        status: upstream.status,
        headers: { 'Content-Type': upstream.headers.get('Content-Type') || 'application/json' },
      });
    }
    const data = await upstream.json();
    if (!Number.isSafeInteger(data?.clicks) || data.clicks < 0) {
      return Response.json({ message: 'Invalid sponsor click response.' }, { status: 502 });
    }
    return Response.json({ clicks: data.clicks });
  } catch {
    return Response.json({ message: 'Unable to record sponsor click.' }, { status: 502 });
  }
}
