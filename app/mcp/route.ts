import { handleMcpMessage } from '@/lib/assistant-mcp';

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, { status: 400 });
  }
  const messages = Array.isArray(body) ? body : [body];
  const replies = messages
    .filter((message): message is { method?: string; id?: string | number | null } => typeof message === 'object' && message !== null)
    .map((message) => handleMcpMessage(message))
    .filter((reply) => reply !== null);
  if (replies.length === 0) return new Response(null, { status: 202 });
  return Response.json(Array.isArray(body) ? replies : replies[0], {
    headers: { 'Cache-Control': 'no-store' },
  });
}
