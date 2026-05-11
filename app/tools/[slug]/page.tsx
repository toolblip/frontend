import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { tools } from '@/data/tools';
import { ToolUI } from './ToolUI';
import ToolEngagementBar from '@/components/tools/ToolEngagementBar';
import ShareButtons from '@/components/ShareButtons';
import FaqSection from '@/components/v2/FaqSection';
import { getFaqs } from '@/lib/faq';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Slugs that exist in old blog posts / wild URLs but not in data/tools.ts */
const REDIRECTS: Record<string, string> = {
  'lorem-ipsum':         'lorem-ipsum-generator',
  'letter-counter':      'word-counter',
  'mime-type-checker':   'mime-types-reference',
  'random-string':       'password-generator',
  'uuid-v4':             'uuid-generator',
  'wifi-qr':             'wifi-qr-code-generator',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (REDIRECTS[slug]) return { title: 'Redirecting…' };
  const tool = tools.find(t => t.slug === slug);
  if (!tool) return { title: 'Tool Not Found' };
  return {
    title: `${tool.name} — Free Online Tool`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url: `https://toolblip.com/tools/${slug}`,
      siteName: 'Toolblip',
      images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  if (REDIRECTS[slug]) redirect(`/tools/${REDIRECTS[slug]}`);
  const tool = tools.find(t => t.slug === slug);
  if (!tool) notFound();
  const faqs = getFaqs(tool);

  return (
    <div data-testid="tool-detail-shell" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <a href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Home</a>
        <span>/</span>
        <a href="/tools" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Tools</a>
        <span>/</span>
        <a href={`/tools?category=${encodeURIComponent(tool.category)}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{tool.category}</a>
        <span>/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-4xl">{tool.emoji}</span>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{tool.name}</h1>
            <span className="inline-block mt-1 text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950 px-2.5 py-0.5 rounded-full font-medium">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{tool.description}</p>
        <div className="mb-4">
          <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
        </div>
        <ToolEngagementBar toolName={tool.name} toolSlug={tool.slug} toolIcon={tool.emoji} />
      </div>

      {/* Tool UI */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
        <ToolUI tool={tool} />
      </div>

      <FaqSection toolName={tool.name} faqs={faqs} />
    </div>
  );
}
