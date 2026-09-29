'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import BrandMark from './BrandMark';
import ThemeMenu from './ThemeMenu';
import { IconSearch, IconChevronDown, IconMenu } from './icons';
import NavbarAuth from '@/components/NavbarAuth';
import { useAuth } from '@/app/providers/auth-provider';

type Props = { onOpenSearch: () => void };

const NavPanels = dynamic(() => import('./NavPanels'));

const menus: Array<{ key: string; label: string; href?: string }> = [
  { key: 'tools', label: 'Tools' },
  { key: 'sponsors', label: 'Sponsors', href: '/sponsors' },
  { key: 'more',  label: 'More' },
];

export default function Nav({ onOpenSearch }: Props) {
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = () => {
    if (closeTimer.current != null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 140);
  };

  useEffect(() => () => cancelClose(), []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
          <BrandMark size={34} />
          <span className="tb-v2-brand-name">Toolblip</span>
        </Link>

        <div className="tb-v2-nav-links tb-v2-nav-links-center">
          {menus.map((menu) =>
            menu.href ? (
              <Link
                key={menu.key}
                href={menu.href}
                className="tb-v2-btn tb-v2-btn-primary tb-v2-btn-sm"
              >
                {menu.label}
              </Link>
            ) : (
              <div
                key={menu.key}
                className="tb-v2-nav-dropdown-root"
                onMouseEnter={() => { cancelClose(); setOpenMenu(menu.key); }}
                onMouseLeave={scheduleClose}
              >
                <button
                  type="button"
                  className={`tb-v2-nav-trigger${openMenu === menu.key ? ' on' : ''}`}
                  onClick={() => setOpenMenu(openMenu === menu.key ? null : menu.key)}
                  aria-expanded={openMenu === menu.key}
                >
                  <span>{menu.label}</span>
                  <IconChevronDown
                    className="tb-v2-ic tb-v2-nav-trigger-chev"
                    style={{ width: 12, height: 12 }}
                  />
                </button>
              </div>
            ),
          )}
        </div>

        <div className="tb-v2-nav-right">
          <button
            type="button"
            className="tb-v2-nav-search tb-v2-nav-search-compact"
            onClick={onOpenSearch}
            aria-label="Open search (⌘K or /)"
          >
            <IconSearch style={{ width: 14, height: 14, color: 'var(--fg-3)' }} />
            <span className="tb-v2-nav-search-label">⌘K or /</span>
          </button>
          {user && (
            <Link href="/dashboard" className="tb-v2-nav-pro">Dashboard</Link>
          )}
          <ThemeMenu />
          <div className="tb-v2-nav-signin">
            <NavbarAuth />
          </div>
          <button
            type="button"
            className="tb-v2-nav-mobile-toggle"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            <IconMenu style={{ width: 20, height: 20 }} />
          </button>
        </div>
      </div>

      {(openMenu || mobileOpen) && (
        <NavPanels
          desktopWhich={openMenu}
          mobileOpen={mobileOpen}
          mobileExpanded={mobileExpanded}
          menus={menus}
          hasUser={Boolean(user)}
          onCloseDesktop={() => setOpenMenu(null)}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleMobileSection={(key) => setMobileExpanded((current) => current === key ? null : key)}
          onCancelClose={cancelClose}
          onScheduleClose={scheduleClose}
        />
      )}
    </nav>
  );
}
