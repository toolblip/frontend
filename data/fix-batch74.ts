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

const FIX_BATCH_74: Record<string, FixBatchEntry> = {
  'ai-twitter-generator': {
    description: `A tweet has to work inside a hard 280-character limit, and a genuinely engaging thread needs an opening line built specifically to stop someone mid-scroll, then a handful of connected posts that each build on the last without losing momentum, a very different writing problem from drafting a paragraph with no length constraint at all. This tool generates tweets and full threads from a topic or a rough idea, sized to fit Twitter's character limit and structured so a thread actually reads as one connected sequence rather than a list of disconnected posts. Useful for turning a rough idea into a properly hooked opening tweet, breaking a longer thought into a numbered thread that keeps someone reading past the first post, or drafting a handful of standalone tweet options to pick from for a single announcement.`,
    examples: [
      {
        title: 'Generate a hooked opening tweet',
        code: `Input: topic: "why most SaaS onboarding fails"\nOutput: "Most SaaS onboarding fails for one boring reason: nobody tested it with a user who wasn't already an expert. A thread on the fix"`,
        note: 'Written to stop a scroll rather than just state the topic.',
      },
      {
        title: 'Break an idea into a numbered thread',
        code: `Input: topic: "3 lessons from a failed product launch"\nOutput: 1/ hook tweet, 2/ lesson one, 3/ lesson two, 4/ lesson three, 5/ closing tweet`,
        note: 'Structures a longer idea as a connected sequence instead of separate posts.',
      },
    ],
  },

  'humanizer-ai': {
    description: `AI-generated text tends to carry a fairly recognizable fingerprint, oddly uniform sentence lengths, a narrow set of favorite transition words, a rhythm that reads a little too even from start to finish, and detection tools are specifically built to spot exactly that pattern rather than judge whether the writing is actually good. This tool rewrites AI-generated text to vary sentence structure and word choice the way a person naturally would, targeting the statistical patterns a detector actually looks for rather than just swapping in different vocabulary. Useful for taking a rough AI-drafted paragraph and giving it more natural sentence variation before it's used anywhere, reworking a stiff, uniform piece of writing into something that reads less mechanically, or checking how a specific passage changes once its rhythm is broken up.`,
    examples: [
      {
        title: 'Vary rhythm in a stiff AI paragraph',
        code: `Input: "The product offers many benefits. The product is easy to use. The product saves time."\nOutput: "The product saves time and stays easy to use, and that combination alone covers most of what it actually offers."`,
        note: 'Breaks up the repetitive sentence-length pattern detectors look for.',
      },
      {
        title: 'Replace an overused AI transition word',
        code: `Input: "Moreover, the results were significant."\nOutput: "The results were significant, too."`,
        note: 'Removes a word disproportionately common in AI-generated text.',
      },
    ],
  },

  'data-uri-generator': {
    description: `An external image or font file means an extra HTTP request before a page can fully render it, and for something small, a tiny icon, a background pattern, a custom font file, that round trip is often unnecessary overhead a data URI avoids entirely by embedding the file's actual bytes directly into the HTML, CSS, or XML that references it. This tool encodes any file or text as a complete data URI, with the correct MIME type prefix already attached, ready to paste straight into a src attribute or a CSS url() function rather than left as a raw, unlabeled base64 string. Useful for embedding a small icon directly inside a CSS file so it loads with zero extra requests, inlining a custom font for an email template that can't reference external files, or turning any file into a single copyable string for pasting into source code.`,
    examples: [
      {
        title: 'Embed a small icon in CSS',
        code: `Input: icon.png\nOutput: background-image: url("data:image/png;base64,iVBORw0KGgoAAA...")`,
        note: 'Ready to paste directly into a CSS url() with no separate file request.',
      },
      {
        title: 'Inline a font for an email template',
        code: `Input: custom-font.woff2\nOutput: data:font/woff2;base64,d09GMgABAAAAAA...`,
        note: 'Useful where an email client cannot load an external font file.',
      },
    ],
  },

  'csv-to-json': {
    description: `A spreadsheet export is naturally flat, one row, one set of columns, but the JSON a script or an API actually wants often needs that same data nested, a column header written as user.name or address.city turned into an actual nested object rather than a flat key with a dot in its name, and every value still typed correctly instead of being left as a string just because CSV doesn't have real types. This tool converts CSV into JSON with automatic header detection, turns dot-notation column headers into properly nested objects, and infers whether each value should actually be a number, a boolean, or text. Useful for turning a flat CSV export into nested JSON objects a script expects, converting a spreadsheet of user records into an array ready to feed into an API, or getting numeric and boolean fields typed correctly instead of quoted as strings.`,
    examples: [
      {
        title: 'Turn dot-notation headers into nested objects',
        code: `Input CSV:\nname,address.city,address.zip\nJane,Austin,73301\nOutput JSON:\n[{ "name": "Jane", "address": { "city": "Austin", "zip": "73301" } }]`,
        note: 'Converts a flat dotted header into an actual nested object.',
      },
      {
        title: 'Infer types instead of leaving everything as text',
        code: `Input CSV:\nid,active,price\n1,true,19.99\nOutput JSON:\n[{ "id": 1, "active": true, "price": 19.99 }]`,
        note: 'Numbers and booleans come out typed instead of quoted as strings.',
      },
    ],
  },

  'html-plaintext-express': {
    description: `Pasting rich content copied from a webpage or an email straight into a plain text field, an SMS, a plain text email body, a form that only accepts unformatted input, often brings along the actual HTML tags as visible clutter rather than the readable words those tags were only ever meant to format. This tool strips every HTML tag from a block of markup and extracts just the clean, readable text underneath, ready to use wherever formatting isn't wanted or supported. Useful for pulling readable text out of a webpage's HTML source for a plain text email, cleaning up rich content pasted from a browser before dropping it into a form that shows raw tags otherwise, or converting scraped HTML into plain words for a tool that expects unformatted input.`,
    examples: [
      {
        title: 'Strip tags before pasting into a plain text email',
        code: `Input: <p>Hello <b>Jane</b>, your <a href="#">order</a> shipped.</p>\nOutput: Hello Jane, your order shipped.`,
        note: 'Removes the markup while keeping the readable words intact.',
      },
      {
        title: 'Clean up scraped HTML content',
        code: `Input: <div class="post"><h2>Update</h2><p>New pricing starts Monday.</p></div>\nOutput: Update\nNew pricing starts Monday.`,
        note: 'Leaves plain readable text for a tool that expects unformatted input.',
      },
    ],
  },

  'jwt-token-tester': {
    description: `Decoding a JWT only shows what a token claims about itself, the header, the payload, an expiration date, but it says nothing about whether that token would actually be accepted by a server, since that depends on whether its signature genuinely verifies against the correct secret or public key, a question a plain decoder can't answer at all. This tool decodes a JWT's header and payload the way any decoder would, but also verifies its signature against a supplied key in real time, showing whether the token would actually pass validation rather than just what it claims to contain. Useful for debugging why a server is rejecting a token that looks correctly formatted, confirming a signing secret actually produces a token that validates, or checking whether an expired or tampered token fails signature verification as expected.`,
    examples: [
      {
        title: 'Verify a signature against a secret',
        code: `Input: token: eyJhbGciOiJIUzI1NiJ9..., secret: "my-signing-key"\nOutput: signature valid`,
        note: 'Confirms the token would actually pass validation, not just that it decodes.',
      },
      {
        title: 'Catch a tampered token',
        code: `Input: modified payload, original signature\nOutput: signature invalid`,
        note: 'Flags a token whose payload no longer matches its signature.',
      },
    ],
  },

  'jpg-to-svg': {
    description: `Converting a JPEG into most other image formats just repackages the same grid of pixels differently, but turning one into an SVG is a fundamentally different process, tracing the shapes and color regions in the bitmap and rebuilding them as actual vector paths, an approximation of the original image rather than a pixel-for-pixel copy in a new container. This tool vectorizes a JPEG photo or graphic into SVG, producing scalable vector paths instead of a fixed grid of pixels. Useful for turning a small raster logo into an SVG that scales to any size without pixelating, converting a simple photo or illustration into editable vector shapes for a design tool, or getting a JPEG into a format that stays sharp on a high-resolution display regardless of how large it's rendered.`,
    examples: [
      {
        title: 'Vectorize a small raster logo',
        code: `Input: logo.jpg (200x200px)\nOutput: logo.svg (scalable to any size)`,
        note: 'Stays sharp at any size instead of pixelating like the original raster file.',
      },
      {
        title: 'Convert a simple illustration into editable shapes',
        code: `Input: icon-drawing.jpg\nOutput: icon-drawing.svg (individual vector paths)`,
        note: 'Produces vector paths that a design tool can select and edit individually.',
      },
    ],
  },

  'text-diff': {
    description: `Reading two versions of the same document side by side rarely reveals every actual change, a swapped word buried in a long paragraph, a line quietly deleted, an edit that looks identical at a glance but isn't, exactly the kind of difference that's obvious once it's highlighted but easy to miss just by eye. This tool compares two blocks of text and highlights every added, removed, and unchanged line between them, making an edit's actual scope visible rather than left to a manual read-through. Useful for reviewing exactly what changed between an original draft and an edited version before accepting it, catching an unintended change that slipped into a shared document, or comparing two versions of a config file or a piece of copy line by line.`,
    examples: [
      {
        title: 'Review an edited draft against the original',
        code: `Original: "The launch is scheduled for March."\nEdited: "The launch is scheduled for April."\nOutput: "March" removed, "April" added`,
        note: 'Highlights the exact word that changed instead of requiring a full re-read.',
      },
      {
        title: 'Compare two versions of a config file',
        code: `Version A: port: 3000\nVersion B: port: 8080\nOutput: line changed - "3000" -> "8080"`,
        note: 'Surfaces a config change that might otherwise go unnoticed.',
      },
    ],
  },

  'mkv-to-avi': {
    description: `MKV is a flexible, modern container that can hold multiple audio tracks, embedded subtitles, and chapter markers all in one file, but that flexibility is exactly why a lot of older hardware and software, an aging DVD player, a legacy editing tool, some embedded systems, can't open it at all, while AVI, an older and far simpler format, plays on almost everything even if it means leaving some of MKV's extra tracks behind. This tool converts an MKV video into AVI, trading MKV's richer feature set for a format practically guaranteed to open wherever it's sent. Useful for converting a video for a device or player that flatly refuses to open MKV files, preparing a video for older editing software that only recognizes AVI, or sharing a video with someone whose player doesn't support MKV's newer container format.`,
    examples: [
      {
        title: 'Convert for a device that rejects MKV',
        code: `Input: vacation-clip.mkv (H.264, 2 audio tracks)\nOutput: vacation-clip.avi`,
        note: 'Plays on hardware and software that has no MKV support at all.',
      },
      {
        title: 'Prepare a video for older editing software',
        code: `Input: recording.mkv\nOutput: recording.avi`,
        note: 'AVI opens in legacy editing tools that never added MKV support.',
      },
    ],
  },

  'regex-match-tester': {
    description: `Testing whether a regex matches something is only half the actual problem when the pattern is destined for a find-and-replace operation, since a replacement string with capture group backreferences, $1, $2, and so on, can silently produce something completely different from what was intended if a group is numbered wrong or a backreference points at the wrong part of the match. This tool tests a regex pattern against sample text and previews exactly what a replacement string produces, backreferences included, before that pattern gets used in an actual find-and-replace on real files or code. Useful for confirming a replacement string's backreferences pull the right captured groups into the output, catching a pattern that matches correctly but replaces incorrectly, or previewing a bulk find-and-replace safely before running it for real.`,
    examples: [
      {
        title: 'Preview a replacement with backreferences',
        code: `Pattern: /(\\w+)\\s(\\w+)/\nReplacement: "$2 $1"\nInput: "John Smith"\nOutput: "Smith John"`,
        note: 'Shows exactly what the replacement produces before running it for real.',
      },
      {
        title: 'Catch a backreference pointing at the wrong group',
        code: `Pattern: /(\\d{3})-(\\d{4})/\nReplacement: "$2-$1"\nInput: "555-1234"\nOutput: "1234-555"`,
        note: 'Surfaces a swapped backreference before it corrupts real data.',
      },
    ],
  },
};

export default FIX_BATCH_74;
