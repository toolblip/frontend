import type { ReviewedToolSlug } from '@/data/reviewed-tools';

export const priorityToolLimits: Record<ReviewedToolSlug, string> = {
  'jwt-decoder': 'This decodes a compact JWT and shows the header, payload, and signature. It does not check the signature.',
  'json-formatter': 'Beautify JSON with 2 or 4 spaces, or minify it, in the browser. Caps: 100,000 characters, 10,000 values, 64 nesting levels. Parser errors are shown as text; for a tree view use JSON Tree View.',
  'regex-tester': 'This runs JavaScript RegExp on one test string. There is no Python or PCRE switch and no replace box.',
  'url-encode': 'One box, one mode. Encode or decode with encodeURIComponent. It does not show both results at once.',
  'base64-encoder-decoder': 'This encodes and decodes text. It does not take files, and it has no URL-safe switch. Image files go to the Base64 Image Converter.',
  'password-generator': 'Builds a strong random password in the browser (length 8–64, chosen character sets). Shareable links keep settings only, never the password. Pair with Password Strength Checker to review a typed candidate.',
  'uuid-generator': 'Generates UUID v4 values and keeps the last five. There is no version picker and no bulk count.',
  'markdown-to-html': 'Converts Markdown to HTML in the page. Copy the HTML. There is no HTML file download, syntax highlighting, or task-list checkbox in the preview.',
  'case-converter': 'Converts the text you paste into UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, and CONSTANT at the same time.',
  'word-counter': 'Counts words, characters (with and without spaces), sentences, paragraphs, and lines, plus reading/speaking time. It does not apply platform-weighted character rules—use Character Counter for those caps.',
  'reading-time-calculator': 'Estimates reading time from the text and the words-per-minute slider. It does not know how fast a specific reader actually reads.',
  'image-resizer': 'Resizes one image to whole-pixel width/height (max 8,192 px per side, 40 megapixels) in the browser. Lock aspect ratio to avoid distortion. It does not crop to a social preset or resize a batch—use Image Cropper or Batch Image Resizer.',
};
