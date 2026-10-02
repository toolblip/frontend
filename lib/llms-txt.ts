import { tools } from '@/data/tools';
import { SEARCH_AGENTS, SITE_ORIGIN, TRAINING_AGENTS } from '@/lib/ai-crawlers';
import { isToolIndexable } from '@/lib/indexable-tools';
import { getCategoryPath, getToolAbsoluteUrl } from '@/lib/tool-path';

const CATEGORY_NOTES: Record<string, string> = {
  Developer: 'Format, generate, and inspect code and data',
  Text: 'Count, convert, and clean text',
  Conversion: 'Convert between data formats and units',
  Image: 'Resize, compress, and convert images in the browser',
  SEO: 'Preview snippets and check crawl files',
  Color: 'Build and convert colors',
  Utility: 'Everyday generators and checkers',
  'PDF Tools': 'Merge, split, and edit PDFs in the browser',
  CSS: 'Convert and inspect CSS',
  Math: 'Calculators and number conversions',
  Network: 'Look up DNS, HTTP status, and related network facts',
  'Document Generator': 'Generate documents from structured input',
  Encoder: 'Encode and decode common formats',
  'Video Tools': 'Convert and inspect video and audio',
};

const POPULAR_SLUGS = [
  'json-formatter',
  'password-generator',
  'regex-tester',
  'qr-code-generator',
  'html-minifier',
  'color-palette-generator',
  'image-resizer',
  'image-compressor',
];

const CORE_PAGES = [
  ['Home', '/'],
  ['All tools', '/directory'],
  ['Tool index', '/tools'],
  ['Pricing', '/pricing'],
  ['Blog', '/blog'],
  ['About', '/about'],
  ['API docs', '/api-docs'],
  ['Status', '/frontend-health'],
];

function oneLine(value: string): string {
  return value.replace(/\s+/g, ' ').replace(/[\[\]]/g, '').trim();
}

export function publicTools() {
  return tools
    .filter((tool) => isToolIndexable(tool.slug))
    .slice()
    .sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

function toolLine(tool: { name: string; description: string; slug: string; category: string }): string {
  return `- [${oneLine(tool.name)}](${getToolAbsoluteUrl(tool)}): ${oneLine(tool.description)}`;
}

export function buildLlmsTxt(): string {
  const catalog = publicTools();
  const bySlug = new Map(catalog.map((tool) => [tool.slug, tool]));
  const categories = [...new Set(catalog.map((tool) => tool.category))].sort((a, b) => a.localeCompare(b));
  const popular = POPULAR_SLUGS.map((slug) => bySlug.get(slug)).filter((tool) => tool !== undefined);

  return [
    '# Toolblip',
    `> Free online developer tools. ${catalog.length} public tools are open for search, citation, and model training. Most tools run in the browser, so pasted text and files stay on the device. Network lookup tools send only the query they need.`,
    '',
    `Identified crawlers may read public pages: ${[...TRAINING_AGENTS, ...SEARCH_AGENTS].join(', ')}.`,
    'Account, admin, dashboard, and /api routes are closed. Bulk scrapers are rate limited.',
    '',
    '## Core pages',
    ...CORE_PAGES.map(([label, path]) => `- [${label}](${SITE_ORIGIN}${path})`),
    '',
    '## Categories',
    ...categories.map((category) => {
      const note = CATEGORY_NOTES[category] ?? `Tools in ${category}`;
      return `- [${category}](${SITE_ORIGIN}${getCategoryPath(category)}): ${note}`;
    }),
    '',
    '## Popular tools',
    ...popular.map((tool) => toolLine(tool)),
    '',
    '## Catalog files',
    `- [Full tool list](${SITE_ORIGIN}/llms-full.txt)`,
    `- [Sitemap](${SITE_ORIGIN}/sitemap.xml)`,
    '',
    '## Pricing',
    'Free, Starter ($4.99/mo), Pro ($19.99/mo), and Max ($49.99/mo). Ordinary tools work without an account.',
    '',
    '## Contact',
    'info@toolblip.com',
    '',
  ].join('\n');
}

export function buildLlmsFullTxt(): string {
  const catalog = publicTools();
  return [
    '# Toolblip tool catalog',
    '',
    `${catalog.length} public tools. One tool per line.`,
    '',
    ...catalog.map((tool) => toolLine(tool)),
    '',
  ].join('\n');
}
