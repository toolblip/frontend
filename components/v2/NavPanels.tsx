'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import InstallAppMoreRow from './InstallAppMoreRow';
import { aiMcpMenu } from '@/data/ai-mcp-menu';
import { CAT_META } from '@/lib/v2/categoryMeta';
import { tools } from '@/data/tools';
import { getCategoryPath, getToolPath, getToolPathBySlug } from '@/lib/tool-path';
import {
  IconChevronDown, IconArrow, IconArrowUR, IconCode, IconHash, IconKey,
  IconCrop, IconGrid, IconLock, IconType, IconClock, IconDice, IconGlobe,
  IconLink, IconFile, IconZap, IconShield, IconGift, IconCommand, IconHelp,
  IconUtil,
} from './icons';

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const TOOL_ICON: Record<string, IconComp> = {
  'json-formatter': IconCode,
  'regex-tester': IconHash,
  'jwt-decoder': IconKey,
  'uuid-generator': IconHash,
  'hash-generator': IconHash,
  'sha256-hash-generator': IconHash,
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
  items: Array<{ icon: string; label: string; desc: string; href: string; kbd?: string; external?: boolean }>;
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
      list?: string[];
      learn?: LearnItem[];
      ctaLabel: string;
      ctaTarget: string;
    }
  | {
      more: true;
      columns: MoreCol[];
      tip: TipBlock;
      installApp?: boolean;
      status?: string;
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
        { cat: 'SEO',        label: 'SEO',        desc: 'Meta tags, sitemaps, OG' },
      ],
      featuredLabel: 'Featured',
      featured,
      ctaLabel: 'All Tools',
      ctaTarget: '/tools',
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
          ],
        },
        {
          label: 'Resources',
          items: [
            { icon: 'file',    label: 'API Docs',     desc: 'REST endpoints + examples',     href: '/api-docs' },
            { icon: 'zap',     label: 'Blog',         desc: 'Notes on building small tools', href: '/blog' },
          ],
        },
        {
          label: 'Company',
          items: [
            { icon: 'gift',    label: 'About',         desc: 'Who makes this, and why',       href: '/about' },
            { icon: 'shield',  label: 'Privacy',       desc: 'We do the boring thing: nothing', href: '/privacy' },
            { icon: 'command', label: 'Terms',         desc: 'The short, plain-English version', href: '/terms' },
          ],
        },
      ],
      tip: {
        title: 'Tip of the day',
        body: 'Hit / anywhere on the site to open search. Hit Esc to close any panel.',
      },
      installApp: true,
      status: 'All systems operational',
    };
  }

  if (key === 'ai-mcp-bots') {
    return {
      more: true,
      columns: aiMcpMenu.columns,
      tip: aiMcpMenu.tip,
    };
  }

  return null;
}

const MORE_ICONS: Record<string, IconComp> = {
  zap: IconZap, command: IconCommand, file: IconFile, shield: IconShield,
  gift: IconGift, help: IconHelp, util: IconUtil, globe: IconGlobe,
  link: IconLink, code: IconCode, clock: IconClock, hash: IconHash,
};

function outboundLinkProps(external?: boolean) {
  return external ? { target: '_blank' as const, rel: 'noopener noreferrer' } : {};
}

