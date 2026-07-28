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

const FIX_BATCH_50: Record<string, FixBatchEntry> = {
  'seo-tag-analyzer': {
    description: `A link shared on Twitter renders completely differently than the same link shared on Facebook or found in a Google search result, each platform reading its own specific tag, a Twitter Card, an Open Graph tag, a plain meta description, and a page missing any one of them falls back to a generic, unappealing preview on that specific platform. This tool analyzes a page's existing SEO meta tags, Open Graph tags, and Twitter Card tags together, generating whichever ones are missing and previewing exactly how the page will actually appear when shared or found in search. Useful for checking why a shared link looks broken or generic on one specific platform, generating a complete set of missing Open Graph tags before a page gets shared widely, or previewing a search snippet's actual appearance before publishing a page.`,
    examples: [
      {
        title: 'Preview a Twitter Card',
        code: `Input: example.com/blog/post\nOutput: Twitter Card preview - title, description, and image as they'll actually render on X`,
        note: 'Shows the exact card a platform will display rather than a generic assumption.',
      },
      {
        title: 'Generate missing Open Graph tags',
        code: `Output:\n<meta property="og:title" content="..." />\n<meta property="og:description" content="..." />\n<meta property="og:image" content="..." />`,
        note: 'Fills in tags a page is currently missing before it gets shared.',
      },
    ],
  },

  'canonical-url-generator': {
    description: `The same article reachable through a tracking parameter, a trailing slash, both http and https, or a paginated duplicate splits its ranking signal across several URLs instead of consolidating it onto one, since a search engine has no way to know which version is actually supposed to be authoritative without being told directly. A canonical tag solves exactly that by pointing explicitly to the one URL that should receive credit, consolidating link and ranking signals that would otherwise scatter across duplicates. This tool generates that canonical link tag for a given page, ready to drop into its head section. Useful for consolidating ranking signal across a page reachable through several tracked or parameterized URLs, fixing a duplicate content warning flagged during an SEO audit, or specifying the correct canonical version of a paginated series.`,
    examples: [
      {
        title: 'Generate a canonical tag for a tracked URL',
        code: `Input: example.com/product?ref=newsletter\nOutput: <link rel="canonical" href="https://example.com/product" />`,
        note: 'Points ranking signal to the clean URL instead of the tracked variant.',
      },
      {
        title: 'Set the canonical for a paginated series',
        code: `Input: example.com/blog?page=3\nOutput: <link rel="canonical" href="https://example.com/blog?page=3" />`,
        note: 'Specifies which paginated URL should actually be treated as canonical.',
      },
    ],
  },

  'syllable-counter': {
    description: `Counting syllables by ear works fine for one word but gets unreliable across a whole poem or a speech script, and this tool automates that by detecting consecutive vowel groups within a word, a heuristic that works well for the vast majority of English words but isn't a dictionary lookup, so an unusual spelling or a silent letter can occasionally throw the count off by one. This tool counts syllables in any word or phrase using that vowel-group detection, giving a fast estimate rather than requiring a lookup against a fixed word list. Useful for checking a haiku's five-seven-five structure before finalizing it, pacing a speech or a script by estimating syllables per line, or getting a quick syllable count for a word without pronouncing it out loud first.`,
    examples: [
      {
        title: 'Check a haiku line count',
        code: `Input: "An old silent pond"\nOutput: 5 syllables`,
        note: 'Confirms a haiku line matches the traditional five-seven-five structure.',
      },
      {
        title: 'Count syllables in a tricky word',
        code: `Input: "chocolate"\nOutput: 3 syllables (heuristic estimate)`,
        note: 'Vowel-group detection can occasionally miscount an unusually spelled word.',
      },
    ],
  },

  'word-association': {
    description: `A thesaurus only answers half the question when a specific word choice feels slightly off, since a strict synonym isn't always what a sentence actually needs, sometimes the better word is related in meaning without being interchangeable, ocean calling to mind tide, wave, or salt rather than only a direct substitute. This tool generates synonyms, antonyms, and related words together for any input term, covering both a direct substitute and the wider neighborhood of words a term actually calls to mind. Useful for finding a direct synonym when a word feels overused in a piece of writing, discovering an antonym for a contrast or a comparison, or brainstorming related words around a concept for a crossword, a word game, or a stuck sentence.`,
    examples: [
      {
        title: 'Find synonyms and related words',
        code: `Input: "ocean"\nSynonyms: sea, deep\nRelated: tide, wave, salt, current`,
        note: 'Surfaces conceptually related words, not just direct substitutes.',
      },
      {
        title: 'Find an antonym for contrast',
        code: `Input: "abundant"\nAntonyms: scarce, sparse`,
        note: 'Useful for building a deliberate contrast in a sentence.',
      },
    ],
  },

  'markdown-preview': {
    description: `Writing markdown blind and only seeing the rendered result after saving and reloading a separate file makes it hard to catch a broken list or a heading level that's off by one, and switching back and forth between an editor and a renderer slows down the actual writing. This tool renders markdown live, side by side with the text as it's typed, so a formatting mistake shows up immediately rather than after switching windows, and the rendered result exports directly to HTML when it's ready to use elsewhere. Useful for writing a README and seeing exactly how it will render on GitHub before committing it, drafting a blog post in markdown and exporting the HTML straight into a CMS, or catching a broken list or heading level the instant it happens rather than after saving.`,
    examples: [
      {
        title: 'See a live rendered preview',
        code: `Input: "# Title\\n- item one\\n- item two"\nOutput (rendered): Title heading with a bulleted list below it, updating as you type`,
        note: 'Shows formatting mistakes immediately instead of after saving.',
      },
      {
        title: 'Export to HTML',
        code: `Input: markdown draft\nOutput: <h1>Title</h1>\n<ul><li>item one</li><li>item two</li></ul>`,
        note: 'Produces ready-to-use HTML for a CMS or an email.',
      },
    ],
  },

  split: {
    description: `A signed contract buried on page twelve of a forty-page PDF, or a scanned batch of several documents saved as one long file, both need a specific page or a specific range pulled out as its own standalone file rather than sharing that one long document with everyone who only needs a single section. This tool splits a PDF into separate pages or page ranges, extracting exactly the section that's actually needed rather than requiring the whole original document to be passed along. Useful for extracting just the signature page from a longer contract to send back separately, splitting a scanned batch of multiple documents into individual files, or pulling one chapter or section out of a longer report to share on its own.`,
    examples: [
      {
        title: 'Extract a single page',
        code: `Input: contract.pdf, page: 12\nOutput: contract-page-12.pdf`,
        note: 'Pulls out just the signature page instead of sharing the whole document.',
      },
      {
        title: 'Split into page ranges',
        code: `Input: scanned-batch.pdf (24 pages), ranges: 1-8, 9-16, 17-24\nOutput: document-1.pdf, document-2.pdf, document-3.pdf`,
        note: 'Separates a scanned batch back into its original individual documents.',
      },
    ],
  },

  'sha1-hash-generator': {
    description: `Git identifies every commit and every file internally by its own SHA-1 hash of that content, which is why a hash occasionally needs computing or checking outside of git itself, confirming a blob's hash matches what git reports, or working with a legacy system or an API that specifically expects SHA-1 rather than MD5 or SHA-256. This tool generates a SHA-1 hash from pasted text or an uploaded file, with the result ready to copy immediately rather than needing to be selected out of a longer output. Useful for confirming a file's SHA-1 hash matches what a git object reports internally, generating a hash for a legacy system that specifically requires SHA-1 over a newer algorithm, or quickly verifying two pieces of text are identical by comparing their hash output.`,
    examples: [
      {
        title: 'Generate a SHA-1 hash from text',
        code: `Input: "hello world"\nOutput: 2aae6c35c94fcfb415dbe95f408b9ce91ee846ed`,
        note: 'Matches how git hashes a blob of the same content internally.',
      },
      {
        title: 'Hash a file for a legacy system',
        code: `Input: report.pdf\nOutput: a94a8fe5ccb19ba61c4c0873d391e987982fbbd3`,
        note: 'Produces the specific hash format an older system or API still requires.',
      },
    ],
  },

  'domain-age-checker': {
    description: `A domain's registration age matters in two completely different situations, a buyer evaluating whether an aged domain being sold on a marketplace actually carries the history it claims to, and an owner who simply needs to know when their own domain expires before it lapses and becomes available for someone else to register. This tool checks any domain's registration age and expiry date directly, answering both questions from the same lookup rather than requiring a separate whois search for each. Useful for evaluating an aged domain before buying it from a marketplace, confirming exactly when your own domain needs renewing before it accidentally lapses, or checking how long a competitor's domain has actually been registered.`,
    examples: [
      {
        title: 'Evaluate an aged domain before buying',
        code: `Input: example-domain.com\nOutput: registered 2009-03-14 (16 years), expires 2026-03-14`,
        note: 'Confirms the actual history behind a domain being sold on a marketplace.',
      },
      {
        title: "Check your own domain's expiry",
        code: `Input: mysite.com\nOutput: expires in 23 days`,
        note: 'Flags an upcoming expiry before the domain accidentally lapses.',
      },
    ],
  },

  'pagespeed-preview': {
    description: `Search ranking doesn't care about total page weight directly, it cares about Core Web Vitals specifically, largest contentful paint, interaction responsiveness, and layout shift, the exact metrics Google actually measures and factors into ranking rather than a generic size total. This tool previews an estimated page speed score and those Core Web Vitals for any URL, showing the specific numbers that actually affect search ranking rather than a general performance impression. Useful for checking whether a page's Core Web Vitals actually meet the thresholds Google rewards in ranking, seeing which specific vital, loading, interactivity, or visual stability, is dragging a score down, or comparing an estimated score before and after a performance fix to confirm it actually helped ranking.`,
    examples: [
      {
        title: 'Check Core Web Vitals for a URL',
        code: `Input: example.com/landing\nOutput: LCP: 2.1s, INP: 180ms, CLS: 0.05, Score: 87`,
        note: 'Reports the specific metrics Google factors into search ranking.',
      },
      {
        title: 'Compare scores after a fix',
        code: `Before: LCP 4.8s, Score 52\nAfter compressing hero image: LCP 2.3s, Score 89`,
        note: 'Confirms a performance fix actually improved the ranking-relevant metrics.',
      },
    ],
  },

  'text-sorter': {
    description: `Sorting a list one direction is only half the job when the actual need is the opposite order, a leaderboard read worst-to-best instead of best-to-worst, or a log file where the most recent entry needs to surface at the top instead of buried at the bottom after everything older. This tool sorts text lines alphabetically, by length, numerically, or into random order, with every mode reversible so a list built one direction can be flipped without re-sorting it from scratch. Useful for reversing a chronological log so the newest entry appears first instead of last, flipping an alphabetical list into a Z-to-A order for a specific report format, or reversing a numeric ranking to read worst-to-best instead of the usual best-to-worst order.`,
    examples: [
      {
        title: 'Reverse a chronological log',
        code: `Input: 09:01 login, 09:15 upload, 09:42 logout\nOutput (reversed): 09:42 logout, 09:15 upload, 09:01 login`,
        note: 'Surfaces the most recent entry first instead of last.',
      },
      {
        title: 'Flip an alphabetical list to Z-to-A',
        code: `Input: Apple, Banana, Cherry\nOutput (reversed): Cherry, Banana, Apple`,
        note: 'Reverses an already-sorted list without re-sorting from scratch.',
      },
    ],
  },
};

export default FIX_BATCH_50;
