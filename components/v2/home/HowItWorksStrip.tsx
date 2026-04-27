interface Props {
  toolCount: number;
  categoryCount: number;
}

export default function HowItWorksStrip({ toolCount, categoryCount }: Props) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-2)',
      }}
    >
      <div className="tb-v2-container" style={{ padding: '20px 28px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div className="tb-v2-kicker">How it works</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
            Three steps. Zero friction.
          </h2>
        </div>
        {/* Steps row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            gap: 0,
            flexWrap: 'wrap',
          }}
        >
          {[
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
              ),
              color: 'var(--green)',
              bg: 'var(--green-tint)',
              title: 'Pick a tool',
              desc: `Browse ${toolCount}+ free browser-based tools across ${categoryCount} categories.`,
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              ),
              color: 'var(--blue)',
              bg: 'var(--blue-tint)',
              title: 'Paste your data',
              desc: 'Type or paste — nothing is ever sent to a server.',
            },
            {
              icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ),
              color: 'var(--purple)',
              bg: 'var(--purple-tint)',
              title: 'Get your result',
              desc: 'Copy the output instantly. Done in seconds.',
            },
          ].map((item, i) => (
            <div key={i} className={`hiw-step hiw-step-${i}`} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 160 }}>
              {i > 0 && (
                <div
                  style={{
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 8px',
                    color: 'var(--fg-3)',
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  padding: '8px 16px',
                  gap: 8,
                  flex: '1 1 0',
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--fg-2)', lineHeight: 1.45 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Privacy badge */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 16,
            paddingTop: 14,
            borderTop: '1px solid var(--border)',
          }}
        >
          <div
            className="privacy-badge"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '5px 14px',
              borderRadius: 999,
              background: 'var(--green-tint)',
              color: 'var(--green)',
              fontSize: 12.5,
              fontWeight: 600,
            }}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ flexShrink: 0 }}
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            No servers &nbsp;&middot;&nbsp; No uploads &nbsp;&middot;&nbsp; Nothing leaves your browser &mdash; ever.
          </div>
        </div>
      </div>
      <style>{`
        .hiw-step {
          animation: hiw-step-in 0.45s ease-out both;
        }
        .hiw-step-1 { animation-delay: 0.1s; }
        .hiw-step-2 { animation-delay: 0.2s; }

        @keyframes hiw-step-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        @keyframes privacy-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 197, 94, 0.2); }
          50%       { box-shadow: 0 0 0 5px rgba(34, 197, 94, 0); }
        }
        .privacy-badge {
          animation: privacy-pulse 3.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
