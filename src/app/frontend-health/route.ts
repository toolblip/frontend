import { NextResponse } from "next/server";

// Simple health check - no backend dependencies
export async function GET() {
  return NextResponse.json({ status: "ok" });
}
