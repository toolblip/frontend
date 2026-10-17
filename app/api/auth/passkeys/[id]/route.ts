import { NextResponse } from "next/server";
import { forwardToLaravel } from "@/lib/auth-proxy";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ message: "Not found." }, { status: 404 });
  return forwardToLaravel(`/api/auth/passkeys/${id}`, null, { method: "DELETE", auth: true });
}
