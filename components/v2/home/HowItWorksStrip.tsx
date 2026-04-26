export default function HowItWorksStrip() {
  return (
    <section
      style={{
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface-2)',
      }}
    >
      <div className="tb-v2-container" style={{ padding: '28px 28px 20px' }}>
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
              desc: 'Browse 80+ free browser-based tools by category.',
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
            <div key={i} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 160 }}>
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
    </section>
  );
}
