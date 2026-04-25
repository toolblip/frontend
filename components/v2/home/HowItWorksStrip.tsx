import { IconDev, IconCode, IconZap } from '@/components/v2/icons';

const STEPS = [
  {
    num: 1,
    icon: <IconDev width={20} height={20} />,
    label: 'Pick a tool',
  },
  {
    num: 2,
    icon: <IconCode width={20} height={20} />,
    label: 'Paste your data',
  },
  {
    num: 3,
    icon: <IconZap width={20} height={20} />,
    label: 'Get your result',
  },
];

export default function HowItWorksStrip() {
  return (
    <section className="hiw-strip">
      <div className="tb-v2-container hiw-container">
        <div className="hiw-inner">
          {STEPS.map((step, i) => (
            <div key={step.num} className="hiw-step-group">
              <div className="hiw-step">
                <span className="hiw-num">{step.num}</span>
                <span className="hiw-icon">{step.icon}</span>
                <span className="hiw-label">{step.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <span className="hiw-arrow" aria-hidden>→</span>
              )}
            </div>
          ))}
          <div className="hiw-divider" />
          <span className="hiw-note">
            🔒 No servers. No uploads. Nothing leaves your browser.
          </span>
        </div>
      </div>
    </section>
  );
}
