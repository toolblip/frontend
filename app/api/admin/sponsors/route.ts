import { proxyLaravel } from "@/lib/laravel-proxy";

export function GET() {
  return proxyLaravel("/api/admin/sponsors");
}
