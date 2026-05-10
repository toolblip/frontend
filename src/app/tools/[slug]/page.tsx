import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getToolBySlug, tools } from '../../../data/tools';
import ShareButtons from '../../../components/ShareButtons';
import { ToolUI } from './ToolUI';

interface ToolDetailPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map(tool => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: ToolDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    return {
      title: 'Tool Not Found | Toolblip',
      description: 'The requested Toolblip tool could not be found.',
      openGraph: {
        title: 'Tool Not Found | Toolblip',
        description: 'The requested Toolblip tool could not be found.',
        url: `https://toolblip.com/tools/${slug}`,
        siteName: 'Toolblip',
      },
      twitter: {
        card: 'summary',
        title: 'Tool Not Found | Toolblip',
        description: 'The requested Toolblip tool could not be found.',
      },
    };
  }

  const url = `https://toolblip.com/tools/${slug}`;

  return {
    title: `${tool.name} | Toolblip`,
    description: tool.description,
    keywords: tool.tags,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url,
      siteName: 'Toolblip',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-8 text-sm text-gray-500 dark:text-gray-400" aria-label="Breadcrumb">
        <a href="/" className="hover:text-green-600 dark:hover:text-green-400">
          Home
        </a>
        <span className="mx-2">/</span>
        <a href="/tools" className="hover:text-green-600 dark:hover:text-green-400">
          Tools
        </a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 dark:text-white">{tool.name}</span>
      </nav>

      <header className="mb-8">
        <div className="mb-4 flex items-start gap-4">
          <span className="text-5xl" aria-hidden="true">
            {tool.emoji}
          </span>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              {tool.name}
            </h1>
            <span className="mt-3 inline-flex rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-300">
              {tool.category}
            </span>
          </div>
        </div>
        <p className="max-w-3xl text-base leading-7 text-gray-600 dark:text-gray-300">
          {tool.description}
        </p>
        <div className="mt-5">
          <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
        </div>
      </header>

      <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-6">
        <ToolUI tool={tool} />
      </section>

      <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
        Runs in your browser — no upload required.
      </p>
    </main>
  );
}
