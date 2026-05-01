'use client';

interface HowItWorksStripProps {
  toolCount: number;
  categoryCount: number;
}

const STEPS = [
  {
    num: '1',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
    bg: 'var(--red-tint)',
    color: 'var(--red)',
    title: 'Pick a tool',
    desc: 'Browse or search — there\'s no signup, no paywall.',
  },
  {
    num: '2',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    bg: 'var(--blue-tint)',
    color: 'var(--c-dev)',
    title: 'Paste your data',
    desc: 'Nothing uploaded. Nothing sent.',
  },
  {
    num: '3',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    bg: 'var(--green-tint)',
    color: '#1e6b42',
    title: 'Get your result',
    desc: 'Copy or download. Instantly.',
  },
];

export default function HowItWorksStrip({ toolCount, categoryCount }: HowItWorksStripProps) {
  return (
    <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="tb-v2-container">
        {/* Header row */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px 0 0',
          gap: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: 'var(--fg-0)',
              color: 'var(--surface)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.02em',
              flexShrink: 0,
            }}>
              ⚡
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg-2)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {toolCount} tools · {categoryCount} categories
            </span>
          </div>

          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--green)',
            background: 'var(--green-tint)',
            padding: '4px 12px',
            borderRadius: 999,
            letterSpacing: '0.01em',
            whiteSpace: 'nowrap',
          }}>
            🔒 Nothing leaves your browser
          </span>
        </div>

        {/* Steps */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          padding: '16px 0 20px',
        }}>
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px 20px',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                position: 'relative',
                transition: 'transform .15s, box-shadow .15s',
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-2px)';
                el.style.boxShadow = '0 6px 20px -6px rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = 'none';
              }}
            >
              {/* Number badge */}
              <div style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                background: step.bg,
                color: step.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 800,
                flexShrink: 0,
                fontFamily: 'var(--f-mono)',
              }}>
                {step.num}
              </div>

              {/* Icon */}
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: step.bg,
                color: step.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {step.icon}
              </div>

              {/* Text */}
              <div>
                <div style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: 'var(--fg-0)',
                  letterSpacing: '-0.01em',
                }}>
                  {step.title}
                </div>
                <div style={{
                  fontSize: 12,
                  color: 'var(--fg-2)',
                  marginTop: 1,
                  lineHeight: 1.4,
                }}>
                  {step.desc}
                </div>
              </div>

              {/* Arrow connector */}
              {i < STEPS.length - 1 && (
                <div style={{
                  position: 'absolute',
                  right: -14,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1,
                  color: 'var(--fg-3)',
                  pointerEvents: 'none',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
