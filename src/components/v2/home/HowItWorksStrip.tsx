'use client';

export default function HowItWorksStrip() {
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
            padding: '18px 24px 18px 0',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--red-tint)', color: 'var(--red)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg className="tb-v2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="8" height="8" rx="2" />
                <rect x="13" y="3" width="8" height="8" rx="2" />
                <rect x="3" y="13" width="8" height="8" rx="2" />
                <rect x="13" y="13" width="8" height="8" rx="2" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Pick a tool</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>Browse {39} tools across 7 categories</div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '18px 12px',
          }}>
            <div style={{
              width: 1, height: 36, background: 'var(--line-2)',
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
            padding: '18px 12px',
            borderLeft: '1px solid var(--line)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--blue-tint)', color: 'var(--c-dev)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg className="tb-v2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Paste your data</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>Type or paste — nothing leaves your browser</div>
            </div>
          </div>

          {/* Divider 2 */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '18px 12px',
          }}>
            <div style={{
              width: 1, height: 36, background: 'var(--line-2)',
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
            padding: '18px 0 18px 24px',
            borderLeft: '1px solid var(--line)',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: 'var(--green-tint)', color: '#1e6b42',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <svg className="tb-v2-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-0)', letterSpacing: '-0.01em' }}>Get your result</div>
              <div style={{ fontSize: 12.5, color: 'var(--fg-2)', marginTop: 2 }}>Copy or download instantly</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
