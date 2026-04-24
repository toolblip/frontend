import Link from 'next/link';
import { tools } from '@/data/tools';

export default function CategoryQuickAccess() {
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const cats = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);

  return (
    <section className="cat-acc">
      <div className="tb-v2-container">
        <div className="cat-acc-inner">
          <span className="cat-acc-label">Browse:</span>
          {cats.map((cat) => (
            <Link
              key={cat}
              href={`/tools?category=${encodeURIComponent(cat)}`}
              className="tb-v2-pill cat-acc-pill"
            >
              {cat}
              <span className="cat-acc-count">{counts[cat]}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
