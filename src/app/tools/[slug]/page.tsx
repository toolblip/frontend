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
  howToUse?: string[];
  faqs?: { question: string; answer: string }[];
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
    howToUse: [
      'Paste or type your JSON into the input area.',
      'The formatter instantly validates whether your JSON is syntactically correct.',
      'If valid, the output shows properly indented JSON with syntax highlighting.',
      'Use the minify button to compress the JSON to a single line.',
      'Use the copy button to copy the result to your clipboard.',
    ],
    faqs: [
      {
        question: 'Does this send my JSON to a server?',
        answer: 'No. All processing happens entirely in your browser using JavaScript. Nothing is transmitted, stored, or logged.',
      },
      {
        question: 'What happens if my JSON has errors?',
        answer: 'The formatter highlights the line and character position of the error, making it easy to spot and fix typos.',
      },
      {
        question: 'Can I format already-minified JSON?',
        answer: 'Yes. Paste any minified or compact JSON and it will be formatted with proper indentation immediately.',
      },
    ],
  },
  'base64': {
    title: 'Base64 Encode / Decode',
    description: 'Encode and decode Base64 text or files instantly in your browser.',
    emoji: '🔐',
    category: 'Encoder',
    howToUse: [
      'Paste or type your text into the input area.',
      'Click Encode to convert to Base64, or Decode to convert from Base64.',
      'Copy the result with one click.',
    ],
    faqs: [
      {
        question: 'Is Base64 encryption?',
        answer: 'No. Base64 is an encoding scheme, not encryption. It is reversible by design and should never be used to hide sensitive data. Anyone can decode a Base64 string.',
      },
      {
        question: 'Why does my encoded string end with = or ==?',
        answer: 'Base64 uses a 64-character alphabet. Since it works on 3-byte chunks, strings whose length is not divisible by 3 are padded with = characters. This is normal and the decoder handles it automatically.',
      },
      {
        question: 'Can I encode binary files?',
        answer: 'Yes. This tool supports file upload and will Base64-encode the file contents, which you can then use in JSON, XML, or email attachments.',
      },
    ],
  },
  'case-converter': {
    title: 'Case Converter',
    description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.',
    emoji: '✏️',
    category: 'Text',
    faqs: [
      {
        question: 'What case formats are supported?',
        answer: 'UPPERCASE, lowercase, Title Case, Sentence case, camelCase, PascalCase, snake_case, SCREAMING_SNAKE_CASE, kebab-case, and SCREAMING-KEBAB-CASE.',
      },
      {
        question: 'Does this modify my original text?',
        answer: 'No. The conversion is displayed as output — your original text remains unchanged until you copy the converted result.',
      },
    ],
  },
  'url-encode': {
    title: 'URL Encode / Decode',
    description: 'Encode and decode URLs or URL components for safe use in links.',
    emoji: '🔗',
    category: 'Encoder',
    faqs: [
      {
        question: 'When should I URL-encode a string?',
        answer: 'URL-encode strings before embedding them in a query parameter. Spaces become %20, ampersands become %26, and special characters are percent-encoded so they do not break URL parsing.',
      },
      {
        question: 'What is the difference between encoding the full URL and just a component?',
        answer: 'Encoding a full URL would double-encode characters that already have meaning in URLs (like :// and /). Encode individual query values, not the entire URL.',
      },
    ],
  },
  'image-cropper': {
    title: 'Image Cropper',
    description: 'Crop images to any ratio or preset size — passport, 16:9, square, and more.',
    emoji: '✂️',
    category: 'Image',
    faqs: [
      {
        question: 'What image formats are supported?',
        answer: 'JPEG, PNG, WebP, GIF, and SVG input. The output downloads as PNG by default.',
      },
      {
        question: 'Are images uploaded to a server?',
        answer: 'No. All processing happens in your browser using the Canvas API. Your images never leave your device.',
      },
    ],
  },
  'uuid-generator': {
    title: 'UUID Generator',
    description: "Generate one or many UUID v4 values using your browser's crypto API.",
    emoji: '🔑',
    category: 'Developer',
    faqs: [
      {
        question: 'What UUID version does this generate?',
        answer: 'UUID v4 by default (random). You can also generate UUID v7 (time-sortable) which is better for database primary keys.',
      },
      {
        question: 'Are these UUIDs truly random?',
        answer: 'Yes. UUIDs are generated using the Web Crypto API, which provides cryptographically secure random numbers.',
      },
    ],
  },
  'remove-duplicate-lines': {
    title: 'Remove Duplicate Lines',
    description: 'Paste text, remove duplicate lines in one click. Case-sensitive option included.',
    emoji: '🗑️',
    category: 'Text',
    faqs: [
      {
        question: 'Does this preserve the original order of lines?',
        answer: 'Yes. The first occurrence of each unique line is kept in its original position.',
      },
      {
        question: 'Is the comparison case-sensitive?',
        answer: "By default yes. A case-insensitive option is available if you need to treat 'Hello' and 'hello' as duplicates.",
      },
    ],
  },
  'markdown-to-html': {
    title: 'Markdown to HTML',
    description: 'Convert Markdown to HTML with a live split-pane preview.',
    emoji: '📄',
    category: 'Developer',
    faqs: [
      {
        question: 'Is my Markdown sent to a server?',
        answer: 'No. All conversion uses a JavaScript Markdown parser running entirely in your browser.',
      },
      {
        question: 'What Markdown flavor is supported?',
        answer: 'Standard CommonMark Markdown including tables, task lists, footnotes, and GFM (GitHub Flavored Markdown) extensions.',
      },
    ],
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
    howToUse: [
      'Paste or type your text into the input area.',
      'Select the hash algorithm you need: MD5, SHA-1, SHA-256, or SHA-512.',
      'The hash is computed instantly as you type.',
      'Copy the result with one click.',
    ],
    faqs: [
      {
        question: 'Is this safe to use for passwords?',
        answer: 'This tool generates plain hashes, not salted hashes. For password storage, use bcrypt, Argon2, or scrypt with a per-user salt. Plain SHA-256 is not suitable for password storage.',
      },
      {
        question: 'Is my text sent to any server?',
        answer: 'No. All hashing is done locally in your browser using the Web Crypto API. Nothing is transmitted over the network.',
      },
      {
        question: 'Which algorithm should I use?',
        answer: 'SHA-256 is the current standard for most use cases. MD5 and SHA-1 are cryptographically broken and should only be used for non-security purposes like quick file checksums.',
      },
    ],
  },
  'image-format-converter': {
    title: 'Image Format Converter',
    description: 'Convert images between JPEG, PNG, WebP, and AVIF with quality control and side-by-side preview.',
    emoji: '🖼️',
    category: 'Image',
    faqs: [
      {
        question: 'Does converting to JPEG reduce image quality?',
        answer: 'JPEG is a lossy format. High quality (80–90%) is usually indistinguishable from the original. PNG to JPEG conversion will always lose some quality.',
      },
      {
        question: 'Which format should I use?',
        answer: 'Use PNG for graphics and transparency. Use JPEG for photographs. Use WebP or AVIF for the best compression-to-quality ratio in web contexts.',
      },
    ],
  },
  'percentage-calculator': {
    title: 'Percentage Calculator',
    description: 'Calculate percentages, percentage change, tips, and discounts instantly.',
    emoji: '%',
    category: 'Math',
    faqs: [
      {
        question: 'How do I calculate percentage change?',
        answer: 'Enter the original value and the new value. The formula is ((new - original) / original) × 100.',
      },
      {
        question: 'Can I calculate a reverse percentage?',
        answer: 'Yes. Given a result and a percentage, the calculator can find the original number. For example, 25 is 20% of what number? → 125.',
      },
    ],
  },
  'screen-resolution-tester': {
    title: 'Screen Resolution Tester',
    description: 'Test any screen resolution or viewport size with device presets, custom dimensions, and a live scaled preview.',
    emoji: '🖥️',
    category: 'Developer',
    faqs: [
      {
        question: 'Does this actually change my screen resolution?',
        answer: 'No. It displays a visual grid and dimension information at actual pixels — it does not modify your operating system display settings.',
      },
      {
        question: 'What device presets are available?',
        answer: 'Common presets include iPhone SE, iPhone 14, Pixel 7, Samsung Galaxy S23, iPad, and various laptop/desktop resolutions.',
      },
    ],
  },
  'url-slug-generator': {
    title: 'URL Slug Generator',
    description: 'Convert any text into URL-friendly slugs with customizable separator and length limit.',
    emoji: '🔗',
    category: 'Developer',
    faqs: [
      {
        question: 'What characters are allowed in a URL slug?',
        answer: 'Lowercase letters (a–z), numbers (0–9), and hyphens. All other characters are either replaced with the separator or stripped.',
      },
      {
        question: 'Can I change the separator from hyphen to underscore?',
        answer: 'Yes. You can set any separator character or string, including underscore, space, or nothing.',
      },
    ],
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
          <Link href="/" className="hover:text-gray-400 transition-colors">Home</Link>
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
          <span className="inline-block mt-2 text-xs text-gray-300 bg-gray-700 px-2 py-0.5 rounded">
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

        {/* How to Use */}
        {meta.howToUse && meta.howToUse.length > 0 && (
          <section aria-labelledby="how-to-heading" className="mt-10 pt-8 border-t border-gray-800">
            <h2 id="how-to-heading" className="text-lg font-semibold text-white mb-4">How to Use</h2>
            <ol className="space-y-2">
              {meta.howToUse.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm text-gray-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-900/50 border border-green-700 flex items-center justify-center text-green-400 text-xs font-medium">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* FAQ */}
        {meta.faqs && meta.faqs.length > 0 && (
          <section aria-labelledby="faq-heading" className="mt-10 pt-8 border-t border-gray-800">
            <h2 id="faq-heading" className="text-lg font-semibold text-white mb-4">FAQ</h2>
            <dl className="space-y-4">
              {meta.faqs.map((faq, i) => (
                <div key={i}>
                  <dt className="text-sm font-medium text-white mb-1">{faq.question}</dt>
                  <dd className="text-sm text-gray-400 leading-relaxed">{faq.answer}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* FAQ JSON-LD */}
        {meta.faqs && meta.faqs.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: meta.faqs.map((faq) => ({
                  '@type': 'Question',
                  name: faq.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer,
                  },
                })),
              }),
            }}
          />
        )}
      </div>
    </>
  );
}
