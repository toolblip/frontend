import type { Metadata } from 'next';
import ProductCatalog from './ProductCatalog';
import styles from './products.module.css';

const title = 'Our products | Toolblip';
const description = 'Other projects from the people behind Toolblip, covering cloud deployment, AI, developer tools, and commerce.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://toolblip.com/products' },
  openGraph: {
    title,
    description,
    url: 'https://toolblip.com/products',
    siteName: 'Toolblip',
    type: 'website',
    locale: 'en_US',
    images: [{ url: 'https://toolblip.com/og-preview.png', width: 1200, height: 630, alt: 'Toolblip' }],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['https://toolblip.com/og-preview.png'],
  },
};

export default function ProductsPage() {
  return (
    <div className="tb-v2-page">
      <div className="tb-v2-container">
        <header className={styles.header}>
          <h1 className="tb-v2-page-title">Our products</h1>
          <p className={styles.intro}>
            Other projects from the people behind Toolblip. Explore what we’re building for cloud, development, and commerce.
          </p>
        </header>
        <ProductCatalog />
      </div>
    </div>
  );
}
