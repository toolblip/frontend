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

const FIX_BATCH_75: Record<string, FixBatchEntry> = {
  'text-statistics-advanced': {
    description: `Word count alone says almost nothing about how genuinely readable a piece of writing is, since a text can be short and still dense with long, rare, multisyllable words, or long and still simple sentence by sentence, and telling those two apart takes more than counting words, sentences, or syllables alone. This tool combines several readability measures at once, lexicon density showing how much of a text is built from varied, meaningful words rather than repeated filler, average syllables per word, and an overall reading level score, into one composite view of how demanding a piece of writing is for its intended reader. Useful for checking whether a blog post is genuinely written at an eighth-grade reading level rather than just assuming it, comparing lexicon density between two drafts to see which reads more repetitively, or gauging how complex a document is before publishing it to a general audience.`,
    examples: [
      {
        title: 'Check lexicon density and reading level together',
        code: `Input: [500-word blog post]\nOutput: lexicon density: 62%, syllables/word: 1.4, reading level: Grade 8`,
        note: 'Combines multiple readability measures into one composite result.',
      },
      {
        title: 'Compare two drafts for repetitiveness',
        code: `Draft A: lexicon density 71%\nDraft B: lexicon density 48%\nResult: Draft B relies on far more repeated words`,
        note: 'Lower lexicon density signals more repeated, less varied vocabulary.',
      },
    ],
  },

  'robots-txt-checker': {
    description: `A robots.txt file is easy to get subtly wrong in ways a text editor won't ever flag, a Disallow line under the wrong user-agent block, a rule that unintentionally blocks an entire section of a site, a Sitemap directive pointing at a URL that doesn't actually resolve, mistakes that only show up once a crawler starts behaving strangely. This tool validates a robots.txt file's actual structure, listing every user-agent block along with the paths it allows or blocks, and flagging a syntax problem before it quietly affects how a site gets crawled. Useful for reviewing a robots.txt file after an edit to confirm a whole section wasn't accidentally blocked, checking that a Sitemap directive actually points somewhere valid, or auditing an unfamiliar site's crawler rules to see exactly what's off-limits.`,
    examples: [
      {
        title: 'Validate structure after an edit',
        code: `Input:\nUser-agent: *\nDisallow: /admin/\nSitemap: https://example.com/sitemap.xml\nOutput: valid - 1 user-agent block, 1 disallow rule, sitemap resolves`,
        note: 'Confirms nothing was accidentally blocked or broken by a recent edit.',
      },
      {
        title: 'Catch a rule under the wrong user-agent block',
        code: `Input:\nUser-agent: Googlebot\nUser-agent: *\nDisallow: /private/\nWarning: Disallow applies only to "*", not Googlebot`,
        note: 'Flags a rule placement mistake that silently changes crawler behavior.',
      },
    ],
  },

  'htaccess-redirect-generator': {
    description: `Apache's .htaccess redirect rules run on mod_rewrite's own regex syntax, where a RewriteCond has to come before the RewriteRule it applies to, and it's genuinely easy to write a rule that accidentally matches its own redirected output, sending a visitor into an infinite redirect loop instead of the intended destination. This tool generates ready-to-use .htaccess rules for forcing HTTPS, adding or removing a www subdomain, and other common redirect patterns, without requiring mod_rewrite regex to be written by hand. Useful for forcing every visitor onto HTTPS without accidentally creating a redirect loop, standardizing a domain to always include or always drop www, or generating a specific custom redirect rule to drop straight into a live .htaccess file.`,
    examples: [
      {
        title: 'Force HTTPS without a redirect loop',
        code: `Output:\nRewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
        note: 'Checks the HTTPS condition first so it never redirects an already-secure request.',
      },
      {
        title: 'Add www to every request',
        code: `Output:\nRewriteCond %{HTTP_HOST} ^example\\.com$ [NC]\nRewriteRule ^(.*)$ https://www.example.com/$1 [L,R=301]`,
        note: 'Standardizes every request onto the www subdomain.',
      },
    ],
  },

  'word-combinations': {
    description: `Combining a handful of words has two genuinely different answers depending on whether order matters, cheap and laptop paired as "cheap laptop" and "laptop cheap" count as the same combination if order is ignored, but as two entirely different permutations if it isn't, and which version actually matters depends on what the output is for. This tool generates every two-word and three-word grouping from a list, as unordered combinations or as order-sensitive permutations, covering both cases instead of only one. Useful for generating every possible ordering of a set of keyword modifiers for programmatic SEO titles, brainstorming domain name variations where word order changes which ones are actually available, or listing all unordered pairings from a set of words without duplicating the same pair in reverse.`,
    examples: [
      {
        title: 'Generate order-sensitive permutations',
        code: `Input: cheap, laptop\nOutput: "cheap laptop", "laptop cheap"`,
        note: 'Both orderings are generated since they read as different phrases.',
      },
      {
        title: 'Generate unordered combinations only',
        code: `Input: red, blue, green\nOutput: "red blue", "red green", "blue green"`,
        note: 'Each pair appears once, without a reversed duplicate.',
      },
    ],
  },

  'image-to-svg': {
    description: `Vectorizing a photo or a graphic isn't an all-or-nothing conversion, since the same image can be traced as a handful of simplified, flat-colored shapes or as a much more detailed set of paths that mirrors the original closely, and the right choice depends entirely on whether the result needs to look like a clean logo or a faithful reproduction. This tool traces any raster image into SVG with adjustable detail and color count, letting the same source image come out as a simplified vector or a far more detailed one depending on how those settings are tuned. Useful for reducing a photo to a small set of flat colors before vectorizing it into a clean, logo-style graphic, tracing a complex image at high detail when the vector needs to closely match the original, or dialing in exactly how many distinct paths a traced image ends up with.`,
    examples: [
      {
        title: 'Flatten a photo into a logo-style vector',
        code: `Input: photo.png, color count: 4, detail: low\nOutput: photo.svg (4 flat color regions)`,
        note: 'Produces a simplified, clean-edged vector rather than a faithful trace.',
      },
      {
        title: 'Trace at high detail for a close match',
        code: `Input: illustration.png, color count: 32, detail: high\nOutput: illustration.svg (closely matches the original)`,
        note: 'Higher detail and color settings produce a far more faithful vector.',
      },
    ],
  },

  'landing-page-copy': {
    description: `A landing page isn't read start to finish the way an article is, a visitor skims a headline first and decides in seconds whether to keep going, so the copy has to work in scannable fragments, a headline that states the value proposition immediately, benefit-focused body text that translates a feature into an actual outcome, and a call-to-action written to get a click rather than just describe an option. This tool generates landing page copy structured that way, a headline, supporting body text, and calls-to-action, built around getting a visitor to act rather than simply informing them. Useful for drafting a headline that states a product's value proposition in one line, writing body copy that frames a feature as a concrete benefit, or generating a few call-to-action variants to test against each other.`,
    examples: [
      {
        title: 'Write a value-proposition headline',
        code: `Input: product: "expense tracking app for freelancers"\nOutput: "Know exactly what you owe in taxes, before April surprises you."`,
        note: 'States the value proposition in one scannable line.',
      },
      {
        title: 'Turn a feature into a benefit-focused line',
        code: `Input: feature: "automatic receipt scanning"\nOutput: "Snap a photo of a receipt and never manually log an expense again."`,
        note: 'Frames the feature as an outcome rather than just describing it.',
      },
    ],
  },

  'xml-formatter': {
    description: `XML enforces a stricter structural rule than most formats, every opening tag needs a matching closing tag with the exact same name, and a raw ampersand or angle bracket inside actual content has to be escaped as an entity or the parser fails outright, mistakes that are easy to introduce by hand and genuinely hard to spot in a wall of unformatted markup. This tool formats and validates XML, applying proper indentation with syntax highlighting and flagging a specific structural error, an unescaped character, a mismatched tag, the moment something breaks. Useful for pretty-printing a minified XML API response into something actually readable, catching a mismatched or unclosed tag before it breaks a downstream parser, or validating a hand-edited XML config file before it gets deployed.`,
    examples: [
      {
        title: 'Pretty-print a minified XML response',
        code: `Input: <root><item id="1">Widget</item></root>\nOutput:\n<root>\n  <item id="1">Widget</item>\n</root>`,
        note: 'Turns a single unreadable line into properly indented XML.',
      },
      {
        title: 'Catch a mismatched closing tag',
        code: `Input: <title>Report</header>\nResult: error - closing tag </header> does not match opening tag <title>`,
        note: 'Flags the exact tag mismatch instead of a generic parse failure.',
      },
    ],
  },

  'color-tint-generator': {
    description: `Building a consistent set of UI states from one brand color, a lighter shade for a hover state, a darker one for something pressed or active, isn't guesswork, it follows a specific color-theory ladder, a tint mixes the base color with white to lighten it, a shade mixes it with black to darken it, and stepping through that ladder in even increments produces the kind of full tonal scale a design system like Tailwind's color palettes are actually built from. This tool generates a full range of tints and shades from a single base color, in even steps from lightest to darkest. Useful for building a complete lightness scale from one brand color for a design system, generating a lighter tint for a hover state and a darker shade for an active one, or producing consistent tonal steps instead of picking lighter and darker variants by eye.`,
    examples: [
      {
        title: 'Build a hover-state tint',
        code: `Input: #2563EB\nOutput 20% tint: #5C89EF`,
        note: 'A lighter tint mixed toward white, suitable for a hover state.',
      },
      {
        title: 'Generate a full lightness scale',
        code: `Input: #2563EB\nOutput: 50 #EFF4FE, 300 #93B4F5, 500 #2563EB, 700 #1A46A8, 900 #0F2861`,
        note: 'Produces an even step scale from lightest tint to darkest shade.',
      },
    ],
  },

  'content-brief-generator': {
    description: `A finished article and the document a writer actually needs before starting one aren't the same thing at all, a brief has to lay out the target keyword, a suggested heading structure, a rough word count, and the specific questions a reader is searching for answers to, everything a writer needs to know before drafting a single sentence, rather than any of the sentences themselves. This tool generates that planning document, a structured, SEO-informed outline built around a target keyword rather than a finished piece of writing. Useful for handing a freelance writer a clear brief instead of a vague topic to figure out alone, outlining the heading structure an article should follow before any of it gets written, or specifying the related questions a piece of content actually needs to address to satisfy a search intent.`,
    examples: [
      {
        title: 'Outline a brief for a freelance writer',
        code: `Input: keyword: "best budget noise-canceling headphones"\nOutput: target word count: 1800, headings: [Intro, Top Picks, Buying Guide, FAQ]`,
        note: 'Gives a writer a structure to follow instead of a vague topic.',
      },
      {
        title: 'List questions a piece needs to answer',
        code: `Input: keyword: "how to compost at home"\nOutput: related questions: ["What can't you compost?", "How long does composting take?"]`,
        note: 'Surfaces the specific questions the content should address.',
      },
    ],
  },

  'text-line-deduplicator': {
    description: `Merging a few exported lists together, email addresses from two signup forms, URLs pulled from separate crawl reports, log lines collected from different runs, almost always introduces exact repeats, and simply sorting the combined list to spot them reshuffles everything into an order that no longer matches how the data actually arrived. This tool removes exact duplicate lines from a block of text while keeping every remaining line in its original order, based on where each one first appeared rather than resorting the whole list. Useful for merging two exported lists and removing exact repeats without scrambling the original order, cleaning up a combined URL list before a crawl without needing everything re-sorted, or deduplicating log lines from multiple files while keeping their original sequence intact.`,
    examples: [
      {
        title: 'Merge two lists without scrambling order',
        code: `Input:\njane@example.com\njohn@example.com\njane@example.com\nOutput:\njane@example.com\njohn@example.com`,
        note: 'Removes the exact repeat while keeping the first-seen order.',
      },
      {
        title: 'Deduplicate combined log lines',
        code: `Input: [log lines from two files, some overlapping]\nOutput: [unique lines only, original sequence preserved]`,
        note: 'Keeps the original sequence intact instead of resorting the list.',
      },
    ],
  },
};

export default FIX_BATCH_75;
