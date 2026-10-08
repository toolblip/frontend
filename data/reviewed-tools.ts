// Explicit reviewed tools for public discovery, independent of GSC measurements.
export const reviewedToolSlugs = [
  "jwt-decoder",
  "json-formatter",
  "regex-tester",
  "url-encode",
  "base64-encoder-decoder",
  "password-generator",
  "uuid-generator",
  "markdown-to-html",
  "case-converter",
  "word-counter",
  "reading-time-calculator",
  "image-resizer"
] as const;
export type ReviewedToolSlug = typeof reviewedToolSlugs[number];
export const reviewedRelatedTools: Record<ReviewedToolSlug, readonly string[]> = {
  "jwt-decoder": [
    "json-formatter",
    "base64-encoder-decoder",
    "url-encode"
  ],
  "json-formatter": [
    "json-tree-view",
    "jwt-decoder",
    "base64-encoder-decoder"
  ],
  "regex-tester": [
    "json-formatter",
    "case-converter",
    "word-counter"
  ],
  "url-encode": [
    "base64-encoder-decoder",
    "jwt-decoder",
    "json-formatter"
  ],
  "base64-encoder-decoder": [
    "base64-image-converter",
    "jwt-decoder"
  ],
  "password-generator": [
    "password-strength-checker",
    "uuid-generator"
  ],
  "uuid-generator": [
    "password-generator",
    "json-formatter"
  ],
  "markdown-to-html": [
    "word-counter",
    "reading-time-calculator",
    "json-formatter"
  ],
  "case-converter": [
    "word-counter",
    "reading-time-calculator"
  ],
  "word-counter": [
    "reading-time-calculator",
    "character-counter",
    "case-converter"
  ],
  "reading-time-calculator": [
    "word-counter",
    "case-converter"
  ],
  "image-resizer": [
    "batch-image-resizer",
    "image-cropper",
    "image-compressor"
  ]
};
export const publishedTutorialTools = {
  "2026-05-12-how-to-decode-jwt-tokens-safely-in-your-browser": [
    "jwt-decoder",
    "json-formatter"
  ],
  "2026-05-11-format-and-validate-json-online-without-uploading": [
    "json-formatter"
  ],
  "2026-05-16-base64-decode-online-without-uploading": [
    "base64-encoder-decoder"
  ],
  "2026-05-18-generate-secure-passwords-in-the-browser": [
    "password-generator"
  ],
  "2026-05-27-uuid-generator-for-api-testing": [
    "uuid-generator"
  ],
  "2026-07-08-convert-markdown-to-html-online-free": [
    "markdown-to-html"
  ],
  "2026-05-05-regex-lookahead-lookbehind-explained": [
    "regex-tester"
  ]
} as const satisfies Record<string, readonly ReviewedToolSlug[]>;
export type PublishedTutorialSlug = keyof typeof publishedTutorialTools;
