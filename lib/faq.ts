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
  'PDF Tools': (t) => ({
    q: `Are PDFs processed securely in the ${t.name}?`,
    a: `Yes. The ${t.name} processes PDFs entirely in your browser using client-side PDF libraries. Your files are never uploaded to a server, so you can safely work with contracts, invoices, and other confidential documents.`,
  }),
  'Video Tools': (t) => ({
    q: `Is video processing done in the cloud with the ${t.name}?`,
    a: `No. The ${t.name} runs in your browser using WebAssembly, so your videos stay on your machine. If an operation ever requires a server (for example, heavy transcoding of very large files), we flag it clearly before anything is uploaded.`,
  }),
  'Image Tools': (t) => ({
    q: `Does the ${t.name} preserve my image's original quality?`,
    a: `Whenever an operation is lossless — renaming, metadata stripping, format conversion to a lossless codec — the ${t.name} preserves the original bytes. Operations that resample the image (resizing, compressing to JPEG/WebP) will re-encode, but you control the quality setting, and nothing is uploaded.`,
  }),
  'AI Tools': (t) => ({
    q: `Is my text or content stored when I use the ${t.name}?`,
    a: `No. The ${t.name} does not log or store the content you feed into it. Inputs are processed for the length of the request and then discarded. Toolblip has no backend database of user prompts or AI outputs.`,
  }),
  'Document Generator': (t) => ({
    q: `Are documents from the ${t.name} legally valid?`,
    a: `The ${t.name} produces templates and drafts — a strong starting point for contracts, invoices, and official forms — but it is not a substitute for legal advice. Have a qualified lawyer review any document before you rely on it in a legal or regulated context.`,
  }),
  'Text Tools': (t) => ({
    q: `Is there a character limit when I use the ${t.name}?`,
    a: `There's no hard limit. The ${t.name} handles short snippets and long documents equally well because all processing happens on your device. For very large inputs you may notice a brief delay while the browser parses the text.`,
  }),
};

function categoryQuestion(t: Tool): FAQ {
  const fn = CATEGORY_FAQ[t.category];
  if (fn) return fn(t);
  return {
    q: `Is my data private when I use the ${t.name}?`,
    a: `Yes. The ${t.name} runs entirely in your browser, so nothing you paste, upload, or generate is sent to a server or logged by Toolblip. It is safe to use with confidential content.`,
  };
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

  faqs.push(categoryQuestion(t));

  faqs.push({
    q: `Can I use the ${t.name} offline?`,
    a: `Once the page has loaded, the ${t.name} continues to work without an internet connection. Bookmark this page and return to it anytime — all logic runs locally.`,
  });

  return faqs;
}

