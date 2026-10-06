import type { ReviewedToolSlug } from '@/data/reviewed-tools';

export const priorityToolLimits: Record<ReviewedToolSlug, string> = {
  'jwt-decoder': 'This decodes a compact JWT and shows the header, payload, and signature. It does not check the signature.',
  'json-formatter': 'Paste JSON to format it with 2 or 4 spaces, or minify it. The page shows the parser error text. It does not draw a tree.',
  'regex-tester': 'This runs JavaScript RegExp on one test string. There is no Python or PCRE switch and no replace box.',
  'url-encode': 'One box, one mode. Encode or decode with encodeURIComponent. It does not show both results at once.',
  'base64-encoder-decoder': 'This encodes and decodes text. It does not take files, and it has no URL-safe switch. Image files go to the Base64 Image Converter.',
  'password-generator': 'Builds a password in the browser from the length and character sets you pick. The link keeps those settings, not the password.',
  'uuid-generator': 'Generates UUID v4 values and keeps the last five. There is no version picker and no bulk count.',
  'markdown-to-html': 'Converts Markdown to HTML in the page. Copy the HTML. There is no HTML file download, syntax highlighting, or task-list checkbox in the preview.',
  'case-converter': 'Converts the text you paste into UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, and CONSTANT at the same time.',
  'word-counter': 'Counts words, characters, sentences, paragraphs, and lines in the text you paste. It does not apply a social network\'s weighted character rules.',
  'reading-time-calculator': 'Estimates reading time from the text and the words-per-minute slider. It does not know how fast a specific reader actually reads.',
  'image-resizer': 'Stretches the image to the width and height you enter. Keep the aspect-ratio lock on to avoid distortion. It does not crop to a social preset.',
};
