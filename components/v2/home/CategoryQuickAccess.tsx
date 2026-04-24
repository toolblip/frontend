import Link from 'next/link';
import { tools } from '@/data/tools';

export default function CategoryQuickAccess() {
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  return (
    <section
      style={{
        borderBottom: '1px solid var(--border-1)',
        padding: '14px 0',
        background: 'var(--bg-1)',
      }}
    >
      <div className="tb-v2-container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--fg-3)',
              marginRight: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              flexShrink: 0,
            }}
          >
            Browse:
          </span>
          {cats.map((cat) => (
            <Link
              key={cat}
              href={`/tools?category=${encodeURIComponent(cat)}`}
              className="tb-v2-pill"
              style={{ fontSize: 13, cursor: 'pointer' }}
            >
              {cat}
              <span
                style={{
                  marginLeft: 5,
                  fontSize: 11,
                  opacity: 0.6,
                  fontWeight: 500,
                }}
              >
                {counts[cat]}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
