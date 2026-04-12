'use client';

import { useState, useMemo } from 'react';

type Separator = '-' | '_' | '.';

interface Options {
  lowercase: boolean;
  trim: boolean;
  separator: Separator;
  limit: number;
}

export default function UrlSlugGeneratorClient() {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<Options>({
    lowercase: true,
    trim: true,
    separator: '-',
    limit: 0,
  });
  const [copied, setCopied] = useState(false);

  const slug = useMemo(() => {
    if (!input.trim()) return '';

    let result = input;

    // Remove HTML tags
    result = result.replace(/<[^>]*>/g, '');

    // Normalize separator in input
    if (options.separator !== '-') {
      result = result.replace(/-+/g, ' ');
    }
    result = result.replace(/_+/g, ' ');

    // Trim
    if (options.trim) {
      result = result.trim();
    }

    // Lowercase
    if (options.lowercase) {
      result = result.toLowerCase();
    }

    // Replace spaces with separator
    result = result.replace(/\s+/g, options.separator);

    // Remove invalid slug chars (keep only alphanumerics, separator, and dots)
    const safe = result.replace(new RegExp(`[^a-z0-9${options.separator === '.' ? '\\.' : ''}]`, 'g'), '');

    // Collapse multiple separators
    const sep = options.separator === '.' ? '\\.' : options.separator;
    result = safe.replace(new RegExp(`${sep}+`, 'g'), options.separator);

    // Trim leading/trailing separators
    result = result.replace(new RegExp(`^${sep}|${sep}$`, 'g'), '');

    // Apply length limit
    if (options.limit > 0 && result.length > options.limit) {
      result = result.slice(0, options.limit);
      // Don't end on a separator
      result = result.replace(new RegExp(`${sep}$`, 'g'), '');
    }

    return result;
  }, [input, options]);

  const copy = async () => {
    if (!slug) return;
    await navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const examples = [
    'Hello World Example!',
    '  Multiple   Spaces   Here  ',
    'Special!@#Characters$%^',
    'UPPERCASE Text Input',
    'Text with some   mixed     spacing',
  ];

  return (
    <div className="space-y-5">
      {/* Input */}
      <div>
        <label className="block text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Text
        </label>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste or type any text to generate a URL slug…"
          rows={4}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-gray-100 text-sm focus:outline-none focus:border-green-500 placeholder-gray-600 resize-y"
        />
      </div>

      {/* Options */}
      <div className="flex flex-wrap gap-4">
        {/* Lowercase toggle */}
        <button
          onClick={() => setOptions(o => ({ ...o, lowercase: !o.lowercase }))}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            options.lowercase
              ? 'bg-green-600 border-green-600 text-black font-medium'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Lowercase
        </button>

        {/* Trim toggle */}
        <button
          onClick={() => setOptions(o => ({ ...o, trim: !o.trim }))}
          className={`text-sm px-3 py-1.5 rounded-full border transition-colors ${
            options.trim
              ? 'bg-green-600 border-green-600 text-black font-medium'
              : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-white'
          }`}
        >
          Trim
        </button>

        {/* Separator */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500 uppercase tracking-wide">Sep:</span>
          {(['-', '_', '.'] as Separator[]).map(s => (
            <button
              key={s}
              onClick={() => setOptions(o => ({ ...o, separator: s }))}
              className={`w-8 h-8 rounded-lg text-sm font-mono transition-colors ${
                options.separator === s
                  ? 'bg-green-600 text-black font-bold'
                  : 'bg-gray-800 border border-gray-700 text-gray-400 hover:text-white'
              }`}
            >
              {s === '-' ? '−' : s}
            </button>
          ))}
        </div>

        {/* Limit */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOptions(o => ({ ...o, limit: 0 }))}
            className={`text-xs px-2 py-1 rounded transition-colors ${
              options.limit === 0
                ? 'bg-gray-600 text-white'
                : 'bg-gray-800 text-gray-500 hover:text-gray-300 border border-gray-700'
            }`}
          >
            No limit
          </button>
          {[50, 60, 75].map(l => (
            <button
              key={l}
              onClick={() => setOptions(o => ({ ...o, limit: l }))}
              className={`text-xs px-2 py-1 rounded transition-colors ${
                options.limit === l
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-800 text-gray-500 hover:text-gray-300 border border-gray-700'
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      {/* Output */}
      {slug ? (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1.5">Slug</p>
              <p className="text-green-400 font-mono text-lg break-all leading-snug">
                {slug}
              </p>
            </div>
            <button
              onClick={copy}
              className="shrink-0 mt-6 px-4 py-1.5 bg-green-600 hover:bg-green-500 text-black text-sm font-medium rounded-lg transition-colors"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-700 flex gap-4 text-xs text-gray-500">
            <span>{slug.length} chars</span>
            {options.limit > 0 && <span>limit: {options.limit}</span>}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 text-center">
          <p className="text-gray-500 text-sm">Start typing to generate a URL slug</p>
        </div>
      )}

      {/* Examples */}
      <div>
        <p className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-2">
          Try an example
        </p>
        <div className="flex flex-wrap gap-2">
          {examples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setInput(ex)}
              className="text-xs px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-full text-gray-400 hover:text-white hover:border-gray-600 transition-colors truncate max-w-48"
              title={ex}
            >
              {ex.length > 30 ? ex.slice(0, 30) + '…' : ex}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
