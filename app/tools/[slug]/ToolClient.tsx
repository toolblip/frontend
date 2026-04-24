'use client';

import type { Tool } from '@/data/tools';
import Link from 'next/link';

// Real tool UIs
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import GenericToolUI from '@/components/tools/GenericToolUI';

// Map slugs to real client components
function getToolComponent(slug: string): React.ReactNode {
  switch (slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64':
      return <Base64Client />;
    case 'url-encode':
    case 'url-encoder':
      return <UrlEncodeClient />;
    case 'json-formatter':
    case 'json-editor':
      return <JsonFormatterClient />;

    // Fallback: generic input/output UI for simple transform tools
    default:
      return <ComingSoonUI toolSlug={slug} />;
  }
}

function ComingSoonUI({ toolSlug }: { toolSlug: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 text-sm text-amber-700 dark:text-amber-400">
        🎉 This tool is on our roadmap. The UI is coming soon!
      </div>
      <GenericToolUI
        inputLabel="Input"
        inputPlaceholder="Enter text..."
        outputLabel="Output"
        actionLabel="Process"
        process={(input) => {
          // Placeholder: just echo
          return `[${toolSlug}] — ${input}`;
        }}
      />
    </div>
  );
}

export default function ToolClient({ tool }: { tool: Tool }) {
  const component = getToolComponent(tool.slug);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-500 dark:text-gray-400">
        <Link href="/tools" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">
          All Tools
        </Link>
        <span className="mx-2">›</span>
        <span>{tool.category}</span>
      </nav>

      {/* Tool header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {tool.name}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
          {tool.description}
        </p>
        <span className="inline-block text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1 rounded-full">
          {tool.category}
        </span>
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        {component}
      </div>

      {/* Footer note */}
      <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
        100% client-side — nothing leaves your browser
      </p>
    </div>
  );
}
