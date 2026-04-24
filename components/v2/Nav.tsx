'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';
import ThemeMenu from './ThemeMenu';
import { IconSearch, IconChevronDown, IconMenu } from './icons';
import NavbarAuth from '@/components/NavbarAuth';

type Props = {
  onOpenSearch: () => void;
};

const menuLinks: Array<{ key: 'tools' | 'mcp' | 'aiml' | 'more'; label: string; href: string }> = [
  { key: 'tools', label: 'Tools', href: '/directory' },
  { key: 'mcp', label: 'MCP', href: '/directory?cat=MCP' },
  { key: 'aiml', label: 'AI / ML', href: '/directory?cat=AI%2FML' },
  { key: 'more', label: 'More', href: '/about' },
];

export default function Nav({ onOpenSearch }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      const inField =
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active as HTMLElement | null)?.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onOpenSearch();
      } else if (e.key === '/' && !inField) {
        e.preventDefault();
        onOpenSearch();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenSearch]);

  return (
    <nav className="tb-v2-nav">
      <div className="tb-v2-container tb-v2-nav-inner">
        <Link href="/" className="tb-v2-brand">
          <BrandMark />
          <span className="tb-v2-brand-name">Toolblip</span>
        </Link>

        <div className="tb-v2-nav-links tb-v2-nav-links-center">
          {menuLinks.map(({ key, label, href }) => (
            <Link key={key} href={href} className="tb-v2-nav-trigger">
              <span>{label}</span>
              <IconChevronDown className="tb-v2-ic tb-v2-nav-trigger-chev" />
            </Link>
          ))}
        </div>

        <div className="tb-v2-nav-right">
          <button
            type="button"
            className="tb-v2-nav-search tb-v2-nav-search-compact"
            onClick={onOpenSearch}
            aria-label="Open search"
          >
            <IconSearch style={{ width: 14, height: 14, color: 'var(--fg-3)' }} />
            <span className="tb-v2-nav-search-label">⌘K or /</span>
          </button>
          <Link href="/pricing" className="tb-v2-nav-pro">Get Pro</Link>
          <ThemeMenu />
          <div className="tb-v2-nav-signin">
            <NavbarAuth />
          </div>
          <button
            type="button"
            className="tb-v2-nav-mobile-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            <IconMenu style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="tb-v2-nav-mobile-sheet open">
          {menuLinks.map(({ key, label, href }) => (
            <Link key={key} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>
          ))}
          <Link href="/directory" onClick={() => setMobileOpen(false)}>All Tools</Link>
          <Link href="/blog" onClick={() => setMobileOpen(false)}>Blog</Link>
          <Link href="/api-docs" onClick={() => setMobileOpen(false)}>API Docs</Link>
          <div className="tb-v2-nav-mobile-divider" />
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Get Pro</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
        </div>
      )}
    </nav>
  );
}
