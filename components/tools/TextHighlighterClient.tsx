'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const DEFAULT_PALETTE = ['#fde68a', '#a7f3d0', '#bfdbfe', '#fbcfe8', '#ddd6fe', '#fecaca', '#fed7aa', '#c7d2fe'];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parseKeywords(raw: string): string[] {
  const parts = raw
    .split(/[\n,]/)
    .map(k => k.trim())
    .filter(Boolean);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const key = p.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(p);
    }
  }
  return out;
}

export default function TextHighlighterClient() {
  const [text, setText] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');
  const [colorOverrides, setColorOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const keywords = useMemo(() => parseKeywords(keywordsInput), [keywordsInput]);

  const colorFor = (kw: string, idx: number): string =>
    colorOverrides[kw.toLowerCase()] ?? DEFAULT_PALETTE[idx % DEFAULT_PALETTE.length];

  const setColorFor = (kw: string, color: string) => {
    setColorOverrides(prev => ({ ...prev, [kw.toLowerCase()]: color }));
  };

  const highlightedHtml = useMemo(() => {
    const escaped = escapeHtml(text);
    if (keywords.length === 0) return escaped;

    const colorMap = new Map<string, string>();
    keywords.forEach((kw, idx) => colorMap.set(kw.toLowerCase(), colorFor(kw, idx)));

    const pattern = keywords
      .slice()
      .sort((a, b) => b.length - a.length)
      .map(kw => escapeRegExp(escapeHtml(kw)))
      .filter(Boolean)
      .join('|');

    if (!pattern) return escaped;

    const regex = new RegExp(`(${pattern})`, 'gi');
    return escaped.replace(regex, match => {
      const color = colorMap.get(match.toLowerCase()) ?? '#fde68a';
      return `<mark style="background:${color};padding:0 2px;border-radius:2px;">${match}</mark>`;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, keywords, colorOverrides]);

  const matchCount = useMemo(() => {
    if (keywords.length === 0) return 0;
    const pattern = keywords.map(kw => escapeRegExp(kw)).filter(Boolean).join('|');
    if (!pattern) return 0;
    const regex = new RegExp(pattern, 'gi');
    return (text.match(regex) || []).length;
  }, [text, keywords]);

  const copyHtml = () => {
    navigator.clipboard.writeText(highlightedHtml).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const loadExample = () => {
    setText('The quick brown fox jumps over the lazy dog. The dog barks at the fox, but the fox runs away quickly into the forest.');
    setKeywordsInput('fox\ndog\nquickly');
  };

  const clearAll = () => {
    setText('');
    setKeywordsInput('');
    setColorOverrides({});
    setCopied(false);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Enter your text</span>
        <ToolExampleClearActions
          onExample={loadExample}
          onClear={clearAll}
          canClear={text.length > 0 || keywordsInput.length > 0}
        />
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste the text you want to highlight..."
        value={text}
        onChange={e => setText(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section">
        <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Keywords (comma or newline separated)</span>
        <textarea
          className="tb-v2-input"
          placeholder={'e.g. fox, dog\nquickly'}
          value={keywordsInput}
          onChange={e => setKeywordsInput(e.target.value)}
          rows={3}
        />
      </div>

      {keywords.length > 0 && (
        <div className="tb-v2-section">
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Colors</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {keywords.map((kw, idx) => (
              <label key={kw.toLowerCase()} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                <input
                  type="color"
                  value={colorFor(kw, idx)}
                  onChange={e => setColorFor(kw, e.target.value)}
                  style={{ width: 28, height: 28, padding: 0, border: '1px solid var(--line)', borderRadius: 6, cursor: 'pointer' }}
                />
                {kw}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Highlighted Output ({matchCount} match{matchCount === 1 ? '' : 'es'})</span>
        <button type="button" onClick={copyHtml} disabled={!text} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy as HTML'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {!text ? (
          <p className="tb-v2-empty">Enter text and keywords to see them highlighted.</p>
        ) : (
          <div
            style={{ whiteSpace: 'pre-wrap', fontSize: 15, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        )}
      </div>
    </div>
  );
}
