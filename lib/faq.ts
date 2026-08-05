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
};

export function getFaqs(tool: Tool): FAQ[] {
  return OVERRIDES[tool.slug] ?? templateFaqs(tool);
}
