// Rewritten content for 10 tools flagged for quality issues.
// Not wired into the app yet - staged for review before merging into data/tool-content.ts.

export interface FixBatchExample {
  title: string;
  code: string;
  note?: string;
}

export interface FixBatchEntry {
  description: string;
  examples: FixBatchExample[];
}

const FIX_BATCH_17: Record<string, FixBatchEntry> = {
  'hex-to-rgb-new': {
    description: `A hex code is what shows up in a stylesheet or a design spec, but plenty of contexts still want the value as separate red, green, and blue numbers instead, an HTML5 canvas fillStyle call, an older image editor's RGB sliders, a config file that was never updated to accept hex. This tool takes a hex color and converts it straight to RGB and RGBA, showing a live preview so the converted values can be confirmed against the original at a glance. It's a narrower, single-purpose tool than a full multi-format converter, just the one conversion done quickly: paste a hex code in, get the RGB and RGBA numbers back out. Useful for the common moment of having a color as hex from a design file and needing the comma-separated RGB values for a specific piece of code or an older tool that only accepts that format.`,
    examples: [
      {
        title: 'Convert a hex value for a canvas fillStyle call',
        code: `Input: #2563EB\nOutput: rgb(37, 99, 235)`,
        note: 'Canvas APIs often expect comma-separated RGB rather than a hex string.',
      },
      {
        title: 'Get RGBA for a semi-transparent overlay',
        code: `Input: #000000, alpha: 0.5\nOutput: rgba(0, 0, 0, 0.5)`,
        note: 'Adds the alpha channel directly rather than needing a second conversion step.',
      },
    ],
  },

  'dummy-text-detector': {
    description: `Lorem ipsum text is meant to be temporary, dropped in as a stand-in for real copy while a layout gets built, but it has a habit of quietly surviving all the way to a live site or a printed piece because nobody remembered to swap it out before publishing. This tool scans a document specifically for that leftover placeholder text, flagging any lorem ipsum or generic filler paragraphs still sitting where real content should be, and pointing to exactly where it needs to go. Useful as a final check before a page goes live or a document goes to print, catching the specific, embarrassing mistake of shipping "Lorem ipsum dolor sit amet" to actual visitors or readers instead of the copy that was supposed to replace it.`,
    examples: [
      {
        title: 'Catch leftover lorem ipsum before publishing',
        code: `Input: [live page draft]\nFlagged: "Lorem ipsum dolor sit amet, consectetur adipiscing elit" (paragraph 3)`,
        note: 'Points to the exact paragraph still holding placeholder text.',
      },
      {
        title: 'Scan a document before sending to print',
        code: `Input: [brochure draft, 4 pages]\nFlagged: page 2, sidebar text still reads generic filler copy`,
        note: "Catches placeholder text in a sidebar or callout box that's easy to overlook.",
      },
    ],
  },

  'graphql-playground': {
    description: `Querying a GraphQL API is a different shape of problem than testing a REST endpoint: there's one URL instead of many, every request is a POST carrying a query describing exactly which fields to return, and variables get passed separately from the query text itself rather than baked into the URL or body directly. This tool is built around that specific model: point it at any public GraphQL endpoint and get schema-aware autocomplete while writing a query, a history of what's already been run, and a dedicated place to define variables the query references. Useful for exploring an unfamiliar GraphQL API's schema interactively, testing a query with different variable values without retyping it each time, or working out exactly which nested fields a query actually needs to request.`,
    examples: [
      {
        title: 'Query a public GraphQL API with variables',
        code: `Query: query($id: ID!) { user(id: $id) { name email } }\nVariables: { "id": "42" }\nOutput: { "data": { "user": { "name": "Jane", "email": "jane@example.com" } } }`,
        note: 'Variables are defined separately and referenced in the query rather than baked into the request.',
      },
      {
        title: 'Explore an unfamiliar schema with autocomplete',
        code: `Typing: query { product... \nAutocomplete suggests: name, price, inventory, reviews`,
        note: 'Schema-aware autocomplete reveals available fields without checking separate documentation.',
      },
    ],
  },

  'text-statistics-calculator': {
    description: `Word count and sentence count are the obvious numbers, but this also breaks a text down by what it's actually made of: what proportion is letters, what proportion is digits, what proportion is punctuation and whitespace, a structural composition most text tools don't surface at all. That breakdown is useful for a different kind of check than readability, confirming a "name" field in scraped data doesn't secretly contain digits, or noticing a document is unusually punctuation-heavy in a way that might point to a formatting problem. This tool covers the full set together: word and sentence counts, average word length, and the character-type breakdown, all from the same block of text in one pass. Useful for a quick structural profile of a piece of text, not just how it reads but literally what characters make it up.`,
    examples: [
      {
        title: 'Get a structural breakdown of a text field',
        code: `Input: "Order #4821-B, qty: 3!!"\nOutput: letters: 52% | digits: 22% | punctuation: 17% | whitespace: 9%`,
        note: 'Reveals composition a plain word count would never surface.',
      },
      {
        title: "Check that a name field contains no digits",
        code: `Input: "John Smith99"\nOutput: digits: 8% (unexpected for a name field)`,
        note: 'Flags a data quality issue in scraped or user-submitted data.',
      },
    ],
  },

  'word-density-analyzer': {
    description: `Counting how many times a keyword appears only tells half the story for SEO purposes; the number that actually matters is what percentage of the total text that keyword represents, since the same raw count means something completely different in a 300-word page versus a 3,000-word one. This tool calculates that percentage directly, keyword density as a share of total word count, for both single words and multi-word phrases, and checks it against the rough range generally considered healthy rather than either under-optimized or veering into keyword stuffing. Useful for confirming a target keyword phrase appears often enough to signal relevance without repeating it so much it reads unnaturally or risks looking manipulative to a search engine evaluating the page.`,
    examples: [
      {
        title: 'Check keyword density on a blog post',
        code: `Input: [1200-word post about "meal prep"]\nOutput: "meal prep" appears 14 times, 2.3% density`,
        note: 'Expresses frequency as a percentage of total words rather than a raw count.',
      },
      {
        title: 'Catch potential keyword stuffing',
        code: `Input: [800-word page]\nOutput: "best running shoes" appears 22 times, 5.8% density (flagged as high)`,
        note: 'A density this high risks reading as unnatural or manipulative to a search engine.',
      },
    ],
  },

  'robots-txt-simulator': {
    description: `A robots.txt file can have entirely different rules for different crawlers, one block of directives for Googlebot, another for Bingbot, a catch-all for everything else, which means the real question usually isn't what the file says in the abstract, it's whether this specific bot would be allowed to crawl this specific URL. This tool answers exactly that: enter a URL and pick a user agent, and it walks through the actual robots.txt rules that would apply and returns a clear allowed or blocked verdict for that exact combination. Useful for confirming Googlebot specifically can reach a page that a broader audit flagged as borderline, or checking whether a newly added Disallow rule actually blocks the one URL it was meant to without needing to trace the rule logic by hand.`,
    examples: [
      {
        title: 'Check if Googlebot can crawl a specific page',
        code: `Input: URL: /blog/post-123, user agent: Googlebot\nResult: allowed`,
        note: 'Applies only the rule block that specifically targets Googlebot.',
      },
      {
        title: 'Verify a new Disallow rule targets the right path',
        code: `Input: URL: /wp-admin/settings, user agent: Bingbot\nResult: blocked (matches Disallow: /wp-admin/)`,
        note: 'Confirms the rule actually catches the intended URL rather than tracing the logic by hand.',
      },
    ],
  },

  'post-generator': {
    description: `The same core update reads differently depending on where it's posted, LinkedIn expects a longer, more professional framing, Instagram wants a caption built around a visual with hashtags folded in, Facebook sits somewhere more casual in between, and writing each version separately for every scheduled post adds up fast across a real content calendar. This tool takes one topic or update and generates platform-appropriate versions for each destination at once, adjusting length, tone, and format conventions like hashtag placement to match what actually works on each platform rather than posting one identical version everywhere. Useful for keeping a regular posting schedule across several platforms without rewriting the same idea from scratch for each one, or maintaining a consistent voice across channels that otherwise expect noticeably different styles.`,
    examples: [
      {
        title: 'Adapt one update across three platforms',
        code: `Input: "We just launched dark mode"\nOutput: LinkedIn (professional, 3 sentences), Instagram (caption + 5 hashtags), Facebook (casual, 2 sentences)`,
        note: 'Adjusts length and tone to match each platform instead of posting one identical version everywhere.',
      },
      {
        title: "Fill a week's content calendar from one topic list",
        code: `Input: 5 topics for the week\nOutput: 5 platform-matched posts, one per day`,
        note: 'Builds a full week of scheduled content from a short list of topics.',
      },
    ],
  },

  'color-contrast-ratio-checker': {
    description: `Checking a color decision while actually designing something is a different moment than auditing an entire finished palette after the fact; it's one specific foreground and background pair, checked right when it's being chosen, with an immediate answer about whether it clears WCAG AA or AAA and, if it doesn't, a suggested adjustment shown side by side with the original so the fix can be compared before committing to it. This tool is built for that live, in-the-moment check: enter two colors, see the exact contrast ratio and compliance result immediately, and get one concrete alternative color if the pair falls short rather than a plain pass or fail with nothing else. Useful for confirming a color choice clears accessibility standards the moment it's picked, rather than discovering a problem during a later audit of an already-finished design.`,
    examples: [
      {
        title: 'Check a color pair while designing live',
        code: `Input: #6B9FE0 on #FFFFFF\nOutput: 2.8:1, fails AA`,
        note: 'Gives an immediate result the moment a color is picked, not after the fact.',
      },
      {
        title: 'Get a suggested fix for a failing pair',
        code: `Input: #6B9FE0 on #FFFFFF (fails)\nSuggested: #2E5FA3 on #FFFFFF (4.6:1, passes AA)`,
        note: 'Shows the original and the suggested fix side by side for comparison.',
      },
    ],
  },

  'base64-file-encoder': {
    description: `Base64 encoding and decoding are really two separate, opposite needs that come up in different situations: turning a real file into a base64 string to embed it somewhere that only accepts text, a JSON payload, an API request body, an email attachment's MIME section, or going the other direction, taking a base64 string received from an API response or a log entry and reconstructing the actual file it represents so it can be opened normally. This tool handles both directions in one place rather than requiring a separate tool for each. Useful for encoding a small file to paste into a request body that expects a text field, or decoding a base64 blob pulled from an API response back into a real, openable file without writing a script just for that one conversion.`,
    examples: [
      {
        title: 'Encode a small file for a JSON payload',
        code: `Input: signature.png (4 KB)\nOutput: "iVBORw0KGgoAAAANSUhEUgA..." (base64 string)`,
        note: 'Produces a raw base64 string ready to drop into a JSON field or request body.',
      },
      {
        title: 'Decode a base64 string back into a file',
        code: `Input: "JVBERi0xLjQKJ..." (base64 from an API response)\nOutput: document.pdf (reconstructed file, ready to download)`,
        note: 'Reverses the process, turning a base64 blob back into an actual openable file.',
      },
    ],
  },

  'url-slug-generator': {
    description: `A page title with an accented character, café, or a word borrowed from another script entirely often gets mangled by a naive slug conversion, either the accent gets stripped in a way that changes the word's meaning, or the character survives as a raw byte sequence that breaks the URL somewhere down the line. This tool converts any text or title into a clean, hyphenated URL slug that handles those cases properly, normalizing accented Latin characters to their closest plain-letter equivalent and safely transliterating or stripping characters outside the Latin alphabet rather than leaving something that technically works but looks broken in a browser's address bar. Useful for generating a proper slug from a title in a language other than English, or fixing a URL that currently has percent-encoded gibberish where a title with special characters should have produced a clean, readable path instead.`,
    examples: [
      {
        title: 'Convert a title with accented characters',
        code: `Input: "Café Menu Ideas for Été 2026"\nOutput: cafe-menu-ideas-for-ete-2026`,
        note: 'Normalizes accented letters to their plain equivalent instead of stripping or mangling them.',
      },
      {
        title: 'Handle a title with mixed scripts',
        code: `Input: "Best Ramen 拉麺 Shops in Tokyo"\nOutput: best-ramen-la-mian-shops-in-tokyo`,
        note: 'Transliterates non-Latin characters instead of leaving raw bytes that would break the URL.',
      },
    ],
  },
};

export default FIX_BATCH_17;
