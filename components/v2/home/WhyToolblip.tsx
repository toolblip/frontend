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
    <section className="tb-v2-band tb-v2-band-sm">
      <div className="tb-v2-container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              style={{
                padding: '20px 24px',
                borderRadius: 12,
                border: '1px solid var(--border-1)',
                background: 'var(--bg-2)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <span style={{ color: 'var(--accent)', display: 'flex' }}>
                <Icon width={20} height={20} />
              </span>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--fg-1)' }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--fg-2)', lineHeight: 1.55 }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
