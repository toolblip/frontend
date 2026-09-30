'use client';

import { useState } from 'react';
import { Activity, CloudUpload, CodeXml, ExternalLink, Puzzle, ShoppingBag, Workflow } from 'lucide-react';
import styles from './products.module.css';

const categories = ['All products', 'Cloud & AI', 'Developer tools', 'Commerce', 'More from us'] as const;
type Category = typeof categories[number];

const products = [
  {
    name: 'CloudPloy', category: 'Cloud & AI', url: 'https://cloudploy.com', domain: 'cloudploy.com',
    status: 'Waitlist open', icon: CloudUpload, tone: 'cloud',
    description: 'Deploy to your own cloud from Claude Code, Cursor, or any MCP client. Connect your AI tools and put deployment into your existing workflow.',
  },
  {
    name: 'SkaleAgents', category: 'Cloud & AI', url: 'https://skaleagents.com', domain: 'skaleagents.com',
    icon: Workflow, tone: 'cloud',
    description: 'An AI DevOps control plane for code and infrastructure reviews. Find specialist agents, reuse prompts, and bring findings back to your editor through MCP.',
  },
  {
    name: 'Crontinel', category: 'Developer tools', url: 'https://crontinel.com', domain: 'crontinel.com',
    icon: Activity, tone: 'developer',
    description: 'Monitor scheduled jobs, queues, workers, and AI agent runs. Open-source SDKs and a hosted dashboard help catch failures an uptime check can miss.',
  },
  {
    name: 'AmazingPlugins', category: 'Commerce', url: 'https://amazingplugins.com', domain: 'amazingplugins.com',
    icon: Puzzle, tone: 'commerce',
    description: 'Focused, free plugins for WooCommerce store owners. Starting with accessibility, each plugin tackles a specific problem in your store.',
  },
  {
    name: 'Appnary', category: 'Commerce', url: 'https://appnary.com', domain: 'appnary.com',
    status: 'Coming soon', icon: ShoppingBag, tone: 'commerce',
    description: 'Simple, affordable apps for Shopify merchants. Pixel Tracker brings Facebook, Google, TikTok, and more tracking pixels into one dashboard.',
  },
  {
    name: 'harun.dev', category: 'More from us', url: 'https://harun.dev', domain: 'harun.dev',
    icon: CodeXml, tone: 'personal',
    description: "Harun R. Rayhan's home on the web. Software engineering, cloud architecture, and DevOps consulting, with notes from the work along the way.",
  },
] as const;

export default function ProductCatalog() {
  const [category, setCategory] = useState<Category>('All products');
  const visibleProducts = products.filter(product => category === 'All products' || product.category === category);

  return (
    <section aria-label="Our product catalog">
      <div className={styles.filters} role="group" aria-label="Filter products by category">
        {categories.map(item => (
          <button key={item} type="button" aria-pressed={category === item} aria-controls="product-results" onClick={() => setCategory(item)} className={styles.filter}>
            {item}
          </button>
        ))}
      </div>
      <p className={styles.count} role="status" aria-live="polite" aria-atomic="true">
        {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
      </p>
      <div className={styles.grid} id="product-results">
        {visibleProducts.map(product => (
          <article key={product.name} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={`${styles.icon} ${styles[product.tone]}`}>
                <product.icon size={25} strokeWidth={1.7} aria-hidden="true" />
              </span>
              <div>
                <h2 className={styles.name}>{product.name}</h2>
                <p className={styles.category}>{product.category}</p>
              </div>
              {'status' in product && <span className={styles.badge}>{product.status}</span>}
            </div>
            <p className={styles.description}>{product.description}</p>
            <div className={styles.cardFooter}>
              <span className={styles.domain}>{product.domain}</span>
              <a className={styles.visit} href={product.url}>
                Visit {product.name} <ExternalLink size={15} aria-hidden="true" />
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
