'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import BrandMark from './BrandMark';
import ThemeMenu from './ThemeMenu';
import {
  IconSearch, IconChevronDown, IconMenu, IconArrow, IconArrowUR,
  IconCode, IconHash, IconKey, IconCrop, IconGrid, IconLock,
  IconType, IconClock, IconDice, IconGlobe, IconLink, IconFile,
  IconZap, IconShield, IconGift, IconCommand, IconHelp, IconUtil,
} from './icons';
import { CAT_META } from '@/lib/v2/categoryMeta';
import { tools } from '@/data/tools';
import NavbarAuth from '@/components/NavbarAuth';

type Props = { onOpenSearch: () => void };

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TOOL_ICON: Record<string, IconComp> = {
  'json-formatter': IconCode,
  'regex-tester': IconHash,
  'jwt-decoder': IconKey,
  'uuid-generator': IconHash,
  'hash-generator': IconHash,
  'hash-from-text': IconHash,
  'password-generator': IconLock,
  'word-counter': IconType,
  'case-converter': IconType,
  'image-resizer': IconCrop,
  'image-cropper': IconCrop,
  'qr-code-generator': IconGrid,
  'url-encode': IconLink,
  'base64': IconLock,
  'timestamp-converter': IconClock,
  'random-number-generator': IconDice,
  'meta-tag-generator': IconFile,
  'dns-lookup': IconGlobe,
};

type SidebarCatItem = { cat: string; label: string; desc: string; slug?: string };
type FeaturedItem = { slug: string; name: string; category: string; description: string };
type LearnItem = { label: string; desc: string };
type MoreCol = {
  label: string;
  items: Array<{ icon: string; label: string; desc: string; href: string; kbd?: string }>;
};
type TipBlock = { title: string; body: string };

type MenuContent =
  | {
      more: false;
      sidebarLabel: string;
      sidebar: SidebarCatItem[];
      featuredLabel: string;
      featured: FeaturedItem[];
      listLabel?: string;
      learn?: LearnItem[];
      ctaLabel: string;
      ctaTarget: string;
    }
  | {
      more: true;
      columns: MoreCol[];
      tip: TipBlock;
    };

