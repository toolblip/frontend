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
    <div className={styles.page}>
      <div className={styles.wrap}>
        <header className={styles.header}>
          <span className={styles.eyebrow}><i />The Toolblip collection</span>
          <h1>Built out of curiosity. Made to be useful.</h1>
          <p className={styles.intro}>
            Cloud tools, everyday utilities, and better ways to run a store. Different problems, the same hands-on approach.
          </p>
        </header>
        <ProductCatalog />
        <section className={styles.contact} aria-labelledby="contact-heading">
          <span className={styles.asterisk} aria-hidden="true">✳</span>
          <div><span className={styles.eyebrow}>Good things start with a conversation</span><h2 id="contact-heading">What are you<br />thinking of building<span>?</span></h2></div>
          <div><p>A new product, a tricky infrastructure problem, or an idea that won’t leave you alone. We’d love to hear it.</p><a href="https://binarylabssoft.com/contact">Let’s make it happen <span aria-hidden="true">↗</span></a></div>
        </section>
      </div>
    </div>
  );
}
