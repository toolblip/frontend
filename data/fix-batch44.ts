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

const FIX_BATCH_44: Record<string, FixBatchEntry> = {
  'excel-to-pdf': {
    description: `A spreadsheet with more columns than fit comfortably on one printed page tends to get chopped awkwardly across two PDF pages when exported naively, splitting a wide table right through the middle of a column rather than keeping it intact, which is exactly the kind of formatting problem that shows up only after the file's already been shared. This tool converts an Excel spreadsheet into PDF while actually preserving the original layout, column widths, page breaks, and formatting handled the way the source spreadsheet intended rather than an automatic export that splits a wide table wherever the page happens to end. Useful for sharing a spreadsheet as a PDF that reads correctly without a table getting awkwardly split across pages, preserving the exact formatting of a report built carefully in Excel, or converting a wide dataset into a PDF that handles page breaks sensibly instead of cutting columns in half.`,
    examples: [
      {
        title: 'Preserve a wide table across pages correctly',
        code: `Input: budget.xlsx (18 columns)\nOutput: budget.pdf (columns kept intact, sensible page breaks)`,
        note: 'Avoids splitting a column awkwardly across two pages the way a naive export would.',
      },
      {
        title: "Keep a report's original formatting",
        code: `Input: quarterly-report.xlsx (custom fonts, merged cells, colored headers)\nOutput: quarterly-report.pdf (formatting preserved)`,
        note: 'Matches the layout the spreadsheet was actually designed with.',
      },
    ],
  },

  'gif-to-png': {
    description: `Extracting a single frame from an animated GIF into a static image usually needs to preserve whatever transparency the original GIF actually had, a sticker or an icon-style animation with a see-through background, since converting to a format with no transparency support at all would force that background into a solid color the original animation never had. This tool converts a GIF into PNG specifically, keeping the transparent regions intact in the static output rather than flattening them into an opaque fill. Useful for extracting a transparent-background GIF's frame as a usable static PNG asset, pulling a still image out of an animated sticker without losing its see-through background, or converting a GIF into a format that actually supports the transparency the animation depended on.`,
    examples: [
      {
        title: 'Extract a transparent sticker frame',
        code: `Input: sticker-animation.gif (transparent background)\nOutput: sticker-frame.png (transparency preserved)`,
        note: 'Keeps the see-through background instead of filling it with a solid color.',
      },
      {
        title: 'Get a static icon from an animated GIF',
        code: `Input: loading-icon.gif\nOutput: loading-icon-still.png`,
        note: 'Produces a usable static asset without losing the transparency the animation had.',
      },
    ],
  },

  'octal-to-decimal': {
    description: `Octal shows up in a few specific corners most people don't encounter often enough to have the conversion memorized, an old-style Unix permission notation, an escape sequence in a language like C or Python where a backslash followed by digits represents a character by its octal code, both cases where getting the actual decimal or character value means converting octal correctly rather than guessing. This tool converts octal numbers into decimal, binary, and hexadecimal all at once, covering the specific, less common base that shows up in those particular corners of programming and systems work. Useful for decoding an octal escape sequence found in a string literal back into the actual character it represents, converting an octal value from older documentation into a more familiar decimal number, or checking an octal number's binary and hexadecimal equivalents in one pass.`,
    examples: [
      {
        title: 'Decode an octal escape sequence',
        code: `Input: \\141 (octal escape in a string literal)\nOutput: decimal: 97 | character: "a"`,
        note: 'Recovers the actual character an octal escape sequence represents.',
      },
      {
        title: 'Convert an octal value from old documentation',
        code: `Input: 17 (octal)\nOutput: decimal: 15 | binary: 1111 | hex: F`,
        note: 'Converts a less commonly used base into more familiar number systems at once.',
      },
    ],
  },

  'duplicate-url-detector': {
    description: `The same page reachable at four different-looking URLs, with and without www, with and without a trailing slash, over http instead of https, reads as four separate pages to a search engine unless something explicitly tells it otherwise, which is exactly the kind of duplicate content problem that quietly splits ranking signal across variants that were never meant to compete with each other. This tool scans a list of URLs for exactly that pattern, duplicate or near-duplicate variants of what's really the same page, and suggests which version should actually serve as the canonical one. Useful for catching duplicate URL variants before they split SEO value across pages that should be treated as one, cleaning up a sitemap or a URL list that's accumulated both http and https versions of the same pages, or confirming a canonical URL structure is actually being followed consistently across a site.`,
    examples: [
      {
        title: 'Catch www and non-www duplicates',
        code: `Input: https://example.com/page, https://www.example.com/page\nResult: flagged as duplicate, suggested canonical: https://example.com/page`,
        note: 'Recognizes these as the same page despite looking like different URLs.',
      },
      {
        title: 'Find trailing-slash duplicates',
        code: `Input: /products, /products/\nResult: flagged as duplicate variants of the same page`,
        note: 'Catches a subtle duplicate that splits ranking signal between two URLs for one page.',
      },
    ],
  },

  'extract-img': {
    description: `A PDF report with embedded photos or charts holds each image as a separate object inside the file's structure, and getting one of those images back out usually means an awkward screenshot-and-crop rather than actually recovering the original embedded file at its full quality. This tool pulls every image embedded in a PDF out directly, downloadable individually or bundled together as a ZIP, rather than requiring a screenshot workaround that loses quality and adds unnecessary cropping. Useful for recovering a photo or chart embedded in a PDF report without the quality loss a screenshot would introduce, pulling every image out of a PDF at once instead of extracting each one individually, or getting a specific graphic back out of a document where the original image file is otherwise nowhere to be found.`,
    examples: [
      {
        title: 'Pull every image out of a PDF report',
        code: `Input: annual-report.pdf (8 embedded photos and charts)\nOutput: 8 image files, bundled as report-images.zip`,
        note: 'Recovers the original embedded files at full quality instead of a cropped screenshot.',
      },
      {
        title: 'Extract one specific graphic',
        code: `Input: presentation.pdf, page 4\nOutput: chart-page4.png`,
        note: 'Gets the original image file back rather than a screenshot workaround.',
      },
    ],
  },

  'color-saturation-adjuster': {
    description: `Saturation and vibrance sound like the same knob but behave differently: saturation raises every color in an image by the same amount regardless of how saturated it already is, while vibrance raises the more muted colors more and leaves already-vivid ones, and especially skin tones, comparatively untouched, which is exactly why a vibrance adjustment tends to look natural where a straight saturation increase can push a photo into an oversaturated, artificial-looking result. This tool adjusts saturation, vibrance, and lightness together with a live preview and ready CSS output, rather than a single generic saturation slider that treats every color the same way. Useful for raising a photo's muted colors without oversaturating skin tones the way a blunt saturation increase would, fine-tuning a brand color's vibrance and lightness together while watching the result update live, or getting the exact CSS value needed after an adjustment instead of eyeballing it separately.`,
    examples: [
      {
        title: 'Boost muted colors without oversaturating skin tones',
        code: `Input: photo, vibrance: +30\nOutput: muted background colors boosted, skin tones comparatively unchanged`,
        note: 'Vibrance targets less-saturated colors specifically, unlike a flat saturation increase.',
      },
      {
        title: 'Adjust a brand color live',
        code: `Input: #2563EB, saturation: -15%, lightness: +10%\nOutput: #4A78D9, CSS: hsl(217, 68%, 63%)`,
        note: 'Updates the preview and CSS output together as each value changes.',
      },
    ],
  },

  'json-schema-viewer': {
    description: `A JSON Schema with several levels of nested properties, references to other definitions through $ref, and conditional rules layered in with allOf or oneOf reads as a dense wall of syntax on the page, genuinely hard to mentally map into an actual tree of what data it's describing just by reading the raw text top to bottom. This tool visualizes a JSON Schema as an actual tree diagram, letting definitions, properties, and constraints be explored by expanding and collapsing branches rather than parsing nested schema syntax by eye. Useful for understanding an unfamiliar, deeply nested schema someone else wrote before working with it, navigating a schema's structure visually instead of scrolling through raw JSON Schema syntax, or explaining what a specific schema actually validates to someone who doesn't read raw schema definitions comfortably.`,
    examples: [
      {
        title: 'Explore a nested schema visually',
        code: `Input: [schema with 4 levels of nested properties]\nOutput: expandable tree diagram, one branch per nested property`,
        note: 'Navigates the structure by expanding branches instead of reading raw nested syntax.',
      },
      {
        title: 'Trace a $ref reference',
        code: `Input: schema referencing "#/definitions/Address"\nOutput: tree shows the Address definition expanded inline where it's referenced`,
        note: 'Resolves a reference visually instead of manually jumping to the referenced definition.',
      },
    ],
  },

  'youtube-transcript': {
    description: `Finding which video, out of an entire channel's back catalog, actually covers a specific topic is a different search problem than getting one video's exact wording, since the goal isn't quoting a line precisely, it's figuring out which of many videos is worth watching at all based on what was actually said inside each one. This tool generates a searchable transcript from a YouTube video's spoken content, text that can be searched the same way any other text can, rather than content locked inside audio that only reveals itself by watching. Useful for searching across transcripts from several videos to find which one actually mentions a specific topic, locating a moment in a long video by searching for a phrase instead of scrubbing through the timeline, or making a channel's video content discoverable by search the way a blog's written posts already are.`,
    examples: [
      {
        title: 'Search across multiple videos for a topic',
        code: `Input: 20 channel videos, search: "database indexing"\nOutput: 3 videos found mentioning the topic, with approximate timestamps`,
        note: 'Finds which videos are relevant without watching each one first.',
      },
      {
        title: 'Locate a moment in a long video by phrase',
        code: `Input: [90-minute conference talk], search: "error handling"\nOutput: mentioned at approximately 42:15`,
        note: 'Finds a moment by searching text instead of scrubbing through the timeline.',
      },
    ],
  },

  'time-duration-calculator': {
    description: `Figuring out what time a flight lands when it departs at 11:45 PM and takes fourteen hours and thirty minutes means adding a duration to a start time and correctly handling the fact that the result crosses midnight and lands on a different day entirely, arithmetic that's easy to get wrong doing it in your head past the first hour or two. This tool adds or subtracts a time interval from a starting time, or calculates the gap between two given times, handling day boundaries and duration math directly rather than requiring manual carrying past midnight. Useful for calculating an arrival time from a departure time and a flight duration, figuring out what time a task will finish if it starts now and takes a known number of hours, or finding the exact gap between two clock times without doing the subtraction by hand.`,
    examples: [
      {
        title: "Calculate a flight's arrival time",
        code: `Input: departs 11:45 PM, duration: 14h 30m\nOutput: arrives 2:15 PM the next day`,
        note: 'Correctly handles crossing midnight into the following day.',
      },
      {
        title: 'Find the gap between two times',
        code: `Input: 9:15 AM to 5:45 PM\nOutput: 8 hours 30 minutes`,
        note: 'Calculates the exact duration between two clock times directly.',
      },
    ],
  },

  'color-picker-v2': {
    description: `A design tool's own color picker dialog often works in HSV rather than HSL, Photoshop's wheel included, and a print spec sheet needs CMYK entirely, which means a color chosen visually sometimes needs translating into a format neither a basic hex-RGB-HSL picker nor a plain conversion tool actually covers together. This tool picks a color visually and returns it in hex, RGB, HSL, HSV, and CMYK all at once, bridging the specific formats a design application's own picker and a print specification both actually need. Useful for matching a color visually picked here to the same value inside a design tool's HSV-based picker, getting a CMYK equivalent alongside the usual screen-based formats without a separate conversion step, or picking one color and having every format a project might actually need available immediately.`,
    examples: [
      {
        title: 'Pick a color and get every format including CMYK',
        code: `Picked: a mid-blue\nOutput: #2563EB | rgb(37, 99, 235) | hsl(217, 83%, 53%) | hsv(217, 84%, 92%) | cmyk(84%, 58%, 0%, 8%)`,
        note: 'Covers formats a screen-only picker typically leaves out.',
      },
      {
        title: "Match a color to a design tool's HSV picker",
        code: `Picked: #DC2626\nOutput: hsv(0, 84%, 86%)`,
        note: "Gives the HSV values many design applications use in their own color picker dialogs.",
      },
    ],
  },
};

export default FIX_BATCH_44;
