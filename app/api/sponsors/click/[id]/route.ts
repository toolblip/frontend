const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

type RouteContext = { params: Promise<{ id: string }> };

// Fire-and-forget click tracking, called via navigator.sendBeacon from the
// outbound sponsor link — the user's browser navigates to the sponsor
// directly, this just increments the counter server-side.
export async function POST(_req: Request, context: RouteContext) {
  const { id } = await context.params;
  try {
    await fetch(`${LARAVEL_URL}/api/sponsors/click/${encodeURIComponent(id)}`, {
      method: "POST",
      headers: { Accept: "application/json" },
    });
  } catch {
    // Best-effort — a dropped click ping shouldn't surface anywhere.
  }
  return new Response(null, { status: 204 });
}
