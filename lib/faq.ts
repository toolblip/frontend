import type { Tool } from '@/data/tools';

export type FAQ = { q: string; a: string };

const CATEGORY_FAQ: Record<string, (t: Tool) => FAQ> = {
  Developer: (t) => ({
    q: `Do I need to install anything to use the ${t.name}?`,
    a: `No. The ${t.name} runs entirely in your browser  -  no downloads, no accounts, no API keys. Paste your input, get the output, copy it back into your editor.`,
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
    a: `The ${t.name} works with the formats web developers reach for every day  -  HEX, RGB / RGBA, and HSL. You can copy any value with one click for use in CSS, design tools, or code.`,
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
    a: `The ${t.name} is one part of a healthy SEO workflow. It produces the output search engines expect  -  clean syntax, valid structure, and the metadata they use to index pages  -  but real ranking gains come from pairing good tooling with useful content.`,
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
    q: `Can I paste the output straight into my stylesheet?`,
    a: `Yes. The ${t.name} outputs valid CSS that you can drop into any project, whether it is hand-written, Tailwind, CSS-in-JS, or a preprocessor like Sass.`,
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
    a: `Whenever an operation is lossless  -  renaming, metadata stripping, format conversion to a lossless codec  -  the ${t.name} preserves the original bytes. Operations that resample the image (resizing, compressing to JPEG/WebP) will re-encode, but you control the quality setting, and nothing is uploaded.`,
  }),
  'AI Tools': (t) => ({
    q: `Is my text or content stored when I use the ${t.name}?`,
    a: `No. The ${t.name} does not log or store the content you feed into it. Inputs are processed for the length of the request and then discarded. Toolblip has no backend database of user prompts or AI outputs.`,
  }),
  'Document Generator': (t) => ({
    q: `Are documents from the ${t.name} legally valid?`,
    a: `The ${t.name} produces templates and drafts  -  a strong starting point for contracts, invoices, and official forms  -  but it is not a substitute for legal advice. Have a qualified lawyer review any document before you rely on it in a legal or regulated context.`,
  }),
  'Text Tools': (t) => ({
    q: `Is there a character limit when I use the ${t.name}?`,
    a: `There's no hard limit. The ${t.name} handles short snippets and long documents equally well because all processing happens on your device. For very large inputs you may notice a brief delay while the browser parses the text.`,
  }),
}

const CATEGORY_FAQ2: Record<string, (t: Tool) => FAQ> = {
  Developer: (t) => ({
    q: `Can the ${t.name} handle large input files or long text?`,
    a: `Yes. The ${t.name} processes everything locally in your browser, so the only limit is your device's available memory. There are no arbitrary caps on input size, character count, or processing time that you would typically encounter with server-based tools.`,
  }),
  Text: (t) => ({
    q: `Does the ${t.name} preserve the original formatting of my text?`,
    a: `The ${t.name} applies only the transformation you select. If you are counting words or characters, the original text is untouched. If you are converting case or removing duplicates, the tool transforms the content as specified and leaves everything else unchanged.`,
  }),
  Conversion: (t) => ({
    q: `Can I convert multiple files at once with the ${t.name}?`,
    a: `The ${t.name} processes one input at a time. For batch conversions of multiple files, you can paste each input individually. Since the tool runs locally in your browser, there are no rate limits or daily caps that would prevent you from converting as many items as you need.`,
  }),
  SEO: (t) => ({
    q: `Does the ${t.name} store the URLs or content I check?`,
    a: `No. The ${t.name} processes everything in your browser. No URLs, meta tags, or page content is logged or sent to any server. You can audit competitor sites or sensitive internal pages without leaving a trail on an external platform.`,
  }),
  Color: (t) => ({
    q: `Can I pick a colour visually with the ${t.name}, or do I need to type values?`,
    a: `The ${t.name} supports both approaches. You can type colour values directly in any format (HEX, RGB, HSL), or click the colour swatch to open your system's native colour picker for visual selection. The tool converts between formats regardless of which input method you use.`,
  }),
  Image: (t) => ({
    q: `What image formats does the ${t.name} support?`,
    a: `The ${t.name} works with common web image formats including PNG, JPEG, WebP, GIF, and SVG. The specific operations available depend on the format — lossless formats like PNG preserve quality through transformations, while lossy formats like JPEG may show compression artefacts after re-encoding.`,
  }),
  "AI Tools": (t) => ({
    q: `What kind of AI tasks can the ${t.name} handle?`,
    a: `The ${t.name} supports common text AI tasks such as summarisation, paraphrasing, tone adjustment, and text classification. The specific models and capabilities depend on your device, but all processing happens locally in your browser with no cloud dependency.`,
  }),
  Utility: (t) => ({
    q: `Does the ${t.name} work without an internet connection?`,
    a: `Yes. Once the ${t.name} page has loaded completely, the core functionality continues to work offline. All logic and processing runs client-side, so you can bookmark the page and use it even when you do not have network access.`,
  }),
  "Image Tools": (t) => ({
    q: `Does the ${t.name} preserve the original quality of my images?`,
    a: `The ${t.name} preserves original quality for lossless operations like resizing down or converting between lossless formats. For operations that re-encode the image (JPEG compression, format conversion to lossy codecs), you control the quality setting to balance file size against visual fidelity.`,
  }),
  "Video Tools": (t) => ({
    q: `How long does video processing take with the ${t.name}?`,
    a: `Processing time depends on the file size, the operation, and your device's performance. Because everything runs locally in your browser, there are no server queues or upload delays. Short clips process in seconds; longer videos may take a few minutes.`,
  }),
  "PDF Tools": (t) => ({
    q: `Can the ${t.name} handle password-protected PDFs?`,
    a: `The ${t.name} can open and process PDFs that do not have encryption restrictions. Password-protected or encrypted PDFs that require a decryption key may not be readable by client-side libraries. If you need to work with a locked PDF, unlock it first using the file owner's credentials.`,
  }),
  Network: (t) => ({
    q: `Does the ${t.name} make real network requests to the URLs I check?`,
    a: `Yes, where the diagnostic requires it. For HTTP header checks and DNS lookups, the tool makes real network requests from your browser. Toolblip does not log these requests. For operations that do not require network access, everything is handled client-side.`,
  }),
  CSS: (t) => ({
    q: `Is the CSS output from the ${t.name} production-ready?`,
    a: `The ${t.name} generates clean, valid CSS that you can use directly in production. For complex layouts you may want to review the output for browser compatibility, but the generated code follows standard CSS specifications and uses commonly supported properties.`,
  }),
  Math: (t) => ({
    q: `How accurate are the calculations in the ${t.name}?`,
    a: `The ${t.name} uses the browser's native JavaScript number handling for calculations. For integers within the safe range and for BigInt-supported operations, results are exact. Floating-point arithmetic follows IEEE 754 and may show minor rounding at extreme precision levels.`,
  }),
};
;

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
      q: `What does the ${t.name} do?`,
      a: `${t.description} The ${t.name} is one of 900+ free developer tools on Toolblip  -  all open to use without a signup.`,
    },
    {
      q: `How do I use the ${t.name}?`,
      a: `Open the ${t.name} on this page, paste or upload your input, and the result updates as you type. Use the copy button to grab the output, or adjust options to tune the result. Nothing you enter leaves your browser.`,
    },
    {
      q: `Is the ${t.name} free to use?`,
      a: `Yes. The ${t.name} is a free online tool on Toolblip  -  no signup, no account, no hidden usage limits. It runs in your browser and works on desktop and mobile.`,
    },
    {
      q: `Is the ${t.name} safe and private?`,
      a: `Yes. The ${t.name} processes your data entirely client-side, so nothing you paste is uploaded or stored on any server. It's safe to use with internal snippets, private keys for debugging, or any other sensitive content you'd rather not send to a remote service.`,
    },
    {
      q: `What kind of output does the ${t.name} produce?`,
      a: `The ${t.name} produces clean, formatted output that you can copy or download with a single click. The output is tailored to the tool's purpose — formatted code, converted data, transformed text, or processed media — and is ready for immediate use in your project or workflow.`,
    },
    {
      q: `Does the ${t.name} work on mobile devices?`,
      a: `Yes. The ${t.name} is designed to work on any device with a modern browser, including phones and tablets. The interface adapts to smaller screens, and the core functionality — paste input, transform, copy output — works the same way regardless of your device.`,
    },
  ];

  faqs.push(categoryQuestion(t));

  // Second category-specific question
  const catMap2 = CATEGORY_FAQ2 as unknown as Record<string, (t: Tool) => FAQ>;
  const fn2 = catMap2[t.category];
  if (fn2) {
    faqs.push(fn2(t));
  } else {
    faqs.push({
      q: `Can I bookmark the ${t.name} for quick access?`,
      a: `Absolutely. Bookmark the ${t.name} page and it will be ready to use whenever you need it, including offline after the initial load. Add it to your browser's bookmarks bar for one-click access during development, writing, or design sessions.`,
    });
  }

  faqs.push({
    q: `Can I use the ${t.name} offline?`,
    a: `Once the page has loaded, the ${t.name} continues to work without an internet connection. Bookmark this page and return to it anytime  -  all logic runs locally.`,
  });

  return faqs;
}

