'use client';

const BENEFITS = [
  {
    title: '100% Private',
    tagline: 'Data never leaves your browser',
    desc: 'All processing happens locally in your tab. No servers, no uploads, no logs — not even we can see what you\'re working on.',
    tint: 'var(--green-tint)',
    color: '#1e6b42',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
  {
    title: 'Instantly Fast',
    tagline: 'No API calls, no loading spinners',
    desc: 'Everything runs client-side in your browser tab. Instant results, no round-trips, no rate limits — open and go.',
    tint: 'var(--amber-tint)',
    color: '#7a4e00',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: 'Always Free',
    tagline: 'No signup, no paywall, no limits',
    desc: 'Every tool is free, forever. No account needed, no credit card, no artificial caps — just open the tab and use it.',
    tint: 'var(--blue-tint)',
    color: '#1d3fa0',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

export default function WhyToolblip() {
  return (
    <section className="tb-v2-band" style={{ background: 'var(--surface-2)' }}>
      <div className="tb-v2-container">
        <div className="tb-v2-band-head" style={{ marginBottom: 40 }}>
          <div>
            <div className="tb-v2-kicker">Why Toolblip?</div>
            <h2 style={{
              fontFamily: 'var(--f-display)',
              fontWeight: 700,
              fontSize: 38,
              letterSpacing: '-0.025em',
              lineHeight: 1.05,
              margin: '10px 0 0',
              color: 'var(--fg-0)',
            }}>
              Tools without the tradeoffs.
            </h2>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              style={{
                padding: '28px',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'transform .15s, box-shadow .15s',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 8px 24px -8px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              <div style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: b.tint,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: b.color,
              }}>
                {b.icon}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--fg-0)',
                  marginBottom: 4,
                }}>
                  {b.title}
                </div>
                <div style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: b.color,
                  marginBottom: 10,
                  letterSpacing: '0.01em',
                }}>
                  {b.tagline}
                </div>
                <div style={{
                  fontSize: 14,
                  color: 'var(--fg-1)',
                  lineHeight: 1.6,
                }}>
                  {b.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
