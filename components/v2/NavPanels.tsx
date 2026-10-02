'use client';

import Link from 'next/link';
import InstallAppMoreRow from './InstallAppMoreRow';
import { aiMcpMenu } from '@/data/ai-mcp-menu';
import { getCategoryMeta } from '@/lib/v2/categoryMeta';
import { tools, type Tool } from '@/data/tools';
import { getCategoryPath, getToolPath, getToolPathBySlug } from '@/lib/tool-path';
import {
  IconChevronDown, IconArrow, IconFile, IconZap, IconShield, IconGift,
  IconCommand, IconHelp, IconUtil, IconGlobe, IconLink, IconCode, IconClock, IconHash,
} from './icons';

type IconComp = React.ComponentType<React.SVGProps<SVGSVGElement>>;

type NavCatSpec = {
  cat: string;
  label: string;
  tier: 'main' | 'compact';
  limit: number;
  picks: string[];
};

/** Curated links, then the next live tools in that category if a slug was removed. */
const NAV_CATS: NavCatSpec[] = [
  { cat: 'Developer', label: 'Developer', tier: 'main', limit: 4, picks: ['json-formatter', 'jwt-decoder', 'regex-tester', 'uuid-generator', 'sha256-hash-generator', 'password-generator'] },
  { cat: 'Text', label: 'Text', tier: 'main', limit: 4, picks: ['word-counter', 'case-converter', 'lorem-ipsum-generator', 'character-counter', 'remove-duplicate-lines'] },
  { cat: 'Image', label: 'Image', tier: 'main', limit: 4, picks: ['image-resizer', 'image-cropper', 'image-compressor', 'image-format-converter'] },
  { cat: 'Conversion', label: 'Conversion', tier: 'main', limit: 4, picks: ['json-yaml-converter', 'unit-converter', 'html-to-markdown', 'timestamp-converter'] },
  { cat: 'SEO', label: 'SEO', tier: 'main', limit: 4, picks: ['meta-tag-generator', 'xml-sitemap-generator', 'robots-txt-generator', 'open-graph-preview'] },
  { cat: 'Color', label: 'Color', tier: 'main', limit: 4, picks: ['color-palette-generator', 'contrast-checker', 'color-picker', 'color-mixer'] },
  { cat: 'Utility', label: 'Utility', tier: 'main', limit: 4, picks: ['random-number-generator', 'countdown-timer', 'age-calculator', 'uptime-calculator'] },
  { cat: 'PDF Tools', label: 'PDF', tier: 'main', limit: 4, picks: ['merge-pdfs', 'sign-pdf', 'edit-pdf', 'extract-images-from-pdf'] },
  { cat: 'CSS', label: 'CSS', tier: 'compact', limit: 0, picks: [] },
  { cat: 'Math', label: 'Math', tier: 'compact', limit: 0, picks: [] },
  { cat: 'Network', label: 'Network', tier: 'compact', limit: 0, picks: [] },
  { cat: 'Encoder', label: 'Encoder', tier: 'compact', limit: 0, picks: [] },
  { cat: 'Document Generator', label: 'Documents', tier: 'compact', limit: 0, picks: [] },
  { cat: 'Video Tools', label: 'Video', tier: 'compact', limit: 0, picks: [] },
];

type BuiltCat = { cat: string; label: string; count: number; tools: Tool[] };

function toolsIn(cat: string): Tool[] {
  return tools.filter((tool) => tool.category === cat);
}

function pickTools(cat: string, picks: string[], limit: number): Tool[] {
  const pool = toolsIn(cat);
  const chosen: Tool[] = [];
  const seen = new Set<string>();
  for (const slug of picks) {
    const tool = pool.find((item) => item.slug === slug);
    if (tool && !seen.has(tool.slug)) {
      chosen.push(tool);
      seen.add(tool.slug);
    }
    if (chosen.length >= limit) break;
  }
  for (const tool of pool) {
    if (chosen.length >= limit) break;
    if (!seen.has(tool.slug)) {
      chosen.push(tool);
      seen.add(tool.slug);
    }
  }
  return chosen;
}

