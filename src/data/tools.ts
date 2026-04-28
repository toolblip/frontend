export type Category =
  | 'All'
  | 'Text'
  | 'Developer'
  | 'Encoder'
  | 'Image'
  | 'Conversion'
  | 'Math'
  | 'CSS'
  | 'SEO'
  | 'Color';

export interface Tool {
  slug: string;
  name: string;
  emoji: string;
  category: Exclude<Category, 'All'>;
  description: string;
}

export const tools: Tool[] = [
  // ── Text ─────────────────────────────────────────────────────────
  {
    slug: 'word-counter',
    name: 'Word Counter',
    emoji: '✍️',
    category: 'Text',
    description:
      'Count words, characters, sentences, and paragraphs. Get reading time estimates instantly.',
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    emoji: '🔢',
    category: 'Text',
    description:
      'Track character count with limits for Twitter, LinkedIn, Reddit, and meta descriptions.',
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    emoji: '🔤',
    category: 'Text',
    description:
      'Convert text to uppercase, lowercase, camelCase, snake_case, kebab-case, Title Case, and more.',
  },
  {
    slug: 'lorem-ipsum',
    name: 'Lorem Ipsum Generator',
    emoji: '📝',
    category: 'Text',
    description:
      'Generate placeholder lorem ipsum text. Choose paragraph count, format, and length.',
  },
  {
    slug: 'grammar-checker',
    name: 'Grammar Checker',
    emoji: '✅',
    category: 'Text',
    description:
      'Check your writing for grammar, spelling, and style issues. Get suggestions instantly.',
  },
  {
    slug: 'readability-score',
    name: 'Readability Score',
    emoji: '📊',
    category: 'Text',
    description:
      'Check the readability level of your text using Flesch-Kincaid and other scoring systems.',
  },
  {
    slug: 'text-sorter',
    name: 'Text Sorter',
    emoji: '🔃',
    category: 'Text',
    description: 'Sort lines of text alphabetically, reverse alphabetically, or by length.',
  },

  // ── Developer ─────────────────────────────────────────────────────
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    emoji: '📋',
    category: 'Developer',
    description:
      'Format, minify, and validate JSON. Paste your code and get clean, readable output.',
  },
  {
    slug: 'regex-tester',
    name: 'Regex Tester',
    emoji: '🎯',
    category: 'Developer',
    description:
      'Test and debug regular expressions in real time with match highlighting and pattern explanations.',
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    emoji: '🔏',
    category: 'Developer',
    description:
      'Generate MD5, SHA-1, SHA-256, and other hash digests from any text or file.',
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    emoji: '🆔',
    category: 'Developer',
    description:
      'Generate UUIDs v1, v4, and v7 instantly. Copy to clipboard with one click.',
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    emoji: '🔓',
    category: 'Developer',
    description:
      'Decode and inspect JSON Web Tokens. View header, payload, and signature details.',
  },
  {
    slug: 'cron-generator',
    name: 'Cron Generator',
    emoji: '⏰',
    category: 'Developer',
    description:
      'Build and validate cron schedule expressions with a visual editor and human-readable output.',
  },
  {
    slug: 'http-headers-viewer',
    name: 'HTTP Headers Viewer',
    emoji: '🌐',
    category: 'Developer',
    description:
      'Inspect HTTP response headers for any URL. See security headers, caching rules, and more.',
  },
  {
    slug: 'javascript-minifier',
    name: 'JavaScript Minifier',
    emoji: '⚡',
    category: 'Developer',
    description:
      'Minify JavaScript code to reduce file size. Paste your JS and get optimized output.',
  },
  {
    slug: 'port-scanner',
    name: 'Port Scanner',
    emoji: '🔍',
    category: 'Developer',
    description:
      'Check if common ports are open on a target host. Quick network diagnostics tool.',
  },

  // ── Encoder ──────────────────────────────────────────────────────
  {
    slug: 'base64',
    name: 'Base64 Encoder',
    emoji: '📄',
    category: 'Encoder',
    description:
      'Encode and decode Base64 strings. Works with text and file inputs.',
  },
  {
    slug: 'url-encode',
    name: 'URL Encoder',
    emoji: '🔗',
    category: 'Encoder',
    description:
      'Encode or decode URL components. Safely escape special characters for web use.',
  },
  {
    slug: 'html-encoder',
    name: 'HTML Encoder',
    emoji: '🏷️',
    category: 'Encoder',
    description:
      'Encode and decode HTML entities. Escape special characters for safe web display.',
  },

  // ── Image ────────────────────────────────────────────────────────
  {
    slug: 'image-cropper',
    name: 'Image Cropper',
    emoji: '✂️',
    category: 'Image',
    description:
      'Crop images to exact dimensions. Supports square, portrait, and landscape ratios.',
  },
  {
    slug: 'image-resizer',
    name: 'Image Resizer',
    emoji: '📐',
    category: 'Image',
    description:
      'Resize images to specific width and height. Maintain aspect ratio or set custom dimensions.',
  },
  {
    slug: 'favicon-generator',
    name: 'Favicon Generator',
    emoji: '🌟',
    category: 'Image',
    description:
      'Generate favicon files from any image. Supports ICO, PNG, and SVG output formats.',
  },

  // ── Conversion ───────────────────────────────────────────────────
  {
    slug: 'unit-converter',
    name: 'Unit Converter',
    emoji: '🔄',
    category: 'Conversion',
    description:
      'Convert between units of length, weight, temperature, and more. Fast and accurate.',
  },
  {
    slug: 'yaml-to-json',
    name: 'YAML to JSON',
    emoji: '📄',
    category: 'Conversion',
    description:
      'Convert YAML to JSON and vice versa. Handles complex nested structures.',
  },
  {
    slug: 'number-base-converter',
    name: 'Number Base Converter',
    emoji: '🔢',
    category: 'Conversion',
    description:
      'Convert between binary, octal, decimal, hexadecimal, and other number bases.',
  },

  // ── Math ─────────────────────────────────────────────────────────
  {
    slug: 'math-evaluator',
    name: 'Math Evaluator',
    emoji: '🔢',
    category: 'Math',
    description:
      'Evaluate mathematical expressions. Supports arithmetic, trigonometry, logarithms, and more.',
  },

  // ── CSS ───────────────────────────────────────────────────────────
  {
    slug: 'css-minifier',
    name: 'CSS Minifier',
    emoji: '🎨',
    category: 'CSS',
    description:
      'Minify CSS code to reduce file size. Remove whitespace, comments, and optimize rules.',
  },
  {
    slug: 'css-generator',
    name: 'CSS Generator',
    emoji: '🖌️',
    category: 'CSS',
    description:
      'Generate CSS for borders, gradients, shadows, and animations with a visual editor.',
  },

  // ── SEO ───────────────────────────────────────────────────────────
  {
    slug: 'meta-tag-generator',
    name: 'Meta Tag Generator',
    emoji: '🏷️',
    category: 'SEO',
    description:
      'Generate Open Graph and Twitter Card meta tags. Preview how your links look on social media.',
  },
  {
    slug: 'serp-preview',
    name: 'SERP Preview',
    emoji: '🔍',
    category: 'SEO',
    description:
      'Preview how your page appears in Google search results. Optimize titles and descriptions.',
  },

  // ── Color ────────────────────────────────────────────────────────
  {
    slug: 'color-picker',
    name: 'Color Picker',
    emoji: '🎨',
    category: 'Color',
    description:
      'Pick colors and convert between HEX, RGB, HSL, and other formats. Copy code instantly.',
  },
  {
    slug: 'contrast-checker',
    name: 'Contrast Checker',
    emoji: '👁️',
    category: 'Color',
    description:
      'Check color contrast ratios for WCAG accessibility compliance. AA and AAA pass indicators.',
  },
];
