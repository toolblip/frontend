import Link from 'next/link';

const tools = [
  { name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, and reading time instantly.', emoji: '📝' },
  { name: 'Character Counter', slug: 'character-counter', description: 'Count characters with Twitter, LinkedIn, and meta tag limit indicators.', emoji: '🔢' },
  { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and minify JSON with error highlighting.', emoji: '📋' },
  { name: 'Base64 Encode / Decode', slug: 'base64', description: 'Encode and decode Base64 text or files instantly in your browser.', emoji: '🔐' },
  { name: 'Case Converter', slug: 'case-converter', description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.', emoji: '✏️' },
  { name: 'URL Encode / Decode', slug: 'url-encode', description: 'Encode and decode URLs or URL components for safe use in links.', emoji: '🔗' },
  { name: 'Image Cropper', slug: 'image-cropper', description: 'Crop images to any ratio or preset size — passport, 16:9, square, and more.', emoji: '✂️' },
  { name: 'UUID Generator', slug: 'uuid-generator', description: "Generate one or many UUID v4 values using your browser's crypto API.", emoji: '🔑' },
  { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', description: 'Paste text, remove duplicate lines in one click. Case-sensitive option included.', emoji: '🗑️' },
  { name: 'Markdown to HTML', slug: 'markdown-to-html', description: 'Convert Markdown to HTML with a live split-pane preview.', emoji: '📄' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages, percentage change, tips, and discounts instantly.', emoji: '%' },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4 text-center border-b border-gray-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
            Every tool you need — <br />
            <span className="text-green-400">no account, no server, no BS.</span>
          </h1>
          <p className="text-lg text-gray-400 mb-8 max-w-xl mx-auto">
            100% client-side. Nothing leaves your browser. No sign-up. Always free.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm">
            {[
              { label: 'Private by default', icon: '✓' },
              { label: 'Zero upload', icon: '✓' },
              { label: 'Works offline', icon: '✓' },
              { label: 'No ads on tools', icon: '✓' },
            ].map(({ label, icon }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-full text-gray-300"
              >
                <span className="text-green-400">{icon}</span> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-300">All Tools</h2>
            <Link
              href="/directory"
              className="text-sm text-green-400 hover:text-green-300 transition-colors"
            >
              Browse directory →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-green-900/20"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tool.emoji}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1 leading-relaxed line-clamp-2">
                      {tool.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MCP Directory callout */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 border border-green-700/50 rounded-2xl p-8 text-center">
            <h2 className="text-xl font-semibold text-white mb-2">
              Looking for MCP servers?
            </h2>
            <p className="text-gray-400 mb-4 text-sm max-w-lg mx-auto">
              Explore our curated directory of Model Context Protocol servers for AI agents.
              Find data connectors, code executors, browser automation, and more.
            </p>
            <Link
              href="/directory"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-500 text-black font-medium px-5 py-2 rounded-lg text-sm transition-colors"
            >
              Browse MCP Directory →
            </Link>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-12 px-4 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            Built for developers who care about privacy
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto">
            Every tool on Toolblip runs entirely in your browser using JavaScript and WebAssembly.
            Your files, text, and data never leave your device. There is no backend processing your inputs.
          </p>
        </div>
      </section>
    </>
  );
}
