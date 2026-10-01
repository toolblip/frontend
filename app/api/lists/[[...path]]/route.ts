import { proxyLaravel } from "@/lib/laravel-proxy";

type RouteContext = { params: Promise<{ path?: string[] }> };

async function forward(req: Request, context: RouteContext, method: string) {
  const { path } = await context.params;
  const suffix = path?.length ? `/${path.map(encodeURIComponent).join("/")}` : "";

  return proxyLaravel(`/api/lists${suffix}`, { method });
}

export function GET(req: Request, context: RouteContext) {
  return forward(req, context, "GET");
}

export function DELETE(req: Request, context: RouteContext) {
  return forward(req, context, "DELETE");
}
