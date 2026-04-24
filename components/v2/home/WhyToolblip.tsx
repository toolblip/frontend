import { IconShield, IconZap, IconGift } from '@/components/v2/icons';

const BENEFITS = [
  {
    icon: IconShield,
    title: 'Private',
    desc: 'Your data never leaves your browser. Nothing is uploaded, stored, or logged — ever.',
  },
  {
    icon: IconZap,
    title: 'Fast',
    desc: 'Runs instantly in your tab. No servers to cold-start, no network round-trips, no waiting.',
  },
  {
    icon: IconGift,
    title: 'Free',
    desc: 'No signup, no paywall, no "unlock export" prompts. Every tool is free, always.',
  },
];

export default function WhyToolblip() {
  return (
    <section style={{ padding: '40px 0', borderBottom: '1px solid var(--border-1)' }}>
      <div className="tb-v2-container">
        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--accent)',
            marginBottom: 24,
          }}
        >
          Why Toolblip?
        </p>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
          }}
        >
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                padding: '24px 28px',
                borderRadius: 12,
                border: '1px solid var(--border-1)',
                background: 'var(--bg-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span style={{ color: 'var(--accent)', display: 'flex' }}>
                <Icon width={22} height={22} />
              </span>
              <div style={{ fontWeight: 700, fontSize: 16, color: 'var(--fg-1)' }}>
                {title}
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                {desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
