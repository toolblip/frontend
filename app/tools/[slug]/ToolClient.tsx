'use client';

import type { Tool } from '@/data/tools';
import Link from 'next/link';
import ShareButtons from '@/components/ShareButtons';
import WordCounterClient from '@/components/tools/WordCounterClient';
import CharacterCounterClient from '@/components/tools/CharacterCounterClient';
import CaseConverterClient from '@/components/tools/CaseConverterClient';
import Base64Client from '@/components/tools/Base64Client';
import UrlEncodeClient from '@/components/tools/UrlEncodeClient';
import JsonFormatterClient from '@/components/tools/JsonFormatterClient';
import QrCodeGeneratorClient from '@/components/tools/QrCodeGeneratorClient';
import ColorPickerClient from '@/components/tools/ColorPickerClient';
import FaqSection from '@/components/v2/FaqSection';
import { getFaqs } from '@/lib/faq';

function getToolComponent(slug: string): React.ReactNode {
  switch (slug) {
    case 'word-counter':
      return <WordCounterClient />;
    case 'character-counter':
      return <CharacterCounterClient />;
    case 'case-converter':
      return <CaseConverterClient />;
    case 'base64':
      return <Base64Client />;
    case 'url-encode':
    case 'url-encoder':
      return <UrlEncodeClient />;
    case 'json-formatter':
    case 'json-editor':
      return <JsonFormatterClient />;
    case 'qr-code-generator':
    case 'qr-code':
      return <QrCodeGeneratorClient />;
    case 'color-picker':
      return <ColorPickerClient />;
    default:
      return <ComingSoonUI />;
  }
}

function ComingSoonUI() {
  return (
    <div className="tb-v2-coming-soon">
      <div className="tb-v2-coming-soon-icon">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
        </svg>
      </div>
      <div className="tb-v2-coming-soon-body">
        <div className="tb-v2-coming-soon-title">This tool is being built</div>
        <p className="tb-v2-coming-soon-desc">
          Need it sooner? Email{' '}
          <a
            className="tb-v2-coming-soon-link"
            href="mailto:info@toolblip.com?subject=Tool%20Request"
          >
            info@toolblip.com
          </a>
          .
        </p>
      </div>
    </div>
  );
}

export default function ToolClient({ tool }: { tool: Tool }) {
  const component = getToolComponent(tool.slug);

  return (
    <section className="tb-v2-tool-page">
      <div className="tb-v2-container">

        {/* Breadcrumb */}
        <nav className="tb-v2-breadcrumb" aria-label="Breadcrumb">
          <Link href="/tools">All Tools</Link>
          <span className="tb-v2-breadcrumb-sep" aria-hidden="true">›</span>
          <span>{tool.category}</span>
        </nav>

        {/* Header */}
        <div className="tb-v2-tool-header">
          <div className="tb-v2-tool-emoji" aria-hidden="true">
            {tool.emoji}
          </div>
          <div className="tb-v2-tool-title-group">
            <h1 className="tb-v2-tool-title">{tool.name}</h1>
            <p className="tb-v2-tool-desc">{tool.description}</p>
            <div className="tb-v2-tool-header-row">
              <span className="tb-v2-tool-cat-pill">{tool.category}</span>
              <div className="tb-v2-share-row">
                <ShareButtons
                  toolName={tool.name}
                  className="tb-v2-share-row"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tool card */}
        <div className="tb-v2-tool-card">
          {component}
        </div>

        {/* FAQ */}
        <FaqSection toolName={tool.name} faqs={getFaqs(tool)} />

        {/* Footer note */}
        <p className="tb-v2-tool-footer">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          100% client-side - nothing leaves your browser
        </p>
      </div>
    </section>
  );
}