function getMenuContent(key: string): MenuContent | null {
  const lookup = (slug: string): FeaturedItem | null => {
    const t = tools.find((x) => x.slug === slug);
    return t
      ? { slug: t.slug, name: t.name, category: t.category, description: t.description }
      : null;
  };

  if (key === 'tools') {
    const featured = [
      lookup('json-formatter'),
      lookup('image-aspect-ratio-calculator') ?? lookup('image-resizer'),
      lookup('color-palette-generator'),
    ].filter((x): x is FeaturedItem => !!x);
    return {
      more: false,
      sidebarLabel: 'Tool Categories',
      sidebar: [
        { cat: 'Developer',  label: 'Developer',  desc: 'JSON, JWT, hash, regex' },
        { cat: 'Text',       label: 'Text',       desc: 'Count, convert, diff' },
        { cat: 'Image',      label: 'Image',      desc: 'Resize, crop, compress' },
        { cat: 'Color',      label: 'Color',      desc: 'Palettes, contrast, picker' },
        { cat: 'Conversion', label: 'Conversion', desc: 'YAML, CSV, timestamps' },
        { cat: 'SEO',        label: 'SEO',        desc: 'Meta tags, sitemaps, OG' },
      ],
      featuredLabel: 'Featured',
      featured,
      ctaLabel: 'All Tools',
      ctaTarget: '/directory',
    };
  }

  if (key === 'mcp') {
    return {
      more: false,
      sidebarLabel: 'MCP',
      sidebar: [
        { cat: 'MCP', label: 'Server Inspector', desc: 'Explore any MCP server live' },
        { cat: 'MCP', label: 'Server Registry',  desc: 'Browse community servers' },
        { cat: 'MCP', label: 'Schema Validator', desc: 'Check tool schemas vs spec' },
        { cat: 'MCP', label: 'Config Builder',   desc: 'Claude, Cursor, Zed configs' },
        { cat: 'MCP', label: 'Transport Tester', desc: 'stdio / SSE / HTTP probe' },
        { cat: 'MCP', label: 'Prompt Debugger',  desc: 'Replay prompt requests' },
      ],
      featuredLabel: 'Featured',
      featured: [],
      learn: [
        { label: 'What is MCP?',            desc: 'Protocol primer in 5 min' },
        { label: 'Build your first server', desc: 'TypeScript walkthrough' },
        { label: 'Security best practices', desc: 'Sandboxing, secrets, audit' },
      ],
      ctaLabel: 'All MCP Tools',
      ctaTarget: '/directory?cat=MCP',
    };
  }

  if (key === 'aiml') {
    return {
      more: false,
      sidebarLabel: 'AI / ML',
      sidebar: [
        { cat: 'AI/ML', label: 'Token Counter',     desc: 'GPT, Claude, Gemini, Llama' },
        { cat: 'AI/ML', label: 'Prompt Library',    desc: '1000+ curated prompts' },
        { cat: 'AI/ML', label: 'LLM Playground',    desc: 'Side-by-side model compare' },
        { cat: 'AI/ML', label: 'Cost Calculator',   desc: 'Monthly spend estimates' },
        { cat: 'AI/ML', label: 'Embeddings',        desc: '2D/3D UMAP & t-SNE' },
        { cat: 'AI/ML', label: 'Prompt Optimizer',  desc: 'Rewrite for clarity' },
      ],
      featuredLabel: 'Featured',
      featured: [],
      learn: [
        { label: 'Prompt engineering guide', desc: 'Patterns that hold up' },
        { label: 'Eval-driven development',  desc: 'Ship with confidence' },
        { label: 'Model-routing cookbook',   desc: 'Cost vs quality, solved' },
      ],
      ctaLabel: 'All AI Tools',
      ctaTarget: '/directory?cat=AI%2FML',
    };
  }

  if (key === 'more') {
    return {
      more: true,
      columns: [
        {
          label: 'Product',
          items: [
            { icon: 'zap',     label: 'Toolblip Pro',       desc: 'Higher limits, history, team vault', href: '/pricing' },
            { icon: 'command', label: 'Desktop app',         desc: 'Mac, Windows, Linux — offline',      href: '/' },
            { icon: 'file',    label: 'Browser extension',   desc: 'Right-click any text or link',       href: '/' },
            { icon: 'shield',  label: 'Self-hosted',         desc: 'Run Toolblip behind your firewall',  href: '/' },
            { icon: 'gift',    label: "What's new",          desc: 'Changelog · shipped this week',      href: '/blog' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { icon: 'help',    label: 'Help Center',  desc: 'Guides, how-tos, FAQs',         href: '/blog' },
            { icon: 'command', label: 'Keyboard Map', desc: 'Every shortcut, one page',      href: '/', kbd: '?' },
            { icon: 'file',    label: 'API Docs',     desc: 'REST endpoints + examples',     href: '/api-docs' },
            { icon: 'util',    label: 'Cheat sheets', desc: 'Regex, HTTP status, CSS tricks', href: '/blog' },
            { icon: 'zap',     label: 'Blog',         desc: 'Notes on building small tools', href: '/blog' },
          ],
        },
        {
          label: 'Company',
          items: [
            { icon: 'gift',    label: 'About',         desc: 'Who makes this, and why',       href: '/about' },
            { icon: 'file',    label: 'Press & Brand', desc: 'Assets, logo kit, copy',        href: '/about' },
            { icon: 'util',    label: 'Contact',       desc: 'Support, sales, partnerships',  href: '/about' },
            { icon: 'shield',  label: 'Privacy',       desc: 'We do the boring thing: nothing', href: '/privacy' },
            { icon: 'command', label: 'Terms',         desc: 'The short, plain-English version', href: '/terms' },
          ],
        },
      ],
      tip: {
        title: 'Tip of the day',
        body: 'Hit / anywhere on the site to open search. Hit Esc to close any panel.',
      },
    };
  }

  return null;
}

const MORE_ICONS: Record<string, IconComp> = {
  zap: IconZap, command: IconCommand, file: IconFile, shield: IconShield,
  gift: IconGift, help: IconHelp, util: IconUtil,
};

function MegaMenu({ which, onClose }: { which: string; onClose: () => void }) {
  const content = getMenuContent(which);
  const [activeCat, setActiveCat] = useState<string | null>(
    content && !content.more ? content.sidebar[0]?.cat ?? null : null,
  );

  if (!content) return null;

  if (content.more) {
    return (
      <div className="tb-v2-mega-menu tb-v2-mega-more">
        <div className="tb-v2-mm-cols">
          {content.columns.map((col, ci) => (
            <div key={ci} className="tb-v2-mm-col">
              <div className="tb-v2-mm-label">{col.label}</div>
              {col.items.map((it, i) => {
                const Ic = MORE_ICONS[it.icon] ?? IconUtil;
                return (
                  <Link
                    key={i}
                    href={it.href}
                    className="tb-v2-mm-more-row"
                    onClick={onClose}
                  >
                    <div className="tb-v2-mm-more-icon"><Ic className="tb-v2-ic" /></div>
                    <div className="tb-v2-mm-more-txt">
                      <div className="tb-v2-mm-more-title">{it.label}</div>
                      <div className="tb-v2-mm-more-desc">{it.desc}</div>
                    </div>
                    {it.kbd && <span className="tb-v2-kbd tb-v2-mm-more-kbd">{it.kbd}</span>}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className="tb-v2-mm-more-foot">
          <div className="tb-v2-mm-tip">
            <div className="tb-v2-mm-tip-label">{content.tip.title}</div>
            <div className="tb-v2-mm-tip-body">{content.tip.body}</div>
          </div>
          <div className="tb-v2-mm-status">
            <span className="tb-v2-mm-dot" />
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    );
  }

  const activeList =
    which === 'tools' && activeCat
      ? tools.filter((t) => t.category === activeCat).slice(0, 12)
      : [];

  return (
    <div className="tb-v2-mega-menu">
      <aside className="tb-v2-mm-side">
        <div className="tb-v2-mm-label">{content.sidebarLabel}</div>
        {content.sidebar.map((s, i) => {
          const meta = CAT_META[s.cat];
          const Ic = meta?.icon ?? IconUtil;
          const active = activeCat === s.cat;
          return (
            <button
              key={i}
              type="button"
              className={`tb-v2-mm-side-row${active ? ' on' : ''}`}
              onMouseEnter={() => setActiveCat(s.cat)}
              onClick={() => {
                window.location.href = `/directory?cat=${encodeURIComponent(s.cat)}`;
                onClose();
              }}
              style={{ '--cat-color': meta?.color, '--cat-bg': meta?.bg } as React.CSSProperties}
            >
              <div className="tb-v2-mm-side-icon"><Ic className="tb-v2-ic" /></div>
              <div className="tb-v2-mm-side-txt">
                <div className="tb-v2-mm-side-title">{s.label}</div>
                <div className="tb-v2-mm-side-desc">{s.desc}</div>
              </div>
            </button>
          );
        })}
      </aside>

      <div className="tb-v2-mm-body">
        {content.featured.length > 0 && (
          <div>
            <div className="tb-v2-mm-label">{content.featuredLabel}</div>
            <div className="tb-v2-mm-featured">
              {content.featured.map((t) => {
                const meta = CAT_META[t.category];
                const Ic = TOOL_ICON[t.slug] ?? meta?.icon ?? IconUtil;
                return (
                  <Link
                    key={t.slug}
                    href={`/tools/${t.slug}`}
                    className="tb-v2-mm-feat-card"
                    onClick={onClose}
                    style={{ '--cat-color': meta?.color, '--cat-bg': meta?.bg } as React.CSSProperties}
                  >
                    <div className="tb-v2-mm-feat-thumb"><Ic className="tb-v2-ic" /></div>
                    <div className="tb-v2-mm-feat-title">{t.name}</div>
                    <div className="tb-v2-mm-feat-desc">{t.description}</div>
                    <IconArrowUR className="tb-v2-ic tb-v2-mm-feat-go" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {which === 'tools' && activeList.length > 0 && (
          <div>
            <div className="tb-v2-mm-label">{activeCat} · {activeList.length}</div>
            <div className="tb-v2-mm-list">
              {activeList.map((t) => (
                <Link
                  key={t.slug}
                  href={`/tools/${t.slug}`}
                  className="tb-v2-mm-list-row"
                  onClick={onClose}
                >
                  {t.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {content.learn && content.learn.length > 0 && (
          <div>
            <div className="tb-v2-mm-label">Learn</div>
            <div className="tb-v2-mm-list">
              {content.learn.map((l, i) => (
                <div key={i} className="tb-v2-mm-learn-row">
                  <div className="tb-v2-mm-learn-title">{l.label}</div>
                  <div className="tb-v2-mm-learn-desc">{l.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="tb-v2-mm-foot">
          <Link href={content.ctaTarget} className="tb-v2-mm-cta" onClick={onClose}>
            {content.ctaLabel} <IconArrow className="tb-v2-ic" />
          </Link>
        </div>
      </div>
    </div>
  );
}

const menus = [
  { key: 'tools', label: 'Tools' },
  { key: 'mcp',   label: 'MCP' },
  { key: 'aiml',  label: 'AI / ML' },
  { key: 'more',  label: 'More' },
];

export default function Nav({ onOpenSearch }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [anchorStyle, setAnchorStyle] = useState<React.CSSProperties>({});
  const navRef = useRef<HTMLElement>(null);
  const menuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
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
        const anchor = document.querySelector('.tb-v2-mm-anchor');
        if (!anchor || !anchor.contains(e.target as Node)) {
          setOpenMenu(null);
        }
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

  useEffect(() => {
    if (!openMenu) { setAnchorStyle({}); return; }
    const trigger = menuTriggerRefs.current[openMenu];
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const menuWidth = 700;
    const left = Math.max(16, Math.min(rect.left + rect.width / 2 - menuWidth / 2, window.innerWidth - menuWidth - 16));
    setAnchorStyle({ top: rect.bottom + 6, left });
  }, [openMenu]);

  return (
    <nav className="tb-v2-nav" ref={navRef}>
      <div className="tb-v2-container tb-v2-nav-inner">
        <Link href="/" className="tb-v2-brand">
          <BrandMark size={34} />
          <span className="tb-v2-brand-name">Toolblip</span>
        </Link>

        <div className="tb-v2-nav-links tb-v2-nav-links-center">
          {menus.map((menu) => (
            <div
              key={menu.key}
              className="tb-v2-nav-dropdown-root"
              onMouseEnter={() => { cancelClose(); setOpenMenu(menu.key); }}
              onMouseLeave={scheduleClose}
            >
              <button
                type="button"
                ref={(el) => { menuTriggerRefs.current[menu.key] = el; }}
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

      {openMenu && (
        <div
          className="tb-v2-mm-anchor"
          style={anchorStyle}
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
        >
          <MegaMenu which={openMenu} onClose={() => setOpenMenu(null)} />
        </div>
      )}

      {mobileOpen && (
        <div className="tb-v2-nav-mobile-sheet open">
          {menus.map((menu) => {
            const content = getMenuContent(menu.key);
            const expanded = mobileExpanded === menu.key;
            return (
              <div key={menu.key} className="tb-v2-nav-mobile-group">
                <button
                  type="button"
                  className="tb-v2-nav-mobile-section"
                  onClick={() => setMobileExpanded(expanded ? null : menu.key)}
                >
                  {menu.label}
                  <IconChevronDown
                    className="tb-v2-ic"
                    style={{
                      width: 12, height: 12,
                      transform: expanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform .15s',
                    }}
                  />
                </button>
                {expanded && content && !content.more && (
                  <>
                    {content.sidebar.map((s, i) => (
                      <Link
                        key={i}
                        href={`/directory?cat=${encodeURIComponent(s.cat)}`}
                        onClick={() => setMobileOpen(false)}
                      >
                        {s.label}
                      </Link>
                    ))}
                    <Link href={content.ctaTarget} onClick={() => setMobileOpen(false)}>
                      {content.ctaLabel} →
                    </Link>
                  </>
                )}
                {expanded && content && content.more && (
                  <>
                    {content.columns.flatMap((col) =>
                      col.items.map((it, i) => (
                        <Link
                          key={`${col.label}-${i}`}
                          href={it.href}
                          onClick={() => setMobileOpen(false)}
                        >
                          {it.label}
                        </Link>
                      )),
                    )}
                  </>
                )}
              </div>
            );
          })}
          <div className="tb-v2-nav-mobile-divider" />
          <Link href="/directory" onClick={() => setMobileOpen(false)}>All Tools</Link>
          <Link href="/pricing" onClick={() => setMobileOpen(false)}>Get Pro</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)}>Sign in</Link>
        </div>
      )}
    </nav>
  );
}
