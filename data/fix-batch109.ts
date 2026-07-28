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

const FIX_BATCH_109: Record<string, FixBatchEntry> = {
  'robots-txt-tester': {
    description: `Whether a specific page is crawlable isn't a single answer, since a rule might block Googlebot from a path while leaving it open to Bingbot, or block everything except one named crawler explicitly allowed through, which means the real question is never just 'is this blocked' but 'is this blocked for this specific user-agent.' This tool tests robots.txt rules against a specific URL to verify exactly which crawler access permissions actually apply to it, checking one path against the rules the way a search engine's own crawler would evaluate it rather than reading the file as a whole. Useful for confirming whether a specific page is actually blocked for Googlebot before assuming a rule covers it, checking a URL's crawl permissions against a specific named user-agent rather than a generic wildcard rule, or verifying a new Disallow rule targets exactly the path it was meant to before it goes live.`,
    examples: [
      {
        title: 'Check crawl access for a specific user-agent',
        code: `Input: URL: /checkout/, user-agent: Googlebot\nOutput: allowed`,
        note: 'Answers access for one named crawler, not a generic check.',
      },
      {
        title: 'Verify a new Disallow rule targets the right path',
        code: `Input: URL: /admin/settings, rule: Disallow: /admin/\nOutput: blocked`,
        note: 'Tests one URL against the rules before the change goes live.',
      },
    ],
  },

  'robots-txt-validator': {
    description: `A typo in a directive, Dissalow instead of Disallow, a missing colon, a Sitemap URL that isn't actually absolute, doesn't throw an error anywhere a person would notice, a crawler just silently ignores or misinterprets the malformed line, which means a robots.txt file can look complete and still be quietly broken in a way that never surfaces until crawl behavior stops matching what the file was supposed to say. This tool validates robots.txt syntax and checks for common errors and misconfigurations, catching a malformed directive itself rather than testing what a specific URL is allowed to do or auditing an already-working file's overall directives. Useful for catching a typo'd directive before it silently gets ignored by every crawler that reads it, validating a Sitemap URL is actually formatted as an absolute address, or checking a robots.txt file's syntax is technically correct before it goes live.`,
    examples: [
      {
        title: "Catch a typo'd directive",
        code: `Input: Dissalow: /admin/\nOutput: error - "Dissalow" is not a recognized directive (did you mean "Disallow"?)`,
        note: 'Flags a mistake a crawler would otherwise silently ignore.',
      },
      {
        title: 'Validate a Sitemap URL is absolute',
        code: `Input: Sitemap: /sitemap.xml\nOutput: error - Sitemap URL must be absolute (https://example.com/sitemap.xml)`,
        note: "Checks the file's own syntax, not what a URL is allowed to do.",
      },
    ],
  },

  'roman-numeral-converter': {
    description: `IIII isn't a valid way to write four, IV is, and Roman numerals follow specific formation rules about which combinations are actually allowed and how many times a numeral can repeat in a row, which means a Roman numeral copied from an old book, a movie's copyright year, or a clock face might not actually be correctly formed at all, something a naive character-by-character parser would never catch. This tool converts numbers to Roman numerals and back, with validation confirming an existing Roman numeral is actually correctly formed rather than assuming whatever's typed in follows the real rules. Useful for checking whether a Roman numeral seen on a clock face or a book's copyright page is actually valid formatting, catching a mistake in a hand-typed Roman numeral before it's used somewhere, or converting a number into properly formatted Roman numerals rather than an invalid combination that happens to look plausible.`,
    examples: [
      {
        title: 'Validate an existing Roman numeral',
        code: `Input: IIII\nOutput: invalid - correct formation is IV`,
        note: 'Catches a malformed numeral a naive parser would accept.',
      },
      {
        title: 'Convert a number to Roman numerals',
        code: `Input: 1994\nOutput: MCMXCIV`,
        note: 'Applies correct subtractive notation rather than a plausible guess.',
      },
    ],
  },

  rotate: {
    description: `Fixing a photo that's sideways or upside down needs a clean 90 or 180 degree turn, but a scanned document that wasn't quite aligned on the scanner bed, or a photo shot slightly tilted, needs something a fixed preset can't provide, a specific, arbitrary angle correction like two or three degrees rather than a round number. This tool rotates an image by 90, 180, or a custom angle, covering both the clean preset turn a sideways photo needs and the precise small-angle correction a slightly crooked scan or shot actually requires. Useful for fixing a photo that's clearly sideways or upside down with a quick preset turn, correcting a scanned document that came out just slightly crooked with a precise custom angle, or straightening a tilted shot by a specific number of degrees rather than rounding to the nearest 90.`,
    examples: [
      {
        title: 'Fix a sideways photo with a preset turn',
        code: `Input: photo.jpg (sideways), rotate: 90deg\nOutput: photo-rotated.jpg (upright)`,
        note: 'A clean preset angle for a clearly sideways or upside-down photo.',
      },
      {
        title: 'Straighten a slightly crooked scan',
        code: `Input: scan.jpg, rotate: 2.4deg\nOutput: scan-straightened.jpg`,
        note: "A precise custom angle a 90/180 preset can't provide.",
      },
    ],
  },

  'scientific-notation-converter': {
    description: `A number like 0.0000000000667 is hard to read, type accurately, or compare against another tiny value at a glance, and converting it correctly into scientific notation means counting exactly how many places the decimal point actually moves, a count that's easy to be off by one on, which turns a correct conversion into a value ten times too large or too small without the mistake being obvious. This tool converts between decimal and scientific notation with a step-by-step calculation display, showing exactly how many places the decimal shifted and why rather than just returning a final converted value. Useful for double-checking a manual scientific notation conversion didn't miscount the exponent by one, learning exactly how the decimal shift works rather than just seeing an answer, or converting an awkwardly long decimal into a readable scientific notation value with the reasoning shown alongside it.`,
    examples: [
      {
        title: 'Convert a tiny decimal with the shift shown',
        code: `Input: 0.0000000000667\nOutput: 6.67 x 10^-11 (decimal shifted 11 places right)`,
        note: 'Shows the exact shift count rather than only the final value.',
      },
      {
        title: 'Double-check a manual conversion',
        code: `Input: 45,000,000 -> claimed: 4.5 x 10^7\nOutput: confirmed - decimal shifted 7 places left`,
        note: 'Catches an exponent off by one before it goes unnoticed.',
      },
    ],
  },

  'screen-density-simulator': {
    description: `A logo that looks perfectly crisp on a standard display can look noticeably soft or pixelated on a high-DPI screen that packs more physical pixels into the same visual space, since a low-resolution image asset simply doesn't have enough actual pixel detail to fill that denser grid cleanly, a sharpness problem that has nothing to do with how a page's layout reflows at different widths. This tool simulates how a website looks across screens with different DPI and pixel densities, testing image and asset sharpness specifically rather than layout structure at different viewport sizes. Useful for checking whether a logo or an icon actually holds up sharp on a high-DPI display before it ships, catching a low-resolution image asset that looks fine on a standard screen but pixelates on a denser one, or testing how crisp a design's fine details stay across screens with meaningfully different pixel densities.`,
    examples: [
      {
        title: 'Check a logo across DPI levels',
        code: `Input: logo.png, simulate: 1x, 2x, 3x DPI\nOutput: crisp at 1x, visibly soft at 3x`,
        note: 'Tests sharpness, not how the layout itself reflows.',
      },
      {
        title: 'Catch a low-res asset before it ships',
        code: `Input: icon-set.png, simulate: high-DPI display\nOutput: pixelation visible at retina density`,
        note: 'Surfaces a sharpness problem invisible on a standard screen.',
      },
    ],
  },

  'screen-resolution-tester': {
    description: `Whether a navigation menu collapses into a hamburger icon at the right width, or a three-column layout properly drops to one column on a narrower screen, is a question about how a page's structure reflows across different viewport sizes, a layout and breakpoint concern that's completely separate from how sharp an individual image looks on a dense pixel grid. This tool previews any viewport size with device presets for responsive design testing, checking layout structure and breakpoint behavior specifically rather than pixel density or image sharpness. Useful for confirming a navigation menu actually collapses at the intended breakpoint before shipping a responsive layout, checking how a multi-column grid reflows across a range of device widths, or previewing a page at a specific viewport size to catch a layout that breaks somewhere between two device presets.`,
    examples: [
      {
        title: 'Confirm a menu collapses at the right breakpoint',
        code: `Input: viewport: 768px\nOutput: nav menu collapses into hamburger icon as expected`,
        note: 'Checks layout reflow, not pixel-level sharpness.',
      },
      {
        title: 'Catch a layout break between presets',
        code: `Input: viewport: 850px (between tablet and desktop presets)\nOutput: three-column grid overlaps at this width`,
        note: 'Surfaces a gap standard device presets alone would miss.',
      },
    ],
  },

  'secure-random-generator': {
    description: `Math.random isn't built for anything security-sensitive, its output can, depending on the implementation, be predicted after observing enough prior values, which is a real problem the moment a random value is actually protecting something, a password reset token, a session identifier, an encryption key, rather than just needing to look random or avoid an accidental collision. This tool generates cryptographically secure random strings, numbers, UUIDs, and bytes using a proper CSPRNG rather than a standard pseudo-random generator, built specifically for values where predictability would actually be a vulnerability. Useful for generating a session token or a password reset code that needs to resist prediction rather than just look random, creating an encryption key or another security-sensitive value with a real cryptographic guarantee behind it, or generating random bytes for a use case where a standard random function's weaker guarantees genuinely aren't good enough.`,
    examples: [
      {
        title: 'Generate a password reset token',
        code: `Input: type: string, length: 32\nOutput: cryptographically secure token, resistant to prediction`,
        note: 'Uses a CSPRNG rather than a standard pseudo-random function.',
      },
      {
        title: 'Generate random bytes for an encryption key',
        code: `Input: type: bytes, length: 256 bits\nOutput: securely random byte sequence`,
        note: "Built for values where predictability is a real vulnerability.",
      },
    ],
  },

  'sentence-counter': {
    description: `A paragraph built almost entirely from long, winding sentences reads as dense and demanding in a way a character-composition breakdown or a paragraph-level word count wouldn't actually capture, since average sentence length is its own distinct signal about how writing actually feels to read at the sentence level specifically. This tool counts sentences, words, and characters with average sentence length analysis, measuring that specific stylistic signal rather than character-type composition or paragraph-level pacing. Useful for checking whether a draft has drifted toward long, run-on sentences that make it feel denser than intended, confirming a piece of writing stays under an editorial guideline's target average sentence length, or comparing how sentence length varies across two different drafts of the same piece.`,
    examples: [
      {
        title: 'Check for run-on sentence drift',
        code: `Input: [1,000-word draft]\nOutput: 42 sentences, avg 23.8 words/sentence`,
        note: 'Measures a stylistic signal distinct from paragraph pacing.',
      },
      {
        title: 'Compare sentence length across two drafts',
        code: `Draft 1: avg 14 words/sentence\nDraft 2: avg 21 words/sentence`,
        note: 'Surfaces a density difference a word count alone would miss.',
      },
    ],
  },

  'sentence-rewriter': {
    description: `One specific sentence sitting awkwardly in an otherwise solid paragraph doesn't need the whole passage reworked or a plagiarism-avoidance rewrite of an entire source text, it needs a targeted fix to just that sentence's clarity and flow, leaving everything around it untouched. This tool rewrites individual sentences with AI to improve clarity and flow, operating at the single-sentence level rather than restating a whole passage or correcting grammar and style across an entire document. Useful for fixing one clunky sentence in an otherwise finished paragraph without reworking anything around it, improving a specific sentence's flow when it reads awkwardly despite being grammatically correct, or rewriting a single sentence for clarity without touching the rest of an already-solid draft.`,
    examples: [
      {
        title: 'Fix one clunky sentence in place',
        code: `Input: "The reason for the delay was because of the fact that shipping was late."\nOutput: "The delay happened because shipping was late."`,
        note: 'Targets one sentence, leaving the surrounding paragraph untouched.',
      },
      {
        title: 'Improve flow without a grammar error present',
        code: `Input: "It is important to note that the results were, in a sense, somewhat inconclusive."\nOutput: "The results were largely inconclusive."`,
        note: 'Fixes flow on an already grammatically correct sentence.',
      },
    ],
  },
};

export default FIX_BATCH_109;
