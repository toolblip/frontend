import { NextRequest } from "next/server";
import { forwardToLaravel } from "@/lib/auth-proxy";

export async function POST(req: NextRequest) {
  return forwardToLaravel("/api/auth/magic-link/consume", req, { session: true });
}
