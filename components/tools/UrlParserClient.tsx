'use client';

import { useState } from 'react';

interface ParsedUrl {
  href: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  host: string;
  origin: string;
  username: string;
  password: string;
  searchParams: Record<string, string>;
}

export default function UrlParserClient() {
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [error, setError] = useState('');

  const parseUrl = () => {
    setError('');
    setParsed(null);
    
    if (!input.trim()) {
      setError('Please enter a URL to parse');
      return;
    }

    try {
      const url = new URL(input);
      
      const searchParams: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        searchParams[key] = value;
      });

      setParsed({
        href: url.href,
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        host: url.host,
        origin: url.origin,
        username: url.username,
        password: url.password ? '********' : '',
        searchParams,
      });
    } catch (e) {
      setError('Invalid URL. Please include the protocol (e.g., https://)');
    }
  };

  const renderField = (label: string, value: string | Record<string, string>) => {
    if (typeof value === 'object') {
      return (
        <div className="mb-3">
          <span className="text-sm text-gray-600">{label}:</span>
          <div className="mt-1 ml-3 p-2 bg-gray-50 rounded font-mono text-sm">
            {Object.keys(value).length === 0 ? (
              <span className="text-gray-400">(none)</span>
            ) : (
              Object.entries(value).map(([k, v]) => (
                <div key={k} className="flex">
                  <span className="text-blue-600">{k}:</span>
                  <span className="ml-2">{v}</span>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mb-3">
        <span className="text-sm text-gray-600">{label}: </span>
        <span className="text-sm font-mono text-gray-800 break-all">{value || '(empty)'}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4">
        <label className="tb-v2-tool-label" style={{marginBottom:8}}>
          URL Input
        </label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://example.com:8080/path?query=value#section"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
        />
      </div>

      <button
        onClick={parseUrl}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Parse URL
      </button>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
          {error}
        </div>
      )}

      {parsed && (
        <div className="flex-1 overflow-auto">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Parsed Components</h3>
          
          {renderField('Full URL (href)', parsed.href)}
          {renderField('Origin', parsed.origin)}
          {renderField('Protocol', parsed.protocol)}
          {renderField('Host', parsed.host)}
          {renderField('Hostname', parsed.hostname)}
          {renderField('Port', parsed.port || '(default)')}
          {renderField('Pathname', parsed.pathname)}
          {renderField('Search Query', parsed.search)}
          {renderField('Hash/Fragment', parsed.hash)}
          {renderField('Username', parsed.username || '(none)')}
          {renderField('Password', parsed.password || '(none)')}
          {renderField('Query Parameters', parsed.searchParams)}

          {input && (
            <button
              onClick={() => navigator.clipboard.writeText(input)}
              className="mt-3 px-3 py-1.5 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Copy URL
            </button>
          )}
        </div>
      )}
    </div>
  );
}
