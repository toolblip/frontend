// Starter catalog for the AI MCP Bots menu. Bots link to each vendor's MCP
// docs. Servers are the official reference set:
// https://github.com/modelcontextprotocol/servers

export type AiMcpMenuItem = {
  icon: string;
  label: string;
  desc: string;
  href: string;
  external: true;
};

export type AiMcpMenuColumn = {
  label: string;
  items: AiMcpMenuItem[];
};

const REF = 'https://github.com/modelcontextprotocol/servers/tree/main/src';

export const aiMcpMenu: {
  columns: AiMcpMenuColumn[];
  tip: { title: string; body: string };
} = {
  columns: [
    {
      label: 'AI bots',
      items: [
        {
          icon: 'command',
          label: 'Claude',
          desc: 'Desktop and Claude Code',
          href: 'https://code.claude.com/docs/en/mcp',
          external: true,
        },
        {
          icon: 'zap',
          label: 'ChatGPT',
          desc: 'MCP connectors',
          href: 'https://developers.openai.com/api/docs/mcp',
          external: true,
        },
        {
          icon: 'code',
          label: 'Cursor',
          desc: 'Servers in the editor',
          href: 'https://cursor.com/docs/mcp',
          external: true,
        },
        {
          icon: 'globe',
          label: 'Gemini CLI',
          desc: 'Tools for the Gemini CLI',
          href: 'https://geminicli.com/docs/tools/mcp-server/',
          external: true,
        },
        {
          icon: 'file',
          label: 'VS Code',
          desc: 'Copilot with MCP servers',
          href: 'https://code.visualstudio.com/docs/agent-customization/mcp-servers',
          external: true,
        },
      ],
    },
    {
      label: 'MCP servers',
      items: [
        {
          icon: 'file',
          label: 'Filesystem',
          desc: 'Only the folders you allow',
          href: `${REF}/filesystem`,
          external: true,
        },
        {
          icon: 'globe',
          label: 'Fetch',
          desc: 'A page, as markdown',
          href: `${REF}/fetch`,
          external: true,
        },
        {
          icon: 'code',
          label: 'Git',
          desc: 'Read and search a repo',
          href: `${REF}/git`,
          external: true,
        },
        {
          icon: 'hash',
          label: 'Memory',
          desc: 'A knowledge graph',
          href: `${REF}/memory`,
          external: true,
        },
        {
          icon: 'help',
          label: 'Sequential Thinking',
          desc: 'One step at a time',
          href: `${REF}/sequentialthinking`,
          external: true,
        },
        {
          icon: 'clock',
          label: 'Time',
          desc: 'Clock and timezones',
          href: `${REF}/time`,
          external: true,
        },
        {
          icon: 'util',
          label: 'Everything',
          desc: 'Test server for the full surface',
          href: `${REF}/everything`,
          external: true,
        },
      ],
    },
    {
      label: 'References',
      items: [
        {
          icon: 'file',
          label: 'Protocol',
          desc: 'How MCP fits together',
          href: 'https://modelcontextprotocol.io/',
          external: true,
        },
        {
          icon: 'globe',
          label: 'Registry',
          desc: 'Servers people have published',
          href: 'https://registry.modelcontextprotocol.io/',
          external: true,
        },
        {
          icon: 'link',
          label: 'Reference servers',
          desc: 'The official implementations',
          href: 'https://github.com/modelcontextprotocol/servers',
          external: true,
        },
      ],
    },
  ],
  tip: {
    title: 'Starter list',
    body: "Bots from each vendor's MCP docs. Servers are the official reference set. More will show up here.",
  },
};
