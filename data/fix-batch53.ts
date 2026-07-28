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

const FIX_BATCH_53: Record<string, FixBatchEntry> = {
  'uuid-validator': {
    description: `A string that looks roughly UUID-shaped, the right length with dashes in the right places, isn't necessarily a valid one, and even a properly formatted UUID still comes in different versions, v1 built from a timestamp and a MAC address, v4 purely random, v7 time-ordered, each identifiable by a specific version digit embedded in the string itself. This tool validates whether a UUID string is actually correctly formatted and identifies which version it is from that embedded digit, rather than just confirming it merely looks the right shape. Useful for confirming a UUID pulled from a log or a database is actually valid before trusting it, identifying whether a given UUID is v1, v4, or v7 by reading its version marker, or catching a malformed UUID that's missing a dash or has an extra character before it causes an error somewhere else.`,
    examples: [
      {
        title: 'Identify a UUID version',
        code: `Input: 018f4d2a-7b3e-7c21-9a4d-3e8f1c9b2a6d\nOutput: valid, version 7 (time-ordered)`,
        note: 'Reads the version digit embedded in the string itself.',
      },
      {
        title: 'Catch a malformed UUID',
        code: `Input: 550e8400-e29b-41d4-a716-44665544000\nOutput: invalid - missing one character`,
        note: "Flags a UUID that looks close but isn't actually correctly formatted.",
      },
    ],
  },

  'seo-title-tag-generator': {
    description: `Google doesn't show an entire title tag once it runs past roughly sixty characters, cutting it off mid-word with an ellipsis instead, and a title that reads perfectly well in an editor can still get truncated awkwardly in an actual search result without a character count actually being watched while writing it. This tool generates an SEO-optimized title tag with a live character count and a preview of how it will actually appear in a Google search result, catching a truncation problem before the page ever gets indexed. Useful for writing a title that fits within Google's actual display limit instead of getting cut off, previewing exactly how a page will look in search results before publishing, or trimming an existing title tag that's currently running too long.`,
    examples: [
      {
        title: 'Check for truncation in search results',
        code: `Input: "The Ultimate Comprehensive Guide to Choosing the Perfect Running Shoes for Every Foot Type"\nOutput: 92 characters - will be truncated in Google's search result`,
        note: "Flags a title before it gets cut off with an ellipsis in search results.",
      },
      {
        title: 'Preview a title tag',
        code: `Input: "10 Budget Travel Tips for 2025"\nOutput: 31 characters - fits fully, preview: "10 Budget Travel Tips for 2025 | Example Site"`,
        note: 'Shows exactly how the title will render in an actual Google result.',
      },
    ],
  },

  'unicode-escape-encoder': {
    description: `A non-ASCII character dropped directly into a JSON payload or a JavaScript source file doesn't always survive every system it passes through intact, which is exactly why an escape sequence like \\u00e9 exists, a safe, ASCII-only way to represent that same character that any parser can read reliably regardless of the file's actual encoding. This tool encodes Unicode characters into escape sequences and decodes an already-escaped string back into readable text, moving in either direction between the two representations. Useful for embedding an accented or a non-Latin character safely inside a JSON string, decoding an escaped string found in a log file or an API payload back into readable text, or converting a batch of special characters into escape sequences before they get pasted into a source file.`,
    examples: [
      {
        title: 'Encode a character for a JSON string',
        code: `Input: café\nOutput: caf\\u00e9`,
        note: 'Produces an ASCII-safe representation any parser can read reliably.',
      },
      {
        title: 'Decode an escaped string',
        code: `Input: "Caf\\u00e9 \\u2013 Menu"\nOutput: "Café – Menu"`,
        note: 'Converts escape sequences found in a log or payload back into readable text.',
      },
    ],
  },

  'css-to-tailwind': {
    description: `Migrating a component into a Tailwind-based project usually means translating its existing plain CSS properties into equivalent utility classes by hand, checking documentation for which class maps to which property and value, padding, margin, color, font size, one declaration at a time. This tool converts plain CSS properties into the matching Tailwind utility classes instantly, handling that mapping directly instead of requiring each property looked up individually. Useful for migrating a legacy component's stylesheet into a Tailwind project without rewriting every style from scratch, converting CSS exported from a design tool into utility classes that match an existing codebase's conventions, or translating a quick CSS snippet into Tailwind classes to keep a project's styling approach consistent.`,
    examples: [
      {
        title: 'Convert padding and color properties',
        code: `Input: padding: 16px; color: #1a1a1a; font-size: 14px;\nOutput: p-4 text-[#1a1a1a] text-sm`,
        note: 'Maps each CSS property to its equivalent Tailwind utility class.',
      },
      {
        title: 'Convert a flex layout',
        code: `Input: display: flex; justify-content: center; gap: 8px;\nOutput: flex justify-center gap-2`,
        note: 'Translates layout properties into matching utility classes.',
      },
    ],
  },

  'png-to-gif': {
    description: `PNG carries an actual alpha channel, smooth, partial transparency, unlike a JPG, which makes a sequence of PNGs the natural source for animating something like a logo or an icon that needs to sit on top of a transparent or a varying background, though GIF itself only supports fully transparent or fully opaque pixels, so that smooth alpha channel gets flattened into a hard edge during conversion. This tool turns a sequence of PNG images into an animated GIF, handling that transparency flattening directly rather than leaving an unexpected white or black box where a transparent area used to be. Useful for animating a logo or an icon sequence that needs to sit cleanly over a varying background, turning a series of transparent UI screenshots into a looping animation, or converting PNG frames into a GIF without an ugly transparency artifact showing up unexpectedly.`,
    examples: [
      {
        title: 'Animate a transparent logo sequence',
        code: `Input: logo-frame1.png, logo-frame2.png, logo-frame3.png (transparent background)\nOutput: logo-animation.gif`,
        note: 'Preserves the transparent background instead of adding an unexpected color box.',
      },
      {
        title: 'Turn UI screenshots into a looping demo',
        code: `Input: screen1.png, screen2.png, screen3.png\nOutput: demo.gif (looping)`,
        note: 'Combines a sequence of PNG frames into one shareable animation.',
      },
    ],
  },

  'trivia-generator': {
    description: `A classroom quiz, a trivia night at a bar, or an icebreaker game at a party all need a set of questions with actual correct answers ready to go, and coming up with a fresh batch on a specific topic without repeating the same handful of questions everyone's already heard takes longer than it should. This tool generates trivia questions and answers on a chosen topic, producing a ready-to-use set rather than requiring each question researched and written individually. Useful for building a classroom quiz on a specific subject without writing every question from scratch, generating trivia night material on a chosen theme for a bar or an event, or putting together a quick set of icebreaker questions for a party or a team game.`,
    examples: [
      {
        title: 'Generate a classroom quiz',
        code: `Input: topic: "World Geography", count: 5\nOutput: 5 questions with answers, e.g. "What is the longest river in the world?" -> "The Nile"`,
        note: 'Produces a ready-to-use question set on a specific subject.',
      },
      {
        title: 'Generate trivia night material',
        code: `Input: topic: "80s Movies", count: 10\nOutput: 10 questions and answers themed around 1980s films`,
        note: "Gives an event host a fresh set without reusing common questions.",
      },
    ],
  },

  'css-variable-generator': {
    description: `A design system supporting both a light and a dark theme usually needs every color token defined twice, once for each theme, and hand-writing that full set of custom properties for both a default and a dark variant doubles the work and doubles the chance one color gets missed on one side. This tool generates CSS custom properties from a color palette with light and dark theme variants included automatically, producing both sets of variables together rather than requiring the dark theme built separately afterward. Useful for setting up a design system's color tokens with dark mode support from the start, generating a consistent set of CSS variables from an existing brand palette, or adding theme support to a project that only has hardcoded color values right now.`,
    examples: [
      {
        title: 'Generate light and dark theme variables',
        code: `Input: primary: #2563EB\nOutput:\n:root { --color-primary: #2563EB; }\n[data-theme="dark"] { --color-primary: #60A5FA; }`,
        note: 'Produces both theme variants from a single palette input.',
      },
      {
        title: 'Generate a full palette as custom properties',
        code: `Input: palette: primary, secondary, accent\nOutput: --color-primary, --color-secondary, --color-accent (light + dark values each)`,
        note: 'Builds a complete token set instead of one variable at a time.',
      },
    ],
  },

  'change-bg-photo': {
    description: `A product photo shot against a cluttered desk or a portrait taken in front of a messy background both need more than the background simply removed, they need an actual new backdrop put in its place, a clean white background for an e-commerce listing or a studio-style backdrop for a professional headshot. This tool cuts the subject out of a photo and places it onto a new background entirely, replacing what was there rather than just leaving transparency behind. Useful for giving a product photo a clean, consistent white background for an online store listing, replacing a portrait's cluttered background with a professional-looking studio backdrop, or swapping a photo's background to match a specific brand color across an entire catalog.`,
    examples: [
      {
        title: 'Replace a product photo background',
        code: `Input: product-on-desk.jpg\nOutput: product-on-white.jpg (clean white backdrop)`,
        note: 'Cuts out the subject and places it on a new background rather than leaving it transparent.',
      },
      {
        title: 'Swap a portrait background',
        code: `Input: portrait-cluttered.jpg, backdrop: studio-gray.jpg\nOutput: portrait-studio.jpg`,
        note: 'Gives a casual photo a professional studio-style backdrop.',
      },
    ],
  },

  'percentage-off-calculator': {
    description: `A sale tag advertising 40 percent off is only half the information actually needed at checkout, the other half being what that percentage actually comes out to in real currency, and stacking a second discount on top of an already-discounted price doesn't work the way it might seem, an additional 10 percent off isn't the same as 10 percent off the original price. This tool calculates the discounted price and the amount saved from a percentage-off sale, working out the actual numbers rather than leaving mental math to happen at the register. Useful for checking whether a marked-down price at checkout actually matches the advertised discount, comparing two different sales to see which one actually saves more, or working out what a second discount stacked onto an already-reduced price actually comes to.`,
    examples: [
      {
        title: 'Calculate a discounted price',
        code: `Input: original: $80, discount: 40%\nOutput: discounted price: $48, saved: $32`,
        note: 'Confirms a marked-down price actually matches the advertised discount.',
      },
      {
        title: 'Compare two stacked discounts',
        code: `Input: $100 item, 20% off, then an additional 10% off\nOutput: final price: $72 (not $70)`,
        note: 'Shows that a second discount applies to the already-reduced price, not the original.',
      },
    ],
  },

  'svg-compressor': {
    description: `An SVG exported straight out of a design tool like Illustrator or Figma usually carries a fair amount of dead weight along with the actual artwork, editor metadata, unused definitions, comments, and path coordinates stored with far more decimal precision than a rendered icon will ever visibly need. This tool compresses an SVG file by stripping that unnecessary metadata and comments and optimizing its path data, shrinking the file down to roughly what the actual visible artwork requires. Useful for shrinking an icon's file size before shipping it to production, cleaning up an SVG that's bloated with editor-specific metadata from a design tool export, or trimming excess decimal precision out of path coordinates that a rendered icon doesn't actually need.`,
    examples: [
      {
        title: 'Strip editor metadata',
        code: `Input: icon.svg (4.2 KB, includes Illustrator metadata)\nOutput: icon.svg (1.1 KB, metadata and comments removed)`,
        note: 'Removes editor-specific data that never actually renders.',
      },
      {
        title: 'Optimize path coordinate precision',
        code: `Input: d="M12.0000001,8.4999998 L..."\nOutput: d="M12,8.5 L..."`,
        note: 'Trims excess decimal precision the rendered icon never visibly needs.',
      },
    ],
  },
};

export default FIX_BATCH_53;
