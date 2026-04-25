import Link from 'next/link';
import HeroToy from './HeroToy';
import { IconArrow, IconShield, IconZap, IconGift } from '@/components/v2/icons';

export default function Hero({ toolCount }: { toolCount: number }) {
  return (
    <section className="tb-v2-hero">
      <div className="tb-v2-container">
        <div className="tb-v2-hero-grid">
          <div>
            <div className="tb-v2-kicker">{toolCount} tools · free · in your browser</div>
            <h1>
              A drawer of<br />
              sharp little<br />
              <em>instruments.</em>
            </h1>
            <p className="tb-v2-hero-sub">
              JSON formatters, QR generators, image resizers, regex testers - the
              everyday utilities, rebuilt without the ads, dark patterns, or
              upload-your-file-to-our-server routine.
            </p>
            <div className="tb-v2-hero-cta">
              <Link href="/directory" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg">
                Browse all tools <IconArrow style={{ width: 16, height: 16 }} />
              </Link>
              <a href="/submit-tool" className="tb-v2-btn tb-v2-btn-lg">
                Submit Your Tool
              </a>
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
