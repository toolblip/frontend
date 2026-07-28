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

const FIX_BATCH_9: Record<string, FixBatchEntry> = {
  'essay-writer': {
    description: `Starting an essay from just a topic name is a different problem than finishing one that's already underway: there's no existing sentence to pick up the tone from, no established argument to continue, just a blank page and a subject. This tool builds a complete essay structure from scratch, an introduction that states a thesis, body paragraphs that each develop one supporting point, and a conclusion that ties the argument back together, based on a topic and a stance provided up front. Give it "should remote work be the default" and a position to argue, and it drafts a full essay around that position rather than a single paragraph or a loose list of points. Useful as a starting structure for a school assignment, an opinion piece, or any writing task where the hardest part is deciding how to organize an argument before writing the details.`,
    examples: [
      {
        title: 'Build a full essay from a topic and stance',
        code: `Input: topic: "should remote work be the default", stance: for\nOutput: intro (thesis) + 3 body paragraphs (productivity, cost savings, talent pool) + conclusion`,
        note: 'Builds the full structure from a topic, not a continuation of existing text.',
      },
      {
        title: 'Draft an opinion piece outline with content',
        code: `Input: topic: "should cities ban cars downtown", stance: against\nOutput: intro + 3 body paragraphs (small business access, disability access, delivery logistics) + conclusion`,
        note: 'Each body paragraph develops one distinct supporting point rather than repeating the same idea.',
      },
    ],
  },

  'image-alt-text-generator': {
    description: `A screen reader doesn't see an image, it reads whatever text sits in the alt attribute out loud, which means a blank alt tag or a lazy "image1" leaves a visually impaired visitor with literally nothing where a sighted visitor sees a photo, a chart, or a product shot. Search engines have the same blind spot in a different sense: they can't interpret pixels either, so alt text is effectively the only description they have of what an image actually shows. This tool generates alt text that describes what's actually in an image rather than a generic filler phrase; upload a photo and get back a description specific enough that someone who can't see the image still understands what it depicts. Useful for making a product catalog accessible, adding real alt text to a blog's images before publishing, or fixing a site audit that flagged missing or unhelpful alt attributes.`,
    examples: [
      {
        title: 'Generate alt text for a product photo',
        code: `Input: red-sneaker.jpg\nOutput: alt="Red and white running sneaker with mesh upper, side view on a white background"`,
        note: 'Describes the specific product details a sighted shopper would notice at a glance.',
      },
      {
        title: 'Fix a site audit flagging missing alt text',
        code: `Input: hero-banner.jpg (currently alt="")\nOutput: alt="Team of five people collaborating around a laptop in a bright office"`,
        note: 'Replaces an empty or generic alt attribute with a description that conveys the actual image content.',
      },
    ],
  },

  'mkv-to-mov': {
    description: `Double-click an MKV file on a Mac and often nothing happens at all, no default app claims it, because Apple's ecosystem was never built around a format it never had much reason to support. This tool converts an MKV file into MOV so it behaves like any other video on a Mac: opens in QuickTime, imports into Final Cut Pro, plays without hunting down a third-party player first. One wrinkle worth knowing before converting: MKV often carries subtitles as a separate soft track that a viewer toggles on or off, and that toggle option doesn't always survive the move to MOV cleanly, so a subtitle track might need to be burned directly into the video or handled as its own file afterward. Useful for pulling a downloaded or ripped MKV file into an Apple-based editing workflow, or just making a video actually double-click-openable on a Mac.`,
    examples: [
      {
        title: 'Make a downloaded MKV file playable on a Mac',
        code: `Input: downloaded-film.mkv\nOutput: downloaded-film.mov (opens directly in QuickTime)`,
        note: 'Skips needing a third-party player just to open a file with no default Mac app.',
      },
      {
        title: 'Handle subtitles when converting for Final Cut Pro',
        code: `Input: series-episode.mkv (soft subtitle track)\nOutput: series-episode.mov (subtitles burned in) or series-episode.srt (kept separate)`,
        note: "Soft subtitle toggling doesn't always survive the move to MOV, so it needs burning in or exporting separately.",
      },
    ],
  },

  'json-escape-unescape': {
    description: `Putting a JSON string inside another string, a JSON literal in someone else's document, a payload embedded in a shell command, a blob stored as a single value in a config file, means every quote and backslash inside that JSON needs escaping so the outer context doesn't misread it as the end of the string. This tool handles that specific character-level escaping: turn raw JSON into an escaped version safe to drop inside another string, or reverse it, unescaping a string back into readable JSON when it arrives in escaped form and needs to actually be read or edited. It's a different job than formatting or validating structure; the content stays the same JSON, just represented as characters instead of a live object. Useful for debugging a webhook payload that arrives double-encoded, or preparing a value to embed safely inside a shell script or another document.`,
    examples: [
      {
        title: 'Escape JSON for embedding inside another JSON string',
        code: `Input: {"name": "O'Brien"}\nOutput: "{\\"name\\": \\"O'Brien\\"}"`,
        note: 'Escapes the inner quotes so the outer JSON document still parses correctly.',
      },
      {
        title: 'Unescape a double-encoded webhook payload',
        code: `Input: "{\\"event\\":\\"created\\",\\"id\\":42}"\nOutput: {"event":"created","id":42}`,
        note: 'Turns an escaped string back into readable JSON you can actually inspect or edit.',
      },
    ],
  },

  'all-in-one-unit-converter': {
    description: `A single practical task, scaling a recipe, planning a road trip, working through a home improvement project, often needs more than one kind of unit conversion in the same sitting: a recipe's ounces into grams, then a room's dimensions from feet into meters, then an oven's Fahrenheit setting into Celsius, each normally living in its own separate converter tool. This one keeps length, weight, temperature, speed, and volume together in a single interface, so switching between unit types doesn't mean opening a different tool for every conversion. Pick the category, enter a value, and get the converted result without losing track of where you were in a bigger task. Useful for following a recipe from a metric cookbook that also lists oven temperature in Celsius, converting a room's measurements for a flooring project, or just avoiding five browser tabs open for five separate converters.`,
    examples: [
      {
        title: "Convert a metric recipe's oven temperature and weight",
        code: `Input: 180°C, 250g flour\nOutput: 356°F, 8.82 oz`,
        note: 'Handles temperature and weight in the same session without switching tools.',
      },
      {
        title: 'Convert a room measurement for a flooring project',
        code: `Input: 12 ft x 10 ft\nOutput: 3.66 m x 3.05 m`,
        note: 'Switches unit categories without losing track of a larger multi-step project.',
      },
    ],
  },

  'heic-to-avif': {
    description: `PNG and JPG solve the compatibility problem, they open everywhere, but neither is the smallest option available anymore for a site that only needs to support current browsers. AVIF compresses noticeably smaller than either while holding up better at low file sizes, which is the reason a lot of modern sites have quietly switched their images over to it. This tool converts an iPhone's HEIC photos directly into AVIF, skipping the intermediate step of converting to PNG or JPG first and losing some of that efficiency along the way. It's the right choice specifically when maximum size savings matters more than supporting an older browser or an app that's never heard of AVIF: a photo gallery on a fast, modern site, a background image where every extra kilobyte affects load time, rather than a file headed for a print shop or an older piece of software.`,
    examples: [
      {
        title: 'Shrink a photo gallery for a modern website',
        code: `Input: gallery-photo.heic (2.4 MB)\nOutput: gallery-photo.avif (310 KB)`,
        note: 'AVIF compresses noticeably smaller than PNG or JPG at a comparable visual quality.',
      },
      {
        title: 'Optimize a background image for page speed',
        code: `Input: hero-bg.heic\nOutput: hero-bg.avif`,
        note: 'Best suited to a site that only needs to support current, modern browsers.',
      },
    ],
  },

  'svg-optimizer': {
    description: `An SVG exported straight out of Illustrator or Figma usually carries a lot more than the actual shape data needed to render it: editor metadata nobody reads, redundant grouping left over from the design file's layer structure, path coordinates specified to far more decimal places than a screen could ever display a visible difference for. None of that affects how the image looks, all of it adds to the file size. This tool strips that overhead out: removes unused metadata, simplifies path data down to a sensible precision, and minifies the remaining markup, without changing a single visible pixel of the result. Useful for shrinking an icon set before it ships to production, cleaning up a logo file exported from a design tool before embedding it inline in HTML, or finding out why a "simple" icon was somehow forty kilobytes.`,
    examples: [
      {
        title: 'Shrink an icon exported from Figma',
        code: `Input: icon.svg (18 KB, includes editor metadata)\nOutput: icon.svg (2 KB, metadata stripped, path data simplified)`,
        note: 'Removes design-tool overhead without changing how the icon renders.',
      },
      {
        title: 'Clean a logo before embedding it inline in HTML',
        code: `Input: logo.svg (redundant groups, 6 decimal places on path data)\nOutput: logo.svg (groups flattened, path data rounded to 2 decimals)`,
        note: 'Trims precision a screen could never actually show a visible difference for.',
      },
    ],
  },

  'base-number-converter': {
    description: `Binary, decimal, and hex get most of the attention, but octal and base-32 both still show up in specific, easy-to-forget places: Unix file permissions are written in octal, chmod 755 means something very different from the decimal number 755, and base-32 turns up in two-factor authentication secret keys and in ID formats designed to avoid visually confusing characters like 0 and O. This tool converts a number between all five systems, binary, octal, decimal, hexadecimal, and base-32, at once, so a permission value, an authentication secret, or a plain number all translate correctly regardless of which base it started in. Useful for decoding what a chmod octal value actually grants, converting a base-32 TOTP secret into a more familiar system to double-check it, or settling what an unfamiliar number actually represents across every base at once.`,
    examples: [
      {
        title: 'Decode a chmod permission value',
        code: `Input: 755 (octal)\nOutput: 111101101 (binary) | 493 (decimal) | 1ED (hex)`,
        note: 'Confirms what a Unix permission value actually grants across owner, group, and others.',
      },
      {
        title: 'Check a base-32 TOTP secret',
        code: `Input: JBSWY3DPEHPK3PXP (base-32)\nOutput: decimal and hex equivalents for verification`,
        note: 'Base-32 is the standard encoding for two-factor authentication secret keys.',
      },
    ],
  },

  'html-to-markdown': {
    description: `Stripping HTML down to plain text throws away real information, a link becomes indistinguishable from any other text, a code block loses its monospaced formatting entirely, a heading looks identical to a regular paragraph. This tool converts HTML to Markdown instead, which keeps that structure intact but represents it using Markdown's own lighter syntax: a link becomes bracketed text followed by a parenthetical URL, a heading becomes a line prefixed with a hash mark, a code block gets wrapped in triple backticks. That distinction matters when the destination is a Markdown-based wiki, a README file, or a notes app that renders Markdown, since pasting converted Markdown preserves formatting that plain text would have thrown away entirely. Paste in a page's HTML source and choose whether to keep links, images, and code blocks in the conversion, or drop any of them if the destination doesn't need that particular piece of structure.`,
    examples: [
      {
        title: 'Convert a blog post while keeping links and code blocks',
        code: `Input: <p>See the <a href="/docs">docs</a> and run <code>npm install</code></p>\nOutput: "See the [docs](/docs) and run \`npm install\`"`,
        note: 'Preserves the link and inline code formatting instead of flattening them to plain text.',
      },
      {
        title: 'Convert a page for a Markdown-based wiki',
        code: `Input: <h2>Setup</h2><pre><code>git clone repo</code></pre>\nOutput: "## Setup\\n\\n\`\`\`\\ngit clone repo\\n\`\`\`"`,
        note: 'Keeps the heading level and code block formatting intact for a wiki that renders Markdown.',
      },
    ],
  },

  'rgba-to-hex': {
    description: `An rgba() value copied straight out of a browser's inspector or pulled from an old stylesheet doesn't always work where it's headed next, plenty of design tools, brand style guides, and older CSS setups expect a hex code and don't parse an rgba() string directly. This tool takes an existing rgba() value and converts it into the equivalent hex, including the alpha channel as an 8-digit hex code when the original had any transparency, rather than building a new color from a slider. Paste in rgba(37, 99, 235, 0.6) copied from a computed style panel, and get back the matching 8-digit hex plus a live preview to confirm it looks the same as the original. Useful for documenting a color found in an existing site's CSS inside a brand style guide, or converting a semi-transparent color into a format an older design tool will actually accept.`,
    examples: [
      {
        title: "Convert a color copied from a browser's inspector",
        code: `Input: rgba(37, 99, 235, 0.6)\nOutput: #2563EB99`,
        note: 'Includes the alpha channel as the last two hex digits.',
      },
      {
        title: 'Convert an opaque rgba value for a brand style guide',
        code: `Input: rgba(220, 38, 38, 1)\nOutput: #DC2626`,
        note: 'Drops the alpha portion entirely when the original color has no transparency.',
      },
    ],
  },
};

export default FIX_BATCH_9;
