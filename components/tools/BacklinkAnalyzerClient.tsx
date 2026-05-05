'use client';

import { useState } from 'react';

interface BacklinkResult {
  url: string;
  status: 'found' | 'not_found' | 'nofollow' | 'dofollow';
  anchor?: string;
  source?: string;
  da?: number;
}

export default function BacklinkAnalyzerClient() {
  const [url, setUrl] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [results, setResults] = useState<BacklinkResult[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzeBacklinks = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults([]);

    try {
      // Simulated backlink analysis based on URL patterns
      // In production, this would call an actual backlink API
      const urlObj = new URL(url);
      const domain = urlObj.hostname;
      
      // Generate simulated backlinks based on the domain
      const simulatedBacklinks: BacklinkResult[] = [
        {
          url: `https://www.google.com/search?q=site:${domain}`,
          status: 'dofollow',
          anchor: `Site search for ${domain}`,
          source: 'Google',
          da: 100,
        },
        {
          url: `https://${domain}`,
          status: 'dofollow',
          anchor: domain,
          source: 'Homepage',
          da: 85,
        },
        {
          url: `https://blog.${domain}`,
          status: 'dofollow',
          anchor: 'Blog',
          source: 'Blog Section',
          da: 72,
        },
        {
          url: `https://docs.${domain}`,
          status: 'dofollow',
          anchor: 'Documentation',
          source: 'Docs',
          da: 68,
        },
        {
          url: `https://github.com/${domain.replace('www.', '')}`,
          status: 'dofollow',
          anchor: 'GitHub',
          source: 'GitHub',
          da: 95,
        },
        {
          url: `https://twitter.com/${domain.replace('www.', '')}`,
          status: 'nofollow',
          anchor: 'Follow us on Twitter',
          source: 'Social Media',
          da: 88,
        },
        {
          url: `https://linkedin.com/company/${domain.replace('www.', '')}`,
          status: 'nofollow',
          anchor: 'LinkedIn',
          source: 'LinkedIn',
          da: 92,
        },
        {
          url: `https://news.${domain}`,
          status: 'dofollow',
          anchor: 'Press Room',
          source: 'News Section',
          da: 55,
        },
      ];

      // Filter based on target URL if provided
      let filteredResults = simulatedBacklinks;
      if (targetUrl.trim()) {
        filteredResults = simulatedBacklinks.filter(b => 
          b.url.toLowerCase().includes(targetUrl.toLowerCase())
        );
      }

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      setResults(filteredResults);

    } catch (err) {
      setError('Invalid URL format. Please enter a valid URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusBadge = (status: BacklinkResult['status']) => {
    const styles = {
      found: 'tb-v2-bg-green-100 tb-v2-text-green-700',
      not_found: 'tb-v2-bg-red-100 tb-v2-text-red-700',
      nofollow: 'tb-v2-bg-yellow-100 tb-v2-text-yellow-700',
      dofollow: 'tb-v2-bg-blue-100 tb-v2-text-blue-700',
    };
    const labels = {
      found: '✓ Found',
      not_found: '✗ Not Found',
      nofollow: 'Nofollow',
      dofollow: 'Dofollow',
    };
    return (
      <span className={`tb-v2-px-2 tb-v2-py-1 tb-v2-rounded-full tb-v2-text-xs tb-v2-font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  const getDaColor = (da: number) => {
    if (da >= 80) return 'tb-v2-text-green-600';
    if (da >= 50) return 'tb-v2-text-yellow-600';
    return 'tb-v2-text-red-600';
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Backlink Analyzer</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Analyze backlink profiles and domain authority estimates</p>

      <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-3">
        <div>
          <label className="tb-v2-label">URL to Analyze</label>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="tb-v2-input"
          />
        </div>
        <div>
          <label className="tb-v2-label">Filter by URL (optional)</label>
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Filter specific backlinks..."
            className="tb-v2-input"
          />
        </div>
        <button
          onClick={analyzeBacklinks}
          disabled={isAnalyzing}
          className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Backlinks'}
        </button>
      </div>

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {results.length > 0 && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          <div className="tb-v2-card tb-v2-bg-gray-50">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold">Summary</h3>
            <div className="tb-v2-grid tb-v2-grid-cols-3 tb-v2-gap-4 tb-v2-mt-2">
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold">
                  {results.filter(r => r.status === 'dofollow').length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Dofollow Links</p>
              </div>
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold">
                  {results.filter(r => r.status === 'nofollow').length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Nofollow Links</p>
              </div>
              <div>
                <p className="tb-v2-text-2xl tb-v2-font-bold">
                  {results.length}
                </p>
                <p className="tb-v2-text-sm tb-v2-text-gray-500">Total Links</p>
              </div>
            </div>
          </div>

          <div className="tb-v2-card">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Backlinks Found</h3>
            <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className="tb-v2-flex tb-v2-items-center tb-v2-gap-3 tb-v2-p-3 tb-v2-bg-gray-50 tb-v2-rounded-lg"
                >
                  <div className="tb-v2-flex-1">
                    <p className="tb-v2-font-medium tb-v2-text-sm">{result.url}</p>
                    {result.anchor && (
                      <p className="tb-v2-text-xs tb-v2-text-gray-500">
                        Anchor: {result.anchor}
                      </p>
                    )}
                    {result.source && (
                      <p className="tb-v2-text-xs tb-v2-text-gray-500">
                        Source: {result.source}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(result.status)}
                  {result.da && (
                    <div className="tb-v2-text-right">
                      <p className={`tb-v2-text-lg tb-v2-font-bold ${getDaColor(result.da)}`}>
                        {result.da}
                      </p>
                      <p className="tb-v2-text-xs tb-v2-text-gray-500">DA</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && results.length === 0 && !error && (
        <div className="tb-v2-card tb-v2-bg-gray-50 tb-v2-text-center">
          <p className="tb-v2-text-gray-500">
            Enter a URL and click "Analyze Backlinks" to see backlink data
          </p>
        </div>
      )}
    </div>
  );
}
