import Link from 'next/link';
import type { Tool } from '@/data/tools';
import { ToolUI } from './[slug]/ToolUI';
import ToolEngagementBar from '@/components/tools/ToolEngagementBar';
import ToolContentSection from '@/components/tools/ToolContentSection';
import FaqSection from '@/components/v2/FaqSection';
import ToolWrapper from '@/components/tools/ToolWrapper';
import RelatedTools from '@/components/tools/RelatedTools';
import RelatedBlogPosts from '@/components/tools/RelatedBlogPosts';
import { getFaqs, hasFaqOverride } from '@/lib/faq';
import { getToolContent } from '@/data/tool-content';
import { getCategoryPath } from '@/lib/tool-path';

export default function ToolDetailView({ tool }: { tool: Tool }) {
  const faqs = getFaqs(tool);
  const content = getToolContent(tool.slug);

  return (
    <div data-testid="tool-detail-shell" className="tb-v2-tool-page">
      <div className="tb-v2-container">
        <nav className="tb-v2-breadcrumb">
          <Link href="/">Home</Link>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <Link href="/tools">Tools</Link>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <Link href={getCategoryPath(tool.category)}>{tool.category}</Link>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <span>{tool.name}</span>
        </nav>

        <div className="tb-v2-tool-header">
          <div className="tb-v2-tool-emoji">{tool.emoji}</div>
          <div className="tb-v2-tool-title-group">
            <h1 className="tb-v2-tool-title">{tool.name}</h1>
            <div className="tb-v2-tool-header-row">
              <span className="tb-v2-tool-cat-pill">{tool.category}</span>
            </div>
          </div>
        </div>
        {tool.slug !== 'banner-generator' && (
          <p className="tb-v2-tool-desc" style={{ marginBottom: 20 }}>{tool.description}</p>
        )}
        <ToolEngagementBar toolName={tool.name} toolSlug={tool.slug} toolIcon={tool.emoji} />

        <ToolWrapper toolSlug={tool.slug} toolName={tool.name}>
          <ToolUI tool={tool} />
        </ToolWrapper>

        {tool.slug === 'image-background-remover' && (
          <section aria-label="Background removal guidance" className="mt-6 rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            <h2 className="mb-2 text-base font-semibold text-gray-900 dark:text-white">How to choose a method</h2>
            <p className="mb-2">AI Remove works best when the subject stands apart from the background. The model downloads on first use and runs in your browser. Review fine edges before downloading.</p>
            <p>For a plain background, try Auto Detect. For a green screen or another known color, use Color Key and adjust Tolerance. Cancel discards an AI result, although processing may finish in the background.</p>
          </section>
        )}

        <ToolContentSection toolName={tool.name} content={content} />

        <RelatedTools slug={tool.slug} category={tool.category} />
        <RelatedBlogPosts toolName={tool.name} category={tool.category} tags={tool.tags} />

        <FaqSection toolName={tool.name} faqs={faqs} emitSchema={hasFaqOverride(tool.slug)} />
      </div>
    </div>
  );
}
