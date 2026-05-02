import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const LARAVEL_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.toolblip.com";

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (token) {
      // Call Laravel logout to invalidate token server-side
      await fetch(`${LARAVEL_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        credentials: "include",
      });
    }
  } catch {
    // best-effort — still delete cookie client-side
  } finally {
    const cookieStore = await cookies();
    cookieStore.delete("auth_token");
  }

  return NextResponse.json({ message: "Logged out." });
}
