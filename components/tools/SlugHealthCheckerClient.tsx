'use client';

import { useState, useMemo } from 'react';
import ToolExampleClearActions from '@/components/tools/ToolExampleClearActions';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'is', 'are',
  'was', 'were', 'be', 'been', 'by', 'as', 'it', 'this', 'that', 'from', 'into', 'about',
]);

function extractLastSegment(raw: string): string {
  let path = raw.trim();
  if (/^https?:\/\//i.test(path)) {
    try {
      path = new URL(path).pathname;
    } catch {
      // not a valid absolute URL, fall through and treat as a raw path
    }
  }
  path = path.replace(/^\/+|\/+$/g, '');
  const parts = path.split('/');
  return parts[parts.length - 1] || '';
}

/** Normalize a slug so near-duplicates (trailing numbers, "-copy", simple plurals) collapse together. */
function normalizeForClustering(slug: string): string {
  let s = slug.toLowerCase();
  s = s.replace(/-copy(-\d+)?$/, '');
  s = s.replace(/-\d+$/, '');
  s = s.replace(/\d+$/, '');
  s = s.replace(/-$/, '');
  const words = s.split('-').filter(Boolean).map(w => {
    if (w.length > 4 && w.endsWith('ies')) return w.slice(0, -3) + 'y';
    if (w.length > 4 && w.endsWith('es') && !w.endsWith('ses')) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith('s') && !w.endsWith('ss')) return w.slice(0, -1);
    return w;
  });
  return words.join('-');
}

interface SlugRow {
  original: string;
  slug: string;
  issues: string[];
  score: number;
}

function analyzeStructure(slug: string): { issues: string[]; score: number } {
  const issues: string[] = [];
  let score = 100;
  if (!slug) return { issues: ['Empty slug'], score: 0 };

  if (/[A-Z]/.test(slug)) { issues.push('Uppercase letters'); score -= 15; }
  if (/\s/.test(slug)) { issues.push('Contains spaces'); score -= 25; }
  if (/_/.test(slug)) { issues.push('Uses underscores'); score -= 10; }
  if (/[^a-z0-9-]/i.test(slug)) { issues.push('Special characters'); score -= 20; }
  if (/--+/.test(slug)) { issues.push('Consecutive hyphens'); score -= 10; }
  if (/^-|-$/.test(slug)) { issues.push('Leading/trailing hyphen'); score -= 10; }

  const words = slug.toLowerCase().split('-').filter(Boolean);
  if (words.length > 8) { issues.push('Too many words (>8)'); score -= 10; }
  if (slug.length > 60) { issues.push('Over 60 characters'); score -= 10; }

  const stopwordCount = words.filter(w => STOPWORDS.has(w)).length;
  if (words.length > 0 && stopwordCount / words.length > 0.5) { issues.push('Stopword-heavy'); score -= 15; }

  return { issues, score: Math.max(0, Math.min(100, score)) };
}

const EXAMPLE =
  '/blog/best-running-shoes\n/blog/best-running-shoes-2\n/blog/best-running-shoe\n/products/widget\n/blog/best-running-shoes';

export default function SlugHealthCheckerClient() {
  const [input, setInput] = useState('');

  const analysis = useMemo(() => {
    const lines = input.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    const rows: SlugRow[] = lines.map(original => {
      const slug = extractLastSegment(original);
      const { issues, score } = analyzeStructure(slug);
      return { original, slug, issues, score };
    });

    // Exact duplicates (case-insensitive match on the extracted slug segment).
    const exactCounts = new Map<string, number>();
    for (const r of rows) {
      const key = r.slug.toLowerCase();
      exactCounts.set(key, (exactCounts.get(key) ?? 0) + 1);
    }
    const exactDuplicates = [...exactCounts.entries()].filter(([, count]) => count > 1);

    // Near-duplicate clusters among unique slugs.
    const uniqueSlugs = [...new Set(rows.map(r => r.slug))].filter(Boolean);
    const clusters = new Map<string, string[]>();
    for (const slug of uniqueSlugs) {
      const key = normalizeForClustering(slug);
      const arr = clusters.get(key) ?? [];
      arr.push(slug);
      clusters.set(key, arr);
    }
    const nearDuplicateClusters = [...clusters.values()].filter(group => group.length > 1);

    return { rows, exactDuplicates, nearDuplicateClusters, total: lines.length, unique: uniqueSlugs.length };
  }, [input]);

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '20px 20px 0' }}>
        Paste a list of slugs or URLs (one per line, e.g. from a sitemap). This checks for exact and
        near-duplicate paths within the pasted list and flags structural SEO issues per slug. It cannot
        detect duplicate <em>content</em> across pages — only duplicate/similar <em>paths</em> in what you paste.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Slug List</span>
        <ToolExampleClearActions
          onExample={() => setInput(EXAMPLE)}
          onClear={() => setInput('')}
          canClear={input.length > 0}
        />
      </div>
      <textarea
        className="tb-v2-tool-textarea"
        placeholder={'/blog/best-running-shoes\n/blog/best-running-shoes-2\n/blog/best-running-shoe\n/products/widget'}
        value={input}
        onChange={e => setInput(e.target.value)}
        rows={8}
      />

      <div className="tb-v2-tool-output-body">
        {!analysis ? (
          <p className="tb-v2-empty">Paste one slug or URL per line to run the health check.</p>
        ) : (
          <>
            <div className="tb-v2-stats-grid" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', marginBottom: 18 }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{analysis.total}</span>
                <span className="tb-v2-stat-pill-lbl">Total slugs</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{analysis.unique}</span>
                <span className="tb-v2-stat-pill-lbl">Unique slugs</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{analysis.exactDuplicates.length}</span>
                <span className="tb-v2-stat-pill-lbl">Exact duplicates</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{analysis.nearDuplicateClusters.length}</span>
                <span className="tb-v2-stat-pill-lbl">Near-dup clusters</span>
              </div>
            </div>

            {analysis.exactDuplicates.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Exact Duplicates</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {analysis.exactDuplicates.map(([slug, count]) => (
                    <div key={slug} className="tb-v2-banner tb-v2-banner-err">
                      <span style={{ fontFamily: 'var(--f-mono)' }}>{slug}</span> appears {count} times
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.nearDuplicateClusters.length > 0 && (
              <div style={{ marginBottom: 18 }}>
                <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Near-Duplicate Clusters</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {analysis.nearDuplicateClusters.map((group, i) => (
                    <div key={i} className="tb-v2-banner tb-v2-banner-warn">
                      {group.map((s, j) => (
                        <span key={s} style={{ fontFamily: 'var(--f-mono)' }}>{j > 0 ? ', ' : ''}{s}</span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <span className="tb-v2-tool-label" style={{ display: 'block', marginBottom: 8 }}>Per-Slug Structure</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {analysis.rows.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12,
                    padding: '8px 12px', border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)',
                    background: 'var(--surface-2)',
                  }}
                >
                  <span style={{ fontFamily: 'var(--f-mono)', fontSize: 13, wordBreak: 'break-all' }}>{row.original}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    {row.issues.length === 0 ? (
                      <span className="tb-v2-status tb-v2-status-ok">OK</span>
                    ) : (
                      <span className="tb-v2-status tb-v2-status-warn" title={row.issues.join(', ')}>{row.issues.length} issue{row.issues.length === 1 ? '' : 's'}</span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
