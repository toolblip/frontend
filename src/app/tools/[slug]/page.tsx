import { tools } from '@/data/tools';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';

import ShareButtons from '@/components/ShareButtons';

// Real UI components
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map(t => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Toolblip`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} — Toolblip`,
      description: tool.description,
      url: `https://toolblip.com/tools/${slug}`,
      siteName: 'Toolblip',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} — Toolblip`,
      description: tool.description,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  Text: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  Developer: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  Encoder: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  Image: 'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300',
  Conversion: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  Math: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  CSS: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-300',
  SEO: 'bg-teal-100 text-teal-700 dark:bg-teal-900 dark:text-teal-300',
  Color: 'bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300',
};

function ToolUIPlaceholder() {
  return (
    <div className="space-y-4">
      <div className="bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-10 text-center">
        <div className="text-4xl mb-3">🚧</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">Coming soon</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
          This tool is on our roadmap. Want to help build it? Check out the open-source repo.
        </p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Preview</label>
        <textarea
          placeholder="This tool isn't ready yet — check back soon!"
          rows={5}
          className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors resize-none font-mono text-sm"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1 block">Output</label>
        <textarea
          readOnly
          rows={5}
          className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-lg px-4 py-3 font-mono text-sm resize-none"
          placeholder="..."
        />
      </div>
    </div>
  );
}

export default async function ToolDetailPage({ params }: Props) {
  const { slug } = await params;
  const tool = tools.find(t => t.slug === slug);

  if (!tool) notFound();

  const colorClass = CATEGORY_COLORS[tool.category] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';

  function renderToolUI() {
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
        return <UrlEncodeClient />;
      case 'json-formatter':
        return <JsonFormatterClient />;
      default:
        return <ToolUIPlaceholder />;
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top nav */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/tools" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
            ← All tools
          </Link>
        </div>
      </div>

      {/* Tool header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-10">
          <div className="flex items-start gap-4">
            <span className="text-5xl">{tool.emoji}</span>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
                  {tool.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
              <p className="mt-2 text-gray-500 dark:text-gray-400 leading-relaxed max-w-xl">
                {tool.description}
              </p>
              <div className="mt-4">
                <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tool UI */}
      <div className="max-w-3xl mx-auto px-4 py-10">
        {renderToolUI()}
      </div>
    </div>
  );
}
