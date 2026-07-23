'use client';

import { useState } from 'react';

export default function RequestIndexingPage() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/request-indexing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to request indexing');
      } else {
        setResult(data.result);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Request Google Indexing
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        Paste a Toolblip URL to check its indexing status and request Google to crawl it.
      </p>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://toolblip.com/tools/json-formatter"
          className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-red-500 focus:outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-xl bg-red-600 px-6 py-3 font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Checking...' : 'Check'}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400">
          {error}
        </div>
      )}

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Indexing Status
          </h2>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Verdict</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {(result as Record<string, string>).verdict || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Coverage</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {(result as Record<string, string>).coverageState || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Last Crawled</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {(result as Record<string, string>).lastCrawlTime || 'Never'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Robots</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {(result as Record<string, string>).robotsTxtState || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500 dark:text-gray-400">Indexing State</dt>
              <dd className="font-medium text-gray-900 dark:text-white">
                {(result as Record<string, string>).indexingState || 'N/A'}
              </dd>
            </div>
          </dl>
          <pre className="mt-4 rounded-lg bg-gray-100 p-3 text-xs text-gray-700 dark:bg-gray-800 dark:text-gray-300 overflow-x-auto">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
