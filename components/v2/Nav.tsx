'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';
import SettingsMenu from './SettingsMenu';
import { IconSearch, IconChevronDown, IconMenu } from './icons';
import NavbarAuth from '@/components/NavbarAuth';

type Props = {
  onOpenSearch: () => void;
};

type MenuItem = {
  key: string;
  label: string;
  href?: string;
  items?: Array<{ label: string; href: string; description?: string }>;
};

const menus: MenuItem[] = [
  {
    key: 'tools',
    label: 'Tools',
    items: [
      { label: 'Text Tools', href: '/directory?cat=Text', description: 'Count, convert, format text' },
      { label: 'Image Tools', href: '/directory?cat=Image', description: 'Resize, convert, optimize images' },
      { label: 'Dev Tools', href: '/directory?cat=Dev', description: 'Regex, JSON, Base64, JWT' },
      { label: 'QR Codes', href: '/directory?cat=QR', description: 'Generate and decode QR codes' },
      { label: 'Color Tools', href: '/directory?cat=Color', description: 'Pick, convert, mix colors' },
      { label: 'All Tools', href: '/directory', description: 'Browse the full directory' },
    ],
  },
  {
    key: 'mcp',
    label: 'MCP',
    items: [
      { label: 'What is MCP', href: '/blog/what-is-an-mcp-server', description: 'Model Context Protocol explained' },
      { label: 'MCP Servers', href: '/directory?cat=MCP', description: 'Available MCP server tools' },
      { label: 'Connect Claude', href: '/blog/connect-claude-code-to-toolblip', description: 'Use Toolblip from Claude Code' },
    ],
  },
  {
    key: 'aiml',
    label: 'AI / ML',
    items: [
      { label: 'AI Tools', href: '/directory?cat=AI%2FML', description: 'AI-powered utility tools' },
      { label: 'Prompt Library', href: '/blog', description: 'Tips and prompt engineering guides' },
    ],
  },
  {
    key: 'more',
    label: 'More',
    items: [
      { label: 'Pricing', href: '/pricing', description: 'Plans and upgrades' },
      { label: 'Blog', href: '/blog', description: 'Articles and tutorials' },
      { label: 'API Docs', href: '/api-docs', description: 'Developer API reference' },
      { label: 'About', href: '/about', description: 'About Toolblip' },
      { label: 'Donate', href: '/donate', description: 'Support the project' },
    ],
  },
];

export default function Nav({ onOpenSearch }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Keyboard shortcuts
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
      } else if (e.key === 'Escape') {
        setOpenMenu(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onOpenSearch]);

  return (
    <nav className="tb-v2-nav" ref={navRef}>
      <div className="tb-v2-container tb-v2-nav-inner">
        <Link href="/" className="tb-v2-brand">
          <BrandMark />
          <span className="tb-v2-brand-name">Toolblip</span>
        </Link>

        <div className="tb-v2-nav-links tb-v2-nav-links-center">
          {menus.map((menu) => (
            <div key={menu.key} className="tb-v2-nav-dropdown-root">
              {menu.items ? (
                <>
                  <button
                    type="button"
                    className={`tb-v2-nav-trigger${openMenu === menu.key ? ' open' : ''}`}
                    onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                    onMouseEnter={() => setOpenMenu(menu.key)}
                    aria-expanded={openMenu === menu.key}
                  >
                    <span>{menu.label}</span>
                    <IconChevronDown
                      className="tb-v2-ic tb-v2-nav-trigger-chev"
                      style={{ width: 12, height: 12 }}
                    />
                  </button>
                  {openMenu === menu.key && (
                    <div
                      className="tb-v2-nav-dropdown"
                      onMouseLeave={() => setOpenMenu(null)}
                    >
                      {menu.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="tb-v2-nav-dropdown-item"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span className="tb-v2-nav-dropdown-label">{item.label}</span>
                          {item.description && (
                            <span className="tb-v2-nav-dropdown-desc">{item.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link href={menu.href!} className="tb-v2-nav-trigger">
                  <span>{menu.label}</span>
                </Link>
              )}
            </div>
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
          <SettingsMenu />
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
          {menus.map((menu) => (
            <div key={menu.key}>
              {menu.items ? (
                <>
                  <span className="tb-v2-nav-mobile-section">{menu.label}</span>
                  {menu.items.map((item) => (
                    <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </>
              ) : (
                <Link href={menu.href!} onClick={() => setMobileOpen(false)}>{menu.label}</Link>
              )}
            </div>
          ))}
          <div className="tb-v2-nav-mobile-divider" />
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Get Pro</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
        </div>
      )}
    </nav>
  );
}
