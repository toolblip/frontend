'use client';

import Link from 'next/link';

interface Category {
  name: string;
  emoji: string;
  bg: string;
  color: string;
}

interface CategoryQuickAccessProps {
  categories: Category[];
}

const EMOJI_MAP: Record<string, string> = {
  Text: '📝',
  Developer: '⚡',
  Image: '🖼️',
  'Image Tools': '🖼️',
  SEO: '🔍',
  Color: '🎨',
  Encoder: '🔐',
  Conversion: '🔄',
  'AI Tools': '🤖',
  Utility: '🛠️',
  'Video Tools': '🎬',
  'PDF Tools': '📄',
  Network: '🌐',
  Math: '🔢',
  CSS: '🎨',
  'Document Generator': '📄',
  'Date & Time': '📅',
  'Text Tools': '📝',
};

const COLOR_MAP: Record<string, { bg: string; color: string }> = {
  Text: { bg: 'var(--c-txt-bg)', color: 'var(--c-txt)' },
  Developer: { bg: 'var(--c-dev-bg)', color: 'var(--c-dev)' },
  Image: { bg: 'var(--c-img-bg)', color: 'var(--c-img)' },
  'Image Tools': { bg: 'var(--c-img-bg)', color: 'var(--c-img)' },
  SEO: { bg: 'var(--c-seo-bg)', color: 'var(--c-seo)' },
  Color: { bg: 'var(--c-col-bg)', color: 'var(--c-col)' },
  Encoder: { bg: 'var(--c-enc-bg)', color: 'var(--c-enc)' },
  Conversion: { bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
  'AI Tools': { bg: 'var(--blue-tint)', color: '#1d3fa0' },
  Utility: { bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
  'Video Tools': { bg: 'var(--purple-tint)', color: '#5a2d8a' },
  'PDF Tools': { bg: 'var(--red-tint)', color: 'var(--red)' },
  Network: { bg: 'var(--blue-tint)', color: '#1d3fa0' },
  Math: { bg: 'var(--amber-tint)', color: '#7a4e00' },
  CSS: { bg: 'var(--blue-tint)', color: '#1d3fa0' },
  'Document Generator': { bg: 'var(--green-tint)', color: '#1e6b42' },
  'Date & Time': { bg: 'var(--amber-tint)', color: '#7a4e00' },
  'Text Tools': { bg: 'var(--c-txt-bg)', color: 'var(--c-txt)' },
};

function getCategoryStyle(name: string): { bg: string; color: string } {
  return COLOR_MAP[name] ?? { bg: 'var(--surface-2)', color: 'var(--fg-1)' };
}

function getCategoryEmoji(name: string): string {
  return EMOJI_MAP[name] ?? '🔧';
}

export default function CategoryQuickAccess({ categories }: CategoryQuickAccessProps) {
  return (
    <section className="tb-v2-band-sm">
      <div className="tb-v2-container">
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
          justifyContent: 'center',
        }}>
          {categories.map((cat) => {
            const { bg, color } = getCategoryStyle(cat.name);
            const emoji = getCategoryEmoji(cat.name);
            return (
              <Link
                key={cat.name}
                href={`/directory?category=${encodeURIComponent(cat.name)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '10px 18px',
                  borderRadius: 999,
                  background: bg,
                  color: color,
                  fontSize: 14,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'transform .1s, box-shadow .1s',
                  border: '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px -4px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: 16 }}>{emoji}</span>
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
