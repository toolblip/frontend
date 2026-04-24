import { IconDev, IconCode, IconZap } from '@/components/v2/icons';

const STEPS = [
  { icon: <IconDev width={18} height={18} />, label: 'Pick a tool' },
  { icon: <IconCode width={18} height={18} />, label: 'Paste your data' },
  { icon: <IconZap width={18} height={18} />, label: 'Get your result' },
];

export default function HowItWorksStrip() {
  return (
    <section className="hiw-strip">
      <div className="tb-v2-container hiw-container">
        <div className="hiw-inner">
          {STEPS.map((step, i) => (
            <Step key={step.label} icon={step.icon} label={step.label} number={i + 1} />
          ))}
          <Divider />
          <span className="hiw-note">
            🔒 No servers. No uploads. Nothing leaves your browser.
          </span>
        </div>
      </div>
    </section>
  );
}

function Step({
  icon,
  label,
  number,
}: {
  icon: React.ReactNode;
  label: string;
  number: number;
}) {
  return (
    <div className="hiw-step">
      <span className="hiw-num">{number}</span>
      <span className="hiw-icon">{icon}</span>
      <span className="hiw-label">{label}</span>
    </div>
  );
}

function Divider() {
  return (
    <div className="hiw-div">
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        className="hiw-arrow"
      >
        <path
          d="M5 3l6 5-6 5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
