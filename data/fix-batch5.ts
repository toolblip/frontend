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

const FIX_BATCH_5: Record<string, FixBatchEntry> = {
  'english-collocations-checker': {
    description: `Grammar checkers catch broken sentences, but they miss a subtler problem: word pairings that are grammatically fine yet sound off to a native speaker. "Do a decision" is perfectly correct grammar, but nobody who grew up speaking English would say it that way, they'd say "make a decision." This tool scans text for exactly that kind of mismatch, flagging word combinations that technically parse but don't match how the pairing is actually used, then suggesting the version a native speaker would reach for instead. It targets the gap between technically correct and naturally worded, which matters most for someone writing in a second language, a cover letter, a business email, an academic paper, where every individual word is right but a handful of pairings quietly signal non-native phrasing to anyone reading closely.`,
    examples: [
      {
        title: 'Catch an unnatural verb-noun pairing',
        code: `Input: "We need to do a decision by Friday."\nFlagged: "do a decision"\nSuggestion: "make a decision"`,
        note: 'Grammatically valid but not how a native speaker would phrase it.',
      },
      {
        title: 'Fix an adjective-noun mismatch',
        code: `Input: "The company suffered a strong loss last quarter."\nFlagged: "strong loss"\nSuggestion: "heavy loss" or "significant loss"`,
        note: '"Strong" pairs naturally with growth or performance, not with loss.',
      },
    ],
  },

  'color-palette-generator': {
    description: `Pick one color and this tool works out the rest using actual color theory instead of guessing: complementary colors from directly across the color wheel, analogous ones sitting close beside your base color, a triadic set spaced evenly around the wheel, or a monochromatic run of tints and shades of the same hue. Every generated color comes back with its hex and RGB values ready to paste into CSS or a design file. That's a different starting point than pulling colors out of an existing photo; here you choose the anchor color first, maybe a brand's primary blue, and build an entire coordinated palette around it rather than reverse-engineering one from an image you already have. Useful for picking accent and secondary colors for a brand that only has one official color defined so far.`,
    examples: [
      {
        title: 'Build a complementary accent from a brand color',
        code: `Input: #2563EB (brand blue), scheme: complementary\nOutput: #EB6425 (accent)`,
        note: 'Picks the color directly opposite the base on the color wheel for maximum contrast.',
      },
      {
        title: 'Generate a monochromatic set for a UI',
        code: `Input: #2563EB, scheme: monochromatic\nOutput: #0F3B99, #2563EB, #5B8DEF, #A9C6F7, #E4EEFC`,
        note: 'Produces tints and shades of the same hue for buttons, hover states, and related backgrounds.',
      },
    ],
  },

  'weight-converter': {
    description: `A UK bathroom scale reads in stone, a US recipe calls for ounces, a parcel's shipping label wants kilograms, and a gym program found online tracks progress in pounds, four different units for the same basic idea of how heavy something is. This tool converts between kilograms, pounds, ounces, grams, and stone in either direction, so a number in one system actually means something in whichever unit you think in day to day. Useful for figuring out what a weight in stone translates to in pounds after visiting a UK doctor's office, converting a recipe's ounce measurement into grams for a kitchen scale that only reads metric, or checking a package's kilogram weight against a shipping calculator that only accepts pounds.`,
    examples: [
      {
        title: "Convert a UK doctor's reading to pounds",
        code: `Input: 12 stone 4 pounds\nOutput: 172 lbs | 78.02 kg`,
        note: 'Stone readings are common in UK and Irish medical contexts but rarely used elsewhere.',
      },
      {
        title: 'Convert a recipe ounce measurement to grams',
        code: `Input: 8 oz\nOutput: 226.8 g`,
        note: 'Useful when a recipe lists ounces but your kitchen scale only reads in grams.',
      },
    ],
  },

  sign: {
    description: `Printing a contract just to sign it and scan it back in is the kind of extra step nobody has time for anymore. This tool adds a signature straight onto a PDF three different ways: draw one with a mouse or trackpad, type a name and have it rendered in a script-style font, or upload a photo of a signature already written on paper. Position it exactly where it needs to go on the page, resize it to fit the signature line, and export a signed PDF ready to send back. The typed option is fastest when the exact look of the signature doesn't matter much, an internal form, a quick acknowledgment. The upload option matters more for anything where a consistent, recognizable signature counts, a lease, a client contract, a document that might get compared against one on file elsewhere.`,
    examples: [
      {
        title: 'Sign a lease with an uploaded signature',
        code: `Input: lease.pdf, signature-photo.png (scanned handwritten signature)\nOutput: lease-signed.pdf (signature placed on page 4, signature line)`,
        note: 'Keeps a consistent signature that matches what might already be on file elsewhere.',
      },
      {
        title: 'Quickly acknowledge an internal form',
        code: `Input: acknowledgment-form.pdf, typed name: "Alex Rivera" (script font)\nOutput: acknowledgment-form-signed.pdf`,
        note: "Fastest option when the document doesn't need to match a specific handwritten signature.",
      },
    ],
  },

  'flesch-kincaid-calculator': {
    description: `The Flesch-Kincaid formulas turn two measurable things, how many words are packed into an average sentence and how many syllables are packed into an average word, into two numbers describing how hard a piece of writing actually is to read. This tool calculates both from that same math: a reading ease score from 0 to 100, where higher means simpler (a young adult novel typically lands in the 70s and 80s, dense academic writing much lower), and a grade level, an estimate of the US school grade a reader would need to follow the text comfortably. Paste in an article, a policy document, or marketing copy, and get both numbers back immediately. Useful for checking a public-facing page isn't accidentally written at a graduate-school level, or confirming a children's book actually matches the age group it's aimed at.`,
    examples: [
      {
        title: 'Check if marketing copy reads too dense',
        code: `Input: "Our platform leverages a distributed architecture to optimize throughput across heterogeneous workloads."\nEase: 12 (very difficult)\nGrade level: 18+ (graduate level)`,
        note: 'A score this low signals copy that will lose most general readers immediately.',
      },
      {
        title: "Confirm a children's book matches its age group",
        code: `Input: "The little fox ran fast. He wanted to find his mom."\nEase: 96 (very easy)\nGrade level: 2`,
        note: 'Short sentences and simple words push both scores toward the easy end of the scale.',
      },
    ],
  },

  'ipynb-formatter': {
    description: `A Jupyter notebook file is really just JSON underneath, but Jupyter doesn't always save that JSON in a clean, consistent order, and every time a cell runs, its output, sometimes including a base64-encoded image, gets baked directly into the file. Commit that to git and a one-line code change can produce a diff hundreds of lines long, full of noise nobody actually wants to review. This tool pretty-prints a notebook's underlying JSON with consistent indentation and predictable cell ordering, which makes the structure genuinely readable and, more importantly, makes future diffs in version control far smaller and easier to read. Run a messy .ipynb file through it before committing, and reviewers see what actually changed in the code instead of scrolling past reformatted whitespace or a re-encoded output blob.`,
    examples: [
      {
        title: 'Clean a notebook before committing to git',
        code: `Input: analysis.ipynb (inconsistent indentation, unsorted cell metadata)\nOutput: analysis.ipynb (consistent 2-space indent, cells in execution order)`,
        note: 'Produces a much smaller, more reviewable diff on the next commit.',
      },
      {
        title: "Inspect a notebook's raw structure",
        code: `Input: model-training.ipynb\nOutput: pretty-printed JSON with cell_type, source, and outputs fields clearly separated`,
        note: 'Useful for debugging a corrupted or oddly structured notebook file by hand.',
      },
    ],
  },

  'http-status-ref': {
    description: `Knowing there are HTTP status codes is one thing; knowing whether a failed login should return 401 or 403, or whether a moved endpoint needs a 301 or a 308, is a different and more specific problem that comes up constantly while writing API error handling. This tool is a browsable reference for every standard status code, organized by category, informational, success, redirection, client error, server error, with a plain-language explanation of what each one signals and when it's the semantically correct choice rather than just a code that happens to work. Useful for settling a debate over the right code for a specific edge case, double-checking a redirect type before shipping an API change, or looking up what an unfamiliar code like 425 or 507 actually means when it shows up in a log.`,
    examples: [
      {
        title: 'Decide between 401 and 403 for a failed request',
        code: `Lookup: 401 Unauthorized -> "no valid authentication provided"\nLookup: 403 Forbidden -> "authenticated, but not permitted to access this resource"`,
        note: 'The distinction matters for whether a client should prompt for login again or show an access-denied message.',
      },
      {
        title: 'Check the right redirect code for a moved endpoint',
        code: `Lookup: 301 Moved Permanently -> "may change request method to GET"\nLookup: 308 Permanent Redirect -> "preserves the original request method"`,
        note: 'A POST request redirected with 301 can silently become a GET in some clients, which 308 avoids.',
      },
    ],
  },

  'image-flip-tool': {
    description: `A flip and a rotation aren't the same operation, even though people use the words interchangeably. Rotating turns an image around its center; flipping mirrors it across an axis, so left and right, or top and bottom, swap places while nothing actually turns. This tool does the mirroring specifically: horizontal flip for left-right, vertical flip for top-bottom, with the result ready to download immediately. It comes up in a few specific situations: a scanned negative or slide that came out reversed and needs correcting, a product mockup where a design needs to face the opposite direction to match a left-handed template, or a logo that needs to sit mirrored inside a layout without anyone manually redrawing it. Pick the direction, preview the change, and download the flipped version without opening a full image editor for what's really a one-click adjustment.`,
    examples: [
      {
        title: 'Correct a reversed scanned negative',
        code: `Input: old-photo-scan.jpg (scanned from a reversed negative)\nOutput: old-photo-scan-flipped.jpg (horizontal flip)`,
        note: 'Negatives scanned backward produce a mirror image of the original scene.',
      },
      {
        title: 'Flip a design for a left-facing product mockup',
        code: `Input: bottle-label.png, flip: horizontal\nOutput: bottle-label-mirrored.png`,
        note: 'Matches a mockup template where the product faces the opposite direction from the original artwork.',
      },
    ],
  },

  'regex-pattern-builder': {
    description: `Writing a regex for something as common as an email address or a phone number from scratch means remembering exactly which characters need escaping and how greedy each quantifier should be, and getting it slightly wrong produces a pattern that looks right but misses real-world edge cases. This tool starts from the other direction: pick a common target, email, phone number, URL, date, and it builds a working pattern for that specific case, which can then be tweaked, allow an optional country code on the phone pattern, or restrict the date pattern to a specific format, without writing the character classes from nothing. It's a different job than testing a pattern already written or having one explained after the fact; this builds the starting pattern itself, so you begin from something that already works instead of debugging a blank regex line by line.`,
    examples: [
      {
        title: 'Generate a pattern for validating email input',
        code: `Preset: Email\nOutput: ^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$`,
        note: 'Starts from a working pattern instead of hand-writing the character classes.',
      },
      {
        title: 'Build a phone number pattern with an optional country code',
        code: `Preset: Phone (US), optional country code: on\nOutput: ^(\\+1[\\s-]?)?\\(?\\d{3}\\)?[\\s-]?\\d{3}[\\s-]?\\d{4}$`,
        note: 'Toggling the option adjusts the generated pattern instead of rewriting it manually.',
      },
    ],
  },

  'meta-description-checker': {
    description: `Google doesn't actually enforce a strict character limit on a meta description, it truncates based on rendered pixel width, which means a description packed with wide capital letters can get cut off earlier than the character count alone would suggest, while one with narrow lowercase letters might fit a few characters more. This tool checks a description against that practical limit, flags it as too short to be useful, too long and likely to be truncated in search results, or landing in the range that displays fully, and also looks at whether it reads like something a person would actually want to click rather than a dry restatement of the page title. Paste in a description before publishing, and catch a truncation problem before it shows up cut off mid-sentence in an actual Google search result.`,
    examples: [
      {
        title: 'Check a description that will get truncated',
        code: `Input: "Our comprehensive guide covers everything you need to know about widget maintenance, troubleshooting, and long-term care for industrial equipment owners."\nLength: 178 characters\nResult: likely truncated in search results`,
        note: 'Exceeds the practical pixel-width limit even though the character count looks reasonable.',
      },
      {
        title: 'Confirm a description fits and reads well',
        code: `Input: "Fix a squeaky hinge in five minutes with this step-by-step guide, no tools required."\nLength: 87 characters\nResult: fits fully, clear call to action`,
        note: 'Short enough to display in full and specific enough to earn a click.',
      },
    ],
  },
};

export default FIX_BATCH_5;