function MegaMenu({ which, onClose }: { which: string; onClose: () => void }) {
  const content = getMenuContent(which);
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const router = useRouter();

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
                    {...outboundLinkProps(it.external)}
                  >
                    <div className="tb-v2-mm-more-icon"><Ic className="tb-v2-ic" /></div>
                    <div className="tb-v2-mm-more-txt">
                      <div className="tb-v2-mm-more-title">
                        {it.label}
                        {it.external && <span className="tb-v2-sr"> (opens in a new tab)</span>}
                      </div>
                      <div className="tb-v2-mm-more-desc">{it.desc}</div>
                    </div>
                    {it.kbd && <span className="tb-v2-kbd tb-v2-mm-more-kbd">{it.kbd}</span>}
                  </Link>
                );
              })}
              {content.installApp && col.label === 'Product' && <InstallAppMoreRow onClose={onClose} />}
            </div>
          ))}
        </div>
        <div className="tb-v2-mm-more-foot">
          <div className="tb-v2-mm-tip">
            <div className="tb-v2-mm-tip-label">{content.tip.title}</div>
            <div className="tb-v2-mm-tip-body">{content.tip.body}</div>
          </div>
          {content.status && (
            <div className="tb-v2-mm-status">
              <span className="tb-v2-mm-dot" />
              <span>{content.status}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const activeCat = content.sidebar[activeIdx]?.cat ?? null;
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
          const active = activeIdx === i;
          const handleClick = () => {
            if (s.slug) router.push(getToolPathBySlug(s.slug));
            else router.push(getCategoryPath(s.cat));
            onClose();
          };
          return (
            <button
              key={i}
              type="button"
              className={`tb-v2-mm-side-row${active ? ' on' : ''}`}
              onMouseEnter={() => setActiveIdx(i)}
              onClick={handleClick}
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
                    href={getToolPath(t)}
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
                  href={getToolPath(t)}
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

        {which !== 'tools' && content.list && content.list.length > 0 && (
          <div>
            <div className="tb-v2-mm-label">{content.listLabel}</div>
            <div className="tb-v2-mm-list">
              {content.list.map((slug) => {
                const t = tools.find((x) => x.slug === slug);
                const name =
                  t?.name ??
                  slug
                    .split('-')
                    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                    .join(' ');
                const href = t ? getToolPath(t) : content.ctaTarget;
                return (
                  <Link
                    key={slug}
                    href={href}
                    className="tb-v2-mm-list-row"
                    onClick={onClose}
                  >
                    {name}
                  </Link>
                );
              })}
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

type Props = {
  desktopWhich: string | null;
  mobileOpen: boolean;
  mobileExpanded: string | null;
  menus: Array<{ key: string; label: string; href?: string }>;
  hasUser: boolean;
  onCloseDesktop: () => void;
  onCloseMobile: () => void;
  onToggleMobileSection: (key: string) => void;
  onCancelClose: () => void;
  onScheduleClose: () => void;
};

export default function NavPanels({
  desktopWhich, mobileOpen, mobileExpanded, menus, hasUser,
  onCloseDesktop, onCloseMobile, onToggleMobileSection,
  onCancelClose, onScheduleClose,
}: Props) {
  return (
    <>
      {desktopWhich && (
        <div
          className="tb-v2-mm-anchor"
          onMouseEnter={onCancelClose}
          onMouseLeave={onScheduleClose}
        >
          <MegaMenu which={desktopWhich} onClose={onCloseDesktop} />
        </div>
      )}

      {mobileOpen && (
        <div className="tb-v2-nav-mobile-sheet open">
          {menus.map((menu) => {
            if (menu.href) {
              return (
                <Link key={menu.key} href={menu.href} onClick={onCloseMobile}>
                  {menu.label}
                </Link>
              );
            }
            const content = getMenuContent(menu.key);
            const expanded = mobileExpanded === menu.key;
            return (
              <div key={menu.key} className="tb-v2-nav-mobile-group">
                <button
                  type="button"
                  className="tb-v2-nav-mobile-section"
                  onClick={() => onToggleMobileSection(menu.key)}
                  aria-expanded={expanded}
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
                        href={s.slug ? getToolPathBySlug(s.slug) : getCategoryPath(s.cat)}
                        onClick={onCloseMobile}
                      >
                        {s.label}
                      </Link>
                    ))}
                    <Link href={content.ctaTarget} onClick={onCloseMobile}>
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
                          onClick={onCloseMobile}
                          {...outboundLinkProps(it.external)}
                        >
                          {it.label}
                          {it.external && <span className="tb-v2-sr"> (opens in a new tab)</span>}
                        </Link>
                      )),
                    )}
                    {content.installApp && (
                      <InstallAppMoreRow
                        variant="mobile"
                        onClose={onCloseMobile}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
          <div className="tb-v2-nav-mobile-divider" />
          <Link href="/tools" onClick={onCloseMobile}>All Tools</Link>
          {hasUser && (
            <Link href="/dashboard" onClick={onCloseMobile}>Dashboard</Link>
          )}
          <Link href="/login" onClick={onCloseMobile}>Sign in</Link>
        </div>
      )}
    </>
  );
}
