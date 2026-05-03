interface Props {
  toolCount: number;
  categoryCount: number;
}

export default function HowItWorksStrip({ toolCount, categoryCount }: Props) {
  return (
    <section
      style={{
        borderTop: '1px solid var(--line)',
        borderBottom: '1px solid var(--line)',
        background: 'var(--surface-2)',
      }}
    >
      <div className="tb-v2-container" style={{ padding: '28px 28px 22px' }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div className="tb-v2-kicker">How it works</div>
          <h2 style={{ fontSize: 19, fontWeight: 700, margin: '4px 0 0', letterSpacing: '-0.3px' }}>
            Pick a tool &rarr; Paste your data &rarr; Get your result
          </h2>
        </div>

        {/* Steps */}
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
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
                </svg>
              ),
              color: 'var(--blue, #2563eb)',
              bg: 'var(--blue-tint, #dbeafe)',
              title: 'Pick a tool',
              desc: `${toolCount} tools across ${categoryCount} categories — JSON, Base64, images, text and more.`,
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                </svg>
              ),
              color: 'var(--green, #16a34a)',
              bg: 'var(--green-tint, #dcfce7)',
              title: 'Paste your data',
              desc: 'Your clipboard, your browser tab. Nothing ever leaves it.',
            },
            {
              icon: (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ),
              color: 'var(--purple-tint, #7c3aed)',
              bg: 'var(--purple-tint, #ebe0ff)',
              title: 'Get your result',
              desc: 'Instantly. Copy it and move on — no server round-trips.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`hiw-step hiw-step-${i}`}
              style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 170 }}
            >
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
                  padding: '10px 16px',
                  gap: 10,
                  flex: '1 1 0',
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: item.bg,
                    color: item.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'transform 0.18s, box-shadow 0.18s',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  }}
                  className="hiw-icon"
                >
                  {item.icon}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14.5, marginBottom: 4, color: 'var(--fg-0)' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--fg-2)', lineHeight: 1.5 }}>
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
            marginTop: 18,
            paddingTop: 16,
            borderTop: '1px solid var(--border, var(--line))',
          }}
        >
          <a
            href="/privacy"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 16px',
              borderRadius: 999,
              background: 'var(--green-tint, #dcfce7)',
              color: 'var(--green, #16a34a)',
              fontSize: 13,
              fontWeight: 600,
              textDecoration: 'none',
              transition: 'box-shadow 0.18s, transform 0.18s',
            }}
            className="privacy-badge"
          >
            <svg
              width="14"
              height="14"
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
          </a>
        </div>
      </div>
      <style>{`
        .hiw-step {
          animation: hiw-step-in 0.45s ease-out both;
        }
        .hiw-step-1 { animation-delay: 0.1s; }
        .hiw-step-2 { animation-delay: 0.2s; }

        @keyframes hiw-step-in {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .hiw-icon {
          animation: hiw-icon-in 0.5s ease-out both;
        }
        .hiw-step-1 .hiw-icon { animation-delay: 0.12s; }
        .hiw-step-2 .hiw-icon { animation-delay: 0.24s; }

        @keyframes hiw-icon-in {
          from { opacity: 0; transform: scale(0.75) rotate(-6deg); }
          to   { opacity: 1; transform: scale(1) rotate(0deg); }
        }

        .hiw-icon:hover {
          transform: scale(1.12) rotate(-3deg);
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .privacy-badge {
          animation: privacy-pulse 4s ease-in-out infinite;
        }
        .privacy-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(22, 163, 74, 0.18);
        }

        @keyframes privacy-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22, 197, 94, 0.18); }
          50%       { box-shadow: 0 0 0 6px rgba(22, 197, 94, 0); }
        }
      `}</style>
    </section>
  );
}
