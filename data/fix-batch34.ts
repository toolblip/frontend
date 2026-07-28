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

const FIX_BATCH_34: Record<string, FixBatchEntry> = {
  'duplicate-phrase-detector': {
    description: `A single repeated word is easy to spot on a re-read, but a repeated phrase, three or four words used together more than once, tends to blend into the background of a longer piece of writing since each individual occurrence reads fine on its own and only the pattern across the whole document reveals the repetition. This tool scans a text block specifically for repeated phrases and multi-word patterns, not just single words, flagging where the same phrase shows up more than once throughout a document. Useful for catching a phrase that got reused without noticing across a long report, tightening a draft that leans on the same expression in several places, or checking a piece of writing for the kind of phrase-level repetition a plain word-frequency count would never surface.`,
    examples: [
      {
        title: 'Catch a phrase reused across a long report',
        code: `Input: "moving forward" appears 6 times across a 2000-word report\nOutput: flagged, "moving forward" repeated 6 times`,
        note: 'Surfaces phrase-level repetition a single word count would never catch.',
      },
      {
        title: 'Find a repeated 4-word pattern',
        code: `Input: "in order to ensure" appears 3 times\nOutput: flagged as a repeated 4-word phrase`,
        note: 'Detects multi-word patterns, not just single repeated words.',
      },
    ],
  },

  'timestamp-diff-calculator': {
    description: `A Unix timestamp is just a number, seconds since a fixed point in 1970, which makes subtracting two of them mathematically trivial but the raw result meaningless on its own, a difference of 93,784 seconds doesn't mean anything until it's translated into days, hours, minutes, and seconds a person can actually use. This tool calculates the difference between two timestamps or dates and breaks the result down into that readable format, rather than leaving a raw second count that needs its own separate conversion to interpret. Useful for figuring out exactly how long a process took between two logged timestamps, calculating the gap between two dates in a readable breakdown instead of raw seconds, or checking how much time actually elapsed between two events recorded in Unix time.`,
    examples: [
      {
        title: 'Calculate elapsed time between two timestamps',
        code: `Input: 1706000000, 1706093784\nOutput: 1 day, 2 hours, 3 minutes, 4 seconds`,
        note: 'Breaks a raw second difference into a readable format.',
      },
      {
        title: 'Check the gap between two logged events',
        code: `Input: 2026-01-15 09:00:00, 2026-01-17 14:30:00\nOutput: 2 days, 5 hours, 30 minutes`,
        note: 'Useful for measuring how long a process actually took between two log entries.',
      },
    ],
  },

  'wcag-contrast-auditor': {
    description: `Checking one color pair at a time works fine for a single decision, but an entire design system or a live page typically has dozens of text-and-background combinations at once, body text, links, button labels, form placeholders, each needing its own contrast check, and testing them one pair at a time misses combinations nobody thought to check individually. This tool audits every text and background color combination it can find across a stylesheet or a live page at once, rather than requiring each pair to be entered manually, flagging every combination that fails WCAG AA or AAA rather than the one pair someone remembered to test. Useful for auditing an entire design system's color combinations in one pass, catching a contrast failure buried in a component nobody thought to check individually, or verifying every text style across a live page actually meets accessibility standards rather than just the obvious ones.`,
    examples: [
      {
        title: 'Audit every color pair in a stylesheet',
        code: `Input: [full CSS file]\nOutput: 14 combinations checked, 2 failing AA (link color, placeholder text)`,
        note: 'Checks every combination automatically instead of testing pairs one at a time.',
      },
      {
        title: 'Catch a failure in an overlooked component',
        code: `Input: [live page scan]\nOutput: form placeholder text fails AA (2.1:1), nobody had tested it individually`,
        note: 'Surfaces a failure in a component that was never manually checked.',
      },
    ],
  },

  'heading-tag-analyzer': {
    description: `A page can look perfectly organized visually while its actual heading structure is a mess underneath, an H1 followed straight by an H4 with no H2 or H3 in between, two H1 tags competing on the same page, headings used purely for their font size rather than to reflect the page's actual outline, all invisible to a sighted visitor but very much visible to a screen reader or a search engine trying to parse the page's structure. This tool analyzes a webpage's full heading hierarchy from H1 through H6 and flags exactly where the structure breaks, a skipped level, a duplicate H1, headings out of logical order. Useful for auditing a page's heading structure before publishing, fixing an accessibility issue where a screen reader user can't navigate a page's headings logically, or confirming a content page's outline actually reflects its heading tags rather than just its visual styling.`,
    examples: [
      {
        title: 'Catch a skipped heading level',
        code: `Input: H1 "Guide" -> H4 "Step One" (no H2 or H3)\nResult: flagged, heading level skipped from H1 to H4`,
        note: 'Detects a broken hierarchy invisible to a sighted visitor but disruptive for screen reader navigation.',
      },
      {
        title: 'Find duplicate H1 tags',
        code: `Input: 2 H1 tags found on the same page\nResult: flagged, a page should have exactly one H1`,
        note: 'Flags a structural issue that hurts both accessibility and SEO.',
      },
    ],
  },

  'general-unit-converter': {
    description: `Length, weight, and temperature get most of the attention from a typical unit converter, but area comes up constantly in its own right, comparing a property listing's square meters against square feet, checking a plot of land's size in acres versus hectares, and it deserves the same direct conversion the more commonly covered categories already get rather than being left out entirely. This tool covers length, weight, temperature, speed, area, and volume together in one place, so a property size, a recipe's volume measurement, and a travel speed can all be converted without switching between several separate single-purpose tools. Useful for comparing a property's size across different area units when house-hunting internationally, converting a recipe's volume measurements alongside a kitchen's temperature settings, or handling several different unit categories in the same session without losing track of a bigger task.`,
    examples: [
      {
        title: "Compare a property's size across units",
        code: `Input: 150 square meters\nOutput: 1,614.6 square feet | 0.037 acres`,
        note: 'Covers area alongside the more commonly converted length and weight categories.',
      },
      {
        title: "Convert a recipe's volume and an oven's temperature",
        code: `Input: 500 ml, 180°C\nOutput: 2.11 cups, 356°F`,
        note: 'Handles multiple unit categories in the same session.',
      },
    ],
  },

  'http-status-code-lookup': {
    description: `Building an API's error handling means deciding which status code to actually return for a specific situation, a resource that already exists, 409, a client sending requests too fast, 429, a resource that existed once but is now permanently gone, 410, decisions that go the opposite direction from decoding a code someone else's API already sent back. This tool looks up HTTP status codes by their meaning and typical use case, organized so the right code for a specific situation being built can be found by browsing categories rather than guessing from memory. Useful for choosing the correct status code while designing a new API endpoint's error responses, confirming a less common code like 409 or 429 actually fits the specific situation it's being used for, or browsing the full range of codes in a category before deciding which one an endpoint should return.`,
    examples: [
      {
        title: 'Choose the right code for a duplicate resource',
        code: `Situation: user tries to create an account with an email already in use\nRecommended: 409 Conflict`,
        note: 'Helps decide which code to return while designing an API, not just decode one already received.',
      },
      {
        title: 'Pick the correct code for a rate-limited request',
        code: `Situation: client exceeds the allowed request rate\nRecommended: 429 Too Many Requests`,
        note: 'Matches a specific API design situation to the status code built for it.',
      },
    ],
  },

  'keyword-position-checker': {
    description: `Knowing a keyword's overall search volume or difficulty doesn't tell you where your own specific page actually lands in results for it today, page one, page three, not ranking at all, which is a completely different, page-specific question that requires checking an actual URL against an actual keyword rather than researching the keyword in the abstract. This tool checks where a specific URL currently ranks for a specific keyword, returning the actual position in search results rather than a general difficulty estimate. Useful for tracking whether a page's ranking for a target keyword is actually improving after an SEO change, checking where a competitor's page currently sits for the same keyword being targeted, or confirming a keyword a page was optimized for actually moved the needle in real rankings rather than just on paper.`,
    examples: [
      {
        title: "Check a page's current ranking position",
        code: `Input: URL: yoursite.com/blog/guide, keyword: "meal prep tips"\nOutput: currently ranking #7`,
        note: 'Gives the actual current position, not a general difficulty estimate.',
      },
      {
        title: 'Track ranking improvement after an SEO change',
        code: `Before: position #14\nAfter: position #6`,
        note: 'Confirms whether a specific optimization actually moved the real ranking.',
      },
    ],
  },

  'hex-to-hsl': {
    description: `HSL describes a color by hue, saturation, and lightness rather than red, green, and blue channel values, which makes it the far more intuitive format for actually adjusting a color, dial lightness up or down to get a tint or shade, nudge saturation to make a color more muted or more vivid, adjustments that are awkward to reason about in hex or RGB but straightforward once a color is expressed in HSL. This tool converts a hex code into its HSL equivalent with a live preview, making a color's underlying hue, saturation, and lightness values visible and editable directly. Useful for adjusting a brand color's lightness to generate a hover state without guessing at a new hex value, understanding a color's actual saturation and lightness rather than reading opaque RGB numbers, or getting the HSL syntax a stylesheet needs from a hex value pulled from a design file.`,
    examples: [
      {
        title: 'Generate a hover state by adjusting lightness',
        code: `Input: #2563EB\nOutput: hsl(217, 83%, 53%)\nHover: hsl(217, 83%, 43%) (10% darker)`,
        note: 'Adjusting lightness directly is far more intuitive than guessing a new hex value.',
      },
      {
        title: "Check a color's actual saturation",
        code: `Input: #A16A6A\nOutput: hsl(0, 25%, 55%) (low saturation, muted)`,
        note: 'Reveals how muted or vivid a color actually is, which hex alone does not show.',
      },
    ],
  },

  'profile-photo': {
    description: `A profile picture has different demands than a regular photo edit: it needs to read clearly at a small size, often cropped into a circle, and it's usually a self-portrait, which means the retouching that matters most, evening out skin tone, subtly brightening the shot, cropping tightly on the face, is a narrower and more specific set of adjustments than a full general-purpose photo editor offers. This tool bundles exactly that set: crop, filter, and retouch tools built specifically around preparing a self-portrait for use as a profile picture rather than a general editing toolkit with everything else included. Useful for cropping and retouching a selfie into a clean profile picture for a social account, evening out lighting and skin tone in a self-portrait before using it professionally, or quickly preparing a headshot-style crop without opening a full photo editor for one small adjustment.`,
    examples: [
      {
        title: 'Crop and retouch a selfie for a profile picture',
        code: `Input: selfie.jpg\nOutput: profile-photo.jpg (cropped to circle-safe framing, skin tone evened, brightness adjusted)`,
        note: 'Bundles the specific adjustments a profile picture needs rather than a full general editor.',
      },
      {
        title: 'Prepare a quick headshot-style crop',
        code: `Input: casual-photo.jpg\nOutput: profile-crop.jpg (tight face crop, subtle retouch)`,
        note: 'Produces a clean profile picture without opening a full photo editing suite.',
      },
    ],
  },

  'keyword-extractor': {
    description: `Figuring out what a piece of text is actually about at a glance, without reading the whole thing, means identifying which specific words and phrases carry the real subject matter rather than the connecting words and common terms that show up in every piece of writing regardless of topic. This tool extracts the specific keywords and key phrases that actually represent a text's subject matter, filtering out common words to surface what a page or a piece of writing is genuinely about. Useful for quickly identifying a competitor's target keywords by extracting them straight from their published page, checking whether a piece of content actually centers on the keyword it was supposed to be optimized for, or getting a fast summary of a long article's actual subject matter without reading it in full.`,
    examples: [
      {
        title: "Extract a competitor's target keywords",
        code: `Input: [competitor blog post URL]\nOutput: "meal prep containers", "batch cooking", "weekly meal planning"`,
        note: 'Surfaces the specific phrases a page is actually built around.',
      },
      {
        title: 'Check if content matches its intended keyword',
        code: `Input: [article draft]\nOutput: top extracted phrase: "budget travel tips" (matches intended target keyword)`,
        note: 'Confirms a piece of writing actually centers on the topic it was meant to target.',
      },
    ],
  },
};

export default FIX_BATCH_34;
