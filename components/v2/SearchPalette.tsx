'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconSearch, IconArrowUR } from './icons';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function SearchPalette({ open, onClose }: Props) {
  const router = useRouter();
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 20);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return tools.slice(0, 8);
    type Scored = { t: (typeof tools)[number]; score: number };
    const scored: Scored[] = [];
    const seen = new Set<string>();
    for (const t of tools) {
      if (seen.has(t.name)) continue;
      const name = t.name.toLowerCase();
      const desc = t.description.toLowerCase();
      const cat = t.category.toLowerCase();
      let score = 0;
      if (name.startsWith(query)) score += 100;
      else if (name.includes(query)) score += 50;
      if (t.slug.includes(query)) score += 40;
      if (cat.includes(query)) score += 20;
      if (desc.includes(query)) score += 10;
      if (score > 0) {
        scored.push({ t, score });
        seen.add(t.name);
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 10).map((s) => s.t);
  }, [q]);

  useEffect(() => setIdx(0), [q]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const picked = results[idx];
        if (picked) {
          router.push(`/tools/${picked.slug}`);
          onClose();
        } else if (q.trim()) {
          router.push(`/directory?q=${encodeURIComponent(q.trim())}`);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, results, idx, q, onClose, router]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(`[data-idx="${idx}"]`);
    if (!el) return;
    const pRect = listRef.current.getBoundingClientRect();
    const cRect = el.getBoundingClientRect();
    if (cRect.bottom > pRect.bottom) listRef.current.scrollTop += cRect.bottom - pRect.bottom;
    else if (cRect.top < pRect.top) listRef.current.scrollTop -= pRect.top - cRect.top;
  }, [idx]);

  if (!open) return null;

  const hasQuery = q.trim().length > 0;

  return (
    <div className="tb-v2-sp-overlay" onMouseDown={onClose}>
      <div className="tb-v2-sp-panel" onMouseDown={(e) => e.stopPropagation()}>
        <div className="tb-v2-sp-head">
          <IconSearch style={{ width: 18, height: 18, color: 'var(--fg-3)' }} />
          <input
            ref={inputRef}
            className="tb-v2-sp-input"
            placeholder="Search 100+ tools by name, category, or what they do…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button className="tb-v2-sp-close" onClick={onClose} aria-label="Close">
            <span className="tb-v2-kbd">ESC</span>
          </button>
        </div>

        <div className="tb-v2-sp-list" ref={listRef}>
          {!hasQuery && <div className="tb-v2-sp-section-label">Suggested</div>}
          {hasQuery && results.length > 0 && (
            <div className="tb-v2-sp-section-label">
              {results.length} match{results.length === 1 ? '' : 'es'}
            </div>
          )}
          {results.length === 0 && (
            <div className="tb-v2-sp-empty">
              <div className="t-kicker" style={{ marginBottom: 6 }}>Nothing here</div>
              <div style={{ color: 'var(--fg-2)', fontSize: 14 }}>
                No tool matches <b style={{ color: 'var(--fg-0)' }}>&ldquo;{q}&rdquo;</b>.
                {' '}Press <span className="tb-v2-kbd">Enter</span> to open the full directory.
              </div>
            </div>
          )}
          {results.map((t, i) => {
            const meta = getCategoryMeta(t.category);
            const Icon = meta.icon;
            return (
              <Link
                key={t.slug}
                data-idx={i}
                href={`/tools/${t.slug}`}
                className={`tb-v2-sp-row ${i === idx ? 'on' : ''}`}
                onMouseEnter={() => setIdx(i)}
                onClick={onClose}
                style={{
                  ['--cat-color' as string]: meta.color,
                  ['--cat-bg' as string]: meta.bg,
                }}
              >
                <div className="tb-v2-sp-row-icon">
                  <Icon className="tb-v2-ic tb-v2-ic-lg" />
                </div>
                <div>
                  <div className="tb-v2-sp-row-title">{t.name}</div>
                  <div className="tb-v2-sp-row-desc">{t.description}</div>
                </div>
                <div className="tb-v2-sp-row-cat">{t.category}</div>
                <IconArrowUR className="tb-v2-ic tb-v2-sp-row-go" />
              </Link>
            );
          })}
        </div>

        <div className="tb-v2-sp-foot">
          <span><span className="tb-v2-kbd">↑</span><span className="tb-v2-kbd">↓</span> Navigate</span>
          <span><span className="tb-v2-kbd">↵</span> Open</span>
          <span><span className="tb-v2-kbd">ESC</span> Close</span>
          <span style={{ marginLeft: 'auto' }}>
            <Link
              href={q.trim() ? `/directory?q=${encodeURIComponent(q.trim())}` : '/directory'}
              className="tb-v2-sp-foot-link"
              onClick={onClose}
            >
              Browse all tools →
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
