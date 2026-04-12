'use client';

import { useState, useMemo } from 'react';
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

export default function ToolsClient() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allTools.filter(tool => {
      const matchesQuery =
        !q ||
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        tool.slug.toLowerCase().includes(q);
      const matchesCategory = activeCategory === 'All' || tool.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">All Tools</h1>
        <p className="text-gray-400">
          {allTools.length} free tools — 100% client-side, nothing leaves your browser.
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tools..."
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-3 pl-10 placeholder-gray-500 focus:outline-none focus:border-green-600 transition-colors"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              activeCategory === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results count */}
      {(query || activeCategory !== 'All') && (
        <p className="text-gray-500 text-sm mb-4">
          {filtered.length === 0
            ? 'No tools found'
            : `${filtered.length} tool${filtered.length !== 1 ? 's' : ''} found`}
        </p>
      )}

      {/* Tool grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(tool => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group bg-gray-900 border border-gray-800 hover:border-green-600 rounded-xl p-4 transition-all hover:shadow-lg hover:shadow-green-900/20"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{tool.emoji}</span>
                <div className="min-w-0">
                  <h2 className="font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                    {tool.name}
                  </h2>
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
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg mb-2">
            No tools match &ldquo;{query}&rdquo;
          </p>
          <button
            onClick={() => { setQuery(''); setActiveCategory('All'); }}
            className="text-green-400 hover:text-green-300 text-sm"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
