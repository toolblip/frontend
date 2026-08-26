import type { Metadata } from 'next';
import type { Tool } from '@/data/tools';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getToolAbsoluteUrl } from '@/lib/tool-path';

const CUSTOM_OG_IMAGES: Record<string, string> = {
  'punycode-encoder': '/og-punycode-encoder.png',
};

export function buildToolMetadata(tool: Tool): Metadata {
  const url = getToolAbsoluteUrl(tool);
  const ogImage = `https://toolblip.com${CUSTOM_OG_IMAGES[tool.slug] ?? '/og-preview.png'}`;
  const indexable = isToolIndexable(tool.slug);

  return {
    title: `${tool.name} | Toolblip`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    robots: indexable
      ? { index: true, follow: true }
      : { index: false, follow: true },
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url,
      siteName: 'Toolblip',
      images: [{ url: ogImage, width: 1200, height: 630, alt: tool.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      images: [{ url: ogImage, alt: tool.name }],
    },
  };
}
