import type { Metadata } from 'next';
import MagicLinkConsume from './MagicLinkConsume';

export const metadata: Metadata = {
  title: 'Sign In | Toolblip',
  robots: { index: false, follow: false },
};

export default function MagicLinkPage() {
  return <MagicLinkConsume />;
}
