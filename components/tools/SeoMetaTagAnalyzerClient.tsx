'use client';

import { useState, useEffect } from 'react';

interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  canonical: string;
  robots: string;
  author: string;
}

function extractMetaTags(html: string, url: string): MetaTags {
  const getContent = (pattern: RegExp): string => {
    const m = html.match(pattern);
    return m ? m[1].replace(/<[^>]*>/g, '').trim() : '';
  };
  const getProperty = (prop: string) =>
    getContent(new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
    getContent(new RegExp(`name=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
    getContent(new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i')) ||
    getContent(new RegExp(`content=["']([^"']+)["'][^>]*name=["']${prop}["']`, 'i'));

  return {
    title: getContent(/<title[^>]*>([^<]+)<\/title>/i),
    description: getProperty('description'),
    keywords: getProperty('keywords'),
    ogTitle: getProperty('og:title'),
    ogDescription: getProperty('og:description'),
    ogImage: getProperty('og:image'),
    twitterCard: getProperty('twitter:card'),
    twitterTitle: getProperty('twitter:title'),
    twitterDescription: getProperty('twitter:description'),
    canonical: getContent(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i),
    robots: getProperty('robots'),
    author: getProperty('author'),
  };
}

function scoreTags(tags: MetaTags): { score: number; max: number; issues: string[] } {
  let score = 0;
  const max = 100;
  const issues: string[] = [];

  if (tags.title) { score += 20; } else { issues.push('Missing <title> tag'); }
  if (tags.description) { score += 20; } else { issues.push('Missing meta description'); }
  if (tags.ogTitle) { score += 15; } else { issues.push('Missing Open Graph title (og:title)'); }
  if (tags.ogDescription) { score += 15; } else { issues.push('Missing Open Graph description (og:description)'); }
  if (tags.ogImage) { score += 10; } else { issues.push('Missing Open Graph image (og:image)'); }
  if (tags.twitterCard) { score += 10; } else { issues.push('Missing Twitter Card meta'); }
  if (tags.keywords) { score += 5; } else { issues.push('No keywords (optional but recommended)'); }
  if (tags.canonical) { score += 5; } else { issues.push('No canonical URL'); }

  return { score, max, issues };
}

function TagRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3 py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <span className="text-xs font-mono text-indigo-500 font-medium sm:w-40 sm:flex-shrink-0">{label}</span>
      <span className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">{value || <span className="text-gray-400 italic">Not found</span>}</span>
    </div>
  );
}

export default function SeoMetaTagAnalyzerClient() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<MetaTags | null>(null);
  const [scoreResult, setScoreResult] = useState<{ score: number; max: number; issues: string[] } | null>(null);
  const [fetchError, setFetchError] = useState('');
  const [urlError, setUrlError] = useState('');

  const analyze = async () => {
    setUrlError('');
    let targetUrl = url.trim();
    if (!targetUrl) { setUrlError('Please enter a URL'); return; }
    if (!targetUrl.match(/^https?:\/\//)) targetUrl = 'https://' + targetUrl;
    if (!targetUrl.match(/^https?:\/\/.+/)) { setUrlError('Invalid URL format'); return; }

    setLoading(true);
    setFetchError('');
    setTags(null);
    setScoreResult(null);

    try {
      // Use allorigins to fetch the page
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const html = await res.text();
      const extracted = extractMetaTags(html, targetUrl);
      setTags(extracted);
      setScoreResult(scoreTags(extracted));
    } catch (e) {
      setFetchError(`Could not fetch "${targetUrl}". The site may block cross-origin requests or be unreachable.`);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') analyze();
  };

  const scoreColor = scoreResult
    ? scoreResult.score >= 80 ? '#22c55e'
      : scoreResult.score >= 60 ? '#eab308'
      : '#ef4444'
    : '#6b7280';

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-mode-tabs">
        <input
          type="url"
          value={url}
          onChange={e => { setUrl(e.target.value); setUrlError(''); }}
          onKeyDown={handleKey}
          className="flex-1 p-3 border border-gray-300 dark:border-gray-700 rounded-lg dark:bg-gray-800 font-mono text-sm"
          placeholder="https://example.com"
        />
        <button
          onClick={analyze}
          disabled={loading}
          className="px-6 py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 font-medium whitespace-nowrap"
        >
          {loading ? 'Analyzing...' : 'Analyze'}
        </button>
      </div>

      {urlError && <p className="text-sm text-red-500">{urlError}</p>}
      {fetchError && <p className="text-sm text-red-500">{fetchError}</p>}

      {scoreResult && (
        <div className="rounded-xl p-5 border border-gray-200 dark:border-gray-700" style={{ background: `${scoreColor}12` }}>
          <div className="flex items-center gap-4">
            <div className="text-5xl font-bold" style={{ color: scoreColor }}>{scoreResult.score}</div>
            <div>
              <div className="text-sm font-medium text-gray-500">SEO Score</div>
              <div className="text-xs text-gray-400">{scoreResult.score}/{scoreResult.max} points</div>
            </div>
          </div>
          {scoreResult.issues.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs font-medium text-gray-500 mb-2">Issues found:</p>
              <ul className="space-y-1">
                {scoreResult.issues.map((issue, i) => (
                  <li key={i} className="text-sm text-amber-600 dark:text-amber-400">⚠ {issue}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {tags && (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <span className="tb-v2-tool-label">Extracted Meta Tags</span>
          </div>
          <div className="p-4 space-y-0">
            <TagRow label="<title>" value={tags.title} />
            <TagRow label="description" value={tags.description} />
            <TagRow label="keywords" value={tags.keywords} />
            <TagRow label="og:title" value={tags.ogTitle} />
            <TagRow label="og:description" value={tags.ogDescription} />
            <TagRow label="og:image" value={tags.ogImage} />
            <TagRow label="twitter:card" value={tags.twitterCard} />
            <TagRow label="twitter:title" value={tags.twitterTitle} />
            <TagRow label="twitter:description" value={tags.twitterDescription} />
            <TagRow label="canonical" value={tags.canonical} />
            <TagRow label="robots" value={tags.robots} />
            <TagRow label="author" value={tags.author} />
          </div>
        </div>
      )}
    </div>
  );
}
