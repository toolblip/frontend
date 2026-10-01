import { proxyLaravel } from "@/lib/laravel-proxy";

export async function POST(req: Request) {
  return proxyLaravel("/api/auth/username", {
    method: "POST",
    body: await req.text(),
  });
}
