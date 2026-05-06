import type { Metadata } from 'next';
import { DirectoryClient } from './DirectoryClient';

export const metadata: Metadata = {
  title: 'All Tools — Free Browser-Based Utilities | Toolblip',
  description:
    'Browse all free browser-based tools. Text editors, encoders, developers utilities, QR generators, and more. No sign-up, no ads, instant results.',
};

export default function DirectoryPage() {
  return <DirectoryClient />;
}
