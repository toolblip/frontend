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

const FIX_BATCH_94: Record<string, FixBatchEntry> = {
  'backslash-escape-unescape': {
    description: `The same backslash means something different depending on what it's headed into next, a JSON string needs one level of escaping, but a string destined to become a regex pattern often needs two, once for the string literal itself and again because regex uses backslash for its own escape sequences, and getting that escaping level wrong by one is a genuinely common, hard-to-spot source of a broken pattern. This tool escapes and unescapes backslash characters for JSON, JavaScript, regex, and other programming contexts, applying the right escaping level for whichever destination the string is actually headed toward. Useful for escaping a string correctly before it gets embedded inside a regex pattern rather than just a plain string literal, unescaping a backslash-heavy string copied from a log file back into its original readable form, or checking exactly how many backslashes a specific context actually requires before pasting a string into code.`,
    examples: [
      {
        title: 'Escape a string for use inside a regex pattern',
        code: `Input: C:\\Users\\jane\nOutput (single escape): C:\\\\Users\\\\jane\nOutput (regex-ready double escape): C:\\\\\\\\Users\\\\\\\\jane`,
        note: 'Applies the extra escaping level a regex destination requires.',
      },
      {
        title: 'Unescape a backslash-heavy log string',
        code: `Input: "path: C:\\\\\\\\Users\\\\\\\\jane\\\\\\\\Documents"\nOutput: path: C:\\Users\\jane\\Documents`,
        note: 'Restores the original readable form from an over-escaped string.',
      },
    ],
  },

  'banner-generator': {
    description: `Twelve hundred by six hundred thirty pixels isn't an arbitrary choice, it's the specific dimension Facebook, LinkedIn, and Twitter all expect for a link preview image, and a banner sized anything else gets awkwardly cropped or padded the moment it's actually shared rather than displaying the way it was designed. This tool creates banners and Open Graph images at exactly that dimension, with editable copy and gradient presets, producing a graphic that's already correctly sized rather than one that needs manual cropping afterward. Useful for generating a blog cover image sized correctly for social sharing from the start, creating an Open Graph image that won't get cropped unpredictably when a link gets shared, or producing a polished banner with a gradient background without opening a separate design tool.`,
    examples: [
      {
        title: 'Generate a correctly sized Open Graph image',
        code: `Input: title: "5 Tips for Better Sleep", gradient: sunset\nOutput: banner.png (1200x630)`,
        note: 'Matches the exact dimension social platforms expect for link previews.',
      },
      {
        title: 'Create a blog cover without a separate design tool',
        code: `Input: title: "2026 Product Roadmap", theme: dark\nOutput: banner.png ready for one-click download`,
        note: 'Produces a polished graphic directly, gradient background included.',
      },
    ],
  },

  'barcode-generator': {
    description: `EAN and UPC codes aren't just any string of digits, they carry a fixed length and a checksum digit mathematically calculated from the rest, so a scanner rejects a code where that final digit doesn't actually validate, while Code 128 and Code 39 work completely differently, encoding letters alongside numbers for shipping labels and inventory tracking rather than retail products with a mandated digit count. This tool generates EAN, UPC, Code 128, and Code 39 barcodes, calculating a valid checksum where the format actually requires one rather than accepting any arbitrary string. Useful for generating a UPC barcode with a correctly calculated checksum digit for retail packaging, creating a Code 128 barcode encoding letters and numbers for a shipping label, or producing an EAN barcode that will actually pass a scanner's validation instead of getting rejected.`,
    examples: [
      {
        title: 'Generate a UPC barcode with a valid checksum',
        code: `Input: 03600029145\nOutput: UPC-A barcode with checksum digit 2 calculated automatically`,
        note: 'Produces a code that actually passes scanner validation.',
      },
      {
        title: 'Generate a Code 128 barcode for a shipping label',
        code: `Input: "SHIP-2026-04821"\nOutput: Code 128 barcode encoding letters and numbers`,
        note: 'Handles alphanumeric input a retail-only format like UPC cannot.',
      },
    ],
  },

  'bcrypt-hash-generator': {
    description: `Bcrypt has been battle-tested since 1999, with mature, well-audited libraries in essentially every programming language, which makes it the conservative, safe default for a team that would rather rely on decades of scrutiny than adopt a newer algorithm early, even with Argon2 now the more modern recommendation. This tool generates bcrypt password hashes with an adjustable cost factor, where each increment doubles the computation time, and configurable salt rounds, a single straightforward tuning knob rather than the several separate parameters a newer algorithm exposes. Useful for generating a bcrypt hash for a codebase that already relies on bcrypt everywhere else, tuning the cost factor higher to slow down brute-force attempts without switching to a different algorithm, or hashing a password with a well-established, widely supported library rather than adopting something newer.`,
    examples: [
      {
        title: 'Generate a bcrypt hash with a specific cost factor',
        code: `Input: password: "correct-horse", cost factor: 12\nOutput: $2b$12$KIXQ...`,
        note: 'Each cost factor increment doubles the computation time.',
      },
      {
        title: 'Increase cost to slow brute-force attempts',
        code: `Input: cost factor: 10 -> 14\nOutput: hashing time increases roughly 16x`,
        note: 'Tunes difficulty without switching to a different algorithm.',
      },
    ],
  },

  'bill-splitter': {
    description: `Dividing a total by however many people showed up breaks down the moment someone ordered the appetizer and someone else just had water, and tax and tip both need calculating against the actual pre-tax subtotal specifically, not the total after tax, or the tip ends up quietly taxed along with the food. This tool splits a bill among multiple people with tax, tip, and rounding handled correctly, including an option to round each share up to a clean number since collecting exact cents from a group is genuinely more trouble than it's worth. Useful for splitting a group dinner bill where people ordered noticeably different amounts, calculating tip correctly against the pre-tax subtotal instead of the taxed total, or rounding each person's share up to a clean number before collecting payment from everyone.`,
    examples: [
      {
        title: 'Split unevenly ordered items fairly',
        code: `Input: Person A: $32, Person B: $18, tax: 8%, tip: 20%\nOutput: Person A owes $41.47, Person B owes $23.33`,
        note: 'Calculates tax and tip against each pre-tax amount, not an even split.',
      },
      {
        title: 'Round each share to a clean number',
        code: `Input: exact share: $23.33, round up: on\nOutput: $24.00`,
        note: 'Avoids collecting exact cents from each person in the group.',
      },
    ],
  },

  'binary-decimal-hex-converter': {
    description: `Debugging a memory address or a color value often means needing all four number system representations at once, glancing between a hex address, its raw binary bit pattern, and its decimal value repeatedly, rather than converting one specific pair and starting over each time a different comparison is needed. This tool converts a number entered in binary, decimal, hexadecimal, or octal into all three other bases simultaneously, displaying every representation side by side rather than one conversion at a time. Useful for entering a hex memory address once and seeing its binary and decimal equivalents together for a debugging session, checking a color value's representation across all four bases at a glance, or converting between number systems repeatedly without re-entering the value for each new comparison.`,
    examples: [
      {
        title: 'See all four bases for one value at once',
        code: `Input: 0x1A4 (hex)\nOutput: binary 110100100, decimal 420, octal 644`,
        note: 'Displays every representation together instead of one pair at a time.',
      },
      {
        title: 'Check a color value across bases',
        code: `Input: 255 (decimal)\nOutput: hex FF, binary 11111111, octal 377`,
        note: 'Useful for comparing a value across bases during debugging.',
      },
    ],
  },

  'blur-background': {
    description: `A phone camera's small sensor physically can't produce the shallow depth of field a wide-aperture portrait lens creates naturally, that soft, blurred background look has to be simulated after the fact instead, which means actually separating the subject from everything behind it first and then applying a graduated blur specifically to the background while leaving the subject perfectly sharp. This tool blurs an image's background while keeping its subject in focus, simulating a professional lens's shallow depth of field on a photo that was never actually shot with one. Useful for giving a phone-shot portrait the same soft background look a wide-aperture lens produces optically, making a product photo's background fade so the subject stands out clearly, or applying a professional-looking blur to a photo shot with a camera too small to produce that effect on its own.`,
    examples: [
      {
        title: 'Simulate a shallow depth of field on a phone photo',
        code: `Input: portrait.jpg (shot on phone)\nOutput: portrait-blurred.jpg (background softened, subject sharp)`,
        note: "Mimics a wide-aperture lens a phone's small sensor can't produce optically.",
      },
      {
        title: 'Make a product stand out from its background',
        code: `Input: product-shot.jpg\nOutput: product-shot-blurred.jpg`,
        note: 'Applies a graduated blur only to the background, not the subject.',
      },
    ],
  },

  border: {
    description: `Sometimes a border just needs to go on quickly, a color, a width, a style, applied and done, without dragging a slider through several live-updating options first to land on something that already looked fine from the start. This tool adds a customizable border to an image with a color, width, and style picked directly, built for a fast, one-shot addition rather than an extended interactive preview session. Useful for adding a simple colored border to a photo quickly without fine-tuning it through a live preview, applying a consistent border style across several images fast, or picking a border's color, width, and style directly when the exact look is already decided.`,
    examples: [
      {
        title: 'Add a border quickly',
        code: `Input: photo.jpg, border: 8px solid #000000\nOutput: photo-bordered.jpg`,
        note: 'Applies directly without an extended live-preview session.',
      },
      {
        title: 'Apply a consistent border across several images',
        code: `Input: photo1.jpg, photo2.jpg, photo3.jpg, border: 4px dashed #FFFFFF\nOutput: 3 bordered images, same settings applied to each`,
        note: 'Fast enough to repeat across a batch of photos.',
      },
    ],
  },

  'business-slogan-generator': {
    description: `A slogan and a business name are actually doing completely different jobs, a name has to work as a proper noun people remember and search for, while a slogan leans on rhythm, alliteration, or a value proposition compressed into just a few words, the kind of phrase-level copywriting that made "Just Do It" memorable rather than the kind of naming exercise that made "Nike" a brand. This tool generates catchy slogans and taglines for a brand, built around short, punchy phrase-level copywriting rather than the naming conventions a business name generator relies on. Useful for generating several tagline options built around rhythm and memorability for an existing brand name, drafting a slogan that compresses a value proposition into a few punchy words, or brainstorming taglines when the business name is already settled and only the slogan is missing.`,
    examples: [
      {
        title: 'Generate taglines built around rhythm',
        code: `Input: brand: "Northwind Coffee"\nOutput: "Brewed Bold, Poured Proud", "Wake Up Northwind"`,
        note: 'Focuses on phrase-level copywriting rather than naming conventions.',
      },
      {
        title: 'Compress a value proposition into a few words',
        code: `Input: brand: "QuickBooks Rival", value: "accounting software that actually explains itself"\nOutput: "Numbers That Make Sense"`,
        note: 'Distills a longer pitch into a short, memorable line.',
      },
    ],
  },

  'canonical-tag-checker': {
    description: `A canonical tag that's simply missing is a problem, but a canonical tag that's present and pointing at the wrong URL entirely is a worse one, quietly telling Google not to index the actual page at all because a templating bug pointed its canonical at an old URL, a competitor's page, or something completely unrelated, an error that stays invisible until search traffic for that page mysteriously disappears. This tool checks whether a webpage has a canonical tag and confirms exactly which URL it's actually pointing at, catching both a missing tag and one that's pointing somewhere it shouldn't. Useful for confirming a page's canonical tag actually points at itself rather than an unrelated URL, catching a templating bug that's silently sending a canonical tag to the wrong page, or auditing a site's canonical tags after a URL structure change to confirm nothing broke.`,
    examples: [
      {
        title: 'Catch a canonical tag pointing at the wrong page',
        code: `Input: https://example.com/blog/new-post\nOutput: canonical points to https://example.com/blog/old-post (mismatch)`,
        note: 'Flags a canonical tag silently misdirecting search indexing.',
      },
      {
        title: 'Confirm a missing canonical tag',
        code: `Input: https://example.com/products/widget\nOutput: no canonical tag found`,
        note: 'Catches the absence of a tag entirely, not just a wrong one.',
      },
    ],
  },
};

export default FIX_BATCH_94;
