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

const FIX_BATCH_72: Record<string, FixBatchEntry> = {
  'tone-of-voice': {
    description: `The same message needs a different register depending on who is reading it, a customer support reply calls for something warmer and more patient than a formal notice to a vendor, and a social media caption can afford playfulness that a compliance email absolutely cannot, yet rewriting the same content by hand for each register takes longer than most people expect. This tool rewrites existing text into a chosen register, professional, casual, friendly, or formal, while keeping the underlying message and facts intact rather than changing what's actually being said. Useful for turning a blunt internal note into something polished enough to send to a client, loosening up a stiff formal draft before posting it somewhere casual, or matching an email's register to whichever audience is actually going to read it.`,
    examples: [
      {
        title: 'Soften a blunt note for a client',
        code: `Input (casual): "Can't do this by Friday, too much on our plate right now."\nOutput (professional): "We won't be able to meet the Friday deadline given current workload, and want to flag that early."`,
        note: 'Keeps the same underlying message while shifting the register.',
      },
      {
        title: 'Loosen a formal draft for social media',
        code: `Input (formal): "We are pleased to announce the launch of our new product line."\nOutput (casual): "Big news, our new product line just dropped!"`,
        note: 'Adjusts tone for the audience without changing what is actually being announced.',
      },
    ],
  },

  'essay-writer': {
    description: `An essay isn't just a few paragraphs about a topic, it needs an actual thesis statement up front, body paragraphs that each build a specific point supporting that thesis, and a conclusion that ties the argument back together rather than just restating the introduction, structure that's easy to describe but slower to build from a blank page than it sounds. This tool writes a complete essay from a given topic, generating the thesis, structured body paragraphs, and a conclusion as one finished document rather than a loose paragraph or a bullet outline. Useful for drafting a full essay structure from just a topic and a rough angle, generating a complete first draft to revise rather than starting from nothing, or seeing how a specific thesis could be supported across several body paragraphs before writing it independently.`,
    examples: [
      {
        title: 'Generate a full essay from a topic',
        code: `Input: topic: "The impact of remote work on urban planning", length: 800 words\nOutput: full essay with thesis, four body paragraphs, and a conclusion`,
        note: 'Produces a complete document rather than a single paragraph or outline.',
      },
      {
        title: 'Draft a thesis and supporting structure',
        code: `Input: topic: "Should social media platforms verify user identity?"\nOutput: thesis statement plus three body paragraphs, each backing a distinct supporting point`,
        note: 'Shows how a specific thesis breaks down into separate supporting arguments.',
      },
    ],
  },

  'image-alt-text-generator': {
    description: `A screen reader has nothing to describe an image with beyond whatever alt text was actually written for it, and a search engine indexes a page's images the same way, through that same short description, so a missing or lazy alt attribute like "image1.jpg" costs both an accessible experience for someone who can't see the photo and a ranking signal a search engine would have otherwise picked up. This tool generates descriptive alt text for a specific image, phrased for both a screen reader and a search engine rather than favoring one over the other. Useful for writing an accurate alt attribute for a product photo without guessing at wording, filling in the accessibility gaps in an existing page's images one at a time, or drafting alt text before publishing new images rather than fixing it after the fact.`,
    examples: [
      {
        title: 'Generate alt text for a product photo',
        code: `Input: [image of a red leather backpack on a white background]\nOutput: alt="Red leather backpack with brass buckles, shown against a white background"`,
        note: 'Describes the specific product rather than a generic label like "image1.jpg".',
      },
      {
        title: 'Fill an accessibility gap on an existing page',
        code: `Input: [banner image with no alt attribute]\nOutput: alt="Team of five people collaborating around a laptop in an office"`,
        note: 'Written for both screen readers and search engine indexing.',
      },
    ],
  },

  'json-escape-unescape': {
    description: `A JSON string containing a quote, a backslash, or a newline can't just be dropped inside another string, whether that's a JSON document nesting a JSON string as one of its values, a shell command, or a code literal, without first escaping those characters so the outer structure doesn't break the moment it hits one of them. This tool escapes a raw string into safely embeddable JSON, or unescapes an already-escaped string back into its readable form, handling quotes, backslashes, and newlines correctly in both directions. Useful for preparing a string with special characters to embed as a JSON value without breaking the surrounding document, unescaping a JSON string copied from a log file back into readable text, or checking exactly which characters in a string actually needed escaping in the first place.`,
    examples: [
      {
        title: 'Escape a string for safe embedding',
        code: `Input: He said "hello"\nand left.\nOutput: He said \\"hello\\"\\nand left.`,
        note: 'Escapes quotes and newlines so the string can sit inside a JSON value.',
      },
      {
        title: 'Unescape a string back to readable text',
        code: `Input: Line one\\nLine two\\nOutput: Line one\nLine two`,
        note: 'Reverses escaping to restore the original readable form.',
      },
    ],
  },

  'all-in-one-unit-converter': {
    description: `Length, weight, temperature, speed, and volume each have their own separate converter tool, which is fine until a single task actually needs two or three of them, converting a recipe's cup measurements to milliliters and its oven temperature to Celsius in the same sitting means opening a different tool for each category rather than switching between them in one place. This tool covers all five categories together, length, weight, temperature, speed, and volume, in a single interface with a category switcher instead of five separate pages. Useful for converting a recipe's volume measurements and its temperature settings without leaving the same tool, handling a travel itinerary's distances and speeds together, or reaching for one bookmarked tool instead of remembering which specific converter a particular unit needs.`,
    examples: [
      {
        title: 'Convert a recipe across two categories',
        code: `Input: volume: 2 cups -> milliliters, temperature: 350°F -> Celsius\nOutput: 473 ml, 177°C`,
        note: 'Handles both conversions in the same tool without switching pages.',
      },
      {
        title: 'Convert distance and speed together',
        code: `Input: distance: 26.2 miles -> kilometers, speed: 60 mph -> km/h\nOutput: 42.2 km, 96.6 km/h`,
        note: 'Switches between unit categories from one interface.',
      },
    ],
  },

  'heic-to-avif': {
    description: `An iPhone's default HEIC format already compresses better than JPG, but AVIF goes further still, an even newer codec that can shrink the same photo down further without a visible drop in quality, which matters most for someone archiving a large photo library where every saved megabyte adds up across thousands of images, more than it does for a single photo shared once and forgotten. This tool converts HEIC photos into AVIF, trading some of AVIF's still-limited support in older software for genuinely smaller files than HEIC alone produces. Useful for shrinking an entire photo library down for long-term storage, converting HEIC photos into the most space-efficient format before uploading them somewhere with limited quota, or archiving photos where file size actually matters more than opening them in any older app.`,
    examples: [
      {
        title: 'Shrink a photo library for storage',
        code: `Input: vacation-photo.heic (3.2 MB)\nOutput: vacation-photo.avif (1.1 MB)`,
        note: 'Reduces file size further than HEIC alone for long-term archiving.',
      },
      {
        title: 'Convert before uploading to limited storage',
        code: `Input: 500 HEIC photos from an iPhone backup\nOutput: 500 AVIF files, roughly a third of the original combined size`,
        note: 'Saves quota when storage space matters more than universal app support.',
      },
    ],
  },

  'svg-optimizer': {
    description: `An SVG exported straight out of Illustrator or Figma usually carries a fair amount of invisible weight, editor metadata nobody will ever read, redundant path points a design tool added without being asked, verbose attribute names where a shorter equivalent renders identically, none of it changing how the image actually looks but all of it adding up in file size and load time. This tool strips that unnecessary metadata, simplifies path data, and minifies the remaining markup, shrinking an SVG's file size without altering its visible appearance. Useful for cleaning up an icon exported from a design tool before it ships to production, shrinking a page full of inline SVGs to cut load time, or stripping editor-specific metadata out of a vector file before handing it off to someone else.`,
    examples: [
      {
        title: 'Clean up an icon exported from a design tool',
        code: `Input: icon.svg (4.8 KB, with Illustrator metadata and comments)\nOutput: icon.svg (0.9 KB, metadata and comments removed)`,
        note: 'Shrinks file size without changing how the icon renders.',
      },
      {
        title: 'Simplify redundant path data',
        code: `Input: <path d="M10.0000 10.0000 L20.0000 10.0000 L20.0000 20.0000 Z" />\nOutput: <path d="M10 10 L20 10 L20 20Z" />`,
        note: 'Trims unnecessary decimal precision and whitespace from path coordinates.',
      },
    ],
  },

  'base-number-converter': {
    description: `Binary, decimal, hexadecimal, and octal cover most everyday number-base conversions, but base-32 shows up in its own specific corner, a TOTP two-factor authentication secret key, certain case-insensitive identifiers, is encoded that way specifically because it avoids characters that look alike or that case-sensitivity could otherwise confuse, and converting one by hand means working through a base most calculators don't even offer. This tool converts a number between binary, decimal, hexadecimal, octal, and base-32 in any direction, covering that less common base alongside the four everyday ones. Useful for decoding a base-32 value like a 2FA secret key back into something readable, converting between any of the five number systems without hunting for a specific one-off tool, or checking a base-32 conversion by hand against a working example.`,
    examples: [
      {
        title: 'Decode a base-32 2FA secret key',
        code: `Input: JBSWY3DPEHPK3PXP (base-32)\nOutput: 145348463526309261406049 (decimal)`,
        note: 'Handles the less common base that everyday converters usually skip.',
      },
      {
        title: 'Convert between any of the five bases',
        code: `Input: 1F4 (hexadecimal)\nOutput: binary 111110100, decimal 500, octal 764, base-32 FK`,
        note: 'Converts one value across all five number systems at once.',
      },
    ],
  },

  'rgba-to-hex': {
    description: `An rgba() color with a defined alpha value doesn't translate directly into a six-digit hex code, since hex alone has no room for transparency, representing that same alpha as hex actually requires an eight-digit code, the standard six digits for color followed by two more for opacity, and converting a 0-to-1 alpha value into those extra two hex digits by hand means scaling it to 0-255 first and then converting that number into hex, a step easy to get wrong manually. This tool converts an RGBA color directly into that eight-digit hex format, alpha included, with a live preview of the resulting color. Useful for getting an 8-digit hex value for a codebase or format that expects hex-encoded alpha instead of an rgba() function, checking a manual alpha-to-hex conversion for accuracy, or converting a semi-transparent color between the two formats without recalculating the opacity yourself.`,
    examples: [
      {
        title: 'Convert RGBA to 8-digit hex',
        code: `Input: rgba(255, 87, 51, 0.75)\nOutput: #FF5733BF`,
        note: 'The final two digits (BF) encode the 0.75 alpha value.',
      },
      {
        title: 'Convert a fully opaque color',
        code: `Input: rgba(34, 139, 34, 1)\nOutput: #228B22FF`,
        note: 'An alpha of 1 becomes FF, the maximum two-digit hex value.',
      },
    ],
  },

  'serp-preview': {
    description: `Deciding on a page title and meta description before anything is actually published means there's no live URL yet to check against, only a draft worth testing before it ships, typed directly in rather than pulled automatically from a page that doesn't exist as a finished, crawlable page yet. This tool renders a typed title and meta description as a Google search result would actually display them, character limits and truncation included, without needing an existing page to fetch and analyze. Useful for testing a few title variations before picking one and publishing, checking whether a meta description will get cut off in results before it goes live, or drafting SERP copy for a page that's still being built rather than one already indexed.`,
    examples: [
      {
        title: 'Preview a draft title and description',
        code: `Input: title: "10 Best Hiking Trails Near Portland", description: "Discover the top hiking trails around Portland, with difficulty ratings, trail length, and trailhead directions."\nOutput: rendered Google result with title and description shown as they'd display in search`,
        note: 'Tests copy for a page that hasn\'t been published yet.',
      },
      {
        title: 'Check if a description gets truncated',
        code: `Input: description: 165 characters long\nOutput: preview shows truncation after ~155 characters with an ellipsis`,
        note: 'Flags copy that will get cut off before it ever goes live.',
      },
    ],
  },
};

export default FIX_BATCH_72;
