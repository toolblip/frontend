import type { Metadata } from 'next';
import ToolsClient from './ToolsClient';

export const metadata: Metadata = {
  title: 'All Tools',
  description:
    'Browse all free browser-based developer tools on Toolblip. Word counter, JSON formatter, Base64 encoder, and more. 100% client-side, nothing leaves your browser.',
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Are these tools really free?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes, all tools on Toolblip are completely free to use. No account needed, no data is collected.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is my data safe?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All tools run 100% client-side in your browser. Nothing is sent to any server.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do I need to install anything?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'No. All tools work directly in your browser. No browser extensions or downloads required.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can I use Toolblip on mobile?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. All tools are fully responsive and work on mobile browsers.',
      },
    },
  ],
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <ToolsClient />
    </>
  );
}
