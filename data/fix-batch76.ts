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

const FIX_BATCH_76: Record<string, FixBatchEntry> = {
  'website-age-checker': {
    description: `A site claiming years of experience is worth checking against when it actually started existing, since a domain registered eighteen months ago telling visitors it's been trusted since 2003 is a credibility red flag worth catching before working with that business or linking to it, a very different concern from simply tracking a domain's registration and renewal dates for portfolio management. This tool looks up when a domain first came online and surfaces that creation date for exactly this kind of due-diligence check. Useful for verifying an unfamiliar business's actual history before a partnership or a guest post exchange, checking whether a site's claimed founding date lines up with its domain's real age, or gauging how established a competitor's site actually is during SEO research.`,
    examples: [
      {
        title: 'Verify a claimed founding date',
        code: `Input: example.com, homepage claims "trusted since 2003"\nOutput: domain created 2024-11 (21 months old)`,
        note: "Flags a mismatch between a claimed history and the domain's actual age.",
      },
      {
        title: 'Research a site before a guest post exchange',
        code: `Input: partner-blog.com\nOutput: domain age: 6 years, first seen: 2020-03`,
        note: 'Gives a quick credibility signal before agreeing to an outreach exchange.',
      },
    ],
  },

  'email-validator': {
    description: `An email address can look perfectly valid, correct syntax, a plausible domain, an @ symbol in the right place, and still bounce the moment something is actually sent to it, because a typo'd domain like gmial.com passes every formatting check while having no mail server configured to receive anything at all. This tool checks an email address's format and then looks up whether its domain actually has MX records configured, catching the gap between looking valid and being deliverable. Useful for catching a mistyped domain before it silently bounces a signup confirmation, checking a list of collected addresses for ones with no mail server behind them, or confirming a business email domain is actually set up to receive mail before relying on it.`,
    examples: [
      {
        title: "Catch a typo'd domain with no mail server",
        code: `Input: jane@gmial.com\nOutput: valid format, no MX record found`,
        note: "Flags an address that looks correct but can't actually receive mail.",
      },
      {
        title: 'Confirm a business domain accepts mail',
        code: `Input: contact@acmecorp.com\nOutput: valid format, MX records found (2)`,
        note: 'Confirms the domain is actually configured to receive email.',
      },
    ],
  },

  'xml-sitemap-generator': {
    description: `Search engines expect an XML sitemap in a specific structure, a urlset with the correct namespace declared, each entry wrapped in its own url tag, a lastmod date in proper W3C datetime format, a priority value that has to fall between 0.0 and 1.0, and a hand-written sitemap that gets even one of those details wrong can end up silently ignored rather than flagged as broken. This tool generates a valid XML sitemap from a list of URLs, formatting each entry correctly so search engines can parse and crawl it without guessing at malformed markup. Useful for generating a sitemap for a site that doesn't have one yet, producing correctly formatted lastmod and priority values instead of guessing at the right syntax, or building a sitemap quickly after a batch of new pages goes live.`,
    examples: [
      {
        title: 'Generate a sitemap from a URL list',
        code: `Input: example.com/, example.com/about, example.com/blog\nOutput: <urlset>...<url><loc>https://example.com/</loc><priority>1.0</priority></url>...</urlset>`,
        note: 'Produces correctly namespaced XML instead of a hand-rolled guess.',
      },
      {
        title: 'Set lastmod in the correct date format',
        code: `Input: page updated 2026-07-20\nOutput: <lastmod>2026-07-20</lastmod>`,
        note: 'Uses the W3C datetime format search engines actually expect.',
      },
    ],
  },

  'ai-detector': {
    description: `AI-generated text tends to pick the statistically most predictable next word more often than a person naturally does, and it tends to keep sentence length and complexity more even throughout a passage, two measurable patterns, sometimes called perplexity and burstiness, that a detector actually looks for rather than anything about whether the writing itself is good or bad. This tool analyzes a piece of text for those patterns and estimates how likely it is to have been generated by a model like ChatGPT, Claude, or Gemini rather than written by a person. Useful for screening a submitted piece of writing before publishing it under a human byline, checking whether a suspicious review or comment shows the statistical fingerprint of generated text, or spot-checking a document before accepting it as originally written.`,
    examples: [
      {
        title: 'Screen a submission before publishing',
        code: `Input: [800-word guest post draft]\nOutput: 78% likely AI-generated (low sentence variation, high word predictability)`,
        note: 'Flags the specific statistical patterns behind the estimate.',
      },
      {
        title: 'Check a suspicious review',
        code: `Input: [product review comment]\nOutput: 34% likely AI-generated`,
        note: 'Lower scores reflect more natural variation in sentence structure.',
      },
    ],
  },

  'passive-voice-detector': {
    description: `Passive voice isn't a grammar mistake, "the ball was thrown" is a perfectly valid sentence, but it does something subtle that active voice doesn't, it lets a sentence describe an action while leaving out who actually did it, which reads as vague or evasive in writing that should be direct, and clear, confident prose leans active far more often than not. This tool scans text for passive constructions and suggests an active voice rewrite for each one it finds. Useful for tightening a draft that reads as vague about who's actually responsible for an action, catching passive phrasing that crept in during a first draft, or rewriting a sentence like "mistakes were made" into one that actually states who made them.`,
    examples: [
      {
        title: 'Rewrite a vague passive sentence',
        code: `Input: "Mistakes were made during the rollout."\nSuggestion: "The team made mistakes during the rollout."`,
        note: 'Restores who actually performed the action.',
      },
      {
        title: 'Catch passive phrasing in a draft',
        code: `Input: "The report was reviewed by the committee."\nSuggestion: "The committee reviewed the report."`,
        note: 'Flags passive construction even when it reads smoothly.',
      },
    ],
  },

  'cron-generator-dg': {
    description: `Cron syntax packs five fields, minute, hour, day of month, month, day of week, into a compact string that's genuinely hard to read at a glance, and getting a schedule like "every weekday at 9am" translated correctly into "0 9 * * 1-5" by hand invites an off-by-one mistake in exactly the field that decides when a job actually runs. This tool builds a cron schedule through a point-and-click interface, selecting the actual days, hours, and intervals directly rather than composing the five-field string from memory, and shows the resulting expression in plain, human-readable terms. Useful for building a recurring job's schedule without memorizing cron field order, translating "every weekday at 9am" into the correct expression without counting fields by hand, or double-checking a schedule reads back in plain English before it's deployed.`,
    examples: [
      {
        title: 'Build "every weekday at 9am" visually',
        code: `Selected: days: Mon-Fri, time: 09:00\nOutput: 0 9 * * 1-5`,
        note: 'Builds the expression from selections instead of counting fields by hand.',
      },
      {
        title: 'Read a schedule back in plain English',
        code: `Input: 0 9 * * 1-5\nOutput: "At 9:00 AM, Monday through Friday"`,
        note: 'Confirms the schedule reads correctly before it gets deployed.',
      },
    ],
  },

  'hash-collision-finder': {
    description: `Two different inputs producing the exact same hash output is called a collision, and whether that's realistically findable says a lot about how broken a hash function actually is, MD5 has practical, publicly demonstrated collisions, SHA-1 has its own published collision attack, while SHA-256 has none found within any remotely practical search, a genuinely different security posture across three algorithms often lumped together as roughly equivalent. This tool searches for actual hash collisions among short inputs across MD5, SHA-1, and SHA-256, demonstrating in practice rather than in theory which of these algorithms can still be broken this way. Useful for showing concretely why MD5 is considered unsuitable for security purposes, illustrating SHA-1's known weakness with an actual generated collision, or confirming that SHA-256 resists the same short-input search that breaks the other two.`,
    examples: [
      {
        title: 'Find an MD5 collision',
        code: `Input: search space: 6-character strings, algorithm: MD5\nOutput: "aB3xQ1" and "kP9zR4" both hash to 0e1234...`,
        note: 'Demonstrates a practical collision within a small search space.',
      },
      {
        title: 'Confirm SHA-256 resists the same search',
        code: `Input: search space: 6-character strings, algorithm: SHA-256\nOutput: no collision found`,
        note: 'Shows the same short-input search fails against a stronger algorithm.',
      },
    ],
  },

  'svg-minifier': {
    description: `An SVG exported straight from a design tool like Illustrator or Figma usually carries a lot of dead weight that has nothing to do with how it actually looks, editor-specific metadata, unused IDs left over from deleted layers, coordinate values carried out to far more decimal precision than the eye could ever perceive, comments, and indentation, all of it adding size without changing a single visible pixel. This tool strips that unnecessary content out of an SVG file, removing excess attributes, comments, and whitespace while keeping the rendered image pixel-identical. Useful for shrinking an icon exported from a design tool before it ships in production, cleaning out editor metadata that has no effect on how a graphic renders, or trimming excess coordinate precision from a path without altering its visible shape.`,
    examples: [
      {
        title: 'Strip design-tool metadata from an icon',
        code: `Input: icon.svg (12 KB, exported from Figma)\nOutput: icon.svg (3 KB, visually identical)`,
        note: 'Removes editor metadata without changing a single visible pixel.',
      },
      {
        title: 'Trim excess coordinate precision',
        code: `Input: <path d="M12.000000123 8.999999881 ..."/>\nOutput: <path d="M12 9 ..."/>`,
        note: 'Rounds unnecessary decimal precision without altering the visible shape.',
      },
    ],
  },

  'random-paragraph-generator': {
    description: `A layout that looks fine with one tidy, predictable paragraph can break in ways that only show up once the actual content varies, an unusually long paragraph overflowing a card, a short one leaving an awkward gap, exactly the kind of variation a fixed word-count placeholder never actually tests for. This tool generates paragraphs of randomized length and structure each time it runs, rather than a precise, custom-configured word count, so a mockup gets stress-tested against genuinely unpredictable content instead of one convenient, uniform block of text. Useful for checking how a card layout holds up against a paragraph that's unexpectedly long, prototyping a page design against several differently sized blocks of filler text in a row, or catching a layout bug that only appears once content length actually varies.`,
    examples: [
      {
        title: 'Stress-test a card layout',
        code: `Output run 1: 2-sentence paragraph\nOutput run 2: 6-sentence paragraph`,
        note: 'Varies length each run instead of producing one uniform block.',
      },
      {
        title: 'Prototype a page with mixed-length filler',
        code: `Output: 3 paragraphs of unpredictable length in a row`,
        note: 'Surfaces layout issues that only appear once content length actually varies.',
      },
    ],
  },

  'color-harmony-generator': {
    description: `Picking colors that work well together isn't guesswork, classical color theory maps out specific relationships around a color wheel, complementary colors sit directly opposite each other, analogous colors sit next to each other, triadic colors are spaced evenly in a triangle, split-complementary pairs a base hue with the two colors flanking its opposite, and each relationship produces a genuinely different kind of multi-color palette from the same starting point. This tool generates all four of those color wheel relationships from a single base hue, rather than variations of one single color. Useful for generating a triadic palette for a brand that needs three distinct but balanced colors, finding the complementary color that contrasts most strongly against a given base hue, or comparing analogous and split-complementary options from the same starting color side by side.`,
    examples: [
      {
        title: 'Generate a triadic palette',
        code: `Input: #E63946\nOutput: #46E639, #3946E6 (evenly spaced around the wheel)`,
        note: 'Produces three balanced, evenly spaced hues from one base color.',
      },
      {
        title: 'Find the complementary color',
        code: `Input: #2A9D8F\nOutput: #9D442A`,
        note: 'Returns the hue sitting directly opposite the base color on the wheel.',
      },
    ],
  },
};

export default FIX_BATCH_76;
