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

const FIX_BATCH_108: Record<string, FixBatchEntry> = {
  rearrange: {
    description: `Fixing a scanned document where the pages landed out of order, or one where a page ended up upside down, means either rescanning from scratch or opening a full PDF editor just to move and rotate a handful of pages, both heavier than the actual fix requires when the content itself is already fine. This tool reorders, rotates, and reorganizes PDF pages through a drag-and-drop interface, built for restructuring an existing document's page order rather than editing the content on any individual page. Useful for fixing a scanned document's pages that came out in the wrong order, rotating a page that landed sideways or upside down without touching the rest of the file, or reorganizing a multi-source PDF's pages into the sequence they were actually meant to be read in.`,
    examples: [
      {
        title: 'Fix a scanned document with pages out of order',
        code: `Input: scan.pdf (pages: 3, 1, 2, 4)\nOutput: scan-reordered.pdf (pages: 1, 2, 3, 4)`,
        note: 'Restructures page order without editing any page content.',
      },
      {
        title: 'Rotate one sideways page',
        code: `Input: report.pdf, page 5: rotate 90deg\nOutput: report.pdf (page 5 corrected, rest unchanged)`,
        note: 'Fixes one page without touching the rest of the file.',
      },
    ],
  },

  'regex-explainer': {
    description: `Writing a pattern that looks syntactically correct and writing one that actually does what was intended aren't the same thing, a quantifier applied to only the last character instead of a whole group because of a missing set of parentheses, or a dot matching more than actually meant to be included, mistakes that read fine on the page and only surface once a plain-English breakdown shows what the pattern you wrote is actually doing. This tool explains a regex pattern piece by piece in plain English, useful specifically for reading back your own just-written pattern to catch a gap between intended and actual behavior. Useful for catching your own regex mistake before it ships, verifying a quantifier or a group is scoped the way it was meant to be, or double-checking a pattern's actual behavior against what was intended rather than assumed correct on sight.`,
    examples: [
      {
        title: 'Catch a scoping mistake in your own pattern',
        code: `Input: /ab+/\nOutput: "matches 'a' followed by one or more 'b' - the + applies to 'b' only, not the whole group"`,
        note: 'Reveals a gap between intended and actual quantifier scope.',
      },
      {
        title: "Verify a pattern before shipping it",
        code: `Input: /^\\d{3}-\\d{4}$/\nOutput: "matches exactly 3 digits, a hyphen, then exactly 4 digits, start to end"`,
        note: 'Confirms what was actually written, not what was intended.',
      },
    ],
  },

  'regex-match-visualizer': {
    description: `Highlighting matched text in a sample string shows what a pattern found, but it doesn't show how the pattern itself is actually structured, which groups nest inside which, where an alternation branches into separate options, a different question that matters once a pattern gets complicated enough that its own shape is hard to hold in your head just from reading the raw syntax. This tool visualizes a regex's matches with highlighted groups while testing in real time, making a pattern's internal structure, not just its matched output, easier to follow at a glance. Useful for understanding how a complex pattern's groups and alternation actually nest together rather than just seeing what text it matched, following exactly which capture group corresponds to which highlighted piece of a match, or making sense of an already-written pattern's internal structure before modifying it.`,
    examples: [
      {
        title: "Follow a pattern's nested group structure",
        code: `Input: /(\\d{3})-(\\d{2}(-\\d{2})?)/\nOutput: visual breakdown showing group 2 nesting an optional group 3`,
        note: "Shows how groups relate, not just what text matched.",
      },
      {
        title: 'See which group matched which piece',
        code: `Input: /(\\w+)@(\\w+)\\.(\\w+)/ against "user@example.com"\nOutput: group 1: user, group 2: example, group 3: com (each highlighted distinctly)`,
        note: 'Maps each highlighted piece to its exact capture group.',
      },
    ],
  },

  'regex-pattern-generator-v2': {
    description: `A pattern generated from a plain-language description can look entirely correct and still fail the moment a tricky real input shows up, an email pattern that trips on a plus sign in the local part, a URL pattern that misses a query string, gaps that only surface once the generated pattern actually gets tested against edge cases rather than handed back and trusted. This tool generates a regex pattern from a natural language description for emails, URLs, phones, and more, verifying the result against known tricky edge cases for that pattern type before returning it rather than handing back an untested first attempt. Useful for generating a pattern and trusting it's already been checked against common edge cases, getting a working email or URL pattern that's been verified rather than just plausible-looking, or generating a starting pattern for a common format with the riskiest edge cases already accounted for.`,
    examples: [
      {
        title: 'Generate a verified email pattern',
        code: `Input: "match a valid email address"\nOutput: /^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$/ (tested against plus-addressing and subdomains)`,
        note: 'Checked against edge cases before being returned.',
      },
      {
        title: 'Generate a URL pattern that handles query strings',
        code: `Input: "match a URL"\nOutput: pattern verified against URLs with query strings and fragments`,
        note: "Catches a gap a plausible-looking pattern might otherwise miss.",
      },
    ],
  },

  'regex-visual-builder': {
    description: `Every other way to build a regex here eventually means typing or editing actual regex syntax, characters, quantifiers, character classes, at some point in the process, which assumes a baseline comfort with that syntax that not everyone building a pattern actually has yet. This tool builds a regex pattern visually through a node-based editor, connecting individual pieces, a character class, a quantifier, a group, without ever requiring regex syntax to be typed directly, and shows matches updating in real time as the visual structure changes. Useful for constructing a working pattern without needing to already know regex syntax well enough to type it correctly, building a complex pattern by arranging its pieces visually rather than writing dense syntax by hand, or seeing exactly how each visual piece added actually changes what the pattern matches in real time.`,
    examples: [
      {
        title: 'Build a pattern without typing regex syntax',
        code: `Nodes: [digit] x3 -> [literal "-"] -> [digit] x4\nOutput: /\\d{3}-\\d{4}/ (assembled from connected nodes)`,
        note: 'Never requires typing regex syntax directly.',
      },
      {
        title: 'See a pattern update as nodes change',
        code: `Action: add [optional] wrapper around a node\nOutput: matches update live to reflect the new optional group`,
        note: 'Shows the effect of each visual change in real time.',
      },
    ],
  },

  'remove-watermark-photo': {
    description: `A small logo burned into one corner of a photo is a different removal problem than a large, repeating diagonal mark tiled across most of the frame, a photographer's proof stamp on a draft, or a temporary watermark added while sharing edits with family before a final version comes together, since reconstructing one localized patch is a different job than reconstructing a pattern repeated across many overlapping regions of the same image. This tool removes watermark marks specifically from photographs, restoring a clean image from a mark spanning a larger portion of the frame rather than one small, localized area. Useful for clearing a photographer's own proof watermark from a photo before delivering a version a client has already paid for, removing a large diagonal draft mark added while collaborating on edits, or restoring a clean photo once a temporary watermark covering much of the frame is no longer needed.`,
    examples: [
      {
        title: "Clear a photographer's proof watermark",
        code: `Input: proof-photo.jpg (diagonal "PROOF" text tiled across frame)\nOutput: final-photo.jpg (mark removed, ready to deliver)`,
        note: 'Reconstructs a pattern spanning most of the frame, not one small patch.',
      },
      {
        title: 'Remove a temporary draft mark',
        code: `Input: draft-edit.jpg ("DRAFT" repeated across the image)\nOutput: final-edit.jpg`,
        note: 'Restores a clean image once the temporary mark is no longer needed.',
      },
    ],
  },

  resize: {
    description: `Batch-resizing dozens of files or hitting a named platform's exact preset dimension are both real needs, but sometimes it's simpler than either, one image, resized right now, either kept proportional or set to an exact size typed in directly, without configuring a batch job or picking from a list of platform presets first. This tool resizes an image to any dimension, maintaining aspect ratio or setting an exact size, built as a direct, single-image resize rather than a batch tool or a preset-driven one. Useful for resizing one image quickly to an exact width and height typed in directly, scaling a single photo down while keeping its aspect ratio locked, or resizing an image right now without setting up a batch job or choosing from a list of named platform presets first.`,
    examples: [
      {
        title: 'Resize one image to an exact size',
        code: `Input: photo.jpg, width: 800, height: 600\nOutput: photo-resized.jpg (800x600 exact)`,
        note: 'A direct single-image resize, no batch setup required.',
      },
      {
        title: 'Scale down while keeping proportions',
        code: `Input: banner.png, width: 1200, lock ratio: true\nOutput: banner-resized.png (height scaled proportionally)`,
        note: 'A quick toggle between exact size and locked ratio.',
      },
    ],
  },

  'rgb-to-hex-express': {
    description: `An eyedropper tool sampling a color off a screenshot, or a design tool's inspector panel, usually reports a color as RGB numbers first, and getting that same color into a CSS class or a hex-based config value means converting those RGB numbers into hex, the opposite direction from starting with a hex code already in hand. This tool converts RGB and RGBA values into HEX format with a live preview swatch, built for exactly that direction, RGB numbers already in hand needing a hex equivalent, rather than the reverse. Useful for converting a color sampled with an eyedropper tool into the hex code a stylesheet actually needs, turning RGB values read off a design tool's inspector panel into hex for a CSS class, or getting a quick hex equivalent for RGB numbers already copied from somewhere else.`,
    examples: [
      {
        title: 'Convert an eyedropper-sampled color to hex',
        code: `Input: rgb(37, 99, 235)\nOutput: #2563EB`,
        note: 'Starts from RGB numbers already in hand, not a hex code.',
      },
      {
        title: "Convert a design tool's inspector reading",
        code: `Input: rgba(232, 115, 74, 0.8)\nOutput: #E8734A (with alpha noted separately)`,
        note: 'Handles the RGB-to-hex direction a stylesheet often needs.',
      },
    ],
  },

  'rgba-to-hsl': {
    description: `HSL doesn't have a standard alpha component the way RGBA does, but CSS's hsla() function does, which means converting a semi-transparent RGBA color, one with an opacity slider already set in a design tool, into HSL for adjusting hue or lightness independently means carrying that same alpha value through rather than quietly dropping it during the conversion. This tool converts RGBA color values into HSL with alpha transparency support and a live preview, preserving the exact same transparency level through the conversion rather than losing it along the way. Useful for converting a semi-transparent RGBA color into HSL while keeping its exact opacity intact, adjusting a color's hue or lightness independently without accidentally losing its transparency in the process, or getting an HSLA value that carries over the identical alpha an RGBA color already had.`,
    examples: [
      {
        title: 'Convert a semi-transparent color to HSL',
        code: `Input: rgba(37, 99, 235, 0.6)\nOutput: hsla(217, 83%, 53%, 0.6)`,
        note: 'Carries the alpha value through rather than dropping it.',
      },
      {
        title: 'Adjust lightness without losing transparency',
        code: `Input: rgba(232, 115, 74, 0.4)\nOutput: hsla(15, 68%, 60%, 0.4)`,
        note: 'Preserves the exact same opacity through the conversion.',
      },
    ],
  },

  'robots-txt-analyzer': {
    description: `Editing robots.txt visually and watching a live crawler simulation update is one workflow, meant for building or actively changing rules, but auditing a file that's already live and presumably working is a different task, checking what's actually being blocked, confirming a sitemap reference is present, without necessarily changing anything at all. This tool analyzes an existing robots.txt file to check crawler directives, blocked paths, and sitemap references, built for auditing a file that's already deployed rather than editing or building one from scratch. Useful for auditing a live site's robots.txt to confirm exactly which paths are actually being blocked, checking that a sitemap reference is present and correctly formatted, or reviewing an inherited robots.txt file's directives before deciding whether anything actually needs changing.`,
    examples: [
      {
        title: "Audit a live site's blocked paths",
        code: `Input: https://example.com/robots.txt\nOutput: Disallow: /admin/, /tmp/ | Sitemap: present and valid`,
        note: 'Checks a deployed file rather than editing or building one.',
      },
      {
        title: 'Review an inherited robots.txt',
        code: `Input: [robots.txt from a legacy site]\nOutput: 3 directives found, no sitemap reference present`,
        note: 'Surfaces what a file actually does before deciding to change it.',
      },
    ],
  },
};

export default FIX_BATCH_108;
