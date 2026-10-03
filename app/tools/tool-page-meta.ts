import type { Metadata } from 'next';
import type { Tool } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getToolAbsoluteUrl } from '@/lib/tool-path';

const CUSTOM_OG_IMAGES: Record<string, string> = {
  'punycode-encoder': '/og-punycode-encoder.png',
};

const META_DESCRIPTION_MAX = 160;

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

  return {
    title: `${tool.name} | Toolblip`,
    description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description,
      url,
      siteName: 'Toolblip',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Toolblip`,
      description,
      images: [{ url: ogImage, alt: tool.name }],
    },
  };
}
