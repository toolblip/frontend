import Link from 'next/link';
import dynamic from 'next/dynamic';
import type { Metadata } from 'next';

const ImageFormatConverterClient = dynamic(
  () => import('@/components/tools/ImageFormatConverterClient'),
  { ssr: false },
);

export const toolMeta = {
  name: 'Image Format Converter',
  description:
    'Convert images between JPEG, PNG, WebP, AVIF, and GIF formats directly in your browser. Adjust quality, preview before and after, and download the result — no uploads, no servers.',
  category: 'conversion',
};

const canonicalUrl = `https://toolblip.com/tools/image-format-converter/`;

export const metadata: Metadata = {
  title: `${toolMeta.name} | Toolblip`,
  description: toolMeta.description,
  alternates: { canonical: canonicalUrl },
  openGraph: {
    title: toolMeta.name,
    description: toolMeta.description,
    images: [{ url: 'https://toolblip.com/og-default.png' }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@HarunRRayhan',
  },
};

export default function ImageFormatConverterPage() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="border-b border-gray-800 bg-gray-900/40">
        <div className="max-w-4xl mx-auto px-4 py-2 text-sm text-gray-500 flex gap-2">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-gray-300 transition-colors">
            Tools
          </Link>
          <span>/</span>
          <span className="text-gray-400">{toolMeta.name}</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🖼️</span>
            <h1 className="text-2xl font-bold text-white">{toolMeta.name}</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            {toolMeta.category}
          </span>
        </div>

        <section
          aria-label="Image Format Converter Tool"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
        >
          <ImageFormatConverterClient />
        </section>

        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your images never leave your browser
        </p>
      </div>
    </>
  );
}
