// Starter catalog for the AI / MCP / Bots menu. Every item stays on Toolblip.

export type AiMcpMenuItem = {
  icon: string;
  label: string;
  desc: string;
  href: string;
};

export type AiMcpMenuColumn = {
  label: string;
  items: AiMcpMenuItem[];
};

export function aiMcpItemId(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function item(icon: string, label: string, desc: string): AiMcpMenuItem {
  return { icon, label, desc, href: `/ai-mcp-bots#${aiMcpItemId(label)}` };
}

export const aiMcpMenu: {
  columns: AiMcpMenuColumn[];
  tip: { title: string; body: string };
} = {
  columns: [
    {
      label: 'AI bots',
      items: [
        item('command', 'Claude', 'Desktop and Claude Code'),
        item('zap', 'ChatGPT', 'MCP connectors'),
        item('code', 'Cursor', 'Servers in the editor'),
        item('globe', 'Gemini CLI', 'Tools for the Gemini CLI'),
        item('file', 'VS Code', 'Copilot with MCP servers'),
      ],
    },
    {
      label: 'MCP servers',
      items: [
        item('file', 'Filesystem', 'Only the folders you allow'),
        item('globe', 'Fetch', 'A page, as markdown'),
        item('code', 'Git', 'Read and search a repo'),
        item('hash', 'Memory', 'A knowledge graph'),
        item('help', 'Sequential Thinking', 'One step at a time'),
        item('clock', 'Time', 'Clock and timezones'),
        item('util', 'Everything', 'Test server for the full surface'),
      ],
    },
    {
      label: 'References',
      items: [
        item('file', 'Protocol', 'How MCP fits together'),
        item('globe', 'Registry', 'Servers people have published'),
        item('link', 'Reference servers', 'The official implementations'),
      ],
    },
  ],
  tip: {
    title: 'On this site',
    body: 'Each item stays on Toolblip. More will show up here.',
  },
};
