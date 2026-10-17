import { NextRequest } from "next/server";
import { forwardToLaravel } from "@/lib/auth-proxy";

export async function GET() {
  return forwardToLaravel("/api/auth/passkeys", null, { method: "GET", auth: true });
}

export async function POST(req: NextRequest) {
  return forwardToLaravel("/api/auth/passkeys", req, { auth: true });
}
