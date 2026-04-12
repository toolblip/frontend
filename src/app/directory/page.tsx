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

// Placeholder servers for initial deployment (replace with API data when backend is ready)
const placeholderServers = [
  { slug: 'filesystem', name: 'Filesystem', description: 'Read, write, and manage local files via MCP protocol.', category: 'Filesystem', url: '#' },
  { slug: 'brave-search', name: 'Brave Search', description: 'Web search via Brave Search API, with local and global result support.', category: 'Utilities', url: '#' },
  { slug: 'sqlite', name: 'SQLite', description: 'Query and manage SQLite databases with full SQL support.', category: 'Data', url: '#' },
  { slug: 'github', name: 'GitHub', description: 'Interact with GitHub repositories, issues, PRs, and workflows.', category: 'Code', url: '#' },
  { slug: 'slack', name: 'Slack', description: 'Post messages, manage channels, and query Slack workspaces.', category: 'Communication', url: '#' },
  { slug: 'puppeteer', name: 'Puppeteer', description: 'Browser automation and web scraping via headless Chrome.', category: 'Browser', url: '#' },
  { slug: 'memory', name: 'Memory', description: 'Persistent key-value storage for agent memory and context.', category: 'Utilities', url: '#' },
  { slug: 'aws-kb-retrieval', name: 'AWS KB Retrieval', description: 'Query AWS Knowledge Base for contextual document retrieval.', category: 'Data', url: '#' },
];

export default function DirectoryPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-green-900/30 border border-green-700/50 text-green-400 text-xs font-medium px-3 py-1 rounded-full mb-4">
          <span>New</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">MCP Server Directory</h1>
        <p className="text-gray-400 max-w-2xl">
          Curated Model Context Protocol servers for AI agents. Find the right MCP server to power your AI workflows.
          All servers are open source unless noted.
        </p>
      </div>

      {/* Categories */}
      <section className="mb-10">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              aria-label={"Filter by " + cat.name}
              className="bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-4 text-left transition-all group"
            >
              <span className="text-2xl block mb-2">{cat.emoji}</span>
              <span className="font-medium text-white group-hover:text-green-400 transition-colors text-sm block">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Server list */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            All Servers ({placeholderServers.length})
          </h2>
          <button className="text-sm text-green-400 hover:text-green-300 transition-colors">
            Submit a server →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {placeholderServers.map((server) => (
            <a
              key={server.slug}
              href={server.url}
              className="group bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-5 transition-all hover:shadow-lg hover:shadow-green-900/20"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                    {server.name}
                  </h3>
                  <span className="inline-block mt-1 text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
                    {server.category}
                  </span>
                  <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                    {server.description}
                  </p>
                </div>
                <span className="text-gray-600 group-hover:text-green-400 transition-colors shrink-0">
                  ↗
                </span>
              </div>
            </a>
          ))}
        </div>

        <p className="text-center text-gray-400 text-sm mt-6">
          More servers coming soon. Want to add one?{' '}
          <button aria-label="Submit a server to the directory" className="text-green-400 hover:text-green-300 underline transition-colors">
            Submit a server
          </button>
        </p>
      </section>

      {/* Info section */}
      <section className="mt-12 bg-gray-900 border border-gray-800 rounded-2xl p-8">
        <h2 className="text-xl font-semibold text-white mb-3">What is MCP?</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl mb-4">
          The Model Context Protocol (MCP) is an open specification that enables AI applications to connect
          to external tools and data sources. Think of it as USB for AI agents — a standardized way to
          plug in capabilities.
        </p>
        <Link
          href="https://modelcontextprotocol.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-400 hover:text-green-300 text-sm transition-colors"
        >
          Learn more at modelcontextprotocol.io →
        </Link>
      </section>
    </div>
  );
}
