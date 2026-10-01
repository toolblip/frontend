import { proxyLaravel } from "@/lib/laravel-proxy";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function forward(req: Request, context: RouteContext, method: string) {
  const { path } = await context.params;
  const url = new URL(req.url);
  const suffix = path?.length ? `/${path.map(encodeURIComponent).join("/")}` : "";
  const body = method === "GET" || method === "DELETE" ? undefined : await req.text();

  return proxyLaravel(`/api/auth/favorite-lists${suffix}${url.search}`, {
    method,
    body: body || undefined,
  });
}

export function GET(req: Request, context: RouteContext) {
  return forward(req, context, "GET");
}

export function POST(req: Request, context: RouteContext) {
  return forward(req, context, "POST");
}

export function PATCH(req: Request, context: RouteContext) {
  return forward(req, context, "PATCH");
}

export function PUT(req: Request, context: RouteContext) {
  return forward(req, context, "PUT");
}

export function DELETE(req: Request, context: RouteContext) {
  return forward(req, context, "DELETE");
}
