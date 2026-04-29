'use client';

interface HowItWorksStripProps {
  toolCount: number;
  categoryCount: number;
}

export default function HowItWorksStrip({ toolCount, categoryCount }: HowItWorksStripProps) {
  return (
    <section style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)' }}>
      <div className="tb-v2-container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 0,
          padding: '0',
        }}>
          {/* Step 1 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '20px 24px 20px 0',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--red-tint)', color: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontSize: 20,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Pick a tool</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>{toolCount} tools across {categoryCount} categories</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 12px',
          }}>
            <div style={{
              width: 1, height: 40, background: 'var(--line-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <svg style={{ color: 'var(--fg-3)', position: 'absolute' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '20px 12px',
            borderLeft: '1px solid var(--line)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--blue-tint)', color: 'var(--c-dev)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Paste your data</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>Nothing leaves your browser</div>
            </div>
          </div>

          {/* Divider 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px 12px',
          }}>
            <div style={{
              width: 1, height: 40, background: 'var(--line-2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              <svg style={{ color: 'var(--fg-3)', position: 'absolute' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            padding: '20px 0 20px 24px',
            borderLeft: '1px solid var(--line)',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              background: 'var(--green-tint)', color: '#1e6b42',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Get your result</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>Copy or download instantly</div>
            </div>
          </div>
        </div>

        {/* Privacy tagline */}
        <div style={{
          textAlign: 'center',
          padding: '10px 0 4px',
          borderTop: '1px solid var(--line)',
          marginTop: 4,
        }}>
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--green)',
            background: 'var(--green-tint)',
            padding: '3px 10px',
            borderRadius: 999,
            letterSpacing: '0.01em',
          }}>
            🔒 100% private — no servers, no uploads, nothing leaves your browser
          </span>
        </div>
      </div>
    </section>
  );
}
