export interface Tool {
  name: string;
  slug: string;
  description: string;
  emoji: string;
  category: string;
}

export const tools: Tool[] = [
  { name: 'Word Counter', slug: 'word-counter', description: 'Count words, characters, sentences, paragraphs, and reading time instantly.', emoji: '📝', category: 'Text' },
  { name: 'Character Counter', slug: 'character-counter', description: 'Count characters with Twitter, LinkedIn, and meta tag limit indicators.', emoji: '🔢', category: 'Text' },
  { name: 'Remove Duplicate Lines', slug: 'remove-duplicate-lines', description: 'Paste text, remove duplicate lines in one click. Case-sensitive option included.', emoji: '🗑️', category: 'Text' },
  { name: 'Case Converter', slug: 'case-converter', description: 'Convert text between UPPERCASE, lowercase, camelCase, snake_case, and more.', emoji: '✏️', category: 'Text' },
  { name: 'Lorem Ipsum Generator', slug: 'lorem-ipsum-generator', description: 'Generate placeholder Lorem Ipsum text in paragraphs, sentences, or list format.', emoji: '📜', category: 'Text' },
  { name: 'Grammar Checker', slug: 'grammar-checker', description: 'Check spelling and grammar errors in your text with suggestions and corrections.', emoji: '✅', category: 'Text' },
  { name: 'Readability Score', slug: 'readability-score', description: 'Calculate Flesch-Kincaid and other readability scores for your text content.', emoji: '📊', category: 'Text' },
  { name: 'Text Sorter', slug: 'text-sorter', description: 'Sort lines alphabetically, reverse, case-insensitive, or by length in one click.', emoji: '🔃', category: 'Text' },
  { name: 'JSON Formatter', slug: 'json-formatter', description: 'Format, validate, and minify JSON with error highlighting.', emoji: '📋', category: 'Developer' },
  { name: 'Base64 Encode / Decode', slug: 'base64', description: 'Encode and decode Base64 text or files instantly in your browser.', emoji: '🔐', category: 'Encoder' },
  { name: 'URL Encode / Decode', slug: 'url-encode', description: 'Encode and decode URLs or URL components for safe use in links.', emoji: '🔗', category: 'Encoder' },
  { name: 'Image Cropper', slug: 'image-cropper', description: 'Crop images to any ratio or preset size — passport, 16:9, square, and more.', emoji: '✂️', category: 'Image' },
  { name: 'Image Format Converter', slug: 'image-format-converter', description: 'Convert images between JPEG, PNG, WebP, and AVIF with quality control and side-by-side preview.', emoji: '🖼️', category: 'Image' },
  { name: 'Favicon Generator', slug: 'favicon-generator', description: 'Generate favicon.ico and app icons from any image or emoji with live preview.', emoji: '🌐', category: 'Image' },
  { name: 'Image Resizer', slug: 'image-resizer', description: 'Resize images to standard dimensions with aspect ratio lock and batch resize support.', emoji: '📐', category: 'Image' },
  { name: 'UUID Generator', slug: 'uuid-generator', description: "Generate one or many UUID v4 values using your browser's crypto API.", emoji: '🔑', category: 'Developer' },
  { name: 'Markdown to HTML', slug: 'markdown-to-html', description: 'Convert Markdown to HTML with a live split-pane preview.', emoji: '📄', category: 'Developer' },
  { name: 'YAML to JSON', slug: 'yaml-to-json', description: 'Convert YAML to JSON instantly with pretty-print, compact output, and custom indent size.', emoji: '🔄', category: 'Conversion' },
  { name: 'Cron Expression Parser', slug: 'cron-parser', description: 'Parse and validate cron expressions with human-readable descriptions and next 5 run times.', emoji: '⏱️', category: 'Developer' },
  { name: 'Hash Generator', slug: 'hash-generator', description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes using your browser's native crypto API.", emoji: '#️⃣', category: 'Developer' },
  { name: 'Screen Resolution Tester', slug: 'screen-resolution-tester', description: 'Test any screen resolution or viewport size with device presets, custom dimensions, and a live scaled preview.', emoji: '🖥️', category: 'Developer' },
  { name: 'URL Slug Generator', slug: 'url-slug-generator', description: 'Convert any text into URL-friendly slugs with customizable separator and length limit.', emoji: '🔗', category: 'Developer' },
  { name: 'Regex Tester', slug: 'regex-tester', description: 'Test regular expressions against any text with match highlighting and pattern explanations.', emoji: '🔍', category: 'Developer' },
  { name: 'JWT Decoder', slug: 'jwt-decoder', description: 'Decode and inspect JWT tokens — header, payload, and signature — in real time.', emoji: '🎫', category: 'Developer' },
  { name: 'Cron Expression Generator', slug: 'cron-generator', description: 'Build cron expressions visually with an interactive scheduler and human-readable preview.', emoji: '🕐', category: 'Developer' },
  { name: 'HTTP Headers Viewer', slug: 'http-headers-viewer', description: 'View HTTP request and response headers for any URL with timing breakdown.', emoji: '📦', category: 'Developer' },
  { name: 'Port Scanner', slug: 'port-scanner', description: 'Scan common ports on a host to check for open services and availability.', emoji: '🚪', category: 'Developer' },
  { name: 'Meta Tag Generator', slug: 'meta-tag-generator', description: 'Generate SEO meta tags, Open Graph, and Twitter Card tags for any webpage.', emoji: '🏷️', category: 'SEO' },
  { name: 'SERP Preview', slug: 'serp-preview', description: 'Preview how your page appears in Google search results with title and meta snippet.', emoji: '🔎', category: 'SEO' },
  { name: 'Color Picker', slug: 'color-picker', description: 'Pick any color and get HEX, RGB, HSL, and CSS values with a live preview swatch.', emoji: '🎨', category: 'Color' },
  { name: 'Contrast Checker', slug: 'contrast-checker', description: 'Check color contrast ratios for WCAG AA and AAA accessibility compliance.', emoji: '♿', category: 'Color' },
  { name: 'Unit Converter', slug: 'unit-converter', description: 'Convert length, weight, temperature, and more between metric and imperial units instantly.', emoji: '⚖️', category: 'Conversion' },
  { name: 'Number Base Converter', slug: 'number-base-converter', description: 'Convert numbers between binary, decimal, hexadecimal, and octal bases instantly.', emoji: '🔢', category: 'Conversion' },
  { name: 'Percentage Calculator', slug: 'percentage-calculator', description: 'Calculate percentages, percentage change, tips, and discounts instantly.', emoji: '%️⃣', category: 'Math' },
  { name: 'CSS Border Radius Generator', slug: 'css-border-radius-generator', description: 'Visually generate CSS border-radius values with per-corner controls, live preview, and one-click copy.', emoji: '⬜', category: 'CSS' },
  { name: 'CSS Gradient Generator', slug: 'css-gradient-generator', description: 'Create linear, radial, and conic CSS gradients with a live preview, color stops, angle control, and preset library.', emoji: '🌈', category: 'CSS' },
];

export const categories = ['All', 'Text', 'Developer', 'Encoder', 'Image', 'SEO', 'Color', 'Conversion', 'Math', 'CSS'] as const;
