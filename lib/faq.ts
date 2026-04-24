import type { Tool } from '@/data/tools';

export type FAQ = { q: string; a: string };

const CATEGORY_FAQ: Record<string, (t: Tool) => FAQ> = {
  Developer: (t) => ({
    q: `Do I need to install anything to use the ${t.name}?`,
    a: `No. The ${t.name} runs entirely in your browser — no downloads, no accounts, no API keys. Paste your input, get the output, copy it back into your editor.`,
  }),
  Text: (t) => ({
    q: `Is there a character limit when I use the ${t.name}?`,
    a: `There's no hard limit. The ${t.name} handles short snippets and long documents equally well because all processing happens on your device. For very large inputs you may notice a brief delay while the browser parses the text.`,
  }),
  Image: (t) => ({
    q: `Are my images uploaded anywhere when I use the ${t.name}?`,
    a: `No. The ${t.name} processes images fully client-side using the Canvas API. Your files never leave your browser, so you can safely work with personal photos, design mockups, or confidential assets.`,
  }),
  Color: (t) => ({
    q: `What color formats does the ${t.name} support?`,
    a: `The ${t.name} works with the formats web developers reach for every day — HEX, RGB / RGBA, and HSL. You can copy any value with one click for use in CSS, design tools, or code.`,
  }),
  Conversion: (t) => ({
    q: `Is my data kept private when I use the ${t.name}?`,
    a: `Yes. The ${t.name} converts everything locally in your browser. Nothing is uploaded, logged, or stored on a server, so it's safe to paste confidential data while debugging.`,
  }),
  Encoder: (t) => ({
    q: `Does the ${t.name} handle Unicode and special characters?`,
    a: `Yes. The ${t.name} uses the browser's native encoding APIs, so it correctly handles Unicode, emoji, and all special characters without mojibake.`,
  }),
  SEO: (t) => ({
    q: `Will the ${t.name} help improve my site's SEO?`,
    a: `The ${t.name} is one part of a healthy SEO workflow. It produces the output search engines expect — clean syntax, valid structure, and the metadata they use to index pages — but real ranking gains come from pairing good tooling with useful content.`,
  }),
  Math: (t) => ({
    q: `How accurate is the ${t.name}?`,
    a: `The ${t.name} uses the browser's native number handling. For typical engineering and everyday math it's exact; for calculations that need arbitrary precision you may hit floating-point rounding at the far edges.`,
  }),
  Network: (t) => ({
    q: `Does the ${t.name} make real network requests?`,
    a: `Only where the task requires it (for example, looking up a DNS record). The interface and any parsing happen in your browser, and Toolblip doesn't log the queries you make.`,
  }),
  CSS: (t) => ({
    q: `Can I paste the ${t.name}'s output straight into my stylesheet?`,
    a: `Yes. The ${t.name} outputs valid CSS that you can drop into any project — hand-written, Tailwind, CSS-in-JS, or a preprocessor like Sass.`,
  }),
  Utility: (t) => ({
    q: `Is the ${t.name} free?`,
    a: `Yes. The ${t.name} is free, requires no signup, and has no usage limits. Toolblip is funded by optional Pro features, not by metering the core tools.`,
  }),
};

function categoryQuestion(t: Tool): FAQ | null {
  return CATEGORY_FAQ[t.category]?.(t) ?? null;
}

function templateFaqs(t: Tool): FAQ[] {
  const faqs: FAQ[] = [
    {
      q: `What is the ${t.name}?`,
      a: `${t.description} The ${t.name} is one of 900+ free developer tools on Toolblip — all open to use without a signup.`,
    },
    {
      q: `How do I use the ${t.name}?`,
      a: `Open the ${t.name} on this page, paste or upload your input, and the result updates as you type. Use the copy button to grab the output, or adjust options to tune the result. Nothing you enter leaves your browser.`,
    },
    {
      q: `Is the ${t.name} free to use?`,
      a: `Yes. The ${t.name} is a free online tool on Toolblip — no signup, no account, no hidden usage limits. It runs in your browser and works on desktop and mobile.`,
    },
    {
      q: `Is the ${t.name} safe and private?`,
      a: `Yes. The ${t.name} processes your data entirely client-side, so nothing you paste is uploaded or stored on any server. It's safe to use with internal snippets, private keys for debugging, or any other sensitive content you'd rather not send to a remote service.`,
    },
  ];

  const catFaq = categoryQuestion(t);
  if (catFaq) faqs.push(catFaq);

  faqs.push({
    q: `Can I use the ${t.name} offline?`,
    a: `Once the page has loaded, the ${t.name} continues to work without an internet connection. Bookmark this page and return to it anytime — all logic runs locally.`,
  });

  return faqs;
}

