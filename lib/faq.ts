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
  'base64-encoder-decoder': [
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
  'ai-twitter-generator': [
    { q: 'Does the AI Twitter/X Generator use a real AI model?', a: 'No. It fills fixed hook, body, and call-to-action templates with your topic, picking randomly from several phrasings for whichever hook style you choose: question, statement, stat, or quote.' },
    { q: 'Are the numbers in the "stat" hooks real statistics?', a: 'No. Stat-style hooks like "97% of people don\'t know this" are placeholder phrasing, not researched figures. Replace any number before posting if you use a stat-style hook.' },
    { q: 'Can it generate a thread instead of a single tweet?', a: 'Yes. Set the tweet count above 1 and the tool chains multiple templated tweets together into a numbered thread built around the same topic.' },
  ],
  'algorithm-visualizer': [
    { q: 'Which sorting algorithms can I visualize?', a: 'Bubble sort, selection sort, and insertion sort. Each run generates the full sequence of comparison and swap steps for the array you provide, then steps through them one at a time.' },
    { q: 'Can I use my own array of numbers?', a: 'Yes. Enter your own values and the tool generates the step-by-step sort sequence for that exact array instead of a preset example.' },
    { q: 'Does it explain the time complexity of each algorithm?', a: 'The tool focuses on the visual step-through of comparisons and swaps rather than a written complexity breakdown, so pair it with a reference on Big O if you need the formal complexity classes.' },
  ],
  'audio-to-text': [
    { q: 'Does it transcribe audio files I upload?', a: 'No. It uses your browser\'s built-in Web Speech API to transcribe live microphone input in real time, not pre-recorded audio files. A banner in the tool makes this clear before you start.' },
    { q: 'Which browsers support the live transcription?', a: 'Chrome, Edge, and Safari expose the Web Speech API this tool relies on. If your browser isn\'t supported, it falls back to a manual text box where you can paste or type a transcript instead.' },
    { q: 'Can I edit the transcript after speaking?', a: 'Yes. The transcript appears in an editable area as you speak, and you can copy it to your clipboard once you\'re done, or replace it entirely using the manual input box.' },
  ],
  'automation-wizard': [
    { q: 'Does the Automation Wizard actually run my automations?', a: 'No, it\'s a builder: you assemble triggers, actions, and conditions from template blocks, and it exports the result as a JSON or YAML workflow definition. Running it requires feeding that definition into an actual automation platform.' },
    { q: 'What kinds of triggers and actions can I add?', a: 'Triggers include webhooks, schedules, incoming email, and form submissions. Actions include HTTP requests, sending email, posting to Slack, and simple data transforms or filters.' },
    { q: 'What format is the exported workflow in?', a: 'You can export as JSON, structured around a trigger plus an ordered list of steps, or as YAML with the same trigger/steps shape, whichever your automation runner expects.' },
  ],
  'api-auth-header-generator': [
    { q: 'What types of auth headers can it build?', a: 'Bearer tokens, HTTP Basic auth from a username and password, and custom API-key headers with your own header name and optional prefix.' },
    { q: 'How is the Basic auth header encoded?', a: 'It base64-encodes your username and password together as user:pass using the browser\'s built-in btoa, then formats it as an Authorization: Basic header, the same encoding curl and Postman use.' },
    { q: 'Does it store or send my credentials anywhere?', a: 'No. The header string is built entirely in your browser and only exists on the page until you copy it; nothing is transmitted or logged.' },
  ],
  'api-doc-generator': [
    { q: 'What input does the API Doc Generator need?', a: 'Paste a sample JSON response and give the endpoint a name. The tool inspects the JSON\'s keys and value types and builds a Markdown reference doc around them.' },
    { q: 'Does it document more than GET requests?', a: 'The generated template assumes a GET endpoint returning the JSON you provided. For POST/PUT bodies or multiple methods on the same path, use the API Endpoint Documenter tool instead.' },
    { q: 'What does the output look like?', a: 'A Markdown page with a description section and a response-fields table listing each key, its inferred type (string, number, array, object, and so on), and a short auto-generated description.' },
  ],
  'api-endpoint-documenter': [
    { q: 'Can I document more than one endpoint at once?', a: 'Yes. Add as many endpoints as you need, each with its own method, path, description, request body, and response example, and the tool compiles them into a single Markdown document.' },
    { q: 'Which HTTP methods does it support?', a: 'GET, POST, PUT, PATCH, and DELETE, each color-coded in the editor so a long list of endpoints stays easy to scan.' },
    { q: 'Does this tool call my API to get the response examples?', a: 'No. You paste in the request body and response example yourself; the tool only formats what you provide into structured Markdown.' },
  ],
  'api-spec-generator': [
    { q: 'What does the API Spec Generator produce?', a: 'A basic OpenAPI 3.0 YAML skeleton: an info block, a server URL, and structure inferred from a sample JSON response you paste in.' },
    { q: 'Where does it get the title, version, and base URL from?', a: 'From your JSON if you include title/name, version, and baseUrl/base_path fields. Anything missing falls back to a placeholder like "API", "1.0.0", or https://api.example.com that you edit afterward.' },
    { q: 'Is this a complete, validated OpenAPI spec?', a: 'It\'s a starting skeleton, not a full spec, since it can only infer structure from one example response. Run the output through an OpenAPI validator before relying on it for codegen or docs hosting.' },
  ],
  'all-in-one-unit-converter': [
    { q: 'Which unit categories does it cover?', a: 'Length, weight, temperature, volume, and several other common categories, all in one converter instead of separate tools per category.' },
    { q: 'How does it handle temperature, since that isn\'t a simple multiply?', a: 'Temperature uses a dedicated formula-based conversion between Celsius, Fahrenheit, and Kelvin, rather than the multiply-by-factor math used for length, weight, and volume.' },
    { q: 'How accurate are the conversions?', a: 'Length, weight, and volume conversions use fixed numeric factors between units, so results are exact to floating-point precision, not rounded estimates.' },
  ],
  'anagram-generator': [
    { q: 'Does it only return real English words?', a: 'No. It generates every possible letter rearrangement of your input and filters by minimum length, but it doesn\'t check results against a dictionary, so nonsense letter strings show up mixed in with real words.' },
    { q: 'Why does it cap the number of results?', a: 'The number of permutations grows factorially with word length: an 8-letter word already has over 40,000 arrangements. The max-results limit keeps the page responsive instead of generating every single one.' },
    { q: 'Can I filter out short results?', a: 'Yes. Set a minimum length and anything shorter than that is excluded from the list before it\'s capped to your maximum-results setting.' },
  ],
  'angle-unit-converter': [
    { q: 'Which angle units does it support?', a: 'Degrees, radians, gradians, and turns, so you can convert between the units math, engineering, and game-development contexts each tend to prefer.' },
    { q: 'Is the radian conversion exact?', a: 'It uses the exact mathematical relationship of pi radians equaling 180 degrees, so results are as precise as JavaScript floating-point math allows, not a rounded approximation.' },
    { q: 'Can I convert negative angles?', a: 'Yes. Negative values pass through the same conversion formulas and produce a correctly signed result in the target unit.' },
  ],
  'area-converter': [
    { q: 'Which area units are supported?', a: 'Common metric and imperial units including square meters, square feet, acres, and hectares, so you can convert between land-measurement and everyday units in one place.' },
    { q: 'Are the conversions based on fixed ratios?', a: 'Yes. Each unit has a fixed conversion factor relative to a base unit, so results are exact rather than rounded lookup-table estimates.' },
    { q: 'Can I convert very large areas like hectares to square feet?', a: 'Yes. The conversion is pure arithmetic on the factor between whichever two units you pick, so it works the same whether you\'re converting a small room or a large plot of land.' },
  ],
  'article-title-generator': [
    { q: 'Does the Article Title Generator use AI to write titles?', a: 'No. It fills a set of proven headline templates with your topic and shuffles them, giving you several different angles (how-to, listicle, question-based, and more) to pick from.' },
    { q: 'Will it give me the same titles every time?', a: 'The template set is fixed, but the order is shuffled on each run, so regenerating with the same topic surfaces the options in a different sequence rather than one fixed list.' },
    { q: 'Can I use the titles as-is?', a: 'They\'re meant as a starting point. Swap in specifics from your actual article, numbers, names, or outcomes, since the templates use your topic as a generic placeholder.' },
  ],
  'ascii-art-generator': [
    { q: 'How does the ASCII Art Generator turn text into block letters?', a: 'Each letter and digit maps to a fixed 5-column by 7-row pixel grid; the tool looks up your text character by character and renders the grid using block characters.' },
    { q: 'Which characters are supported?', a: 'Uppercase letters A through Z, digits 0 through 9, and spaces. Lowercase input is automatically uppercased before rendering, and unsupported characters render as a blank space.' },
    { q: 'Can I copy the output as plain text?', a: 'Yes. The result is plain monospaced text using block characters, so it copies and pastes cleanly into any code comment, README, or terminal banner.' },
  ],
  'avi-to-gif': [
    { q: 'Does this actually produce a GIF file?', a: 'Not yet. The tool decodes your video with the HTML5 video element and extracts up to 30 frames at 10fps, but encoding those frames into an animated GIF needs a dedicated library the page doesn\'t ship. It currently shows the first extracted frame as a PNG preview, and the banner above the upload box says so upfront.' },
    { q: 'What should I use for a real animated GIF?', a: 'FFmpeg on your desktop, for example ffmpeg -i input.avi output.gif, will encode the full animation. The in-browser tool is meant for a quick frame preview, not a finished GIF.' },
    { q: 'Why does it only grab 30 frames?', a: 'Frame extraction happens by seeking the video element to specific timestamps and reading each one off a canvas, which is slow in-browser. Capping it at 30 frames (about 3 seconds at 10fps) keeps the preview responsive instead of locking up the tab on a long video.' },
  ],
  'avi-to-mkv': [
    { q: 'Does this tool re-encode my AVI video?', a: 'No. AVI to MKV is a container change, not a codec change, so the tool re-wraps your original file into an .mkv download without touching the video or audio streams. The blue banner above the upload box explains this before you start.' },
    { q: 'Will the picture or audio quality change?', a: 'No. Since the underlying streams are copied byte-for-byte into the new container, quality is identical to your source AVI file.' },
    { q: 'When would I need FFmpeg instead?', a: 'If your player specifically needs the streams re-encoded to different codecs rather than just re-wrapped, ffmpeg -i input.avi -c copy output.mkv (or with real transcoding flags) handles that on desktop.' },
  ],
  'avi-to-mov': [
    { q: 'Does this actually convert AVI to a playable MOV file?', a: 'No, and the amber banner says so directly. MOV typically expects different codecs than AVI, and re-encoding video isn\'t something a browser tab can do, so the download you get is a placeholder, your original file renamed with a .mov extension.' },
    { q: 'Why show a placeholder instead of just refusing?', a: 'It keeps the workflow visible: you can see exactly what upload/download step a real converter would need, and the yellow result banner repeats that FFmpeg is required for an actual codec conversion before you rely on the file.' },
    { q: 'What FFmpeg command does real AVI to MOV conversion?', a: 'Something like ffmpeg -i input.avi -c:v prores -c:a pcm_s16le output.mov, which re-encodes into QuickTime-compatible codecs rather than just changing the file extension.' },
  ],
  'avi-to-mp3': [
    { q: 'Can this pull the audio out of my AVI file?', a: 'It tries a real decode first: the Web Audio API attempts to decode your AVI\'s audio track, and if that succeeds you get an actual extracted WAV file, not a fake one. Many AVI audio codecs aren\'t supported by browsers, in which case you get a clear error instead of a broken download.' },
    { q: 'Why WAV instead of MP3?', a: 'Browsers have no built-in MP3 encoder. The red banner discloses this upfront: whatever audio the tool successfully decodes is written out as PCM WAV, which any audio tool can then convert to MP3 if you need that format specifically.' },
    { q: 'What if the extraction fails?', a: 'You\'ll see the exact FFmpeg command to run instead, ffmpeg -i video.avi -vn -acodec pcm_s16le output.wav, since some AVI files use audio codecs no browser can decode at all.' },
  ],
  'avi-to-mp4': [
    { q: 'Is this a real video conversion or just a rename?', a: 'It\'s a container re-package: your AVI\'s video and audio streams are copied as-is into an MP4 wrapper, with no transcoding. The blue banner and the note under the download link both say this directly.' },
    { q: 'Why doesn\'t it convert the actual codec?', a: 'Real codec transcoding needs an encoder library a browser tab doesn\'t have access to. Re-wrapping works because MP4 and AVI can both carry the same compressed video streams; if your AVI uses a codec MP4 players don\'t support, FFmpeg is what actually re-encodes it.' },
    { q: 'Will this fix an AVI file that won\'t play on my phone?', a: 'Only if the playback problem was the .avi container itself. If the codec inside is the issue, re-wrapping to .mp4 won\'t change that, and you\'d need ffmpeg -i input.avi output.mp4 to force a real re-encode.' },
  ],
  'azw3-to-epub': [
    { q: 'Can this tool actually convert my Kindle book to EPUB?', a: 'No, and it says so before you upload anything: browsers have no way to parse the AZW3 container format, so this page can only point you to the right desktop tool rather than perform the conversion itself.' },
    { q: 'What should I use instead?', a: 'Calibre is the free, open-source option built specifically for this, and the tool lists it along with KindleUnpack (for extracting AZW3 content) and Sigil (for manually fixing up the resulting EPUB).' },
    { q: 'Will this work on any AZW3 file I own?', a: 'Only DRM-free ones. Amazon\'s DRM-protected Kindle books can\'t legally or technically be converted by Calibre or any other tool without first being stripped of that protection, which this page does not do.' },
  ],
  'azw3-to-mobi': [
    { q: 'Why would I convert AZW3 down to the older MOBI format?', a: 'Some older Kindle devices and third-party e-readers only support MOBI (KF7), while AZW3 (KF8) is Amazon\'s newer format. Downgrading trades away KF8-only features like fixed layouts and improved typography for broader compatibility.' },
    { q: 'Will I lose formatting in the conversion?', a: 'Likely some. The tool\'s banner explains that MOBI is an older format with fewer layout features than AZW3, so anything relying on KF8-specific formatting may not carry over cleanly.' },
    { q: 'Does the browser do the actual conversion?', a: 'No. This page can\'t read AZW3 content directly, it points you to Calibre or Amazon\'s KindleGen for the real conversion, and only helps you decide whether downgrading to MOBI is worth the formatting trade-off.' },
  ],
  'backslash-escape-unescape': [
    { q: 'What contexts does the escaper support?', a: 'JSON, JavaScript, regex, HTML, and a general catch-all, each with its own escaping rules, for example JavaScript also escapes angle brackets to \\x3C/\\x3E, and HTML escapes entities like &amp; and &lt; instead of backslashes.' },
    { q: 'What\'s the difference between JSON and JavaScript mode?', a: 'JSON mode escapes quotes, backslashes, and whitespace control characters the way a valid JSON string requires. JavaScript mode adds single-quote escaping and also escapes < and > to \\x3C and \\x3E, useful when embedding a string inside an inline <script> tag.' },
    { q: 'Can I go from escaped text back to plain text?', a: 'Yes. Switch to Unescape mode, or use the Swap button to flip the current output back into the input box with the mode reversed, and the same context-specific rules run in reverse.' },
  ],
  'base-number-converter': [
    { q: 'Which number bases does it support?', a: 'Binary, octal, decimal, hexadecimal, and base-32, selectable independently as both the source and target base, so you can convert directly between any two, not just to and from decimal.' },
    { q: 'What happens if I enter digits invalid for the selected base?', a: 'The conversion returns "Invalid input for selected base" rather than silently producing a wrong number, since JavaScript\'s parseInt would otherwise interpret out-of-range digits unpredictably.' },
    { q: 'Can I quickly reverse the conversion?', a: 'Yes. The swap button flips the From and To bases and moves the current result into the input field, so you can convert back without retyping anything.' },
  ],
  'base64-file-encoder': [
    { q: 'Does this work with any file type, or just text?', a: 'Any file type. It reads the file as raw bytes via the FileReader API and Base64-encodes the binary data directly, so PDFs, images, zip archives, and executables all encode correctly, not just plain text.' },
    { q: 'How do I get my original file back from a Base64 string?', a: 'Switch to Decode mode and paste the Base64 text. The tool reconstructs the original bytes with atob and offers a direct download link, so you get the file back rather than just a text dump.' },
    { q: 'Is there a file size limit?', a: 'There\'s no hard cap in the tool itself, but very large files can be slow to encode and will produce a Base64 string roughly a third larger than the original file, since Base64 always expands binary data.' },
  ],
  'base64-image-converter': [
    { q: 'Does it show me a preview of the image, or just the raw text?', a: 'Both. Encoding a file renders the actual image using the generated data URL, and decoding a pasted Base64 string reconstructs the image bytes and displays it the same way, not just a text box full of characters.' },
    { q: 'What image formats can I encode?', a: 'Any format the browser can read as a file, including JPG, PNG, GIF, and WebP. The output data URL embeds the correct MIME type automatically based on what you uploaded.' },
    { q: 'Can I decode Base64 that isn\'t a full data URL?', a: 'Yes. If you paste raw Base64 without the data:image/...;base64, prefix, the tool assumes image/png and still decodes and previews it.' },
  ],
  'base64-image-decoder': [
    { q: 'How is this different from the Base64 Image Converter?', a: 'This tool is decode-only: paste or load a Base64 string and it reconstructs the image and gives you a download link. It doesn\'t have an encode mode for turning an image into Base64, which is what the Converter tool is for.' },
    { q: 'Can I load Base64 data from a file instead of pasting it?', a: 'Yes. The Load from file button accepts a .txt or .b64 file containing the Base64 string, reads it as text, and decodes it the same way as pasted input.' },
    { q: 'What happens with invalid Base64 data?', a: 'You\'ll see an "Invalid Base64 image data" message instead of a broken image, since the decode step wraps the atob call in error handling rather than letting it fail silently.' },
  ],
  'base64-image-viewer': [
    { q: 'Does this tool decode the Base64 data like the Decoder does?', a: 'No. It validates that your input is a proper data:image/...;base64,... URL and then hands that string straight to an <img> tag\'s src attribute, letting the browser do the actual decoding. There\'s no atob step or downloadable file, just a live preview.' },
    { q: 'Why does it reject some Base64 strings?', a: 'It checks two things before displaying anything: that the string matches the data:[mime];base64, pattern, and that the mime type starts with image/. Raw Base64 without that data URL prefix, or a data URL for a non-image type, gets an explicit error instead of a blank preview.' },
    { q: 'Can I copy the data URL back out after loading it?', a: 'Yes, once the input validates successfully, a Copy Data URL button appears above the preview.' },
  ],
  'batch-favicon-downloader': [
    { q: 'Where do the favicon images actually come from?', a: 'Google\'s public favicon service (www.google.com/s2/favicons), requested at 128px for each domain you list. The tool doesn\'t crawl or host favicons itself, it builds the request URL from each domain and lets Google\'s service return the icon.' },
    { q: 'How many URLs can I process at once?', a: 'As many as you paste in, one per line. Each line is parsed into a domain and turned into its own favicon request, so a list of dozens of sites is fetched in one batch.' },
    { q: 'What if a site has no favicon Google can find?', a: 'You\'ll see a red X placeholder for that entry instead of a broken image, since the img tag\'s onError handler catches the failed load and hides the broken icon.' },
  ],
  'batch-image-resizer': [
    { q: 'Can I resize multiple images at once?', a: 'Yes. Drop or select several files and each one is resized independently to the same target dimensions using its own canvas pass, then all results appear as a downloadable grid.' },
    { q: 'Does resizing crop or stretch my images?', a: 'Neither. Images are scaled to fit within the target box while preserving their aspect ratio, then centered on a white background, so nothing is cropped and nothing is distorted, unlike a straight stretch-to-fit resize.' },
    { q: 'What size presets are available?', a: 'Common video and thumbnail sizes like HD, Full HD, Square, Portrait, and Thumbnail, or you can type in custom width and height with an optional aspect-ratio lock that keeps the two in proportion as you edit either field.' },
  ],
  'bcrypt-hash-generator': [
    { q: 'What library actually generates the hash?', a: 'The real bcryptjs npm package, running client-side, producing standard $2b$ bcrypt hashes that are compatible with any other bcrypt implementation on a server or in another language.' },
    { q: 'What does the cost factor slider control?', a: 'The number of hashing rounds, from 4 (fastest) to 14 (slowest and most resistant to brute-force cracking). Bcrypt is deliberately slow, and a higher cost factor makes each guess an attacker tries more expensive.' },
    { q: 'Can I check whether a password matches an existing hash?', a: 'Yes. The Verify Password field runs bcrypt.compareSync against the hash currently shown, and reports a clear match or no-match result.' },
  ],
  'bill-sale-generator': [
    { q: 'What does the generated document actually cover?', a: 'Seller and buyer names and addresses, an item description, sale price with optional tax, payment method, and toggles for as-is sale versus implied warranty, formatted as a printable bill of sale with signature lines at the bottom.' },
    { q: 'How do I save it as a PDF?', a: 'The Print / Save PDF button triggers your browser\'s print dialog, where choosing "Save as PDF" as the destination produces a PDF version of the generated document.' },
    { q: 'Is this a legally binding contract template?', a: 'The generated document includes a disclaimer that it\'s provided for informational purposes only and isn\'t legal advice, since requirements for a valid bill of sale vary by state and item type.' },
  ],
  'bill-splitter': [
    { q: 'How is the tip calculated?', a: 'Either as a percentage of the bill using one of the quick-select buttons (10, 15, 18, 20, or 25 percent) or as a custom flat tip amount you type in directly, whichever you set last.' },
    { q: 'What if people want to split unevenly?', a: 'The tool divides the bill plus tip equally across the number of people you enter, it doesn\'t support assigning different amounts per person or itemized splitting.' },
    { q: 'Can I copy the breakdown to share with the group?', a: 'Yes. Copy Summary puts the bill total, tip amount, grand total, and per-person share on your clipboard as plain text, ready to paste into a chat.' },
  ],
  'bin-hex-dec-converter': [
    { q: 'Do I need to convert one pair of bases at a time?', a: 'No. Pick a single input base and enter a number, and the result shows all three: binary, decimal, and hexadecimal, at once, rather than making you choose a separate output base each time.' },
    { q: 'What does the Next Base button do?', a: 'It cycles the input base through binary, decimal, and hexadecimal in sequence and clears the current input, a quick way to switch what you\'re typing without opening a dropdown.' },
    { q: 'Can I feed one of the results back in as new input?', a: 'Yes. Each conversion result has a "Use as input" link that loads that value, in its matching base, back into the input field so you can continue converting from there.' },
  ],
  'binary-converter': [
    { q: 'Does this convert numbers between bases like binary-to-hex?', a: 'No. This tool converts text to and from raw binary byte values (each character becomes an 8-bit ASCII code and back), not numeric base conversion. For converting a number like 255 into binary, use a base or hex converter instead.' },
    { q: 'What format does the binary output use?', a: 'Each character becomes an 8-bit binary byte, zero-padded and separated by spaces, for example "Hello" becomes five space-separated 8-bit groups, one per letter.' },
    { q: 'What happens if I paste invalid binary in Binary to Text mode?', a: 'You\'ll get an explicit "Invalid binary string" error if the cleaned input contains anything other than 0s and 1s, rather than a garbled or silently wrong text result.' },
  ],
  'binary-decimal-hex-converter': [
    { q: 'How is this different from the Bin-Hex-Dec Converter?', a: 'Both convert one input base to all three bases at once, but this version presents each result in its own color-coded card (blue for binary, green for decimal, purple for hex) with a "Convert to All" button, rather than the cycling next-base swap the other tool uses.' },
    { q: 'Can I chain conversions using a previous result?', a: 'Yes. Each result card has a "Use as input" link that loads that exact value back into the input field with the matching base already selected.' },
    { q: 'Does it handle negative numbers?', a: 'Yes. Negative decimal input converts to a minus-signed binary and hex representation rather than using two\'s complement encoding.' },
  ],
  'binary-to-decimal': [
    { q: 'Does it only convert to decimal, or other bases too?', a: 'Despite the name, it converts your binary input to decimal, hexadecimal, and octal all at once, showing all three with individual copy buttons rather than requiring three separate lookups.' },
    { q: 'Can I go the other direction, decimal to binary?', a: 'No, this tool only accepts binary input. For the reverse direction, the Base Number Converter or Bin-Hex-Dec Converter both let you pick decimal as the source base.' },
    { q: 'What counts as valid input?', a: 'Only the digits 0 and 1, with optional whitespace between groups. Anything else triggers an "Invalid binary" message instead of attempting a conversion.' },
  ],
  'binary-to-text': [
    { q: 'What format should the binary input be in?', a: 'Each character is expected as an 8-bit group of 0s and 1s, space separated, for example "01001000 01100101" for "He". Extra whitespace or line breaks between groups are stripped automatically before decoding.' },
    { q: 'Can I convert text into binary too, not just decode it?', a: 'Yes. The Text to Binary side of the swap converts each character to its 8-bit ASCII binary value, zero padded and space separated, and the swap button flips between the two directions instantly.' },
    { q: 'What happens if the binary has an invalid character?', a: 'You get an explicit "Invalid binary string" error if anything other than 0, 1, and whitespace is present, instead of a garbled or silently wrong text result.' },
  ],
  'blur-background': [
    { q: 'Does this blur only the background, or the whole photo?', a: 'The whole image gets blurred uniformly using a canvas blur filter. There is no subject detection or background segmentation, so a face or foreground object in the shot is blurred along with everything behind it.' },
    { q: 'How do I control how strong the blur is?', a: 'A slider sets the blur radius in pixels, and the preview updates live as you drag it, so you can dial in anything from a light softening to a heavy blur before downloading.' },
    { q: 'Why did loading an image from a URL fail?', a: 'Some hosts block cross-origin canvas reads, which prevents the blurred result from being exported. Uploading the image file directly instead of pasting a URL avoids that restriction entirely.' },
  ],
  'bmi-calculator': [
    { q: 'Does it support both metric and imperial units?', a: 'Yes. Switching to metric uses kilograms and centimeters with the standard kg / m squared formula, while imperial uses pounds and inches with the 703 multiplier formula, so you never have to convert units yourself.' },
    { q: 'What do the result categories mean?', a: 'Your BMI number is matched against the standard underweight, normal, overweight, and obese thresholds, and the matching category is shown alongside the number rather than leaving you to look up the ranges separately.' },
    { q: 'Does it account for age, sex, or muscle mass?', a: 'No, it only computes the standard weight-to-height BMI ratio. It does not adjust for age, sex, or body composition, which is a known limitation of the BMI formula itself, not something this calculator tries to correct.' },
  ],
  'broken-image-checker': [
    { q: 'How does it find the images on a page?', a: 'It fetches the page HTML through a server-side proxy, parses out every img tag, and sends a real HEAD request to each resulting image URL to check whether it actually loads.' },
    { q: 'Why does it flag an image as broken when it looks fine in my browser?', a: 'Some servers block HEAD requests or CORS from outside origins, which can make a perfectly working image report as unreachable. This is a disclosed limitation of checking images from another site rather than from within the page itself.' },
    { q: 'What does the status shown for each image mean?', a: 'It is the real HTTP status code returned by that image URL, for example 200 for a working image or 404 for one that no longer exists at that path.' },
  ],
  'browser-image-resizer': [
    { q: 'Does my photo get uploaded to a server to resize it?', a: 'No. Resizing happens entirely in a canvas element in your browser, so the file never leaves your device.' },
    { q: 'Can I resize without distorting the image?', a: 'Yes, a lock aspect ratio toggle recalculates the height automatically whenever you change the width (or vice versa), so the proportions stay correct unless you deliberately unlock it.' },
    { q: 'What file format does the resized image download as?', a: 'The output is exported as a PNG generated from the canvas, regardless of whether your source image was a JPEG, PNG, or another format.' },
  ],
  'bulk-generator': [
    { q: 'What placeholders can I use in a custom template?', a: 'Any combination of {{i}} for the row number, {{word}}, {{email}}, {{name}}, and {{date}}, which get substituted with generated values on every row you produce.' },
    { q: 'What is the maximum number of rows I can generate?', a: 'Up to 1000 rows in a single generation. Entering a higher count is automatically capped at 1000.' },
    { q: 'What output formats are built in?', a: 'Ready-made templates for a JSON array, CSV rows, SQL INSERT statements, and HTML list items, alongside a plain numbered list, all editable before you generate.' },
  ],
  'business-name-generator': [
    { q: 'How does it come up with name ideas?', a: 'It combines your keyword with a fixed set of prefixes (like Nova or Apex), suffixes (like Hub or Labs), and domain-style endings (like tech or app), producing straightforward combinations rather than claiming any AI creativity.' },
    { q: 'How many suggestions do I get per search?', a: 'Twenty name ideas, shuffled into random order each time, drawn from the full set of prefix, suffix, and domain combinations for your keyword.' },
    { q: 'Does it check if the name or domain is actually available?', a: 'No, it only generates name and domain-style string ideas. You would still need to check a domain registrar or trademark database separately before committing to one.' },
  ],
  'business-slogan-generator': [
    { q: 'Are the slogans AI-written?', a: 'No, they come from a fixed set of about twenty slogan templates with your topic substituted in, not from an AI model generating new phrasing each time.' },
    { q: 'Can I filter slogans by tone?', a: 'Yes, you can filter the generated list by tone, such as bold, playful, or professional, to narrow results down to the style you want.' },
    { q: 'Will I get the same slogans if I search the same topic twice?', a: 'Yes, since the templates are fixed, the same topic and tone filter will produce the same set of slogans each time rather than new random phrasing.' },
  ],
  'byte-converter': [
    { q: 'What units does it convert between?', a: 'Bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes, all shown at once from a single input value.' },
    { q: 'Does it use 1024 or 1000 as the conversion factor?', a: 'It uses the binary 1024-based factor between each unit (as used by operating systems reporting file and disk sizes), not the decimal 1000-based factor some storage manufacturers use.' },
    { q: 'Do I need to pick which unit I am converting from?', a: 'Yes, you select the unit your input number is already in, and every other unit updates automatically from that single value.' },
  ],
  'canonical-tag-checker': [
    { q: 'Does this tool fetch my page to check its actual canonical tag?', a: 'No. It builds a recommended canonical tag from the URL you enter and flags common structural issues, but it does not fetch the page\'s actual HTML to see what canonical tag, if any, is already there.' },
    { q: 'What kind of issues does it flag?', a: 'Common structural problems like using HTTP instead of HTTPS, inconsistent www usage, unnecessary query parameters, and trailing slash mismatches that can split ranking signals across URL variants.' },
    { q: 'How is this different from the Canonical URL Generator?', a: 'This tool audits a URL you provide and suggests fixes without touching the page itself. The Canonical URL Generator actually transforms a URL according to rules you toggle on, producing a cleaned-up version you can copy directly.' },
  ],
  'canonical-url-generator': [
    { q: 'What transformations can I apply?', a: 'Toggle switches let you force HTTPS, strip or add www, remove trailing slashes, strip query parameters, and remove hash fragments, each applied using the browser URL API rather than plain string editing.' },
    { q: 'Will it validate that the URL is reachable?', a: 'No, it only reformats the URL string you enter according to the rules you select. It does not send any request to check whether the resulting URL actually loads.' },
    { q: 'How is this different from the Canonical Tag Checker?', a: 'This tool transforms and cleans a URL directly based on toggles you control. The Canonical Tag Checker instead builds a suggested tag and flags structural issues without altering a URL you provide.' },
  ],
  'character-frequency-counter': [
    { q: 'Is the count case sensitive?', a: 'You can toggle case sensitivity, so "A" and "a" either count as the same character or as two separate entries depending on your setting.' },
    { q: 'Can I sort the results?', a: 'Yes, results can be sorted either by frequency (most common character first) or alphabetically by the character itself.' },
    { q: 'Can I export the frequency table?', a: 'Yes, the full character-by-count breakdown can be exported as a CSV file for use in a spreadsheet.' },
  ],
  'character-variety-checker': [
    { q: 'How is the variety score calculated?', a: 'Twenty five points each are awarded for including uppercase letters, lowercase letters, digits, and special characters, plus a bonus based on how many unique characters appear relative to the total length, capped at 100.' },
    { q: 'What does it tell me is missing?', a: 'It lists exactly which character types (uppercase, lowercase, digits, special characters) are absent from your text, so you know precisely what to add to raise the variety score.' },
    { q: 'Is this meant to check password strength?', a: 'It checks character-type variety and uniqueness in any text, including passwords, but it does not check against breached-password lists or estimate crack time the way a dedicated password strength tool would.' },
  ],
  'chart-maker': [
    { q: 'What chart types can I create?', a: 'Bar, line, pie, and doughnut charts, all rendered on a canvas from the data points you enter, with grid lines and labels drawn to scale.' },
    { q: 'How do I enter my data?', a: 'You add rows manually as a label and value pair, and each point can be removed individually, there is no file import, so it is best suited to smaller hand-entered datasets.' },
    { q: 'Can I save the chart as an image?', a: 'Yes, the finished chart downloads as a PNG generated directly from the canvas.' },
  ],
  'cidr-calculator': [
    { q: 'What does it calculate from a CIDR block?', a: 'The network address, subnet mask, wildcard mask, broadcast address, first and last usable host, and total usable host count, all computed from real bitwise operations on the address and prefix you enter.' },
    { q: 'Does it handle /31 and /32 subnets correctly?', a: 'Yes, those are handled as their real-world special cases: /31 as a point-to-point link with no usable host range, and /32 as a single host address, rather than applying the general host-count formula that would give a wrong answer for either.' },
    { q: 'Do I need to enter the subnet mask separately?', a: 'No, entering an address with its CIDR prefix (like 192.168.1.0/24) is enough, the subnet mask and every other value are derived from that prefix automatically.' },
  ],
  'circle-crop': [
    { q: 'What shapes can I crop to besides a circle?', a: 'Rounded square and plain square presets are also available alongside the circle crop, each using a real canvas clip path rather than just a CSS border-radius overlay.' },
    { q: 'What background options are there for the cropped-out area?', a: 'Transparent (the clipped-away corners are genuinely see-through in the exported PNG), solid white, or a blurred copy of your own image filling the space behind the cropped shape.' },
    { q: 'Can I control the output size?', a: 'Yes, a size slider sets the exported image dimensions, so you can produce anything from a small avatar-sized crop up to a larger image.' },
  ],
  'citation-generator': [
    { q: 'Does it look up the source automatically from a URL or ISBN?', a: 'No, you enter the author, title, year, publisher, and other fields yourself, the tool only formats whatever details you provide into the selected citation style, it does not fetch or verify source data.' },
    { q: 'Which citation styles are supported?', a: 'Book, article, website, and journal formats, each using the fields relevant to that source type, for example a website citation includes the access date and URL fields.' },
    { q: 'Which fields are required?', a: 'Title and author are required for every citation type, other fields like year fall back to "n.d." (no date) if left blank rather than blocking generation.' },
  ],
  'cmyk-to-rgb': [
    { q: 'What formula does the conversion use?', a: 'The standard CMYK to RGB formula, where each RGB channel is calculated as 255 times (1 minus that channel\'s ink percentage) times (1 minus the black percentage).' },
    { q: 'Is there a live color preview?', a: 'Yes, a swatch updates immediately to show the resulting RGB color as you adjust any of the four CMYK sliders.' },
    { q: 'Will this match my printed output exactly?', a: 'It uses the standard mathematical conversion, not an ICC color profile calibrated to a specific printer or paper stock, so it is meant for approximate on-screen reference rather than exact print color matching.' },
  ],
  'code-beautifier': [
    { q: 'Which languages can it format?', a: 'JavaScript, TypeScript, Python, HTML, CSS, and JSON each have their own dedicated formatting logic tailored to that language\'s syntax, rather than one generic formatter applied to everything.' },
    { q: 'Can it minify code as well as beautify it?', a: 'Yes, a separate minify mode strips unnecessary whitespace and line breaks (or uses compact JSON.stringify output for JSON), producing a condensed version of the same code.' },
    { q: 'Can I choose tabs vs spaces and the indent size?', a: 'Yes, both are configurable options that control how the beautified output is indented across all supported languages.' },
  ],
  'code-diff': [
    { q: 'What algorithm does it use to compare two code blocks?', a: 'A longest common subsequence (LCS) algorithm, the same class of algorithm behind tools like diff and git diff, which finds the actual minimal set of added and removed lines rather than just flagging any line that moved as changed.' },
    { q: 'How are additions and removals shown?', a: 'Added lines, removed lines, and unchanged context lines are each shown with a distinct marker, so you can see exactly what changed between the two versions line by line.' },
    { q: 'Can I copy the diff output?', a: 'Yes, the result copies as plain text with +, -, and space prefixes on each line, a format you can paste elsewhere or include in notes.' },
  ],
  'code-to-diagram-generator': [
    { q: 'Does it use AI to understand what my code does?', a: 'No, it applies a line-based heuristic, for example treating each non-empty line as a node for a flowchart, or looking for arrow-like patterns for a sequence diagram, and outputs Mermaid syntax rather than analyzing program logic.' },
    { q: 'Which diagram types can it generate?', a: 'Flowchart, sequence, class, and generic Mermaid graph syntax, selectable based on the shape of diagram you want from your pasted code or pseudocode.' },
    { q: 'How do I actually view the diagram it generates?', a: 'The tool outputs Mermaid syntax as text and links to mermaid.live, where you paste it to render the visual diagram, it does not render the diagram itself.' },
  ],
  'color-blindness-simulator': [
    { q: 'Which types of color blindness does it simulate?', a: 'Protanopia, deuteranopia, and tritanopia, each using a published color transformation matrix specific to that condition rather than a generic desaturation filter.' },
    { q: 'How is the simulation actually calculated?', a: 'Your image\'s RGB pixel values are multiplied through the relevant simulation matrix for the selected condition, producing a genuine color-space transformation rather than just an overlay tint.' },
    { q: 'Can I compare the simulated version side by side with the original?', a: 'Yes, the original and the simulated result are shown together so you can directly compare how colors shift under each condition.' },
  ],
  'color-contrast-auditor': [
    { q: 'Does it check one color pair or several at once?', a: 'Both, you can check a single foreground and background pair for its contrast ratio and WCAG rating, or switch to batch mode to audit a whole list of colors against one background at once.' },
    { q: 'What standard is the contrast ratio based on?', a: 'The WCAG 2.1 relative luminance and contrast ratio formulas, the same math used to determine AA and AAA accessibility compliance.' },
    { q: 'How is this different from the Color Contrast Matrix tool?', a: 'This tool audits multiple colors against a single fixed background. The Color Contrast Matrix instead checks every color in your list against every other color, showing all pairwise combinations in a grid.' },
  ],
  'color-contrast-matrix': [
    { q: 'How is this different from the Color Contrast Auditor?', a: 'The Auditor checks a list of colors against one background color you choose. This tool instead builds a full grid checking every color in your list against every other color, so you can see all pairwise combinations at once.' },
    { q: 'What do the colors in the grid cells mean?', a: 'Each cell is color-coded by WCAG pass level, AAA, AA, AA Large, or Fail, based on the real contrast ratio between that row and column\'s colors.' },
    { q: 'Can I copy a specific ratio from the grid?', a: 'Yes, clicking a cell copies that pair\'s exact contrast ratio to your clipboard.' },
  ],
  'color-contrast-ratio-checker': [
    { q: 'How is this different from the Contrast Auditor and Contrast Matrix tools?', a: 'This is the simplest of the three, it checks exactly one foreground and background pair with a live sample-text preview, without the batch auditing or multi-color grid the other two provide.' },
    { q: 'What does the live preview show?', a: 'Sample text rendered in your chosen foreground color on your chosen background color, updating immediately so you can see readability alongside the numeric ratio.' },
    { q: 'What pass levels does it report?', a: 'AA, AAA, and AA Large Text ratings, each shown as pass or fail based on the calculated WCAG contrast ratio for your color pair.' },
  ],
  'color-format-converter-v2': [
    { q: 'Which input formats does it accept?', a: 'HEX (3 or 6 digit), RGB(), and HSL() values can all be typed in directly as your starting point, the tool detects the format and parses it accordingly.' },
    { q: 'What is the HEX8 output?', a: 'Your 6-digit hex value with "ff" appended for full opacity, it always represents fully opaque since there is no alpha value in the accepted input formats.' },
    { q: 'How accurate is the CMYK output for print?', a: 'It uses the standard mathematical RGB to CMYK approximation, not an ICC print profile, so it is suited to quick web reference rather than press-ready color matching.' },
  ],
  'color-format-picker': [
    { q: 'Can I edit the color from any of the three formats?', a: 'Yes. Typing or dragging in the HEX field, RGB sliders, or HSL sliders all update the other two formats live, so you can start from whichever format is easiest for your situation.' },
    { q: 'What happens if I type an invalid hex value?', a: 'The RGB and HSL values simply stop updating until the text matches a valid 6-digit hex pattern again, rather than showing an error message.' },
    { q: 'Which formats does it support?', a: 'HEX, RGB, and HSL, each shown with its own copy button so you can grab whichever format your CSS or design tool needs.' },
  ],
  'color-harmony-generator': [
    { q: 'What harmony schemes can I generate?', a: 'Complementary, triadic, analogous, split complementary, and square, each calculated as real hue-angle offsets from your chosen base hue, with three saturation and lightness variants shown per hue.' },
    { q: 'How is this different from the Color Palette Generator?', a: 'This tool starts from a hue angle alone (0 to 360 degrees) and generates three preset lightness and saturation variants per hue. The Color Palette Generator instead starts from an exact hex color and preserves that color\'s own saturation and lightness across its scheme.' },
    { q: 'Can I copy every generated color at once?', a: 'Yes, the Copy All button copies every swatch in the current scheme to your clipboard as a newline-separated list of hex values.' },
  ],
  'color-luminance-calculator': [
    { q: 'What does this show beyond the luminance number?', a: 'A contrast-ratio helper comparing your color against pure white and pure black backgrounds, flagged red if it falls below the 4.5:1 AA threshold, plus a lightness scale and the exact WCAG luminance formula used for the calculation.' },
    { q: 'How is perceived brightness determined?', a: 'Your color\'s real relative luminance value is compared against fixed thresholds, above 0.5 is labeled Light, above 0.25 is Medium, and anything lower is Dark.' },
    { q: 'Does it show its math, or just the result?', a: 'It displays the actual WCAG relative luminance formula (0.2126R + 0.7152G + 0.0722B on linearized sRGB values) directly on the page alongside your color\'s computed result.' },
  ],
  'color-luminance-checker': [
    { q: 'How is this different from the Color Luminance Calculator?', a: 'The Calculator focuses on one color at a time with a detailed contrast-ratio and lightness-scale breakdown. This tool instead lets you build a list of named colors and compare their luminance side by side.' },
    { q: 'How does it decide whether to recommend light or dark text?', a: 'It uses the real WCAG-based 17.9% relative luminance cutoff, colors above that threshold get a light-background recommendation of dark text, and vice versa.' },
    { q: 'Can I label the colors I add?', a: 'Yes, an optional name field lets you label each color (like "Brand Blue"), otherwise the hex code itself is shown as the label.' },
  ],
  'color-mixer': [
    { q: 'What blend modes are available?', a: 'Additive (light-mixing, like combining RGB light beams), Subtractive (pigment-style mixing using the CMY model), and Average (a weighted mean of the RGB values), each using genuinely different math rather than the same formula relabeled.' },
    { q: 'Can I weight colors differently in the mix?', a: 'Yes, each color has its own weight slider from 0.1 to 10, and the final blend is calculated using those weights rather than a simple unweighted average.' },
    { q: 'Is there a way to see the mix proportions visually?', a: 'Yes, a preview strip sizes each color\'s segment according to its weight, shown right above a swatch of the final mixed result.' },
  ],
  'color-name-finder': [
    { q: 'How does it pick the closest color name?', a: 'It calculates the real Euclidean distance between your color\'s RGB values and roughly 80 built-in named colors, then returns whichever name has the smallest distance, along with that numeric distance.' },
    { q: 'Will it only match exact named colors?', a: 'No, since arbitrary hex values rarely land exactly on a named color, it shows the closest match along with how far off it is, so you know whether the match is a near-exact fit or a loose approximation.' },
    { q: 'What are the "variations" it shows?', a: 'Lighten and darken adjust the color\'s HSL lightness by 20%, and saturate and desaturate adjust its HSL saturation by 20%, all computed as real HSL transformations of your original color.' },
  ],
  'color-opacity-generator': [
    { q: 'What is the "flattened on white" swatch showing?', a: 'The real result of alpha-compositing your color at the chosen opacity over a solid white backdrop, useful for seeing how a semi-transparent color will actually look once it is layered on a light page rather than viewed on a checkerboard.' },
    { q: 'What formats does it output?', a: 'An RGBA string, an 8-digit hex value with the alpha channel appended, and the flattened solid hex equivalent for when transparency isn\'t supported.' },
    { q: 'How is the transparency preview shown?', a: 'A checkerboard background pattern, the same convention used by design tools, sits behind your semi-transparent color swatch so you can see through it.' },
  ],
  'color-palette-extractor': [
    { q: 'How does it pick the palette colors from an image?', a: 'It reads every pixel of the loaded image using canvas, groups visually similar colors by rounding each RGB channel to the nearest multiple of 8, and returns the 12 most frequent groups.' },
    { q: 'Why does it fail on some image URLs?', a: 'Cross-origin images without permissive CORS headers block canvas pixel reading entirely, this is a browser security restriction rather than a bug specific to this tool.' },
    { q: 'How is this different from Color Palette From Image?', a: 'Both use the same real pixel-sampling approach, but this tool groups colors more finely (nearest 8) and returns 12 swatches instead of 10.' },
  ],
  'color-palette-from-image': [
    { q: 'How does it build the palette?', a: 'The same real pixel-sampling technique as the Color Palette Extractor, it groups colors by rounding each channel to the nearest multiple of 16 and returns the 10 most common groups.' },
    { q: 'How is this different from the Color Palette Extractor?', a: 'This version groups colors a bit more coarsely (nearest 16 versus nearest 8) and returns 10 swatches instead of 12, the underlying extraction method is otherwise identical.' },
    { q: 'Does it work with any image URL?', a: 'Only ones the browser can read pixel data from without a CORS violation, images hosted on origins that don\'t allow cross-origin reads will fail to extract.' },
  ],
  'color-palette-generator': [
    { q: 'What harmony types can I generate?', a: 'Complementary, analogous, triadic, tetradic, split complementary, and monochromatic, each computed from real HSL hue-angle math applied to your exact base color, preserving its own saturation and lightness.' },
    { q: 'How can I export the palette?', a: 'Either as a comma-separated list of hex values, or as ready-to-paste CSS custom properties formatted as a :root block.' },
    { q: 'How is this different from the Color Harmony Generator?', a: 'This tool uses your exact chosen color\'s saturation and lightness and adds CSS variable export plus a live UI preview. The Color Harmony Generator instead starts from a hue slider alone and applies fixed lightness and saturation variants.' },
  ],
  'color-picker-v2': [
    { q: 'Does it show more than the hex value?', a: 'Yes, HEX, RGB, and HSL are all shown at once and each can be copied independently with its own button.' },
    { q: 'Is the picker a custom color wheel?', a: 'No, it uses your browser\'s native color input control, styled full width, whatever picker interface your browser provides (often including a hue wheel) is what appears when you click it.' },
  ],
  'color-picker-wheel': [
    { q: 'Is this a draggable custom color wheel?', a: 'No, it uses your browser\'s native color input, styled with rounded corners, clicking it opens whatever color picker UI your browser provides rather than a custom in-page wheel.' },
    { q: 'How is this different from Color Picker V2?', a: 'This version shows HEX and RGB only and displays the swatch as a circle. Color Picker V2 additionally shows the HSL breakdown and uses a rectangular swatch.' },
  ],
  'color-saturation-adjuster': [
    { q: 'What range does the saturation slider cover?', a: '0 to 200%, multiplying your color\'s original HSL saturation value, the result is capped so it never exceeds 100% saturation even at the higher end of the slider.' },
    { q: 'Does adjusting saturation change the hue or lightness?', a: 'No, only the saturation channel is modified, the hue and lightness from your original color are preserved exactly.' },
  ],
  'color-shade-gen': [
    { q: 'What counts as a "shade" in this tool?', a: 'Your color\'s RGB channels scaled straight down toward black in five steps (100%, 75%, 50%, 25%, and 0% of the original values), rather than adjusting the HSL lightness channel.' },
    { q: 'Is this the same as reducing lightness in HSL?', a: 'Close, but not identical. Scaling RGB values directly toward black can shift a color slightly differently than converting to HSL and lowering the L channel would.' },
  ],
  'color-shade-tints': [
    { q: 'Does this generate both shades and tints?', a: 'Despite the name, it currently only produces five lighter tints blended toward white, it does not include darker shade variants. For shades toward black, use the Color Shade Generator tool instead.' },
    { q: 'How are the tints calculated?', a: 'Each tint blends your original RGB color with white in five steps, at 100%, 80%, 60%, 40%, and 20% of the original color\'s strength.' },
  ],
  'color-temperature-adjuster': [
    { q: 'What Kelvin range does it cover?', a: '1000K to 20000K, using a real color-temperature-to-RGB approximation formula, the same style of blackbody radiation curve approximation used in photography and lighting reference tools.' },
    { q: 'What are the preset temperatures for?', a: 'Ten named real-world references, from 1000K candlelight up to 9000K heavy overcast, each mapped to its actual approximate RGB color so you can jump straight to a familiar lighting condition.' },
    { q: 'Does it explain when to use each temperature?', a: 'Yes, a common use-cases section lists practical suggestions, like 2700K for bedrooms and living rooms, 4000K for kitchens and offices, and 6500K for daylight simulation and photography.' },
  ],
  'color-tint-generator': [
    { q: 'How does this differ from Color Shade & Tints?', a: 'The tint math is the same five-step white blend used there, this tool is focused purely on producing tints, so if lighter variants are all you need this is the more directly-named option.' },
    { q: 'What is the exact tint formula?', a: 'Each step blends your RGB color toward white at 100%, 80%, 60%, 40%, and 20% of its original intensity.' },
  ],
  'color-tone-generator': [
    { q: 'What counts as a "tone" here specifically?', a: 'Your color blended with its own gray equivalent (calculated using the standard luminance-weighted gray formula) across six steps, from full color down to mostly gray. This is different from a tint, which blends with white, or a shade, which blends with black.' },
    { q: 'How is the gray value calculated?', a: 'Using the real luma formula, 0.299 times red plus 0.587 times green plus 0.114 times blue, the standard perceptual grayscale weighting, rather than a simple average of the three channels.' },
  ],
  'combine-images': [
    { q: 'What layouts are available for combining images?', a: 'Three: horizontal (side by side), vertical (stacked), and grid (automatically arranged into rows and columns based on the number of images you upload).' },
    { q: 'Can I control the spacing between images?', a: 'Yes, a slider from 0 to 50 pixels sets the gap drawn between each image in the combined canvas.' },
    { q: 'Is there a minimum number of images required?', a: 'Yes, you need at least two images loaded before the Combine button becomes active, since combining a single image would have nothing to merge it with.' },
  ],
  'contrast-checker': [
    { q: 'How is this different from the Color Contrast Ratio Checker?', a: 'They use the same WCAG relative-luminance formula and check a single foreground and background pair, this tool additionally renders a live sample-text preview against your chosen colors so you can see the actual contrast, not just the ratio number.' },
    { q: 'What do the AA and AAA levels mean?', a: 'They are the WCAG contrast thresholds, AAA requires a ratio of at least 7:1 for normal text, AA requires at least 4.5:1, and a separate AA Large tier accepts 3:1 for text 18pt or larger.' },
    { q: 'What happens if my colors fail every level?', a: 'The tool shows a "Fail" result when the ratio falls below 3:1, telling you the pairing is not accessible at any WCAG text size.' },
  ],
  'cooking-unit-converter': [
    { q: 'Which cooking units can I convert between?', a: 'Cups, tablespoons, teaspoons, milliliters, liters, fluid ounces, pounds, and grams, entering a value in any one of them instantly shows the equivalent in all the others.' },
    { q: 'Are the weight conversions ingredient-specific?', a: 'No, the gram and pound figures use standard volume-to-weight factors rather than a specific ingredient\'s density, so they are closest to accurate for water-like liquids and are an approximation for dense or airy ingredients like flour or sugar.' },
  ],
  'cors-header-generator': [
    { q: 'Which server frameworks can this generate config for?', a: 'Beyond raw HTTP headers, it outputs ready-to-paste CORS code for Nginx, Apache, Express.js, Next.js, Django, and Flask, matching each framework\'s actual header-setting syntax.' },
    { q: 'What do the preset scenarios configure?', a: 'Nine starting points, including Public API (fully open), With Credentials, Restricted origins, Dynamic Origin, and framework-specific presets for WordPress, Next.js, Express, Django, and Flask, each pre-filling realistic allowed methods, headers, and origins for that case.' },
    { q: 'Does this tool test my server\'s actual CORS behavior?', a: 'No, it only generates the header configuration for you to add to your own server, it does not send requests to check what your server currently returns.' },
  ],
  'countdown-timer': [
    { q: 'How precise is the countdown while running?', a: 'It ticks down once per second using a real interval timer, with hours, minutes, and seconds set independently before starting.' },
    { q: 'Can I pause and resume the countdown?', a: 'Yes, the Start button becomes Pause once running, stopping the interval without losing the remaining time, pressing it again resumes from where it left off.' },
    { q: 'What does Reset do versus Pause?', a: 'Pause just halts the ticking clock, Reset clears the remaining time entirely so the duration inputs become editable again.' },
  ],
  'zip': [
    { q: 'Does this actually compress the files?', a: 'No, files are stored uncompressed inside a valid ZIP structure (ZIP "store" mode), so the download opens in any ZIP-aware program, it just does not shrink the total size.' },
    { q: 'Where does the ZIP file get built?', a: 'Entirely in your browser, using a hand-written ZIP writer that assembles the local file headers, central directory, and CRC32 checksums, nothing is uploaded to a server.' },
    { q: 'What is the output archive named?', a: 'If you added a single file, the archive is named after that file with a .zip extension, if you added multiple files, it is named archive.zip.' },
  ],
  'credit-card-validator': [
    { q: 'Which card networks can it identify?', a: 'Visa, Mastercard, American Express, Discover, and JCB, each matched against that network\'s real number pattern, like Visa always starting with a 4.' },
    { q: 'What exactly does the Luhn check confirm?', a: 'That the digits pass the standard Luhn checksum algorithm used by all major card networks, this confirms the number is structurally valid, not that the card is active, unexpired, or has available credit.' },
    { q: 'Why does it say the card type could not be determined?', a: 'That appears when 6 or more digits are entered but they do not match any of the five known network patterns, meaning it is likely a network this tool does not recognize.' },
  ],
  'cron-generator': [
    { q: 'What does "point-and-click" mean for this builder?', a: 'Five dropdown selects, one each for minute, hour, day, month, and weekday, pre-populated with common values like every-N steps and weekday ranges, so you never type raw cron syntax.' },
    { q: 'Does it show a plain-English sentence describing the schedule?', a: 'No, this builder displays only the raw cron expression and the next five run times, not a sentence like "every weekday at 9 AM." For that, use the Cron Schedule Explainer tool.' },
    { q: 'How many upcoming run times does it calculate?', a: 'Five, found by scanning forward minute by minute from right now using whatever your five dropdowns currently specify.' },
  ],
  'cron-generator-dg': [
    { q: 'How does the weekday dropdown handle ranges?', a: 'Alongside the seven individual days and an Every wildcard, it includes two ready-made ranges, 1-5 for weekdays and 0,6 for weekends, so common patterns do not need comma-separated digits.' },
    { q: 'Can I jump straight to a common schedule?', a: 'Yes, eleven preset buttons below the dropdowns, including Every 5 min, Daily midnight, and Monthly 1st, instantly fill in all five fields at once.' },
    { q: 'Does the schedule update as I change a dropdown?', a: 'Yes, the cron expression and the next five run times both recompute immediately on every change, there is no separate generate or apply button.' },
  ],
  'cron-human-readable': [
    { q: 'Where is the human-readable text this tool is named for?', a: 'This particular builder only displays the raw five-field cron expression and a list of upcoming run times, not a plain-English sentence. For a sentence like "runs every weekday at 9 AM," use the Cron Schedule Explainer tool instead.' },
    { q: 'How do I actually build a schedule here?', a: 'Pick values from five dropdowns (minute, hour, day, month, weekday), or click one of eleven presets to fill all five at once.' },
    { q: 'What counts as "now" for the next-run calculation?', a: 'The moment you load the page or change a field, the calculation starts scanning forward from the next full minute to find the next five matching times.' },
  ],
  'cron-schedule-validator': [
    { q: 'How many upcoming run times are shown?', a: 'Five, calculated by scanning forward minute by minute from right now until five matches are found.' },
    { q: 'What happens if I paste an invalid expression?', a: 'An inline error names the exact problem, like "Invalid minute field (expected 0-59)" or the wrong number of fields, instead of a generic failure message.' },
    { q: 'Does it accept shorthand like @daily or @hourly?', a: 'Yes, seven named shortcuts are recognized (@yearly, @annually, @monthly, @weekly, @daily, @midnight, @hourly) and expanded to their five-field equivalent automatically.' },
  ],
  'cron-schedule-explainer': [
    { q: 'What does the plain-English summary cover?', a: 'The time of day, which weekdays or weekend it runs on, and the month if restricted, for example "At 9:00 AM on weekdays."' },
    { q: 'Can I type a cron expression directly instead of clicking a preset?', a: 'Yes, the text field accepts any standard 5-field expression or an @daily-style shortcut, typed or pasted, then press Parse or hit Enter.' },
    { q: 'How does it handle fields left as a wildcard?', a: 'Unrestricted fields (set to *) are simply left out of the plain-English sentence, so "At 9:00 AM on weekdays" means the day-of-month and month fields are both wildcards.' },
  ],
  'cron-schedule-generator': [
    { q: 'Is this a per-field dropdown builder like the Cron Generator?', a: 'No, despite "point-and-click editor" in the name, this version works by typing or pasting a full cron expression into one field, or clicking one of eight preset buttons, there are no individual minute or hour dropdowns.' },
    { q: 'What is shown alongside the parsed schedule?', a: 'A plain-English summary sentence, a breakdown of each of the five fields, and the next five calculated run times.' },
    { q: 'Does it validate before showing the preview?', a: 'Yes, an expression that does not have exactly five fields, or has an out-of-range value, shows a specific inline error instead of a schedule preview.' },
  ],
  'cron-validator': [
    { q: 'How does this differ from Cron Schedule Validator?', a: 'This one shows ten upcoming run times instead of five, and the relative "in X min/hr/day" labels update live once a second rather than being calculated a single time.' },
    { q: 'What happens when I type an invalid expression?', a: 'A Valid or Invalid badge next to the input flips to Invalid immediately, and the specific parsing error appears below the field.' },
    { q: 'Does it recognize @daily and @weekly-style shorthand?', a: 'Yes, the same seven named shortcuts (@yearly, @annually, @monthly, @weekly, @daily, @midnight, @hourly) expand automatically to their five-field equivalents.' },
  ],
  'crop': [
    { q: 'How do I select the crop area?', a: 'Click and drag directly on the uploaded image preview, a blue selection box follows your drag and shows exactly what will be kept.' },
    { q: 'Does cropping reduce the image quality?', a: 'No, the selected region is copied pixel-for-pixel onto a same-size canvas and exported as PNG, without any recompression of the retained pixels.' },
    { q: 'Can I resize a selection after drawing it?', a: 'Not by dragging its edges, releasing the mouse locks in that selection, draw a new one on the image if you want to change the crop area.' },
  ],
  'css-border-radius-generator': [
    { q: 'Can each corner have a different radius?', a: 'Yes, toggling to Unlinked lets you drag each of the four corner sliders independently, Linked mode moves all four together from one slider.' },
    { q: 'What do the four presets set up?', a: 'Subtle (4px on all corners), Rounded (16px), Pill (100px), and Circle (50% using percentage units instead of pixels).' },
    { q: 'Does the copied CSS include the border itself?', a: 'Yes, the output includes both the border-radius value and a border declaration using your chosen width and color, not just the radius alone.' },
  ],
  'css-class-generator': [
    { q: 'What CSS properties can I add to a class?', a: 'Any of 27 common properties, covering layout (display, flex-direction, gap), spacing (padding, margin), and visual styling (background-color, border-radius, box-shadow).' },
    { q: 'How are the generated class names built?', a: 'Each one combines your chosen prefix with the CSS property name, so a gap property with prefix "util" becomes .util-gap.' },
    { q: 'Does it show how to use the generated classes?', a: 'Yes, alongside the CSS rules it prints a matching HTML snippet with a div for each class, so you can see the class applied directly.' },
  ],
  'css-flexbox-generator': [
    { q: 'What flex properties can I adjust?', a: 'Direction (row, row-reverse, column, column-reverse), justify-content, align-items, flex-wrap, and gap, each reflected instantly in the live preview.' },
    { q: 'Can I change how many items appear in the preview?', a: 'Yes, an Item Count slider from 2 to 8 lets you see how your flex settings behave with different numbers of children.' },
    { q: 'What does the copied CSS contain?', a: 'A .container rule with display: flex plus your chosen flex-direction, justify-content, align-items, flex-wrap, and gap in pixels.' },
  ],
  'css-gradient-generator': [
    { q: 'What gradient types are supported?', a: 'Linear, radial, and conic, switchable with a tab control at the top. Angle control only appears for linear and conic since radial gradients don\'t use an angle.' },
    { q: 'Can I use more than two colors?', a: 'Yes, click Add Stop to insert additional color stops anywhere along the gradient and drag each stop\'s position slider to reposition it (a minimum of two stops is required).' },
    { q: 'Are there ready-made gradients to start from?', a: 'Yes, 14 presets like Sunset, Ocean, Instagram, and Rainbow load a matching type, angle, and full set of color stops that you can then customize further.' },
  ],
  'css-grid-generator': [
    { q: 'What grid layouts can I build?', a: 'Type a column count or a raw grid-template-columns value like repeat(auto-fill, minmax(250px, 1fr)) or 200px 1fr 200px, the same for rows, and the preview updates immediately.' },
    { q: 'Are there starting layouts?', a: 'Yes, six presets (2 Column, 3 Column, Sidebar, Holy Grail, Card Grid, Dashboard) fill in matching column, row, and gap values you can adjust from there.' },
    { q: 'Does it generate matching HTML?', a: 'Yes, alongside the CSS it outputs a .grid-container div with one placeholder .grid-item child per cell, so you can paste both blocks together.' },
  ],
  'css-minifier': [
    { q: 'What does minifying actually remove?', a: 'Comments, unnecessary whitespace and line breaks, and it shortens repeated-pair 6-digit hex colors like #ffffff to their 3-digit form (#fff).' },
    { q: 'Can I see how much smaller the file gets?', a: 'Yes, the tool shows the original and minified byte counts along with the percentage saved.' },
    { q: 'Does it check my CSS for errors first?', a: 'No, it only compresses whatever you paste in without validating it, use the separate CSS Validator tool for syntax checking.' },
  ],
  'css-to-styled-components': [
    { q: 'How does it name the generated components?', a: 'It converts each selector into PascalCase, so .primary-button becomes const PrimaryButton = styled.div, stripping dashes and underscores and capitalizing each word.' },
    { q: 'Does it pick the right HTML tag for the styled wrapper?', a: 'For element selectors like nav or button it uses styled.nav or styled.button. For class or ID selectors it defaults to styled.div since an element can\'t be inferred from a class name alone.' },
    { q: 'Can I convert multiple CSS rules at once?', a: 'Yes, paste any number of rule blocks and each one becomes its own separate styled-components const declaration in the output.' },
  ],
  'css-to-tailwind': [
    { q: 'Which CSS properties get converted to Tailwind classes?', a: 'A wide set including display, flex-direction, justify-content, align-items, position, text-align, font-weight, font-size, width, height, gap, padding, margin, border-radius, colors, cursor, and overflow.' },
    { q: 'What happens with values that don\'t match a standard Tailwind scale?', a: 'The tool falls back to Tailwind\'s arbitrary value syntax, like w-[350px] or bg-[#112233], so nothing gets dropped even when it isn\'t one of Tailwind\'s default tokens.' },
    { q: 'Does it convert pixel values to Tailwind\'s spacing scale automatically?', a: 'Yes, for padding, margin, gap, width, and height it divides pixel values by 4 to match Tailwind\'s spacing units, so 16px becomes p-4 rather than an arbitrary value.' },
  ],
  'css-validator': [
    { q: 'What kinds of CSS errors does it catch?', a: 'Missing colons in declarations, incomplete hex colors, empty rule sets, properties with no value, incomplete calc() expressions, and var() calls missing a variable name.' },
    { q: 'Does it check brace and bracket matching?', a: 'Yes, it tracks braces, parentheses, and brackets separately and flags unbalanced counts as errors, noting whether a closing character is missing or extra.' },
    { q: 'Does it flag errors by line number?', a: 'Yes, most issues show the exact line number where the problem was found so you can jump straight to it in your stylesheet.' },
  ],
  'csv-generator': [
    { q: 'Does it auto-generate rows based on a number I enter?', a: 'No, rows and columns are added and edited manually with the + Row and + Column buttons and inline text inputs, there\'s no numeric row-count field that bulk-fills sample data.' },
    { q: 'How does it handle values containing commas or quotes?', a: 'Any cell containing a comma, quote, or line break is automatically wrapped in double quotes with internal quotes escaped, so the exported CSV stays valid.' },
    { q: 'Can I download the result directly?', a: 'Yes, a Download button saves the current table as generated.csv, alongside a Copy button for the raw text.' },
  ],
  'csv-to-excel': [
    { q: 'What file format does the download actually use?', a: 'It downloads a .xls file, an HTML table wrapped in Excel\'s legacy SpreadsheetML markup, which Excel, Numbers, and Google Sheets all open correctly, rather than a true .xlsx file.' },
    { q: 'Does it handle quoted fields with embedded commas?', a: 'Yes, the CSV parser tracks quote state character by character, so commas or line breaks inside quoted fields don\'t break the columns.' },
    { q: 'Can I preview the data before downloading?', a: 'Yes, a table renders your parsed rows with the first row as headers, so you can check the columns lined up correctly before downloading.' },
  ],
  'csv-to-json': [
    { q: 'Does it infer data types automatically?', a: 'Yes, any value that parses as a number is output as a JSON number rather than a string, for example 30 becomes 30 not "30".' },
    { q: 'Can it handle CSV fields that contain commas inside quotes?', a: 'No, columns are split on plain commas, so a quoted field containing a comma will be split incorrectly. It works best with simple comma-separated values.' },
    { q: 'How are column headers detected?', a: 'The first line of input is split into headers automatically, quotes around header names are stripped, and each later line is mapped to those header keys to build the JSON objects.' },
  ],
  'csv-to-tsv': [
    { q: 'How does it decide which cells need quotes?', a: 'A cell gets wrapped in double quotes if it contains a tab character, a comma, or leading or trailing spaces, since those would otherwise break the tab-separated format.' },
    { q: 'Does it handle CSV fields that already contain commas inside quotes?', a: 'No, splitting is done on plain commas, so a source field with a quoted embedded comma will be divided into extra columns. It works best with simple comma-separated values.' },
    { q: 'Do I need to click a button to convert, or does it update live?', a: 'You click Convert to TSV, the output doesn\'t update automatically as you type in the CSV box.' },
  ],
  'csv-to-xml': [
    { q: 'How are column names turned into XML tags?', a: 'Header names are sanitized into valid XML tag names, non-alphanumeric characters become underscores, and a leading underscore is added if the name would otherwise start with a digit.' },
    { q: 'Does it handle CSV fields with embedded commas or quotes?', a: 'Yes, the CSV parser tracks quote state character by character, so quoted fields containing commas or line breaks are parsed correctly.' },
    { q: 'What is the structure of the generated XML?', a: 'Each data row becomes a <row> element containing one child element per column, all wrapped in a root <rows> element with an XML declaration at the top.' },
  ],
  'curl-command-builder': [
    { q: 'What request options can I configure?', a: 'HTTP method, one or more headers, a request body (hidden automatically for GET and HEAD), basic auth credentials, and flags for following redirects, insecure mode, verbose output, and compression.' },
    { q: 'Can I get single-line output instead of the multi-line format?', a: 'Yes, toggle off "Multi-line output" to get the entire command as one line instead of a backslash-continued block.' },
    { q: 'Does it handle special characters in headers or body safely?', a: 'Yes, every value is wrapped in single quotes with proper shell escaping, so headers or JSON bodies containing quotes or spaces still produce a valid command.' },
  ],
  'curl-gen-express': [
    { q: 'What input format does it expect?', a: 'A raw HTTP request: a request line like POST /path HTTP/1.1, followed by header lines, a blank line, and then the body, the format you\'d see in a captured network request.' },
    { q: 'How does it figure out the full URL?', a: 'It reads the Host header to combine with the request path, or uses the path directly if it is already a full http or https URL.' },
    { q: 'Does it preserve the request body?', a: 'Yes, everything after the blank line is passed through as the -d payload, unless the method is GET or HEAD.' },
  ],
  'curl-to-javascript': [
    { q: 'What does the generated code look like?', a: 'A fetch() call with method, headers object, and body, followed by .then() handlers that parse the JSON response and log it, plus a .catch() for errors.' },
    { q: 'Does it detect JSON request bodies?', a: 'Yes, if the -d payload parses as valid JSON it is wrapped in JSON.stringify(...), otherwise it is passed through as a plain string.' },
    { q: 'Does it also generate Axios code?', a: 'No, only fetch() output is generated currently, regardless of which library you prefer.' },
  ],
  'curl-to-python': [
    { q: 'What does the generated code include?', a: 'An import requests line, a url string, an optional headers dict built from every -H flag, and a response = requests.METHOD(...) call that prints the status code and response text.' },
    { q: 'Does it separate URL query parameters into their own params dict?', a: 'No, query strings stay part of the url value, there is no separate params dictionary generated.' },
    { q: 'How does it detect the request body?', a: 'It looks for a -d flag and assigns whatever follows to a data variable, passed to the requests call as data=data.' },
  ],
  'cutter': [
    { q: 'What output format does the trimmed clip use?', a: 'WebM (VP9 or VP8), since the cut is produced by recording the video\'s playback with the browser\'s MediaRecorder API, regardless of the original file\'s format.' },
    { q: 'How long does cutting take?', a: 'About as long as the clip itself, the tool plays the selected range in real time while capturing it rather than processing the file instantly.' },
    { q: 'What if my browser does not support in-browser cutting?', a: 'You will see a fallback FFmpeg command (ffmpeg -ss START -to END -i input.mp4 -c copy output.mp4) to run locally instead, which cuts losslessly without re-encoding.' },
  ],
  'data-size-converter': [
    { q: 'Does it use binary (1024) or decimal (1000) unit sizes?', a: 'Binary only, every unit step multiplies by 1024 (1 KB = 1024 bytes). There is no toggle for decimal, 1000-based units.' },
    { q: 'What units can I convert between?', a: 'Bytes, KB, MB, GB, TB, and PB, entering a value in any one of them shows the equivalent in all six at once.' },
    { q: 'Does it round very large or small results?', a: 'Results are shown with up to 6 decimal places, and values that would round to an unreadable near-zero number are hidden from the results list.' },
  ],
  'data-uri-generator': [
    { q: 'What MIME types can I choose for text input?', a: 'text/plain, text/html, text/css, application/javascript, application/json, and image/svg+xml.' },
    { q: 'Does uploading a file send it anywhere?', a: 'No, files are read and base64-encoded entirely in the browser using the FileReader API, nothing is uploaded to a server.' },
    { q: 'Can I preview an image before copying its data URI?', a: 'Yes, if the uploaded file is an image type, a thumbnail preview renders using the generated data URI directly.' },
  ],
  'db-query-formatter': [
    { q: 'Which SQL keywords get their own line?', a: 'Major clauses like SELECT, FROM, WHERE, the JOIN variants, GROUP BY, ORDER BY, HAVING, LIMIT, and more each start a new line, with AND/OR conditions indented beneath them.' },
    { q: 'Does it validate that my SQL is correct?', a: 'No, it only reformats and highlights keywords in whatever text you provide, it does not parse or check the query\'s SQL syntax.' },
    { q: 'What SQL dialect does the keyword list target?', a: 'A general ANSI-style vocabulary covering SELECT, INSERT, UPDATE, DELETE, and common clauses, not a database-specific dialect like PL/pgSQL or T-SQL extensions.' },
  ],
  'decimal-to-binary': [
    { q: 'What number bases does it convert to?', a: 'Binary, hexadecimal, and octal, all three shown at once with their conventional 0b, 0x, and 0o prefixes.' },
    { q: 'Is hexadecimal output uppercase or lowercase?', a: 'Uppercase letters, A through F.' },
    { q: 'Can I copy just one of the results?', a: 'Yes, each of the three result cards has its own Copy button.' },
  ],
  'decimal-to-hex-converter': [
    { q: 'Can I add a 0x prefix to the hex output?', a: 'Yes, a "0x prefix" checkbox adds it to the hex, binary (0b), and octal (0o) results together.' },
    { q: 'What does "Pad zeros" do?', a: 'It pads the hexadecimal result to an even number of digits with leading zeros, useful when you need consistent byte-pair formatting.' },
    { q: 'Does it convert to octal too?', a: 'Yes, alongside hexadecimal and binary, an octal result is shown even though it is not mentioned in the tool\'s name.' },
  ],
  'delete-pages': [
    { q: 'How do I choose which pages to remove?', a: 'Click any page thumbnail to mark it for deletion, or use Select All / Deselect All to toggle every page at once.' },
    { q: 'Can I delete every page in the document?', a: 'No, the tool blocks deleting all pages since that would leave an empty PDF, at least one page must remain.' },
    { q: 'Does it re-render or compress the remaining pages?', a: 'No, remaining pages are copied directly into a new PDF document with pdf-lib, preserving their original content exactly.' },
  ],
  'discount-calculator': [
    { q: 'Can it factor in sales tax as well as the discount?', a: 'Yes, an optional Sales Tax field applies tax to the price after the discount, so the Final Price reflects both adjustments.' },
    { q: 'What exactly counts as "Total Savings"?', a: 'Just the discount amount taken off the original price, tax is shown separately since it is an addition rather than a saving.' },
    { q: 'Does it accept discounts entered as a decimal like 0.25 instead of 25?', a: 'No, the Discount Percentage field expects a whole percent value like 25, not a decimal fraction.' },
  ],
  'dns-lookup-v2': [
    { q: 'Where do the DNS results come from?', a: 'Live queries to Google\'s public DNS-over-HTTPS resolver (dns.google), not cached or simulated data.' },
    { q: 'Can I look up multiple record types in one click?', a: 'Yes, toggle any combination of A, AAAA, MX, TXT, and CNAME and Lookup All queries them simultaneously.' },
    { q: 'What happens if a record type does not exist for the domain?', a: 'That type\'s card shows "No records found" rather than an error, while a genuine lookup failure shows "Lookup failed" instead.' },
  ],
  'dns-lookup-tool': [
    { q: 'Can I look up multiple domains at once?', a: 'Yes, paste one domain per line and Look Up queries all of them in parallel for whichever record type you choose.' },
    { q: 'Where does this pull DNS data from?', a: 'Google\'s public DNS-over-HTTPS resolver (dns.google), a live query rather than cached results.' },
    { q: 'What record types are supported?', a: 'A, AAAA, MX, CNAME, TXT, and NS, one type per lookup, switchable with the tab control above the domain list.' },
  ],
  'docker-command-generator': [
    { q: 'What docker commands can it build?', a: 'docker run, build, exec, ps, images, pull, push, logs, stop, rm, and rmi, each with its own relevant input fields.' },
    { q: 'What options does docker run support?', a: 'Detached mode, auto-remove, interactive TTY, container name, port mapping, environment variables, volumes, and network selection (bridge, host, none, or a custom network name).' },
    { q: 'Does it validate the values I enter?', a: 'No, it inserts whatever you type directly into the command string without checking image names, ports, or paths for validity.' },
  ],
  'docker-compose-generator': [
    { q: 'What stack templates are available?', a: 'Node.js + PostgreSQL, Node.js + MySQL, Node.js + Redis, WordPress + MySQL, and a static Nginx site, each producing a complete docker-compose.yml.' },
    { q: 'Does it set up persistent storage for the database?', a: 'Yes, the database and WordPress templates include a named volume so data survives container restarts.' },
    { q: 'Can I customize the ports and credentials?', a: 'Yes, host port, container port, database name, user, and password fields all feed directly into the generated YAML.' },
  ],
  'domain-age-checker': [
    { q: 'Where does the registration data come from?', a: 'A live RDAP query to rdap.org, not cached WHOIS data.' },
    { q: 'What happens if a domain has no public registration record?', a: 'It shows a message that no record was found, which can mean the domain is unregistered or uses a registry without public RDAP data.' },
    { q: 'What information does it show beyond the age?', a: 'Expiry status with days or years remaining, the registration and expiry dates, and the domain\'s nameservers.' },
  ],
  'dominant-color-extractor': [
    { q: 'How does it determine the dominant colors?', a: 'It draws the image to a canvas, groups pixels into color buckets, and returns the six buckets with the most pixels along with each one\'s percentage of the image.' },
    { q: 'Does it count transparent pixels?', a: 'No, pixels with less than roughly 50% opacity are excluded from the analysis.' },
    { q: 'Is the image uploaded anywhere?', a: 'No, the canvas drawing and color analysis happen entirely in your browser.' },
  ],
  'dpi-ppi-calculator': [
    { q: 'What two things can it calculate?', a: 'Print DPI from an image\'s pixel dimensions and physical print size, or screen PPI from a display\'s resolution and diagonal size, switchable with a mode toggle.' },
    { q: 'Does it show print sizes at different quality levels?', a: 'Yes, in Print Size mode it lists the maximum print dimensions at Draft (150 DPI), Good (200 DPI), Photo Quality (300 DPI), and Fine Art (600 DPI).' },
    { q: 'Can I enter print dimensions in centimeters instead of inches?', a: 'Yes, a unit toggle switches the print width and height fields between inches and centimeters.' },
  ],
  'dummy-text-detector': [
    { q: 'What kinds of placeholder text does it catch?', a: 'Classic Lorem Ipsum phrases, bracket and mustache placeholders, TODO/FIXME markers, and common filler phrases like "your text here" or "coming soon."' },
    { q: 'How does it split the document into checkable chunks?', a: 'By blank lines, treating each paragraph separately so only the specific paragraphs containing placeholder patterns get flagged.' },
    { q: 'Can I get a version with the placeholder text removed?', a: 'Yes, a Cleaned Text section shows the document with every flagged paragraph stripped out, ready to copy.' },
  ],
  'duplicate-line-finder': [
    { q: 'Does it show which lines are duplicated?', a: 'Yes, each result lists the first line number a piece of text appeared on plus every other line number it repeats at.' },
    { q: 'Can I control whether matching is case sensitive?', a: 'Yes, a Case sensitive checkbox decides whether "Hello" and "hello" count as the same line.' },
    { q: 'Do blank lines get flagged as duplicates?', a: 'No, empty lines are skipped entirely and never counted toward duplicate groups.' },
  ],
  'duplicate-phrase-detector': [
    { q: 'How long a phrase does it look for?', a: 'Repeated runs of 3 to 8 words, checking longer phrases first so a repeated 8-word run isn\'t also reported as a redundant 3-word subset of itself.' },
    { q: 'How many times must a phrase repeat to get flagged?', a: 'At least twice anywhere in the text.' },
    { q: 'Does punctuation affect the matching?', a: 'No, text is lowercased and stripped of punctuation before comparison, so phrases are matched on their words alone.' },
  ],
  'duplicate-url-detector': [
    { q: 'What counts as the "same" URL despite different text?', a: 'A canonical form built by lowercasing the host, dropping a leading www., trimming trailing slashes, and removing known tracking parameters like utm_source, gclid, and fbclid.' },
    { q: 'What happens to lines that aren\'t valid URLs?', a: 'They\'re listed separately as unparseable rather than silently dropped or grouped in with the duplicates.' },
    { q: 'Can I get a cleaned, deduplicated list?', a: 'Yes, a Deduplicated URL List section outputs one canonical URL per unique page, ready to copy.' },
  ],
  'edit': [
    { q: 'Does it let me edit the original text already in the PDF?', a: 'No, it adds new text and image overlays on top of the page rather than modifying existing PDF content.' },
    { q: 'Can I position overlays precisely?', a: 'Yes, anchor to any of 9 positions (left, center, or right combined with top, middle, or bottom) with pixel offsets, and a marker preview shows roughly where each overlay will land.' },
    { q: 'Can I add overlays to specific pages in a multi-page PDF?', a: 'Yes, use Prev and Next to switch pages, and each overlay you add is tied to whichever page was active when you added it.' },
  ],
  'email-generator': [
    { q: 'Are the generated emails real, active inboxes?', a: 'No, they\'re randomly assembled addresses for testing forms, seeding databases, or demos, not real mailboxes.' },
    { q: 'What naming patterns can I choose?', a: 'Random characters, firstname-lastname, firstname.lastname, firstname_lastname, firstname+number, or a custom pattern using placeholders like firstname, lastname, first, last, and digits.' },
    { q: 'Can I set my own domain instead of the built-in list?', a: 'Yes, choose "Custom domain..." from the Domain dropdown and type any domain you want appended.' },
  ],
  'email-validator': [
    { q: 'Does it check whether the email address actually exists?', a: 'No, it only checks the format, things like local part length, domain length, and allowed characters, not whether the mailbox is real or receives mail.' },
    { q: 'What specific rules does it check?', a: 'Presence of exactly one @, a local part under 64 characters with valid characters, and a domain under 253 characters matching valid hostname label formatting.' },
    { q: 'What does it tell me when an email is invalid?', a: 'A specific reason, such as a missing @ symbol, invalid characters in the local part, or an invalid domain format.' },
  ],
  'emoji-finder': [
    { q: 'How does the search match emojis?', a: 'By name or by any of its associated keywords, so searching "hi" finds Waving Hand even though "hi" isn\'t in its name.' },
    { q: 'What categories can I filter by?', a: 'Smileys, Gestures, Symbols, Travel, Objects, People, and Nature, or All to see every emoji at once.' },
    { q: 'What happens when I click an emoji?', a: 'It\'s copied straight to your clipboard, with the label briefly switching to "Copied" as confirmation.' },
  ],
  'encodings-reference': [
    { q: 'What encoding tables does it include?', a: 'Four reference tables: ASCII characters 32 to 126 with decimal and hex codes, common HTML entities in named and numeric form, URL-encoded special characters, and the full Base64 alphabet with its padding character.' },
    { q: 'Can I search within a table instead of scrolling?', a: 'Yes, a live search box filters whichever table tab is active, matching against the character, its name, or its code.' },
    { q: 'Does it encode text I type in?', a: 'No, it\'s a static lookup reference for the tables themselves rather than an encoder for arbitrary input.' },
  ],
  'env-parser': [
    { q: 'Does it handle the "export" prefix used in shell scripts?', a: 'Yes, a leading "export " before a key is stripped automatically before the line is parsed.' },
    { q: 'How does it handle quoted values?', a: 'Double-quoted values are unescaped, so \\n and \\" convert to a real newline and quote, single-quoted values are taken literally, and unquoted values can carry a trailing # comment that gets stripped.' },
    { q: 'What happens if the same key appears twice?', a: 'Both lines still show up in the parsed table, but the duplicate is flagged as an issue noting the later value wins.' },
  ],
  'english-collocations-checker': [
    { q: 'What kinds of word pairings does it check?', a: 'Common collocations built around everyday verbs like make, take, do, have, get, break, and about a dozen others, checking whether the word that follows forms a natural-sounding phrase.' },
    { q: 'Does it cover collocations beyond these verbs?', a: 'Not yet, it checks a fixed dictionary of common verb-based pairings rather than every possible English collocation.' },
    { q: 'What does it show when a pairing looks off?', a: 'It highlights the phrase in your text and suggests the more natural pairing from its dictionary in its place.' },
  ],
  'english-dictionary': [
    { q: 'Where do the definitions come from?', a: 'A live lookup against the Free Dictionary API, not a static built-in wordlist.' },
    { q: 'What information does it show beyond the definition?', a: 'Phonetic spelling with audio playback where available, example sentences, and synonyms and antonyms listed under each meaning.' },
    { q: 'What happens if I search a word that isn\'t found?', a: 'It shows a specific not-found message rather than a generic error, so you know the lookup worked but the word wasn\'t recognized.' },
  ],
  'english-grammar-checker': [
    { q: 'What kinds of errors does it catch?', a: 'A fixed set of common mistakes: its/it\'s confusion, your/you\'re, "could of" instead of "could have", alot, then/than mix-ups, a missing capital on "I", and double spacing.' },
    { q: 'Does it analyze sentence structure or writing style?', a: 'No, it matches your text against a list of common error patterns rather than parsing grammar or judging style and clarity.' },
    { q: 'How are corrections shown?', a: 'Each match highlights the specific phrase in your text and offers the corrected wording to swap in.' },
  ],
  'excel-to-csv': [
    { q: 'What Excel format does it accept?', a: '.xlsx files, read directly from the file\'s internal XML and shared-strings data in your browser, nothing is uploaded to a server.' },
    { q: 'Does it handle workbooks with multiple sheets?', a: 'Yes, every sheet gets its own tab so you can switch between them before copying or downloading.' },
    { q: 'Is there a row limit?', a: 'The on-screen preview shows the first 200 rows, but the downloaded CSV always includes every row in the sheet.' },
  ],
  'excel-to-xml': [
    { q: 'What does the generated XML look like?', a: 'Each sheet becomes a Worksheet element containing Row elements, and each Row contains Cell elements tagged with a column index.' },
    { q: 'Does it handle workbooks with multiple sheets?', a: 'Yes, a tab switcher lets you pick which sheet to export, and the XML preview and download update to match.' },
    { q: 'Can I copy the XML instead of downloading a file?', a: 'Yes, a Copy XML button puts the full generated markup on your clipboard.' },
  ],
  'exif-remover': [
    { q: 'What metadata does it show before removing it?', a: 'Common EXIF tags such as camera make and model, timestamps, exposure time, F-number, ISO, and focal length, listed so you can see what was embedded.' },
    { q: 'How does it actually strip the metadata?', a: 'It redraws the image onto a canvas and re-exports it from there, which drops all embedded metadata as a side effect, not only the specific tags it listed.' },
    { q: 'What if no EXIF tags are detected?', a: 'It still re-encodes the image and offers the cleaned file for download, since some formats or cameras embed metadata this parser doesn\'t decode by name.' },
  ],
  'extract-img': [
    { q: 'What image encodings can it pull out of a PDF?', a: 'JPEG images are extracted directly, and grayscale, RGB, CMYK, and indexed-RGB images are rebuilt pixel by pixel into PNG files.' },
    { q: 'Are there image types it can\'t extract?', a: 'Yes, less common encodings like JPEG2000 or CCITT fax compression are skipped rather than guessed at, so every image you get back is a faithful copy of the original.' },
    { q: 'Can I download every extracted image at once?', a: 'Yes, a Download All as ZIP option bundles every image found in the PDF into a single archive built in your browser.' },
  ],
  'favicon-from-emoji': [
    { q: 'Can I set custom foreground and background colors?', a: 'Yes, both the emoji\'s background fill and the canvas size are adjustable before you generate the icon.' },
    { q: 'What sizes and formats can I download?', a: 'PNG, ICO, and SVG, at whatever pixel size you set from 16 up to 512, one file per generation rather than a single multi-size bundle.' },
    { q: 'Does it work with any image or logo I upload?', a: 'No, the icon is built from a typed emoji rather than an uploaded image or logo.' },
  ],
  'fake-address-generator': [
    { q: 'How realistic are the generated addresses?', a: 'Street names, cities, and states are drawn from real US naming patterns, but the combinations are random and the zip codes are not validated against real postal ranges, so no output corresponds to an actual address.' },
    { q: 'Can I generate more than one address at a time?', a: 'Yes, set the count up to 100 and every generated address is listed and copyable individually or all at once.' },
    { q: 'What formats can I copy the results in?', a: 'A single formatted address block, or the full batch as plain text or JSON.' },
  ],
  'fake-data-generator': [
    { q: 'What types of fake data can it generate?', a: 'Full person records, or just emails, addresses, or usernames on their own, picked with a mode tab before generating.' },
    { q: 'How many records can I generate at once?', a: 'Up to 100 rows in one batch, shown in a table you can scan before exporting.' },
    { q: 'Can I export the generated rows?', a: 'Yes, a Copy CSV button puts every row on your clipboard in comma-separated form.' },
  ],
  'fake-text-generator': [
    { q: 'What kind of placeholder text does it produce?', a: 'Classic lorem ipsum style filler, built by stringing together random words from the traditional lorem ipsum word list.' },
    { q: 'How much text can I generate?', a: 'Pick a preset word count from 10 to 500, or enter any custom amount up to 1000 words.' },
    { q: 'Does the output vary each time?', a: 'Yes, each click of Generate Text picks a new random sequence of words rather than repeating the same fixed paragraph.' },
  ],
  'filler-word-counter': [
    { q: 'Which filler words does it look for?', a: 'A list of about twenty common ones, including um, uh, like, you know, basically, actually, literally, and honestly.' },
    { q: 'Does it catch filler phrases, not just single words?', a: 'Yes, multi-word fillers like "you know" and "at the end of the day" are matched as whole phrases, not split into separate words.' },
    { q: 'How are the results broken down?', a: 'Each filler word or phrase found is listed with its own count, sorted from most to least frequent, plus a total count at the top.' },
  ],
  'flesch-kincaid-calculator': [
    { q: 'What two scores does it calculate?', a: 'The Flesch Reading Ease score and the Flesch-Kincaid Grade Level, both computed from your text\'s word, sentence, and syllable counts.' },
    { q: 'How does it count syllables?', a: 'A vowel-group heuristic scans each word for groups of vowels, which approximates syllable count without a dictionary lookup.' },
    { q: 'What do the score labels mean?', a: 'Reading Ease is labeled from Very Easy down to Very Difficult, and Grade Level is labeled from Elementary through Graduate, so you don\'t have to interpret the raw numbers yourself.' },
  ],
  'fraction-calculator': [
    { q: 'Which operations can it perform?', a: 'Addition, subtraction, multiplication, and division on two fractions, selected with a button between the two input fractions.' },
    { q: 'Does it simplify the result?', a: 'Yes, the result is automatically reduced to lowest terms using the greatest common divisor.' },
    { q: 'What other formats does it show?', a: 'Alongside the simplified fraction, it shows the equivalent decimal value and, when applicable, the result as a mixed number.' },
  ],
  'fraction-to-decimal': [
    { q: 'What input formats does it accept?', a: 'A simple fraction like 3/4, a mixed number like 1 2/3, or a plain decimal, all parsed from the same text field.' },
    { q: 'Can I control how many decimal places show?', a: 'Yes, a decimal places setting from 0 to 15 controls the rounding of the output.' },
    { q: 'What happens with an invalid fraction?', a: 'It shows a specific error message telling you the expected format instead of a blank or broken result.' },
  ],
  'general-unit-converter': [
    { q: 'Which categories of units does it cover?', a: 'Length, weight, temperature, area, volume, and speed, switchable from a category selector above the conversion fields.' },
    { q: 'How does it handle temperature conversions?', a: 'Temperature uses its own formula rather than a simple multiplier, since Celsius, Fahrenheit, and Kelvin don\'t share a common zero point.' },
    { q: 'Does the unit list change based on the category?', a: 'Yes, picking a category updates both dropdowns to only show units that belong to it.' },
  ],
  'grammar-checker': [
    { q: 'Where do the grammar and spelling checks come from?', a: 'A live call to the LanguageTool grammar API, not a small built-in rule list, so it can catch a much wider range of errors than simple pattern matching.' },
    { q: 'Can I apply the suggested fixes directly?', a: 'Yes, each issue lists up to three replacement options as buttons, and clicking one swaps it into your text at that exact spot.' },
    { q: 'What happens if the grammar service is unreachable?', a: 'It shows a clear connection error instead of a silent failure or a fake result, so you know to try again.' },
  ],
  'hash-identifier': [
    { q: 'How does it guess the hash type?', a: 'Mainly by digest length, such as 32 characters for MD5 or 64 for SHA-256, combined with format patterns like the $2a$ prefix for bcrypt or {sha1} for Apache-style hashes.' },
    { q: 'What is the character entropy indicator for?', a: 'It measures how many unique characters appear relative to the total length, which can hint at whether a string looks like a genuine hash or a low-variation placeholder.' },
    { q: 'Is the identification guaranteed to be correct?', a: 'No, it is an educated guess based on length and format alone, since many hash algorithms share the same output length and can\'t be told apart with certainty.' },
  ],
  'hex-rgb-hsl-color-picker': [
    { q: 'Can I start from any of the three color formats?', a: 'Yes, editing the Hex field, any of the RGB number inputs, or any of the HSL number inputs immediately recalculates the other two formats.' },
    { q: 'Is there a visual color picker, not just text fields?', a: 'Yes, a native color swatch picker sits alongside the Hex field for picking a color visually.' },
    { q: 'What does the output line at the bottom show?', a: 'A single combined line with the color in Hex, rgb(), and hsl() CSS notation, ready to copy into a stylesheet.' },
  ],
  'hex-to-cmyk': [
    { q: 'How is the CMYK value calculated from Hex?', a: 'The Hex code is first converted to RGB, then to CMYK using the standard subtractive color formula based on each channel\'s distance from full black.' },
    { q: 'Can I pick a color instead of typing a Hex code?', a: 'Yes, a color swatch picker next to the text field lets you choose a color visually and convert it.' },
    { q: 'What happens if I enter an invalid Hex code?', a: 'It shows an error telling you to use the #RRGGBB format instead of returning a wrong or blank result.' },
  ],
  'hex-to-hsl': [
    { q: 'What does the HSL output include?', a: 'Hue in degrees, and saturation and lightness as percentages, plus a ready-to-copy hsl() CSS string.' },
    { q: 'How accurate is the conversion?', a: 'It uses the standard RGB-to-HSL formula based on the minimum and maximum channel values, the same math used by browser color tools.' },
    { q: 'Can I pick a color visually instead of typing Hex?', a: 'Yes, a color swatch picker next to the text field lets you choose a color and convert it to HSL.' },
  ],
  'hex-to-hsv': [
    { q: 'What is the difference between HSV and HSB?', a: 'None, they are the same model under two names: Hue, Saturation, and Value, also called Brightness.' },
    { q: 'What does the result show?', a: 'Hue in degrees, saturation and value as percentages, and a ready-to-copy hsv() string.' },
    { q: 'Can I pick a color visually instead of typing Hex?', a: 'Yes, a color swatch picker next to the text field lets you choose a color and convert it to HSV.' },
  ],
  'hex-to-rgba': [
    { q: 'How does the alpha channel work?', a: 'A slider from 0 to 1 in steps of 0.1 sets the alpha value, which is combined with the converted RGB channels in the final rgba() output.' },
    { q: 'What does the preview show?', a: 'A swatch rendered with the actual rgba() value, so you can see the transparency effect, not just the solid color.' },
    { q: 'What happens with an invalid Hex code?', a: 'It shows an error asking for the #RRGGBB format instead of guessing or returning a broken value.' },
  ],
  'homoglyph-detector': [
    { q: 'What counts as a homoglyph here?', a: 'Latin letters and digits that have visually similar Cyrillic, Greek, or other lookalike characters, such as Cyrillic а standing in for Latin a.' },
    { q: 'Does it check URLs specifically?', a: 'Yes, any http or https URL in the input is pulled out separately and checked for lookalike characters that would make it visually mimic a different domain.' },
    { q: 'How is risk level decided?', a: 'A character is marked high risk when a Latin letter has a similar character from a different script, since that mismatch is the pattern used in real phishing domains.' },
  ],
  'homophone-checker': [
    { q: 'Which word pairs does it catch?', a: 'Around 15 commonly confused sets, including there/their/they\'re, your/you\'re, its/it\'s, to/too/two, and affect/effect.' },
    { q: 'How does it decide which word to suggest?', a: 'Each match is checked against simple contraction patterns, like skipping "there" right after an apostrophe so "they\'re" isn\'t flagged as an error.' },
    { q: 'Does it show where each issue appears?', a: 'Yes, each result includes the surrounding text so you can see the word in context before deciding whether to change it.' },
  ],
  'hreflang-tag-generator': [
    { q: 'How many languages and regions does it support?', a: 'Over 30 locale combinations, from en-US and es-MX to ja-JP and ar-SA, toggled on individually from a grid.' },
    { q: 'What output formats can I generate?', a: 'HTML link tags, a JSON array, or a full XML sitemap with xhtml:link alternates, switchable with one click.' },
    { q: 'What does marking a page as x-default do?', a: 'It flags that URL as the fallback shown to visitors whose language doesn\'t match any of your selected locales, and adds the matching x-default tag to the output.' },
  ],
  'hsl-to-hex': [
    { q: 'Can I switch between entering HSL and Hex directly?', a: 'Yes, a toggle switches the input mode between HSL sliders and a Hex text field, and editing either one keeps the other in sync.' },
    { q: 'Does the preview update as I move the sliders?', a: 'Yes, the color swatch, Hex value, and CSS code all update immediately as you drag the hue, saturation, or lightness slider.' },
    { q: 'What do the preset swatches do?', a: 'Clicking a preset like Red or Cyan jumps the sliders straight to that color\'s HSL values instead of dragging manually.' },
  ],
  'hsv-to-hex': [
    { q: 'How is HSV different from HSL?', a: 'HSV uses Value (brightness) instead of Lightness, which makes it easier to darken a color toward black without also washing it toward gray.' },
    { q: 'Does the preview update as I move the sliders?', a: 'Yes, the color swatch and Hex value update immediately as you drag the hue, saturation, or value slider.' },
    { q: 'Can I start from a Hex code instead?', a: 'Yes, switching to Hex Input mode lets you type or pick a Hex color and see its equivalent HSV sliders.' },
  ],
  'html-attribute-encoder': [
    { q: 'Which characters does it encode?', a: 'Ampersand, double quote, single quote, less-than, and greater-than, the five characters that can break out of an HTML attribute value.' },
    { q: 'Can it also decode?', a: 'Yes, a Decode mode reverses the same five entities back into their original characters.' },
    { q: 'Why not just use JavaScript\'s built-in encoding?', a: 'Attribute encoding has different rules than URL or HTML-body encoding, since a single quote or double quote inside an attribute value needs escaping that those other encoders don\'t apply.' },
  ],
  'html-encoder': [
    { q: 'Which characters does the encoder convert?', a: 'The five characters with special meaning in HTML: ampersand, less-than, greater-than, double quote, and single quote, each turned into its named entity such as &amp; or &lt;.' },
    { q: 'Does decode handle entities beyond the basic five?', a: 'Yes, decoding runs the text through a hidden browser textarea so any valid named entity like &copy; or &trade;, along with decimal and hexadecimal numeric references, resolves correctly, not just the five reserved characters.' },
    { q: 'What happens with text that has no special characters?', a: 'Encoding returns it unchanged since there is nothing to escape, and the same applies in reverse when decoding plain text.' },
  ],
  'html-encoder-decoder': [
    { q: 'How is this different from a plain find-and-replace?', a: 'Encoding always converts the same five reserved characters, ampersand, less-than, greater-than, double quote, and single quote, to their named entities in one pass, so you do not need to remember or type out entity codes yourself.' },
    { q: 'Where does the output appear?', a: 'A separate read-only Output field below the input shows the converted text, kept apart from what you typed so you can compare both side by side.' },
    { q: 'Can I paste HTML markup and get it back exactly?', a: 'Encoding a full HTML snippet escapes the angle brackets and quotes so the tags display as visible text instead of being rendered, useful for showing HTML code inside another HTML page.' },
  ],
  'html-entities-reference': [
    { q: 'How many entities are in the reference table?', a: 'Two dozen commonly used entities, covering the five HTML-reserved characters plus symbols like copyright, trademark, currency signs, dashes, and typographic quotes.' },
    { q: 'How do I find a specific character?', a: 'Type into the search box and it filters live by matching either the character itself or its name, such as typing "trade" to jump straight to the trademark symbol.' },
    { q: 'What happens when I click a code in the table?', a: 'It copies that entity code to your clipboard and the button briefly shows "Copied!" so you can confirm it worked before pasting.' },
  ],
  'html-live-preview': [
    { q: 'Does the preview update as I type, or do I need to click a button?', a: 'It updates immediately on every keystroke since the preview pane is bound directly to the HTML input, with no render or refresh button involved.' },
    { q: 'Is the preview rendered in an isolated frame?', a: 'Yes, the HTML is rendered inside a sandboxed iframe using its srcDoc, keeping the preview separate from the rest of the page.' },
    { q: 'What HTML does it start with?', a: 'A small placeholder snippet with a heading and paragraph is preloaded so you immediately see how the split view works before typing your own markup.' },
  ],
  'html-table-to-json': [
    { q: 'How does it detect table headers?', a: 'It first looks for <th> cells in the table; if none exist, it falls back to using the text of the first row\'s <td> cells as the header names.' },
    { q: 'What does the JSON look like when headers are found?', a: 'An object with a headers array and a rows array, where each row is keyed by the matching header name instead of a plain positional array.' },
    { q: 'What if a table has no headers at all?', a: 'Each cell gets a generic key like col0 and col1 based on its position, and the output becomes a plain array of those row objects.' },
  ],
  'html-to-markdown': [
    { q: 'Which HTML elements does it convert?', a: 'Headings h1 through h6, bold and italic text, links, images, inline and block code, blockquotes, ordered and unordered lists, horizontal rules, and line breaks, each mapped to its Markdown equivalent.' },
    { q: 'Does it preserve links and images automatically?', a: 'Yes, anchor tags become [text](url) links and img tags become ![alt](src) images automatically, with no separate setting needed to turn that on.' },
    { q: 'What happens to HTML tags it does not specifically handle?', a: 'Any remaining tags are stripped out after the known conversions run, so the result is plain Markdown text rather than a mix of Markdown and leftover HTML.' },
  ],
  'html-plaintext-express': [
    { q: 'How does it decide where to add line breaks?', a: 'It walks the parsed HTML looking for text sitting inside block-level elements like <p>, <div>, or <li>, and inserts a newline before that text so paragraphs and list items do not run together.' },
    { q: 'Does it parse the HTML or just strip tags with find-and-replace?', a: 'It parses the HTML with the browser\'s own DOMParser and walks the resulting text nodes, rather than using regular expressions to remove tags.' },
    { q: 'What happens with multiple blank lines in the source?', a: 'Runs of three or more consecutive line breaks in the extracted text get collapsed down to a single blank line.' },
  ],
  'html-to-plain-text-tool': [
    { q: 'Does it remove script and style code along with the tags?', a: 'Yes, entire <head>, <script>, and <style> blocks are stripped out completely before the remaining tags are removed, so their code never leaks into the output.' },
    { q: 'How does it handle HTML entities like &amp; or &quot;?', a: 'The six most common entities, including &amp;, &lt;, &gt;, &quot;, &#39;, and &nbsp;, are decoded back to their literal characters in the output.' },
    { q: 'How is extra whitespace handled?', a: 'Every run of consecutive whitespace left behind after tags are removed is collapsed into a single space.' },
  ],
  'html-validator': [
    { q: 'What counts as a "missing tag" error?', a: 'It tracks opening and closing tags with a stack as it scans, and flags both unclosed tags left on the stack and closing tags that do not match the tag that was actually open.' },
    { q: 'Which deprecated tags does it flag?', a: 'Old presentational tags like <center>, <font>, <marquee>, <blink>, and <strike>, with a suggestion to use CSS instead.' },
    { q: 'What accessibility issues does it check for?', a: 'Missing alt attributes on <img> tags, plus javascript: URLs in href attributes, which are flagged as both a security and accessibility concern.' },
  ],
  'collage-maker': [
    { q: 'How many photos can I put in one collage?', a: 'It depends on the layout you pick, from a single 2x1 pair up to nine photos in the 3x3 grid, and the dropzone tells you how many slots the current layout has left.' },
    { q: 'What counts as "customizing borders"?', a: 'A spacing slider controls the gap between photos from 0 to 30 pixels, and a background color picker sets what shows through that gap, together framing each photo like a border.' },
    { q: 'What happens if I switch layouts after adding photos?', a: 'Changing the layout clears the photos you already added, since each layout has a different number of slots to fill from scratch.' },
  ],
  'image-background-remover': [
    { q: 'How does Auto Detect know what the background is?', a: 'It samples the pixel colors at all four corners of the image, averages them into one background color, then flood-fills outward from those corners removing any pixel within your tolerance of that color.' },
    { q: 'When should I use Color Key instead?', a: 'Color Key removes a specific color you choose with the color picker, such as green screen footage, rather than guessing the background from the corners.' },
    { q: 'What does the Tolerance slider control?', a: 'It sets how close a pixel\'s color has to be to the detected or chosen background color to get made transparent, so raising it removes more color variation like shadows or gradients.' },
  ],
  'image-color-picker': [
    { q: 'How precise is the color it picks?', a: 'It reads the exact pixel color under your click from the image drawn on a canvas, so you get the true color at that point rather than an averaged or estimated value.' },
    { q: 'What formats can I copy?', a: 'Hex, RGB, and HSL, each with its own copy button; the RGB and HSL values are written in valid CSS syntax like rgb(r, g, b) so you can paste them straight into a stylesheet.' },
    { q: 'Can I sample more than one color from the same image?', a: 'Yes, click anywhere else on the image to update the selected color, and each format\'s copy button always reflects whatever pixel you clicked most recently.' },
  ],
  'image-compressor': [
    { q: 'Which output formats can I compress to?', a: 'JPEG, PNG, or WebP, chosen with a button group, with a short note under each explaining when it is the better choice, such as JPEG for photos or WebP for the best overall compression.' },
    { q: 'How do I control the tradeoff between size and quality?', a: 'A quality slider from 1 to 100 percent controls the compression level, with the tool suggesting 80 percent as a good default balance.' },
    { q: 'How can I tell how much smaller the result is?', a: 'The Original and Compressed panels show file size side by side, and a compression result card displays the percentage saved after you run Compress Image.' },
  ],
  'image-cropper': [
    { q: 'What preset ratios are available?', a: 'Square 1:1, 16:9, 4:3, 3:2, Portrait 2:3, and Passport 35mm, so you can crop directly to common social, video, or ID photo dimensions.' },
    { q: 'How do I select the exact area to crop?', a: 'Drag directly on the image to draw a crop rectangle, shown as a semi-transparent overlay you can adjust before cropping.' },
    { q: 'What happens after I crop?', a: 'The selected region is drawn onto a new canvas at its original resolution and offered as a separate PNG download, leaving your original image untouched.' },
  ],
  'image-flip-tool': [
    { q: 'What flip directions are available?', a: 'Horizontal, Vertical, or Both, each applied with a canvas transform so the flip renders instantly without any quality loss.' },
    { q: 'Can I see the result before downloading?', a: 'Yes, the Original and Flipped versions display side by side so you can confirm the mirroring is correct before saving.' },
    { q: 'Does flipping change the image dimensions?', a: 'No, flipping only mirrors the pixels along the chosen axis, so the width and height stay exactly the same as the original.' },
  ],
  'detect': [
    { q: 'How can it tell the real format if the file extension is wrong?', a: 'It reads the first few bytes of the file and checks them against the magic-number signatures for PNG, JPEG, GIF, BMP, WebP, ICO, and SVG, which is the same way image formats identify themselves regardless of what the filename says.' },
    { q: 'What does the mismatch warning mean?', a: 'It shows up when the MIME type your browser reports for the file does not match what the file\'s own byte signature says it is, a sign the extension or reported type may be misleading.' },
    { q: 'What color information does it show?', a: 'Bit depth and color type read directly from the format\'s header, such as PNG\'s color type byte or a JPEG\'s SOF marker, showing things like RGBA truecolor or an indexed palette.' },
  ],
  'image-format-converter': [
    { q: 'Which formats can I convert between?', a: 'JPEG, PNG, WebP, and AVIF as output formats, with JPEG, PNG, WebP, AVIF, and GIF all accepted as input.' },
    { q: 'Why is the quality slider disabled for PNG?', a: 'PNG is a lossless format, so there is no quality setting to adjust, it always encodes at full fidelity regardless of the slider position.' },
    { q: 'Can I compare the file size before and after converting?', a: 'Yes, the Before and After panels show each version\'s file size side by side, plus a percentage showing how much smaller or larger the converted file turned out.' },
  ],
  'ipv6-generator': [
    { q: 'What is the difference between the three formats?', a: 'Full writes out all eight hex groups exactly, Compressed shortens the longest run of zero groups to a double colon the way addresses are normally written, and EUI-64 derives the last two groups from a randomly generated MAC address using the standard EUI-64 interface-identifier method.' },
    { q: 'How many addresses can I generate at once?', a: 'Up to 100 per click, set with the Count field next to the format dropdown.' },
    { q: 'Are these real, routable addresses?', a: 'No, every group is randomly generated, so they are meant for filling test data or documentation, not for addresses that exist on any real network.' },
  ],
  'jpg-to-png': [
    { q: 'Does it accept formats other than JPEG?', a: 'Yes, the upload also accepts PNG, WebP, GIF, and BMP up to 20MB, though the tool is built around converting a JPEG source into PNG output.' },
    { q: 'Does converting JPEG to PNG restore detail lost to JPEG compression?', a: 'No, PNG is lossless going forward, so no further quality is lost during this conversion, but any detail already discarded by the original JPEG compression cannot be recovered.' },
    { q: 'What is actually happening during the conversion?', a: 'The uploaded image is drawn onto a canvas at its full resolution, then read back out as PNG data, which is why the output keeps the same pixel dimensions as the source file.' },
  ],
  'jpg-to-webp': [
    { q: 'How much smaller does the WebP version end up?', a: 'It varies by image, so the tool shows the exact before-and-after file sizes plus a percentage difference after each conversion rather than a fixed number.' },
    { q: 'Can I control the WebP compression level?', a: 'Yes, a quality slider from 1 to 100 adjusts the WebP encoding, letting you trade off file size against visual quality before downloading.' },
    { q: 'Can I convert to a different format instead if I change my mind?', a: 'Yes, the same output format buttons also offer JPEG, PNG, and AVIF, so you can switch targets without re-uploading the image.' },
  ],
  'json-escape-unescape': [
    { q: 'Does it only escape for JSON, or other languages too?', a: 'JSON is the default context, but a context selector also covers JavaScript, regex, HTML, and a general backslash mode, each escaping a different set of characters like quotes, angle brackets, or regex metacharacters.' },
    { q: 'How do I reverse an escape I already applied?', a: 'Switch to the Unescape tab, or click the Swap button after escaping to move the output back into the input and flip the mode automatically.' },
    { q: 'What exactly gets escaped in JSON mode?', a: 'Backslashes, double quotes, newlines, carriage returns, and tabs, each converted to its two-character JSON escape sequence like \\n or \\t so the string is safe to embed inside a JSON value.' },
  ],
  'json-path-tester': [
    { q: 'What JSONPath syntax does it support?', a: 'Dot notation for object keys, the * wildcard for all values, numeric array indexes, and simple filter expressions like [?(@.price > 20)] for comparing a field against a value.' },
    { q: 'Are there example paths I can try?', a: 'Yes, buttons above the path field load ready-made expressions like "All books" or "Expensive items" against the sample bookstore JSON that is preloaded when you first open the tool.' },
    { q: 'What happens if my path matches nothing?', a: 'The results panel shows a literal "(no matches)" entry instead of an empty list, so you can tell a valid path that found nothing apart from a JSON or syntax error.' },
  ],
  'json-schema-validator': [
    { q: 'Which JSON Schema keywords does it check?', a: 'Type, enum, const, minimum/maximum and their exclusive variants, minLength/maxLength, pattern, format (email, uri, date-time, ipv4), array constraints like minItems and uniqueItems, and object constraints like required and additionalProperties.' },
    { q: 'How specific are the error messages?', a: 'Each violation lists the exact property path where it occurred alongside a plain-language description, such as which required property is missing or which minimum a number fell below.' },
    { q: 'Can I clean up messy schema or data JSON before validating?', a: 'Yes, a Format button above each textarea re-indents that panel\'s JSON if it already parses, without needing to run the validation first.' },
  ],
  'json-to-xml': [
    { q: 'How does it decide what becomes an XML attribute instead of a child element?', a: 'Any key that starts with an @ symbol is written as an attribute on its parent element, for example "@id" becomes id="...", while every other key becomes a nested child element.' },
    { q: 'Can I change the name of the outermost XML tag?', a: 'Yes, a Root element field above the input lets you type any tag name, and the output updates as you type.' },
    { q: 'How are special characters like < or & handled inside values?', a: 'They are escaped to their XML entity equivalents such as &lt; and &amp; automatically, so the output stays valid XML even if your JSON strings contain markup-like text.' },
  ],
  'json-ld-generator': [
    { q: 'Which Schema.org types can I generate?', a: 'WebSite, WebPage, Article, NewsArticle, BlogPosting, Product, LocalBusiness, Restaurant, Event, Person, Organization, BreadcrumbList, and FAQPage, selected from a row of tabs above the form fields.' },
    { q: 'What form does the output take?', a: 'A ready-to-paste script tag, `<script type="application/ld+json">...</script>`, containing the generated schema as formatted JSON so you can drop it straight into your page\'s head section.' },
    { q: 'Can I add more than one breadcrumb or FAQ entry?', a: 'Yes, both the BreadcrumbList and FAQPage forms have an "Add" button to append additional items, each with its own remove button.' },
  ],
  'jupyter-cleaner': [
    { q: 'What exactly gets stripped from the notebook?', a: 'Every code cell\'s outputs array is emptied, its execution_count is reset to null, and cell-level metadata like collapsed and scrolled flags are removed, while source code and markdown cells are left untouched.' },
    { q: 'Does it keep any notebook-level metadata?', a: 'Yes, it preserves the kernelspec and a trimmed language_info (just the name and version), since those are usually needed to reopen the notebook correctly, and discards everything else.' },
    { q: 'Can I upload a file instead of pasting JSON?', a: 'Yes, an upload field accepts a .ipynb file directly and loads its contents into the editor, or you can paste the notebook JSON by hand.' },
  ],
  'jwt-inspector': [
    { q: 'Does it verify the token\'s signature?', a: 'No, it only decodes the header and payload and displays the signature segment as-is, it never checks the signature against a secret or public key.' },
    { q: 'How can I tell if a token is expired at a glance?', a: 'A badge next to the input reads "Not expired," "Expired," or "Not yet valid" based on the exp and nbf claims compared against the current time, or "No exp claim" if the token does not set one.' },
    { q: 'What if I paste something that is not three dot-separated parts?', a: 'It shows an error explaining that a JWT needs a header, payload, and signature separated by dots, rather than trying to guess at a partial token.' },
  ],
  'jwt-token-decoder': [
    { q: 'What standard claims does it surface?', a: 'iss, sub, aud, iat, nbf, and exp are pulled out into a dedicated "Standard claims" section, with iat, nbf, and exp additionally converted to a readable UTC timestamp next to their raw numeric value.' },
    { q: 'Is there a sample token to try it with?', a: 'Yes, the input starts pre-filled with a sample JWT so you can see decoded header and payload output immediately without needing your own token.' },
    { q: 'Can I copy just the payload without the header or signature?', a: 'Yes, the header, payload, and signature each have their own Copy button next to their section, so you can grab exactly the part you need.' },
  ],
  'keyword-density-analyzer-new': [
    { q: 'Can I check density for a phrase instead of a single word?', a: 'Yes, whatever you type in the Target Keyword field, single word or multi-word phrase, is matched as an exact sequence against the text using a word-by-word sliding comparison.' },
    { q: 'What do the color changes on the density bar mean?', a: 'The bar and percentage turn green when density falls between 1% and 3%, which the tool treats as the safe SEO range, and orange outside that range with a warning about being too sparse or too spammy.' },
    { q: 'Is the analysis case-sensitive?', a: 'No, both the content and the keyword are lowercased before comparison, so "SEO Tips" and "seo tips" are treated as the same match.' },
  ],
  'keyword-density-checker': [
    { q: 'How does it count multi-word keyword phrases?', a: 'It splits your keyword on spaces and slides a window of that many words across the text, counting a match every time the sequence appears in order, so "content marketing strategy" is checked as an exact three-word phrase rather than three separate word counts.' },
    { q: 'What counts as the ideal density range?', a: 'The bar and message turn green between 1% and 3% keyword density, below 1% it flags the keyword as underused, and above 3% it warns the density may look spammy to search engines.' },
    { q: 'Does it strip out numbers or punctuation when counting total words?', a: 'Yes, the total word count only matches sequences of letters, so numbers, punctuation, and symbols are excluded from both the total word count and the keyword search.' },
  ],
  'length-converter': [
    { q: 'Which units can I convert between?', a: 'Meters, kilometers, centimeters, millimeters, miles, yards, feet, and inches, selectable from the From Unit dropdown, with the Convert button showing your value in all eight at once.' },
    { q: 'How precise are the converted values?', a: 'Each conversion is calculated to six decimal places and then trailing zeros are trimmed, so results are precise without unnecessary trailing digits.' },
    { q: 'Why does the result show up as a full list instead of one number?', a: 'Converting your input into all eight units at once lets you compare multiple options side by side, rather than picking a single output unit ahead of time.' },
  ],
  'line-counter': [
    { q: 'How is an "empty line" defined?', a: 'A line counts as empty if it is blank or contains only whitespace after trimming, so a line with just spaces or tabs is counted as empty, not non-empty.' },
    { q: 'What does the byte count measure?', a: 'The UTF-8 encoded byte size of your full text, which can be larger than the character count for text containing multi-byte characters like emoji or accented letters.' },
    { q: 'Does a trailing newline at the end of the text add an extra line?', a: 'Yes, splitting on newline characters means text ending in a newline produces one additional empty entry after the last line break, which is included in both the total and empty line counts.' },
  ],
  'list-randomizer': [
    { q: 'Can I remove duplicate items before shuffling?', a: 'Yes, a "Remove duplicates before shuffling" checkbox deduplicates identical lines before the shuffle runs, so repeated entries only appear once in the result.' },
    { q: 'How is each item separated?', a: 'One item per line, so pasting a list separated any other way, like commas or tabs, is treated as a single item until you break it onto its own lines.' },
    { q: 'What shuffling method does it use?', a: 'A Fisher-Yates shuffle, swapping each item with a randomly chosen earlier or equal position, which gives every possible order an equal chance rather than a biased sort-by-random-key approach.' },
  ],
  'lorem-ipsum-paragraphs': [
    { q: 'How many paragraphs can I generate at once?', a: 'Up to 100, set with the count field, with each paragraph built from roughly 80-word blocks of the fixed Lorem ipsum passage split into sentence-length chunks.' },
    { q: 'Can I switch to sentences or words instead of full paragraphs?', a: 'Yes, the Words, Sentences, and Paragraphs tabs above the count field switch the output unit without needing to re-enter anything.' },
    { q: 'Does every paragraph start with "Lorem ipsum"?', a: 'Only the first one, if the "Start with Lorem ipsum..." checkbox is on, later paragraphs continue cycling through the same source passage from where the previous paragraph left off.' },
  ],
  'lorem-ipsum-words': [
    { q: 'What happens if I ask for more words than the source passage contains?', a: 'The generator cycles back to the start of the fixed Lorem ipsum passage and keeps going, so requesting 200 words repeats the roughly 69-word source text multiple times seamlessly.' },
    { q: 'Can I turn off the capitalized "Lorem ipsum" opening?', a: 'Yes, unchecking "Start with Lorem ipsum..." begins the word list from wherever the cycle happens to fall instead of forcing the classic opening.' },
    { q: 'Is there a maximum word count?', a: 'The count field caps at 100 words per generation.' },
  ],
  'm4a-to-wav': [
    { q: 'Is this a real audio conversion or just a renamed file?', a: 'A real one, the tool decodes the uploaded audio through the Web Audio API and manually writes a 16-bit PCM WAV file with a proper RIFF header, not just a file extension swap.' },
    { q: 'What input formats does it accept?', a: 'AAC, M4A, and MP4 files, either by clicking the upload area or dragging a file directly onto it.' },
    { q: 'Does it preserve the original number of audio channels and sample rate?', a: 'Yes, both are read from the decoded audio buffer and written into the WAV header exactly as they were in the source file, mono stays mono and the sample rate is not resampled.' },
  ],
  'markdown-preview': [
    { q: 'Does the preview update as I type, or do I need to click a button?', a: 'It updates live on every keystroke, rendered with the marked library and GitHub Flavored Markdown enabled, no render or refresh button needed.' },
    { q: 'Can I see the raw HTML instead of the rendered preview?', a: 'Yes, a tab next to Preview switches the right pane to show the generated HTML source, then a Copy HTML button grabs exactly what is displayed.' },
    { q: 'What Markdown features are supported?', a: 'GitHub Flavored Markdown, including headings, lists, inline code, fenced code blocks, blockquotes, and links, the same set used in the sample text preloaded when you open the tool.' },
  ],
  'merge': [
    { q: 'Can I change the order of the PDFs before merging?', a: 'Yes, each file in the list has up and down arrows to reorder it, so pages appear in your merged document in whatever sequence you choose.' },
    { q: 'What happens if I select a non-PDF file?', a: 'It is silently skipped, only files with a PDF mime type are added to the merge list, so dragging in a mixed folder only picks up the PDFs.' },
    { q: 'How do I know the merge worked correctly?', a: 'The result message reports the exact combined page count, calculated by copying every source PDF\'s pages in order into the new document with pdf-lib.' },
  ],
  'meta-description-checker': [
    { q: 'What character range counts as ideal?', a: '120 to 160 characters shows a green optimal-range badge, under 120 or over 160 shows a warning message telling you how many characters to add or trim.' },
    { q: 'What happens if my description goes past 200 characters?', a: 'An extra warning appears noting it will likely be truncated in search results, layered on top of the over-160 length warning.' },
    { q: 'Does the page title field affect the score?', a: 'No, only the meta description length drives the score and messages, the title field is there for context but is not itself scored.' },
  ],
  'mock-port-scanner-full': [
    { q: 'What does a "filtered" result mean compared to "closed"?', a: 'Filtered means the scan request to a given port errored out or timed out after one second without a clear answer, closed means the port responded but reported as not open, and open means it responded as accepting connections.' },
    { q: 'Can I scan a range of ports instead of listing them one by one?', a: 'Yes, the ports field accepts ranges like "1-1000" and comma-separated mixes such as "80, 443, 8080-8090", which are parsed, deduplicated, and sorted into one port list before scanning starts.' },
    { q: 'Does it tell me what service typically runs on an open port?', a: 'For about twenty well-known ports, like 22 for SSH, 443 for HTTPS, 3306 for MySQL, and 6379 for Redis, the results table shows the matching service name next to the port number.' },
  ],
  'mp4-to-wav': [
    { q: 'Does this work on the video file directly, or do I need to extract audio first?', a: 'You upload the MP4 video directly, the tool decodes its audio track through the Web Audio API and writes it straight to a WAV file, no separate audio-extraction step needed.' },
    { q: 'What happens to the video portion of my MP4 file?', a: 'It is discarded, only the decoded audio stream is used to build the WAV file, so the output is audio-only with no video frames.' },
    { q: 'Will the output be stereo or mono?', a: 'Whatever the source audio track is, mono stays mono and stereo stays stereo, since the channel count is read straight from the decoded audio buffer rather than forced to one setting.' },
  ],
  'network-port-scanner': [
    { q: "What's the default port range if I don't change anything?", a: '1 to 1000 is pre-filled in the Ports field when you open the tool, covering most common services without needing to type a range yourself.' },
    { q: 'How does it avoid hanging forever on a slow or unresponsive port?', a: 'Each port check aborts itself after one second via a timeout controller, marking that port as filtered rather than leaving the scan stuck waiting.' },
    { q: 'Does it check every port one at a time?', a: 'No, ports are grouped into batches of 50 and checked concurrently, with the progress bar and results table updating after each batch finishes.' },
  ],
  'notebook-to-html': [
    { q: 'Do I need to run the notebook first, or can I paste one that already has outputs?', a: 'Paste the raw .ipynb JSON as-is, including any stream text, execute_result, or error outputs already saved in the file, they are rendered directly without re-executing any code.' },
    { q: 'Does the code get real syntax highlighting?', a: 'Yes, a built-in tokenizer highlights strings, comments, numbers, keywords, and function calls in code cells using pattern matching, no external highlighting library is loaded.' },
    { q: 'Can I get a standalone HTML file out of this, not just a preview?', a: 'Yes, Copy HTML on the HTML tab copies a complete self-contained HTML document with inline CSS for every cell type, ready to save and open on its own.' },
  ],
  'number-to-words': [
    { q: "What's the largest number it can spell out?", a: 'Up to 1 quadrillion, 1,000,000,000,000,000, anything larger returns a "Number too large" message instead of a result.' },
    { q: 'Does it handle decimals?', a: 'Yes, the whole-number part is spelled out normally, then "point" is added followed by each digit after the decimal spoken individually, so 12.5 becomes "Twelve point five".' },
    { q: 'What happens with negative numbers?', a: '"Minus" is prepended to the spelled-out value of the absolute number, so -42 becomes "Minus forty-two".' },
  ],
  'octal-to-decimal': [
    { q: 'Can I type octal numbers with a "0o" prefix?', a: 'Yes, an optional leading "0o" is stripped automatically before conversion, so both "77" and "0o77" are accepted.' },
    { q: 'What other bases does it show besides decimal?', a: 'Binary and hexadecimal are calculated and displayed alongside the decimal result, each with its own copy button.' },
    { q: 'What happens if I type an invalid octal digit like 8 or 9?', a: 'An "Invalid octal" message appears below the input, since only digits 0 through 7 plus an optional 0o prefix are accepted.' },
  ],
  'open-graph-generator': [
    { q: 'Do I have to fill in every field before tags are generated?', a: 'No, only the fields you fill in get their own meta tag, empty fields are simply skipped, and og:type is always added automatically as "website".' },
    { q: 'Can I see what the image will look like before copying the tags?', a: 'Yes, entering an Image URL shows a live image preview below the generated tags, so you can confirm it loads correctly before publishing.' },
    { q: 'How do I get the generated tags into my page?', a: 'The Copy button next to Generated Tags copies the full block of meta tags to your clipboard, ready to paste into your page\'s head section.' },
  ],
  'open-graph-preview': [
    { q: "Does typing in my URL automatically pull in my page's title, description, and image?", a: 'No, you enter the title, description, image URL, and site name yourself in the form fields, then the preview panel updates live for whichever platform tab is selected, there is no automatic fetch of your page\'s existing meta tags.' },
    { q: 'Which platforms can I preview the share card for?', a: "Four tabs let you switch between Twitter, Facebook, LinkedIn, and Slack, each rendered with that platform's own card layout and colors so you can compare how the same title and image look across all of them." },
    { q: 'What happens if my image URL fails to load?', a: 'The broken image is hidden automatically in the preview and the card falls back to its "No Image" placeholder, so a bad link is obvious before you publish.' },
  ],
  'oxford-comma': [
    { q: 'How does it decide whether to add a comma before "and"?', a: 'With three or more items, everything except the last is joined with commas, then a comma is inserted before the word "and" ahead of the final item, following the standard serial comma rule.' },
    { q: 'What if I only have two items in my list?', a: 'No comma is added, the two items are simply joined with "and", since the Oxford comma rule only applies once there are three or more items.' },
    { q: 'Can I switch between comma-separated and one-item-per-line input?', a: 'Yes, radio buttons above the input toggle the separator, so pasting a comma-separated list or a newline-separated list both parse correctly into the item list.' },
  ],
  'palindrome-checker': [
    { q: 'Does it ignore spaces and punctuation when checking?', a: 'Yes, the text is lowercased and stripped of everything except letters and numbers before comparing it to its reverse, so phrases like "A man a plan a canal Panama" are correctly detected.' },
    { q: 'Can I check numbers as well as words?', a: 'Yes, since the cleaning step keeps digits along with letters, entering a number like "12321" is checked the same way as any word or phrase.' },
    { q: 'What does the result actually show me besides yes or no?', a: 'It displays the cleaned version of your text next to its reversed form side by side, so you can see exactly what was compared.' },
  ],
  'paragraph-counter': [
    { q: 'How does it decide where one paragraph ends and another begins?', a: 'A paragraph break is any blank line, meaning two or more consecutive line breaks, so single line breaks within a block of text are counted as the same paragraph.' },
    { q: 'Does the average words per paragraph update as I type?', a: 'Yes, every statistic in the grid, including average words per sentence and per paragraph, recalculates live on each keystroke without needing a button click.' },
    { q: 'What counts as a "sentence" for the sentence total?', a: 'Any run of text ending in a period, question mark, or exclamation point counts as one sentence, so the count updates based on that punctuation rather than a fixed word length.' },
  ],
  'paragraph-lorem-ipsum': [
    { q: 'Can I generate lorem ipsum by word count instead of full paragraphs?', a: 'Yes, a unit toggle switches generation between words, sentences, and paragraphs, and the number field next to it controls exactly how many of that unit to produce.' },
    { q: 'Does it always start with the classic "Lorem ipsum dolor sit amet"?', a: 'Only if the "Start with Lorem ipsum..." checkbox is checked, unchecking it still generates text from the same Latin word pool but starting partway through instead of at the beginning.' },
    { q: 'Is the placeholder text regenerated automatically when I change the count?', a: 'Yes, changing the unit or the count number regenerates the output immediately, there is also a Regenerate button if you want a fresh variation using the same settings.' },
  ],
  'paraphrasing': [
    { q: 'Does this use AI to rewrite my text?', a: 'No, it works from a built-in dictionary of roughly eighty common words mapped to five synonym options each, click Find Alternatives and any matching words in your text get highlighted for you to swap manually.' },
    { q: "How do I actually change a word once it's highlighted?", a: 'Click the highlighted word to select it, then a row of its synonym options appears below, click whichever synonym you want and it becomes the pending replacement for that word.' },
    { q: 'Do my edits apply automatically as I select synonyms?', a: 'No, selecting synonyms only stages the replacements, nothing in the text changes until you click Apply Changes, which swaps every selected word at once.' },
  ],
  'password-strength-checker': [
    { q: 'How is the entropy number calculated?', a: "It multiplies your password's length by the log2 of the character pool size implied by what you used, lowercase, uppercase, digits, symbols, or other characters, so a longer password drawing from more character types scores higher entropy." },
    { q: 'What does the crack time estimate assume about the attacker?', a: 'It assumes ten billion guesses per second, then divides two to the power of your entropy by that rate, ranging from instant for weak passwords up to figures like "3.2 billion years" for very strong ones.' },
    { q: 'Is my password sent anywhere to be checked?', a: 'No, every calculation, the entropy, crack time, and suggestions, runs in your browser using the characters you typed, the Show/Hide toggle only affects the input field\'s own masking.' },
  ],
  'percentage-change-calc': [
    { q: 'How does it show whether the change was an increase or a decrease?', a: 'The Difference and % Change figures switch between a "+" prefix and no sign automatically based on your Old and New values, so a lower New Value produces negative numbers indicating a decrease, and a higher one produces positive numbers indicating an increase.' },
    { q: 'Which tab of the calculator do I use for this?', a: 'Select the "Change" tab at the top, since the same calculator also has separate Basic % and Tip tabs for different kinds of percentage math.' },
    { q: 'What happens if I enter the same value for Old and New?', a: 'The Difference shows 0 and the % Change shows 0.00%, since there was no change between the two values.' },
  ],
  'percentage-difference': [
    { q: 'How is this different from calculating percentage change?', a: 'Percentage difference compares two values against their average rather than treating one as a fixed starting point, so the two directions of comparison give the same percentage magnitude either way, unlike a change calculation where the order of old versus new value matters.' },
    { q: 'What does the direction field actually tell me?', a: 'It shows an up arrow and "increase" when Value 2 is larger than Value 1, a down arrow and "decrease" when it is smaller, or "no change" when they are equal.' },
    { q: 'Does it show the raw difference as well as the percentage?', a: 'Yes, the Difference row shows the plain numeric gap between your two values to four decimal places, alongside the Percentage row showing that gap expressed as a percentage of their average.' },
  ],
  'plain-text-counter': [
    { q: 'How does this differ from just counting words?', a: 'Alongside word and character counts, it also breaks out characters with spaces stripped out, sentence count based on punctuation, paragraph count based on blank lines, and a separate line count based on raw line breaks.' },
    { q: 'Do the statistics update as I type, or do I need to click something?', a: 'Click Count to run the analysis, the six-stat grid then appears below, it is not a live-updating counter tied to every keystroke.' },
    { q: 'What exactly counts as a "line" versus a "paragraph" here?', a: 'A line is any text between two line breaks, however short, while a paragraph requires a full blank line, meaning two consecutive line breaks, to separate it from the next block of text.' },
  ],
  'png-to-jpg': [
    { q: 'Does it keep transparency when converting to JPEG?', a: 'No, JPEG has no alpha channel, so any transparent areas in your PNG get flattened onto whatever color the canvas renders behind them once the image is drawn and re-encoded as JPEG.' },
    { q: 'Can I control how much the file shrinks?', a: 'Yes, a quality slider from 1 to 100 sets the JPEG compression level, the Before and After panels show both file sizes plus a percentage smaller or larger so you can judge the tradeoff before downloading.' },
    { q: 'Does my image get uploaded to a server to be converted?', a: 'No, the file is drawn onto a hidden canvas in your browser and re-encoded to JPEG locally using the Canvas API, nothing is sent anywhere.' },
  ],
  'png-to-webp': [
    { q: 'How much smaller does WebP actually end up compared to my PNG?', a: 'It varies by image, the After panel shows the converted file size next to a note like "42% smaller" or "smaller/larger", calculated directly by comparing the two file sizes after conversion.' },
    { q: 'Is transparency preserved when converting to WebP?', a: 'Yes, unlike a JPEG conversion, WebP supports an alpha channel, so transparent areas in your source PNG stay transparent in the converted file.' },
    { q: 'Can I fine-tune the compression instead of using a fixed setting?', a: 'Yes, a 1 to 100 quality slider controls the WebP encoding, and you can re-run the conversion at a different quality and compare the resulting file size before deciding which to download.' },
  ],
  'punctuation-fixer': [
    { q: 'What does the Smart Quotes option actually change?', a: 'It converts straight double and single quote characters into their curly Unicode equivalents, so plain " and \' marks come out looking like typeset quotation marks instead of typewriter-style straight ones.' },
    { q: 'What spacing problems does it clean up?', a: 'It removes any space sitting between a word and the punctuation mark right after it, like "word ." becoming "word.", and it collapses runs of multiple spaces anywhere in the text down to single spaces.' },
    { q: 'Can I convert curly quotes back to straight ones?', a: 'Yes, switching to the Straight Quotes option runs the reverse replacement, turning curly double and single quote characters back into plain " and \' marks.' },
  ],
  'port-scanner-full': [
    { q: 'How does scanning work if browsers cannot open raw TCP connections?', a: "Each port check is sent to this site's own backend endpoint, which attempts the connection on your behalf and reports back whether it was open, closed, or timed out, rather than your browser connecting to the target directly." },
    { q: 'Why might a port show as "filtered" instead of open or closed?', a: 'A port is marked filtered when the check to it errors out or does not respond within the one second timeout, which usually means a firewall is silently dropping the connection attempt rather than actively refusing it.' },
    { q: 'Can I watch the scan happen, or do I just get a final list?', a: 'A progress bar tracks completion percentage as batches finish, and the results table fills in and re-sorts by port number after every batch of 50, plus a live count of open, closed, and filtered ports updates above the table.' },
  ],
  'random-fraction-generator': [
    { q: 'How are the fractions simplified?', a: 'A Euclidean GCD calculation reduces each numerator and denominator down to lowest terms before displaying it, so 24/36 shows up as 2/3.' },
    { q: 'What range do the numerator and denominator come from?', a: 'Both are random whole numbers between 1 and 99, generated independently before simplification.' },
    { q: 'Does it show the decimal value too?', a: 'Yes, each fraction is listed alongside its decimal equivalent, rounded to 6 places with trailing zeros trimmed off.' },
  ],
  'random-ip-address': [
    { q: 'Does it generate both IPv4 and IPv6 addresses?', a: 'Yes, a toggle switches between IPv4 (four dot-separated octets) and IPv6 (eight colon-separated hex groups) generation modes.' },
    { q: 'Does the IPv6 output ever use the :: shorthand?', a: 'Sometimes, when a pair of consecutive all-zero hex groups happens to land in the random address, the generator collapses them into the standard :: notation instead of printing 0000:0000.' },
    { q: 'How many addresses can I generate at once?', a: 'Up to 100 per click, listed together with a Copy All button.' },
  ],
  'random-number-generator': [
    { q: 'What happens if I ask for more unique numbers than fit in my range?', a: 'With "Unique numbers only" checked, requesting more values than the min-max range can hold shows the message "Cannot generate more unique numbers than range allows" instead of returning duplicates.' },
    { q: 'How many numbers can I generate in one batch?', a: 'Up to 1000 numbers per click, displayed as a single comma-separated line with a Copy button.' },
    { q: 'Can the same number repeat in the results?', a: 'Only if "Unique numbers only" is left unchecked, otherwise every number in that batch is guaranteed distinct.' },
  ],
  'random-password-generator': [
    { q: 'How is password randomness generated?', a: "It uses the browser's crypto.getRandomValues (Web Crypto API) rather than Math.random, filling a Uint32Array and mapping each value into your selected character pool." },
    { q: 'What does the strength meter measure?', a: 'It calculates entropy as password length times log2 of your selected character pool size, then labels the result Weak, Fair, Strong, or Very strong based on set entropy thresholds.' },
    { q: 'What does the "No look-alikes" option do?', a: 'Enabling it strips visually ambiguous characters, O, 0, I, l, 1, the backtick, and quote marks, out of the character pool before generating.' },
  ],
  'random-sentence-generator': [
    { q: 'How are the sentences built?', a: 'Each one is assembled by randomly picking one of three grammatical patterns and filling it with words pulled from subject, verb, object, and adverb word banks, so results are template based rather than drawn from real text.' },
    { q: 'How many sentences can I generate at once?', a: 'Up to 50 per click, each shown on its own line with a Copy All button that joins them into one block of text.' },
    { q: 'Will the same sentence repeat in a batch?', a: 'It can, since each sentence is chosen independently from the same small set of patterns and words with no duplicate checking across a batch.' },
  ],
  'random-string-generator': [
    { q: 'What preset shortcuts are available?', a: 'Four one-click presets: UUID-shaped (36 characters, hex charset, dash-grouped), API Key (32-character alphanumeric), Token (64-character alphanumeric), and Salt (32-character full ASCII).' },
    { q: 'What character sets can I choose from?', a: 'Seven options: full alphanumeric, alphanumeric without ambiguous characters (no 0, O, l, 1), uppercase only, lowercase only, numbers only, hexadecimal, and full ASCII with punctuation.' },
    { q: 'How long can a generated string be?', a: 'Anywhere from 1 to 1024 characters per string, with up to 100 strings generated in one batch.' },
  ],
  'random-uuid-v7': [
    { q: 'Does the timestamp portion reflect the actual generation time?', a: 'Yes, the first 48 bits encode the current Unix timestamp in milliseconds at the moment you click Generate, which is what makes UUIDv7 values sortable by creation order.' },
    { q: 'Can I format the output with uppercase letters or curly braces?', a: 'Yes, separate toggles switch the hex characters to uppercase and wrap each UUID in {} braces.' },
    { q: 'How many UUIDs can I generate at once?', a: 'Up to 100 per click, each listed with a line number and a Copy All button.' },
  ],
  'read-time-calculator': [
    { q: 'How is the reading speed customized?', a: 'A slider sets an assumed reading speed anywhere from 100 to 500 words per minute in steps of 10, and the time estimate recalculates immediately.' },
    { q: 'What counts does it show besides the time estimate?', a: 'Word count, character count excluding whitespace, sentence count based on ., !, and ? marks, and paragraph count based on blank-line breaks all appear alongside the time.' },
    { q: 'What do the "Quick read" and "Long read" labels mean?', a: 'Results under 1 minute are labeled Quick read, under 3 minutes Short read, under 7 minutes Medium read, and anything longer Long read.' },
  ],
  'readability-score': [
    { q: 'How does it estimate syllable count for the readability formulas?', a: 'It approximates syllables by counting vowel letters (a, e, i, o, u) in the text rather than performing true syllable segmentation, a fast approximation used in both the Flesch Reading Ease and Flesch-Kincaid Grade calculations.' },
    { q: 'What scores does it calculate?', a: 'Three: Flesch Reading Ease on a 0 to 100 scale labeled Easy, Moderate, or Difficult, the Flesch-Kincaid Grade Level, and the SMOG Index, each shown with a grade-level interpretation.' },
    { q: 'What other stats besides the readability scores does it show?', a: 'Word count, sentence count, average word length, and average sentence length, all calculated the moment you type at least one word.' },
  ],
  'reading-time-calculator': [
    { q: 'What format does the time show for very short text?', a: 'Text estimated at under a minute displays as just a seconds value like "38s", switching to the combined "Xm Ys" format only once the estimate reaches a full minute.' },
    { q: 'How does it treat multiple punctuation marks in a row, like "?!" or "..."?', a: 'A run of consecutive ., !, or ? characters counts as a single sentence ending rather than one per character, so "Wait..." only adds one to the sentence count.' },
    { q: 'Do I need at least two blank lines to start a new paragraph?', a: 'Yes, the text is split wherever two or more consecutive line breaks appear, a single line break within a block is treated as part of the same paragraph.' },
  ],
  'reading-time-estimator': [
    { q: 'What reading speed does it assume before I touch the slider?', a: 'It starts at 200 words per minute, before you drag the slider anywhere from 100 to 500 to match your own pace.' },
    { q: 'Do I need to click a button to see the estimate?', a: 'No, the word count, stats, and time estimate all update automatically as you type or paste text, there is no separate calculate button.' },
    { q: 'What shows before I enter any text?', a: 'A placeholder message reading "Enter text to calculate reading time" appears in the output area until you type or paste something.' },
  ],
  'regex-match-tester': [
    { q: 'What flags can I toggle on the pattern?', a: 'Six standard JavaScript regex flags as buttons: g (global), i (ignore case), m (multiline), s (dotall), u (unicode), and y (sticky), each toggled independently.' },
    { q: 'Does it show capture groups for each match?', a: 'Yes, both numbered groups (labeled $1, $2, and so on) and any named groups from your pattern are listed underneath each match, with unmatched optional groups shown as an empty-set symbol.' },
    { q: 'What happens if my pattern matches a huge number of times?', a: 'The match list displays up to the first 100 matches and then shows a note like "...and 12 more" instead of rendering every single one, keeping the page responsive.' },
  ],
  'regex-match-visualizer': [
    { q: 'How does it show which regex tokens I am using?', a: 'Below the pattern field it lists tags for any of ten common tokens found in your pattern, like \\d, \\s, ^, or |, and hovering each tag reveals a plain-language description such as "Digit" or "Start".' },
    { q: 'How do I set flags like case-insensitive matching?', a: 'Flags are typed directly into a small text field next to the pattern input, defaulting to "g", rather than picked from a list of toggle buttons.' },
    { q: 'What happens if my pattern is invalid?', a: "An error message with the JavaScript engine's own error text appears below the pattern field instead of a match count." },
  ],
  'remove-bg': [
    { q: 'How does it decide what counts as "background"?', a: 'It samples the pixel color at all four corners of the image, averages them into one reference color, then makes any pixel within a set distance of that color transparent.' },
    { q: 'Will it work well on any background?', a: 'It works best on solid, uniform-colored backgrounds since transparency is based on color similarity to the corners rather than subject detection, so busy or gradient backgrounds may not clear out completely.' },
    { q: 'What file format does the result download as?', a: 'A PNG with the removed area set to fully transparent, previewed over a checkerboard pattern before you click Download PNG.' },
  ],
  'resize': [
    { q: 'What size presets are built in?', a: 'Eight common targets: HD and 720p (1280x720), Full HD and 1080p (1920x1080), Square (1080x1080), Portrait (1080x1920), Thumbnail (300x300), and 480p (854x480), plus custom width and height fields.' },
    { q: 'Does resizing crop my image or fit the whole thing in?', a: 'It fits the whole image inside the target dimensions without cropping, scaling proportionally and filling any leftover space with a white background rather than cutting off part of the picture.' },
    { q: 'Can I resize more than one image at once?', a: 'Yes, drag and drop or select multiple files, and a Download All button saves every resized image once processing finishes.' },
  ],
  'rgba-to-hsl': [
    { q: 'How do I set the RGBA values?', a: 'Four sliders, Red, Green, and Blue each range 0 to 255 and Alpha ranges 0 to 1 in steps of 0.01, with the preview and converted values updating on every drag.' },
    { q: 'What formats can I copy besides HSL?', a: "Three copy buttons sit under the preview, one for the HEX code, one for the HSL string, and one for the RGBA string exactly as you set it, so you're not limited to HSL alone." },
    { q: 'Does the alpha value carry over into the copied output?', a: 'Yes, the RGBA copy button includes your alpha setting, and the live preview swatch renders the actual translucent color using that same alpha value.' },
  ],
  'roman-numeral-converter': [
    { q: "What's the valid number range?", a: 'From 1 through 3999, the largest value classical Roman numerals can represent, anything outside that range returns "Invalid (1-3999)" instead of a numeral.' },
    { q: 'Do I need to press a button to convert?', a: 'No, both directions update live: typing a number instantly shows its Roman numeral, and typing a Roman numeral instantly shows its number, no calculate button required.' },
    { q: 'Does it accept lowercase Roman numerals?', a: 'Whatever you type in the Roman numeral field is automatically uppercased as you type, so "mmxxiv" converts the same as "MMXXIV".' },
  ],
  'rot13-express': [
    { q: 'Why is there both an Encode and Decode mode if ROT13 is symmetric?', a: "Mathematically running ROT13 twice returns the original text either way, but the two mode buttons are kept separate so decode mode explicitly reverses whatever you last encoded, matching how people expect an encoder/decoder pair to work." },
    { q: 'Does it update as I type, or do I need to click a button?', a: "The output recalculates on every keystroke, there's no separate Convert button, and a short explanation of how ROT13 works appears underneath the result." },
    { q: 'What happens to numbers and punctuation?', a: 'Only the 26 letters, upper and lower case, get shifted, digits, spaces, and punctuation pass through unchanged.' },
  ],
  'robots-txt-analyzer': [
    { q: "Does it flag directives it doesn't recognize?", a: 'Yes, running Validate checks every line against the known directive set (User-agent, Allow, Disallow, Sitemap, Crawl-delay, Clean-param) and reports "Unknown directive" by line number for anything else.' },
    { q: 'How does it check Sitemap lines?', a: 'It confirms the value after Sitemap: starts with http, flagging it as an error if you paste a relative path instead of a full URL.' },
    { q: 'What does the rule breakdown look like?', a: 'Below the editor, every Allow and Disallow line is listed with its user agent and path, color coded green for allowed and red for disallowed, so crawler directives and blocked paths are easy to scan.' },
  ],
  'robots-txt-checker': [
    { q: 'What counts as a blocked path?', a: 'Every Disallow rule you\'ve written is parsed and listed in the Preview/Rules panel with a red DISALLOW badge next to the user agent and path it applies to, so you can see at a glance what\'s off limits.' },
    { q: 'What kind of validation does it run?', a: 'Clicking Validate checks for missing values after User-agent, Allow, or Disallow, flags the deprecated bare wildcard *, and flags any directive it doesn\'t recognize, listing each problem by line number.' },
    { q: 'Does it group rules by user agent?', a: "Yes, the parsed rule list tags each Allow or Disallow entry with the User-agent block it belongs to, so rules for Googlebot and rules for * don't get mixed together." },
  ],
  'robots-txt-generator': [
    { q: 'What crawler-specific controls does it offer?', a: 'A per-bot Crawl-delay setting, pick a bot like Googlebot, Bingbot, or Yandex from a dropdown and assign it a delay in seconds, alongside a one-click list of common paths like /wp-admin/ and /checkout/ to disallow.' },
    { q: 'Can I add multiple sitemaps?', a: 'Yes, an Add button under Sitemap URLs lets you list as many sitemap locations as you need, each one gets its own Sitemap: line in the generated output.' },
    { q: 'Does the generated file include a timestamp?', a: 'If you fill in the Site URL field, the output starts with a comment line showing that URL and the exact generation timestamp, both omitted if you leave Site URL blank.' },
  ],
  'robots-txt-validator': [
    { q: 'What specific errors does it catch?', a: 'Missing values after User-agent, Allow, or Disallow, the deprecated bare wildcard * used as a path, non-absolute Sitemap URLs, and any directive outside the recognized set, each reported with its line number.' },
    { q: 'Does it edit in place or just report errors?', a: 'Both, the same textarea you type or paste your robots.txt into is what gets validated, so you can fix a flagged line and re-run Validate immediately.' },
    { q: 'What happens if there are no errors?', a: "The Validation Errors panel simply doesn't appear, and the Preview/Rules panel below shows your parsed Allow and Disallow rules as confirmation the file was read correctly." },
  ],
  'rot47-cipher': [
    { q: 'How is ROT47 different from ROT13?', a: 'ROT47 shifts across the full 94 printable ASCII characters from ! through ~, not just the 26 letters, so it also scrambles digits, punctuation, and symbols, while ROT13 only rotates letters.' },
    { q: 'Do Encode and Decode do different things?', a: "Encode shifts each character 47 positions forward through the 94-character set and Decode shifts it 47 positions back, both wrapping around the same range, so they're inverse operations rather than identical buttons." },
    { q: 'What characters are left untouched?', a: 'Anything outside the ! through ~ printable ASCII range, including a plain space character, passes through unshifted.' },
  ],
  'rotate': [
    { q: 'What rotation angles does it support?', a: 'Three fixed presets, 90, 180, and 270 degrees, selected as buttons.' },
    { q: 'How is the rotated image produced?', a: "The image is drawn onto a hidden canvas element and rotated with canvas transform math, and the canvas dimensions swap width and height automatically for 90 and 270 degree turns so the output isn't cropped." },
    { q: 'What format does the download use?', a: 'A PNG file named "rotated-image.png", generated straight from the canvas after you click one of the rotation buttons.' },
  ],
  'screen-resolution-tester': [
    { q: 'How many device presets are included?', a: 'Thirteen, spanning phones like iPhone SE and Pixel 8, tablets like iPad Mini and iPad Pro, laptops, and fixed resolutions up to 4K UHD, each showing its exact pixel dimensions on the button.' },
    { q: 'What stats does it calculate besides the resolution?', a: 'Aspect ratio to three decimal places, total pixel count (shown in megapixels once it passes one million), and a scaled-down preview rendered at 30% size so large resolutions still fit on screen.' },
    { q: 'Can I actually open a window at that resolution?', a: 'Yes, an "Open in New Window" link launches a blank browser window sized to your exact width and height, letting you test the real viewport rather than just the scaled preview.' },
  ],
  'security-headers-generator': [
    { q: 'What output formats does it generate besides raw headers?', a: 'Four: a plain header list, an Nginx server block using add_header, an Apache .htaccess block using mod_headers, and a Next.js next.config.js headers() snippet, each with its own Copy button.' },
    { q: 'What do the built-in presets configure?', a: 'Basic Security enables X-Frame-Options, X-Content-Type-Options, X-XSS-Protection, and Referrer-Policy, Strict CSP adds a strict-dynamic Content-Security-Policy and HSTS, HSTS Preload sets a two-year max-age with the preload flag, and Full Protection turns on all eleven available headers at once.' },
    { q: "Can I add headers that aren't in the preset list?", a: 'Yes, a Custom Headers section lets you type any header name and value and add it to the generated output alongside the toggled presets.' },
  ],
  'semver-checker': [
    { q: 'What counts as a valid version string?', a: 'Standard semver format, major.minor.patch, with optional pre-release and build metadata suffixes like 1.2.3-beta.1+20130313, checked against a regex before any comparison runs.' },
    { q: 'How does it decide which version is greater?', a: 'It compares major, then minor, then patch numerically, and only if all three match does it fall back to comparing pre-release labels, where a version without a pre-release tag beats one that has one.' },
    { q: 'What happens if I enter an invalid version?', a: 'The result shows "Invalid" with the reason "Both must be valid semver (e.g. 1.2.3)" instead of a comparison, so malformed input is caught before it produces a misleading answer.' },
  ],
  'sentence-lorem-ipsum': [
    { q: 'How does it decide what one "sentence" is?', a: 'When Sentences is selected, it pulls 10 words per sentence from the standard Lorem Ipsum passage and splits that chunk on sentence-ending punctuation, so each generated sentence is a consistent word count rather than a copy of one fixed line.' },
    { q: 'Can I generate words or paragraphs instead of just sentences?', a: 'Yes, a mode toggle switches the same generator between Words, Sentences, and Paragraphs, with the count field controlling how many of whichever unit you pick.' },
    { q: 'Do I have to start every result with "Lorem ipsum..."?', a: 'No, an unchecked "Start with Lorem ipsum..." box lets the output begin partway through the passage instead of always opening with the classic first words.' },
  ],
  'sentence-rewriter': [
    { q: 'Does it use AI to rewrite sentences?', a: 'No, it runs a fixed set of phrase-substitution and pattern-matching rules, swapping known filler phrases, common passive-voice patterns, and leading adverbs, rather than generating new phrasing with a language model.' },
    { q: 'What happens if I paste more than one sentence?', a: "It combines the first two sentences into one before rewriting, and if there's a recognizable conjunction like \"and\" or \"because\" in the result, adds a Split option that breaks it back into shorter pieces." },
    { q: 'How do I pick between the different rewrite options?', a: 'Each option appears as its own button labeled with its type, Simplified, Expanded, Active Voice, and so on, clicking one sets it as the Selected Result with its own Copy to Clipboard button.' },
  ],
  'sentence-counter': [
    { q: 'What counts as a "sentence" for the sentence total?', a: 'Your text is split on periods, question marks, and exclamation points, and any resulting chunk that still has non-whitespace content after trimming counts as one sentence.' },
    { q: 'Does it update as I type, or do I need to click a button?', a: 'It recalculates live on every keystroke, sentences, words, characters, paragraphs, and unique words all update together with no separate count button.' },
    { q: 'What does the unique word count measure?', a: "It's a distinct count of the words in your text, so if you use the same word five times it only adds one to that total, separate from the plain word count above it." },
  ],
  'seo-meta-tag-analyzer': [
    { q: 'How does it read another site\'s meta tags?', a: "You enter a URL and it fetches that page's raw HTML through a CORS proxy (api.allorigins.win), then extracts the title, description, keywords, Open Graph tags, Twitter Card tags, canonical link, robots directive, and author tag with regex." },
    { q: 'How is the SEO score calculated?', a: 'Out of 100 points: 20 each for the title and meta description, 15 each for og:title and og:description, 10 each for og:image and twitter:card, and 5 each for keywords and a canonical URL, with every missing piece listed as an issue underneath.' },
    { q: 'What happens if the page blocks the request?', a: 'You get a message saying the site could not be fetched because it may block cross-origin requests or be unreachable, instead of a partial or broken result.' },
  ],
  'serp-simulator': [
    { q: 'How does the title limit change between desktop and mobile?', a: 'Desktop truncates the title at 60 characters and mobile at 55, both cutting at the last full word rather than mid-word, with an ellipsis added when the text runs long.' },
    { q: 'What happens if my description is too long?', a: "Anything past 160 characters gets truncated the same word-safe way as the title, so you can see exactly where Google would cut off your description before you publish it." },
    { q: 'Where does the breadcrumb line under the site name come from?', a: "It's built directly from the URL you type in, the hostname plus each path segment joined with '›', so /blog/post-name shows as example.com › blog › post-name." },
  ],
  'serp-snippet-preview': [
    { q: 'What three fields can I edit in the preview?', a: 'Page title, page URL, and meta description, each with a live character counter (60 for title, 160 for description) that turns red once you go over the limit.' },
    { q: 'Does it try to load my actual site favicon?', a: "Yes, it builds a favicon.ico URL from the hostname you enter and attempts to load it next to the site name, falling back to a plain dot icon if the image fails to load." },
    { q: 'Can I compare the desktop and mobile snippet side by side?', a: 'Not side by side, but a Desktop/Mobile toggle switches the same preview card between the two title-length limits so you can check both without retyping anything.' },
  ],
  'sha1-hash-generator': [
    { q: 'Do I need to click a button, or does it hash as I type?', a: 'You click Generate Hash after typing, it does not hash on every keystroke, the result then appears below with its own Copy button.' },
    { q: 'Can I switch algorithms without retyping my text?', a: 'Yes, MD5, SHA-1, and SHA-256 are separate buttons above the input, picking a different one and clicking Generate Hash re-hashes the same text you already typed.' },
    { q: 'Does it accept file uploads?', a: "No, there's only a text box, to hash a file's contents you'd need to paste that content in as text rather than upload the file directly." },
  ],
  'sha256-hash-generator': [
    { q: 'How is the SHA-256 button different from MD5 or SHA-1 here?', a: 'All three share the same input box and Generate Hash button, picking SHA-256 runs your text through the browser\'s built-in crypto.subtle.digest instead of the hand-rolled MD5 routine or the SHA-1 digest.' },
    { q: 'Is there an uppercase option for the output?', a: 'Yes, an UPPER toggle next to the algorithm buttons switches the hex output between lowercase and uppercase without re-hashing.' },
    { q: 'Does it accept file uploads?', a: "No, only pasted or typed text goes into the hash, there's no file picker on this tool." },
  ],
  'sha-256-hash': [
    { q: 'Does it hash automatically as I type?', a: 'Yes, there is no Generate button, the SHA-256 result updates live on every keystroke using the browser\'s crypto.subtle.digest.' },
    { q: 'What do the numbers above the result mean?', a: 'A small counter shows your input\'s character count and its byte count side by side, useful since multi-byte characters make those two numbers diverge.' },
    { q: 'Is my text sent to a server to compute the hash?', a: 'No, the hash is computed entirely in your browser using the Web Crypto API, nothing you type leaves your device.' },
  ],
  'sharpen': [
    { q: 'What does the Intensity slider actually change?', a: 'It scales a 3x3 sharpen convolution kernel from 0.1x to 3x strength, higher values push the edge-contrast effect further before the result is clamped back into the 0-255 color range.' },
    { q: 'How is the sharpening applied to my photo?', a: 'The image is drawn to a hidden canvas, then every pixel is recalculated from its 8 neighbors using a fixed edge-enhancing kernel, and the result replaces the original pixel data before being redrawn.' },
    { q: 'What format is the downloaded file?', a: 'A PNG named "sharpened-image.png", exported straight from the canvas after you click Apply Sharpen.' },
  ],
  'sitemap-analyzer': [
    { q: 'Do I paste the sitemap or point it at a URL?', a: 'You paste the raw XML directly into the text box, there\'s no fetch-by-URL option, a "Load Sample" button fills in a working three-URL example if you want to see the format first.' },
    { q: 'What specific problems does it flag?', a: 'A missing <?xml version="1.0"?> declaration, a missing <urlset> root element, a missing xmlns namespace, any <url> block without a <loc>, and any <loc> value that doesn\'t start with http:// or https://.' },
    { q: 'Does it handle a sitemap index file, not just a regular sitemap?', a: 'Yes, if it detects a <sitemapindex> tag it switches to counting and listing the child sitemap URLs instead of page URLs.' },
  ],
  'sla-uptime-calculator': [
    { q: 'What SLA range can I enter?', a: 'A slider and a linked number input both range from 90% to 99.999% in steps of 0.001%, so you can dial in figures like the common 99.9% or 99.95% precisely.' },
    { q: 'Does it only show downtime for one time period at a time?', a: "No, a grid shows allowed downtime for year, month, week, day, and hour all at once, with whichever period you've selected highlighted and given an exact minutes figure underneath." },
    { q: 'How precise is the downtime figure?', a: 'The highlighted period shows allowed downtime to 4 decimal places in minutes, while the grid cells switch to a rounded minutes or hours display depending on which is more readable for that period.' },
  ],
  'speech-to-text': [
    { q: 'Does it need a specific browser to work?', a: "It uses the browser's built-in Web Speech API, which Chrome, Edge, and Safari support, if your browser lacks it you'll see an unsupported message instead of the microphone controls." },
    { q: 'What happens to words while I\'m still mid-sentence?', a: "Interim results appear in square brackets at the end of the transcript and get replaced with plain finalized text once the recognition engine settles on that phrase." },
    { q: 'Can I use it without a microphone?', a: 'Yes, a manual paste area below the microphone controls lets you type or paste a transcript directly and click "Use This Text" instead of recording anything.' },
  ],
  'sql-formatter': [
    { q: 'What does the UPPERCASE keywords toggle do?', a: 'When checked, every recognized SQL keyword in your query, SELECT, FROM, JOIN, GROUP BY, and around 70 others, gets forced to uppercase in the formatted output, unchecking it leaves your original casing untouched.' },
    { q: 'How does the indent size setting work?', a: 'A dropdown lets you choose 2 or 4 spaces, that value controls how far each nested clause like AND, OR, JOIN, or ON is indented under the SELECT or FROM line above it.' },
    { q: 'Does the syntax highlighting distinguish more than just keywords?', a: 'Yes, keywords appear in blue, functions like COUNT and SUBSTRING in purple, quoted string literals in green, and numbers in orange, all shown live with a color key underneath the formatted output.' },
  ],
  'ssl-certificate-checker': [
    { q: 'What information does the certificate check show?', a: "Whether the certificate is valid, its issuer, the expiration date, and the days remaining, with the days-remaining figure colored red under 30 days, orange under 90 days, and green beyond that." },
    { q: 'Can I check a certificate without clicking the Check button?', a: 'Yes, pressing Enter while the domain field is focused runs the same check as clicking the Check button next to it.' },
    { q: "What happens if the check can't complete?", a: "You'll see a message explaining the SSL check could not be completed and that the tool depends on a backend API, rather than a blank or broken result." },
  ],
  'sticky-notes': [
    { q: 'Do my notes get saved if I close the tab?', a: "Yes, every note is saved to your browser's localStorage as soon as it changes, reopening the page restores the same notes with their text, color, and position intact." },
    { q: 'Where does a new note appear on the screen?', a: "It's placed at a random position within your current window and given one of six random pastel colors, then opens straight into edit mode so you can start typing immediately." },
    { q: 'Can I drag a note to reposition it?', a: "No, each note keeps the random position it was given when created, you can still edit or delete it in place, but there's no drag-to-move interaction." },
  ],
  'syllable-counter': [
    { q: 'How does it decide how many syllables a word has?', a: 'It counts groups of vowels (a, e, i, o, u, y) in the word, strips a trailing silent e first, then adjusts the count up or down for common endings like "-le", "-ie", and past-tense "-ed" or "-es" suffixes.' },
    { q: "What's shown besides the total syllable count?", a: 'A word-by-word breakdown tagging each word with its own syllable count, plus a distribution section that groups words together by how many syllables they have.' },
    { q: 'Can I try it without typing anything myself?', a: 'Yes, six example words like "beautiful" and "extraordinary" sit below the input as clickable buttons that add themselves to your text with their expected count shown right on the button.' },
  ],
  'syllable-word-counter': [
    { q: "Does it treat numbers or punctuation as part of a word's syllable count?", a: "No, before counting it strips out everything except letters, so numbers, hyphens, and punctuation in your text are ignored and don't affect any word's syllable total." },
    { q: 'How is the total syllable count calculated for a whole passage?', a: 'It splits your text on whitespace into individual words, runs the same vowel-group heuristic on each one, then adds every word\'s count together for the total shown above the breakdown.' },
    { q: 'Is there a minimum word length before it starts counting vowel groups?', a: 'Words of three letters or fewer are automatically counted as one syllable, the vowel-group logic only kicks in for words longer than that.' },
  ],
  'temp-converter-express': [
    { q: 'Which unit do I convert from?', a: 'Three buttons above the input, °C, °F, and °K, let you pick which scale your number is in, results for all three scales are calculated as soon as you click Convert or press Enter.' },
    { q: 'What do the preset buttons do?', a: 'Buttons like Freezing, Boiling, Body, Room, and Absolute Zero fill the input with a known Fahrenheit value and switch the unit to °F automatically, giving you a familiar reference point converted instantly.' },
    { q: 'How many decimal places does the result show?', a: 'Each of the three converted values, Celsius, Fahrenheit, and Kelvin, is displayed to 4 decimal places.' },
  ],
  'temperature-unit-converter': [
    { q: "What's the colored badge above the three converted values?", a: 'A temperature category label ranging from "Extremely Cold" to "Extremely Hot" based on the Celsius value, each category has its own background color from dark blue through to red.' },
    { q: 'What do the preset buttons like "Oven (High)" or "Sun Surface" do?', a: 'Each one loads a known reference temperature, converted into whichever unit you currently have selected, so you can instantly see it displayed across all three scales.' },
    { q: 'Is there a visual way to see where my temperature falls on a scale?', a: 'Yes, a gradient bar running from -50°C to 100°C shows a white marker positioned at your converted Celsius value, and all six conversion formulas are also listed further down the page.' },
  ],
  'text-case-converter': [
    { q: 'How many case formats does it convert to at once?', a: 'Eight: UPPER, lower, Title Case, Sentence case, camelCase, snake_case, kebab-case, and CONSTANT_CASE, all calculated simultaneously from the same input, each with its own Copy button.' },
    { q: 'How does it know where one word ends and the next begins for camelCase or snake_case?', a: 'It splits on spaces, underscores, hyphens, and periods, and also inserts a break wherever a lowercase letter is immediately followed by an uppercase one, so "helloWorld" tokenizes into "hello" and "World" too.' },
    { q: 'Is there a way to try it without typing my own text?', a: 'Yes, a "Load Example" button above the input fills it with "Hello World Example" so you can see all eight case conversions right away.' },
  ],
  'text-line-sorter': [
    { q: 'What sorting options are available in the dropdown?', a: 'Six modes: A to Z, Z to A, Shortest first, Longest first, Reverse order, and Remove duplicates, chosen from a single dropdown above the input and output boxes.' },
    { q: 'What does the "Case sensitive" checkbox change?', a: 'With it unchecked, A to Z, Z to A, and Remove duplicates ignore capitalization when comparing lines, so "Apple" and "apple" are treated the same, checking it makes those three modes distinguish uppercase from lowercase.' },
    { q: 'Does Remove duplicates strip out blank lines too?', a: 'Yes, before any sorting runs the input is filtered to drop empty or whitespace-only lines, so blank lines never appear in the output no matter which mode is selected.' },
  ],
  'text-permutation-generator': [
    { q: 'Is there a limit to how many words I can permute?', a: 'Yes, up to 10 words, entering more triggers a "Maximum 10 words for permutations" error, since the number of arrangements grows factorially and 10 words alone already produces 3,628,800 combinations.' },
    { q: 'What does the number in parentheses on the Generate button mean?', a: 'It shows how many words you\'ve entered and their factorial, like "3! = 6", updating live as you type so you know roughly how many permutations to expect before generating them.' },
    { q: 'Does it rearrange individual letters within a word?', a: 'No, it treats each space-separated word as a single unit and rearranges whole words, not the letters inside them.' },
  ],
  'text-redundancy-checker': [
    { q: 'What counts as a "filler phrase" it looks for?', a: 'A fixed list of 18 common filler phrases, things like "in order to", "due to the fact that", and "at this point in time", each one it finds is reported along with how many times it appears.' },
    { q: 'How does it decide a word is repeated too often?', a: 'Any word longer than 3 letters that appears more than twice in your text gets flagged, with the top 5 most-repeated words shown by count.' },
    { q: 'What happens if my text has no redundancy issues?', a: 'For text over 50 characters with no filler phrases or over-repeated words found, it shows a "No redundancy detected" confirmation instead of leaving the results area blank.' },
  ],
  'text-reverser': [
    { q: "What's the difference between the three reverse modes?", a: '"chars" reverses every character in the text, "words" keeps each word intact but reverses their order, and "lines" keeps each line intact but reverses the order the lines appear in.' },
    { q: 'Does the words or lines mode keep empty lines or extra spaces?', a: "No, both modes filter out empty entries before reversing, so blank lines in \"lines\" mode and stray blank entries in \"words\" mode are dropped from the output." },
    { q: 'Can I copy the reversed text without selecting it manually?', a: 'Yes, a Copy button appears next to the Reversed label as soon as there is output, copying the current mode\'s result to your clipboard in one click.' },
  ],
  'text-statistics': [
    { q: 'How is average sentence length calculated?', a: 'It counts sentences by matching runs of ".", "!", or "?" in your text, then divides your total word count by that sentence count to get words per sentence.' },
    { q: 'How does it estimate syllables per word?', a: 'It strips non-letters from each word, treats words of 3 letters or fewer as one syllable, drops a trailing silent e or -ed/-es ending, then counts groups of vowels (a, e, i, o, u, y) in what remains.' },
    { q: 'What other numbers show up besides syllables, sentence length, and word length?', a: 'The full grid also shows character count with and without spaces, paragraph count, estimated reading and speaking time in minutes, and a Flesch reading ease score.' },
  ],
  'text-statistics-advanced': [
    { q: 'What does the Flesch score represent as a reading level indicator?', a: "It's calculated from your average sentence length and average syllables per word using the standard Flesch Reading Ease formula, then clamped between 0 and 100, higher numbers mean easier to read." },
    { q: 'Where do I see syllables per word specifically?', a: 'It shows up as its own tile labeled "Syllables/word" in the statistics grid, calculated by dividing the total syllable count across your whole text by the total word count.' },
    { q: 'Does it estimate how long the text takes to read out loud?', a: 'Yes, a separate "Speaking time" figure is shown alongside reading time, calculated at 150 words per minute versus 200 words per minute for silent reading.' },
  ],
  'text-statistics-calculator': [
    { q: 'What counts as the "character breakdown"?', a: 'Two figures: total character count including spaces, and a separate count with all whitespace stripped out, shown as their own tiles labeled "Characters" and "No spaces".' },
    { q: 'How is average word length calculated?', a: 'For each word it strips out anything that is not a letter, counts the remaining letters, then averages that across every word in your text.' },
    { q: 'Does sentence count work on text with no punctuation at all?', a: "Yes, if there's no period, question mark, or exclamation point anywhere but you've still entered words, it counts that as one sentence rather than showing zero." },
  ],
  'text-to-slug': [
    { q: 'What separator characters can I choose between?', a: 'A dropdown lets you pick a hyphen, underscore, or period as the separator, generating a fresh slug in that format as soon as you click Generate.' },
    { q: "What happens to characters that aren't letters or numbers?", a: "Anything that isn't a letter, digit, space, or hyphen gets replaced with a space first, then runs of whitespace collapse into a single separator so you never end up with double dashes or dangling punctuation." },
    { q: 'Can I keep the original capitalization or surrounding spaces?', a: 'Yes, two checkboxes let you turn off automatic lowercasing and automatic trimming independently, so you can generate a slug that preserves your original casing or edge whitespace if you want.' },
  ],
  'text-to-speech': [
    { q: 'Where do the voice options come from?', a: "It reads whatever voices your browser and operating system have installed via the Web Speech API, and defaults to the first English voice it finds if one is available." },
    { q: 'What can I adjust besides which voice is used?', a: 'Two sliders control speed (0.5x to 2x) and pitch (0.5x to 2x), both apply the next time you press Speak.' },
    { q: 'Can I stop playback partway through?', a: 'Yes, the Speak button turns into a Stop button while audio is playing, clicking it cancels the speech immediately.' },
  ],
  'text-uniqueness-checker': [
    { q: 'How does it detect repeated phrases?', a: 'It scans your text for runs of 5 to 10 consecutive words that appear more than once and are longer than 20 characters, listing each repeated phrase with how many times it occurs.' },
    { q: 'What does "similar sentences" mean here?', a: 'It compares every pair of sentences over 20 characters using Jaccard similarity, shared words divided by total unique words between them, and flags any pair that scores above 70% as similar.' },
    { q: 'How is the uniqueness percentage calculated?', a: 'It divides your count of distinct words by your total word count and shows that as a percentage, colored green above 70%, yellow above 40%, and red below that.' },
  ],
  'timestamp-converter': [
    { q: "How does it know if I've entered a timestamp or a date?", a: "If your input is all digits it's treated as a Unix timestamp, automatically detecting seconds versus milliseconds based on its size, anything else is parsed as a date string instead." },
    { q: 'What formats does the result show?', a: 'For a timestamp input you get local date and time, UTC, ISO 8601, and both Unix seconds and milliseconds, for a date-string input you get the reverse: both Unix formats, ISO 8601, and UTC.' },
    { q: 'Is there a shortcut to convert the current moment?', a: 'Yes, a "Now" button fills the input with the current Unix timestamp in seconds and converts it immediately.' },
  ],
  'tip-calculator': [
    { q: 'How do I reach the tip-splitting calculator specifically?', a: 'The tool opens on a "Basic %" tab by default, click the "Tip" tab next to it to switch to the bill amount, tip percentage, and people-splitting fields.' },
    { q: 'What tip percentages are available?', a: 'Six preset buttons, 5%, 10%, 15%, 18%, 20%, and 25%, plus a custom number field if you need a specific percentage outside those presets.' },
    { q: 'How is the per-person amount calculated?', a: 'It adds your tip amount to the bill for a total, then divides that total by the number of people set with the plus and minus buttons next to "Split Between".' },
  ],
  'toml-to-json': [
    { q: 'What TOML syntax can it parse?', a: '[section] headers, key = value lines, double or single quoted strings, true/false booleans, and plain numbers, each converted to the matching JSON type of string, boolean, or number.' },
    { q: 'What happens to lines it cannot parse?', a: 'Blank lines and lines starting with # are skipped, and any line without an = sign is silently ignored rather than converted, so simple key-value pairs and section headers convert most reliably.' },
    { q: 'Does it support nested tables or arrays?', a: 'No, it only handles single-level [section] tables and flat key = value pairs, TOML arrays, inline tables, and multi-line strings are not parsed.' },
  ],
  'tsv-to-csv': [
    { q: 'How does it handle cells that contain commas or quotes?', a: 'Any cell containing a comma, double quote, or newline gets wrapped in double quotes, with existing double quotes doubled, so the resulting CSV stays valid even when your TSV data has punctuation inside fields.' },
    { q: 'Does it require a header row?', a: 'No, it converts every line the same way, tab-delimited into comma-delimited, whether or not the first line happens to be a header, so headers pass through unmodified along with the rest of your data.' },
    { q: 'Can I copy the converted CSV output?', a: 'Yes, a Copy button appears above the CSV output box once you have converted your data, copying the result straight to your clipboard.' },
  ],
  'tweet-to-image-converter': [
    { q: 'What are the two ways to create the image?', a: 'The default General mode fetches a real tweet by URL through oEmbed and renders its author, text, and stats, while a Customize mode on paid plans lets you type your own author name, handle, and tweet text from scratch.' },
    { q: 'What sizes can I export besides the default tweet card?', a: 'Switching the Platform dropdown gives you presets for Instagram (square, portrait, story), LinkedIn, Twitter/X, and Facebook, each with its own aspect ratio, plus a fully custom width and height in General mode.' },
    { q: 'Can I share the image without downloading it first?', a: 'Yes, a "Share to" button copies the rendered PNG straight to your clipboard so you can paste it directly into a post, alongside the Download PNG button.' },
  ],
  'typo-checker': [
    { q: 'How large is the typo dictionary it checks against?', a: 'It compares every word in your text, lowercased and stripped of punctuation, against a built-in list of over 100 common misspellings like "recieve", "definately", and "seperate".' },
    { q: 'Does "Fix All" preserve my original capitalization?', a: 'Yes, if a flagged word started with a capital letter, the replacement is capitalized to match, so "Teh" becomes "The" rather than "the".' },
    { q: 'What does it show me before I click Fix All?', a: 'A table listing every flagged word next to its suggested correction, plus a live count of how many potential typos were found in your text.' },
  ],
  'ulid-generator': [
    { q: 'How many ULIDs can I generate at once?', a: 'Between 1 and 100 at a time, set with the number input, each one generated fresh with its own timestamp and random portion.' },
    { q: 'What encoding does it use for the output?', a: "Crockford's Base32, the same 26 character alphabet ULIDs are defined with, which excludes the letters I, L, O, and U to avoid visual confusion with digits." },
    { q: 'Can I get the letters in lowercase instead?', a: 'Yes, an UPPERCASE checkbox is checked by default, unchecking it converts every generated ULID to lowercase instead.' },
  ],
  'unicode-character-inspector': [
    { q: 'What details does it show for each character?', a: 'Its Unicode code point like U+0041, hex and decimal values, an 8+8 bit binary breakdown, its raw UTF-8 byte sequence, and its HTML numeric entity, all shown in a card per character.' },
    { q: 'Can I inspect more than one character at once?', a: 'Yes, type or paste multiple characters into the input and click Inspect, a separate results card is generated for each individual character in your input.' },
    { q: 'How does it determine the character category shown?', a: 'It checks the code point against known ranges to label letters as Uppercase or Lowercase Letter, digits as Digit, and CJK ideographs by their Unicode block, falling back to "Other" for anything outside those ranges.' },
  ],
  'unit-converter': [
    { q: 'Which categories of units can I convert?', a: 'Three tabs cover length (meters, feet, kilometers, miles, and more), weight, and temperature (Celsius, Fahrenheit, Kelvin), each with its own set of conversion pairs to pick from.' },
    { q: 'Does the result update as I type?', a: 'Yes, typing a number into the input field recalculates the converted value instantly, with no separate convert button to click.' },
    { q: 'Can I switch which units I am converting between?', a: 'Yes, each category shows a row of conversion pair tabs, like Meters to Feet or Celsius to Fahrenheit, and clicking a different pair swaps the active conversion.' },
  ],
  'unix-timestamp-converter': [
    { q: 'What are the two conversion directions it supports?', a: 'A Timestamp to Date mode that turns a Unix timestamp into a readable date, and a Date to Timestamp mode that turns a date and time you pick back into a Unix timestamp, switchable with mode tabs.' },
    { q: 'Does it account for my local timezone?', a: 'Yes, converting a timestamp to a date shows both a UTC string and a separate local-timezone string side by side, so you can compare the two.' },
    { q: 'Is there a shortcut for the current time?', a: 'Yes, a "Use current time" button fills in the present moment instantly instead of typing or picking it manually.' },
  ],
  'uptime-calculator': [
    { q: 'How do I set the SLA percentage?', a: 'A slider and a matching number input let you set anything from 90% to 99.999% uptime in steps of 0.001%, covering everything from a loose SLA down to "five nines".' },
    { q: 'What time periods does it break the downtime down into?', a: 'Tabs for year, month, week, day, and hour, and the calculator shows the allowed downtime for all five periods at once in a results grid rather than one at a time.' },
    { q: 'What is the calculation based on?', a: 'It multiplies the length of each period by (100% minus your chosen SLA percentage) to get the allowed downtime, the same math used to translate an SLA target into a concrete outage budget.' },
  ],
  'url-encoder': [
    { q: 'What is the difference between the Encode and Decode modes?', a: 'Encode mode runs your text through encodeURIComponent to escape special characters like spaces and ampersands for safe use in a URL, while Decode mode runs encoded text through decodeURIComponent to turn it back into readable text.' },
    { q: 'What happens if I try to decode text that is not validly encoded?', a: 'An error message is shown instead of garbled output, since decodeURIComponent throws on malformed percent-encoded sequences rather than guessing at the intended characters.' },
    { q: 'Can I copy the result directly?', a: 'Yes, a Copy button sits above the output box and copies the encoded or decoded text straight to your clipboard.' },
  ],
  'url-parser': [
    { q: 'Which parts of a URL does it break out?', a: 'Protocol, hostname, port, pathname, search string, hash, host, origin, username, and a masked password, plus every query parameter listed individually as its own key-value pair.' },
    { q: 'What happens if I paste a URL without a protocol?', a: 'An error message is shown, since a protocol like https:// is required for the underlying URL parser to recognize the input as a valid, absolute URL.' },
    { q: 'How are query parameters displayed?', a: 'Each parameter from the URL\'s search string is listed on its own line as a separate key and value, rather than left bundled together as one raw query string.' },
  ],
  'url-redirect-checker': [
    { q: 'How many redirect hops will it follow?', a: 'Up to 20 redirects in a chain, following each Location header in turn until it reaches a final, non-redirect response or hits that limit.' },
    { q: 'What does it show for each hop in the chain?', a: 'A color-coded status code badge for every URL in the sequence, so you can see at a glance which hops were 301, 302, or another redirect status before landing on the final destination.' },
    { q: 'What happens if the URLs form a redirect loop?', a: 'It tracks every URL it has already visited in the chain, and stops with a loop warning instead of following the same redirect back and forth indefinitely.' },
  ],
  'user-agent-parser': [
    { q: 'What information does it extract from a User-Agent string?', a: 'The browser name, operating system, and device type (Mobile, Tablet, TV, or Desktop), determined by matching the string against known browser and OS patterns.' },
    { q: 'Can it detect bots and crawlers?', a: 'Yes, it checks the User-Agent against a pattern covering common bot signatures like "bot", "crawl", "spider", "slurp", Googlebot, Bingbot, and Yandex, and flags a match instead of misreading it as a regular browser.' },
    { q: 'Are there sample User-Agent strings I can try?', a: 'Yes, quick-load buttons fill in example strings for Chrome, Firefox, Safari, Edge, or a bot, so you can see how the parser handles each one without hunting for a real string first.' },
  ],
  'uuid-v1-generator': [
    { q: 'What goes into the timestamp portion of a v1 UUID?', a: 'The number of 100-nanosecond intervals since October 15, 1582, the official UUID epoch, split across the time_low, time_mid, and time_hi_and_version fields so the UUIDs sort chronologically by creation time.' },
    { q: 'Does it use my real MAC address for the node ID?', a: 'No, it generates a random 48-bit node ID instead of reading your actual network MAC address, which avoids the privacy concern that made real MAC-based v1 UUIDs controversial.' },
    { q: 'Can I generate more than one at a time?', a: 'Yes, a number input lets you generate between 1 and 100 at once, with optional uppercase formatting and surrounding braces.' },
  ],
  'uuid-validator': [
    { q: 'Which UUID versions can it identify?', a: 'It checks the version digit in the third group of the UUID and labels the result as v1, v4, or v7, or "unknown" if that digit does not match a recognized version.' },
    { q: 'What exactly makes a UUID invalid here?', a: 'The input is checked against the full RFC 4122 pattern of 8-4-4-4-12 hex digit groups with a valid version digit (1 through 5) and a valid variant digit (8, 9, a, or b), so a mistyped character or wrong grouping is flagged as invalid.' },
    { q: 'Can I copy a UUID after validating it?', a: 'Yes, a Copy UUID button appears alongside the validation result and copies the exact text you entered to your clipboard.' },
  ],
  'wcag-contrast-auditor': [
    { q: 'Can it check more than one color at once?', a: 'Yes, a Batch Audit box lets you paste a list of hex colors, one per line, and each one is checked against your chosen background color in a single pass.' },
    { q: 'What compliance levels does it report?', a: 'Contrast Ratio, AA Normal, AAA Normal, and AA Large results are all shown side by side, each marked Pass or Fail based on the WCAG 2.1 thresholds of 4.5:1, 7:1, and 3:1.' },
    { q: 'Can I copy the batch audit results?', a: 'Yes, a Copy button turns the audited list into plain text lines like "#ff0000 (2.15:1) AA:fail AAA:fail" that you can paste elsewhere.' },
  ],
  'wcag-contrast-checker': [
    { q: 'How do I enter the colors to compare?', a: 'A color picker and a matching hex text field for both foreground and background, so you can either click to pick a color or type a hex code directly.' },
    { q: 'What does the WCAG Level result tell me?', a: 'It labels the contrast ratio as AAA, AA, AA Large, or Fail based on the standard WCAG 2.1 thresholds, along with a short description of what that level means for readability.' },
    { q: 'Is there a live preview of the color combination?', a: 'Yes, a sample text block renders using your exact foreground and background colors, so you can see how the pairing actually looks before relying on the numeric ratio alone.' },
  ],
  'webp-converter': [
    { q: 'What quality levels can I choose when converting to WebP?', a: 'Four presets, Low (30%), Medium (50%), High (80%), and Maximum (100%), each shown with a short note about the size and quality tradeoff before you convert.' },
    { q: 'Does it show how much smaller the WebP file is?', a: 'Yes, after converting it compares the original and converted file sizes and displays the percentage change, like "42% smaller", so you can see the savings from the format switch.' },
    { q: 'How does the conversion actually happen?', a: 'Your image is drawn onto a hidden canvas element and then exported with canvas.toBlob at the image/webp MIME type and your chosen quality, entirely in your browser without uploading the file anywhere.' },
  ],
  'webp-to-jpg': [
    { q: 'Which image formats can I upload as the source?', a: 'JPEG, PNG, WebP, AVIF, or GIF, the uploader checks the file\'s MIME type against that list and rejects anything else with an error message.' },
    { q: 'Can I adjust the output quality?', a: 'Yes, a 1 to 100 quality slider controls the JPEG compression level, letting you trade off file size against image quality before converting.' },
    { q: 'What does the before/after comparison show?', a: 'Side-by-side preview panels display the original and converted images along with each one\'s file size and the percentage difference between them, like "38% smaller".' },
  ],
  'webp-to-png': [
    { q: 'Does converting to PNG preserve transparency?', a: 'Yes, PNG is a lossless format so the quality slider is disabled and grayed out for PNG output, since there is no compression tradeoff to make, transparency and pixel data are preserved exactly.' },
    { q: 'Which source formats does the uploader accept?', a: 'JPEG, PNG, WebP, AVIF, or GIF, checked against the file\'s actual MIME type, with an error message if you try to upload something else.' },
    { q: 'Can I download the converted PNG afterward?', a: 'Yes, a Download PNG button appears once the conversion finishes, saving the result with your original filename and a .png extension.' },
  ],
  'weight-converter': [
    { q: 'Which weight units does it convert between?', a: 'Kilograms, grams, milligrams, pounds, ounces, and stone, all six shown as simultaneous results rather than one pair at a time.' },
    { q: 'Do I need to pick both a "from" and "to" unit?', a: 'No, you only choose the unit you are converting from, the result table then lists the equivalent value in every other supported unit at once.' },
    { q: 'How precise are the converted values?', a: 'Each result is calculated to 6 decimal places and then has trailing zeros trimmed, so a clean value like 2.20462 pounds is not padded with unnecessary zeros.' },
  ],
  'word-density-analyzer': [
    { q: 'Does it analyze multi-word phrases or only single words?', a: 'Only single words. Text is split on whitespace and checked against a built-in list of roughly 100 common words like "the," "and," and "of" before the remaining words are ranked by count and percentage.' },
    { q: 'Can I filter out short filler words?', a: 'Yes, a minimum word length setting lets you exclude words below a certain length from the results table, on top of the built-in common-word exclusion list.' },
    { q: 'How are the results sorted?', a: 'A toggle switches the results table between sorting by frequency count, highest first, and plain alphabetical order.' },
  ],
  'word-frequency-counter': [
    { q: 'How does it count words differently from a simple word counter?', a: 'It extracts words with a lowercase letter-only match, then groups and sorts them by how often each one appears, rather than just giving a single total word count.' },
    { q: 'What summary statistics does it show?', a: 'A total word count and a unique word count are both displayed above the frequency breakdown.' },
    { q: 'Does it show every word if my text is long?', a: 'It displays up to the top 50 most frequent words with their counts and percentages, and shows a "+N more words" note if your text has more unique words than that.' },
  ],
  'word-frequency-table': [
    { q: 'Which words get excluded from the table automatically?', a: 'About 100 common English words like "the," "be," and "to" are filtered out before the table is built, so the results focus on the more meaningful words in your text.' },
    { q: 'What does each row in the table show?', a: 'The word itself, how many times it appears, and what percentage of the total word count it represents.' },
    { q: 'Can I copy the frequency table out of the tool?', a: 'Yes, a Copy button is available once the table is generated.' },
  ],
  'xml-formatter': [
    { q: 'How does it detect invalid XML?', a: 'It parses your input with the browser\'s built-in DOMParser and checks for a parsererror node, flagging the specific parsing failure instead of just failing silently.' },
    { q: 'Can I switch between formatting and minifying?', a: 'Yes, Format and Minify mode tabs let you either pretty-print the XML with indentation or collapse the whitespace between tags into a single compact line.' },
    { q: 'What indentation options are available?', a: 'You can choose between 2-space and 4-space indentation, and attribute values and text content are properly escaped for characters like &, <, and " during formatting.' },
  ],
  'xml-sitemap-generator': [
    { q: 'Do I need to type full URLs for every page?', a: 'No, you can set a base URL once and then add each page as a relative path like /about, the tool combines them into the full loc value automatically.' },
    { q: 'Can I set different priorities and change frequencies per URL?', a: 'Yes, each URL you add gets its own change frequency, from always to never, and priority value from 0.1 to 1.0 before it is added to the list.' },
    { q: 'Does it support the image sitemap extension?', a: 'Yes, an "Include image sitemap extension" checkbox adds the image namespace declaration to the generated XML output.' },
  ],
  'sitemap-extractor': [
    { q: 'Do I need to upload a file or can I paste the XML directly?', a: 'You paste the sitemap XML into a text box, there is also a Load Sample button that fills in a working example if you want to see the tool in action first.' },
    { q: 'What counts as an error versus just a warning?', a: 'Missing the XML declaration, a missing urlset root element, and URLs without a proper http or https prefix are all flagged as issues, alongside a per-URL error if a loc tag is missing entirely.' },
    { q: 'Does it handle sitemap index files too?', a: 'Yes, if it detects a sitemapindex tag it switches to extracting the individual sitemap file URLs listed inside instead of page URLs.' },
  ],
};

export function getFaqs(tool: Tool): FAQ[] {
  return OVERRIDES[tool.slug] ?? templateFaqs(tool);
}
