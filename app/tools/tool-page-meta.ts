import type { Metadata } from 'next';
import type { Tool } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getToolContent } from '@/data/tool-content';
import {
  META_DESCRIPTION_MAX,
  META_DESCRIPTION_MIN,
  clampMetaDescription,
  normalizeWhitespace,
  splitSentences,
} from '@/lib/meta-description';
import { getToolAbsoluteUrl } from '@/lib/tool-path';

const CUSTOM_OG_IMAGES: Record<string, string> = {
  'punycode-encoder': '/og-punycode-encoder.png',
};

/**
 * Document titles for high-volume head terms (DataForSEO 2026-10-08).
 * H1 stays `tool.name`; this only changes `<title>` / OG / Twitter.
 */
const SEO_TITLE_OVERRIDES: Record<string, string> = {
  'word-counter': 'Word Counter — Free Words, Characters & Reading Time',
  'password-generator': 'Password Generator — Free Strong Random Passwords',
  'image-resizer': 'Image Resizer — Free Exact Pixel Resize',
  // Wave 1 head terms (DataForSEO 2026-10-08).
  'json-formatter': 'JSON Formatter — Free Beautify & Minify',
  'case-converter': 'Case Converter — Free camelCase, snake_case & More',
  'regex-tester': 'Regex Tester — Free JavaScript Pattern Tester',
  'base64-encoder-decoder': 'Base64 Encode & Decode — Free In-Browser Tool',
  'uuid-generator': 'UUID Generator — Free Random UUID v4',
  'jwt-decoder': 'JWT Decoder — Free Inspect Header & Payload',
  'url-encode': 'URL Encode & Decode — Free Percent Encoding',
  'reading-time-calculator': 'Reading Time Calculator — Free Words-Per-Minute Estimate',
  'markdown-to-html': 'Markdown to HTML — Free Converter With Preview',
  // Wave 2 head terms (DataForSEO 2026-10-09).
  'qr-code-generator': 'QR Code Generator — Free Custom QR Codes',
  'percentage-calculator': 'Percentage Calculator — Free Percent Math',
  'color-picker': 'Color Picker — Free HEX, RGB & HSL',
  'character-counter': 'Character Counter — Free Count Characters Online',
  'unit-converter': 'Unit Converter — Free Length, Weight & More',
  'image-compressor': 'Image Compressor — Free Compress Images Online',
  'lorem-ipsum-generator': 'Lorem Ipsum Generator — Free Placeholder Text',
  'image-cropper': 'Image Cropper — Free Crop Image Online',
  'unix-timestamp-converter': 'Unix Timestamp Converter — Free Epoch Time Tool',
  'code-diff': 'Code Diff — Free Diff Checker for Code',
  'cron-parser': 'Cron Expression Parser — Free Next Run Times',
  'password-strength-checker': 'Password Strength Checker — Free Local Heuristics',
};

function documentTitle(tool: Tool): string {
  const base = SEO_TITLE_OVERRIDES[tool.slug] ?? tool.name;
  return `${base} | Toolblip`;
}

// Factual, template-level padding for short descriptions. Only claims that hold
// for every tool (free, hosted on Toolblip) are used.
const DESCRIPTION_FALLBACK_SUFFIXES: ReadonlyArray<(tool: Tool) => string> = [
  () => 'Free on Toolblip.',
  (tool) => `Free online ${tool.name} on Toolblip.`,
  (tool) => `Also in the free ${tool.category} section of Toolblip.`,
];

/**
 * Meta description for a tool page, kept within 110-155 characters. Short
 * catalog descriptions are extended with sentences from the tool's own content
 * description, then a neutral factual suffix. Long ones are clamped.
 */
export function buildToolDescription(tool: Tool): string {
  const base = normalizeWhitespace(tool.description);
  if (base.length >= META_DESCRIPTION_MIN) return clampMetaDescription(base);

  let text = base;
  const baseKey = base.toLowerCase();
  const extras = splitSentences(getToolContent(tool.slug)?.description ?? '').filter(
    (sentence) => !baseKey.includes(sentence.toLowerCase()) && !sentence.toLowerCase().includes(baseKey),
  );
  for (const sentence of extras) {
    if (text.length >= META_DESCRIPTION_MIN) break;
    const next = `${text} ${sentence}`.trim();
    if (next.length > META_DESCRIPTION_MAX) continue;
    text = next;
  }
  // Greedy: append the first suffix that still fits under the max.
  while (text.length < META_DESCRIPTION_MIN) {
    const fit = DESCRIPTION_FALLBACK_SUFFIXES
      .map((suffix) => `${text} ${suffix(tool)}`)
      .find((next) => next.length <= META_DESCRIPTION_MAX);
    if (!fit) break;
    text = fit;
  }
  return text;
}

export function buildToolMetadata(tool: Tool): Metadata {
  const url = getToolAbsoluteUrl(tool);
  const ogImage = `https://toolblip.com${CUSTOM_OG_IMAGES[tool.slug] ?? '/og-preview.png'}`;
  const indexable = isToolIndexable(tool.slug);
  const description = buildToolDescription(tool);
  const title = documentTitle(tool);

  return {
    title,
    description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Toolblip',
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: ogImage, alt: tool.name }],
    },
  };
}
