import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCanonicalToolSlug, getToolBySlug, getToolRouteSlugs } from '@/data/tools';
import { ToolUI } from '../../[slug]/ToolUI';
import ToolEngagementBar from '@/components/tools/ToolEngagementBar';
import ToolAdSlot from '@/components/ads/ToolAdSlot';
import ToolWithSidebarAd from '@/components/ads/ToolWithSidebarAd';
import ToolContentSection from '@/components/tools/ToolContentSection';
import FaqSection from '@/components/v2/FaqSection';
import RelatedTools from '@/components/tools/RelatedTools';
import RelatedBlogPosts from '@/components/tools/RelatedBlogPosts';
import { getFaqs } from '@/lib/faq';
import { getToolContent } from '@/data/tool-content';

interface PageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  const tools = getToolRouteSlugs();
  return tools.map((slug) => {
    const tool = getToolBySlug(slug);
    if (!tool) return null;
    const category = tool.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    return { category, slug };
  }).filter(Boolean);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalToolSlug(slug);
  const tool = getToolBySlug(canonicalSlug);
  if (!tool) return { title: 'Tool Not Found' };
  
  const url = `https://toolblip.com/tools/${tool.category.toLowerCase().replace(/\s+/g, '-')}/${tool.slug}`;
  
  return {
    title: `${tool.name} | Toolblip`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url,
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
  const canonicalSlug = getCanonicalToolSlug(slug);
  const tool = getToolBySlug(canonicalSlug);
  if (!tool) notFound();
  
  const faqs = getFaqs(tool);
  const content = getToolContent(tool.slug);
  const categorySlug = tool.category.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  return (
    <div data-testid="tool-detail-shell" className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
        <a href="/" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">Home</a>
        <span>/</span>
        <a href="/all-tools" className="hover:text-red-600 dark:hover:text-red-400 transition-colors">All Tools</a>
        <span>/</span>
        <a href={`/tools/${categorySlug}`} className="hover:text-red-600 dark:hover:text-red-400 transition-colors">{tool.category}</a>
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
        {tool.slug !== 'banner-generator' && (
          <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-4">{tool.description}</p>
        )}
        <ToolEngagementBar toolName={tool.name} toolSlug={tool.slug} toolIcon={tool.emoji} />
      </div>

      {/* Above-tool ad slot */}
      <div className="mb-6">
        <ToolAdSlot placement="tool-above" slug={tool.slug} category={tool.category} />
      </div>

      {/* Tool UI, with an optional sidebar ad on desktop */}
      <ToolWithSidebarAd slug={tool.slug} category={tool.category}>
        <div className="p-0">
          <ToolUI tool={tool} />
        </div>
      </ToolWithSidebarAd>

      <div className="mb-10 mt-8">
        <ToolAdSlot placement="tool-below" slug={tool.slug} category={tool.category} />
      </div>

      <ToolContentSection toolName={tool.name} content={content} />

      <RelatedTools slug={tool.slug} category={tool.category} />
      <RelatedBlogPosts toolName={tool.name} category={tool.category} tags={tool.tags} />

      <FaqSection toolName={tool.name} faqs={faqs} />
    </div>
  );
}
