'use client';

const BENEFITS = [
  {
    emoji: '🔒',
    title: '100% Private',
    desc: 'Your data never leaves your browser. No servers, no uploads, no tracking — not even we can see what you\'re doing.',
    tint: 'var(--green-tint)',
    color: '#1e6b42',
    bg: '#d6f0df',
  },
  {
    emoji: '⚡',
    title: 'Instantly Fast',
    desc: 'Runs entirely in your browser tab. No API calls, no loading spinners, no rate limits. Just paste and go.',
    tint: 'var(--amber-tint)',
    color: '#7a4e00',
    bg: '#fff0c9',
  },
  {
    emoji: '🆓',
    title: 'Always Free',
    desc: 'No signup, no paywall, no usage limits. Every tool is free, forever. Built and maintained by a small team.',
    tint: 'var(--blue-tint)',
    color: '#1d3fa0',
    bg: '#e7ecff',
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
              Better than a download.
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
                gap: 14,
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
                fontSize: 24,
              }}>
                {b.emoji}
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--f-display)',
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  color: 'var(--fg-0)',
                  marginBottom: 8,
                }}>
                  {b.title}
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
