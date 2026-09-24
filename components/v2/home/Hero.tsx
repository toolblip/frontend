import Link from 'next/link';
import HeroToy from './HeroToy';
import { IconArrow, IconShield, IconZap, IconGift } from '@/components/v2/icons';

export default function Hero({ toolCount }: { toolCount: number }) {
  return (
    <section className="tb-v2-hero">
      <div className="tb-v2-container">
        <div className="tb-v2-hero-grid">
          <div>
            <div className="tb-v2-kicker">{toolCount} tools · 100% free · runs in your browser</div>
            <h1>
              The dev tools<br />
              you actually<br />
              <em>use every day.</em>
            </h1>
            <p className="tb-v2-hero-sub">
              JSON formatter, Base64, QR generator, word counter  -  rebuilt clean.
              No signup. No tracking. No server round-trips. Just paste and go.
            </p>
            <div className="tb-v2-hero-cta">
              <Link href="/tools" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg">
                Browse all tools <IconArrow style={{ width: 16, height: 16 }} />
              </Link>
              <Link href="/submit-tool" className="tb-v2-btn tb-v2-btn-lg">
                Submit Your Tool
              </Link>
            </div>
            <div className="tb-v2-hero-chips">
              <span className="tb-v2-chip"><IconShield /> Privacy-first</span>
              <span className="tb-v2-chip"><IconZap /> No signup</span>
              <span className="tb-v2-chip"><IconGift /> No tracking</span>
            </div>
          </div>
          <div>
            <HeroToy />
            <div className="tb-v2-hero-note">
              <span>Try it. Any tab is a real working tool.</span>
              <span>3 of {toolCount} shown</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
