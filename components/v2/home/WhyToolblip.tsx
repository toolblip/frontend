import { IconShield, IconZap, IconGift } from '@/components/v2/icons';

const BENEFITS = [
  {
    icon: IconShield,
    emoji: '🔒',
    title: 'Private',
    headline: 'Nothing leaves your browser.',
    desc: 'All processing happens locally in your tab. No servers, no uploads, no logs — your data never leaves your machine.',
  },
  {
    icon: IconZap,
    emoji: '⚡',
    title: 'Fast',
    headline: 'Instant results, zero waiting.',
    desc: "Runs entirely in your browser. No cold starts, no network round-trips, no queues. Your tab is already the server.",
  },
  {
    icon: IconGift,
    emoji: '💚',
    title: 'Free',
    headline: 'No signup. No paywall.',
    desc: 'Every tool is free, always. No "unlock export" prompts, no credit card, no monthly subscription. Just open and go.',
  },
];

export default function WhyToolblip() {
  return (
    <section className="why-section">
      <div className="tb-v2-container">
        <div className="why-header">
          <p className="why-kicker">Why Toolblip?</p>
          <h2 className="why-headline">
            The tool drawer you&apos;ll <em>actually</em> keep open.
          </h2>
        </div>
        <div className="why-grid">
          {BENEFITS.map(({ icon: Icon, emoji, title, headline, desc }) => (
            <div key={title} className="why-card">
              <div className="why-card-top">
                <span className="why-emoji">{emoji}</span>
                <span className="why-icon">
                  <Icon width={20} height={20} />
                </span>
              </div>
              <div className="why-title">{title}</div>
              <div className="why-headline-text">{headline}</div>
              <div className="why-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
