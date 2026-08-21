import { NextResponse } from "next/server";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

// No auth required to bid — a sponsor doesn't need a Toolblip account.
// Stripe collects the email at Checkout; the webhook links or auto-creates
// the account server-side (see api repo: SponsorWebhookController).
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const laravelRes = await fetch(`${LARAVEL_URL}/api/sponsors/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await laravelRes.json();
    return NextResponse.json(data, { status: laravelRes.status });
  } catch {
    return NextResponse.json(
      { message: "Unable to start checkout. Please try again." },
      { status: 500 }
    );
  }
}
