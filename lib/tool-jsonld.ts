import type { Tool } from '@/data/tools';
import { SITE_ORIGIN } from '@/lib/ai-crawlers';
import { getToolAbsoluteUrl } from '@/lib/tool-path';

export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function buildToolJsonLd(tool: Pick<Tool, 'name' | 'slug' | 'category' | 'description'>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.name,
    description: tool.description,
    url: getToolAbsoluteUrl(tool),
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Toolblip',
      url: `${SITE_ORIGIN}/`,
    },
  };
}

export function buildSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: 'Toolblip',
        url: `${SITE_ORIGIN}/`,
        description:
          'Free browser-based developer tools. Most tools run on the device, with no account required.',
      },
      {
        '@type': 'Organization',
        name: 'Toolblip',
        url: `${SITE_ORIGIN}/`,
        email: 'info@toolblip.com',
      },
    ],
  };
}
