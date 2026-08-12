'use client';

import { useState } from 'react';

interface HistoryEntry {
  endpoint: string;
  query: string;
  variables: string;
}

const DEFAULT_QUERY = `query {
  __typename
}`;

export default function GraphqlPlaygroundClient() {
  const [endpoint, setEndpoint] = useState('');
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [variables, setVariables] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const runQuery = async () => {
    setError('');
    setResponse('');

    if (!endpoint.trim()) {
      setError('Enter a GraphQL endpoint URL first.');
      return;
    }

    if (!query.trim()) {
      setError('Enter a query to run.');
      return;
    }

    let parsedVariables: unknown = undefined;
    if (variables.trim()) {
      try {
        parsedVariables = JSON.parse(variables);
      } catch (e) {
        setError('Variables is not valid JSON: ' + (e as Error).message);
        return;
      }
    }

    setLoading(true);

    try {
      const res = await fetch(endpoint.trim(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables: parsedVariables }),
      });

      const text = await res.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(text);
      } catch {
        // Server didn't return JSON — show the raw text plus the HTTP status
        // instead of pretending we got a valid GraphQL response.
        setError(
          `Server responded with HTTP ${res.status} ${res.statusText}, but the body wasn't valid JSON:\n\n${text.slice(0, 2000)}`
        );
        setLoading(false);
        return;
      }

      if (!res.ok) {
        // Many GraphQL servers still return JSON on errors (e.g. 400 with
        // an "errors" array), so show both the status and the body.
        setResponse(JSON.stringify(parsed, null, 2));
        setError(`Request completed with HTTP ${res.status} ${res.statusText}.`);
      } else {
        setResponse(JSON.stringify(parsed, null, 2));
      }

      const entry: HistoryEntry = { endpoint: endpoint.trim(), query, variables };
      setHistory((prev) => [entry, ...prev.filter((h) => !(h.endpoint === entry.endpoint && h.query === entry.query))].slice(0, 10));
    } catch (e) {
      // A thrown fetch error here almost always means a network failure or
      // the endpoint blocking cross-origin browser requests (CORS). Say so
      // plainly rather than fabricating a response.
      setError(
        `Request failed: ${(e as Error).message}. This is often caused by the endpoint not allowing cross-origin (CORS) requests from the browser, or the endpoint being unreachable.`
      );
    }

    setLoading(false);
  };

  const copyResponse = () => {
    if (!response) return;
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadHistoryEntry = (entry: HistoryEntry) => {
    setEndpoint(entry.endpoint);
    setQuery(entry.query);
    setVariables(entry.variables);
    setResponse('');
    setError('');
  };

  return (
    <div className="tb-v2-tool-card flex flex-col gap-4">
      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Endpoint URL</span>
        </div>
        <input
          type="text"
          value={endpoint}
          onChange={(e) => setEndpoint(e.target.value)}
          placeholder="https://api.example.com/graphql"
          className="tb-v2-input font-mono"
        />
      </div>

      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Query</span>
        </div>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="tb-v2-input font-mono"
          rows={10}
          spellCheck={false}
          placeholder="query { ... }"
        />
      </div>

      <div>
        <div className="tb-v2-tool-input-head">
          <span className="tb-v2-tool-label">Variables (JSON, optional)</span>
        </div>
        <textarea
          value={variables}
          onChange={(e) => setVariables(e.target.value)}
          className="tb-v2-input font-mono"
          rows={4}
          spellCheck={false}
          placeholder='{ "id": "123" }'
        />
      </div>

      <button
        type="button"
        onClick={runQuery}
        disabled={loading}
        className="tb-v2-btn-primary self-start"
      >
        {loading ? 'Running...' : 'Run Query'}
      </button>

      {error && (
        <div
          className="rounded-lg p-4 text-sm text-red-700 bg-red-50 whitespace-pre-wrap font-mono"
          style={{ wordBreak: 'break-word' }}
        >
          {error}
        </div>
      )}

      {response && (
        <div>
          <div className="tb-v2-tool-output-head flex justify-between items-center">
            <span className="tb-v2-tool-label">Response</span>
            <button type="button" onClick={copyResponse} className="tb-v2-btn-sm">
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="font-mono text-sm whitespace-pre-wrap break-all">{response}</pre>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">History</span>
          </div>
          <div className="flex flex-col gap-2">
            {history.map((h, i) => (
              <button
                key={i}
                type="button"
                onClick={() => loadHistoryEntry(h)}
                className="w-full text-left p-2 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="text-sm text-gray-600 truncate">{h.endpoint}</div>
                <div className="text-xs text-gray-400 truncate font-mono">
                  {h.query.replace(/\s+/g, ' ').trim().slice(0, 80)}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
