// Starter dropdown for AI / MCP / Bots. Add items here; each one gets its own page.

export type AiMcpMenuItem = {
  slug: string;
  icon: string;
  label: string;
  desc: string;
  href: string;
};

export type AiMcpMenuColumn = {
  label: string;
  items: AiMcpMenuItem[];
};

function item(slug: string, icon: string, label: string, desc: string): AiMcpMenuItem {
  return { slug, icon, label, desc, href: `/ai-mcp-bots/${slug}` };
}

export const aiMcpMenu: {
  columns: AiMcpMenuColumn[];
  tip: { title: string; body: string };
} = {
  columns: [
    {
      label: 'AI bots',
      items: [
        item('claude', 'command', 'Claude', 'Desktop and Claude Code'),
        item('chatgpt', 'zap', 'ChatGPT', 'MCP connectors'),
        item('cursor', 'code', 'Cursor', 'Servers in the editor'),
      ],
    },
    {
      label: 'MCP servers',
      items: [
        item('filesystem', 'file', 'Filesystem', 'Only the folders you allow'),
        item('fetch', 'globe', 'Fetch', 'A page, as markdown'),
        item('git', 'code', 'Git', 'Read and search a repo'),
      ],
    },
  ],
  tip: {
    title: 'Starter list',
    body: 'Each one has its own page. More will show up here.',
  },
};

export function aiMcpItems() {
  return aiMcpMenu.columns.flatMap((column) =>
    column.items.map((entry) => ({ ...entry, group: column.label })),
  );
}

export function aiMcpItemBySlug(slug: string) {
  return aiMcpItems().find((entry) => entry.slug === slug);
}