const OVERRIDES: Record<string, FAQ[]> = {
  'json-formatter': [
    { q: 'What is a JSON formatter?', a: 'A JSON formatter pretty-prints raw JSON into a readable, indented structure so you can scan, debug, and share it. The Toolblip JSON Formatter also validates syntax in real time, highlighting the exact character that caused a parse error.' },
    { q: 'How do I format JSON online for free?', a: 'Paste your JSON into the editor on this page and it is formatted instantly. You can switch between pretty-print and minified output, adjust indentation (2 or 4 spaces), and copy the result with one click. No account or upload required.' },
    { q: 'Does the JSON Formatter fix invalid JSON?', a: 'It points out exactly where JSON is invalid — missing commas, trailing commas, unquoted keys, mismatched brackets — with line and column numbers. It does not silently rewrite invalid input, so you keep full control over the fix.' },
    { q: 'Is the JSON Formatter safe for production data?', a: 'Yes. Everything happens in your browser. Your JSON is never uploaded, logged, or cached on any server, so it is safe to paste API responses that contain customer data or secrets.' },
    { q: "What's the difference between format and minify?", a: 'Format (pretty-print) adds indentation and newlines for human reading. Minify strips all whitespace for a compact payload you send over the wire. The JSON Formatter does both with a single toggle.' },
    { q: 'Can the JSON Formatter handle large JSON files?', a: 'It handles megabytes of JSON in the browser. For multi-megabyte payloads you may see a short delay while the browser parses the tree — everything still stays local.' },
  ],
  'word-counter': [
    { q: 'What is the Word Counter?', a: 'The Word Counter is a free online tool that counts words, characters, sentences, paragraphs, and estimated reading time the moment you paste text. It is designed for writers, students, and anyone trimming copy to fit a limit.' },
    { q: 'How accurate is the word count?', a: 'The Word Counter splits on whitespace and punctuation using the same rules Google Docs and Microsoft Word use, so results match what you see in mainstream editors.' },
    { q: 'What is the reading time estimate based on?', a: 'Reading time uses an average of 225 words per minute for adults, which matches academic reading-speed studies and Medium\'s published estimate.' },
    { q: 'Does the Word Counter save what I type?', a: 'No. Everything is processed in your browser in real time. Nothing is uploaded, stored, or sent to any server, so it is safe to paste unpublished drafts or confidential content.' },
    { q: 'Can I count characters with and without spaces?', a: 'Yes. The Word Counter shows both character totals alongside the word count, plus sentence and paragraph counts, updating as you type.' },
  ],
  'character-counter': [
    { q: 'What is the Character Counter?', a: 'The Character Counter is a free online tool that counts characters, words, and lines, with preset limit indicators for Twitter/X (280), LinkedIn (3,000), and meta descriptions (160). Perfect for writing content that has to fit.' },
    { q: 'Does the Character Counter count spaces?', a: 'Yes. It displays totals both with and without spaces, so you can match whatever limit a platform enforces.' },
    { q: 'What Twitter/X character limit does the Character Counter use?', a: 'The default Twitter/X limit is 280 characters for free accounts. Premium accounts allow longer posts — switch to the "No limit" preset for those.' },
    { q: 'Is meta description length really capped at 160?', a: 'Google truncates meta descriptions around 155–160 characters on desktop and around 120 on mobile. The Character Counter uses 160 as a safe upper bound for SEO.' },
    { q: 'Does the Character Counter work offline?', a: 'Yes. Once this page has loaded, the Character Counter runs entirely in your browser — no server calls, no tracking, and no signup.' },
  ],
  'base64': [
    { q: 'What is Base64 encoding?', a: 'Base64 is a way of representing binary data — images, files, keys — using 64 printable ASCII characters. It is commonly used to embed files in JSON, transport data through email, and inline images into CSS and HTML.' },
    { q: 'How do I encode text to Base64?', a: 'Paste your text or upload a file on this page and the Base64 output appears instantly. Toggle the mode to decode a Base64 string back to its original text or file.' },
    { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption. Anyone with the output can decode it back to the original — do not use Base64 to hide secrets. For security, combine it with actual encryption like AES.' },
    { q: 'Does the Base64 tool support file encoding?', a: 'Yes. Drop in any file and you get a data-URL-ready Base64 string. The file never leaves your browser, so it is safe to work with private assets.' },
    { q: 'Why does Base64 output end in "=" characters?', a: 'The equals signs are padding. Base64 encodes data in groups of three bytes, so when the input length is not a multiple of three, "=" pads the final group to the right length.' },
  ],
  'url-encode': [
    { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) converts characters that have special meaning in URLs — like spaces, &, ?, and = — into a safe form so they can be passed in a link or query string without breaking the URL.' },
    { q: 'When do I need to URL-encode a string?', a: 'Any time you embed user input, paths, or query parameters into a URL — building deep links, constructing API requests, or debugging a broken redirect. Encode values individually, not the whole URL.' },
    { q: 'What\'s the difference between encodeURI and encodeURIComponent?', a: 'encodeURIComponent encodes every reserved character, which is what you want for query values. encodeURI leaves URL structural characters (like / and ?) alone. The URL Encode tool lets you pick either.' },
    { q: 'Does URL encoding change my original data?', a: 'No. URL encoding is fully reversible — decoding gives you back the exact original string, byte for byte. The tool provides both directions.' },
    { q: 'Is the URL Encode tool safe for private URLs?', a: 'Yes. All encoding happens in your browser. URLs with tokens, session IDs, or other private parameters are not logged or sent anywhere.' },
  ],
  'uuid-generator': [
    { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit ID — typically shown as 36 characters with dashes — that is extremely unlikely to collide across systems, which makes it ideal for database keys, file names, and distributed IDs.' },
    { q: 'What version of UUID does this tool generate?', a: 'The UUID Generator produces v4 UUIDs — random — using the browser\'s crypto.getRandomValues API. That matches the recommendation in RFC 4122 for most application-level IDs.' },
    { q: 'Can I generate multiple UUIDs at once?', a: 'Yes. Set the count and you get any number of UUIDs in one shot. Copy them as plain text or as a JSON array for dropping straight into code.' },
    { q: 'Are these UUIDs cryptographically secure?', a: 'The UUID Generator uses your browser\'s crypto.getRandomValues, which is cryptographically secure. That said, UUIDs are identifiers — use them for IDs, not for secrets.' },
    { q: 'Does the UUID Generator work offline?', a: 'Yes. Once the page is loaded, the generator runs entirely in your browser with no network calls.' },
  ],
  'case-converter': [
    { q: 'What case conversions does the Case Converter support?', a: 'The Case Converter turns text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, PascalCase, and CONSTANT_CASE. All conversions happen instantly as you type.' },
    { q: 'How do I convert text to camelCase online?', a: 'Paste your text into the Case Converter and click camelCase. Spaces and hyphens are stripped and the first letter of every word after the first is capitalized — "my variable name" becomes "myVariableName".' },
    { q: "What's the difference between snake_case and kebab-case?", a: 'snake_case uses underscores (my_variable); kebab-case uses hyphens (my-variable). Python and Rust idiomatically use snake_case; CSS and URL slugs use kebab-case.' },
    { q: 'Does the Case Converter handle acronyms correctly?', a: 'Yes. The Case Converter preserves acronyms in Title Case and respects existing word boundaries when converting to camel, snake, or kebab case.' },
    { q: 'Is there a limit on how much text I can convert?', a: 'No. The Case Converter handles paragraphs or entire documents in milliseconds, and it all happens in your browser so there\'s no upload limit.' },
  ],
  'regex-tester': [
    { q: 'What is the Regex Tester?', a: 'The Regex Tester is a free online playground for regular expressions. Type a pattern, paste the text to match against, and see matches and capture groups highlighted live with flag support (g, i, m, s, u).' },
    { q: 'Which regex flavor does the Regex Tester use?', a: 'The Regex Tester uses JavaScript (ECMAScript) regex, which is the flavor you ship in a web app, Node.js script, or browser-side code. Named groups, lookbehinds, and unicode property escapes are all supported in modern browsers.' },
    { q: 'Can I test multiline regex patterns?', a: 'Yes. Toggle the m flag to make ^ and $ match line boundaries, or s to let . match newlines. The Regex Tester shows exactly which flags are active.' },
    { q: 'Does the Regex Tester explain my pattern?', a: 'Yes. The Regex Tester breaks down each token in the pattern — anchors, character classes, quantifiers, groups — into plain English so you can verify what it actually matches.' },
    { q: 'Is my regex and test text private?', a: 'Yes. Everything in the Regex Tester runs in your browser. Nothing is sent to any server, so you can test patterns against confidential logs and data.' },
  ],
  'jwt-decoder': [
    { q: 'What does the JWT Decoder show me?', a: 'The JWT Decoder splits a JSON Web Token into its three parts — header, payload, and signature — and pretty-prints the JSON so you can inspect claims like exp, iat, iss, and any custom fields.' },
    { q: 'Does the JWT Decoder verify the signature?', a: 'The JWT Decoder shows you what a token claims. Verification requires the secret or public key that issued the token and should be done server-side — never trust an unverified JWT for authorization.' },
    { q: 'Can I decode an expired JWT?', a: 'Yes. The JWT Decoder decodes any valid JWT regardless of expiry, which is useful for debugging expired-token bugs. Look at the exp claim to see when it was valid.' },
    { q: 'Is it safe to paste a JWT into the JWT Decoder?', a: 'The decoding happens in your browser, so the token is never sent to any server. That said, a JWT is a credential — if you paste a production token anywhere, rotate it when you\'re done.' },
    { q: 'Why is the signature garbled after decoding?', a: 'The first two segments of a JWT are base64-encoded JSON; the third is a binary signature. The JWT Decoder shows it unchanged because the raw bytes are not meant to be human-readable.' },
  ],
  'cron-parser': [
    { q: 'What does the Cron Expression Parser do?', a: 'The Cron Expression Parser takes any 5-field cron expression and shows you what it means in plain English, plus the next five times it will run, so you catch mistakes before you deploy.' },
    { q: 'What cron syntax does the parser support?', a: 'The Cron Expression Parser supports standard 5-field cron (minute, hour, day-of-month, month, day-of-week) with wildcards, ranges, lists, and step values — the dialect used by vixie-cron, cronie, and most Linux systems.' },
    { q: 'Why does my cron expression match both a day-of-month AND a day-of-week?', a: 'Standard cron OR\'s the two date fields whenever both are non-wildcard, so `0 9 15 * 1` runs on the 15th OR on Mondays — not "the 15th if it\'s a Monday". The Cron Expression Parser makes that explicit in the plain-English output.' },
    { q: 'Is sub-minute scheduling supported?', a: 'No — cron\'s minimum resolution is one minute. For faster cadence you need a systemd timer or a long-running daemon. The Cron Expression Parser flags any expression that tries to fake sub-minute scheduling.' },
    { q: 'Does the Cron Expression Parser respect timezones?', a: 'The parser computes run times in your local timezone so you can sanity-check them, but remember that cron on a server runs in the server\'s timezone unless you set CRON_TZ at the top of the crontab.' },
  ],
};

export function getFaqs(tool: Tool): FAQ[] {
  return OVERRIDES[tool.slug] ?? templateFaqs(tool);
}
