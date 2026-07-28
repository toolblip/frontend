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

const FIX_BATCH_60: Record<string, FixBatchEntry> = {
  'word-count-from-url': {
    description: `Checking a competitor's blog post's actual word count usually means opening the page, selecting all the text, and pasting it somewhere else just to get a number, a slow detour when the URL itself is really the only thing that should be needed. This tool fetches a webpage directly from its URL and counts its words, characters, and paragraphs, skipping the copy-paste step entirely. Useful for benchmarking a competitor's article length for content planning without manually copying the whole page, confirming your own published post actually meets a guest submission's minimum word count by just pasting its URL, or quickly comparing several competing articles' lengths one URL at a time without opening and copying each one.`,
    examples: [
      {
        title: "Check a competitor's article length",
        code: `Input: competitor-blog.com/best-practices-guide\nOutput: 2,340 words, 12,180 characters, 34 paragraphs`,
        note: 'Gets a word count directly from the URL without copying the page manually.',
      },
      {
        title: 'Confirm a guest post meets the minimum',
        code: `Input: myblog.com/guest-post-draft\nOutput: 1,150 words (minimum required: 1,000)`,
        note: 'Checks a published page against a length requirement in one step.',
      },
    ],
  },

  'credit-card-validator': {
    description: `A credit card number typed with one digit transposed or dropped will usually fail the Luhn checksum built into every card number, a purely mathematical check that catches a typo instantly without proving anything about whether the card is actually active or has funds behind it, that's simply not what the checksum is for. This tool validates a card number against the Luhn algorithm and identifies which network issued it, Visa, Mastercard, American Express, and more, based on its prefix pattern. Useful for catching a mistyped card number in a checkout form before it gets submitted, identifying a card's network to show the correct card icon during checkout, or testing a payment form's validation logic during development with a properly Luhn-valid dummy number.`,
    examples: [
      {
        title: 'Validate a card number and identify the network',
        code: `Input: 4111 1111 1111 1111\nOutput: valid (Luhn check passed), network: Visa`,
        note: "Identifies the network from the number's prefix pattern.",
      },
      {
        title: 'Catch a mistyped card number',
        code: `Input: 4111 1111 1111 1112\nOutput: invalid - fails Luhn checksum`,
        note: 'Flags a likely typo before the number is submitted.',
      },
    ],
  },

  'decimal-to-binary': {
    description: `Decimal is the format most people actually think in day to day, which makes it the natural starting point whenever a number needs converting into whatever format a specific context actually calls for, binary to see its raw bit pattern, hex for a color value, octal for a Unix file permission notation. This tool converts a decimal number into binary, hexadecimal, and octal instantly, starting from the format that's usually already on hand rather than requiring it converted through an intermediate step first. Useful for converting a decimal homework answer into the other number formats an assignment requires, checking what a decimal value looks like in hex while debugging, or converting a decimal number into octal to understand a Unix file permission setting.`,
    examples: [
      {
        title: 'Convert a decimal number to all formats',
        code: `Input: 202\nOutput: binary: 11001010, hex: CA, octal: 312`,
        note: 'Starts from decimal, the format most people already think in.',
      },
      {
        title: 'Check a Unix file permission number',
        code: `Input: 493 (decimal)\nOutput: octal: 755`,
        note: 'Converts a decimal permission value into the octal chmod actually expects.',
      },
    ],
  },

  'paragraph-writer': {
    description: `Getting stuck partway through an article with a specific section that just won't come together is a different problem than needing placeholder text for a mockup, the paragraph actually needs to say something real and fit the piece it's going into, not simply hold space until real content shows up later. This tool generates a complete, usable paragraph with AI based on a given topic or prompt, filling an actual content gap in a real piece of writing rather than producing filler meant to be replaced later. Useful for drafting a paragraph on a specific point that's proving hard to write from scratch, filling a gap in an article where the structure is there but the words aren't coming, or generating a usable first draft of a section to edit and refine rather than starting from a blank page.`,
    examples: [
      {
        title: 'Fill a stuck section of an article',
        code: `Input: topic: "why remote teams struggle with async communication"\nOutput: a complete paragraph addressing the topic, ready to edit into the article`,
        note: 'Produces usable draft content, not placeholder filler.',
      },
      {
        title: 'Draft a first pass to refine',
        code: `Input: prompt: "explain the benefit of automated testing to a non-technical reader"\nOutput: a paragraph written in plain language suited to that audience`,
        note: 'Gives a starting draft instead of a blank page.',
      },
    ],
  },

  'favicon-preview-tool': {
    description: `An icon that looks crisp and detailed at full size can turn into an unrecognizable smudge once shrunk down to the sixteen pixels an actual browser tab uses, and a color scheme that reads clearly against a light background can disappear entirely against a dark one, neither of which is obvious just looking at the original full-size artwork. This tool previews how a favicon actually looks at different sizes and against various backgrounds, showing exactly what survives the shrink down to a real browser tab rather than just the original artwork at full size. Useful for checking whether a newly designed icon's fine details actually survive being shrunk to 16 pixels, seeing how an icon looks against both a light and a dark browser tab background before committing to it, or comparing a few icon design candidates side by side at their actual deployed size.`,
    examples: [
      {
        title: 'Check legibility at 16 pixels',
        code: `Input: new-icon.png\nOutput: preview at 16x16, 32x32, and 48x48 - fine details blur out at 16x16`,
        note: 'Reveals whether small details survive the shrink to browser tab size.',
      },
      {
        title: 'Compare against light and dark backgrounds',
        code: `Input: icon.png\nOutput: preview on white tab background and dark tab background side by side`,
        note: 'Shows whether the icon stays legible in both browser themes.',
      },
    ],
  },

  'favicon-grabber': {
    description: `Wanting to see how a competitor's or a reference site's favicon actually looks up close, needing to recover your own site's icon file after the original source got lost somewhere, or building something like a bookmarks app that needs to display each saved site's actual icon all come down to the same need, pulling a favicon directly off a live website rather than starting from scratch. This tool downloads the favicon from any website URL in ICO, PNG, and SVG formats, retrieving whatever version is actually available rather than requiring the original source file. Useful for grabbing a competitor's favicon for design comparison or inspiration, recovering your own site's icon after losing its original source file, or pulling a specific site's icon in SVG format for an app that displays saved sites with their actual icons.`,
    examples: [
      {
        title: "Download a site's favicon",
        code: `Input: example.com\nOutput: favicon.ico, favicon.png, favicon.svg`,
        note: 'Pulls whichever formats the site actually has available.',
      },
      {
        title: 'Recover a lost icon file',
        code: `Input: mysite.com\nOutput: favicon-32x32.png`,
        note: 'Retrieves the deployed icon when the original source file is gone.',
      },
    ],
  },

  'gif-to-mp4': {
    description: `A GIF is capped at 256 colors and compresses poorly by design, which is exactly why the same short animation saved as MP4 instead can end up a fraction of the file size with noticeably smoother color and playback, a swap several major platforms already make automatically behind the scenes the moment a GIF gets uploaded. This tool converts an animated GIF into MP4 directly, producing the same animation at a dramatically smaller file size with better color quality than GIF's limited palette allows. Useful for shrinking a large GIF's file size before hosting or sharing it somewhere with a strict upload limit, getting smoother playback and richer color out of an animation GIF's harsh 256-color limit was flattening, or preparing an animated GIF for a platform that handles MP4 more efficiently than it handles GIF.`,
    examples: [
      {
        title: 'Shrink a large GIF for sharing',
        code: `Input: animation.gif (18 MB)\nOutput: animation.mp4 (1.2 MB)`,
        note: 'Keeps the same animation at a fraction of the file size.',
      },
      {
        title: 'Get smoother color from a GIF',
        code: `Input: gradient-animation.gif (banding visible)\nOutput: gradient-animation.mp4 (smooth color, no banding)`,
        note: "Escapes GIF's 256-color limit for richer, smoother playback.",
      },
    ],
  },

  zip: {
    description: `An email that rejects several separate attachments or balks at their combined size usually accepts the exact same files without complaint once they're bundled into a single archive first, and sharing a whole set of related files as one download is simply cleaner than sending each one separately and hoping nothing gets lost along the way. This tool creates a ZIP archive from multiple files, compressing them together into one file that's easier to share, upload, or attach than the same files sent individually. Useful for bundling several attachments into one file an email client will actually accept without complaint, compressing a folder of files to reduce the total size before uploading them somewhere, or packaging a set of related project files together as a single shareable download.`,
    examples: [
      {
        title: 'Bundle several files for an email attachment',
        code: `Input: report.pdf, chart.png, data.csv\nOutput: documents.zip`,
        note: 'Combines multiple attachments into one file an email client will accept.',
      },
      {
        title: "Package a project's files for sharing",
        code: `Input: [12 project files]\nOutput: project-files.zip (compressed, single download)`,
        note: 'Keeps a related set of files together as one shareable archive.',
      },
    ],
  },

  'rot47-cipher': {
    description: `ROT13 only shifts letters, leaving a phone number, a code snippet's punctuation, or any digit sitting right there in plain sight even after the surrounding text gets scrambled, which is exactly the gap ROT47 closes by rotating across the entire ninety-four character range of printable ASCII, letters, digits, and symbols together, rather than only the alphabet. This tool applies that ROT47 rotation to encode or decode text, obscuring numbers and punctuation along with letters instead of leaving them untouched. Useful for obscuring a piece of text that includes a phone number or a code that ROT13 alone would leave embarrassingly readable, scrambling a code snippet's punctuation in a forum post where that's actually part of what needs hiding, or decoding a ROT47-obscured string back into its original readable form.`,
    examples: [
      {
        title: 'Obscure text that includes numbers',
        code: `Input: "Call me at 555-0142"\nOutput: "r2== >6 2E ddd\\_\`ca"`,
        note: "Scrambles the digits too, unlike ROT13, which would leave them untouched.",
      },
      {
        title: "Obscure a code snippet's punctuation",
        code: `Input: "if (x != 0)"\nOutput: ":7 WI Pl _X"`,
        note: 'Rotates symbols and digits along with letters across the full 94-character range.',
      },
    ],
  },

  'shell-command-reference': {
    description: `Knowing roughly what needs doing, finding every file modified in the last day, extracting a specific archive format, isn't the same as remembering the exact flag combination a command actually needs, especially for something used rarely enough that the syntax never quite sticks between uses. This tool provides a quick reference for common shell commands, showing syntax and a practical example for each rather than requiring a full manual page read just to confirm one flag. Useful for looking up the exact flag combination for a command that's used rarely enough to keep forgetting, refreshing memory on tar's specific syntax before extracting an unfamiliar archive format, or learning what a common command actually does through a practical example instead of reading its entire manual page.`,
    examples: [
      {
        title: "Look up a rarely-used command's syntax",
        code: `Command: tar\nExample: tar -xzvf archive.tar.gz\nUse case: extract a gzip-compressed tar archive`,
        note: 'Refreshes the exact flag combination for a command that is easy to forget.',
      },
      {
        title: 'Find files modified recently',
        code: `Command: find\nExample: find . -mtime -1\nUse case: list files modified in the last 24 hours`,
        note: 'Shows a practical example instead of requiring the full manual page.',
      },
    ],
  },
};

export default FIX_BATCH_60;
