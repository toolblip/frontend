import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';

const TITLE = 'Free Online Developer Tools | Toolblip';
const DESCRIPTION =
  'Browse all free browser-based developer tools on Toolblip. JSON formatter, Base64 encoder, UUID generator, color picker, and more.';

// ?category= / ?search= are applied client-side so the listing prerenders
// once and is served from cache instead of rendering on every request.
export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: 'https://toolblip.com/tools' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: 'https://toolblip.com/tools',
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip Tools' }],
  },
  twitter: { card: 'summary', title: TITLE, description: DESCRIPTION },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
