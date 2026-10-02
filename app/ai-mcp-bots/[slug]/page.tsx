import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { aiMcpItemBySlug, aiMcpItems } from '@/data/ai-mcp-menu';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return aiMcpItems().map((entry) => ({ slug: entry.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = aiMcpItemBySlug(slug);
  if (!entry) return {};

  const title = `${entry.label} | Toolblip`;
  const canonical = `https://toolblip.com/ai-mcp-bots/${entry.slug}`;

  return {
    title,
    description: entry.desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: entry.desc,
      url: canonical,
      siteName: 'Toolblip',
      type: 'website',
      locale: 'en_US',
      images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
    },
    twitter: {
      card: 'summary',
      title,
      description: entry.desc,
    },
  };
}

export default async function AiMcpItemPage({ params }: PageProps) {
  const { slug } = await params;
  const entry = aiMcpItemBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">{entry.group}</div>
          <h1 className="tb-v2-page-title">{entry.label}</h1>
          <div className="tb-v2-article-section">
            <p>{entry.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
