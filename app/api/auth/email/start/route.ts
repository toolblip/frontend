import { NextRequest } from "next/server";
import { forwardToLaravel, magicLinkNonce } from "@/lib/auth-proxy";

export async function POST(req: NextRequest) {
  return forwardToLaravel("/api/auth/email/start", req, { extraBody: { browser_nonce: await magicLinkNonce(true) } });
}
