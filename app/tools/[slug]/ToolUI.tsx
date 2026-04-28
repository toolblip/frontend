'use client';

import { useState, useCallback } from 'react';
import type { Tool } from '@/data/tools';

// ─── Word Counter ───────────────────────────────────────────────
function WordCounter() {
  const [text, setText] = useState('');
  const stats = {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    charsNoSpaces: text.replace(/\s/g, '').length,
    sentences: text.split(/[.!?]+/).filter(Boolean).length,
    paragraphs: text.split(/\n\n+/).filter(Boolean).length,
    readingTime: Math.max(1, Math.ceil(text.trim().split(/\s+/).length / 200)),
  };

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste or type your text here..."
        className="w-full h-48 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 resize-y font-mono text-sm"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Words', value: stats.words },
          { label: 'Characters', value: stats.chars },
          { label: 'No Spaces', value: stats.charsNoSpaces },
          { label: 'Sentences', value: stats.sentences },
          { label: 'Paragraphs', value: stats.paragraphs },
        ].map(s => (
          <div key={s.label} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">{s.value}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
        Estimated reading time: <strong>{stats.readingTime} min{stats.readingTime !== 1 ? 's' : ''}</strong>
      </p>
    </div>
  );
}

// ─── Character Counter ──────────────────────────────────────────
function CharacterCounter() {
  const [text, setText] = useState('');

  const limits = [
    { name: 'Twitter / X', limit: 280 },
    { name: 'LinkedIn', limit: 3000 },
    { name: 'Meta Description', limit: 160 },
    { name: 'Reddit Post', limit: 40000 },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Type or paste your text here..."
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-y font-mono text-sm"
      />
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total characters</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">{text.length}</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 rounded-full transition-all duration-200"
            style={{ width: `${Math.min(100, (text.length / 3000) * 100)}%` }}
          />
        </div>
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">with spaces</div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {limits.map(l => (
          <div key={l.name} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500 dark:text-gray-400">{l.name}</span>
              <span className={`text-xs font-medium ${text.length > l.limit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {text.length}/{l.limit}
              </span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-200 ${text.length > l.limit ? 'bg-red-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, (text.length / l.limit) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Case Converter ─────────────────────────────────────────────
function CaseConverter() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');

  const convert = useCallback((type: string) => {
    if (!text) { setOutput(''); return; }
    let result = '';
    switch (type) {
      case 'upper': result = text.toUpperCase(); break;
      case 'lower': result = text.toLowerCase(); break;
      case 'title': result = text.replace(/\b\w/g, c => c.toUpperCase()); break;
      case 'camel': result = text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toLowerCase()); break;
      case 'snake': result = text.replace(/[- ]+/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase(); break;
      case 'kebab': result = text.replace(/[-_ ]+/g, '-').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(); break;
      case 'pascal': result = text.replace(/[-_\s]+(.)?/g, (_, c) => c ? c.toUpperCase() : '').replace(/^./, c => c.toUpperCase()); break;
      case 'sentence': result = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase(); break;
      default: result = text;
    }
    setOutput(result);
  }, [text]);

  const copy = () => navigator.clipboard.writeText(output);

  const cases = [
    { key: 'upper', label: 'UPPERCASE' },
    { key: 'lower', label: 'lowercase' },
    { key: 'title', label: 'Title Case' },
    { key: 'camel', label: 'camelCase' },
    { key: 'snake', label: 'snake_case' },
    { key: 'kebab', label: 'kebab-case' },
    { key: 'pascal', label: 'PascalCase' },
    { key: 'sentence', label: 'Sentence case' },
  ];

  return (
    <div className="space-y-4">
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Enter text to convert..."
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-y font-mono text-sm"
      />
      <div className="flex flex-wrap gap-2">
        {cases.map(c => (
          <button
            key={c.key}
            onClick={() => convert(c.key)}
            className="px-3 py-1.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-red-500 dark:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
          >
            {c.label}
          </button>
        ))}
      </div>
      {output && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <button onClick={copy} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Base64 Encode / Decode ─────────────────────────────────────
function Base64Tool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(text))));
      } else {
        setOutput(decodeURIComponent(escape(atob(text))));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-y font-mono text-sm"
      />
      <button
        onClick={process}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        {mode === 'encode' ? 'Encode to Base64' : 'Decode from Base64'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</span>
            <button onClick={copy} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── URL Encode / Decode ─────────────────────────────────────────
function URLEncodeTool() {
  const [text, setText] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState('');

  const process = () => {
    setError('');
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(text));
      } else {
        setOutput(decodeURIComponent(text));
      }
    } catch {
      setError('Invalid input for ' + (mode === 'encode' ? 'encoding' : 'decoding') + '.');
      setOutput('');
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(['encode', 'decode'] as const).map(m => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(''); setError(''); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === m
                ? 'bg-red-600 text-white'
                : 'bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-500'
            }`}
          >
            {m === 'encode' ? 'Encode' : 'Decode'}
          </button>
        ))}
      </div>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder={mode === 'encode' ? 'Enter URL or text to encode...' : 'Enter encoded URL or text to decode...'}
        className="w-full h-32 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-y font-mono text-sm"
      />
      <button
        onClick={process}
        className="px-6 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
      >
        {mode === 'encode' ? 'Encode URL' : 'Decode URL'}
      </button>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Result</span>
            <button onClick={copy} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── JSON Formatter ─────────────────────────────────────────────
