import type { Metadata } from 'next';
import { aiMcpItemId, aiMcpMenu } from '@/data/ai-mcp-menu';

const title = 'AI / MCP / Bots | Toolblip';
const description = 'A starter list of AI bots and MCP servers on Toolblip.';

export const metadata: Metadata = {
  alternates: { canonical: 'https://toolblip.com/ai-mcp-bots' },
  title,
  description,
  openGraph: {
    title,
    description,
    url: 'https://toolblip.com/ai-mcp-bots',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary',
    title,
    description,
  },
};

export default function AiMcpBotsPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <div className="tb-v2-article">
          <div className="tb-v2-kicker">AI / MCP / Bots</div>
          <h1 className="tb-v2-page-title">AI / MCP / Bots</h1>
          <div className="tb-v2-article-section">
            <p>A starter list of AI bots and MCP servers. More will show up here.</p>
          </div>
          {aiMcpMenu.columns.map((column) => (
            <div key={column.label} className="tb-v2-article-section">
              <h2>{column.label}</h2>
              <ul>
                {column.items.map((item) => (
                  <li key={item.label} id={aiMcpItemId(item.label)} className="tb-v2-ai-mcp-item">
                    <span>
                      <strong>{item.label}.</strong> {item.desc}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
