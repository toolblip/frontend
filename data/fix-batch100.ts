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

const FIX_BATCH_100: Record<string, FixBatchEntry> = {
  'hex-to-hsv': {
    description: `A hex code copied from a browser's inspector or a CSS file doesn't help much once the destination is a photo editor or a video color-grading panel, since those tools generally expose hue, saturation, and value as separate sliders rather than a six-digit code, which means a value picked on the web needs translating into the three numbers those programs actually expect typed in. This tool converts HEX color codes into HSV and HSB values with a live preview, built around feeding a web-sourced color into software that thinks in sliders rather than hex strings. Useful for translating a brand's hex color into the H/S/V numbers a photo or video editing tool actually wants entered, matching a website's exact color inside grading software that has no hex input field, or checking how a hex value breaks down into hue, saturation, and brightness components.`,
    examples: [
      {
        title: 'Translate a brand hex color for photo editing software',
        code: `Input: #2563EB\nOutput: H: 220°, S: 77%, V: 92%`,
        note: 'Produces the slider values a photo editor actually expects.',
      },
      {
        title: 'Match a website color inside grading software',
        code: `Input: #E8734A\nOutput: H: 15°, S: 68%, V: 91%`,
        note: 'Converts a hex string into values usable where there is no hex field.',
      },
    ],
  },

  'hex-to-rgb-express': {
    description: `Not every color conversion happens as part of picking a color visually or building a full palette, sometimes there's already an exact hex value in hand, copied from a design file or a style guide, and the only actual need is the matching RGB and RGBA numbers to paste into a canvas drawing call or an inline style, quickly, without opening a broader color tool built around exploration. This tool converts HEX color codes into RGB and RGBA formats with a live preview, built for a fast, single-value conversion rather than a color-picking or palette-building workflow. Useful for converting an exact hex value from a style guide into RGB for a canvas API call, getting RGBA with a specific alpha channel for a semi-transparent overlay, or checking a hex code's RGB equivalent quickly without a full color-picking interface.`,
    examples: [
      {
        title: 'Convert a style guide hex value for a canvas call',
        code: `Input: #2563EB\nOutput: rgb(37, 99, 235)`,
        note: 'A fast single-value conversion, not a color-picking workflow.',
      },
      {
        title: 'Get RGBA for a semi-transparent overlay',
        code: `Input: #000000, alpha: 0.6\nOutput: rgba(0, 0, 0, 0.6)`,
        note: 'Adds a specific alpha channel to an exact hex value already in hand.',
      },
    ],
  },

  'hsl-to-rgb-new': {
    description: `Hue, saturation, and lightness map onto how a person actually thinks about adjusting a color, rotate the hue for a different shade, raise the saturation for more vividness, lower the lightness to darken it, an intuitive model most design tools expose through HSL sliders, but code still generally needs that same color as RGB or hex once it leaves the design tool and lands in a stylesheet. This tool converts HSL color values into RGB and HEX with a live preview, bridging a design tool's slider-based color model and the formats a codebase actually consumes. Useful for converting an HSL value read off a design tool's color picker into RGB or HEX for a stylesheet, checking what a specific hue-saturation-lightness combination looks like as a hex code, or translating a programmatically generated HSL color, from cycling a hue for a chart palette, into RGB for rendering.`,
    examples: [
      {
        title: "Convert a design tool's HSL slider value",
        code: `Input: hsl(217, 83%, 53%)\nOutput: rgb(37, 99, 235) / #2563EB`,
        note: "Bridges a design tool's slider model with a stylesheet's expected format.",
      },
      {
        title: 'Convert a programmatically cycled hue',
        code: `Input: hsl(120, 70%, 50%)\nOutput: rgb(38, 217, 38) / #26D926`,
        note: 'Translates a generated HSL value into RGB for rendering.',
      },
    ],
  },

  'hsv-to-hex': {
    description: `Cycling a hue value from zero to three hundred and sixty while holding saturation and value steady is a common way to generate a series of evenly spaced, consistent-looking colors programmatically, a chart's category palette, a set of avatar background colors, and each computed H/S/V triplet still needs converting into a hex code before it can actually be used in CSS or an SVG fill attribute. This tool converts HSV and HSB values into HEX format with a live preview, built around turning computed or slider-read HSV numbers into the hex strings web code actually consumes. Useful for converting a programmatically generated series of HSV colors into hex codes for a chart palette, translating a value read off a color-grading tool's H/S/V sliders into a hex code for a web mockup, or checking what a specific hue, saturation, and value combination looks like as a six-digit hex string.`,
    examples: [
      {
        title: 'Convert a generated HSV color series to hex',
        code: `Input: H: 0°, S: 65%, V: 85%\nOutput: #D94D4D`,
        note: 'Turns a computed HSV triplet into a hex code usable in CSS.',
      },
      {
        title: "Translate a grading tool's slider reading",
        code: `Input: H: 200°, S: 55%, V: 78%\nOutput: #599DC7`,
        note: 'Converts values read off H/S/V sliders into a web-ready hex string.',
      },
    ],
  },

  'html-table-generator': {
    description: `Getting a table's borders, striped rows, and highlighted cells looking right by hand-writing CSS means tweaking nth-child selectors and border properties through trial and error, adjusting one value, checking the render, adjusting again, a slower path than building the same table visually and getting the finished markup and styling together in one step. This tool creates styled HTML tables with configurable rows, columns, borders, and striped or highlighted rows, generating markup from scratch through visual controls rather than hand-written CSS selectors. Useful for building a data table with alternating row colors without hand-writing nth-child CSS rules, creating a table with a specific number of rows and columns visually before dropping the markup into a page, or generating a styled table with borders and highlighted cells configured through controls rather than trial-and-error CSS.`,
    examples: [
      {
        title: 'Build a striped table without hand-written CSS',
        code: `Selected: rows: 5, columns: 3, striped: true\nOutput: <table>...<tr class="striped">...</tr></table> with generated CSS`,
        note: 'Configures striping visually instead of writing nth-child rules by hand.',
      },
      {
        title: 'Generate a bordered table from scratch',
        code: `Selected: rows: 4, columns: 4, border: 1px solid #ddd\nOutput: complete <table> markup with border styling applied`,
        note: 'Produces markup and styling together from a blank starting point.',
      },
    ],
  },

  'html-table-to-json': {
    description: `An HTML table sitting on a page, scraped from a Wikipedia article or copied out of a report, is structured data trapped inside markup, and getting it into a form a script can actually loop over means parsing out the header row, matching each cell to its column, and assembling the result as an array of objects, tedious to do by hand for anything beyond a handful of rows. This tool converts HTML tables into JSON arrays with automatic header detection, extracting existing table markup into structured data rather than building a table from nothing. Useful for turning an HTML table copied from a webpage into JSON a script can actually iterate over, extracting structured data from a scraped table without manually mapping columns to keys, or converting a report's table markup into JSON for further processing somewhere else.`,
    examples: [
      {
        title: 'Convert a scraped table into JSON',
        code: `Input: <table><tr><th>Name</th><th>Price</th></tr><tr><td>Widget</td><td>9.99</td></tr></table>\nOutput: [{"Name":"Widget","Price":"9.99"}]`,
        note: 'Detects headers automatically and maps each cell to its column.',
      },
      {
        title: 'Extract a report table for further processing',
        code: `Input: [HTML table with 40 rows]\nOutput: JSON array of 40 objects, one per row`,
        note: 'Handles the tedious row-to-object mapping automatically.',
      },
    ],
  },

  'http-headers-inspector': {
    description: `A cache-control header or a set-cookie value can look present and correct at the final destination while actually having been added, stripped, or rewritten somewhere earlier along the way, a CDN, a load balancer, an intermediate redirect hop, and inspecting only the last response hides that entirely, making a header issue look like it started somewhere it didn't. This tool views and debugs HTTP request and response headers for any URL with a timing breakdown, built around surfacing exactly what changed and where rather than just what the final response contains. Useful for tracking down where a header got added, dropped, or rewritten between the original request and the final response, debugging a caching or cookie issue that only shows up after an intermediate hop, or reviewing a URL's full request and response headers together with the timing each stage actually took.`,
    examples: [
      {
        title: 'Track down where a header changed',
        code: `Input: https://example.com/old-path (redirects once)\nOutput: Set-Cookie present on hop 1, stripped by hop 2`,
        note: 'Surfaces a change an inspection of only the final response would hide.',
      },
      {
        title: 'Debug a caching issue with timing context',
        code: `Input: https://example.com/api/data\nOutput: Cache-Control: no-store | DNS: 12ms, TLS: 45ms, TTFB: 210ms`,
        note: 'Pairs header values with the timing breakdown for the same request.',
      },
    ],
  },

  'icon-favicon-creator': {
    description: `Typed initials and an uploaded logo file are two familiar favicon starting points, but sometimes neither actually fits, no logo exists yet and plain text feels too flat for a brand mark that's supposed to be more than typography, which is exactly the gap a simple vector shape fills, a circle, a polygon, a geometric mark that reads as an actual icon without requiring finished logo artwork. This tool creates favicon icons from emoji, text, or SVG shapes with multiple size outputs, including a vector shape as a genuine third starting point alongside the more familiar text and emoji options. Useful for building a geometric brand mark favicon from a simple SVG shape when no logo exists yet, creating a more distinctive icon than typed initials alone without commissioning actual logo design, or generating a shape-based favicon across every standard size from one vector starting point.`,
    examples: [
      {
        title: 'Build a favicon from a simple SVG shape',
        code: `Input: <circle fill="#2563EB" r="45"/>\nOutput: favicon.ico, favicon-32.png, favicon.svg`,
        note: 'Starts from a geometric shape rather than text or an uploaded logo.',
      },
      {
        title: 'Create a distinctive mark without commissioned logo design',
        code: `Input: SVG polygon shape\nOutput: favicon set generated across standard sizes`,
        note: 'Fills the gap between plain typed initials and a full logo upload.',
      },
    ],
  },

  'image-compressor': {
    description: `Compressing an image blind and hoping the result still looks acceptable is a gamble, since the same compression level that leaves one photo looking fine can leave another visibly blocky or smeared, especially in areas with fine detail or smooth gradients where artifacts show up first. This tool compresses images to reduce file size while maintaining quality, with a side-by-side comparison showing exactly what's lost at a given setting before committing to it. Useful for checking exactly how much quality a specific compression level actually costs before saving over the original, comparing an original and compressed image directly to catch visible artifacts in detail-heavy areas, or dialing in the smallest file size that still holds up next to the source image.`,
    examples: [
      {
        title: 'Compare quality loss before committing',
        code: `Input: photo.jpg (4.2 MB), quality: 75%\nOutput: photo-compressed.jpg (680 KB), side-by-side preview shown`,
        note: 'Shows what a compression level actually costs before saving.',
      },
      {
        title: 'Catch artifacts in a detail-heavy image',
        code: `Input: product-shot.png (fine texture detail), quality: 60%\nOutput: side-by-side comparison flags visible smearing at this setting`,
        note: 'Surfaces quality loss where it shows up first, before it ships.',
      },
    ],
  },

  'image-cropper': {
    description: `A passport photo has to match an exact, strictly enforced ratio, get it wrong and the application gets rejected, and a 16:9 thumbnail has its own fixed requirement too, both cases where the target dimensions are already dictated by an outside rule rather than left to whatever crop happens to look right. This tool crops images to any ratio or a preset size, passport, 16:9, square, and more, built around matching a specific known requirement rather than a freeform crop where the exact ratio doesn't matter. Useful for cropping a photo to the exact ratio a passport or visa application actually requires, producing a 16:9 thumbnail sized correctly for a video platform, or hitting a precise preset dimension a form or a platform specifically demands rather than cropping by eye.`,
    examples: [
      {
        title: 'Crop to an exact passport photo ratio',
        code: `Input: portrait.jpg, preset: passport (2x2 in)\nOutput: portrait-passport.jpg (exact required ratio)`,
        note: 'Matches a strict external requirement rather than an eyeballed crop.',
      },
      {
        title: 'Produce a correctly sized video thumbnail',
        code: `Input: screenshot.png, preset: 16:9\nOutput: screenshot-thumbnail.jpg (1920x1080)`,
        note: "Hits a platform's fixed dimension requirement precisely.",
      },
    ],
  },
};

export default FIX_BATCH_100;
