import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://toolblip.com';

  // Static pages
  const staticPages = [
    { url: baseUrl, priority: 1.0 },
    { url: `${baseUrl}/tools`, priority: 0.9 },
    { url: `${baseUrl}/directory`, priority: 0.8 },
    { url: `${baseUrl}/blog`, priority: 0.7 },
    { url: `${baseUrl}/about`, priority: 0.6 },
    { url: `${baseUrl}/login`, priority: 0.5 },
    { url: `${baseUrl}/signup`, priority: 0.5 },
    { url: `${baseUrl}/privacy`, priority: 0.4 },
    { url: `${baseUrl}/terms`, priority: 0.4 },
    { url: `${baseUrl}/donate`, priority: 0.4 },
    { url: `${baseUrl}/advertise`, priority: 0.4 },
  ];

  // Tool pages
  const tools = [
    'word-counter', 'character-counter', 'json-formatter', 'base64', 'case-converter',
    'url-encode', 'image-cropper', 'uuid-generator', 'remove-duplicate-lines',
    'markdown-to-html', 'cron-parser', 'css-gradient-generator', 'css-border-radius-generator',
    'hash-generator', 'percentage-calculator', 'screen-resolution-tester',
    'url-slug-generator', 'yaml-to-json', 'image-format-converter',
  ];

  const toolPages = tools.map((slug) => ({
    url: `${baseUrl}/tools/${slug}`,
    priority: 0.8,
  }));

  return [...staticPages, ...toolPages];
}
