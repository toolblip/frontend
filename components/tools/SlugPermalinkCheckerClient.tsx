'use client';

import { useState, useMemo } from 'react';

const STOPWORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'is', 'are',
  'was', 'were', 'be', 'been', 'by', 'as', 'it', 'this', 'that', 'from', 'into', 'about',
]);

interface Issue {
  level: 'err' | 'warn' | 'ok';
  message: string;
}

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

function analyzeSlug(raw: string) {
  const slug = extractLastSegment(raw);
  const issues: Issue[] = [];
  let score = 100;

  if (!slug) {
    return { slug, issues: [{ level: 'err' as const, message: 'No slug to analyze.' }], score: 0, words: [] as string[] };
  }

  if (/[A-Z]/.test(slug)) {
    issues.push({ level: 'warn', message: 'Contains uppercase letters — slugs should be all lowercase.' });
    score -= 15;
  }
  if (/\s/.test(slug)) {
    issues.push({ level: 'err', message: 'Contains spaces — use hyphens to separate words instead.' });
    score -= 25;
  }
  if (/_/.test(slug)) {
    issues.push({ level: 'warn', message: 'Contains underscores — hyphens are preferred over underscores for word separation.' });
    score -= 10;
  }
  if (/[^a-z0-9-]/i.test(slug.replace(/\s/g, ''))) {
    issues.push({ level: 'err', message: 'Contains special characters — stick to letters, numbers, and hyphens.' });
    score -= 20;
  }
  if (/--+/.test(slug)) {
    issues.push({ level: 'warn', message: 'Contains consecutive hyphens.' });
    score -= 10;
  }
  if (/^-|-$/.test(slug)) {
    issues.push({ level: 'warn', message: 'Starts or ends with a hyphen.' });
    score -= 10;
  }

  const words = slug.toLowerCase().split('-').filter(Boolean);
  const wordCount = words.length;

  if (wordCount < 2) {
    issues.push({ level: 'warn', message: 'Only one word — slugs with 3–5 descriptive words tend to perform better for SEO.' });
    score -= 10;
  } else if (wordCount > 8) {
    issues.push({ level: 'warn', message: `${wordCount} words is quite long — aim for roughly 3–5 words.` });
    score -= 10;
  }

  if (slug.length > 60) {
    issues.push({ level: 'warn', message: `${slug.length} characters is long — Google typically truncates URLs beyond ~60 characters in the SERP.` });
    score -= 10;
  } else if (slug.length < 3) {
    issues.push({ level: 'warn', message: 'Very short slug — may not be descriptive enough.' });
    score -= 10;
  }

  const stopwordCount = words.filter(w => STOPWORDS.has(w)).length;
  if (wordCount > 0 && stopwordCount / wordCount > 0.5) {
    issues.push({ level: 'warn', message: 'Mostly made up of stopwords (the, a, of, and...) — consider trimming them for a more keyword-focused slug.' });
    score -= 15;
  }

  if (/^\d+$/.test(slug.replace(/-/g, ''))) {
    issues.push({ level: 'warn', message: 'Slug is entirely numeric — not descriptive for search engines or users.' });
    score -= 10;
  }

  if (issues.length === 0) {
    issues.push({ level: 'ok', message: 'No structural issues found — well-formatted, descriptive slug.' });
  }

  score = Math.max(0, Math.min(100, score));
  return { slug, issues, score, words };
}

function scoreLabel(score: number): { label: string; status: 'ok' | 'warn' | 'err' } {
  if (score >= 80) return { label: 'Excellent', status: 'ok' };
  if (score >= 60) return { label: 'Good', status: 'ok' };
  if (score >= 40) return { label: 'Needs Improvement', status: 'warn' };
  return { label: 'Poor', status: 'err' };
}

export default function SlugPermalinkCheckerClient() {
  const [input, setInput] = useState('');

  const result = useMemo(() => (input.trim() ? analyzeSlug(input) : null), [input]);
  const rating = result ? scoreLabel(result.score) : null;

  return (
    <div className="tb-v2-tool-card">
      <div className="tb-v2-banner tb-v2-banner-info" style={{ margin: '20px 20px 0' }}>
        This checks the <strong>format and SEO-friendliness</strong> of a slug (lowercase, hyphenation,
        length, stopword usage). It cannot verify whether the slug is actually available/unique on a
        live site — that requires checking your CMS or server directly.
      </div>

      <div className="tb-v2-tool-input-head">
        <span className="tb-v2-tool-label">Slug or URL Path</span>
      </div>
      <div style={{ padding: '16px 20px' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="e.g. /blog/how-to-bake-sourdough-bread or how-to-bake-sourdough-bread"
          className="tb-v2-input tb-v2-input-mono"
        />
      </div>

      <div className="tb-v2-tool-output-head">
        <span className="tb-v2-tool-label">Analysis</span>
        {rating && (
          <span className={`tb-v2-status tb-v2-status-${rating.status}`}>{rating.label} · {result!.score}/100</span>
        )}
      </div>
      <div className="tb-v2-tool-output-body">
        {!result ? (
          <p className="tb-v2-empty">Enter a slug or URL path above to analyze it.</p>
        ) : (
          <>
            <div className="tb-v2-stats-grid" style={{ border: '1px solid var(--line)', borderRadius: 'var(--radius-sm)', marginBottom: 16 }}>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.slug.length}</span>
                <span className="tb-v2-stat-pill-lbl">Characters</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.words.length}</span>
                <span className="tb-v2-stat-pill-lbl">Words</span>
              </div>
              <div className="tb-v2-stat-pill">
                <span className="tb-v2-stat-pill-val">{result.score}</span>
                <span className="tb-v2-stat-pill-lbl">SEO Score</span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {result.issues.map((issue, i) => (
                <div key={i} className={`tb-v2-banner tb-v2-banner-${issue.level === 'ok' ? 'info' : issue.level}`}>
                  {issue.message}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
