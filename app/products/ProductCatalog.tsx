'use client';

import { useRef, useState } from 'react';
import { ArrowUpRight, Search, X } from 'lucide-react';
import ProductArtwork from './ProductArtwork';
import styles from './products.module.css';

const categories = ['All products', 'Cloud & AI', 'Developer tools', 'Commerce', 'More from us'] as const;
type Category = typeof categories[number];

const products = [
  {
    name: 'CloudPloy', category: 'Cloud & AI', url: 'https://cloudploy.com', domain: 'cloudploy.com',
    status: 'Waitlist open', logo: 'cloudploy.svg', tone: 'cloud', tagline: 'Your next deploy starts with a prompt.',
    description: 'Deploy to your own cloud from Claude Code, Cursor, or any MCP client. Connect your AI tools and put deployment into your existing workflow.',
  },
  {
    name: 'SkaleAgents', category: 'Cloud & AI', url: 'https://skaleagents.com', domain: 'skaleagents.com',
    logo: 'skaleagents.svg', tone: 'agents', tagline: 'A second pair of eyes for your infrastructure.',
    description: 'An AI DevOps control plane for code and infrastructure reviews. Find specialist agents, reuse prompts, and bring findings back to your editor through MCP.',
  },
  {
    name: 'Crontinel', category: 'Developer tools', url: 'https://crontinel.com', domain: 'crontinel.com',
    logo: 'crontinel.png', tone: 'monitor', tagline: 'Hear about failures before your users do.',
    description: 'Monitor scheduled jobs, queues, workers, and AI agent runs. Open-source SDKs and a hosted dashboard help catch failures an uptime check can miss.',
  },
  {
    name: 'AmazingPlugins', category: 'Commerce', url: 'https://amazingplugins.com', domain: 'amazingplugins.com',
    logo: 'amazingplugins.jpg', tone: 'plugins', tagline: 'Quiet plugins. Better stores.',
    description: 'Focused, free plugins for WooCommerce store owners. Starting with accessibility, each plugin tackles a specific problem in your store.',
  },
  {
    name: 'Appnary', category: 'Commerce', url: 'https://appnary.com', domain: 'appnary.com',
    status: 'Coming soon', logo: 'appnary.png', tone: 'shopify', tagline: 'Shopify apps built around your day.',
    description: 'Simple, affordable apps for Shopify merchants. Pixel Tracker brings Facebook, Google, TikTok, and more tracking pixels into one dashboard.',
  },
  {
    name: 'harun.dev', category: 'More from us', url: 'https://harun.dev', domain: 'harun.dev',
    logo: 'harun.svg', tone: 'personal', tagline: 'Meet the engineer behind the work.',
    description: "Harun R. Rayhan's home on the web. Software engineering, cloud architecture, and DevOps consulting, with notes from the work along the way.",
  },
] as const;

export default function ProductCatalog() {
  const [category, setCategory] = useState<Category>('All products');
  const [search, setSearch] = useState('');
  const searchInput = useRef<HTMLInputElement>(null);
  const query = search.trim().toLowerCase();
  const visibleProducts = products.filter(product =>
    (category === 'All products' || product.category === category) &&
    [product.name, product.tagline, product.description, product.category].some(value => value.toLowerCase().includes(query))
  );
  function clearSearch() { setSearch(''); searchInput.current?.focus(); }
  function resetFilters() { setCategory('All products'); clearSearch(); }

  return (
    <section aria-label="Our product catalog" className={styles.catalog}>
      <div className={styles.toolbar}>
        <div className={styles.filters} role="group" aria-label="Filter products by category">
          {categories.map(item => (
            <button key={item} type="button" aria-pressed={category === item} aria-controls="product-results" onClick={() => setCategory(item)} className={styles.filter}>
              {item}{item === 'All products' && <span aria-hidden="true">06</span>}
            </button>
          ))}
        </div>
        <div className={styles.search}>
          <Search size={16} aria-hidden="true" />
          <input ref={searchInput} type="search" aria-label="Search products" aria-controls="product-results" placeholder="Find your next tool…" value={search} onChange={event => setSearch(event.target.value)} />
          {search && <button type="button" aria-label="Clear search" onClick={clearSearch}><X size={16} aria-hidden="true" /></button>}
        </div>
      </div>
      <p className={styles.srOnly} role="status" aria-live="polite" aria-atomic="true">
        {visibleProducts.length} {visibleProducts.length === 1 ? 'product' : 'products'}
      </p>
      <div className={styles.grid} id="product-results">
        {visibleProducts.map(product => (
          <article key={product.name} className={`${styles.card} ${styles[product.tone]}`}>
            <a className={styles.cardLink} href={product.url} target="_blank" rel="noopener noreferrer" aria-label={`Explore ${product.name} (opens in a new tab)`}>
              <div className={styles.art}>
                <div className={styles.artTop}>
                  <span>{product.category}</span>
                  {'status' in product && <span className={styles.badge}><i />{product.status}</span>}
                </div>
                <ProductArtwork tone={product.tone} logo={product.logo} />
              </div>
              <div className={styles.body}>
                <div className={styles.cardHeader}>
                  <span className={styles.logo}><img src={`/products/${product.logo}`} alt="" width={24} height={24} loading="lazy" /></span>
                  <h2 className={styles.name}>{product.name}</h2>
                  <span className={styles.arrow}><ArrowUpRight size={20} aria-hidden="true" /></span>
                </div>
                <p className={styles.tagline}>{product.tagline}</p>
                <p className={styles.description}>{product.description}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.domain}>{product.domain}</span>
                  <span>Explore <ArrowUpRight size={13} aria-hidden="true" /></span>
                </div>
              </div>
            </a>
          </article>
        ))}
      </div>
      {visibleProducts.length === 0 && <div className={styles.empty}>
        <h2>No products found</h2>
        <p>Try a different search or reset the filters to explore all six projects.</p>
        <button type="button" onClick={resetFilters}>Reset filters</button>
      </div>}
      <div className={styles.endnote}><span><i />Built here. Always evolving.</span><span>06 projects / one curious studio</span></div>
    </section>
  );
}
