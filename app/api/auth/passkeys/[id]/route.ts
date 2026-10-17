import { NextRequest, NextResponse } from "next/server";
import { forwardToLaravel } from "@/lib/auth-proxy";

async function forward(req: NextRequest, params: Promise<{ id: string }>, method: "PATCH" | "DELETE") {
  const { id } = await params;
  if (!/^\d+$/.test(id)) return NextResponse.json({ message: "Not found." }, { status: 404 });
  return forwardToLaravel(`/api/auth/passkeys/${id}`, method === "PATCH" ? req : null, { method, auth: true });
}

export function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return forward(req, params, "PATCH");
}

export function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  return forward(req, params, "DELETE");
}
