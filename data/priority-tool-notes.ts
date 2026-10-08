import type { ReviewedToolSlug } from '@/data/reviewed-tools';

export const priorityToolLimits: Record<ReviewedToolSlug, string> = {
  'jwt-decoder': 'Decodes a compact JWT and shows header, payload, and signature text in the browser (up to 100,000 characters). It does not verify the signature, issuer, or audience—use JSON Formatter if you need prettier claim JSON.',
  'json-formatter': 'Beautify JSON with 2 or 4 spaces, or minify it, in the browser. Caps: 100,000 characters, 10,000 values, 64 nesting levels. Parser errors are shown as text; for a tree view use JSON Tree View.',
  'regex-tester': 'JavaScript RegExp tester for one pattern and one test string (2,000 / 50,000 chars, 1,000 matches, 500 ms timeout). No Python/PCRE switch and no replace box.',
  'url-encode': 'Encode or decode one value with encodeURIComponent (100,000-character limit). One mode at a time; plus signs are not treated as spaces. Prefer this for query values, not whole URLs.',
  'base64-encoder-decoder': 'Encode/decode UTF-8 text as standard Base64 in the browser. No file upload, no Base64URL switch—use Base64 Image Converter for images and JWT Decoder for full tokens.',
  'password-generator': 'Builds a strong random password in the browser (length 8–64, chosen character sets). Shareable links keep settings only, never the password. Pair with Password Strength Checker to review a typed candidate.',
  'uuid-generator': 'Generates UUID v4 values with hyphen/case toggles and keeps the last five in page memory. No version picker and no bulk count—use Password Generator for secrets.',
  'markdown-to-html': 'Converts Markdown to HTML in the page. Copy the HTML. There is no HTML file download, syntax highlighting, or task-list checkbox in the preview.',
  'case-converter': 'Shows eight case forms at once (UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, CONSTANT). Copy one result; it does not apply editorial title-case style guides.',
  'word-counter': 'Counts words, characters (with and without spaces), sentences, paragraphs, and lines, plus reading/speaking time. For a focused character-only breakdown, use Character Counter.',
  'reading-time-calculator': 'Estimates reading time from the text and the words-per-minute slider. It does not know how fast a specific reader actually reads.',
  'image-resizer': 'Resizes one image to whole-pixel width/height (max 8,192 px per side, 40 megapixels) in the browser. Lock aspect ratio to avoid distortion. It does not crop to a social preset or resize a batch—use Image Cropper or Batch Image Resizer.',
};
