import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tools } from '@/data/tools';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import ShareButtons from '@/components/ShareButtons';

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  'word-counter': WordCounterClient,
  'character-counter': CharacterCounterClient,
  'case-converter': CaseConverterClient,
  'base64': Base64Client,
  'url-encode': UrlEncodeClient,
  'json-formatter': JsonFormatterClient,
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);
  if (!tool) return {};
  return {
    title: `${tool.name} — Free Online Tool | Toolblip`,
    description: tool.description,
    openGraph: {
      title: `${tool.name} | Toolblip`,
      description: tool.description,
      url: `https://toolblip.com/tools/${slug}`,
      siteName: 'Toolblip',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `${tool.name} | Toolblip`,
      description: tool.description,
    },
  };
}

export default async function ToolDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const tool = tools.find((t) => t.slug === slug);

  if (!tool) notFound();

  const meta = getCategoryMeta(tool.category);
  const ToolComponent = TOOL_COMPONENTS[slug];

  return (
    <div className="tb-v2-shell">
      {/* ── Hero band ── */}
      <section
        style={{
          background: `linear-gradient(135deg, ${meta.bg} 0%, color-mix(in srgb, ${meta.bg} 60%, white) 100%)`,
          borderBottom: `1px solid color-mix(in srgb, ${meta.color} 20%, transparent)`,
        }}
      >
        <div className="tb-v2-container" style={{ paddingTop: 48, paddingBottom: 48 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 20, flexWrap: 'wrap' }}>
            {/* Emoji icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 16,
                background: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }}
            >
              {tool.emoji}
            </div>

            <div style={{ flex: 1, minWidth: 240 }}>
              {/* Category badge */}
              <div style={{ marginBottom: 10 }}>
                <span
                  style={{
                    display: 'inline-block',
                    padding: '3px 10px',
                    borderRadius: 999,
                    background: meta.bg,
                    color: meta.color,
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.03em',
                    textTransform: 'uppercase',
                  }}
                >
                  {tool.category}
                </span>
              </div>

              {/* Title */}
              <h1
                style={{
                  fontFamily: 'var(--f-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(28px, 5vw, 42px)',
                  letterSpacing: '-0.025em',
                  lineHeight: 1.1,
                  color: 'var(--fg-0)',
                  margin: '0 0 12px',
                }}
              >
                {tool.name}
              </h1>

              {/* Description */}
              <p
                style={{
                  fontSize: 16,
                  color: 'var(--fg-1)',
                  lineHeight: 1.6,
                  margin: 0,
                  maxWidth: 560,
                }}
              >
                {tool.description}
              </p>

              {/* Share buttons */}
              <div style={{ marginTop: 20 }}>
                <ShareButtons toolName={tool.name} toolSlug={tool.slug} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Tool UI ── */}
      <section style={{ padding: '40px 0 80px' }}>
        <div className="tb-v2-container">
          {ToolComponent ? (
            <div
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(20px, 4vw, 32px)',
                maxWidth: 720,
              }}
            >
              <ToolComponent />
            </div>
          ) : (
            /* Coming soon placeholder */
            <div
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'clamp(40px, 8vw, 80px)',
                maxWidth: 720,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                <span style={{ opacity: 0.4 }}>{tool.emoji}</span>
              </div>
              <h2
                style={{
                  fontFamily: 'var(--f-display)',
                  fontWeight: 700,
                  fontSize: 24,
                  color: 'var(--fg-0)',
                  margin: '0 0 10px',
                }}
              >
                Coming soon
              </h2>
              <p
                style={{
                  color: 'var(--fg-1)',
                  fontSize: 15,
                  margin: '0 0 28px',
                  lineHeight: 1.6,
                }}
              >
                This tool is on our roadmap and will be available shortly.
                <br />
                In the meantime, try one of the tools below.
              </p>

              {/* Fake input */}
              <div style={{ textAlign: 'left', marginBottom: 16 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg-1)',
                    marginBottom: 6,
                  }}
                >
                  Input
                </label>
                <textarea
                  placeholder="This tool is not yet available..."
                  rows={4}
                  disabled
                  style={{
                    width: '100%',
                    background: 'var(--surface-1)',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '12px 16px',
                    fontSize: 14,
                    fontFamily: 'var(--f-mono)',
                    color: 'var(--fg-2)',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>

              {/* Process button */}
              <button
                disabled
                style={{
                  padding: '10px 24px',
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface-2)',
                  color: 'var(--fg-2)',
                  border: 'none',
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: 'not-allowed',
                  opacity: 0.6,
                }}
              >
                Process
              </button>

              {/* Fake output */}
              <div style={{ textAlign: 'left', marginTop: 24 }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: 13,
                    fontWeight: 600,
                    color: 'var(--fg-1)',
                    marginBottom: 6,
                  }}
                >
                  Output
                </label>
                <textarea
                  placeholder="Output will appear here when available..."
                  rows={4}
                  disabled
                  style={{
                    width: '100%',
                    background: 'var(--surface-1)',
                    border: '1px dashed var(--border)',
                    borderRadius: 'var(--radius)',
                    padding: '12px 16px',
                    fontSize: 14,
                    fontFamily: 'var(--f-mono)',
                    color: 'var(--fg-2)',
                    resize: 'none',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
