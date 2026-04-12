import { notFound } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

// Dynamically import client components (no SSR needed for these tools)
const toolComponents: Record<string, React.ComponentType> = {
  'word-counter': dynamic(() => import('@/components/tools/WordCounterClient')),
  'character-counter': dynamic(() => import('@/components/tools/CharacterCounterClient')),
  'json-formatter': dynamic(() => import('@/components/tools/JsonFormatterClient')),
  'base64': dynamic(() => import('@/components/tools/Base64Client')),
  'case-converter': dynamic(() => import('@/components/tools/CaseConverterClient')),
  'url-encode': dynamic(() => import('@/components/tools/UrlEncodeClient')),
  'image-cropper': dynamic(() => import('@/components/tools/ImageCropperClient')),
  'uuid-generator': dynamic(() => import('@/components/tools/UuidGeneratorClient')),
  'remove-duplicate-lines': dynamic(() => import('@/components/tools/RemoveDuplicateLinesClient')),
  'markdown-to-html': dynamic(() => import('@/components/tools/MarkdownToHtmlClient')),
  'yaml-to-json': dynamic(() => import('@/components/tools/YamlToJsonClient')),
  'cron-parser': dynamic(() => import('@/components/tools/CronParserClient')),
  'css-border-radius-generator': dynamic(() => import('@/components/tools/CssBorderRadiusGeneratorClient')),
  'css-gradient-generator': dynamic(() => import('@/components/tools/CssGradientGeneratorClient')),
  'hash-generator': dynamic(() => import('@/components/tools/HashGeneratorClient')),
  'image-format-converter': dynamic(() => import('@/components/tools/ImageFormatConverterClient')),
  'percentage-calculator': dynamic(() => import('@/components/tools/PercentageCalculatorClient')),
  'screen-resolution-tester': dynamic(() => import('@/components/tools/ScreenResolutionTesterClient')),
  'url-slug-generator': dynamic(() => import('@/components/tools/UrlSlugGeneratorClient')),
};

const toolsMeta: Record<string, {
  title: string;
  description: string;
  emoji: string;
  category: string;
}> = {
  'word-counter': {
    title: 'Word Counter',
    description: 'Count words, characters, sentences, paragraphs, and reading time instantly. 100% client-side — nothing leaves your browser.',
    emoji: '📝',
    category: 'Text',
  },
  'character-counter': {
    title: 'Character Counter',
    description: 'Count characters with Twitter, LinkedIn, and meta tag limit indicators.',
    emoji: '🔢',
    category: 'Text',
  },
  'json-formatter': {
    title: 'JSON Formatter',
    description: 'Format, validate, and minify JSON with error highlighting.',
    emoji: '📋',
    category: 'Developer',
  },
  'base64': {
    title: 'Base64 Encode / Decode',
    description: 'Encode and decode Base64 text or files instantly in your browser.',
    emoji: '🔐',
    category: 'Encoder',
  },
  'case-converter': {
    title: 'Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.',
    emoji: '✏️',
    category: 'Text',
  },
  'url-encode': {
    title: 'URL Encode / Decode',
    description: 'Encode and decode URLs or URL components for safe use in links.',
    emoji: '🔗',
    category: 'Encoder',
  },
  'image-cropper': {
    title: 'Image Cropper',
    description: 'Crop images to any ratio or preset size — passport, 16:9, square, and more.',
    emoji: '✂️',
    category: 'Image',
  },
  'uuid-generator': {
    title: 'UUID Generator',
    description: "Generate one or many UUID v4 values using your browser's crypto API.",
    emoji: '🔑',
    category: 'Developer',
  },
  'remove-duplicate-lines': {
    title: 'Remove Duplicate Lines',
    description: 'Paste text, remove duplicate lines in one click. Case-sensitive option included.',
    emoji: '🗑️',
    category: 'Text',
  },
  'markdown-to-html': {
    title: 'Markdown to HTML',
    description: 'Convert Markdown to HTML with a live split-pane preview.',
    emoji: '📄',
    category: 'Developer',
  },
  'yaml-to-json': {
    title: 'YAML to JSON',
    description: 'Convert YAML to JSON instantly with pretty-print, compact output, and custom indent size. 100% client-side — nothing leaves your browser.',
    emoji: '🔄',
    category: 'Conversion',
  },
  'cron-parser': {
    title: 'Cron Expression Parser',
    description: 'Parse and validate cron expressions with human-readable descriptions and next 5 run times.',
    emoji: '⏱️',
    category: 'Developer',
  },
  'css-border-radius-generator': {
    title: 'CSS Border Radius Generator',
    description: 'Visually generate CSS border-radius values with per-corner controls, live preview, and one-click copy.',
    emoji: '⬜',
    category: 'CSS',
  },
  'css-gradient-generator': {
    title: 'CSS Gradient Generator',
    description: 'Create linear, radial, and conic CSS gradients with a live preview, color stops, angle control, and preset library.',
    emoji: '🌈',
    category: 'CSS',
  },
  'hash-generator': {
    title: 'Hash Generator',
    description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using your browser's native crypto API.",
    emoji: '#',
    category: 'Developer',
  },
  'image-format-converter': {
    title: 'Image Format Converter',
    description: 'Convert images between JPEG, PNG, WebP, and AVIF with quality control and side-by-side preview.',
    emoji: '🖼️',
    category: 'Image',
  },
  'percentage-calculator': {
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, tips, and discounts instantly.',
    emoji: '%',
    category: 'Math',
  },
  'screen-resolution-tester': {
    title: 'Screen Resolution Tester',
    description: 'Test any screen resolution or viewport size with device presets, custom dimensions, and a live scaled preview.',
    emoji: '🖥️',
    category: 'Developer',
  },
  'url-slug-generator': {
    title: 'URL Slug Generator',
    description: 'Convert any text into URL-friendly slugs with customizable separator and length limit.',
    emoji: '🔗',
    category: 'Developer',
  },
};

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return Object.keys(toolsMeta).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const meta = toolsMeta[slug];
  if (!meta) return {};
  const canonicalUrl = `https://toolblip.com/tools/${slug}/`;
  return {
    title: `${meta.title} | Toolblip`,
    description: meta.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: meta.title,
      description: meta.description,
      images: [{ url: 'https://toolblip.com/og-default.png' }],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@HarunRRayhan',
    },
  };
}

export default async function ToolPage({ params }: Props) {
  const { slug } = await params;
  const meta = toolsMeta[slug];

  if (!meta) {
    notFound();
  }

  const ToolComponent = toolComponents[slug];

  return (
    <>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">Tools</Link>
          <span>/</span>
          <span className="text-gray-300" aria-current="page">{meta.title}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Tool header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{meta.emoji}</span>
            <h1 className="text-2xl font-bold text-white">{meta.title}</h1>
          </div>
          <p className="text-gray-400">{meta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            {meta.category}
          </span>
        </div>

        {/* Tool UI */}
        <section
          aria-label="Tool"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
        >
          {ToolComponent ? (
            <ToolComponent />
          ) : (
            <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-6 text-center">
              <span className="text-2xl mb-2 block">🚧</span>
              <p className="text-yellow-200 text-sm">
                This tool is being migrated. Interactive version coming soon.
              </p>
            </div>
          )}
        </section>

        {/* Privacy note */}
        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
