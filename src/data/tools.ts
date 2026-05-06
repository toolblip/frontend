export interface Tool {
  slug: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  tags?: string[];
}

export const tools: Tool[] = [
  {
    slug: 'word-counter',
    name: 'Word Counter',
    emoji: '📝',
    description: 'Count words, characters, sentences, paragraphs, and estimate reading time for any text. Useful for essays, articles, and social media posts.',
    category: 'Text',
    tags: ['text', 'words', 'count', 'writing'],
  },
  {
    slug: 'character-counter',
    name: 'Character Counter',
    emoji: '🔤',
    description: 'Count characters with and without spaces. See how your text fits within popular platform limits like Twitter (280), LinkedIn (3000), and more.',
    category: 'Text',
    tags: ['text', 'characters', 'count', 'social media'],
  },
  {
    slug: 'case-converter',
    name: 'Case Converter',
    emoji: '🔠',
    description: 'Convert text between different casing styles: UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE.',
    category: 'Text',
    tags: ['text', 'case', 'convert', 'format'],
  },
  {
    slug: 'base64',
    name: 'Base64 Encode/Decode',
    emoji: '🔐',
    description: 'Encode plain text to Base64 or decode Base64 back to plain text. Essential for data transmission, API work, and encoding binary data in text formats.',
    category: 'Encoding',
    tags: ['base64', 'encode', 'decode', 'encoding'],
  },
  {
    slug: 'base64-encode',
    name: 'Base64 Encoder',
    emoji: '🔐',
    description: 'Encode plain text to Base64 format. Works with Unicode characters and special symbols.',
    category: 'Encoding',
    tags: ['base64', 'encode', 'encoding'],
  },
  {
    slug: 'base64-encoder-decoder',
    name: 'Base64 Encoder/Decoder',
    emoji: '🔐',
    description: 'Encode or decode Base64 strings. Bidirectional conversion with Unicode support.',
    category: 'Encoding',
    tags: ['base64', 'encode', 'decode', 'encoding'],
  },
  {
    slug: 'url-encode',
    name: 'URL Encode/Decode',
    emoji: '🔗',
    description: 'Percent-encode special characters in URLs or decode percent-encoded strings. Essential for query parameters and URL manipulation.',
    category: 'Encoding',
    tags: ['url', 'encode', 'decode', 'encoding', 'percent'],
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder',
    emoji: '🔗',
    description: 'Encode text for safe use in URLs by percent-encoding special characters.',
    category: 'Encoding',
    tags: ['url', 'encode', 'encoding'],
  },
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    emoji: '📋',
    description: 'Format, minify, and validate JSON data. Paste your JSON and get clean, readable output or compact minified versions.',
    category: 'Developer',
    tags: ['json', 'format', 'validate', 'minify'],
  },
  {
    slug: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    emoji: '📜',
    description: 'Generate placeholder Lorem Ipsum text for design mockups and prototypes. Choose the number of paragraphs, words, or characters.',
    category: 'Text',
    tags: ['lorem', 'ipsum', 'placeholder', 'generator'],
  },
  {
    slug: 'password-generator',
    name: 'Password Generator',
    emoji: '🔑',
    description: 'Generate secure random passwords with customizable length and character sets. Includes options for uppercase, lowercase, numbers, and symbols.',
    category: 'Security',
    tags: ['password', 'generator', 'random', 'security'],
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    emoji: '🆔',
    description: 'Generate UUIDs (Universally Unique Identifiers) for your applications. Supports UUID v4 (random) generation.',
    category: 'Developer',
    tags: ['uuid', 'guid', 'generator', 'unique'],
  },
  {
    slug: 'wifi-qr-code-generator',
    name: 'WiFi QR Code Generator',
    emoji: '📶',
    description: 'Generate a QR code that your guests can scan to connect to your WiFi network. No more sharing passwords manually!',
    category: 'QR Codes',
    tags: ['wifi', 'qr', 'qrcode', 'network'],
  },
  {
    slug: 'qr-code-generator',
    name: 'QR Code Generator',
    emoji: '📱',
    description: 'Generate QR codes for URLs, text, WiFi credentials, contact info, and more. Download or share instantly.',
    category: 'QR Codes',
    tags: ['qr', 'qrcode', 'generator'],
  },
  {
    slug: 'mime-types-reference',
    name: 'MIME Types Reference',
    emoji: '📁',
    description: 'Look up MIME types for file extensions. Find the correct Content-Type header values for any file format.',
    category: 'Developer',
    tags: ['mime', 'content-type', 'reference', 'files'],
  },
  {
    slug: 'hash-generator',
    name: 'Hash Generator',
    emoji: '#️⃣',
    description: 'Generate MD5, SHA-1, SHA-256, SHA-512, and other cryptographic hashes from any text or file.',
    category: 'Security',
    tags: ['hash', 'md5', 'sha', 'crypto'],
  },
  {
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    emoji: '🎫',
    description: 'Decode and inspect JSON Web Tokens (JWT). View the header, payload, and signature of any JWT.',
    category: 'Developer',
    tags: ['jwt', 'token', 'decode', 'auth'],
  },
  {
    slug: 'color-converter',
    name: 'Color Converter',
    emoji: '🎨',
    description: 'Convert colors between HEX, RGB, RGBA, HSL, and HSLA formats. Get color codes for web development and design.',
    category: 'Design',
    tags: ['color', 'hex', 'rgb', 'hsl', 'converter'],
  },
  {
    slug: 'cron-parser',
    name: 'Cron Expression Parser',
    emoji: '⏰',
    description: 'Parse and validate cron expressions. See the next scheduled run times for any cron expression.',
    category: 'Developer',
    tags: ['cron', 'schedule', 'parser', 'time'],
  },
  {
    slug: 'html-encoder-decoder',
    name: 'HTML Encoder/Decoder',
    emoji: '🏷️',
    description: 'Encode HTML entities or decode HTML entities back to regular text. Essential for preventing XSS and safely displaying user content.',
    category: 'Encoding',
    tags: ['html', 'encode', 'decode', 'entities'],
  },
];

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find(t => t.slug === slug);
}
