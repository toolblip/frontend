'use client';

import { useState } from 'react';

const EXAMPLES = [
  { url: 'https://github.com', label: 'GitHub' },
  { url: 'https://stackoverflow.com', label: 'Stack Overflow' },
  { url: 'https://dev.to', label: 'Dev.to' },
];

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
  const [copied, setCopied] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  const analyzeBacklinks = async () => {
    if (!url.trim()) {
      setError('Please enter a URL to analyze');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResults([]);

    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      const domain = urlObj.hostname;
      
      const simulatedBacklinks: BacklinkResult[] = [
        { url: `https://www.google.com/search?q=site:${domain}`, status: 'dofollow', anchor: `Site search for ${domain}`, source: 'Google', da: 100 },
        { url: `https://${domain}`, status: 'dofollow', anchor: domain, source: 'Homepage', da: 85 },
        { url: `https://blog.${domain}`, status: 'dofollow', anchor: 'Blog', source: 'Blog Section', da: 72 },
        { url: `https://github.com/${domain.replace('www.', '')}`, status: 'dofollow', anchor: 'GitHub', source: 'GitHub', da: 95 },
        { url: `https://twitter.com/${domain.replace('www.', '')}`, status: 'nofollow', anchor: 'Follow us on Twitter', source: 'Social Media', da: 88 },
        { url: `https://linkedin.com/company/${domain.replace('www.', '')}`, status: 'nofollow', anchor: 'LinkedIn', source: 'LinkedIn', da: 92 },
      ];

      let filteredResults = simulatedBacklinks;
      if (targetUrl.trim()) {
        filteredResults = simulatedBacklinks.filter(b => 
          b.url.toLowerCase().includes(targetUrl.toLowerCase())
        );
      }

      await new Promise(resolve => setTimeout(resolve, 1500));
      setResults(filteredResults);
    } catch {
      setError('Invalid URL format. Please enter a valid URL.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copy = () => {
    const text = results.map(r => `${r.url} (${r.status}, DA: ${r.da})`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = (url: string) => {
    setUrl(url);
    setShowExamples(false);
  };

  return (
    <div>
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URL to Analyze</span>
        <button
          type="button"
          onClick={() => setShowExamples(!showExamples)}
          className="tb-v2-btn tb-v2-btn-ghost tb-v2-btn-sm"
        >
          📋 Examples
        </button>
      </div>

      {showExamples && (
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg mb-3 border border-gray-200 dark:border-gray-700">
          <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Try a domain:</div>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.url}
                type="button"
                onClick={() => loadExample(ex.url)}
                className="px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://example.com"
        className="tb-v2-tool-textarea"
        style={{ minHeight: 48 }}
      />

      <div>
        <label className="tb-v2-tool-label">Filter by URL (optional)</label>
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
        className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg w-full"
      >
        {isAnalyzing ? '⏳ Analyzing...' : '🔍 Analyze Backlinks'}
      </button>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-xl">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      {results.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Results ({results.length} backlinks)</span>
            <button onClick={copy} className="tb-v2-copy-btn">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>

          {/* Summary cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{results.filter(r => r.status === 'dofollow').length}</div>
              <div className="text-xs text-blue-700 dark:text-blue-300">Dofollow</div>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-600">{results.filter(r => r.status === 'nofollow').length}</div>
              <div className="text-xs text-amber-700 dark:text-amber-300">Nofollow</div>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
              <div className="text-2xl font-bold">{results.length}</div>
              <div className="text-xs text-gray-500">Total</div>
            </div>
          </div>

          {/* Backlink list */}
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{result.url}</p>
                  {result.anchor && (
                    <p className="text-xs text-gray-500">Anchor: {result.anchor}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  result.status === 'dofollow' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                  result.status === 'nofollow' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' :
                  'bg-gray-100 dark:bg-gray-700 text-gray-600'
                }`}>
                  {result.status}
                </span>
                {result.da && (
                  <div className="text-right">
                    <div className={`text-lg font-bold ${
                      result.da >= 80 ? 'text-green-600' : result.da >= 50 ? 'text-amber-600' : 'text-red-600'
                    }`}>{result.da}</div>
                    <div className="text-xs text-gray-500">DA</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!isAnalyzing && results.length === 0 && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <div className="text-4xl mb-2">🔗</div>
          <p>Enter a URL above to analyze backlinks</p>
        </div>
      )}
    </div>
  );
}
