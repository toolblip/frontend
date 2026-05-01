'use client';

import Link from 'next/link';

interface CategoryQuickAccessProps {
  // Only name is required; emoji/bg/color are computed internally via EMOJI_MAP / COLOR_MAP
  categories: { name: string }[];
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
          gap: 8,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--fg-3)',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            marginRight: 4,
            whiteSpace: 'nowrap',
          }}>
            Categories
          </span>
          {categories.map((cat) => {
            const { bg, color } = getCategoryStyle(cat.name);
            const emoji = getCategoryEmoji(cat.name);
            return (
              <Link
                key={cat.name}
                href={`/tools?category=${encodeURIComponent(cat.name)}`}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '7px 14px',
                  borderRadius: 999,
                  background: bg,
                  color: color,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  transition: 'transform .1s, box-shadow .1s, opacity .1s',
                  border: '1px solid transparent',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(-1px)';
                  el.style.boxShadow = `0 4px 12px -4px ${color}50`;
                  el.style.opacity = '0.9';
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.transform = 'translateY(0)';
                  el.style.boxShadow = 'none';
                  el.style.opacity = '1';
                }}
              >
                <span style={{ fontSize: 14 }}>{emoji}</span>
                {cat.name}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
