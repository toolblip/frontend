import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ComparisonPage from '@/components/v2/comparison/ComparisonPage';
import { comparisonPages, getComparisonPage } from '@/data/comparisons';

export function generateStaticParams() {
  return comparisonPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = getComparisonPage(slug);

  if (!page) {
    return {
      title: 'Comparison not found',
    };
  }

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: `https://toolblip.com/compare/${page.slug}`,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `https://toolblip.com/compare/${page.slug}`,
      siteName: 'Toolblip',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: page.title,
      description: page.description,
    },
  };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getComparisonPage(slug);

  if (!page) notFound();

  return <ComparisonPage page={page} />;
}
