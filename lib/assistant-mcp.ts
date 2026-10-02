import { publicTools } from '@/lib/llms-txt';
import { getToolAbsoluteUrl } from '@/lib/tool-path';

const PROTOCOL_VERSION = '2025-03-26';

type JsonRpc = {
  jsonrpc?: string;
  id?: string | number | null;
  method?: string;
  params?: { name?: string; arguments?: Record<string, unknown> };
};

function toolCard(tool: { name: string; slug: string; description: string; category: string }) {
  return {
    name: tool.name,
    slug: tool.slug,
    category: tool.category,
    description: tool.description.replace(/\s+/g, ' ').trim(),
    url: getToolAbsoluteUrl(tool),
  };
}

export function searchPublicTools(query: string, limit = 8) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [];
  return publicTools()
    .map((tool) => {
      const name = tool.name.toLowerCase();
      const slug = tool.slug.toLowerCase();
      const details = `${tool.description} ${tool.category} ${(tool.tags ?? []).join(' ')}`.toLowerCase();
      const score = terms.reduce((total, term) => {
        return total
          + (name.includes(term) ? 3 : 0)
          + (slug.includes(term) ? 3 : 0)
          + (details.includes(term) ? 1 : 0);
      }, 0);
      return { tool, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .slice(0, limit)
    .map((entry) => toolCard(entry.tool));
}

export function findPublicTool(slug: string) {
  const tool = publicTools().find((entry) => entry.slug === slug);
  return tool ? toolCard(tool) : null;
}

function textResult(text: string, isError = false) {
  return { content: [{ type: 'text', text }], isError };
}

function callTool(name: string, args: Record<string, unknown>) {
  if (name === 'search_tools') {
    const query = typeof args.query === 'string' ? args.query : '';
    const matches = searchPublicTools(query);
    const text = matches.length === 0
      ? `No public Toolblip tool matched "${query}".`
      : matches.map((tool) => `${tool.name} (${tool.category}): ${tool.url} — ${tool.description}`).join('\n');
    return textResult(text);
  }
  if (name === 'get_tool') {
    const slug = typeof args.slug === 'string' ? args.slug : '';
    const tool = findPublicTool(slug);
    if (!tool) return textResult(`No public tool with slug "${slug}".`, true);
    return textResult(`${tool.name}\n${tool.url}\n${tool.description}`);
  }
  return textResult(`Unknown tool "${name}".`, true);
}

export function handleMcpMessage(message: JsonRpc) {
  const id = message.id ?? null;
  if (message.method === 'notifications/initialized' || message.method === 'notifications/cancelled') {
    return null;
  }
  if (message.method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: PROTOCOL_VERSION,
        capabilities: { tools: { listChanged: false } },
        serverInfo: { name: 'toolblip', version: '1.0.0' },
      },
    };
  }
  if (message.method === 'ping') {
    return { jsonrpc: '2.0', id, result: {} };
  }
  if (message.method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: [
          {
            name: 'search_tools',
            description: 'Find public Toolblip tools and their canonical URLs for citation.',
            inputSchema: {
              type: 'object',
              properties: { query: { type: 'string', description: 'What the person wants to do' } },
              required: ['query'],
            },
          },
          {
            name: 'get_tool',
            description: 'Return the canonical URL and description for one public tool slug.',
            inputSchema: {
              type: 'object',
              properties: { slug: { type: 'string' } },
              required: ['slug'],
            },
          },
        ],
      },
    };
  }
  if (message.method === 'tools/call') {
    const name = message.params?.name ?? '';
    const args = message.params?.arguments ?? {};
    return { jsonrpc: '2.0', id, result: callTool(name, args) };
  }
  return {
    jsonrpc: '2.0',
    id,
    error: { code: -32601, message: `Method not found: ${message.method ?? ''}` },
  };
}
