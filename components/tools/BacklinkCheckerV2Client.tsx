'use client';

import { useState } from 'react';

interface BacklinkDetail {
  domain: string;
  title?: string;
  da: number;
  pa: number;
  links: number;
  status: 'active' | 'broken' | 'nofollow' | 'redirect';
  type: 'text' | 'image' | 'form';
  anchor?: string;
  firstSeen?: string;
  lastCheck?: string;
}

export default function BacklinkCheckerV2Client() {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    total: number;
    dofollow: number;
    nofollow: number;
    broken: number;
    redirects: number;
    backlinks: BacklinkDetail[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeBacklinks = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults(null);

    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname;

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate simulated backlinks
      const simulatedBacklinks: BacklinkDetail[] = [
        {
          domain: 'google.com',
          title: 'Google Search',
          da: 100,
          pa: 95,
          links: 5,
          status: 'active',
          type: 'text',
          anchor: `Link to ${domain}`,
          firstSeen: '2024-01-15',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'github.com',
          title: 'GitHub',
          da: 95,
          pa: 92,
          links: 2,
          status: 'active',
          type: 'text',
          anchor: 'GitHub Repository',
          firstSeen: '2024-03-20',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'twitter.com',
          title: 'Twitter / X',
          da: 88,
          pa: 85,
          links: 1,
          status: 'nofollow',
          type: 'text',
          anchor: 'Follow us',
          firstSeen: '2024-02-10',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'linkedin.com',
          title: 'LinkedIn',
          da: 92,
          pa: 90,
          links: 1,
          status: 'nofollow',
          type: 'text',
          anchor: 'Connect on LinkedIn',
          firstSeen: '2024-04-05',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'wikipedia.org',
          title: 'Wikipedia',
          da: 98,
          pa: 96,
          links: 3,
          status: 'active',
          type: 'text',
          anchor: domain,
          firstSeen: '2024-01-01',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'reddit.com',
          title: 'Reddit',
          da: 90,
          pa: 87,
          links: 8,
          status: 'nofollow',
          type: 'text',
          anchor: 'Check out this site',
          firstSeen: '2024-05-12',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'old-blog-example.com',
          title: 'Old Blog Post',
          da: 35,
          pa: 28,
          links: 1,
          status: 'broken',
          type: 'text',
          anchor: domain,
          firstSeen: '2023-06-15',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'news-site.com',
          title: 'News Article',
          da: 72,
          pa: 65,
          links: 2,
          status: 'redirect',
          type: 'text',
          anchor: 'Read more',
          firstSeen: '2024-07-22',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'forum.example.com',
          title: 'Community Forum',
          da: 55,
          pa: 48,
          links: 4,
          status: 'active',
          type: 'text',
          anchor: 'Website reference',
          firstSeen: '2024-08-03',
          lastCheck: '2024-12-01',
        },
        {
          domain: 'pinterest.com',
          title: 'Pinterest',
          da: 85,
          pa: 82,
          links: 6,
          status: 'nofollow',
          type: 'image',
          anchor: 'Image Pin',
          firstSeen: '2024-09-18',
          lastCheck: '2024-12-01',
        },
      ];

      const total = simulatedBacklinks.length;
      const dofollow = simulatedBacklinks.filter(b => b.status === 'active').length;
      const nofollow = simulatedBacklinks.filter(b => b.status === 'nofollow').length;
      const broken = simulatedBacklinks.filter(b => b.status === 'broken').length;
      const redirects = simulatedBacklinks.filter(b => b.status === 'redirect').length;

      setResults({
        total,
        dofollow,
        nofollow,
        broken,
        redirects,
        backlinks: simulatedBacklinks,
      });

    } catch (err) {
      setError('Invalid URL format. Please enter a valid URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getStatusIcon = (status: BacklinkDetail['status']) => {
    switch (status) {
      case 'active': return '✅';
      case 'broken': return '❌';
      case 'nofollow': return '🚫';
      case 'redirect': return '↪️';
    }
  };

  const getStatusColor = (status: BacklinkDetail['status']) => {
    switch (status) {
      case 'active': return 'tb-v2-text-green-600';
      case 'broken': return 'tb-v2-text-red-600';
      case 'nofollow': return 'tb-v2-text-yellow-600';
      case 'redirect': return 'tb-v2-text-blue-600';
    }
  };

  const getDaColor = (da: number) => {
    if (da >= 80) return 'tb-v2-text-green-600';
    if (da >= 50) return 'tb-v2-text-yellow-600';
    return 'tb-v2-text-red-600';
  };

  return (
    <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4 tb-v2-p-4">
      <h2 className="tb-v2-text-2xl tb-v2-font-bold">Backlink Checker V2</h2>
      <p className="tb-v2-text-sm tb-v2-text-gray-500">Advanced backlink analysis with domain authority estimates</p>

      <div className="tb-v2-card">
        <label className="tb-v2-label">URL to Analyze</label>
        <div className="tb-v2-flex tb-v2-gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="tb-v2-input tb-v2-flex-1"
          />
          <button
            onClick={analyzeBacklinks}
            disabled={isAnalyzing}
            className="tb-v2-btn tb-v2-btn-primary tb-v2-disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {error && (
        <div className="tb-v2-p-4 tb-v2-bg-red-100 tb-v2-text-red-700 tb-v2-rounded-lg">
          {error}
        </div>
      )}

      {results && (
        <div className="tb-v2-flex tb-v2-flex-col tb-v2-gap-4">
          {/* Summary Stats */}
          <div className="tb-v2-grid tb-v2-grid-cols-5 tb-v2-gap-3">
            <div className="tb-v2-card tb-v2-text-center">
              <p className="tb-v2-text-3xl tb-v2-font-bold">{results.total}</p>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Total</p>
            </div>
            <div className="tb-v2-card tb-v2-text-center tb-v2-bg-green-50">
              <p className={`tb-v2-text-3xl tb-v2-font-bold tb-v2-text-green-600`}>{results.dofollow}</p>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Dofollow</p>
            </div>
            <div className="tb-v2-card tb-v2-text-center tb-v2-bg-yellow-50">
              <p className="tb-v2-text-3xl tb-v2-font-bold tb-v2-text-yellow-600">{results.nofollow}</p>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Nofollow</p>
            </div>
            <div className="tb-v2-card tb-v2-text-center tb-v2-bg-red-50">
              <p className="tb-v2-text-3xl tb-v2-font-bold tb-v2-text-red-600">{results.broken}</p>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Broken</p>
            </div>
            <div className="tb-v2-card tb-v2-text-center tb-v2-bg-blue-50">
              <p className="tb-v2-text-3xl tb-v2-font-bold tb-v2-text-blue-600">{results.redirects}</p>
              <p className="tb-v2-text-sm tb-v2-text-gray-500">Redirects</p>
            </div>
          </div>

          {/* Backlinks Table */}
          <div className="tb-v2-card">
            <h3 className="tb-v2-text-lg tb-v2-font-semibold tb-v2-mb-3">Backlink Details</h3>
            <div className="tb-v2-overflow-x-auto">
              <table className="tb-v2-w-full">
                <thead>
                  <tr className="tb-v2-border-b tb-v2-border-gray-200">
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">Status</th>
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">Domain</th>
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">DA</th>
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">PA</th>
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">Links</th>
                    <th className="tb-v2-text-left tb-v2-p-2 tb-v2-text-sm tb-v2-font-medium tb-v2-text-gray-500">Anchor</th>
                  </tr>
                </thead>
                <tbody>
                  {results.backlinks.map((backlink, index) => (
                    <tr key={index} className="tb-v2-border-b tb-v2-border-gray-100 hover:tb-v2-bg-gray-50">
                      <td className="tb-v2-p-2">
                        <span className="tb-v2-text-lg">{getStatusIcon(backlink.status)}</span>
                      </td>
                      <td className="tb-v2-p-2">
                        <p className="tb-v2-font-medium">{backlink.domain}</p>
                        {backlink.title && (
                          <p className="tb-v2-text-xs tb-v2-text-gray-500">{backlink.title}</p>
                        )}
                      </td>
                      <td className={`tb-v2-p-2 tb-v2-font-bold ${getDaColor(backlink.da)}`}>
                        {backlink.da}
                      </td>
                      <td className={`tb-v2-p-2 tb-v2-font-bold ${getDaColor(backlink.pa)}`}>
                        {backlink.pa}
                      </td>
                      <td className="tb-v2-p-2">{backlink.links}</td>
                      <td className="tb-v2-p-2">
                        <span className="tb-v2-text-sm tb-v2-text-gray-600">
                          {backlink.anchor || '-'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {!isAnalyzing && !results && !error && (
        <div className="tb-v2-card tb-v2-bg-gray-50 tb-v2-text-center">
          <p className="tb-v2-text-gray-500">
            Enter a URL and click "Analyze" to see backlink data
          </p>
        </div>
      )}
    </div>
  );
}
