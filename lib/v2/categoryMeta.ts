import type { ComponentType, SVGProps } from 'react';
import {
  IconDev, IconText, IconImage, IconColor, IconConv, IconSEO, IconCSS,
  IconNet, IconEnc, IconUtil, IconMath, IconMCP, IconAI,
} from '@/components/v2/icons';

type IconComp = ComponentType<SVGProps<SVGSVGElement>>;

export type CategoryMeta = {
  icon: IconComp;
  color: string;
  bg: string;
};

export const CAT_META: Record<string, CategoryMeta> = {
  Developer:  { icon: IconDev,   color: 'var(--c-dev)',  bg: 'var(--c-dev-bg)'  },
  Text:       { icon: IconText,  color: 'var(--c-txt)',  bg: 'var(--c-txt-bg)'  },
  Image:      { icon: IconImage, color: 'var(--c-img)',  bg: 'var(--c-img-bg)'  },
  Color:      { icon: IconColor, color: 'var(--c-col)',  bg: 'var(--c-col-bg)'  },
  Conversion: { icon: IconConv,  color: 'var(--c-conv)', bg: 'var(--c-conv-bg)' },
  SEO:        { icon: IconSEO,   color: 'var(--c-seo)',  bg: 'var(--c-seo-bg)'  },
  CSS:        { icon: IconCSS,   color: 'var(--c-css)',  bg: 'var(--c-css-bg)'  },
  Network:    { icon: IconNet,   color: 'var(--c-net)',  bg: 'var(--c-net-bg)'  },
  Encoder:    { icon: IconEnc,   color: 'var(--c-enc)',  bg: 'var(--c-enc-bg)'  },
  Utility:    { icon: IconUtil,  color: 'var(--c-util)', bg: 'var(--c-util-bg)' },
  Math:       { icon: IconMath,  color: 'var(--c-math)', bg: 'var(--c-math-bg)' },
  MCP:        { icon: IconMCP,   color: 'var(--c-mcp)',  bg: 'var(--c-mcp-bg)'  },
  'AI/ML':    { icon: IconAI,    color: 'var(--c-aiml)', bg: 'var(--c-aiml-bg)' },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return CAT_META[category] ?? { icon: IconUtil, color: 'var(--fg-1)', bg: 'var(--surface-2)' };
}

export function categoryAnchor(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
}
