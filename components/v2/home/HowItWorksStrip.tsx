import { IconDev, IconCode, IconZap } from '@/components/v2/icons';

const STEPS = [
  { icon: <IconDev width={18} height={18} />, label: 'Pick a tool' },
  { icon: <IconCode width={18} height={18} />, label: 'Paste your data' },
  { icon: <IconZap width={18} height={18} />, label: 'Get your result' },
];

export default function HowItWorksStrip() {
  return (
    <section style={{ borderBottom: '1px solid var(--border-1)', background: 'var(--bg-2)' }}>
      <div className="tb-v2-container" style={{ paddingTop: 20, paddingBottom: 20 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          {STEPS.map((step, i) => (
            <Step key={step.label} icon={step.icon} label={step.label} number={i + 1} />
          ))}
          <Divider />
          <span
            style={{
              fontSize: 13,
              color: 'var(--fg-3)',
              textAlign: 'center',
              fontStyle: 'italic',
            }}
          >
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
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'var(--bg-3)',
        border: '1px solid var(--border-1)',
        borderRadius: 8,
        padding: '8px 14px',
      }}
    >
      <span
        style={{
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: 'var(--accent)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 11,
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {number}
      </span>
      <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>
        {icon}
      </span>
      <span
        style={{
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--fg-1)',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        color: 'var(--border-2)',
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        aria-hidden
        style={{ color: 'var(--border-2)', flexShrink: 0 }}
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
