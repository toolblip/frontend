const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ id: string }> };

// Preserve the upstream acknowledgement: the client only updates its count
// when this request succeeds, independently of outbound navigation.
export async function POST(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  if (!/^[1-9]\d*$/.test(id) || !Number.isSafeInteger(Number(id))) {
    return Response.json({ message: "Invalid sponsor ID." }, { status: 400 });
  }
  try {
    const upstream = await fetch(`${LARAVEL_URL}/api/sponsors/click/${id}`, {
      method: "POST",
      headers: { Accept: "application/json" },
      cache: "no-store",
      redirect: "error",
    });
    return new Response(upstream.body, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") || "application/json" },
    });
  } catch {
    return Response.json({ message: "Unable to record sponsor click." }, { status: 502 });
  }
}
