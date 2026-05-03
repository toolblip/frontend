'use client';

const benefits = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Private',
    desc: 'Data never leaves your browser. Nothing uploaded, nothing stored, nothing transmitted.',
    glow: 'rgba(22, 163, 74, 0.12)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: '#d97706',
    bg: '#fef3c7',
    title: 'Fast',
    desc: 'Runs instantly in your tab. No server round-trips, no loading spinners, no waiting around.',
    glow: 'rgba(217, 119, 6, 0.12)',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    color: '#2563eb',
    bg: '#dbeafe',
    title: 'Free',
    desc: 'No signup, no paywall. Every tool, every feature, every export — completely free forever.',
    glow: 'rgba(37, 99, 235, 0.12)',
  },
];

export default function WhyToolblip() {
  return (
    <section style={{ padding: '48px 0 40px' }}>
      <div className="tb-v2-container">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div className="tb-v2-kicker">Why Toolblip?</div>
          <h2
            style={{
              fontSize: 24,
              fontWeight: 700,
              margin: '4px 0 0',
              letterSpacing: '-0.4px',
              color: 'var(--fg-0)',
            }}
          >
            Simple tools that just work.
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 18,
          }}
        >
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="why-card"
              style={{
                padding: '24px 22px',
                borderRadius: 16,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Subtle glow blob */}
              <div
                style={{
                  position: 'absolute',
                  top: -20,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  background: b.glow,
                  filter: 'blur(24px)',
                  opacity: 0.6,
                  pointerEvents: 'none',
                }}
                className="why-glow"
              />

              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: b.bg,
                  color: b.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'transform 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
                className="why-icon"
              >
                {b.icon}
              </div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 16,
                    marginBottom: 6,
                    color: 'var(--fg-0)',
                    letterSpacing: '-0.2px',
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    fontSize: 13.5,
                    color: 'var(--fg-2)',
                    lineHeight: 1.6,
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
        .why-card {
          animation: why-card-in 0.5s ease-out both;
        }
        .why-card:nth-child(2) { animation-delay: 0.09s; }
        .why-card:nth-child(3) { animation-delay: 0.18s; }

        @keyframes why-card-in {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .why-card:hover {
          box-shadow: 0 10px 36px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05);
          transform: translateY(-5px);
          border-color: var(--line-2);
        }
        [data-theme="dark"] .why-card:hover {
          box-shadow: 0 10px 40px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3);
          border-color: var(--fg-3);
        }
        [data-theme="dark"] .why-card:hover .why-glow {
          opacity: 1;
        }
        .why-card:hover .why-icon {
          transform: scale(1.1) rotate(-3deg);
        }
        .why-card:hover .why-glow {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
