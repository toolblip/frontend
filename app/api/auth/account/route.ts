import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { proxyLaravel } from "@/lib/laravel-proxy";

export async function DELETE(req: NextRequest) {
  const res = await proxyLaravel("/api/auth/account", { method: "DELETE", body: await req.text() });
  // The account and its tokens are gone; drop the session cookie with it.
  if (res.ok) (await cookies()).delete("auth_token");
  return res;
}