function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState(2);

  const format = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, indent));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
      setOutput('');
    }
  };

  const minify = () => {
    setError('');
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
    } catch (e) {
      setError('Invalid JSON: ' + (e as Error).message);
    }
  };

  const copy = () => navigator.clipboard.writeText(output);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500 dark:text-gray-400">Indent:</label>
          <select
            value={indent}
            onChange={e => setIndent(Number(e.target.value))}
            className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded px-2 py-1 text-sm text-gray-700 dark:text-gray-300"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={1}>1 space</option>
          </select>
        </div>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder='{"name": "Toolblip", "tools": 300, "free": true}'
        className="w-full h-40 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl p-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 resize-y font-mono text-sm"
      />
      <div className="flex gap-2">
        <button
          onClick={format}
          className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
        >
          Format / Pretty Print
        </button>
        <button
          onClick={minify}
          className="px-5 py-2.5 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:border-red-500 transition-colors"
        >
          Minify
        </button>
      </div>
      {error && <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>}
      {output && (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">Output</span>
            <button onClick={copy} className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium">
              Copy
            </button>
          </div>
          <pre className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap break-all font-mono overflow-x-auto">{output}</pre>
        </div>
      )}
    </div>
  );
}

// ─── Favicon Checker ─────────────────────────────────────────────
function FaviconChecker() {
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [result, setResult] = useState<{ favicon: string; ogIcon: string; title: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractDomain = (input: string) => {
    try {
      const raw = input.trim();
      const withProto = raw.startsWith('http') ? raw : `https://${raw}`;
      return new URL(withProto).hostname.replace(/^www\./, '');
    } catch {
      return raw.replace(/^https?:\/\//, '').split('/')[0].replace(/^www\./, '');
    }
  };

  const check = async () => {
    if (!url.trim()) return;
    setError('');
    setResult(null);
    setLoading(true);

    const d = extractDomain(url);
    setDomain(d);

    try {
      const resp = await fetch(`https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`, {
        mode: 'no-cors',
      });

      // no-cors means we can't read the response, but the image will load in an <img> tag
      setResult({
        favicon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=128`,
        ogIcon: `https://www.google.com/s2/favicons?domain=${encodeURIComponent(d)}&sz=256`,
        title: d,
      });
    } catch {
      setError('Could not reach Google Favicon API. Check the URL and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') check();
  };

  const googleFaviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`
    : '';

  const directFaviconUrl = domain ? `https://${domain}/favicon.ico` : '';

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={url}
          onChange={e => setUrl(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Enter domain (e.g. github.com, stripe.com)"
          className="flex-1 h-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-red-500 dark:focus:border-red-500 text-sm"
        />
        <button
          onClick={check}
          disabled={loading || !url.trim()}
          className="h-12 px-6 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
        >
          {loading ? (
            <span className="animate-spin">⟳</span>
          ) : (
            'Check Favicon'
          )}
        </button>
      </div>

      {error && (
        <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
      )}

      {result && (
        <div className="space-y-6">
          {/* Live Favicon Display */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium uppercase tracking-wide">
              Favicon for {domain}
            </p>
            <div className="flex items-center justify-center gap-6">
              {/* Small (64px) */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`}
                  alt="Favicon 64px"
                  className="w-16 h-16 object-contain rounded"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs text-gray-400">64px</span>
              </div>
              {/* Large (128px) */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
                  alt="Favicon 128px"
                  className="w-24 h-24 object-contain rounded"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs text-gray-400">128px</span>
              </div>
              {/* Extra Large (256px) */}
              <div className="flex flex-col items-center gap-2">
                <img
                  src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`}
                  alt="Favicon 256px"
                  className="w-32 h-32 object-contain rounded"
                  onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-xs text-gray-400">256px</span>
              </div>
            </div>
          </div>

          {/* Favicon URLs */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide">
              Favicon URLs
            </p>
            {[
              { label: 'Google CDN (256px)', url: googleFaviconUrl },
              { label: 'Direct /favicon.ico', url: directFaviconUrl },
            ].map(({ label, url: u }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 w-36 shrink-0">{label}</span>
                <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 overflow-x-auto">
                  <code className="text-xs text-gray-700 dark:text-gray-300 whitespace-nowrap">{u}</code>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(u)}
                  className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 font-medium shrink-0"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          {/* Open Graph Icon */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wide mb-3">
              Open Graph Icon (OG Image)
            </p>
            <div className="flex items-center gap-4">
              <img
                src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=256`}
                alt="OG Icon"
                className="w-16 h-16 object-contain rounded"
                onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">{domain}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  Used when sharing on social media (Facebook, LinkedIn, Slack)
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-600">
          <div className="text-4xl mb-3">🌐</div>
          <p className="text-sm">Enter a URL above to check its favicon</p>
        </div>
      )}
    </div>
  );
}

// ─── Coming Soon ────────────────────────────────────────────────
function ComingSoon() {
  return (
    <div className="text-center py-16">
      <div className="text-5xl mb-4">🚧</div>
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Coming Soon</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
        This tool is currently being built. Check back soon for a fully functional experience.
      </p>
    </div>
  );
}

// ─── Tool Dispatcher ────────────────────────────────────────────
export default function ToolUI({ tool }: { tool: { slug: string } }) {
  switch (tool.slug) {
    case 'word-counter':
    case 'plain-text-counter':
      return <WordCounter />;
    case 'character-counter':
      return <CharacterCounter />;
    case 'case-converter':
    case 'text-to-slug':
      return <CaseConverter />;
    case 'base64':
    case 'base64-image-converter':
    case 'image-to-base64':
      return <Base64Tool />;
    case 'url-encode':
    case 'url-encoder':
      return <URLEncodeTool />;
    case 'json-formatter':
    case 'json-editor':
      return <JSONFormatter />;
    case 'favicon-checker':
      return <FaviconChecker />;
    default:
      return <ComingSoon />;
  }
}
