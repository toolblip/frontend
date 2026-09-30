import { Activity, ArrowUpRight, Check, Terminal } from 'lucide-react';
import styles from './products.module.css';

type Tone = 'cloud' | 'agents' | 'monitor' | 'plugins' | 'shopify' | 'personal';
const captions: Record<Tone, string> = {
  cloud: 'Your cloud. Your workflow.', agents: 'Specialist agents. Shared context.',
  monitor: 'Visibility beyond the uptime check.', plugins: 'WooCommerce / WordPress / free plugins',
  shopify: 'Shopify / pixel tracking / e-commerce', personal: 'Engineering / consulting / writing',
};

export default function ProductArtwork({ tone, logo }: { tone: Tone; logo: string }) {
  return <div className={styles.visual} aria-hidden="true">
    {tone === 'cloud' ? <div className={styles.terminal}>
      <div className={styles.terminalHeader}><span><i /><i /><i /></span><span>your next deployment</span><Terminal size={12} /></div>
      <div className={styles.terminalBody}><small>~/my-next-big-thing</small><p><b>❯</b> deploy with cloudploy<span>▌</span></p><div><Check size={12} />Connected to your cloud</div><div><Check size={12} />Built for your workflow</div><footer><i />From prompt to production<ArrowUpRight size={12} /></footer></div>
    </div> : tone === 'agents' ? <>
      <span className={styles.connector} /><span className={`${styles.connector} ${styles.connectorTwo}`} /><span className={`${styles.connector} ${styles.connectorThree}`} />
      <span className={styles.hub}><img src={`/products/${logo}`} alt="" width={35} height={35} /></span>
      <span className={`${styles.chip} ${styles.editor}`}><b>⌘</b>Your editor</span><span className={`${styles.chip} ${styles.security}`}><i />Security review</span><span className={`${styles.chip} ${styles.reliability}`}><Activity size={14} />Reliability</span>
    </> : tone === 'monitor' ? <div className={styles.monitorDashboard}>
      <div className={styles.monitorHeader}><Activity size={17} />Inside your application<span>DEMO</span></div>
      {['Scheduled jobs', 'Queue workers', 'Agent runs'].map((label, row) => <div className={styles.monitorRow} key={label}><span>{label}</span><div className={styles.bars}>{Array.from({ length: 18 }, (_, index) => <i key={index} style={{ height: 8 + ((index * 7 + row * 13) % 22) }} />)}</div><Check size={12} /></div>)}
    </div> : <div className={styles.symbol}>
      <span className={styles.orbit} /><span className={styles.largeLogo}><img src={`/products/${logo}`} alt="" width={60} height={60} /></span>
      <span className={styles.platform}>{tone === 'plugins' ? 'Made for WooCommerce' : tone === 'shopify' ? 'Made for Shopify' : 'Notes from the work'}</span>
    </div>}
    <span className={styles.caption}>{captions[tone]}</span>
  </div>;
}
