import Link from 'next/link';
import { tools } from '@/data/tools';
import { CAT_META } from '@/lib/v2/categoryMeta';

const CATEGORY_ORDER: { id: string; label: string; examples: string }[] = [
  { id: 'Developer',  label: 'Developer',  examples: 'JSON, regex, JWT, hash, UUID' },
  { id: 'Text',       label: 'Text',       examples: 'Word counter, case, grammar' },
  { id: 'Image',      label: 'Image',      examples: 'Crop, resize, convert, favicon' },
  { id: 'Color',      label: 'Color',      examples: 'Picker, palette, contrast' },
  { id: 'Conversion', label: 'Conversion', examples: 'Units, bases, timestamp, YAML/JSON' },
  { id: 'SEO',        label: 'SEO',        examples: 'Meta tags, sitemap, SERP preview' },
  { id: 'CSS',        label: 'CSS',        examples: 'Gradient, border-radius, shadow' },
  { id: 'Network',    label: 'Network',    examples: 'DNS, ports, headers' },
  { id: 'Encoder',    label: 'Encoder',    examples: 'Base64, URL, HTML entities' },
  { id: 'Utility',    label: 'Utility',    examples: 'Password, random, UUID' },
  { id: 'Math',       label: 'Math',       examples: 'Percentage, averages, stats' },
];

export default function CategoryGrid() {
  const counts = tools.reduce<Record<string, number>>((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + 1;
    return acc;
  }, {});

  const cats = CATEGORY_ORDER.filter((c) => counts[c.id] > 0);

  return (
    <section className="tb-v2-band tb-v2-band-sm">
      <div className="tb-v2-container">
        <div className="tb-v2-band-head">
          <div>
            <div className="tb-v2-kicker">Browse by category</div>
            <h2>Pick a shape.<br />Find a tool.</h2>
          </div>
          <div className="tb-v2-band-head-side">
            Eleven families, hundreds of tools. Everything is one click away — no
            account, no install, no waiting.
          </div>
        </div>
        <div className="tb-v2-cats">
          {cats.map((cat) => {
            const meta = CAT_META[cat.id];
            const Icon = meta?.icon;
            const count = counts[cat.id] || 0;
            return (
              <Link
                key={cat.id}
                href={`/directory?cat=${encodeURIComponent(cat.id)}`}
                className="tb-v2-cat"
                style={
                  {
                    '--cat-color': meta?.color,
                    '--cat-bg': meta?.bg,
                  } as React.CSSProperties
                }
              >
                <div className="tb-v2-cat-icon">
                  {Icon ? <Icon width={22} height={22} /> : null}
                </div>
                <div className="tb-v2-cat-name">{cat.label}</div>
                <div className="tb-v2-cat-count">{count} tools</div>
                <div className="tb-v2-cat-examples">{cat.examples}</div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
