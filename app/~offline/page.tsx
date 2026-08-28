import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Offline | Toolblip',
  description: 'You are offline. Open a cached Toolblip page or reconnect.',
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <main className="tb-v2-blog">
      <div className="tb-v2-container" style={{ paddingTop: 64, paddingBottom: 96, maxWidth: 560 }}>
        <div className="tb-v2-kicker">Offline</div>
        <h1 className="tb-v2-page-title">You&apos;re offline</h1>
        <p className="tb-v2-page-sub">
          This page isn&apos;t in your offline cache yet. Reconnect, or open a tool you&apos;ve
          already visited — those stay available without a network.
        </p>
        <div className="tb-v2-hero-cta" style={{ marginTop: 28 }}>
          <Link href="/" className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-lg">
            Home
          </Link>
          <Link href="/tools" className="tb-v2-btn tb-v2-btn-lg">
            All tools
          </Link>
        </div>
      </div>
    </main>
  );
}