const OVERRIDES: Record<string, FAQ[]> = {
  'sass-to-css': [
    { q: 'What does the Sass to CSS tool do?', a: 'It compiles SCSS or indented Sass into clean CSS in your browser. Paste your source, click convert, and copy the result when it is ready.' },
    { q: 'Can it handle variables, nesting, and mixins?', a: 'Yes. The Sass to CSS tool supports the Sass features people use most often, including variables, mixins, and nested selectors.' },
    { q: 'Do I need to install Sass locally?', a: 'No. The tool runs in your browser, so you can test a snippet without setting up a build step or local Sass install.' },
    { q: 'Does it support both SCSS and indented Sass syntax?', a: 'Yes. It can compile either syntax, so you can paste whichever format your project uses.' },
    { q: 'Is my Sass uploaded anywhere?', a: 'No. The conversion happens locally in your browser, so your code stays on your device.' },
    { q: 'Can I use the CSS output directly in my stylesheet?', a: 'Yes. The output is standard CSS, so you can copy it into your stylesheet or hand it back to a teammate.' },
  ],
  'banner-generator': [
    { q: 'What is the Banner Generator?', a: 'The Banner Generator creates polished 1200×630 blog covers, banners, and Open Graph images in your browser. It is designed for quick social previews, blog headers, and share cards without sending your design content to a server.' },
    { q: 'Can I change the text and colors?', a: 'Yes. You can edit the headline, subtitle, and accent styles directly on the page before downloading the final PNG.' },
    { q: 'Is the Banner Generator safe for unpublished ideas?', a: 'Yes. The rendering happens locally in your browser, so your text and design inputs stay on your device.' },
    { q: 'What size does it export?', a: 'It exports at 1200×630 by default, which is the standard Open Graph size and a solid choice for social sharing.' },
    { q: 'Can I download more than one version?', a: 'Yes. Update the inputs, generate again, and download as many variations as you need for testing or promotion.' },
  ],
  'css-to-scss': [
    { q: 'What does the CSS to SCSS tool do?', a: 'It rewrites flat CSS into SCSS with nested selectors where that structure is obvious. That makes styles easier to read and edit.' },
    { q: 'Can it turn repeated selectors into nesting?', a: 'Yes. The tool groups descendant selectors into nested blocks so the output looks like hand-written SCSS.' },
    { q: 'Does it preserve properties and values?', a: 'Yes. It keeps the declarations intact and focuses on restructuring the selector tree.' },
    { q: 'Do I need to install anything?', a: 'No. Everything runs in the browser, so you can use it on any machine without a setup step.' },
    { q: 'Is my CSS uploaded anywhere?', a: 'No. The conversion is local to your browser, so your styles never leave the page.' },
    { q: 'Can I use the SCSS output right away?', a: 'Yes. You can copy it into your project and then refine the nesting or variables by hand if you want.' },
  ],
  'json-formatter': [
    { q: 'What is a JSON formatter?', a: 'A JSON formatter pretty-prints raw JSON into a readable, indented structure so you can scan, debug, and share it. The Toolblip JSON Formatter also validates syntax in real time and surfaces the parser error so you can find the broken character.' },
    { q: 'How do I format JSON online for free?', a: 'Paste your JSON into the editor on this page and it is formatted instantly. Switch between pretty-print and minified output, choose 2- or 4-space indentation, and copy the result with one click. No account or upload required.' },
    { q: 'Does the JSON Formatter fix invalid JSON?', a: 'No  -  it tells you exactly what is wrong (missing commas, trailing commas, unquoted keys, mismatched brackets) and where, but it does not silently rewrite invalid input. You stay in control of the fix.' },
    { q: 'Is the JSON Formatter safe for production data?', a: 'Yes. Everything happens in your browser. Your JSON is never uploaded, logged, or cached on any server, so it is safe to paste API responses that contain customer data or secrets.' },
    { q: "What's the difference between format and minify?", a: 'Format (pretty-print) adds indentation and newlines for human reading. Minify strips all whitespace for a compact payload you send over the wire. The JSON Formatter does both with a single toggle.' },
    { q: 'Can the JSON Formatter handle large JSON files?', a: 'It handles megabytes of JSON in the browser. For multi-megabyte payloads you may see a short delay while the browser parses the tree  -  everything still stays local.' },
  ],
  'word-counter': [
    { q: 'What is the Word Counter?', a: 'The Word Counter is a free online tool that counts words, characters, sentences, paragraphs, and estimated reading time the moment you paste text. It is designed for writers, students, and anyone trimming copy to fit a limit.' },
    { q: 'How accurate is the word count?', a: 'The Word Counter splits on whitespace, which matches the convention every major editor (Google Docs, Microsoft Word, Pages) uses for plain prose. For text with unusual punctuation (code, hyphenated compounds) the count may differ from those editors by a few words.' },
    { q: 'What is the reading time estimate based on?', a: 'Reading time assumes 200 words per minute, the typical adult silent-reading speed. Pace varies by reader and material  -  technical writing reads slower, simple prose faster  -  so treat the number as a useful estimate rather than a hard truth.' },
    { q: 'Does the Word Counter save what I type?', a: 'No. Everything is processed in your browser in real time. Nothing is uploaded, stored, or sent to any server, so it is safe to paste unpublished drafts or confidential content.' },
    { q: 'Can I count characters with and without spaces?', a: 'Yes. The Word Counter shows both character totals alongside the word count, plus sentence and paragraph counts, updating as you type.' },
  ],
  'http-method-tester': [
    { q: 'What is the HTTP Method Tester?', a: 'The HTTP Method Tester is a browser-based HTTP tester for sending GET, POST, PUT, DELETE, and other requests with custom headers and body content.' },
    { q: 'Can I use it as an API tester?', a: 'Yes. You can use it as an API tester to try endpoints, inspect responses, and verify headers before you wire the request into code.' },
    { q: 'Does the HTTP tester send my data anywhere?', a: 'The interface runs in your browser, and the request goes only to the URL you enter. Toolblip does not store the requests you test here.' },
    { q: 'What should I use when I need to debug request headers?', a: 'Use this tool to send the request, then pair it with the HTTP Headers Viewer if you need a quick look at response headers and caching details.' },
    { q: 'Is the HTTP Method Tester free?', a: 'Yes. It is a free online HTTP tester with no signup required.' },
  ],
  'collocations-checker': [
    { q: 'What is a collocation checker?', a: 'A collocation checker helps you see whether two words sound natural together in English. It is useful when you want writing that feels more native and less translated.' },
    { q: 'What does the Collocations Checker check?', a: 'It checks common word pairings and suggests more natural alternatives when the phrasing sounds awkward or uncommon.' },
    { q: 'Can I use it for SEO copy?', a: 'Yes. It is useful for titles, descriptions, headings, and body copy when you want the wording to sound natural and clear.' },
    { q: 'Is the Collocations Checker free?', a: 'Yes. It is free to use in your browser with no signup required.' },
    { q: 'Does it store my text?', a: 'No. The text stays in your browser while you check the wording.' },
  ],
  'compress-mkv': [
    { q: 'What is the MKV Compressor?', a: 'The MKV Compressor reduces MKV file size so videos are easier to share, upload, and store.' },
    { q: 'How do I compress MKV files?', a: 'Upload the MKV file, choose your compression settings, and start the process. The tool is designed to make compress MKV workflows simple in the browser.' },
    { q: 'Will compression reduce video quality?', a: 'Usually, yes. Lower file size often means lower quality, so choose settings based on whether you care more about size or visual detail.' },
    { q: 'Can I use it to shrink MKV files for email or messaging apps?', a: 'Yes. That is one of the main use cases for the MKV compressor when file size matters more than keeping every original bit.' },
    { q: 'Is the MKV Compressor free?', a: 'Yes. It is a free online MKV compressor with no signup required.' },
  ],
  'character-counter': [
    { q: 'What is the Character Counter?', a: 'The Character Counter is a free online tool that counts characters and words and tracks your progress against four built-in limits: Tweet/X (280), LinkedIn (3,000), Meta Description (160), and Google Title (60). Perfect for writing content that has to fit.' },
    { q: 'Does the Character Counter count spaces?', a: 'Yes. It displays totals both with and without spaces, so you can match whatever limit a platform enforces.' },
    { q: 'What Twitter/X character limit does the Character Counter use?', a: 'The Character Counter uses 280 characters, the default Twitter/X limit for free accounts. Premium accounts allow longer posts, but the bar still warns you whenever you cross 280 because that is the limit non-Premium followers see.' },
    { q: 'Is meta description length really capped at 160?', a: 'Google truncates meta descriptions around 155–160 characters on desktop and around 120 on mobile. The Character Counter uses 160 as a safe upper bound for SEO.' },
    { q: 'Does the Character Counter work offline?', a: 'Yes. Once this page has loaded, the Character Counter runs entirely in your browser  -  no server calls, no tracking, and no signup.' },
  ],
  'base64': [
    { q: 'What is Base64 encoding?', a: 'Base64 is a way of representing binary data  -  images, files, keys  -  using 64 printable ASCII characters. It is commonly used to embed files in JSON, transport data through email, and inline images into CSS and HTML.' },
    { q: 'How do I encode text to Base64?', a: 'Paste your text into the editor on this page and the Base64 output appears instantly. Toggle the mode to decode a Base64 string back to its original text. Unicode and emoji are handled correctly.' },
    { q: 'Is Base64 encryption?', a: 'No. Base64 is an encoding, not encryption. Anyone with the output can decode it back to the original  -  do not use Base64 to hide secrets. For security, combine it with actual encryption like AES.' },
    { q: 'Why does Base64 output end in "=" characters?', a: 'The equals signs are padding. Base64 encodes data in groups of three bytes, so when the input length is not a multiple of three, "=" pads the final group to the right length.' },
    { q: 'Is the Base64 tool safe for sensitive data?', a: 'Yes. Encoding and decoding both happen in your browser. Nothing is uploaded or logged, so it is safe to use with API tokens, internal payloads, and other confidential content.' },
  ],
  'url-encode': [
    { q: 'What is URL encoding?', a: 'URL encoding (percent-encoding) converts characters that have special meaning in URLs  -  like spaces, &, ?, and =  -  into a safe form so they can be passed in a link or query string without breaking the URL.' },
    { q: 'When do I need to URL-encode a string?', a: 'Any time you embed user input, paths, or query parameters into a URL  -  building deep links, constructing API requests, or debugging a broken redirect. Encode values individually, not the whole URL.' },
    { q: "What's the difference between encodeURI and encodeURIComponent?", a: 'encodeURIComponent encodes every reserved character, which is what you want for query values and is what this tool uses. encodeURI leaves URL structural characters (/ ? : etc.) alone, which is rarely what you want when encoding user-supplied data.' },
    { q: 'Does URL encoding change my original data?', a: 'No. URL encoding is fully reversible  -  decoding gives you back the exact original string, byte for byte. The tool provides both directions.' },
    { q: 'Is the URL Encode tool safe for private URLs?', a: 'Yes. All encoding happens in your browser. URLs with tokens, session IDs, or other private parameters are not logged or sent anywhere.' },
  ],
  'uuid-generator': [
    { q: 'What is a UUID?', a: 'A UUID (Universally Unique Identifier) is a 128-bit ID  -  typically shown as 36 characters with dashes  -  that is extremely unlikely to collide across systems, which makes it ideal for database keys, file names, and distributed IDs.' },
    { q: 'What version of UUID does this tool generate?', a: 'The UUID Generator produces v4 UUIDs  -  random  -  using the browser\'s native crypto.randomUUID() function. That matches the recommendation in RFC 4122 for most application-level IDs.' },
    { q: 'Can I get the UUID without hyphens or in uppercase?', a: 'Yes. Toggle the hyphens off to get a 32-character compact form, and toggle UPPER to switch the hex digits to uppercase. The output updates in place.' },
    { q: 'Are these UUIDs cryptographically secure?', a: 'The UUID Generator uses crypto.randomUUID(), which is backed by the platform CSPRNG. That said, UUIDs are identifiers  -  use them for IDs, not for secrets.' },
    { q: 'Does the UUID Generator work offline?', a: 'Yes. Once the page is loaded, the generator runs entirely in your browser with no network calls.' },
  ],
  'case-converter': [
    { q: 'What case conversions does the Case Converter support?', a: 'The Case Converter turns text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE. All eight versions appear at once as you type, so you can copy whichever one you need.' },
    { q: 'How do I convert text to camelCase online?', a: 'Type or paste your text into the Case Converter and the camelCase version updates live. Spaces, hyphens, and underscores are stripped and every word after the first is capitalized  -  "my variable name" becomes "myVariableName".' },
    { q: "What's the difference between snake_case and kebab-case?", a: 'snake_case uses underscores (my_variable); kebab-case uses hyphens (my-variable). Python and Rust idiomatically use snake_case; CSS classes and URL slugs use kebab-case.' },
    { q: 'Does the Case Converter handle existing word boundaries?', a: 'Yes. The Case Converter splits on whitespace, hyphens, underscores, and the boundary between a lowercase and uppercase letter, so it can convert from camelCase or PascalCase to any other style without losing word breaks.' },
    { q: 'Is there a limit on how much text I can convert?', a: "No. The Case Converter handles paragraphs or entire documents in milliseconds, and it all happens in your browser so there's no upload limit." },
  ],
  'regex-tester': [
    { q: 'What is the Regex Tester?', a: 'The Regex Tester is a free online playground for regular expressions. Type a pattern, paste the text to match against, and see matches and capture groups highlighted live with flag support (g, i, m, s, u).' },
    { q: 'Which regex flavor does the Regex Tester use?', a: 'The Regex Tester uses JavaScript (ECMAScript) regex, which is the flavor you ship in a web app, Node.js script, or browser-side code. Named groups, lookbehinds, and unicode property escapes are all supported in modern browsers.' },
    { q: 'Can I test multiline regex patterns?', a: 'Yes. Toggle the m flag to make ^ and $ match line boundaries, or s to let . match newlines. The Regex Tester shows exactly which flags are active.' },
    { q: 'Does the Regex Tester explain my pattern?', a: 'Yes. The Regex Tester breaks down each token in the pattern  -  anchors, character classes, quantifiers, groups  -  into plain English so you can verify what it actually matches.' },
    { q: 'Is my regex and test text private?', a: 'Yes. Everything in the Regex Tester runs in your browser. Nothing is sent to any server, so you can test patterns against confidential logs and data.' },
  ],
  'jwt-decoder': [
    { q: 'What does the JWT Decoder show me?', a: 'The JWT Decoder splits a JSON Web Token into its three parts  -  header, payload, and signature  -  and pretty-prints the JSON so you can inspect claims like exp, iat, iss, and any custom fields.' },
    { q: 'Does the JWT Decoder verify the signature?', a: 'The JWT Decoder shows you what a token claims. Verification requires the secret or public key that issued the token and should be done server-side  -  never trust an unverified JWT for authorization.' },
    { q: 'Can I decode an expired JWT?', a: 'Yes. The JWT Decoder decodes any valid JWT regardless of expiry, which is useful for debugging expired-token bugs. Look at the exp claim to see when it was valid.' },
    { q: 'Is it safe to paste a JWT into the JWT Decoder?', a: 'The decoding happens in your browser, so the token is never sent to any server. That said, a JWT is a credential  -  if you paste a production token anywhere, rotate it when you\'re done.' },
    { q: 'Why is the signature garbled after decoding?', a: 'The first two segments of a JWT are base64-encoded JSON; the third is a binary signature. The JWT Decoder shows it unchanged because the raw bytes are not meant to be human-readable.' },
  ],
  'cron-parser': [
    { q: 'What does the Cron Expression Parser do?', a: 'The Cron Expression Parser takes any 5-field cron expression and shows you what it means in plain English, plus the next five times it will run, so you catch mistakes before you deploy.' },
    { q: 'What cron syntax does the parser support?', a: 'The Cron Expression Parser supports standard 5-field cron (minute, hour, day-of-month, month, day-of-week) with wildcards, ranges, lists, and step values  -  the dialect used by vixie-cron, cronie, and most Linux systems.' },
    { q: 'Why does my cron expression match both a day-of-month AND a day-of-week?', a: 'Standard cron OR\'s the two date fields whenever both are non-wildcard, so `0 9 15 * 1` runs on the 15th OR on Mondays  -  not "the 15th if it\'s a Monday". The Cron Expression Parser makes that explicit in the plain-English output.' },
    { q: 'Is sub-minute scheduling supported?', a: 'No  -  cron\'s minimum resolution is one minute. For faster cadence you need a systemd timer or a long-running daemon. The Cron Expression Parser flags any expression that tries to fake sub-minute scheduling.' },
    { q: 'Does the Cron Expression Parser respect timezones?', a: 'The parser computes run times in your local timezone so you can sanity-check them, but remember that cron on a server runs in the server\'s timezone unless you set CRON_TZ at the top of the crontab.' },
  ],
  'lorem-ipsum-generator': [
    { q: 'What is Lorem Ipsum?', a: 'Lorem Ipsum is pseudo-Latin placeholder text used by designers and developers since the 1500s. It fills layouts with realistic-looking content so you can evaluate typography, spacing, and hierarchy without being distracted by the meaning of the words.' },
    { q: 'How much text can I generate?', a: 'Drag the slider for 1 to 20 paragraphs, each with 4–8 randomized sentences. Output regenerates instantly in your browser whenever you change the count or hit Regenerate.' },
    { q: 'Does the Lorem Ipsum Generator start with "Lorem ipsum dolor sit amet"?', a: 'Yes by default  -  and you can toggle it off if you\'d rather jump straight into randomized content. Starting with the classic phrase signals "placeholder" to anyone reviewing the mockup.' },
    { q: 'Can I generate HTML-wrapped Lorem Ipsum?', a: 'Yes. The Lorem Ipsum Generator outputs plain text by default, or wraps paragraphs in `<p>` tags with a single toggle so you can paste straight into a template.' },
    { q: 'Is it OK to use Lorem Ipsum in a real product?', a: 'Only during design and prototyping. Ship with real copy  -  Lorem Ipsum left in production is the sort of thing that ends up on social media.' },
  ],
  'qr-code-generator': [
    { q: 'What can I encode with the QR Code Generator?', a: 'Anything that fits in a string  -  URLs are the most common, but plain text, WiFi credentials in the standard `WIFI:` format, vCard contact details, SMS templates, and email links all work. Type or paste the value, click Generate, and download the result.' },
    { q: 'Can I download the QR code as SVG?', a: 'Yes. The QR Code Generator exports both PNG (for quick sharing) and SVG (for print and scalable designs). SVG files stay crisp at any size, which is the right choice for posters and packaging.' },
    { q: 'Does the QR Code Generator track what I encode?', a: 'No. Everything is generated client-side, so the URLs, passwords, or contact details you encode never leave your browser. This is especially important for WiFi QR codes, which contain your network password.' },
    { q: 'How large should my QR code be for a poster?', a: "A good rule of thumb is that the QR code's size should be 1/10th the scanning distance  -  so a poster scanned from 2 meters needs a code at least 20 cm square. Pick the XL size and the SVG export to keep edges sharp at print resolution." },
    { q: 'What size should I pick?', a: 'S (128 px) is fine for a thumbnail or inline doc. M (256 px) is the safe default for the web. L and XL (512 / 1024 px) are for print, posters, or anything that will be scaled up further. The QR Code Generator keeps the contents identical across sizes.' },
  ],
  'color-picker': [
    { q: 'What formats does the Color Picker output?', a: 'HEX (6-digit), HEX 3 (the shorthand form when applicable), RGB, and HSL. Each value is copy-ready for CSS, design tools, or code.' },
    { q: 'How do I pick a color?', a: 'Click the color swatch on the left to open your browser\'s native color picker, drag through the spectrum, or type a HEX value directly. The other formats update live.' },
    { q: 'Does the Color Picker check accessibility?', a: 'Yes. The Color Picker shows the WCAG contrast result for the picked color against white, with an AAA / AA / Fail badge so you can quickly tell whether the color is safe to use as text or a UI element on a white background.' },
    { q: "What's the difference between HSL and RGB?", a: 'RGB mixes red, green, and blue channels  -  how screens physically produce color. HSL thinks in terms of hue (which color), saturation (how vivid), and lightness (how bright), which matches how designers talk about color. Both describe the same values; HSL is just easier to reason about.' },
    { q: 'Does the Color Picker work offline?', a: 'Yes. Once the page has loaded, the Color Picker runs entirely in your browser. Bookmark it and reach for it even without an internet connection.' },
  ],
  'password-generator': [
    { q: 'How strong are the passwords from the Password Generator?', a: 'The Password Generator uses the browser\'s crypto.getRandomValues  -  cryptographically secure randomness  -  so a 16-character password with full character variety is well beyond brute-force range for any modern attacker.' },
    { q: 'Does the Password Generator store or log my passwords?', a: 'No. Passwords are generated in your browser and never sent anywhere. Nothing is logged, stored, or cached  -  close the tab and the password is gone unless you saved it to your password manager.' },
    { q: 'What length should I choose?', a: 'Use at least 16 characters for everyday accounts, and 20+ for high-value logins (banking, email, password-manager master passwords). Length beats complexity  -  every extra character roughly doubles the brute-force cost.' },
    { q: 'Should I include special characters?', a: 'Yes, unless a site blocks them. Special characters expand the search space and defeat dictionary attacks. The Password Generator lets you exclude ambiguous characters (like l/1 and O/0) for when you need to type the password by hand.' },
    { q: 'What does the strength indicator mean?', a: 'It estimates entropy from the chosen length and the size of the active character pool. "Weak" is below ~36 bits, "Fair" up to ~60, "Strong" up to ~100, and "Very strong" beyond that. For online accounts, aim for Strong or higher.' },
  ],
  'hash-generator': [
    { q: 'Which hash algorithms does the Hash Generator support?', a: 'The Hash Generator produces MD5, SHA-1, SHA-256, and SHA-512 hashes simultaneously. SHA hashes are computed via the browser\'s native Web Crypto API; MD5 is computed in pure JavaScript locally. For password hashing specifically, use bcrypt, scrypt, or Argon2 instead.' },
    { q: 'Is the Hash Generator safe for sensitive input?', a: 'Yes. All hashing happens in your browser. The text you hash never leaves the page, so it\'s safe for checksums on confidential strings or comparing internal fingerprints.' },
    { q: 'Should I use MD5 or SHA-1 for passwords?', a: 'No. MD5 and SHA-1 are cryptographically broken and fast  -  attackers can brute-force billions of guesses per second. Use bcrypt, scrypt, or Argon2 for password storage. MD5 and SHA-1 are fine for non-security uses like cache keys and fingerprints.' },
    { q: 'Are the hashes encoded as hex?', a: 'Yes  -  lowercase hex by default. Toggle UPPERCASE to switch the digits A–F to upper case. If you need a different encoding (Base64, etc.), copy the hex and convert it with the Base64 tool.' },
    { q: 'Why do I always get the same hash for the same input?', a: 'That\'s the defining property of a hash function: deterministic output. If you need different outputs for the same input (for password storage), add a random salt before hashing  -  the bcrypt and Argon2 tools do this automatically.' },
  ],
  'mp4-to-gif': [
    { q: 'What does the MP4 to GIF tool do?', a: 'It converts MP4 videos into animated GIFs in your browser. Paste or upload a clip, pick the start and end range, and download the GIF when it is ready.' },
    { q: 'How do I convert MP4 to GIF online?', a: 'Open the MP4 to GIF tool, choose your video, trim the portion you want, and generate the GIF. No desktop software or signup is required.' },
    { q: 'Can I make a looping GIF from a short MP4 clip?', a: 'Yes. The MP4 to GIF tool is designed for short looping clips, reaction GIFs, and social snippets you can share anywhere.' },
    { q: 'Is the MP4 to GIF converter free to use?', a: 'Yes. The MP4 to GIF tool is free, runs in your browser, and does not require an account.' },
    { q: 'Is my video uploaded anywhere?', a: 'The conversion runs locally in your browser. Your MP4 stays on your machine unless the page explicitly tells you otherwise for a specific operation.' },
    { q: 'What makes a good GIF from MP4?', a: 'Short clips with clear motion and a tight crop usually produce the best GIFs. Keep the segment brief to balance file size and quality.' },
  ],
  'poll-generator': [
    { q: 'What does the Poll Generator do?', a: 'It helps you create simple polls with answer options you can share on social platforms, in chats, or in audience surveys. Paste your topic, add your choices, and copy the finished poll text.' },
    { q: 'How do I create a poll online?', a: 'Open the Poll Generator, type your question, add answer choices, and copy the output for Twitter, Instagram, or a survey form. The tool formats the poll for quick sharing.' },
    { q: 'Can I make a Twitter poll with this tool?', a: 'Yes. The Poll Generator is useful for creating Twitter-style poll options and concise captions that are easy to post.' },
    { q: 'Is the Poll Generator free?', a: 'Yes. The Poll Generator is free to use and does not require an account.' },
    { q: 'Can I use it for audience surveys?', a: 'Yes. It works well for quick audience surveys, product feedback prompts, and lightweight community questions.' },
    { q: 'Does the Poll Generator save my questions?', a: 'No. The content is only used to generate the poll text in your browser, so your draft stays on your device.' },
  ],
  'text-diff': [
    { q: 'How does the Text Diff tool compare my text?', a: 'It splits both inputs into lines and runs a longest-common-subsequence diff. Lines that match are shown unchanged, lines only in the original are marked as removed (−), and lines only in the changed text are marked as added (+).' },
    { q: 'Can it diff more than just plain text?', a: 'Yes  -  anything you can paste in. Code, JSON, logs, configuration files, or commit messages all work. The line-based view is what most code review tools use, so it should look familiar.' },
    { q: 'Does the diff highlight inline word changes?', a: 'Not currently. The Text Diff tool works at the line level. If you want to see what changed within a single line, paste the two versions on their own lines and the result will show them side by side.' },
    { q: 'Is my text uploaded anywhere?', a: 'No. The diff is computed entirely in your browser, so even sensitive code, contracts, or logs stay on your machine.' },
    { q: 'Why are some lines counted as changed when only whitespace differs?', a: 'A line with different whitespace is technically a different line. To ignore those differences, normalize whitespace before pasting (or trim trailing spaces in your editor) and run the diff again.' },
  ],
  'remove-duplicate-lines': [
    { q: 'How does the Remove Duplicate Lines tool decide what counts as a duplicate?', a: 'By default, two lines are duplicates when they match after lowercasing. Toggle Case-sensitive to treat "Apple" and "apple" as different, or enable Trim whitespace to ignore leading and trailing spaces when comparing.' },
    { q: 'Does it preserve the original order?', a: 'Yes. The first occurrence of each unique line is kept in its original position; later duplicates are dropped. This is the behaviour most people want when cleaning a list.' },
    { q: 'Can I skip empty lines?', a: 'Yes. Toggle Skip empty and the tool drops any line that is blank (or contains only whitespace) before deduping. Useful when pasting text with stray newlines.' },
    { q: 'Is there a limit on input size?', a: 'No fixed limit  -  the tool runs in your browser. Tens of thousands of lines process in well under a second; very large inputs are bounded only by your device\'s memory.' },
    { q: 'Will my data be uploaded?', a: 'No. The Remove Duplicate Lines tool is fully client-side. Whatever you paste  -  addresses, IDs, log lines  -  never leaves your browser.' },
  ],
  'markdown-to-html': [
    { q: 'What flavor of Markdown does this tool support?', a: 'The Markdown to HTML converter uses GitHub Flavored Markdown (GFM)  -  headings, lists, links, tables, fenced code blocks, blockquotes, and inline formatting all work the same way they do on GitHub.' },
    { q: 'Can I see the rendered output and the HTML source?', a: 'Yes. Toggle the right pane between Preview (rendered HTML) and HTML (the raw source). The Copy button always copies the HTML source so you can paste it straight into a CMS or an email template.' },
    { q: 'Is the rendered HTML safe to copy into my site?', a: 'It\'s clean HTML  -  no inline styles, no scripts, no class names  -  so it drops cleanly into most CMSes. If your input contains raw HTML, GFM passes it through; sanitize before publishing user-supplied input.' },
    { q: 'Does the Markdown to HTML tool work offline?', a: 'Yes. Conversion happens entirely in your browser via the marked library. Once the page is loaded you can use it without an internet connection, and nothing you paste leaves your device.' },
    { q: 'Why isn\'t my Markdown rendering the way I expect?', a: 'Most surprises come from blank-line rules  -  Markdown needs a blank line before a heading, a list, or a code fence for them to be recognized. Switch to the HTML view to see exactly what was produced.' },
  ],
  'yaml-to-json': [
    { q: 'What\'s the difference between YAML and JSON?', a: 'They describe the same shape of data  -  objects, arrays, strings, numbers, booleans, null. YAML is friendlier to read and supports comments; JSON is stricter and more universal as an interchange format. Most config files in modern tooling are YAML; most APIs speak JSON.' },
    { q: 'Can the YAML to JSON tool convert in both directions?', a: 'Yes. Switch between YAML → JSON and JSON → YAML, or use the Swap button to feed the output back as input. The same parser is used both ways so round-tripping is lossless for standard data.' },
    { q: 'How is YAML output formatted?', a: 'JSON is pretty-printed with 2-space indentation. YAML output uses 2-space indentation, no document markers, and 80-character line width  -  the defaults for js-yaml and the format most teams use for config files.' },
    { q: 'Does the converter support YAML anchors and references?', a: 'Yes. Anchors (&name) and aliases (*name) are resolved when converting to JSON. Going from JSON back to YAML produces a flat document  -  JSON has no anchor concept, so duplicated values are simply written out in full.' },
    { q: 'Is my YAML uploaded anywhere?', a: 'No. The YAML to JSON tool runs in your browser using js-yaml. Config files often contain secrets and infrastructure details; nothing is sent over the network.' },
  ],
  'json-to-yaml': [
    { q: 'How is the YAML output formatted?', a: 'YAML output uses 2-space indentation, no document markers, and 80-character line width  -  the defaults for js-yaml and the format most teams use for config files. JSON-style strings stay quoted only where YAML requires it.' },
    { q: 'Does the converter handle nested arrays and objects?', a: 'Yes. Arbitrarily nested JSON structures convert cleanly into YAML\'s indentation-based format. Round-trip back to JSON via the Swap button to verify nothing was lost.' },
    { q: 'What happens to JSON null and booleans in YAML?', a: 'They convert to YAML\'s native null, true, and false literals. Strings that happen to look like those keywords are quoted automatically to avoid ambiguity.' },
    { q: 'Can I convert YAML back to JSON?', a: 'Yes  -  switch the direction tab. The same parser handles both directions, so you can round-trip data without losing structure.' },
    { q: 'Is my JSON uploaded anywhere?', a: 'No. Conversion happens entirely in your browser, so configuration that contains internal hostnames or secrets stays on your device.' },
  ],
  'xml-to-json': [
    { q: 'How does the XML to JSON converter handle attributes?', a: 'Attributes are placed under an `@attributes` key on the parent object. Text content from a mixed node goes under `#text`. This is the convention used by xml2js and many other libraries  -  it round-trips cleanly back to XML.' },
    { q: 'Does it handle repeated child elements?', a: 'Yes. When the same tag appears multiple times under the same parent, the converter emits an array. A single occurrence stays as an object  -  the most common convention for XML-to-JSON mapping.' },
    { q: 'Can I convert JSON back to XML?', a: 'Yes. Switch the direction tab and the tool emits well-formed XML, restoring `@attributes` to real attributes and `#text` to inner text. The JSON must have exactly one root key, since XML requires a single root element.' },
    { q: 'What about XML namespaces and CDATA?', a: 'Prefixed element names (like `ns:tag`) are preserved as-is in the JSON keys. CDATA sections collapse to plain text content during parsing. For specialised XML-Schema work you\'ll want a dedicated tool.' },
    { q: 'Is the XML uploaded somewhere?', a: 'No. The XML to JSON tool uses the browser\'s built-in DOMParser; no parsing happens on a server. SOAP responses and config files stay private to your browser.' },
  ],
  'sql-to-json': [
    { q: 'What does the SQL to JSON tool do?', a: 'It parses SQL `INSERT INTO table (cols...) VALUES (...)` statements and emits the rows as a JSON array  -  handy when you need to load fixture data into an app, generate seed JSON from a SQL dump, or eyeball a few rows.' },
    { q: 'Can it run SELECT queries?', a: 'No. There\'s no database in your browser, so the tool can\'t execute queries against your data. It parses INSERT statements only  -  the structured form where rows live inline in the SQL text.' },
    { q: 'Which SQL dialects work?', a: 'Standard MySQL, PostgreSQL, and SQLite-style INSERTs all parse cleanly: backtick or double-quoted identifiers, single-quoted strings, NULL/TRUE/FALSE literals, numeric values, multiple rows per VALUES clause, and -- or /* */ comments.' },
    { q: 'What about INSERT statements without column names?', a: 'They work  -  values are emitted as `col1`, `col2`, etc. Add an explicit column list (`INSERT INTO t (a, b) VALUES (...)`) to get meaningful keys in the JSON output.' },
    { q: 'Is my SQL sent anywhere?', a: 'No. Parsing happens locally in your browser. Database dumps often contain PII, internal IDs, and credentials in connection strings  -  nothing leaves the page.' },
  ],
  'js-minifier': [
    { q: 'What does this minifier actually do?', a: 'It strips comments, collapses runs of whitespace, and removes unnecessary spacing around operators  -  the safe rewrites that don\'t change behaviour. It does NOT rename variables or perform tree-shaking; for production use, run terser or esbuild as part of your build.' },
    { q: 'Will it break my code?', a: 'It\'s designed not to. The minifier respects strings, template literals, and regex literals and never collapses whitespace inside them. Run your test suite after minifying anything you\'ll ship.' },
    { q: 'How much can I save?', a: 'Typical hand-written code shrinks 20–40% from comment and whitespace removal alone. The output panel shows the byte count before and after so you can see exactly how much was saved.' },
    { q: 'Why doesn\'t it rename variables?', a: 'Safe identifier renaming requires full scope analysis to avoid breaking closures, eval, and `with`. That\'s what tools like terser do  -  they\'re heavier but produce smaller output. This tool is for quick comment/whitespace stripping in the browser.' },
    { q: 'Is my code uploaded?', a: 'No. The JS Minifier runs entirely in your browser, so even proprietary or unreleased code stays on your machine.' },
  ],
  'javascript-minifier': [
    { q: 'What does this minifier actually do?', a: 'It strips comments, collapses runs of whitespace, and removes unnecessary spacing around operators  -  the safe rewrites that don\'t change behaviour. It does NOT rename variables or perform tree-shaking; for production use, run terser or esbuild as part of your build.' },
    { q: 'Will it break my code?', a: 'It\'s designed not to. The minifier respects strings, template literals, and regex literals and never collapses whitespace inside them. Run your test suite after minifying anything you\'ll ship.' },
    { q: 'How much can I save?', a: 'Typical hand-written code shrinks 20–40% from comment and whitespace removal alone. The output panel shows the byte count before and after so you can see exactly how much was saved.' },
    { q: 'Why doesn\'t it rename variables?', a: 'Safe identifier renaming requires full scope analysis to avoid breaking closures, eval, and `with`. That\'s what tools like terser do  -  they\'re heavier but produce smaller output. This tool is for quick comment/whitespace stripping in the browser.' },
    { q: 'Is my code uploaded?', a: 'No. The JavaScript Minifier runs entirely in your browser, so even proprietary or unreleased code stays on your machine.' },
  ],
  'number-base-converter': [
    { q: 'Which bases does the Number Base Converter support?', a: 'Binary (base 2), Octal (base 8), Decimal (base 10), and Hexadecimal (base 16). Pick the source base, type a number, and all four representations update at once.' },
    { q: 'Does it handle very large numbers?', a: 'Yes. The conversion uses BigInt under the hood, so it stays exact for numbers far beyond JavaScript\'s 2^53 safe-integer limit. Useful for hashes, 64-bit IDs, and bitmasks.' },
    { q: 'Can I convert negative numbers?', a: 'Yes. Prefix the input with `-` and every output is shown with the negative sign. The tool does not produce two\'s-complement representations  -  for that, you\'d apply the bitwise inverse of the magnitude in the chosen width.' },
    { q: 'Why is my hex value rejected?', a: 'Hex digits are 0–9 and A–F (case insensitive). Anything else  -  punctuation, the `0x` prefix, or a stray space  -  causes the input to be rejected. Strip the `0x` and any separators and try again.' },
    { q: 'Is the conversion done in my browser?', a: 'Yes. Conversion is pure-JS arithmetic on BigInt and runs locally  -  nothing about the numbers you enter is logged or sent anywhere.' },
  ],
  'url-slug-generator': [
    { q: 'What is a URL slug?', a: 'A slug is the readable, hyphenated tail of a URL (`/blog/how-to-build-a-slug`). Slugs are kinder to readers and search engines than `?id=42` URLs and survive content edits when the underlying ID changes.' },
    { q: 'How does the URL Slug Generator handle accents and emoji?', a: 'Accented characters are folded to their ASCII equivalents (`café` → `cafe`) using Unicode NFKD normalization. Emoji and other non-Latin characters that have no obvious romanization are stripped  -  slugs are deliberately conservative to stay portable.' },
    { q: 'What separator should I use?', a: 'Hyphens (`-`) are the safest, most-supported choice and what Google explicitly recommends. Use underscores (`_`) only if your CMS forces them, and dots (`.`) only inside file-style paths. Mixing separators across a site hurts consistency.' },
    { q: 'Is there a recommended length limit?', a: '50–75 characters is a good zone for blog posts. Longer slugs are technically fine but get truncated in search results and shared links  -  pick a length and stick with it.' },
    { q: 'Can I generate slugs offline?', a: 'Yes. The slugifier is pure JavaScript that runs entirely in your browser. Once the page has loaded, it works without an internet connection.' },
  ],
  'url-parameter-extractor': [
    { q: 'What does the URL Params Extractor do?', a: 'Paste any URL and it lists every query parameter (`?key=value&...`) and the URL fragment (`#anchor`). Each value can be copied individually, or you can grab the whole set as a JSON object  -  handy for documenting an API call or building a test fixture.' },
    { q: 'Decoded vs Raw  -  which should I use?', a: 'Decoded shows what the server actually sees after `decodeURIComponent` (so `hello%20world` becomes `hello world`). Raw shows the over-the-wire form. Use Decoded when reading values, Raw when you need to reproduce the URL exactly.' },
    { q: 'Does it handle URLs without a scheme?', a: 'Yes. If you paste `example.com/path?x=1`, the tool prepends `https://` to make it a valid URL. The displayed scheme will reflect the assumption.' },
    { q: 'How are repeated parameters handled?', a: 'The list shows every occurrence in order, so `?id=1&id=2` gives you two rows. The "Copy as JSON" output collapses duplicates into an array under that key.' },
    { q: 'Is the URL sent anywhere?', a: 'No. Parsing uses the browser\'s built-in `URL` and `URLSearchParams` APIs, all in your tab  -  useful when the URL contains tokens, session IDs, or anything else you wouldn\'t paste into a server-side tool.' },
  ],
  'meta-tag-generator': [
    { q: 'Which meta tags does this tool generate?', a: 'A complete head-snippet covering the basics  -  `<title>`, `<meta name="description">`  -  plus Open Graph tags for Facebook/LinkedIn previews and Twitter Card tags for X. That set covers >95% of real-world social-share unfurling.' },
    { q: 'What size should the OG image be?', a: '1200×630 px is the safe sweet spot. Facebook, LinkedIn, and Slack all crop to roughly this aspect ratio. Smaller than 600×315 and the platforms downgrade to a small thumbnail.' },
    { q: 'Do I need a separate Twitter image?', a: 'No. Twitter falls back to `og:image` when `twitter:image` is missing, so a single well-sized image works everywhere. Add a Twitter-specific image only if you want a different crop for X.' },
    { q: 'What\'s the difference between og:type "website" and "article"?', a: '`website` is the safe default. Use `article` for blog posts and news pages  -  it lets you add `article:published_time`, `article:author`, etc., and some platforms render that metadata more richly.' },
    { q: 'How do I test the result?', a: 'Paste the live URL into the social-share debugger from each platform  -  Meta\'s Sharing Debugger, X\'s Card Validator, LinkedIn\'s Post Inspector. Those tools also let you re-scrape the page after you push changes.' },
  ],
  'serp-preview': [
    { q: 'What length should my title and description be?', a: 'Keep titles under 60 characters and meta descriptions under 160. Google truncates anything longer in search results  -  those limits are based on pixel width on desktop and shrink slightly on mobile.' },
    { q: 'Will Google use the description I write?', a: 'Sometimes. Google rewrites about 60% of meta descriptions to better match the user\'s query, so treat the description as a strong hint rather than a guarantee. A clear, query-relevant description gives you the best chance.' },
    { q: 'Is the preview pixel-perfect?', a: 'It\'s a close approximation of how Google renders the result on a typical desktop or mobile screen. Real SERP layout varies by query, device, sitelinks, and personalisation  -  use the preview as a guide, not a pixel-exact mirror.' },
    { q: 'Why does the URL show as a breadcrumb?', a: 'Google replaced raw URLs with breadcrumb paths derived from your URL structure in 2020. Sites with clean, hierarchical URLs (`/category/post-slug`) get cleaner breadcrumbs in search.' },
    { q: 'Does this affect my live SEO?', a: 'No  -  the SERP Preview is a visualizer. It doesn\'t crawl, modify, or submit anything to Google. Push your title/description to the live page first, then test it in Google Search Console for the real scrape.' },
  ],
  'aac-to-flac': [
    { q: 'Does the AAC to FLAC tool actually give me a FLAC file?', a: 'No. Browsers don\'t ship a FLAC encoder, so after decoding your AAC audio with the Web Audio API, the tool writes the decoded samples into a standard 16-bit PCM WAV file instead. The banner above the convert button flags this before you start.' },
    { q: 'Which files can I upload?', a: 'The tool accepts .aac, .m4a, and .mp4 files, since all three commonly carry AAC-encoded audio streams.' },
    { q: 'Will I lose audio quality in the conversion?', a: 'No extra quality is lost in this step: the WAV file captures the decoded samples as uncompressed PCM. Quality lost when the source was originally encoded to AAC can\'t be recovered, since AAC itself is a lossy format.' },
  ],
  'aac-to-m4r': [
    { q: 'Does this re-encode my audio to build the ringtone?', a: 'No. It repackages your original AAC bytes as-is into a file with the .m4r extension, the format iOS expects for custom ringtones. There\'s no transcoding step, so the underlying audio is untouched.' },
    { q: 'Will the file work as an iPhone ringtone right away?', a: 'iOS accepts .m4r files added through Finder file sharing, but Apple also caps ringtones at 40 seconds. Trim your source clip to under 40 seconds before converting or iOS may reject or cut off the result.' },
    { q: 'What\'s the difference between this and the AAC to MP4 tool?', a: 'Both repackage the same AAC audio without re-encoding, just under different extensions: .m4r for iPhone ringtones, .mp4 for a generic audio-in-a-video-container wrapper. Pick whichever your destination app expects.' },
  ],
  'aac-to-mp3': [
    { q: 'Does the AAC to MP3 tool actually produce an MP3?', a: 'No, it produces a WAV file. Browsers can\'t ship an MP3 encoder, so the tool decodes your AAC audio with the Web Audio API and writes the result as 16-bit PCM WAV instead. A banner above the convert button explains this upfront.' },
    { q: 'Why convert to WAV instead of keeping the AAC file?', a: 'WAV opens cleanly in almost every audio editor, DAW, and voice recorder app, including older software that struggles with AAC, so it trades file size for broad compatibility.' },
    { q: 'Can I upload M4A files too?', a: 'Yes. The uploader accepts .aac, .m4a, and .mp4, since all three typically hold AAC-encoded audio.' },
  ],
  'aac-to-mp4': [
    { q: 'Does converting to MP4 turn my audio into a video file?', a: 'No. The tool wraps your original AAC bytes in a file labeled with the .mp4 extension and a video/mp4 type, without adding a video track or re-encoding the audio. The banner in the tool spells this out.' },
    { q: 'Why would I want an MP4-labeled audio file?', a: 'Some upload forms and platforms only accept .mp4 for audio submissions. This gives you that extension without touching the underlying AAC data.' },
    { q: 'Is any audio quality lost?', a: 'No. The original bytes are copied unchanged into the new container label, so there\'s no re-encoding and no quality loss.' },
  ],
  'aac-to-wav': [
    { q: 'How does the AAC to WAV conversion work?', a: 'The tool decodes your AAC audio with the browser\'s Web Audio API, then writes the decoded samples into a standard 16-bit PCM WAV file at the same sample rate and channel count as the source.' },
    { q: 'Is the WAV output lossless?', a: 'The step from decoded audio to 16-bit PCM WAV adds no further compression, so you get the full decoded signal. Quality lost during the original AAC encoding can\'t be recovered at this stage, since AAC is a lossy format.' },
    { q: 'Does it handle stereo audio correctly?', a: 'Yes. The tool reads the channel count from the decoded audio buffer and writes each channel into the WAV file, so mono and stereo sources both convert correctly.' },
  ],
  'accessibility-checker': [
    { q: 'What does the Accessibility Checker actually inspect?', a: 'Paste in HTML and it parses the markup to flag missing image alt text, a missing lang attribute on the html tag, a missing page title, buttons and links without accessible names, form inputs without an associated label, and missing landmark elements like header, main, nav, and footer.' },
    { q: 'Does it measure color contrast like a full WCAG audit?', a: 'It runs a basic heuristic scan for likely contrast problems rather than computing rendered contrast ratios the way a browser DevTools audit or axe-core would. Use it as a first pass, then verify contrast-sensitive pages with a dedicated contrast checker.' },
    { q: 'Do I need to give it a live URL?', a: 'No. Paste raw HTML directly into the tool and it parses it with the browser\'s built-in DOMParser, so you can check a page before it\'s even deployed.' },
  ],
  'age-calculator': [
    { q: 'What breakdown does the Age Calculator show?', a: 'Enter a birth date and it shows your exact age in years, months, and days, plus totals in days, weeks, and hours since you were born.' },
    { q: 'Does it tell me when my next birthday is?', a: 'Yes. It calculates the date of your next birthday and counts down the days remaining until it arrives.' },
    { q: 'How does it handle the day-of-month math near leap years?', a: 'When the current day of the month falls before your birth day, the calculator borrows days from the previous calendar month using that month\'s actual length, which keeps the day/month/year breakdown accurate across February and leap years.' },
  ],
  'article-generator': [
    { q: 'Does the AI Article Generator use a real AI model?', a: 'No. It builds a placeholder Markdown article from your topic, with headings and filler paragraphs sized to a realistic word count. It\'s meant for testing layout, CMS formatting, and word counts before real copy is ready, not for publishing as-is.' },
    { q: 'Can I use the output directly as a finished article?', a: 'It\'s not designed for that. Treat it as structured filler text, similar to Lorem Ipsum but shaped like an article, so you can drop it into a template and see how headings, paragraphs, and length actually render.' },
    { q: 'What format does it generate?', a: 'Markdown, with heading levels and paragraph breaks already in place, so you can paste it straight into a CMS field or static site generator that expects Markdown input.' },
  ],
  'article-rewriter': [
    { q: 'How does the AI Article Rewriter change my text?', a: 'It scans your pasted article word by word and swaps common words for alternatives from a built-in synonym dictionary, keeping sentence structure and punctuation intact.' },
    { q: 'Does it use a language model to reword sentences?', a: 'No. It\'s a rule-based synonym swap, not generative AI, so it won\'t restructure sentences or change meaning, only substitute individual words it recognizes.' },
    { q: 'What happens to words that aren\'t in the synonym dictionary?', a: 'They\'re left exactly as you typed them. Only words with a known synonym entry get swapped, so proper nouns, technical terms, and less common words pass through unchanged.' },
  ],
  'article-writer': [
    { q: 'Does the AI Article Writer generate real, publishable copy?', a: 'No. Like the Article Generator, it produces a placeholder Markdown article scaffolded around your topic, useful for testing layout and word counts before you write or commission real copy.' },
    { q: 'How is this different from the AI Article Generator?', a: 'Both produce the same kind of placeholder Markdown output; this one is framed as drafting a starting scaffold around a specific topic you supply. Use whichever fits your workflow.' },
    { q: 'Can I edit the output before using it?', a: 'Yes. The output is plain Markdown text, so you can copy it out and edit headings, paragraphs, and structure freely before dropping it into your CMS.' },
  ],
  'cold-email-writer': [
    { q: 'Does the AI Cold Email Writer use AI to write the email?', a: 'No. It fills a tone-based template (formal, friendly, casual, or persuasive) with the recipient, goal, product, and call to action you provide, then assembles a complete subject line and body from those fields.' },
    { q: 'Can I get a different email each time without changing my inputs?', a: 'Yes. Each tone has a couple of template variants, and the tool picks between them, so regenerating with the same fields can produce a slightly different phrasing.' },
    { q: 'What happens if I leave the subject line blank?', a: 'The tool builds a subject line automatically from your stated goal and chosen tone, so you still get a complete, sendable draft even without typing one yourself.' },
  ],
  'essay-writer': [
    { q: 'Does the AI Essay Writer use AI to write the essay for me?', a: 'No, and the tool says so directly: it builds a real, structured essay outline and scaffold from your inputs rather than generating finished prose with AI.' },
    { q: 'What does the scaffold actually include?', a: 'A structured outline built from your thesis and supporting points, organized into an intro, body sections, and conclusion, ready for you to expand into full paragraphs yourself.' },
    { q: 'Is this meant to replace writing the essay myself?', a: 'No. It\'s meant to solve the blank-page problem by giving you real structure to write into, not a finished essay you submit as-is.' },
  ],
  'humanizer-ai': [
    { q: 'What does the AI Humanizer actually do to my text?', a: 'It swaps common, stiff-sounding words for more natural alternatives from a built-in synonym dictionary, aiming to make robotic-sounding phrasing read a bit more like normal writing.' },
    { q: 'Will it fool an AI detector?', a: 'It isn\'t designed to defeat AI-detection tools, and results will vary between detectors. It\'s a word-choice smoothing pass, not a rewrite that changes sentence structure or tone at a deeper level.' },
    { q: 'Does it use a language model?', a: 'No. It runs a rule-based synonym substitution locally, the same mechanism behind the Article Rewriter, just applied to words that tend to sound mechanical.' },
  ],
  'ai-rephraser': [
    { q: 'How does the AI Text Rephraser reword my sentences?', a: 'It walks through your text word by word and swaps recognized words for alternatives from a built-in synonym dictionary, so sentence order and punctuation stay the same while individual word choices change.' },
    { q: 'Do I get the same rephrasing every time?', a: 'Not necessarily. Where a word has more than one listed synonym, the tool can pick a different one on repeat runs, so rephrasing the same input twice may not produce identical output.' },
    { q: 'What kind of words does it leave alone?', a: 'Anything not in its synonym dictionary passes through untouched, including names, technical terms, and niche vocabulary, so the output stays readable instead of being force-swapped into odd substitutes.' },
  ],
};

export function getFaqs(tool: Tool): FAQ[] {
  return OVERRIDES[tool.slug] ?? templateFaqs(tool);
}
