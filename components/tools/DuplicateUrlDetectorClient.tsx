'use client';

import { useState, useMemo } from 'react';

const EXAMPLE = `https://www.example.com/blog/my-post
https://example.com/blog/my-post/
http://example.com/blog/my-post?utm_source=newsletter&utm_medium=email
https://www.example.com/blog/my-post?ref=homepage
https://example.com/pricing
https://example.com/pricing/
https://example.com/contact`;

const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid', 'mc_cid', 'mc_eid', 'msclkid', 'ref', 'ref_src'];

interface UrlGroup {
  canonical: string;
  originals: string[];
}

function canonicalize(raw: string): { key: string; clean: string } | null {
  try {
    const u = new URL(raw.trim());
    let host = u.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    const path = u.pathname.replace(/\/+$/, '') || '/';
    const params = Array.from(u.searchParams.entries())
      .filter(([k]) => !TRACKING_PARAMS.includes(k.toLowerCase()))
      .sort((a, b) => a[0].localeCompare(b[0]));
    const query = params.length ? '?' + params.map(([k, v]) => `${k}=${v}`).join('&') : '';
    return { key: `${host}${path}${query}`, clean: `https://${host}${path}${query}` };
  } catch {
    return null;
  }
}

function findDuplicates(text: string): { groups: UrlGroup[]; invalid: string[]; uniqueCount: number } {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const byKey = new Map<string, UrlGroup>();
  const invalid: string[] = [];

  for (const line of lines) {
    const c = canonicalize(line);
    if (!c) { invalid.push(line); continue; }
    const existing = byKey.get(c.key);
    if (existing) {
      existing.originals.push(line);
    } else {
      byKey.set(c.key, { canonical: c.clean, originals: [line] });
    }
  }

  const all = Array.from(byKey.values());
  return {
    groups: all.filter(g => g.originals.length > 1).sort((a, b) => b.originals.length - a.originals.length),
    invalid,
    uniqueCount: all.length,
  };
}

export default function DuplicateUrlDetectorClient() {
  const [input, setInput] = useState(EXAMPLE);
  const [copied, setCopied] = useState(false);

  const { groups, invalid, uniqueCount } = useMemo(() => findDuplicates(input), [input]);
  const totalLines = useMemo(() => input.split('\n').map(l => l.trim()).filter(Boolean).length, [input]);

  const loadExample = () => setInput(EXAMPLE);

  const dedupedList = useMemo(() => {
    const c = findDuplicates(input);
    const seen = new Set<string>();
    const out: string[] = [];
    for (const line of input.split('\n').map(l => l.trim()).filter(Boolean)) {
      const canon = canonicalize(line);
      const key = canon ? canon.clean : line;
      if (!seen.has(key)) { seen.add(key); out.push(canon ? canon.clean : line); }
    }
    return out.join('\n');
  }, [input]);

  const copy = () => {
    if (!dedupedList) return;
    navigator.clipboard.writeText(dedupedList).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">URLs (one per line)</span>
        <button type="button" onClick={loadExample} className="tb-v2-btn-sm">Load Example</button>
      </div>
      <textarea
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={'https://example.com/page\nhttps://example.com/page/'}
        className="tb-v2-tool-textarea"
        style={{ minHeight: 160, fontFamily: 'var(--f-mono)', fontSize: 13 }}
      />

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Duplicate Groups ({groups.length})</span>
      </div>
      <div className="tb-v2-tool-output-body">
        {totalLines === 0 ? (
          <p className="tb-v2-empty">Paste a list of URLs above to find duplicates and their canonical form.</p>
        ) : groups.length === 0 ? (
          <p className="tb-v2-empty">No duplicates found &middot; {uniqueCount} unique URL{uniqueCount === 1 ? '' : 's'}.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {groups.map((g, i) => (
              <div key={i} className="tb-v2-tool-pre" style={{ padding: '10px 14px' }}>
                <div style={{ fontWeight: 700, marginBottom: 6 }}>Canonical: {g.canonical}</div>
                <div style={{ color: 'var(--fg-2)', fontSize: 12 }}>
                  {g.originals.length} variants found:
                  {g.originals.map((o, j) => <div key={j}>&middot; {o}</div>)}
                </div>
              </div>
            ))}
          </div>
        )}
        {invalid.length > 0 && (
          <div className="tb-v2-banner tb-v2-banner-err" style={{ marginTop: 12 }}>
            {invalid.length} line{invalid.length === 1 ? '' : 's'} could not be parsed as a URL: {invalid.join(', ')}
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <>
          <div className="tb-v2-tool-output-head">
            <span className="tb-v2-tool-label">Deduplicated URL List</span>
            <button type="button" onClick={copy} disabled={!dedupedList} className={`tb-v2-copy-btn ${copied ? 'done' : ''}`}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="tb-v2-tool-output-body">
            <pre className="tb-v2-tool-pre">{dedupedList}</pre>
          </div>
        </>
      )}
    </div>
  );
}
