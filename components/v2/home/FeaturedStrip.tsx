import Link from 'next/link';
import { tools } from '@/data/tools';
import { CAT_META } from '@/lib/v2/categoryMeta';
import {
  IconArrowUR, IconCode, IconGrid, IconColor, IconHash, IconCrop, IconKey, IconUtil,
} from '@/components/v2/icons';

const PICKS = [
  'json-formatter',
  'qr-code-generator',
  'color-picker',
  'regex-tester',
  'image-resizer',
  'jwt-decoder',
];

const TOOL_ICON: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  'json-formatter': IconCode,
  'qr-code-generator': IconGrid,
  'color-picker': IconColor,
  'regex-tester': IconHash,
  'image-resizer': IconCrop,
  'jwt-decoder': IconKey,
};

export default function FeaturedStrip() {
  const picks = PICKS.map((slug) => tools.find((t) => t.slug === slug)).filter(
    (t): t is NonNullable<typeof t> => Boolean(t),
  );

  return (
    <section className="tb-v2-band">
      <div className="tb-v2-container">
        <div className="tb-v2-band-head">
          <div>
            <div className="tb-v2-kicker">Most loved this month</div>
            <h2>The regulars.</h2>
          </div>
          <div className="tb-v2-band-head-side">
            The tools that keep earning their place. Each runs entirely in your
            browser — paste, tweak, copy, done.
          </div>
        </div>
        <div className="tb-v2-dir-grid">
          {picks.map((t) => {
            const meta = CAT_META[t.category];
            const Icon = TOOL_ICON[t.slug] ?? meta?.icon ?? IconUtil;
            return (
              <Link
                key={t.slug}
                href={`/tools/${t.slug}`}
                className="tb-v2-dir-card"
                style={
                  {
                    '--cat-color': meta?.color,
                    '--cat-bg': meta?.bg,
                  } as React.CSSProperties
                }
              >
                <div className="tb-v2-dir-card-top">
                  <div className="tb-v2-dir-card-icon">
                    <Icon width={22} height={22} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-dir-card-title">{t.name}</div>
                  </div>
                  <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                </div>
                <div className="tb-v2-dir-card-desc">{t.description}</div>
                <div className="tb-v2-dir-card-foot">
                  <span className="tb-v2-dir-tag">{t.category}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
