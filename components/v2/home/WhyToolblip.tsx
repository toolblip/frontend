const benefits = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    color: '#16a34a',
    bg: '#dcfce7',
    title: 'Private',
    desc: 'Data never leaves your browser. Nothing is sent to any server — ever.',
    glow: 'rgba(22, 163, 74, 0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    color: '#d97706',
    bg: '#fef3c7',
    title: 'Fast',
    desc: 'No server round-trips. No loading spinners. Results appear the moment you finish typing.',
    glow: 'rgba(217, 119, 6, 0.15)',
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 12 20 22 4 22 4 12" />
        <rect x="2" y="7" width="20" height="5" />
        <line x1="12" y1="22" x2="12" y2="7" />
        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
      </svg>
    ),
    color: '#2563eb',
    bg: '#dbeafe',
    title: 'Free',
    desc: 'No signup. No paywall. No usage limits. Every tool is free, always.',
    glow: 'rgba(37, 99, 235, 0.15)',
  },
];

export default function WhyToolblip() {
  return (
    <section style={{ padding: '44px 0 36px' }}>
      <div className="tb-v2-container">
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div className="tb-v2-kicker">Why Toolblip?</div>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: '4px 0 0',
              letterSpacing: '-0.3px',
              color: 'var(--fg-0)',
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
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="why-card"
              style={{
                padding: '22px',
                borderRadius: 12,
                border: '1px solid var(--line)',
                background: 'var(--surface)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                transition: 'box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow blob */}
              <div
                style={{
                  position: 'absolute',
                  top: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  background: b.glow,
                  filter: 'blur(20px)',
                  opacity: 0.7,
                  pointerEvents: 'none',
                  transition: 'opacity 0.18s',
                }}
                className="why-glow"
              />
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: b.bg,
                  color: b.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  zIndex: 1,
                  transition: 'transform 0.18s ease',
                }}
                className="why-icon"
              >
                {b.icon}
              </div>
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 15,
                    marginBottom: 5,
                    color: 'var(--fg-0)',
                  }}
                >
                  {b.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: 'var(--fg-2)',
                    lineHeight: 1.55,
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
        .why-card:nth-child(2) { animation-delay: 0.08s; }
        .why-card:nth-child(3) { animation-delay: 0.16s; }

        @keyframes why-card-in {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .why-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06);
          transform: translateY(-4px);
          border-color: var(--line-2);
        }
        [data-theme="dark"] .why-card:hover {
          box-shadow: 0 8px 32px rgba(0,0,0,0.45), 0 2px 8px rgba(0,0,0,0.3);
          border-color: var(--fg-3);
        }
        [data-theme="dark"] .why-card:hover .why-glow {
          opacity: 1;
        }
        .why-card:hover .why-icon {
          transform: scale(1.08) rotate(-2deg);
        }
        .why-card:hover .why-glow {
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
