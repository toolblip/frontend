import { notFound, permanentRedirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getCanonicalToolSlug, getToolBySlug, getToolRouteSlugs } from '@/data/tools';
import { ToolUI } from './ToolUI';
import ToolEngagementBar from '@/components/tools/ToolEngagementBar';
import ToolAdSlot from '@/components/ads/ToolAdSlot';
import ToolWithSidebarAd from '@/components/ads/ToolWithSidebarAd';
import ToolContentSection from '@/components/tools/ToolContentSection';
import FaqSection from '@/components/v2/FaqSection';
import ToolWrapper from '@/components/tools/ToolWrapper';
import RelatedTools from '@/components/tools/RelatedTools';
import RelatedBlogPosts from '@/components/tools/RelatedBlogPosts';
import { getFaqs, hasFaqOverride } from '@/lib/faq';
import { getToolContent } from '@/data/tool-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Union of real tool slugs (+ data/tools.ts's own alias map, via
  // getToolRouteSlugs) and this file's REDIRECTS map below. dynamicParams
  // is false, so every one of these needs a static param or its alias
  // redirect stops working and 404s instead.
  const slugs = new Set([...getToolRouteSlugs(), ...Object.keys(REDIRECTS)]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

// Any slug not covered by generateStaticParams (i.e. not a real tool and not
// a known legacy alias) 404s immediately instead of falling through to
// on-demand rendering. Keeps the crawlable surface exactly equal to the
// tool catalog plus the alias maps.
export const dynamicParams = false;

/**
 * Legacy slugs, query-variant slugs, and common misspellings that should
 * normalize to the canonical tool pages.
 */
const REDIRECTS: Record<string, string> = {
  'lorem-ipsum': 'lorem-ipsum-generator',
  'letter-counter': 'word-counter',
  'mime-type-checker': 'mime-types-reference',
  'random-string': 'password-generator',
  'uuid-v4': 'uuid-generator',
  'wifi-qr': 'wifi-qr-code-generator',

  // High-impression SEO aliases from GSC / search variants
  'keywords-generator-online': 'keyword-generator',
  'keywords-generator': 'keyword-generator',
  'keyword-maker': 'keyword-generator',
  'keyword-creator': 'keyword-generator',
  'keyword-tool-generator': 'keyword-generator',
  'keyword-suggestion-generator': 'keyword-generator',
  'keyword-generator-free': 'keyword-generator',
  'keyword-generator-online-free': 'keyword-generator',
  'online-keywords-generator': 'keyword-generator',
  'keyword-check-position': 'google-serp-simulator',
  'check-keyword-position': 'google-serp-simulator',
  'keyword-position-tool': 'google-serp-simulator',
  'keyword-position-checker-online': 'google-serp-simulator',
  'keyword-position-analyzer': 'google-serp-simulator',
  'keyword-position-search': 'google-serp-simulator',
  'keyword-placement-checker': 'google-serp-simulator',
  'keyword-website-checker': 'google-serp-simulator',
  'keywords-position-checker': 'google-serp-simulator',
  'check-keywords-position': 'google-serp-simulator',
  'serp-rank-checker-online': 'google-serp-simulator',
  'free-serp-tracking-online': 'google-serp-simulator',
  'serprank': 'google-serp-simulator',
  'serp-simulator': 'google-serp-simulator',
  'og-image-generator': 'banner-generator',
  'serpsimulator': 'google-serp-simulator',
  'serp-test': 'google-serp-simulator',
  'serp-testing-tool': 'google-serp-simulator',
  'google-serp-tool': 'google-serp-simulator',
  'google-serp-test': 'google-serp-simulator',
  'google-serps-preview': 'google-serp-simulator',
  'robots-txt-check': 'robots-txt-checker',
  'robots-txt-check-online': 'robots-txt-checker',
  'test-robots-txt-online': 'robots-txt-tester',
  'xml-sitemap-validator': 'sitemap-xml-validator',
  'readability-checker-free': 'readability-score',
  'flesch-kincaid-readability-calculator': 'readability-score',
  'free-online-poll-tools': 'poll-generator',
  'create-online-poll': 'poll-generator',
  'check-favicon': 'favicon-checker-express',
  'favicon-test': 'favicon-checker-express',
  'metadata-viewer': 'metadata',
  'mp4-gif': 'mp4-to-gif',
  'mp4-to-gif-converter': 'mp4-to-gif',
  'mp4-gif-converter': 'mp4-to-gif',
  'convert-mp4-to-gif': 'mp4-to-gif',
  'convert-mp4-to-gif-online': 'mp4-to-gif',
  'mp4-to-gif-online': 'mp4-to-gif',
  'poll-maker': 'poll-generator',
  'make-a-poll': 'poll-generator',
  'create-a-poll': 'poll-generator',
  'poll-generator-online': 'poll-generator',
  'twitter-poll-generator': 'poll-generator',
  'instagram-poll-generator': 'poll-generator',

  // SASS / SCSS search variants
  'sass': 'sass-to-css',
  'scss': 'sass-to-css',
  'scss-to-css': 'sass-to-css',
  'scss-to-css-converter': 'sass-to-css',
  'scss-converter': 'sass-to-css',
  'scss-compiler': 'sass-to-css',
  'sass-converter': 'sass-to-css',
  'sass-compiler': 'sass-to-css',
  'sass-to-css-converter': 'sass-to-css',
  'convert-scss-to-css': 'sass-to-css',
  'convert-sass-to-css': 'sass-to-css',
  'scss-to-css-online': 'sass-to-css',
  'sass-to-css-online': 'sass-to-css',
  'sass-online': 'sass-to-css',
  'scss-online': 'sass-to-css',
  'sass-to-css-compiler': 'sass-to-css',
  'scss-to-css-compiler': 'sass-to-css',
  'css-to-sass': 'css-to-scss',
  'css-to-sass-converter': 'css-to-scss',
  'css-to-scss-converter': 'css-to-scss',
  'css-to-scss-online': 'css-to-scss',
  'css-to-scss-compiler': 'css-to-scss',
  'css-to-sass-online': 'css-to-scss',
  'sass-to-css-online-tool': 'sass-to-css',

  // Common base64 alias redirects
  'base64': 'base64-encoder-decoder',
  'base64-encoder': 'base64-encoder-decoder',
  'base64-decoder': 'base64-encoder-decoder',
  'base64-encode': 'base64-encoder-decoder',
  'base64-decode': 'base64-encoder-decoder',
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const canonicalSlug = getCanonicalToolSlug(slug);
  if (REDIRECTS[slug] || canonicalSlug !== slug) return { title: 'Redirecting...' };
  const tool = getToolBySlug(canonicalSlug);
  if (!tool) return { title: 'Tool Not Found' };
  const url = `https://toolblip.com/tools/${canonicalSlug}`;

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
  const canonicalSlug = REDIRECTS[slug] ?? getCanonicalToolSlug(slug);
  if (canonicalSlug !== slug) permanentRedirect(`/tools/${canonicalSlug}`);
  const tool = getToolBySlug(canonicalSlug);
  if (!tool) notFound();
  const faqs = getFaqs(tool);
  const content = getToolContent(tool.slug);

  return (
    <div data-testid="tool-detail-shell" className="tb-v2-tool-page">
      <div className="tb-v2-container">
        {/* Breadcrumb */}
        <nav className="tb-v2-breadcrumb">
          <a href="/">Home</a>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <a href="/all-tools">All Tools</a>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <a href={`/tools?category=${encodeURIComponent(tool.category)}`}>{tool.category}</a>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <span>{tool.name}</span>
        </nav>

        {/* Header */}
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

        {/* Above-tool ad slot */}
        <div style={{ marginBottom: 24 }}>
          <ToolAdSlot placement="tool-above" slug={tool.slug} category={tool.category} />
        </div>

        {/* Tool UI, with an optional sidebar ad on desktop */}
        <ToolWithSidebarAd slug={tool.slug} category={tool.category}>
          <ToolWrapper toolSlug={tool.slug} toolName={tool.name}>
            <ToolUI tool={tool} />
          </ToolWrapper>
        </ToolWithSidebarAd>

        <div style={{ marginTop: 32, marginBottom: 40 }}>
          <ToolAdSlot placement="tool-below" slug={tool.slug} category={tool.category} />
        </div>

        <ToolContentSection toolName={tool.name} content={content} />

        <RelatedTools slug={tool.slug} category={tool.category} />
        <RelatedBlogPosts toolName={tool.name} category={tool.category} tags={tool.tags} />

        <FaqSection toolName={tool.name} faqs={faqs} emitSchema={hasFaqOverride(tool.slug)} />
      </div>
    </div>
  );
}
