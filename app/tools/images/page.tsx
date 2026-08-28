import type { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { IconArrowUR } from '@/components/v2/icons';
import { getImageTools, getToolPath, IMAGE_CATEGORY, IMAGE_CATEGORY_PATH } from '@/lib/tool-path';

const imageTools = getImageTools();
const meta = getCategoryMeta(IMAGE_CATEGORY);

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'Image Tools | Toolblip',
  description: `Resize, crop, convert, and clean up images in your browser. ${imageTools.length} free Image tools — no upload to a server.`,
  alternates: { canonical: `https://toolblip.com${IMAGE_CATEGORY_PATH}` },
  openGraph: {
    title: 'Image Tools | Toolblip',
    description: `Resize, crop, convert, and clean up images in your browser. ${imageTools.length} free Image tools.`,
    url: `https://toolblip.com${IMAGE_CATEGORY_PATH}`,
    siteName: 'Toolblip',
    type: 'website',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip Image Tools' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Tools | Toolblip',
    description: `Resize, crop, convert, and clean up images in your browser. ${imageTools.length} free Image tools.`,
  },
};

export default function ImageToolsPage() {
  return (
    <main className="tb-v2-blog">
      <div className="tb-v2-container">
        <nav className="tb-v2-breadcrumb">
          <Link href="/">Home</Link>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <Link href="/tools">Tools</Link>
          <span className="tb-v2-breadcrumb-sep">/</span>
          <span>Image</span>
        </nav>

        <div className="tb-v2-blog-header">
          <div className="tb-v2-kicker">Image category</div>
          <h1 className="tb-v2-page-title">Image tools</h1>
          <p className="tb-v2-page-sub">
            {imageTools.length} browser-based image tools. Crop, resize, convert, compress, and inspect photos without sending them to a server.
          </p>
        </div>

        <section className="tb-v2-band" style={{ scrollMarginTop: 24 }}>
          <div className="tb-v2-band-head">
            <div>
              <div className="tb-v2-kicker">{IMAGE_CATEGORY}</div>
              <h2>{imageTools.length} tools</h2>
            </div>
          </div>
          <div className="tb-v2-dir-grid">
            {imageTools.map((tool) => (
              <Link
                key={tool.slug}
                href={getToolPath(tool)}
                className="tb-v2-dir-card"
                style={{ '--cat-color': meta.color, '--cat-bg': meta.bg } as React.CSSProperties}
              >
                <div className="tb-v2-dir-card-top">
                  <span className="tb-v2-dir-card-emoji">{tool.emoji}</span>
                  <div style={{ flex: 1 }}>
                    <div className="tb-v2-dir-card-title">{tool.name}</div>
                  </div>
                  <IconArrowUR className="tb-v2-ic tb-v2-dir-card-go" />
                </div>
                <div className="tb-v2-dir-card-desc">{tool.description}</div>
              </Link>
            ))}
          </div>
        </section>

        <div className="pt-4 pb-8 text-center">
          <Link href="/tools" className="tb-v2-btn">
            All tools
          </Link>
        </div>
      </div>
    </main>
  );
}
