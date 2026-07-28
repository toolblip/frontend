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

const FIX_BATCH_57: Record<string, FixBatchEntry> = {
  'ico-file-generator': {
    description: `A browser checking a site's root for favicon.ico still expects the older ICO container format specifically, a single file that can actually bundle several image resolutions together inside it so the browser picks whichever size fits best, which is a genuinely different structure from a folder of separate PNG files at different sizes. This tool creates a Windows ICO file from any image with multiple size presets bundled into that one file, producing the specific format a browser's default favicon check still looks for. Useful for generating the classic favicon.ico file a browser checks by default at a site's root, bundling several icon sizes into one file instead of several separate images, or creating a properly formatted ICO file for a Windows application shortcut that expects that exact container format.`,
    examples: [
      {
        title: 'Generate a multi-size ICO file',
        code: `Input: logo.png\nOutput: favicon.ico (contains 16x16, 32x32, and 48x48 sizes in one file)`,
        note: 'Bundles several resolutions into a single ICO file instead of separate images.',
      },
      {
        title: 'Create an icon for a Windows shortcut',
        code: `Input: app-icon.png\nOutput: app-icon.ico`,
        note: 'Produces the exact container format a Windows application expects.',
      },
    ],
  },

  'tiff-to-jpg': {
    description: `A TIFF file straight out of a scanner or a professional camera is often massive, saved uncompressed for archival or print quality, which is exactly the wrong size for actually putting on a website where a visitor's browser has to download the whole thing before the page even finishes loading. This tool converts a TIFF image into JPEG, shrinking the file size down to something reasonable for the web while a TIFF's original lossless quality gets left behind. Useful for taking a huge archival scan and shrinking it down to something a website can actually load quickly, converting a professional camera's TIFF export into a smaller format before sharing it online, or reducing a document scan's file size before attaching it somewhere with a size limit.`,
    examples: [
      {
        title: 'Shrink a scanned document for the web',
        code: `Input: scan.tiff (48 MB)\nOutput: scan.jpg (2.1 MB)`,
        note: 'Reduces file size dramatically while staying suitable for web use.',
      },
      {
        title: 'Convert a camera TIFF export',
        code: `Input: photo-raw-export.tiff\nOutput: photo-raw-export.jpg`,
        note: 'Prepares a professional camera file for online sharing.',
      },
    ],
  },

  'photo-resize-tool': {
    description: `Instagram, a LinkedIn banner, and a website's hero image each expect a photo at a completely different exact pixel dimension, and uploading a photo that doesn't match usually means the platform crops or stretches it automatically in whatever way it sees fit, not necessarily the way that was actually intended. This tool resizes a photo to standard dimensions for social media, web, and mobile with a preview shown before saving, matching a specific platform's expected size directly instead of leaving the crop up to that platform. Useful for resizing a photo to an exact Instagram post or story dimension before uploading it, preparing a banner image at a LinkedIn or a Facebook cover photo's exact required size, or fitting a photo to a website's hero image dimension without an unexpected automatic crop.`,
    examples: [
      {
        title: 'Resize for an Instagram post',
        code: `Input: vacation-photo.jpg (4032x3024)\nOutput: 1080x1080 (Instagram square post size)`,
        note: 'Matches the exact dimension the platform expects instead of leaving cropping to it.',
      },
      {
        title: 'Resize for a LinkedIn banner',
        code: `Input: team-photo.jpg\nOutput: 1584x396 (LinkedIn cover photo size)`,
        note: "Fits a photo to a specific platform's required banner dimension.",
      },
    ],
  },

  'headline-analyzer': {
    description: `Deciding whether a headline actually works is different from rewriting it, sometimes the real question is just how it measures up, is it too long, does it carry any actual emotional pull, does it include the keyword it's supposed to be targeting, three separate things easy to guess at but harder to actually confirm without measuring each one directly. This tool analyzes a headline for word count, emotional impact, and SEO keyword density, scoring what's already written rather than generating a rewritten alternative. Useful for checking whether an already-drafted headline is running too long before it gets used, measuring how much genuine emotional pull a headline actually carries, or confirming a target keyword actually shows up in a headline meant to rank for it.`,
    examples: [
      {
        title: "Score a headline's metrics",
        code: `Input: "5 Simple Ways to Save Money on Your Next Grocery Trip"\nOutput: word count: 11, emotional impact: moderate, keyword density: "save money" - 1 match`,
        note: 'Measures an already-written headline instead of generating a new one.',
      },
      {
        title: 'Check for a target keyword',
        code: `Input: headline: "Our New App Update Is Here", target keyword: "productivity app"\nOutput: keyword not found in headline`,
        note: 'Confirms whether a headline actually contains the term it should rank for.',
      },
    ],
  },

  'url-parameter-extractor': {
    description: `A marketing link loaded with UTM tracking parameters, a source, a medium, a campaign name, all packed into one long query string, reads as an unreadable wall of text until each parameter is actually pulled apart into something that can be looked at individually. This tool extracts and decodes every query parameter from a URL into a clean key-value list, turning that long string into something that's actually readable one parameter at a time. Useful for reading exactly what a long marketing URL's tracking parameters actually say without parsing the query string by eye, debugging which specific parameter value is being passed in a redirect URL, or checking a UTM-tagged link's campaign and source values before it goes out in a newsletter.`,
    examples: [
      {
        title: 'Extract UTM parameters from a marketing link',
        code: `Input: example.com/sale?utm_source=newsletter&utm_medium=email&utm_campaign=spring_sale\nOutput:\nutm_source: newsletter\nutm_medium: email\nutm_campaign: spring_sale`,
        note: 'Turns a long tracking URL into a readable list of individual values.',
      },
      {
        title: "Debug a redirect URL's parameters",
        code: `Input: example.com/redirect?dest=%2Fcheckout&ref=cart\nOutput:\ndest: /checkout\nref: cart`,
        note: 'Decodes and separates each parameter for inspection.',
      },
    ],
  },

  'hsl-to-hex': {
    description: `Picking a shade in HSL inside a design tool and then needing its HEX code for an actual stylesheet is a common enough path that going through RGB as an unnecessary middle step just slows things down when HEX is the only format actually needed at the end. This tool converts an HSL value directly into HEX, showing a live preview and ready CSS output, skipping the RGB intermediate entirely for the direct path from one format to the other. Useful for converting an HSL value picked in a design tool straight into the HEX code a stylesheet actually needs, confirming a converted color looks right through the live preview before using it, or grabbing CSS-ready output the moment an HSL shade is finalized.`,
    examples: [
      {
        title: 'Convert HSL directly to HEX',
        code: `Input: hsl(210, 65%, 45%)\nOutput: #2A72BD`,
        note: 'Skips RGB entirely for the direct path to the format a stylesheet needs.',
      },
      {
        title: 'Get CSS-ready output',
        code: `Input: hsl(15, 90%, 55%)\nOutput: #F4611F, CSS: background-color: #F4611F;`,
        note: 'Produces ready-to-use CSS the moment a shade is finalized.',
      },
    ],
  },

  'favicon-checker': {
    description: `A favicon showing up correctly in a browser tab doesn't mean it's configured everywhere else it needs to be, a missing Apple touch icon, a broken Android web manifest reference, or an absent Open Graph image can each fail silently without ever showing up as a visible error. This tool checks a site's favicon setup across all six places it actually needs to appear, ico, PNG, Apple touch icon, Google's search result display, the Android web manifest, and the Open Graph image, rather than assuming one working icon means everything else is fine too. Useful for confirming a favicon shows up in a Google search result and not just a browser tab, catching a missing Apple touch icon before an iPhone user bookmarks the site with a blank icon, or auditing an entire setup after a redesign instead of checking one platform at a time.`,
    examples: [
      {
        title: 'Audit all six favicon surfaces',
        code: `Input: example.com\nOutput:\nico: found\nPNG: found\nApple touch icon: missing\nGoogle SERP: found\nAndroid manifest: broken reference\nOpen Graph image: found`,
        note: 'Surfaces failures on platforms a browser tab check alone would never reveal.',
      },
      {
        title: 'Catch a broken web manifest reference',
        code: `Input: example.com/site.webmanifest\nOutput: icon path "/icons/icon-512.png" returns 404`,
        note: 'Flags a manifest pointing at an icon file that no longer exists.',
      },
    ],
  },

  'image-compression-tool': {
    description: `A photo destined for a website doesn't need every last bit of its original detail preserved, it needs to load fast without looking noticeably worse, and finding that balance between file size and visible quality is exactly what a compression algorithm is built to calculate rather than requiring a manual trial-and-error export at several different quality settings. This tool compresses JPEG, PNG, and WebP images to reduce file size while keeping quality intact, handling that calculation directly rather than requiring several exports compared by eye. Useful for shrinking a photo's file size before uploading it to a website so the page actually loads faster, comparing how the same image compresses as JPEG versus WebP to see which format actually comes out smaller, or reducing an image's size for an email attachment without a visible drop in quality.`,
    examples: [
      {
        title: 'Compress a photo for faster page loads',
        code: `Input: hero-image.jpg (3.8 MB)\nOutput: hero-image.jpg (620 KB), no visible quality difference`,
        note: 'Balances file size against visible quality automatically.',
      },
      {
        title: 'Compare JPEG versus WebP output',
        code: `Input: product-photo.png\nOutput: compressed JPEG: 340 KB, compressed WebP: 210 KB`,
        note: 'Shows which format actually comes out smaller for the same image.',
      },
    ],
  },

  'notebook-to-html': {
    description: `A Jupyter notebook's actual value, its markdown explanations, its code, and the plots or printed results that code actually produced, is locked inside a JSON file that needs Jupyter itself installed to view properly, which isn't always something a reader on the other end actually has. This tool renders a pasted .ipynb notebook as HTML directly in the browser, showing rendered markdown cells, syntax-highlighted code, and its outputs together exactly as they'd appear inside Jupyter itself. Useful for sharing a data science notebook's results with someone who doesn't have Jupyter installed, viewing a notebook's rendered output and plots without running Python locally at all, or embedding a notebook's analysis into a webpage or a blog post as static HTML.`,
    examples: [
      {
        title: "Render a notebook's markdown and code",
        code: `Input: analysis.ipynb (pasted JSON)\nOutput: rendered HTML with markdown headers, syntax-highlighted code cells, and a matplotlib chart displayed inline`,
        note: 'Shows the notebook exactly as Jupyter would, without Jupyter installed.',
      },
      {
        title: 'Share notebook output as a webpage',
        code: `Input: report.ipynb\nOutput: standalone HTML file ready to embed in a blog post`,
        note: 'Turns a notebook into static HTML anyone can view in a browser.',
      },
    ],
  },

  'text-redundancy-checker': {
    description: `A sentence can be grammatically flawless and still be bloated with words doing no actual work, "in order to" instead of just "to," "past history" when history is already necessarily past, a word repeated twice in the same sentence without adding anything the first instance didn't already say. This tool detects repeated words, filler phrases, and unnecessary redundancy in text, flagging that specific category of bloat rather than a grammar or a spelling mistake. Useful for tightening a wordy sentence weighed down by a filler phrase that adds length without adding meaning, catching a redundant pairing like "final outcome" or "each and every" that says the same thing twice, or trimming a piece of writing down to what it's actually trying to say without the padding around it.`,
    examples: [
      {
        title: 'Catch a filler phrase',
        code: `Input: "In order to finish the project, we need more time."\nOutput: flag "in order to" -> suggest "to"`,
        note: 'Flags a filler phrase that adds length without adding meaning.',
      },
      {
        title: 'Flag a redundant pairing',
        code: `Input: "We need to consider the final outcome of each and every decision."\nOutput: flag "final outcome" -> "outcome", flag "each and every" -> "every"`,
        note: 'Catches a redundant phrase that says the same thing twice.',
      },
    ],
  },
};

export default FIX_BATCH_57;
