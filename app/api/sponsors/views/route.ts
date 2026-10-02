const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

const HOST = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "Invalid JSON." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ message: "Invalid sponsor view payload." }, { status: 400 });
  }

  const record = body as { paid_ids?: unknown; placeholder_domains?: unknown };
  const paidIds = record.paid_ids ?? [];
  const domains = record.placeholder_domains ?? [];
  if (!Array.isArray(paidIds) || !Array.isArray(domains) || paidIds.length > 50 || domains.length > 10) {
    return Response.json({ message: "Invalid sponsor view payload." }, { status: 400 });
  }
  if (paidIds.some((id) => typeof id !== "number" || !Number.isSafeInteger(id) || id <= 0)) {
    return Response.json({ message: "Invalid sponsor view payload." }, { status: 400 });
  }
  if (domains.some((domain) => typeof domain !== "string" || domain.length > 253 || !HOST.test(domain))) {
    return Response.json({ message: "Invalid sponsor view payload." }, { status: 400 });
  }
  if (paidIds.length === 0 && domains.length === 0) {
    return Response.json({ message: "Invalid sponsor view payload." }, { status: 400 });
  }

  try {
    const upstream = await fetch(`${LARAVEL_URL}/api/sponsors/views`, {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify({ paid_ids: paidIds, placeholder_domains: domains }),
      cache: "no-store",
      redirect: "error",
    });
    if (upstream.status === 204) return new Response(null, { status: 204 });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return Response.json({ message: "Unable to record sponsor views." }, { status: 502 });
  }
}
