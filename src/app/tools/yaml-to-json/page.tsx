import Link from 'next/link';
import dynamic from 'next/dynamic';

const YamlToJsonClient = dynamic(
  () => import('@/components/tools/YamlToJsonClient'),
  { ssr: false }
);

export const toolMeta = {
  name: 'YAML to JSON',
  description:
    'Convert YAML to JSON instantly in your browser. Supports pretty-print, compact output, and custom indent size. 100% client-side — nothing leaves your browser.',
  category: 'conversion',
};

export const metadata = {
  title: 'YAML to JSON Converter | Toolblip',
  description: toolMeta.description,
};

export default function YamlToJsonPage() {
  return (
    <>
      {/* Breadcrumb */}
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
          <span className="text-gray-300" aria-current="page">
            {toolMeta.name}
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🔄</span>
            <h1 className="text-2xl font-bold text-white">{toolMeta.name}</h1>
          </div>
          <p className="text-gray-400">{toolMeta.description}</p>
          <span className="inline-block mt-2 text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
            {toolMeta.category}
          </span>
        </div>

        {/* Tool */}
        <section
          aria-label="Tool"
          className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-8"
        >
          <YamlToJsonClient />
        </section>

        {/* Privacy note */}
        <p className="text-xs text-gray-600 text-center">
          🔒 100% client-side — your data never leaves your browser
        </p>
      </div>
    </>
  );
}
