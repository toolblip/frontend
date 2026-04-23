import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tools | Toolblip',
  description: 'Browse all developer tools on Toolblip.',
  openGraph: {
    title: 'Tools | Toolblip',
    description: 'Browse all developer tools on Toolblip.',
    url: 'https://toolblip.com/tools',
    siteName: 'Toolblip',
  },
  twitter: { card: 'summary', title: 'Tools | Toolblip', description: 'Browse all developer tools on Toolblip.' },
};

export default function ToolsPage() {
  redirect('/directory');
}
