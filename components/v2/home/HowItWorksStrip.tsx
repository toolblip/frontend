import { IconDev, IconCode, IconZap } from '@/components/v2/icons';

const STEPS = [
  {
    num: 1,
    icon: <IconDev width={18} height={18} />,
    label: 'Pick a tool',
    sub: 'From 11 categories',
  },
  {
    num: 2,
    icon: <IconCode width={18} height={18} />,
    label: 'Paste your data',
    sub: 'Nothing uploaded',
  },
  {
    num: 3,
    icon: <IconZap width={18} height={18} />,
    label: 'Get your result',
    sub: 'Instantly',
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
                <div className="hiw-text">
                  <span className="hiw-label">{step.label}</span>
                  <span className="hiw-sub">{step.sub}</span>
                </div>
              </div>
              {i < STEPS.length - 1 && (
                <span className="hiw-arrow" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </span>
              )}
            </div>
          ))}
          <div className="hiw-divider" />
          <span className="hiw-note">
            🔒 No servers &middot; No uploads &middot; Nothing leaves your browser
          </span>
        </div>
      </div>
    </section>
  );
}
