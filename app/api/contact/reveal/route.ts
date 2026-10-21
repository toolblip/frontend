import { NextRequest, NextResponse } from "next/server";
import { clientIp } from "@/lib/client-ip";

// Keeps the address out of HTML and client bundles. Only returned after a Turnstile check.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const token = typeof body.turnstile_token === "string" ? body.turnstile_token : "";
    const secret = process.env.TURNSTILE_SECRET_KEY;

    if (secret) {
      const form = new FormData();
      form.append("secret", secret);
      form.append("response", token);
      const ip = clientIp(req.headers);
      if (ip) form.append("remoteip", ip);

      const verify = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: form,
      });
      const result = await verify.json().catch(() => ({ success: false }));
      if (!result.success) {
        return NextResponse.json(
          { message: "Please complete the security check.", code: "turnstile_failed" },
          { status: 422 }
        );
      }
    }

    return NextResponse.json({ email: process.env.CONTACT_EMAIL || "harun@toolblip.com" });
  } catch {
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
