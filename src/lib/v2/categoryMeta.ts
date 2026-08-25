export interface CategoryMeta {
  color: string;
  bg: string;
}

/** Maps category names to their CSS variable keys defined in globals.css */
export function getCategoryMeta(category: string): CategoryMeta {
  switch (category) {
    case 'Developer':
      return { color: 'var(--c-dev)', bg: 'var(--c-dev-bg)' };
    case 'Text':
      return { color: 'var(--c-txt)', bg: 'var(--c-txt-bg)' };
    case 'Image':
      return { color: 'var(--c-img)', bg: 'var(--c-img-bg)' };
    case 'Conversion':
      return { color: 'var(--c-conv)', bg: 'var(--c-conv-bg)' };
    case 'CSS':
      return { color: 'var(--c-css)', bg: 'var(--c-css-bg)' };
    case 'Encoding':
    case 'Encoder':
      return { color: 'var(--c-enc)', bg: 'var(--c-enc-bg)' };
    case 'Design':
      return { color: 'var(--c-col)', bg: 'var(--c-col-bg)' };
    case 'Math':
      return { color: 'var(--c-math)', bg: 'var(--c-math-bg)' };
    case 'SEO':
      return { color: 'var(--c-seo)', bg: 'var(--c-seo-bg)' };
    case 'Security':
      return { color: 'var(--c-seo)', bg: 'var(--c-seo-bg)' };
    case 'QR Codes':
      return { color: 'var(--c-net)', bg: 'var(--c-net-bg)' };
    case 'MCP':
      return { color: 'var(--c-mcp)', bg: 'var(--c-mcp-bg)' };
    case 'AI/ML':
    case 'AI Tools':
      return { color: 'var(--c-aiml)', bg: 'var(--c-aiml-bg)' };
    default:
      return { color: 'var(--fg-1)', bg: 'var(--surface-2)' };
  }
}
