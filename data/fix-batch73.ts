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

const FIX_BATCH_73: Record<string, FixBatchEntry> = {
  'color-format-converter-v2': {
    description: `A color rarely lives in just one format for long, a HEX code from a design file needs to become RGB for a canvas API, or HSL for an easy lightness adjustment, or CMYK before a print vendor will accept it, and juggling all of that by hand invites a typo in a value that looks like it should just work. This tool takes a color in HEX, RGB, RGBA, HSL, HSLA, or CMYK and converts it into every other format at once, with a live preview showing the actual color rather than trusting the numbers alone. Useful for pulling a HEX value from a design tool and getting the RGBA equivalent for a CSS variable, checking what a designer's CMYK print swatch looks like as an on-screen HEX code, or converting an HSL value with an adjusted lightness back into RGB for code.`,
    examples: [
      {
        title: 'Convert HEX to every other format',
        code: `Input: #FF6B35\nOutput: RGB(255, 107, 53), HSL(16°, 100%, 60%), CMYK(0%, 58%, 79%, 0%)`,
        note: 'Converts one input format into all the others simultaneously.',
      },
      {
        title: 'Convert HSL with adjusted lightness back to RGB',
        code: `Input: hsl(200, 80%, 45%)\nOutput: rgb(23, 133, 199)`,
        note: 'Useful after tweaking a lightness value and needing the RGB equivalent for code.',
      },
    ],
  },

  'gif-to-mov': {
    description: `Airdropping or texting an animated GIF to an iPhone often means it arrives as a flat, low-quality image rather than something that actually plays, since iOS handles GIFs inconsistently outside a browser, but a QuickTime MOV file is a real video, the same format the Photos app and iMessage already know how to play smoothly without any special handling. This tool converts an animated GIF into a MOV video, preserving the same frames and timing in a file format built for Apple's ecosystem rather than the web. Useful for turning a GIF into something that actually plays back correctly after being shared through iMessage, saving a GIF-based animation into the Photos app as a proper video clip, or converting a GIF for editing in a video app that expects a real video container instead of an image format.`,
    examples: [
      {
        title: 'Convert an animation for iMessage sharing',
        code: `Input: celebration.gif (24 frames, 12fps)\nOutput: celebration.mov`,
        note: 'Plays back correctly as a video instead of arriving as a flat image.',
      },
      {
        title: 'Save a GIF into the Photos app as a video',
        code: `Input: loading-spinner.gif\nOutput: loading-spinner.mov`,
        note: 'MOV is a format the Photos app and iMessage already handle natively.',
      },
    ],
  },

  'regex-tester': {
    description: `Writing a regular expression rarely works on the first try, and the real test isn't whether a pattern looks right, it's whether it actually matches the specific strings it's supposed to and rejects the ones it isn't, edge cases included, something that's nearly impossible to verify just by reading the pattern itself. This tool runs a regex against real sample text, highlighting every match live as the pattern changes and displaying each capture group separately, so the actual matching behavior stays visible while a pattern is still being refined rather than only after it ships in actual code. Useful for iterating on a pattern against a handful of test strings until it correctly separates the ones that should match from the ones that shouldn't, checking exactly what a capture group pulls out of a match, or confirming a regex handles an edge case before it goes into production code.`,
    examples: [
      {
        title: 'Test a pattern against multiple sample strings',
        code: `Pattern: /^\\d{3}-\\d{4}$/\nTest strings: "555-1234" match, "5551234" no match, "abc-1234" no match`,
        note: 'Shows exactly which test strings match and which are correctly rejected.',
      },
      {
        title: 'Inspect capture groups from a match',
        code: `Pattern: /(\\w+)@(\\w+)\\.com/\nInput: "user@example.com"\nGroups: 1: "user", 2: "example"`,
        note: 'Displays each capture group separately rather than just the full match.',
      },
    ],
  },

  'twitter-card-preview': {
    description: `A link that looks great when shared on Facebook can still show up broken on Twitter, because Twitter reads its own twitter:card meta tags rather than the Open Graph tags other platforms rely on, and it renders two different layouts, a small summary card or a large image card, each with its own aspect ratio expectations that a page's existing OG image might not satisfy. This tool renders a live preview of exactly how a URL appears when shared on Twitter, checking both card types against the page's actual meta tags rather than assuming Open Graph coverage is enough. Useful for confirming a large image card displays with the correct aspect ratio instead of an awkward crop, catching a missing twitter:card tag that would otherwise fall back to a plain link, or comparing how a page looks in the summary layout versus the large image layout before sharing it.`,
    examples: [
      {
        title: 'Preview a large image card',
        code: `Input: https://example.com/blog/post\nCard type: summary_large_image\nImage: 1200x630`,
        note: 'Confirms the image aspect ratio renders correctly in the large card layout.',
      },
      {
        title: 'Catch a missing twitter:card tag',
        code: `Input: https://example.com/no-card-tag\nResult: falls back to plain link preview`,
        note: 'Flags when a page has Open Graph tags but no Twitter-specific card tag.',
      },
    ],
  },

  'wcag-contrast-checker': {
    description: `Accessibility guidelines don't just recommend readable text, they specify exact numeric thresholds, a 4.5:1 contrast ratio for normal text and 3:1 for large text or UI components at the AA level, stricter still at AAA, and the only way to know whether a specific foreground and background color pair actually clears one of those bars is to calculate the ratio rather than eyeball it. This tool checks the contrast ratio between two colors and states plainly whether that pair passes AA, passes AAA, or fails, against the specific text size it's being used for. Useful for confirming a button's text color actually meets AA contrast against its background before shipping a design, checking whether a light gray caption clears the large-text threshold, or verifying a color pairing meets AAA for a project with a stricter accessibility requirement.`,
    examples: [
      {
        title: 'Check a button against AA',
        code: `Input: text #FFFFFF, background #2563EB\nOutput: 4.8:1 - Passes AA (normal text), Passes AA (large text)`,
        note: 'States the exact ratio against the specific numeric threshold.',
      },
      {
        title: 'Check a lighter pairing against AAA',
        code: `Input: text #767676, background #FFFFFF\nOutput: 4.5:1 - Passes AA, Fails AAA`,
        note: 'Distinguishes between the AA and stricter AAA thresholds for the same pair.',
      },
    ],
  },

  'hex-to-cmyk': {
    description: `A screen displays color by mixing light, red, green, and blue pixels adding up to white, but a printing press builds color by layering ink, cyan, magenta, yellow, and black subtracting from white paper, and that fundamental difference means a HEX code doesn't have one single correct CMYK equivalent, only a reasonable translation depending on the color profile assumed. This tool converts a HEX color into CMYK values suitable for print production, with a live preview showing the intended color, so a design built on screen has a specific starting point for a print vendor rather than an unconverted screen value handed over as-is. Useful for preparing a brand color for a printed brochure before sending final files to a print shop, checking how a bright on-screen HEX color is likely to translate once printed, or getting CMYK values to fill into a print vendor's design template.`,
    examples: [
      {
        title: 'Convert a brand color for print',
        code: `Input: #E63946\nOutput: C: 0%, M: 84%, Y: 74%, K: 10%`,
        note: 'Gives a print vendor CMYK values instead of an unconverted screen color.',
      },
      {
        title: 'Check how a bright screen color translates',
        code: `Input: #00FF00\nOutput: C: 61%, M: 0%, Y: 100%, K: 0%`,
        note: 'Highlights how a vivid on-screen color shifts once expressed in ink percentages.',
      },
    ],
  },

  'epub-to-azw3': {
    description: `MOBI, the older Kindle ebook format, gets text onto a device fine but drops some finer formatting, an embedded font, a fixed layout for something like a graphic novel, more elaborate CSS styling, while AZW3, the newer Kindle format also called KF8, actually preserves that detail on a modern Kindle app or device. This tool converts an EPUB ebook into AZW3, keeping formatting that would otherwise be simplified away by an older format. Useful for converting a self-published EPUB into AZW3 so a modern Kindle app renders its custom fonts and layout correctly, preparing an illustrated or fixed-layout EPUB for Kindle without losing its formatting, or moving an EPUB library onto a Kindle device in the more capable of its two native formats.`,
    examples: [
      {
        title: 'Convert a novel with an embedded font',
        code: `Input: my-novel.epub (custom embedded typeface)\nOutput: my-novel.azw3`,
        note: 'Preserves the embedded font that an older MOBI conversion would drop.',
      },
      {
        title: 'Convert a fixed-layout illustrated book',
        code: `Input: graphic-novel.epub (fixed layout)\nOutput: graphic-novel.azw3`,
        note: 'Keeps the fixed page layout intact for a modern Kindle app.',
      },
    ],
  },

  'press-release-generator': {
    description: `A press release follows a specific structure a journalist actually expects, a dateline naming the city and date up top, a headline and subheading, a quote block attributed to an actual executive, and a closing boilerplate paragraph describing the company, a format built to be lifted and republished rather than read as ordinary marketing copy. This tool writes a press release in that standard structure from a company name, an announcement, and a few key details, producing something shaped like what a publication would actually expect to receive rather than a generic announcement post. Useful for announcing a funding round or a product launch in a format editors are used to seeing, drafting a quote attributed to a founder for a specific announcement, or producing a media-ready release with a proper dateline and boilerplate closing paragraph.`,
    examples: [
      {
        title: 'Announce a funding round',
        code: `Input: company: "Acme Robotics", announcement: "$12M Series A", quote: CEO comment\nOutput: dateline, headline, quote block, boilerplate paragraph`,
        note: 'Produces the standard structure a journalist expects to receive.',
      },
      {
        title: 'Announce a product launch',
        code: `Input: company: "Acme Robotics", announcement: "new warehouse robot", city: "Austin, TX"\nOutput: full release with dateline "AUSTIN, TX - [Date]"`,
        note: 'Includes the dateline format used in actual media releases.',
      },
    ],
  },

  'homophone-checker': {
    description: `A spell-checker has nothing to say about writing "their" when a sentence needed "there", because each individual word is spelled correctly, it's simply the wrong one for what the sentence actually means, and that particular mistake, mixing up its/it's, your/you're, effect/affect, and similar sound-alike pairs, is a different error class entirely from a misspelling or a grammar issue. This tool scans text for commonly confused homophones and flags each one with the likely correct word based on the surrounding context. Useful for catching a their/there/they're mix-up before publishing a blog post, checking whether "effect" or "affect" actually belongs in a particular sentence, or reviewing a document for sound-alike word errors that a standard spell-checker would never catch.`,
    examples: [
      {
        title: "Catch a there/their/they're mix-up",
        code: `Input: "The team finished there project early."\nFlag: "there" -> likely "their"`,
        note: 'Flags the word based on sentence meaning, not spelling.',
      },
      {
        title: 'Check effect versus affect',
        code: `Input: "The delay will effect the launch date."\nFlag: "effect" -> likely "affect"`,
        note: 'Catches a sound-alike error a spell-checker would pass as correctly spelled.',
      },
    ],
  },

  'word-frequency-table': {
    description: `Some words creep into a piece of writing far more often than a writer notices while drafting it, a favorite adjective, a filler phrase, the same transition repeated paragraph after paragraph, and the only reliable way to spot that pattern is to actually count how many times each word shows up rather than trust a read-through to catch it. This tool builds a frequency table listing every word in a text alongside how many times it appears, sorted so the most repeated words surface immediately. Useful for spotting an overused word before finalizing an article, checking keyword density in content written for search rankings, or analyzing which words dominate a longer document or transcript.`,
    examples: [
      {
        title: 'Spot an overused word in a draft',
        code: `Input: [800-word article]\nTop results: "actually" (14), "really" (11), "however" (9)`,
        note: 'Surfaces words repeated far more than a writer noticed while drafting.',
      },
      {
        title: 'Check keyword density in content',
        code: `Input: [product page text]\nTop results: "waterproof" (6), "durable" (5), "warranty" (3)`,
        note: 'Useful for reviewing how often a target keyword actually appears.',
      },
    ],
  },
};

export default FIX_BATCH_73;
