import Link from 'next/link';

export const metadata = {
  title: 'MCP Server Directory',
  description: 'Curated directory of Model Context Protocol (MCP) servers for AI agents. Find servers for data, code, browser automation, and more.',
};

const categories = [
  { name: 'Data', emoji: '🗄️', description: 'Database connectors, data pipelines, CSV/JSON processing' },
  { name: 'Code', emoji: '💻', description: 'Code execution, repo analysis, file operations' },
  { name: 'Browser', emoji: '🌐', description: 'Web scraping, browser automation, page interactions' },
  { name: 'Communication', emoji: '📬', description: 'Email, Slack, Discord, and messaging integrations' },
  { name: 'Filesystem', emoji: '📁', description: 'Local file operations, document processing' },
  { name: 'Utilities', emoji: '🛠️', description: 'Search, API clients, general-purpose tools' },
];

const servers = [
  { slug: 'filesystem', name: 'Filesystem', description: 'Read, write, and manage local files via the MCP protocol. Supports glob patterns, directory traversal, and atomic writes.', category: 'Filesystem', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem', stars: 1200, official: true },
  { slug: 'brave-search', name: 'Brave Search', description: 'Web search via the Brave Search API. Supports local and global results, news, and image search with customizable freshness filters.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/brave-search', stars: 890, official: true },
  { slug: 'github', name: 'GitHub', description: 'Full GitHub API integration — repositories, issues, pull requests, reviews, workflows, and file contents. Supports GraphQL and REST.', category: 'Code', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github', stars: 2100, official: true },
  { slug: 'slack', name: 'Slack', description: 'Post messages, manage channels, search history, and handle webhooks. Supports block kit formatting and threaded replies.', category: 'Communication', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack', stars: 760, official: true },
  { slug: 'memory', name: 'Memory', description: 'Persistent key-value store for agent memory and context. Uses SQLite under the hood — no external database required.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory', stars: 1500, official: true },
  { slug: 'sqlite', name: 'SQLite', description: 'Query and manage SQLite databases with full SQL support. Includes schema inspection, query execution, and transaction support.', category: 'Data', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite', stars: 640, official: true },
  { slug: 'puppeteer', name: 'Puppeteer', description: 'Headless Chrome automation for browser tasks — screenshot capture, PDF generation, form submission, and web scraping with full JS execution.', category: 'Browser', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/puppeteer', stars: 930, official: true },
  { slug: 'aws-kb-retrieval', name: 'AWS KB Retrieval', description: 'Query Amazon Bedrock Knowledge Bases for contextual document retrieval. Supports semantic search across PDFs, Markdown, and HTML.', category: 'Data', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/aws-kb-retrieval-server', stars: 340, official: true },
  { slug: 'sentry', name: 'Sentry', description: 'Monitor and manage Sentry issues, events, and projects. Fetch stack traces, assign issues, and resolve errors programmatically.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sentry', stars: 280, official: true },
  { slug: 'everart', name: 'EverArt', description: 'AI image generation powered by Stability AI. Generate, edit, and transform images using text prompts with style and composition controls.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/everart', stars: 190, official: true },
  { slug: 'openapi', name: 'OpenAPI', description: 'Interact with any REST API via its OpenAPI/Swagger spec. Generates typed tool calls from schema — no manual HTTP wiring needed.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/openapi', stars: 420, official: true },
  { slug: 'google-maps', name: 'Google Maps', description: 'Places search, directions, distance matrix, elevation, and geocoding. Includes timezone lookups and address autocomplete.', category: 'Utilities', url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps', stars: 510, official: true },
];

export default function DirectoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-700/50 text-green-700 dark:text-green-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
          <span>New</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">MCP Server Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 max-w-2xl">
          Curated Model Context Protocol servers for AI agents. Find the right MCP server to power your AI workflows.
          All servers are open source unless noted.
        </p>
      </div>

      {/* Categories */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              aria-label={"Filter by " + cat.name}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-4 text-left transition-all group"
            >
              <span className="text-2xl block mb-2">{cat.emoji}</span>
              <span className="font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors text-sm block">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Server list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            All Servers ({servers.length})
          </h2>
          <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors">
            Submit a server
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {servers.map((server) => (
            <a
              key={server.slug}
              href={server.url}
              className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-600 rounded-xl p-5 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                    {server.name}
                  </h3>
                  <span className="inline-block mt-1 text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                    {server.category}
                  </span>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
                    {server.description}
                  </p>
                </div>
                <span className="text-gray-400 dark:text-gray-600 group-hover:text-green-500 dark:group-hover:text-green-400 transition-colors shrink-0">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-gray-500 dark:text-gray-400 text-sm mt-6">
          More servers coming soon. Want to add one?{' '}
          <button aria-label="Submit a server to the directory" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline transition-colors">
            Submit a server
          </button>
        </p>
      </section>

      {/* Info section */}
      <section className="mt-12 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">What is MCP?</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-2xl mb-4">
          The Model Context Protocol (MCP) is an open specification that enables AI applications to connect
          to external tools and data sources. Think of it as USB for AI agents — a standardized way to
          plug in capabilities.
        </p>
        <Link
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 text-sm transition-colors"
        >
          Learn more at modelcontextprotocol.io
        </Link>
      </section>
    </div>
  );
}
