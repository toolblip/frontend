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
    <section className="why-section">
      <div className="tb-v2-container">
        <p className="why-kicker">Why Toolblip?</p>
        <div className="why-grid">
          {BENEFITS.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="why-card">
              <span className="why-icon">
                <Icon width={22} height={22} />
              </span>
              <div className="why-title">{title}</div>
              <div className="why-desc">{desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