const OVERRIDES: Record<string, FAQ[]> = {
  'json-formatter': [
    { q: 'What is a JSON formatter?', a: 'A JSON formatter pretty-prints raw JSON into a readable, indented structure so you can scan, debug, and share it. The Toolblip JSON Formatter also validates syntax in real time and surfaces the parser error so you can find the broken character.' },
    { q: 'How do I format JSON online for free?', a: 'Paste your JSON into the editor on this page and it is formatted instantly. Switch between pretty-print and minified output, choose 2- or 4-space indentation, and copy the result with one click. No account or upload required.' },
    { q: 'Does the JSON Formatter fix invalid JSON?', a: 'No — it tells you exactly what is wrong (missing commas, trailing commas, unquoted keys, mismatched brackets) and where, but it does not silently rewrite invalid input. You stay in control of the fix.' },
    { q: 'Is the JSON Formatter safe for production data?', a: 'Yes. Everything happens in your browser. Your JSON is never uploaded, logged, or cached on any server, so it is safe to paste API responses that contain customer data or secrets.' },
    { q: "What's the difference between format and minify?", a: 'Format (pretty-print) adds indentation and newlines for human reading. Minify strips all whitespace for a compact payload you send over the wire. The JSON Formatter does both with a single toggle.' },
    { q: 'Can the JSON Formatter handle large JSON files?', a: 'It handles megabytes of JSON in the browser. For multi-megabyte payloads you may see a short delay while the browser parses the tree — everything still stays local.' },
  ],
  'word-counter': [
    { q: 'What is the Word Counter?', a: 'The Word Counter is a free online tool that counts words, characters, sentences, paragraphs, and estimated reading time the moment you paste text. It is designed for writers, students, and anyone trimming copy to fit a limit.' },
    { q: 'How accurate is the word count?', a: 'The Word Counter splits on whitespace, which matches the convention every major editor (Google Docs, Microsoft Word, Pages) uses for plain prose. For text with unusual punctuation (code, hyphenated compounds) the count may differ from those editors by a few words.' },
    { q: 'What is the reading time estimate based on?', a: 'Reading time assumes 200 words per minute, the typical adult silent-reading speed. Pace varies by reader and material — technical writing reads slower, simple prose faster — so treat the number as a useful estimate rather than a hard truth.' },
    { q: 'Does the Word Counter save what I type?', a: 'No. Everything is processed in your browser in real time. Nothing is uploaded, stored, or sent to any server, so it is safe to paste unpublished drafts or confidential content.' },
    { q: 'Can I count characters with and without spaces?', a: 'Yes. The Word Counter shows both character totals alongside the word count, plus sentence and paragraph counts, updating as you type.' },
  ],
  'character-counter': [
    { q: 'What is the Character Counter?', a: 'The Character Counter is a free online tool that counts characters and words and tracks your progress against four built-in limits: Tweet/X (280), LinkedIn (3,000), Meta Description (160), and Google Title (60). Perfect for writing content that has to fit.' },
    { q: 'Does the Character Counter count spaces?', a: 'Yes. It displays totals both with and without spaces, so you can match whatever limit a platform enforces.' },
    { q: 'What Twitter/X character limit does the Character Counter use?', a: 'The Character Counter uses 280 characters, the default Twitter/X limit for free accounts. Premium accounts allow longer posts, but the bar still warns you whenever you cross 280 because that is the limit non-Premium followers see.' },
    { q: 'Is meta description length really capped at 160?', a: 'Google truncates meta descriptions around 155–160 characters on desktop and around 120 on mobile. The Character Counter uses 160 as a safe upper bound for SEO.' },
    { q: 'Does the Character Counter work offline?', a: 'Yes. Once this page has loaded, the Character Counter runs entirely in your browser — no server calls, no tracking, and no signup.' },
  ],
  'base64': [
    { q: 'What is Base64 encoding?', a: 'Base64 is a way of representing binary data — images, files, keys — using 64 printable ASCII characters. It is commonly used to embed files in JSON, transport data through email, and inline images into CSS and HTML.' },
    { q: 'How do I encode text to Base64?', a: 'Paste your text into the editor on this page and the Base64 output appears instantly. Toggle the mode to decode a Base64 string back to its original text. Unicode and emoji are handled correctly.' },
    { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption. Anyone with the output can decode it back to the original — do not use Base64 to hide secrets. For security, combine it with actual encryption like AES.' },
    { q: 'Why does Base64 output end in "=" characters?', a: 'The equals signs are padding. Base64 encodes data in groups of three bytes, so when the input length is not a multiple of three, "=" pads the final group to the right length.' },
    { q: 'Is the Base64 tool safe for sensitive data?', a: 'Yes. Encoding and decoding both happen in your browser. Nothing is uploaded or logged, so it is safe to use with API tokens, internal payloads, and other confidential content.' },
  ],
  'url-encode': [
    { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) converts characters that have special meaning in URLs — like spaces, &, ?, and = — into a safe form so they can be passed in a link or query string without breaking the URL.' },
    { q: 'When do I need to URL-encode a string?', a: 'Any time you embed user input, paths, or query parameters into a URL — building deep links, constructing API requests, or debugging a broken redirect. Encode values individually, not the whole URL.' },
    { q: "What's the difference between encodeURI and encodeURIComponent?", a: 'encodeURIComponent encodes every reserved character, which is what you want for query values and is what this tool uses. encodeURI leaves URL structural characters (/ ? : etc.) alone, which is rarely what you want when encoding user-supplied data.' },
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
    { q: 'What case conversions does the Case Converter support?', a: 'The Case Converter turns text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE. All eight versions appear at once as you type, so you can copy whichever one you need.' },
    { q: 'How do I convert text to camelCase online?', a: 'Type or paste your text into the Case Converter and the camelCase version updates live. Spaces, hyphens, and underscores are stripped and every word after the first is capitalized — "my variable name" becomes "myVariableName".' },
    { q: "What's the difference between snake_case and kebab-case?", a: 'snake_case uses underscores (my_variable); kebab-case uses hyphens (my-variable). Python and Rust idiomatically use snake_case; CSS classes and URL slugs use kebab-case.' },
    { q: 'Does the Case Converter handle existing word boundaries?', a: 'Yes. The Case Converter splits on whitespace, hyphens, underscores, and the boundary between a lowercase and uppercase letter, so it can convert from camelCase or PascalCase to any other style without losing word breaks.' },
    { q: 'Is there a limit on how much text I can convert?', a: "No. The Case Converter handles paragraphs or entire documents in milliseconds, and it all happens in your browser so there's no upload limit." },
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
  'lorem-ipsum-generator': [
    { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is pseudo-Latin placeholder text used by designers and developers since the 1500s. It fills layouts with realistic-looking content so you can evaluate typography, spacing, and hierarchy without being distracted by the meaning of the words.' },
    { q: 'How much text can I generate with the Lorem Ipsum Generator?', a: 'Set any number of paragraphs, sentences, or words — there\'s no upper limit. The Lorem Ipsum Generator produces output instantly in your browser, even at tens of thousands of words.' },
    { q: 'Does the Lorem Ipsum Generator start with "Lorem ipsum dolor sit amet"?', a: 'Yes by default — and you can toggle it off if you\'d rather jump straight into randomized content. Starting with the classic phrase signals "placeholder" to anyone reviewing the mockup.' },
    { q: 'Can I generate HTML-wrapped Lorem Ipsum?', a: 'Yes. The Lorem Ipsum Generator outputs plain text by default, or wraps paragraphs in `<p>` tags with a single toggle so you can paste straight into a template.' },
    { q: 'Is it OK to use Lorem Ipsum in a real product?', a: 'Only during design and prototyping. Ship with real copy — Lorem Ipsum left in production is the sort of thing that ends up on Twitter. Use the Lorem Ipsum Detector to find any that slipped through.' },
  ],
  'qr-code-generator': [
    { q: 'What can I encode with the QR Code Generator?', a: 'Anything that fits in a string — URLs are the most common, but plain text, WiFi credentials in the standard `WIFI:` format, vCard contact details, SMS templates, and email links all work. Type or paste the value, click Generate, and download the result.' },
    { q: 'Can I download the QR code as SVG?', a: 'Yes. The QR Code Generator exports both PNG (for quick sharing) and SVG (for print and scalable designs). SVG files stay crisp at any size, which is the right choice for posters and packaging.' },
    { q: 'Does the QR Code Generator track what I encode?', a: 'No. Everything is generated client-side, so the URLs, passwords, or contact details you encode never leave your browser. This is especially important for WiFi QR codes, which contain your network password.' },
    { q: 'How large should my QR code be for a poster?', a: "A good rule of thumb is that the QR code's size should be 1/10th the scanning distance — so a poster scanned from 2 meters needs a code at least 20 cm square. Pick the XL size and the SVG export to keep edges sharp at print resolution." },
    { q: 'What size should I pick?', a: 'S (128 px) is fine for a thumbnail or inline doc. M (256 px) is the safe default for the web. L and XL (512 / 1024 px) are for print, posters, or anything that will be scaled up further. The QR Code Generator keeps the contents identical across sizes.' },
  ],
  'color-picker': [
    { q: 'What formats does the Color Picker output?', a: 'HEX (6-digit), HEX 3 (the shorthand form when applicable), RGB, and HSL. Each value is copy-ready for CSS, design tools, or code.' },
    { q: 'How do I pick a color?', a: 'Click the color swatch on the left to open your browser\'s native color picker, drag through the spectrum, or type a HEX value directly. The other formats update live.' },
    { q: 'Does the Color Picker check accessibility?', a: 'Yes. The Color Picker shows the WCAG contrast result for the picked color against white, with an AAA / AA / Fail badge so you can quickly tell whether the color is safe to use as text or a UI element on a white background.' },
    { q: "What's the difference between HSL and RGB?", a: 'RGB mixes red, green, and blue channels — how screens physically produce color. HSL thinks in terms of hue (which color), saturation (how vivid), and lightness (how bright), which matches how designers talk about color. Both describe the same values; HSL is just easier to reason about.' },
    { q: 'Does the Color Picker work offline?', a: 'Yes. Once the page has loaded, the Color Picker runs entirely in your browser. Bookmark it and reach for it even without an internet connection.' },
  ],
  'password-generator': [
    { q: 'How strong are the passwords from the Password Generator?', a: 'The Password Generator uses the browser\'s crypto.getRandomValues — cryptographically secure randomness — so a 16-character password with full character variety is well beyond brute-force range for any modern attacker.' },
    { q: 'Does the Password Generator store or log my passwords?', a: 'No. Passwords are generated in your browser and never sent anywhere. Nothing is logged, stored, or cached — close the tab and the password is gone unless you saved it to your password manager.' },
    { q: 'What length should I choose?', a: 'Use at least 16 characters for everyday accounts, and 20+ for high-value logins (banking, email, password-manager master passwords). Length beats complexity — every extra character roughly doubles the brute-force cost.' },
    { q: 'Should I include special characters?', a: 'Yes, unless a site blocks them. Special characters expand the search space and defeat dictionary attacks. The Password Generator lets you exclude ambiguous characters (like l/1 and O/0) for when you need to type the password by hand.' },
    { q: 'Can the Password Generator create passphrases?', a: 'Yes. Switch to passphrase mode and the Password Generator strings together random words — easier to type and remember than random strings, and equally secure when long enough (four or more random words beats most 10-character passwords).' },
  ],
  'hash-generator': [
    { q: 'Which hash algorithms does the Hash Generator support?', a: 'The Hash Generator produces MD5, SHA-1, SHA-256, and SHA-512 hashes using the browser\'s native Web Crypto API. For password hashing specifically, use bcrypt, scrypt, or Argon2 instead — we have dedicated tools for each.' },
    { q: 'Is the Hash Generator safe for sensitive input?', a: 'Yes. All hashing happens locally via Web Crypto, so the text or files you hash never leave your browser. That makes it safe for checksums on confidential files.' },
    { q: 'Should I use MD5 or SHA-1 for passwords?', a: 'No. MD5 and SHA-1 are cryptographically broken and fast — attackers can brute-force billions of guesses per second. Use bcrypt, scrypt, or Argon2 for password storage. MD5 and SHA-1 are fine for non-security uses like cache keys and fingerprints.' },
    { q: 'Can the Hash Generator hash files?', a: 'Yes. Drop a file into the Hash Generator and it computes the hash in your browser using streaming crypto. Useful for verifying downloads and comparing large-file integrity — nothing is uploaded.' },
    { q: 'Why do I always get the same hash for the same input?', a: 'That\'s the defining property of a hash function: deterministic output. If you need different outputs for the same input (for password storage), add a random salt before hashing — the bcrypt and Argon2 tools do this automatically.' },
  ],
};

export function getFaqs(tool: Tool): FAQ[] {
  return OVERRIDES[tool.slug] ?? templateFaqs(tool);
}
