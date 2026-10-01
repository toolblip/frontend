export const SITE_ORIGIN = 'https://toolblip.com';

/** Crawlers that collect pages for model training. */
export const TRAINING_AGENTS = [
  'GPTBot',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'Applebot-Extended',
  'CCBot',
  'Amazonbot',
  'Meta-ExternalAgent',
  'cohere-ai',
  'DuckAssistBot',
] as const;

/** Crawlers that fetch a page because a person asked, or that build a search index. */
export const SEARCH_AGENTS = [
  'OAI-SearchBot',
  'ChatGPT-User',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Bingbot',
  'BingPreview',
  'Googlebot',
  'DuckDuckBot',
  'Applebot',
  'Slurp',
] as const;

export const PRIVATE_PATHS = [
  '/admin',
  '/dashboard',
  '/account',
  '/login',
  '/signup',
  '/register',
  '/api/',
  '/submit-tool',
  '/lists',
] as const;

const ABUSIVE_TOKENS = [
  'bytespider',
  'petalbot',
  'mj12bot',
  'dotbot',
  'blexbot',
  'semrushbot',
  'ahrefsbot',
  'dataforseobot',
  'python-requests',
  'scrapy',
  'go-http-client',
  'libwww-perl',
  'okhttp',
  'curl/',
  'wget/',
];

export type CrawlClass = 'ai' | 'search' | 'browser' | 'abusive' | 'unknown';

export const CRAWL_LIMITS: Record<CrawlClass, number> = {
  ai: 180,
  search: 180,
  browser: 600,
  unknown: 60,
  abusive: 20,
};

export const CRAWL_WINDOW_MS = 60_000;

const NAMED_AGENTS = [...TRAINING_AGENTS, ...SEARCH_AGENTS].sort(
  (a, b) => b.length - a.length,
);

export function classifyUserAgent(userAgent: string): CrawlClass {
  const value = userAgent.trim();
  if (!value) return 'abusive';
  const haystack = value.toLowerCase();
  if (ABUSIVE_TOKENS.some((token) => haystack.includes(token))) return 'abusive';
  const named = NAMED_AGENTS.find((agent) => haystack.includes(agent.toLowerCase()));
  if (!named) {
    return /mozilla\/|chrome\/|safari\/|firefox\/|edg\//i.test(value) ? 'browser' : 'unknown';
  }
  return (TRAINING_AGENTS as readonly string[]).includes(named) ? 'ai' : 'search';
}

export type CrawlSlot = { allowed: true } | { allowed: false; retryAfterSec: number };

export function createCrawlBudget(now: () => number = Date.now) {
  const hits = new Map<string, number[]>();

  return {
    take(key: string, crawlClass: CrawlClass, at = now()): CrawlSlot {
      const windowStart = at - CRAWL_WINDOW_MS;
      const recent = (hits.get(key) ?? []).filter((stamp) => stamp > windowStart);
      const limit = CRAWL_LIMITS[crawlClass];
      if (recent.length >= limit) {
        const retryAfterSec = Math.max(1, Math.ceil((recent[0] + CRAWL_WINDOW_MS - at) / 1000));
        hits.set(key, recent);
        return { allowed: false, retryAfterSec };
      }
      recent.push(at);
      hits.set(key, recent);
      if (hits.size > 2000) {
        for (const [bucket, stamps] of hits) {
          if (stamps.every((stamp) => stamp <= windowStart)) hits.delete(bucket);
        }
      }
      return { allowed: true };
    },
  };
}

export const crawlBudget = createCrawlBudget();

function agentGroup(agents: readonly string[]): string {
  const lines = [
    ...agents.map((agent) => `User-agent: ${agent}`),
    'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
    'Allow: /',
    ...PRIVATE_PATHS.map((path) => `Disallow: ${path}`),
  ];
  return lines.join('\n');
}

export function renderRobotsTxt(): string {
  return [
    '# Public pages may be fetched for search, citation, and model training.',
    '# Account, admin, dashboard, and API routes are closed.',
    '# Identified AI and search crawlers get a higher request budget. Other automation is throttled.',
    `# Guide: ${SITE_ORIGIN}/llms.txt`,
    `# Full catalog: ${SITE_ORIGIN}/llms-full.txt`,
    '',
    agentGroup(['*']),
    '',
    agentGroup([...TRAINING_AGENTS, ...SEARCH_AGENTS]),
    '',
    `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
    '',
  ].join('\n');
}
