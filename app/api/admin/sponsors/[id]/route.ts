import { NextRequest, NextResponse } from "next/server";
import { proxyLaravel } from "@/lib/laravel-proxy";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ message: "Not found." }, { status: 404 });
  return proxyLaravel(`/api/admin/sponsors/${id}`, { method: "POST", body: await req.text() });
}
