import { IconDev, IconCode, IconZap } from '@/components/v2/icons';

export default function HowItWorksStrip() {
  return (
    <section className="tb-v2-band" style={{ borderBottom: '1px solid var(--border-1)' }}>
      <div className="tb-v2-container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <Step icon={<IconDev width={18} height={18} />} label="Pick a tool" />
          <Arrow />
          <Step icon={<IconCode width={18} height={18} />} label="Paste your data" />
          <Arrow />
          <Step icon={<IconZap width={18} height={18} />} label="Get your result" />
          <Divider />
          <span style={{ fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>
            No servers. No uploads. Nothing leaves your browser.
          </span>
        </div>
      </div>
    </section>
  );
}

function Step({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ color: 'var(--accent)', display: 'flex', alignItems: 'center' }}>{icon}</span>
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden style={{ color: 'var(--border-2)', flexShrink: 0 }}>
      <path d="M7 4l6 6-6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Divider() {
  return (
    <div style={{ width: 1, height: 20, background: 'var(--border-1)', margin: '0 4px' }} aria-hidden />
  );
}
