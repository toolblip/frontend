'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { Tool } from '@/data/tools';
import ShareButtons from '@/components/ShareButtons';

// Real tool UI components
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';

// ─── Coming Soon placeholder ────────────────────────────────────────────────
function ComingSoonPlaceholder({ tool }: { tool: Tool }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  return (
    <div className="space-y-4">
      <p className="text-gray-500 dark:text-gray-400 text-sm">
        This tool is being built. The UI below is a preview of how it will work.
      </p>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Enter input..."
        rows={6}
        className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
      />
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg px-4 py-8 text-center">
        <span className="text-3xl block mb-2">{tool.emoji}</span>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          {tool.name} — Coming Soon
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
          Full UI is under construction
        </p>
      </div>
    </div>
  );
}

// ─── Tool renderer ───────────────────────────────────────────────────────────
function ToolRenderer({ tool }: { tool: Tool }) {
  switch (tool.slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64':
      return <Base64Client />;
    case 'url-encode':
      return <UrlEncodeClient />;
    case 'json-formatter':
      return <JsonFormatterClient />;
    default:
      return <ComingSoonPlaceholder tool={tool} />;
  }
}

// ─── Main component ─────────────────────────────────────────────────────────
export default function ToolClient({ tool }: { tool: Tool }) {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <ol className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
          <li>
            <Link href="/" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li>
            <Link href="/tools" className="hover:text-gray-900 dark:hover:text-white transition-colors">
              Tools
            </Link>
          </li>
          <li aria-hidden>›</li>
          <li className="text-gray-900 dark:text-white font-medium truncate max-w-[200px]">
            {tool.name}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-4 mb-4">
          <span className="text-5xl">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {tool.name}
            </h1>
            <span className="inline-block mt-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-1 rounded-full border border-red-100 dark:border-red-900">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
          {tool.description}
        </p>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolRenderer tool={tool} />
      </div>

      {/* Share */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-3 font-medium uppercase tracking-wide">Share this tool</p>
        <ShareButtons toolName={tool.name} />
      </div>

      {/* Footer note */}
      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-600">
        100% client-side — nothing is sent to any server
      </p>
    </div>
  );
}
