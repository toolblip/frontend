const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: 'var(--green)',
    bg: 'var(--green-tint)',
    title: 'Private',
    desc: 'Everything runs locally in your browser. Your data never touches our servers — or anyone else\'s.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: 'var(--amber)',
    bg: 'var(--amber-tint)',
    title: 'Fast',
    desc: 'No network requests, no waiting on servers. Results appear instantly in your browser tab.',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    color: 'var(--blue)',
    bg: 'var(--blue-tint)',
    title: 'Free',
    desc: 'No signup, no paywall, no usage limits. Every tool is free, forever. No account needed.',
  },
];

export default function WhyToolblip() {
  return (
    <section style={{ padding: '40px 0 32px' }}>
      <div className="tb-v2-container">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="tb-v2-kicker">Why Toolblip?</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: '4px 0 0',
              letterSpacing: '-0.3px',
            }}
          >
            The smarter tool choice
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {benefits.map((b) => (
            <div
              key={b.title}
              className="why-card"
              style={{
                padding: '20px',
                borderRadius: 10,
                border: '1px solid var(--border)',
                background: 'var(--surface-1)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                transition: 'box-shadow 0.15s, transform 0.15s',
              }}
            >
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: b.bg,
                  color: b.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {b.icon}
              </div>
              <div>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 5,
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--fg-2)',
                    lineHeight: 1.5,
                  }}
                >
                  {b.desc}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .why-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.08);
          transform: translateY(-2px);
        }
        [data-theme="dark"] .why-card:hover {
          box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        }
      `}</style>
    </section>
  );
}
</parameter>
