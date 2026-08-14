'use client';

import { useState, useMemo } from 'react';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  "aren't", 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does',
  "doesn't", 'doing', "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  "hadn't", 'has', "hasn't", 'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her',
  'here', "here's", 'hers', 'herself', 'him', 'himself', 'his', 'how', "how's", 'i', "i'd",
  "i'll", "i'm", "i've", 'if', 'in', 'into', 'is', "isn't", 'it', "it's", 'its', 'itself',
  "let's", 'me', 'more', 'most', "mustn't", 'my', 'myself', 'no', 'nor', 'not', 'of', 'off',
  'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over',
  'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should', "shouldn't", 'so',
  'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't",
  'we', "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when',
  "when's", 'where', "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's",
  'with', "won't", 'would', "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your',
  'yours', 'yourself', 'yourselves', 'also', 'just', 'like', 'get', 'got', 'one', 'will',
]);

const TOP_N = 20;

interface FreqRow {
  term: string;
  count: number;
  pct: string;
}

function buildFreq(terms: string[], topN: number, sortMode: 'count' | 'az'): FreqRow[] {
  const counts = new Map<string, number>();
  terms.forEach(t => counts.set(t, (counts.get(t) || 0) + 1));
  const total = terms.length || 1;
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([term, count]) => ({ term, count, pct: ((count / total) * 100).toFixed(1) }));
  if (sortMode === 'az') {
    top.sort((a, b) => a.term.localeCompare(b.term));
  }
  return top;
}

function toCsv(rows: FreqRow[]): string {
  return rows.map(r => `"${r.term.replace(/"/g, '""')}",${r.count},${r.pct}%`).join('\n');
}

export default function WordFreqExpressClient() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const [sortMode, setSortMode] = useState<'count' | 'az'>('count');

  const tokens = useMemo(() => {
    return (input.toLowerCase().match(/[a-z0-9']+/g) || []).map(w => w.replace(/^'+|'+$/g, '')).filter(Boolean);
  }, [input]);

  const filtered = useMemo(() => tokens.filter(t => !STOPWORDS.has(t) && t.length > 1), [tokens]);

  const unigrams = useMemo(() => buildFreq(filtered, TOP_N, sortMode), [filtered, sortMode]);

  const bigrams = useMemo(() => {
    const grams: string[] = [];
    for (let i = 0; i < filtered.length - 1; i++) grams.push(`${filtered[i]} ${filtered[i + 1]}`);
    return buildFreq(grams, TOP_N, sortMode);
  }, [filtered, sortMode]);

  const trigrams = useMemo(() => {
    const grams: string[] = [];
    for (let i = 0; i < filtered.length - 2; i++) grams.push(`${filtered[i]} ${filtered[i + 1]} ${filtered[i + 2]}`);
    return buildFreq(grams, TOP_N, sortMode);
  }, [filtered, sortMode]);

  const loadExample = () => {
    setInput(
      'Search engine optimization helps websites rank higher in search results. Good SEO practices include keyword research, on page optimization, and quality content. Search engine optimization is an ongoing process that requires monitoring search rankings and adjusting your SEO strategy over time.'
    );
  };

  const copyCsv = () => {
    const csv = [
      'Single Words', 'term,count,percent', toCsv(unigrams), '',
      '2-Word Phrases', 'term,count,percent', toCsv(bigrams), '',
      '3-Word Phrases', 'term,count,percent', toCsv(trigrams),
    ].join('\n');
    navigator.clipboard.writeText(csv).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const renderTable = (title: string, rows: FreqRow[]) => (
    <div>
      <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>{title}</span>
      {rows.length === 0 ? (
        <p style={{ fontSize: 13, color: 'var(--fg-3)' }}>Not enough words for this view.</p>
      ) : (
        <table style={{ width: '100%', fontSize: 13, borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--fg-2)', fontSize: 11, textTransform: 'uppercase' }}>
              <th style={{ padding: '4px 8px 4px 0' }}>Term</th>
              <th style={{ padding: '4px 8px' }}>Count</th>
              <th style={{ padding: '4px 0' }}>%</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.term} style={{ borderTop: '1px solid var(--line)' }}>
                <td style={{ padding: '5px 8px 5px 0', fontFamily: 'var(--f-mono)' }}>{r.term}</td>
                <td style={{ padding: '5px 8px' }}>{r.count}</td>
                <td style={{ padding: '5px 0' }}>{r.pct}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste an article, page copy, or blog post to analyze word and phrase frequency..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={6}
      />

      <div className="tb-v2-section" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="tb-v2-tool-label">Sort By</span>
        <select value={sortMode} onChange={e => setSortMode(e.target.value as 'count' | 'az')} className="tb-v2-select">
          <option value="count">Count (high to low)</option>
          <option value="az">Alphabetical (A-Z)</option>
        </select>
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Frequency Analysis</span>
        <button type="button" onClick={copyCsv} disabled={filtered.length === 0} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
          {copied ? 'Copied' : 'Copy as CSV'}
        </button>
      </div>
      <div className="tb-v2-tool-output-body">
        {filtered.length === 0 ? (
          <p className="tb-v2-empty">Enter text to see word and phrase frequency, useful for SEO content review.</p>
        ) : (
          <>
            <div className="tb-v2-stats-grid" style={{ marginBottom: 16 }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{tokens.length}</span>
                <span className="tb-v2-stat-pill-lbl">Total Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{filtered.length}</span>
                <span className="tb-v2-stat-pill-lbl">After Stopwords</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{new Set(filtered).size}</span>
                <span className="tb-v2-stat-pill-lbl">Unique Words</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {renderTable('Top Single Words', unigrams)}
              {renderTable('Top 2-Word Phrases', bigrams)}
              {renderTable('Top 3-Word Phrases', trigrams)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
