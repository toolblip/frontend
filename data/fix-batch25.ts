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

const FIX_BATCH_25: Record<string, FixBatchEntry> = {
  'lorem-ipsum-detector': {
    description: `Lorem ipsum text that made it into a development build sometimes survives all the way to production for a different reason than a forgotten paragraph on a page, it's a hardcoded placeholder string sitting inside a component that shipped before real content was wired up, and it can hide in a corner of an app, an empty state message, a tooltip, a rarely-visited settings page, for a long time before anyone notices. This tool scans text, a file, or a set of pages for lorem ipsum and flags every instance it finds, rather than relying on someone happening to click into the exact screen where it's still sitting. Useful for a pre-launch sweep across a site's pages or a codebase's string files, catching a placeholder hardcoded into a component during development, or auditing a CMS's content across many pages at once rather than checking one document at a time.`,
    examples: [
      {
        title: 'Scan a codebase for a hardcoded placeholder',
        code: `Input: EmptyState.tsx\nFlagged: <p>Lorem ipsum dolor sit amet</p> still present in the component`,
        note: 'Catches placeholder text left in a component that shipped before real copy was wired up.',
      },
      {
        title: 'Sweep multiple CMS pages at once',
        code: `Input: 40 published pages\nFlagged: 2 pages still contain lorem ipsum in a sidebar block`,
        note: 'Audits an entire site at once rather than checking one page at a time.',
      },
    ],
  },

  'color-blindness-simulator': {
    description: `Red-green color blindness affects roughly one in twelve men, which means a status indicator relying purely on a green checkmark versus a red X isn't actually conveying anything to a meaningful slice of any audience, a genuinely different accessibility problem than low contrast, since the colors could have identical lightness and still be indistinguishable to someone with that specific type of color vision deficiency. This tool simulates how a design or image actually looks under the most common types, red-green deficiencies like protanopia and deuteranopia, and the rarer blue-yellow tritanopia, showing exactly what gets lost or blends together for each. Useful for checking whether a chart's color-coded legend still reads correctly when hue is the only thing separating two categories, or confirming a status system doesn't rely on color alone to signal success versus failure.`,
    examples: [
      {
        title: 'Check a status indicator relying only on color',
        code: `Input: green checkmark vs red X icon\nDeuteranopia simulation: both icons appear a similar muted yellow-brown`,
        note: 'Shows the two states become hard to tell apart for the most common form of color blindness.',
      },
      {
        title: "Test a chart's color-coded legend",
        code: `Input: 4-category bar chart, colors: red, green, blue, orange\nProtanopia simulation: red and green categories become difficult to distinguish`,
        note: 'Reveals when a legend depends on a color pair that a color-blind viewer cannot reliably tell apart.',
      },
    ],
  },

  'crop-circle': {
    description: `Cropping to a circle isn't the same operation as cropping to a square and then rounding the corners visually, it means clipping the image itself into a genuine circular or oval shape with a transparent background outside that boundary, which is what a profile picture slot or an avatar frame actually expects rather than a square photo with rounded edges pretending to be round. This tool crops an image directly into a circle or an oval, exporting with a transparent background so it drops cleanly into whatever round frame it's headed for without a visible square edge showing through the corners. Useful for preparing a profile picture that needs to be genuinely circular rather than square with rounded corners, creating an avatar for a platform with a round frame, or cropping a logo into an oval badge shape.`,
    examples: [
      {
        title: 'Create a circular profile picture',
        code: `Input: headshot.jpg (square)\nOutput: headshot-circle.png (circular crop, transparent outside the circle)`,
        note: 'Clips the image into a true circle rather than a square with rounded corners.',
      },
      {
        title: 'Crop a logo into an oval badge',
        code: `Input: logo.png, shape: oval\nOutput: logo-oval.png (transparent background outside the oval)`,
        note: 'Fits a frame that expects a genuinely oval shape, not a rectangle with curved edges.',
      },
    ],
  },

  'mov-to-wav': {
    description: `MP3 is fine for listening back to an extracted audio track, but the moment that audio needs further editing, cleaning up background noise, adjusting levels, layering it with other tracks, MP3's lossy compression becomes a real problem, since every edit and re-export recompresses an already-compressed file and compounds the quality loss. This tool converts a MOV file's audio into WAV instead, an uncompressed, lossless format that holds up through multiple rounds of editing without degrading further. Useful for pulling a clean audio track out of a video file before doing real editing work on it in an audio program, extracting dialogue from a video interview for a podcast that needs actual mixing, or getting a lossless source track before any serious post-processing rather than a compressed file that would degrade further with each pass.`,
    examples: [
      {
        title: 'Extract audio for professional editing',
        code: `Input: interview.mov\nOutput: interview.wav (uncompressed, lossless)`,
        note: "Won't degrade further through multiple rounds of editing the way MP3 would.",
      },
      {
        title: 'Pull clean dialogue for a podcast mix',
        code: `Input: video-interview.mov\nOutput: video-interview.wav`,
        note: 'Provides a lossless source track suited to real mixing and noise cleanup work.',
      },
    ],
  },

  translate: {
    description: `A phrase like "it's raining cats and dogs" translated word for word into another language produces nonsense, since the actual meaning lives in the idiom as a whole rather than in each individual word, which is exactly the gap between a translation that's technically accurate and one that actually reads naturally to a native speaker of the target language. This tool translates text between over a hundred languages aiming for that second kind of result, rendering the intended meaning and natural phrasing rather than a mechanical word-for-word substitution that happens to be grammatically valid but sounds foreign. Useful for translating a message meant for a native audience where natural phrasing actually matters, checking how an idiom or expression would actually be understood in another language, or getting a readable translation of a document rather than one that technically parses but reads awkwardly.`,
    examples: [
      {
        title: 'Translate an idiom by meaning, not word for word',
        code: `Input: "It's raining cats and dogs." (English)\nOutput: "Il pleut des cordes." (French, meaning "it's raining ropes," the natural French equivalent)`,
        note: 'A literal word-for-word translation would produce nonsense in the target language.',
      },
      {
        title: 'Translate a message for a native audience',
        code: `Input: "We're thrilled to have you on board!" (English)\nOutput: natural, idiomatic equivalent in the target language rather than a stiff literal rendering`,
        note: 'Prioritizes how the message actually reads to a native speaker over literal word matching.',
      },
    ],
  },

  'tsv-to-csv': {
    description: `Plenty of tools that accept a data import assume comma-separated values by default and either fail outright or misread every column when handed tab-separated data instead, which becomes a real problem the moment a TSV export needs to go somewhere that only offers a "CSV" import option with no mention of tabs at all. This tool converts TSV into CSV properly, which means more than just swapping the delimiter character: any value that itself contains a comma, harmless in a tab-delimited file, needs to actually be quoted once commas become the column separator, or the column structure breaks silently. Useful for converting a TSV export into the format a spreadsheet tool or import wizard specifically expects, or fixing a data file that only works with software expecting commas rather than tabs.`,
    examples: [
      {
        title: 'Convert a TSV export for a CSV-only import tool',
        code: `Input TSV: name\\tcity\\nAlice\\tBoston\nOutput CSV: name,city\\nAlice,Boston`,
        note: 'Produces the delimiter format the destination tool actually expects.',
      },
      {
        title: 'Properly escape a value containing a comma',
        code: `Input TSV: company\\tlocation\\nAcme\\tSpringfield, IL\nOutput CSV: company,location\\nAcme,"Springfield, IL"`,
        note: 'Quotes the field so the embedded comma is not misread as a column separator.',
      },
    ],
  },

  'rgba-color-picker': {
    description: `Starting from an existing hex value is one way to work with color, but sometimes there's no starting value at all, just a general sense of the color needed, which calls for actually picking one visually rather than typing in a code that has to be guessed first. This tool provides a visual color picker with an alpha channel built in, drag to a point on the color field, adjust transparency with a separate slider, and get back the result instantly as hex, RGB, RGBA, and HSL all at once, ready to copy in whichever format the destination needs. Useful for visually exploring a color and its transparency together rather than typing in a value, picking a semi-transparent overlay color by eye, or grabbing a color in multiple formats without a separate conversion step afterward.`,
    examples: [
      {
        title: 'Pick a color visually and get every format at once',
        code: `Picked: a mid-blue on the color field\nOutput: #2563EB | rgb(37, 99, 235) | hsl(217, 83%, 53%)`,
        note: 'Starts from a visual pick rather than a hex value that has to be known in advance.',
      },
      {
        title: 'Pick a semi-transparent overlay color',
        code: `Picked: dark gray, alpha: 60%\nOutput: rgba(31, 41, 55, 0.6)`,
        note: 'Adjusts opacity with a slider alongside the visual color pick.',
      },
    ],
  },

  'gif-to-jpg': {
    description: `An animated GIF doesn't play in every context that shows images, a print layout, a static thumbnail feed, an email client that strips animation, and what's actually needed there is just one representative still frame rather than the whole animated sequence. This tool extracts a static image from a GIF, either the first frame or a generated thumbnail representing the animation, and saves it as a JPG rather than requiring the destination to somehow handle an animated file it was never built to display. Useful for getting a preview thumbnail out of an animated GIF for a context that can only show static images, pulling a single representative frame for a print layout, or converting a GIF into a normal photo format for a destination that doesn't support animation at all.`,
    examples: [
      {
        title: 'Get a thumbnail from an animated GIF',
        code: `Input: celebration.gif (24 frames)\nOutput: celebration-thumbnail.jpg (first frame)`,
        note: 'Produces a single static preview image for a context that cannot show animation.',
      },
      {
        title: 'Convert a GIF for a print layout',
        code: `Input: product-demo.gif\nOutput: product-demo.jpg`,
        note: 'Print has no way to render animation, so a static frame is the usable format.',
      },
    ],
  },

  'ulid-generator': {
    description: `A UUID is completely random, which means two generated one after another sort in essentially arbitrary order relative to each other, no matter how close together in time they were created, and that randomness is also exactly why a random UUID used as a database primary key tends to fragment an index over time as new rows scatter across the table instead of appending neatly. A ULID solves both problems at once: it encodes a timestamp in its first part, so ULIDs generated later always sort after ones generated earlier when compared as plain strings, while still carrying enough randomness afterward to stay globally unique like a UUID. This tool generates ULIDs directly. Useful for a distributed system's primary keys where chronological sort order matters as much as uniqueness, or replacing a UUID primary key that's been causing index fragmentation with something that sorts naturally by creation time instead.`,
    examples: [
      {
        title: 'Generate a ULID that sorts by creation time',
        code: `Generated at 10:00:00: 01ARZ3NDEKTSV4RRFFQ69G5FAV\nGenerated at 10:00:01: 01ARZ3NDEMTSV4RRFFQ69G5FAW`,
        note: 'The second ULID sorts after the first as plain strings, unlike two random UUIDs.',
      },
      {
        title: 'Replace a UUID primary key causing index fragmentation',
        code: `Old: UUID v4 primary keys, scattered insert order\nNew: ULID primary keys, insert order matches creation order`,
        note: 'Chronological sort order reduces the index fragmentation random UUID keys tend to cause.',
      },
    ],
  },

  'color-shade-gen': {
    description: `A shade that's mathematically darker isn't automatically a shade that still works as a background with legible text on top of it, which is the gap between a shade generator that just applies a formula and one that actually checks the result stays usable. This tool generates lighter, darker, and tinted variations of a base color for a design system while checking each one against basic contrast requirements for white and black text, rather than producing a scale that looks right in isolation but turns out unusable the moment real text gets placed on it. Useful for building a design system's color scale where every generated shade needs to actually support readable text, not just look correct as an isolated swatch, or catching a shade in the middle of a scale that turns out too close in lightness to the text color meant to sit on top of it.`,
    examples: [
      {
        title: 'Generate a scale with contrast pre-checked',
        code: `Input: #2563EB\nOutput: 5 shades, each flagged for whether white or black text passes AA contrast on it`,
        note: 'Confirms usability with text before a shade goes into the design system.',
      },
      {
        title: 'Catch a shade too close to the text color',
        code: `Input: #2563EB, shade: 40% lighter\nResult: flagged, fails AA contrast with white text`,
        note: 'Surfaces a shade that looks fine as a swatch but would make white text hard to read.',
      },
    ],
  },
};

export default FIX_BATCH_25;