function builtCategories(): { main: BuiltCat[]; compact: BuiltCat[] } {
  const known = new Set(NAV_CATS.map((spec) => spec.cat));
  const specs: NavCatSpec[] = [
    ...NAV_CATS,
    ...Array.from(new Set(tools.map((tool) => tool.category)))
      .filter((cat) => !known.has(cat))
      .map((cat) => ({ cat, label: cat, tier: 'compact' as const, limit: 0, picks: [] })),
  ];

  const built = specs.flatMap((spec): BuiltCat[] => {
    const pool = toolsIn(spec.cat);
    if (pool.length === 0) return [];
    return [{
      cat: spec.cat,
      label: spec.label,
      count: pool.length,
      tools: spec.limit > 0 ? pickTools(spec.cat, spec.picks, spec.limit) : [],
    }];
  });

  const tierOf = (cat: string) => NAV_CATS.find((spec) => spec.cat === cat)?.tier ?? 'compact';
  const main = built.filter((cat) => tierOf(cat.cat) === 'main');
  const compact = built.filter((cat) => tierOf(cat.cat) === 'compact');
  const remainder = main.length % 4;
  if (remainder !== 0) compact.unshift(...main.splice(main.length - remainder));
  return { main, compact };
}

type SidebarCatItem = { cat: string; label: string; desc: string; slug?: string };
type FeaturedItem = { slug: string; name: string; category: string; description: string };
type LearnItem = { label: string; desc: string };
type MoreItem = {
  icon: string;
  label: string;
  desc: string;
  href: string;
  kbd?: string;
  native?: boolean;
  external?: boolean;
};
type MoreCol = {
  label: string;
  items: MoreItem[];
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
  if (key === 'tools') {
    const { main, compact } = builtCategories();
    return {
      more: false,
      sidebarLabel: 'Categories',
      sidebar: [...main, ...compact].map((cat) => ({
        cat: cat.cat,
        label: cat.label,
        desc: `${cat.count} tools`,
      })),
      featuredLabel: 'Featured',
      featured: [],
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
            { icon: 'zap', label: 'Toolblip Pro', desc: 'Higher limits, history, team vault', href: '/pricing' },
            { icon: 'gift', label: 'Support Toolblip', desc: 'Keep the free tools running', href: '/donate' },
            { icon: 'file', label: 'Submit a tool', desc: 'Suggest a free tool for the directory', href: '/submit-tool' },
            { icon: 'util', label: 'Sponsors', desc: 'Who is on the strip this month', href: '/sponsors' },
          ],
        },
        {
          label: 'Resources',
          items: [
            { icon: 'file', label: 'API Docs', desc: 'REST endpoints and examples', href: '/api-docs' },
            { icon: 'zap', label: 'Blog', desc: 'Notes on building small tools', href: '/blog' },
            { icon: 'globe', label: 'Status', desc: 'Frontend health', href: '/frontend-health' },
            { icon: 'link', label: 'Sitemap', desc: 'Every public page', href: '/sitemap.xml', native: true },
          ],
        },
        {
          label: 'Company',
          items: [
            { icon: 'help', label: 'About', desc: 'Who makes this, and why', href: '/about' },
            { icon: 'util', label: 'Our products', desc: 'Other work from the same team', href: '/products' },
            { icon: 'shield', label: 'Privacy', desc: 'We do the boring thing: nothing', href: '/privacy' },
            { icon: 'command', label: 'Terms', desc: 'The short, plain-English version', href: '/terms' },
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

function CategoryMark({ cat }: { cat: string }) {
  const meta = getCategoryMeta(cat);
  const Ic = meta.icon;
  return (
    <span
      className="tb-v2-mm-cat-head-icon"
      style={{ '--cat-color': meta.color, '--cat-bg': meta.bg } as React.CSSProperties}
    >
      <Ic className="tb-v2-ic" />
    </span>
  );
}

function ToolsDirectory({ onClose }: { onClose: () => void }) {
  const { main, compact } = builtCategories();
  return (
    <div className="tb-v2-mega-menu tb-v2-mega-tools">
      <div className="tb-v2-mm-cat-grid">
        {main.map((cat) => (
          <div key={cat.cat} className="tb-v2-mm-cat-block">
            <Link href={getCategoryPath(cat.cat)} className="tb-v2-mm-cat-head" onClick={onClose}>
              <CategoryMark cat={cat.cat} />
              <span className="tb-v2-mm-cat-head-title">{cat.label}</span>
              <span className="tb-v2-mm-cat-head-count">{cat.count}</span>
            </Link>
            <div className="tb-v2-mm-cat-links">
              {cat.tools.map((tool) => (
                <Link
                  key={tool.slug}
                  href={getToolPath(tool)}
                  className="tb-v2-mm-list-row"
                  onClick={onClose}
                  prefetch={false}
                >
                  {tool.name}
                </Link>
              ))}
            </div>
            <Link href={getCategoryPath(cat.cat)} className="tb-v2-mm-cat-all" onClick={onClose}>
              See all {cat.count}
            </Link>
          </div>
        ))}
      </div>
      {compact.length > 0 && (
        <div className="tb-v2-mm-cat-strip">
          {compact.map((cat) => (
            <Link
              key={cat.cat}
              href={getCategoryPath(cat.cat)}
              className="tb-v2-mm-cat-chip"
              onClick={onClose}
            >
              <CategoryMark cat={cat.cat} />
              <span className="tb-v2-mm-cat-head-title">{cat.label}</span>
              <span className="tb-v2-mm-cat-head-count">{cat.count}</span>
            </Link>
          ))}
        </div>
      )}
      <div className="tb-v2-mm-foot">
        <span className="tb-v2-mm-cat-foot-note">{tools.length} tools, grouped by category</span>
        <Link href="/tools" className="tb-v2-mm-cta" onClick={onClose}>
          All Tools <IconArrow className="tb-v2-ic" />
        </Link>
      </div>
    </div>
  );
}

function MoreLink({ item, onClose }: { item: MoreItem; onClose: () => void }) {
  const Ic = MORE_ICONS[item.icon] ?? IconUtil;
  const body = (
    <>
      <div className="tb-v2-mm-more-icon"><Ic className="tb-v2-ic" /></div>
      <div className="tb-v2-mm-more-txt">
        <div className="tb-v2-mm-more-title">
          {item.label}
          {item.external && <span className="tb-v2-sr"> (opens in a new tab)</span>}
        </div>
        <div className="tb-v2-mm-more-desc">{item.desc}</div>
      </div>
      {item.kbd && <span className="tb-v2-kbd tb-v2-mm-more-kbd">{item.kbd}</span>}
    </>
  );
  if (item.native) {
    return (
      <a href={item.href} className="tb-v2-mm-more-row" onClick={onClose}>
        {body}
      </a>
    );
  }
  return (
    <Link
      href={item.href}
      className="tb-v2-mm-more-row"
      onClick={onClose}
      {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {body}
    </Link>
  );
}

function MegaMenu({ which, onClose }: { which: string; onClose: () => void }) {
  const content = getMenuContent(which);
  if (!content) return null;
  if (!content.more) return <ToolsDirectory onClose={onClose} />;

  return (
    <div className="tb-v2-mega-menu tb-v2-mega-more">
      <div className={`tb-v2-mm-cols${content.columns.length === 2 ? ' tb-v2-mm-cols-2' : ''}`}>
        {content.columns.map((col) => (
          <div key={col.label} className="tb-v2-mm-col">
            <div className="tb-v2-mm-label">{col.label}</div>
            {col.items.map((item) => (
              <MoreLink key={item.href} item={item} onClose={onClose} />
            ))}
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
                      col.items.map((it) => {
                        const label = (
                          <>
                            {it.label}
                            {it.external && <span className="tb-v2-sr"> (opens in a new tab)</span>}
                          </>
                        );
                        if (it.native) {
                          return (
                            <a key={`${col.label}-${it.href}`} href={it.href} onClick={onCloseMobile}>
                              {label}
                            </a>
                          );
                        }
                        return (
                          <Link
                            key={`${col.label}-${it.href}`}
                            href={it.href}
                            onClick={onCloseMobile}
                            {...(it.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          >
                            {label}
                          </Link>
                        );
                      }),
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
