'use client';

import { useState } from 'react';

interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

interface AnalysisResult {
  totalUrls: number;
  valid: boolean;
  errors: string[];
  urls: SitemapUrl[];
}

export default function SitemapAnalyzerClient() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const parseSitemap = (xml: string): AnalysisResult => {
    const errors: string[] = [];
    const urls: SitemapUrl[] = [];

    try {
      // Check for XML declaration
      if (!xml.includes('<?xml')) {
        errors.push('Missing XML declaration. Should start with <?xml version="1.0" encoding="UTF-8"?>');
      }

      // Check for urlset tag
      if (!xml.includes('<urlset')) {
        errors.push('Missing <urlset> root element');
      }

      // Check for namespace (common issue)
      if (!xml.includes('xmlns=') && xml.includes('<urlset')) {
        errors.push('Consider adding xmlns attribute for better compatibility');
      }

      // Extract URLs using regex (simple parser)
      const urlRegex = /<url>(.*?)<\/url>/gs;
      let match;
      let urlCount = 0;

      while ((match = urlRegex.exec(xml)) !== null) {
        urlCount++;
        const urlContent = match[1];
        
        const locMatch = urlContent.match(/<loc>(.*?)<\/loc>/i);
        if (!locMatch) {
          errors.push(`URL #${urlCount}: Missing <loc> element`);
          continue;
        }

        const loc = locMatch[1].trim();
        
        // Validate URL format
        if (!loc.startsWith('http://') && !loc.startsWith('https://')) {
          errors.push(`URL #${urlCount}: Invalid URL format - ${loc}`);
        }

        const url: SitemapUrl = { loc };

        const lastmodMatch = urlContent.match(/<lastmod>(.*?)<\/lastmod>/i);
        if (lastmodMatch) url.lastmod = lastmodMatch[1].trim();

        const changefreqMatch = urlContent.match(/<changefreq>(.*?)<\/changefreq>/i);
        if (changefreqMatch) url.changefreq = changefreqMatch[1].trim();

        const priorityMatch = urlContent.match(/<priority>(.*?)<\/priority>/i);
        if (priorityMatch) url.priority = priorityMatch[1].trim();

        urls.push(url);
      }

      if (urls.length === 0 && errors.length === 0) {
        errors.push('No URLs found in sitemap');
      }

      // Check for sitemapindex (for sitemaps of sitemaps)
      if (xml.includes('<sitemapindex')) {
        const sitemapRegex = /<sitemap>(.*?)<\/sitemap>/gs;
        let sitemapCount = 0;
        while ((match = sitemapRegex.exec(xml)) !== null) {
          sitemapCount++;
          const sitemapContent = match[1];
          const locMatch = sitemapContent.match(/<loc>(.*?)<\/loc>/i);
          if (locMatch) {
            urls.push({ loc: locMatch[1].trim(), lastmod: 'sitemap' });
          }
        }
        return { totalUrls: sitemapCount, valid: errors.length === 0, errors, urls };
      }

      return { totalUrls: urls.length, valid: errors.length === 0, errors, urls };

    } catch (e) {
      errors.push(`Parse error: ${(e as Error).message}`);
      return { totalUrls: 0, valid: false, errors, urls: [] };
    }
  };

  const analyze = () => {
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      const analysis = parseSitemap(input);
      setResult(analysis);
      setLoading(false);
    }, 300);
  };

  const loadSample = () => {
    setInput(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://example.com/about/</loc>
    <lastmod>2024-01-10</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://example.com/blog/post-1/</loc>
    <lastmod>2024-01-12</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">Paste sitemap XML to analyze</span>
        <button
          type="button"
          onClick={loadSample}
          className="tb-v2-btn-sm"
        >
          Load Sample
        </button>
      </div>

      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="tb-v2-tool-textarea"
        style={{ fontFamily: 'var(--f-mono)' }}
        rows={8}
        placeholder={`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://example.com/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`}
      />

      <button
        type="button"
        onClick={analyze}
        disabled={!input.trim() || loading}
        className="tb-v2-btn-primary"
      >
        {loading ? 'Analyzing...' : 'Analyze Sitemap'}
      </button>

      {result && (
        <div className="flex flex-col gap-4">
          <div className="tb-v2-grid-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-gray-900">{result.totalUrls}</div>
              <div className="text-sm text-gray-500">URLs Found</div>
            </div>
            <div className={`rounded-lg p-3 text-center ${result.valid ? 'bg-green-50' : 'bg-red-50'}`}>
              <div className={`text-2xl font-bold ${result.valid ? 'text-green-600' : 'text-red-600'}`}>
                {result.valid ? 'Valid' : 'Invalid'}
              </div>
              <div className="text-sm text-gray-500">Sitemap</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center">
              <div className={`text-2xl font-bold ${result.errors.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
                {result.errors.length}
              </div>
              <div className="text-sm text-gray-500">Issues</div>
            </div>
          </div>

          {result.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="font-medium text-red-700 mb-2">Issues Found:</div>
              <ul className="text-sm text-red-600 space-y-1">
                {result.errors.map((err, i) => (
                  <li key={i}>• {err}</li>
                ))}
              </ul>
            </div>
          )}

          {result.urls.length > 0 && (
            <div>
              <div className="tb-v2-tool-output-head">
                <span className="tb-v2-tool-label">URLs</span>
              </div>
              <div className="tb-v2-tool-output-body max-h-64 overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr className="border-b">
                      <th className="pb-2 text-gray-500">URL</th>
                      <th className="pb-2 text-gray-500">Last Mod</th>
                      <th className="pb-2 text-gray-500">Change</th>
                      <th className="pb-2 text-gray-500">Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.urls.slice(0, 20).map((url, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 text-blue-600 truncate max-w-xs">{url.loc}</td>
                        <td className="py-2 text-gray-600">{url.lastmod || '-'}</td>
                        <td className="py-2 text-gray-600">{url.changefreq || '-'}</td>
                        <td className="py-2 text-gray-600">{url.priority || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {result.urls.length > 20 && (
                  <p className="text-sm text-gray-500 mt-2">...and {result.urls.length - 20} more URLs</p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
