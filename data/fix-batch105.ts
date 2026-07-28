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

const FIX_BATCH_105: Record<string, FixBatchEntry> = {
  'network-port-scanner': {
    description: `Checking whether one specific, already-known port is open answers a narrow question, but figuring out what a host actually exposes in the first place, which of dozens of common service ports might be reachable without anyone realizing it, calls for scanning across a whole set of them at once rather than verifying one port already suspected. This tool scans common ports on a host to discover open services and check firewall accessibility, built around finding what's actually exposed rather than confirming one specific port already in mind. Useful for auditing a newly deployed server to see what's actually reachable before assuming a firewall configuration worked, discovering a database or an admin service accidentally left open to the public internet, or checking a host's overall exposure across common service ports rather than testing one port at a time.`,
    examples: [
      {
        title: 'Audit a newly deployed server',
        code: `Input: host: 203.0.113.42\nOutput: 22 (SSH) open, 80 (HTTP) open, 3306 (MySQL) open`,
        note: 'Scans a set of common ports rather than one already suspected.',
      },
      {
        title: 'Discover an accidentally exposed service',
        code: `Input: host: myserver.example.com\nOutput: 6379 (Redis) unexpectedly open to the public internet`,
        note: "Surfaces exposure nobody realized was reachable.",
      },
    ],
  },

  'number-to-words': {
    description: `A check's numeric amount and its written-out word amount exist specifically because digits are easy to alter, changing 100 to 1000 takes one added character, but changing 'one hundred' to 'one thousand' is a rewrite a forger can't slip past a human reader as easily, which is why banks treat the written words as the legally authoritative amount whenever the two don't actually match. This tool converts a number into human-readable words, producing the format checks and invoices actually rely on for that reason rather than just a curiosity. Useful for writing out a check's amount in the words a bank actually requires alongside the numeric figure, generating an invoice's total in word form for a formal document, or converting any number into a written-out phrase for a context where digits alone aren't considered sufficient.`,
    examples: [
      {
        title: "Write out a check's amount",
        code: `Input: 1542.75\nOutput: "One thousand five hundred forty-two and 75/100"`,
        note: 'Produces the legally authoritative wording banks actually require.',
      },
      {
        title: "Generate an invoice's total in words",
        code: `Input: 3200\nOutput: "Three thousand two hundred"`,
        note: 'Formats a total for a formal document rather than digits alone.',
      },
    ],
  },

  'open-graph-preview': {
    description: `The same Open Graph tags don't render identically everywhere, Facebook, LinkedIn, and a messaging app like iMessage or WhatsApp each crop the preview image, size the card, and truncate the title slightly differently, which means a link that looks fine on one platform can still show up cropped oddly or missing entirely somewhere else. This tool renders how a URL actually looks when shared across Facebook, LinkedIn, and messaging apps together, debugging OG tags by showing the real rendered result on each destination rather than a single generic preview. Useful for catching a preview that looks fine on Facebook but crops badly on LinkedIn, checking how a link actually appears in a messaging app before sharing it there, or debugging OG tags by comparing the same URL's rendered preview across several platforms at once.`,
    examples: [
      {
        title: 'Compare a preview across platforms',
        code: `Input: https://example.com/article\nOutput: Facebook: full image card | LinkedIn: cropped tighter | iMessage: compact summary`,
        note: 'Shows how the same tags render differently per destination.',
      },
      {
        title: 'Catch a preview missing on one platform',
        code: `Input: https://example.com/product\nOutput: og:image loads on Facebook, returns broken on LinkedIn`,
        note: 'Surfaces a platform-specific rendering problem before sharing.',
      },
    ],
  },

  'oxford-comma': {
    description: `'I'd like to thank my parents, Oprah and God' reads like Oprah and God are the parents, while 'my parents, Oprah, and God' clearly lists three separate things, the entire difference resting on one comma placed before the final 'and,' which is exactly the ambiguity the Oxford comma exists to resolve and exactly the kind of thing easy to miss scanning through a long list by eye. This tool automatically applies the Oxford comma rule to any list of items, pasted as comma-separated or newline-separated text, catching every instance consistently rather than relying on manually spotting each one. Useful for applying a consistent serial comma across a long list without checking each item by hand, fixing a document that mixes Oxford and non-Oxford lists inconsistently, or converting a newline-separated list into properly punctuated, comma-separated text with the rule already applied.`,
    examples: [
      {
        title: 'Apply the rule to a long list',
        code: `Input: apples, bananas, oranges and grapes\nOutput: apples, bananas, oranges, and grapes`,
        note: 'Catches every missing instance rather than one spotted by eye.',
      },
      {
        title: 'Convert a newline list into punctuated text',
        code: `Input:\nred\ngreen\nblue\nOutput: red, green, and blue`,
        note: 'Formats and applies the rule in the same pass.',
      },
    ],
  },

  'page-title-checker': {
    description: `A title tag written in a CMS draft and the title tag actually live on a published page aren't guaranteed to be the same thing, a template override, a plugin, or an unsaved edit can leave the deployed version different from whatever's assumed to be there, which only a check against the real, currently indexed page can actually catch. This tool checks a page's title length and quality directly from its live URL, evaluating what's genuinely deployed right now rather than text typed in and assumed to match. Useful for confirming a page's live title actually matches what was intended to be published, catching a template or plugin override that changed a title tag after the fact, or auditing an already-live page's title for length and quality without needing to know what the source content management system currently shows.`,
    examples: [
      {
        title: "Confirm a page's live title matches intent",
        code: `Input: https://example.com/blog/new-post\nOutput: live title: "New Post | Example Blog" (58 chars, within limit)`,
        note: 'Checks the deployed page directly rather than typed-in text.',
      },
      {
        title: 'Catch a template override after the fact',
        code: `Input: https://example.com/products/widget\nOutput: title differs from CMS draft - template appended site name twice`,
        note: 'Surfaces a mismatch between assumed and actually deployed content.',
      },
    ],
  },

  'palindrome-checker': {
    description: `'A man, a plan, a canal: Panama' only works as a palindrome once the comma, the colon, the spaces, and the case differences all get stripped away first, since a literal character-by-character reversal of the raw text would treat those as real differences and wrongly call a genuine phrase-level palindrome not one. This tool checks whether a word, a phrase, or a number reads the same forwards and backwards, normalizing punctuation, spacing, and case before comparing rather than reversing the raw text as typed. Useful for checking whether a full phrase is a genuine palindrome once punctuation and spacing are properly ignored, verifying a number reads the same both directions for a puzzle or a specific numeric property, or confirming a single word is a true palindrome without manually stripping formatting first.`,
    examples: [
      {
        title: 'Check a phrase-level palindrome',
        code: `Input: "A man, a plan, a canal: Panama"\nOutput: true (punctuation and case normalized before comparing)`,
        note: 'Strips formatting first rather than reversing raw text.',
      },
      {
        title: "Verify a number reads the same both ways",
        code: `Input: 12321\nOutput: true`,
        note: 'Works for numbers and puzzle-style checks, not just words.',
      },
    ],
  },

  'paragraph-counter': {
    description: `A web reader scans rather than reads top to bottom, which is exactly why a wall of unbroken text reads as more demanding than the same words split into shorter paragraphs, and average words per paragraph is a more direct measure of that pacing than a word-frequency count or a general readability score would capture on its own. This tool counts paragraphs, sentences, and average words per paragraph in any text, measuring structural pacing specifically rather than vocabulary or sentence-level complexity. Useful for checking whether an article's paragraphs are actually short enough for comfortable web reading, comparing the average paragraph length across a draft before and after an editing pass, or auditing a long document's structural pacing without it being buried among other, unrelated readability metrics.`,
    examples: [
      {
        title: 'Check paragraph pacing for web reading',
        code: `Input: [1200-word article]\nOutput: 18 paragraphs, avg 67 words/paragraph`,
        note: 'Flags a pacing issue a word-frequency count would miss.',
      },
      {
        title: 'Compare a draft before and after editing',
        code: `Before: 12 paragraphs, avg 95 words/paragraph\nAfter: 22 paragraphs, avg 52 words/paragraph`,
        note: 'Measures structural pacing directly across an edit.',
      },
    ],
  },

  paraphrasing: {
    description: `Fixing a sentence's grammar assumes something about it was actually wrong, and writing a new paragraph from a prompt starts from nothing at all, but restating a piece of text that's already complete and already correct, just in different words while keeping the same underlying meaning, is a genuinely different task from either one. This tool rephrases existing text while preserving its original meaning, built for restating something already written rather than correcting an error or generating new content from a topic. Useful for restating a source passage in different words to avoid a plagiarism or duplicate-content concern, rewording an already-correct paragraph that just needs a different phrasing for a different context, or paraphrasing a quote or a reference passage while keeping its actual meaning intact.`,
    examples: [
      {
        title: 'Restate a source passage to avoid duplication',
        code: `Input: "The study found that regular exercise improves sleep quality."\nOutput: "Research showed that consistent physical activity leads to better sleep."`,
        note: 'Preserves meaning without correcting or generating new content.',
      },
      {
        title: 'Reword a correct paragraph for a new context',
        code: `Input: [already-correct product description]\nOutput: [same meaning, reworded for a different audience]`,
        note: 'Restates text that had nothing actually wrong with it.',
      },
    ],
  },

  'percentage-calculator': {
    description: `Getting the right number out of a percentage calculation is one thing, but actually seeing the formula behind it, 15% of 80 worked out as 0.15 times 80, matters when the goal is checking your own manual math or actually learning the calculation rather than only wanting the final answer handed over. This tool calculates percentages, percentage change, discounts, tips, and markups together, showing the step-by-step formula behind each result rather than only the final number. Useful for checking a manual percentage calculation against the actual formula to see where it went wrong, calculating a tip or a discount instantly while still seeing the arithmetic behind the result, or learning how a specific percentage calculation actually works rather than just getting an answer with no explanation.`,
    examples: [
      {
        title: 'See the formula behind a result',
        code: `Input: 15% of 80\nOutput: 0.15 x 80 = 12`,
        note: 'Shows the arithmetic, not just the final number.',
      },
      {
        title: 'Calculate a tip with the math shown',
        code: `Input: bill: $64, tip: 18%\nOutput: 0.18 x 64 = $11.52 tip, total: $75.52`,
        note: 'Useful for checking manual math against the actual formula.',
      },
    ],
  },

  'photo-metadata-remover': {
    description: `A phone photo carries its GPS coordinates embedded directly in its EXIF data by default, which means a picture taken at home and posted publicly can reveal an exact home address to anyone who knows to check, a detail most people never realize is riding along inside the file until after it's already been shared somewhere. This tool strips EXIF and other metadata from photos specifically to protect privacy before sharing online, removing that embedded location and device data before a personal photo goes public. Useful for stripping GPS coordinates out of a phone photo before posting it on social media, removing embedded device and location data from a personal photo shared in a group chat, or cleaning metadata from any photo before it goes somewhere public where that information shouldn't travel along with it.`,
    examples: [
      {
        title: 'Strip GPS data before posting to social media',
        code: `Input: vacation-photo.jpg (GPS: 40.7128, -74.0060)\nOutput: vacation-photo.jpg (no location data)`,
        note: 'Removes an exact location most people never notice is embedded.',
      },
      {
        title: 'Remove device data before sharing in a group chat',
        code: `Input: family-photo.jpg\nOutput: family-photo.jpg (EXIF and device metadata stripped)`,
        note: "Keeps embedded details from traveling with a personal photo.",
      },
    ],
  },
};

export default FIX_BATCH_105;
