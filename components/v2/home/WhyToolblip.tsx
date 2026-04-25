const BENEFITS = [
  {
    emoji: '🔒',
    title: 'Private',
    headline: 'Nothing leaves your browser.',
    desc: 'All processing happens locally in your tab. No servers, no uploads, no logs — your data never leaves your machine.',
    accent: '#ef4444',
  },
  {
    emoji: '⚡',
    title: 'Fast',
    headline: 'Instant results, zero waiting.',
    desc: "Runs entirely in your browser. No cold starts, no network round-trips, no queues. Your tab is already the server.",
    accent: '#f59e0b',
  },
  {
    emoji: '💚',
    title: 'Free',
    headline: 'No signup. No paywall.',
    desc: 'Every tool is free, always. No "unlock export" prompts, no credit card, no monthly subscription. Just open and go.',
    accent: '#22c55e',
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
          {BENEFITS.map(({ emoji, title, headline, desc, accent }) => (
            <div
              key={title}
              className="why-card"
              style={{ '--why-accent': accent } as React.CSSProperties}
            >
              <div className="why-card-top">
                <span className="why-emoji">{emoji}</span>
                <span className="why-accent-bar" />
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
