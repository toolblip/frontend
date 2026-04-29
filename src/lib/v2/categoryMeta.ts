export interface CategoryMeta {
  bg: string;
  color: string;
}

const META: Record<string, CategoryMeta> = {
  Text: { bg: 'var(--c-txt-bg)', color: 'var(--c-txt)' },
  Developer: { bg: 'var(--c-dev-bg)', color: 'var(--c-dev)' },
  Image: { bg: 'var(--c-img-bg)', color: 'var(--c-img)' },
  SEO: { bg: 'var(--c-seo-bg)', color: 'var(--c-seo)' },
  Color: { bg: 'var(--c-col-bg)', color: 'var(--c-col)' },
  Encoder: { bg: 'var(--c-enc-bg)', color: 'var(--c-enc)' },
  Conversion: { bg: 'var(--c-util-bg)', color: 'var(--c-util)' },
  Math: { bg: 'var(--amber-tint)', color: '#7a4e00' },
  CSS: { bg: 'var(--blue-tint)', color: '#1d3fa0' },
};

export function getCategoryMeta(category: string): CategoryMeta {
  return META[category] ?? { bg: 'var(--surface-2)', color: 'var(--fg-1)' };
}
