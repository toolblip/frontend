'use client';

import { useState, useMemo } from 'react';

const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'arent',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', 'cant', 'cannot', 'could', 'couldnt', 'did', 'didnt', 'do', 'does', 'doesnt', 'doing',
  'dont', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', 'hadnt', 'has', 'hasnt',
  'have', 'havent', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'isnt', 'it', 'its', 'itself', 'just', 'let', 'me', 'more', 'most',
  'mustnt', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other',
  'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'shant', 'she', 'should',
  'shouldnt', 'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves',
  'then', 'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'wasnt', 'we', 'were', 'werent', 'what', 'when', 'where', 'which', 'while', 'who',
  'whom', 'why', 'with', 'wont', 'would', 'wouldnt', 'you', 'your', 'yours', 'yourself', 'yourselves',
  'also', 'get', 'got', 'like', 'one', 'two', 'im', 'ive', 'youre', 'theyre', 'weve', 'theres', 'thats',
]);

function tokenize(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) || []).map(t => t.replace(/'/g, '')).filter(t => t.length > 1);
}

interface RankedItem {
  text: string;
  count: number;
  density: number;
}

function rankKeywords(tokens: string[], totalTokens: number): RankedItem[] {
  const freq = new Map<string, number>();
  for (const t of tokens) {
    if (STOPWORDS.has(t) || /^\d+$/.test(t)) continue;
    freq.set(t, (freq.get(t) ?? 0) + 1);
  }
  return [...freq.entries()]
    .map(([text, count]) => ({ text, count, density: totalTokens ? (count / totalTokens) * 100 : 0 }))
    // Rank primarily by frequency, with a mild bonus for longer (more specific/rarer) words.
    .sort((a, b) => (b.count + b.text.length * 0.01) - (a.count + a.text.length * 0.01))
    .slice(0, 20);
}

function rankPhrases(tokens: string[], totalTokens: number): RankedItem[] {
  const freq = new Map<string, number>();
  for (const n of [2, 3]) {
    for (let i = 0; i <= tokens.length - n; i++) {
      const gram = tokens.slice(i, i + n);
      if (STOPWORDS.has(gram[0]) || STOPWORDS.has(gram[gram.length - 1])) continue;
      if (gram.every(w => /^\d+$/.test(w))) continue;
      const phrase = gram.join(' ');
      freq.set(phrase, (freq.get(phrase) ?? 0) + 1);
    }
  }
  return [...freq.entries()]
    .filter(([, count]) => count > 1)
    .map(([text, count]) => ({ text, count, density: totalTokens ? (count / totalTokens) * 100 : 0 }))
    .sort((a, b) => b.count - a.count || b.text.split(' ').length - a.text.split(' ').length)
    .slice(0, 20);
}

export default function KeywordExtractorClient() {
  const [input, setInput] = useState('');

  const { keywords, phrases, totalTokens } = useMemo(() => {
    const tokens = tokenize(input);
    return {
      keywords: rankKeywords(tokens, tokens.length),
      phrases: rankPhrases(tokens, tokens.length),
      totalTokens: tokens.length,
    };
  }, [input]);

  const copyList = (items: RankedItem[]) => {
    const text = items.map(k => `${k.text}: ${k.count} (${k.density.toFixed(1)}%)`).join('\n');
    navigator.clipboard.writeText(text).catch(() => {});
  };

  const renderTable = (items: RankedItem[], emptyMsg: string, onCopy: () => void) => (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
        <button type="button" onClick={onCopy} disabled={items.length === 0} className="tb-v2-copy-btn">
          Copy List
        </button>
      </div>
      {items.length === 0 ? (
        <p className="tb-v2-empty">{emptyMsg}</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item, i) => (
            <div
              key={item.text}
              style={{
                display: 'grid', gridTemplateColumns: '28px 1fr 60px 70px', alignItems: 'center', gap: 8,
                padding: '7px 10px', borderRadius: 'var(--radius-sm)',
                background: i % 2 === 0 ? 'var(--surface-2)' : 'transparent', fontSize: 13.5,
              }}
            >
              <span style={{ color: 'var(--fg-3)' }}>{i + 1}</span>
              <span style={{ fontFamily: 'var(--f-mono)', color: 'var(--fg-0)' }}>{item.text}</span>
              <span style={{ textAlign: 'right', color: 'var(--fg-1)', fontWeight: 600 }}>{item.count}</span>
              <span style={{ textAlign: 'right', color: 'var(--fg-2)' }}>{item.density.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '20px 20px 0' }}>
        Works on pasted text only — fetching a live webpage isn&apos;t possible from the browser (CORS),
        so copy/paste the page content you want to analyze.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Text</span>
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder="Paste an article, blog post, or any text to analyze..."
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={8}
      />

      {totalTokens > 0 && (
        <div className="tb-v2-stats-grid">
          <div className="tb-v2-stat-pill">
            <span className="tb-v2-stat-pill-val">{totalTokens}</span>
            <span className="tb-v2-stat-pill-lbl">Words analyzed</span>
          </div>
          <div className="tb-v2-stat-pill">
            <span className="tb-v2-stat-pill-val">{keywords.length}</span>
            <span className="tb-v2-stat-pill-lbl">Top keywords</span>
          </div>
          <div className="tb-v2-stat-pill">
            <span className="tb-v2-stat-pill-val">{phrases.length}</span>
            <span className="tb-v2-stat-pill-lbl">Top phrases</span>
          </div>
        </div>
      )}

      <div className="tb-v2-grid-2">
        <div style={{ padding: '16px 20px' }}>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 10 }}>Top Keywords</span>
          {renderTable(keywords, 'Paste text above to extract keywords.', () => copyList(keywords))}
        </div>
        <div style={{ padding: '16px 20px' }}>
          <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 10 }}>Top Phrases (2–3 words)</span>
          {renderTable(phrases, 'Paste text above to extract phrases.', () => copyList(phrases))}
        </div>
      </div>
    </div>
  );
}
