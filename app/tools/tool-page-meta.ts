import type { Metadata } from 'next';
import type { Tool } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
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
};

const META_DESCRIPTION_MAX = 160;

function documentTitle(tool: Tool): string {
  const base = SEO_TITLE_OVERRIDES[tool.slug] ?? tool.name;
  return `${base} | Toolblip`;
}

function metaDescription(description: string): string {
  const text = description.replace(/\s+/g, ' ').trim();
  if (text.length <= META_DESCRIPTION_MAX) return text;
  const firstSentence = text.split(/(?<=[.!?])\s/)[0]?.trim() ?? text;
  if (firstSentence.length >= 25 && firstSentence.length <= META_DESCRIPTION_MAX) return firstSentence;
  const boundary = text.lastIndexOf(' ', META_DESCRIPTION_MAX);
  return (boundary >= 25 ? text.slice(0, boundary) : text.slice(0, META_DESCRIPTION_MAX)).trim();
}

export function buildToolMetadata(tool: Tool): Metadata {
  const url = getToolAbsoluteUrl(tool);
  const ogImage = `https://toolblip.com${CUSTOM_OG_IMAGES[tool.slug] ?? '/og-preview.png'}`;
  const indexable = isToolIndexable(tool.slug);
  const description = metaDescription(tool.description);
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
