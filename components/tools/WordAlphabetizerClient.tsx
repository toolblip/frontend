'use client';

import { useState, useMemo } from 'react';

export default function WordAlphabetizerClient() {
  const [input, setInput] = useState('');
  const [caseInsensitive, setCaseInsensitive] = useState(true);
  const [copied, setCopied] = useState(false);

  const words = useMemo(() => {
    const tokens = (input.match(/[A-Za-z0-9'-]+/g) || [])
      .map(w => w.replace(/^['-]+|['-]+$/g, ''))
      .filter(Boolean);

    const seen = new Set<string>();
    const unique: string[] = [];
    for (const w of tokens) {
      const key = caseInsensitive ? w.toLowerCase() : w;
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(w);
      }
    }

    return unique.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: caseInsensitive ? 'base' : 'variant' }));
  }, [input, caseInsensitive]);

  const loadExample = () => {
    setInput('The quick brown fox jumps over the lazy dog. The Dog barks, and the Fox runs away into the woods near the river.');
  };

  const copyAll = () => {
    navigator.clipboard.writeText(words.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste any text to extract and alphabetize its unique words..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section">
        <label className="tb-v2-checkbox-row">
          <input
            type="checkbox"
            checked={caseInsensitive}
            onChange={e => setCaseInsensitive(e.target.checked)}
          />
          Case-insensitive dedupe (treat &quot;Fox&quot; and &quot;fox&quot; as the same word)
        </label>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">{words.length} Unique Word{words.length === 1 ? '' : 's'}</span>
        <button type="button" onClick={copyAll} disabled={words.length === 0} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy All'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {words.length === 0 ? (
          <p className="tb-v2-empty">Enter text to extract and alphabetize its unique words.</p>
        ) : (
          <div className="tb-v2-tool-pre" style={{ maxHeight: 360 }}>
            {words.join('\n')}
          </div>
        )}
      </div>
    </div>
  );
}
