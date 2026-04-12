import Link from 'next/link';

const allTools = [
  { name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, paragraphs, and reading time instantly.', emoji: '📝', category: 'Text' },
  { name: 'Character Counter', slug: 'character-counter', description: 'Count characters with Twitter, LinkedIn, and meta tag limit indicators.', emoji: '🔢', category: 'Text' },
  { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', description: 'Paste text, remove duplicate lines in one click. Case-sensitive option included.', emoji: '🗑️', category: 'Text' },
  { name: 'Case Converter', slug: 'case-converter', description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.', emoji: '✏️', category: 'Text' },
  { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and minify JSON with error highlighting.', emoji: '📋', category: 'Developer' },
  { name: 'Base64 Encode / Decode', slug: 'base64', description: 'Encode and decode Base64 text or files instantly in your browser.', emoji: '🔐', category: 'Encoder' },
  { name: 'URL Encode / Decode', slug: 'url-encode', description: 'Encode and decode URLs or URL components for safe use in links.', emoji: '🔗', category: 'Encoder' },
  { name: 'Image Cropper', slug: 'image-cropper', description: 'Crop images to any ratio or preset size — passport, 16:9, square, and more.', emoji: '✂️', category: 'Image' },
  { name: 'Image Format Converter', slug: 'image-format-converter', description: 'Convert images between JPEG, PNG, WebP, and AVIF with quality control and side-by-side preview.', emoji: '🖼️', category: 'Image' },
  { name: 'UUID Generator', slug: 'uuid-generator', description: "Generate one or many UUID v4 values using your browser's crypto API.", emoji: '🔑', category: 'Developer' },
  { name: 'Markdown to HTML', slug: 'markdown-to-html', description: 'Convert Markdown to HTML with a live split-pane preview.', emoji: '📄', category: 'Developer' },
  { name: 'YAML to JSON', slug: 'yaml-to-json', description: 'Convert YAML to JSON instantly with pretty-print, compact output, and custom indent size.', emoji: '🔄', category: 'Conversion' },
  { name: 'Cron Expression Parser', slug: 'cron-parser', description: 'Parse and validate cron expressions with human-readable descriptions and next 5 run times.', emoji: '⏱️', category: 'Developer' },
  { name: 'Hash Generator', slug: 'hash-generator', description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using your browser's native crypto API.", emoji: '#', category: 'Developer' },
  { name: 'Screen Resolution Tester', slug: 'screen-resolution-tester', description: 'Test any screen resolution or viewport size with device presets, custom dimensions, and a live scaled preview.', emoji: '🖥️', category: 'Developer' },
  { name: 'URL Slug Generator', slug: 'url-slug-generator', description: 'Convert any text into URL-friendly slugs with customizable separator and length limit.', emoji: '🔗', category: 'Developer' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages, percentage change, tips, and discounts instantly.', emoji: '%', category: 'Math' },
  { name: 'CSS Border Radius Generator', slug: 'css-border-radius-generator', description: 'Visually generate CSS border-radius values with per-corner controls, live preview, and one-click copy.', emoji: '⬜', category: 'CSS' },
  { name: 'CSS Gradient Generator', slug: 'css-gradient-generator', description: 'Create linear, radial, and conic CSS gradients with a live preview, color stops, angle control, and preset library.', emoji: '🌈', category: 'CSS' },
];

const categories = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'Conversion', 'Math', 'CSS'];

export const metadata = {
  title: 'All Tools',
  description: 'Browse all free browser-based developer tools on Toolblip. Word counter, JSON formatter, Base64 encoder, and more. 100% client-side.',
};

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">All Tools</h1>
        <p className="text-gray-400">
          {allTools.length} free tools — 100% client-side, nothing leaves your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {allTools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="group bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-green-900/20"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">{tool.emoji}</span>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                    {tool.name}
                  </h2>
                </div>
                <p className="text-sm text-gray-400 mt-1 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
                <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                  {tool.category}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
