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

const FIX_BATCH_28: Record<string, FixBatchEntry> = {
  'ogg-to-mp3': {
    description: `OGG is the audio format a lot of open-source software, Linux systems, and certain games default to, since it's royalty-free and works well for that ecosystem, but it doesn't have the same near-universal support MP3 has everywhere else, a car stereo, an older phone, some proprietary hardware that never bothered to add OGG decoding. This tool converts an OGG file into MP3, trading a slightly larger file for playback compatibility with essentially anything that plays audio at all. Useful for taking a game's sound file or an open-source recording out of the ecosystem it was built in and getting it playing on a device that's never heard of OGG, or standardizing a mixed audio collection on the one format that's guaranteed to open anywhere.`,
    examples: [
      {
        title: "Convert a game's sound file for wider compatibility",
        code: `Input: victory-sound.ogg\nOutput: victory-sound.mp3`,
        note: 'MP3 plays on hardware and software that never added OGG decoding support.',
      },
      {
        title: 'Standardize a mixed audio collection',
        code: `Input: 30 OGG files from an open-source project\nOutput: 30 MP3 files`,
        note: 'Puts every file into the one format guaranteed to open anywhere.',
      },
    ],
  },

  'emoji-finder': {
    description: `Scrolling through an emoji picker looking for a specific one works fine when you already know roughly where it lives in the grid, but searching by what it's actually called, "face with tears of joy," "shrug," when you only have a vague description in mind, "the tired one," "the one with hearts for eyes," is a completely different and often faster way in. This tool searches emojis by keyword rather than requiring the exact name, and copies the raw Unicode character itself rather than an image file, so it pastes as actual text anywhere text is accepted. Useful for finding an emoji when only a rough description comes to mind rather than its exact name, grabbing the actual Unicode character for a context that needs real text rather than an inserted image, or browsing by theme to find one that fits a specific tone.`,
    examples: [
      {
        title: 'Search by description instead of exact name',
        code: `Input: "tired"\nOutput: 😩 (weary face), 🥱 (yawning face), 😪 (sleepy face)`,
        note: "Finds relevant emojis without needing to know each one's official name.",
      },
      {
        title: 'Copy the raw Unicode character',
        code: `Input: "fire"\nOutput: 🔥 (copies as actual text, not an image)`,
        note: 'Pastes as real text in any context that accepts Unicode, not an inserted image file.',
      },
    ],
  },

  'webm-to-mp3': {
    description: `A browser-based screen recorder or a video downloaded straight from the web usually saves as WebM by default, and sometimes the only thing worth keeping from that recording is the narration or commentary track, not the screen capture itself. This tool pulls the audio out of a WebM file and saves it as a standalone MP3, dropping the video entirely so a screencast's voiceover or a web video's audio track becomes a normal, small audio file instead of staying bundled inside a video container. Useful for extracting a voiceover from a recorded tutorial without keeping the screen capture, pulling the audio track out of a web-downloaded video to listen to separately, or converting a WebM voice or video message into a plain MP3 that plays anywhere.`,
    examples: [
      {
        title: 'Extract narration from a screen recording',
        code: `Input: tutorial-recording.webm\nOutput: tutorial-recording.mp3`,
        note: 'Keeps the voiceover without the screen capture video taking up space.',
      },
      {
        title: 'Pull audio from a downloaded web video',
        code: `Input: web-video.webm\nOutput: web-video.mp3`,
        note: 'Converts a browser-recorded or web-downloaded file into a standalone audio track.',
      },
    ],
  },

  unblur: {
    description: `Sharpening a photo can recover some genuine clarity from a shot that's slightly soft, a touch of motion blur, a focus that missed by a hair, but it can't invent detail that was never actually captured in the first place, a severely out-of-focus shot or a very low native resolution image has an honest ceiling on how much a sharpening pass can realistically improve. This tool applies sharpening and enhancement to a blurry or low-resolution photo, pulling out as much genuine clarity as the source data actually supports rather than promising to manufacture detail from nothing. Useful for cleaning up a slightly soft phone photo before sharing it, improving a mildly blurry scan of an old print, or rescuing a photo that's a little underwhelming rather than one that's genuinely and severely out of focus.`,
    examples: [
      {
        title: 'Sharpen a slightly soft phone photo',
        code: `Input: portrait.jpg (mild motion blur)\nOutput: portrait-sharpened.jpg (noticeably crisper edges)`,
        note: 'Recovers real clarity from a shot that was only slightly soft to begin with.',
      },
      {
        title: 'Improve a low-resolution scan',
        code: `Input: old-photo-scan.jpg (72 DPI scan)\nOutput: old-photo-scan-enhanced.jpg`,
        note: "Improves perceived sharpness but can't invent detail the original scan never captured.",
      },
    ],
  },

  'eps-to-svg': {
    description: `An EPS file often carries two things bundled together: the actual vector artwork described in PostScript, and a separate low-resolution raster preview image embedded specifically so older software without a full PostScript interpreter can still show a quick thumbnail. A shortcut conversion that grabs the embedded preview instead of properly interpreting the real vector data produces a blurry raster image mistaken for a converted vector file, which defeats the entire point of the conversion. This tool converts an EPS file into SVG by reading the actual vector paths rather than falling back to whatever low-res preview happens to be bundled inside, keeping curves sharp at any size rather than inheriting the blur of a thumbnail image. Useful for converting an old EPS logo file into a genuinely scalable SVG rather than ending up with a raster image wearing an SVG file extension.`,
    examples: [
      {
        title: 'Convert the real vector data, not the embedded preview',
        code: `Input: logo.eps (contains vector paths + 72dpi preview bitmap)\nOutput: logo.svg (sharp vector paths, not the blurry preview)`,
        note: 'Reads the actual PostScript vector data instead of defaulting to the low-res thumbnail.',
      },
      {
        title: 'Modernize an old print logo file',
        code: `Input: company-logo.eps (1999)\nOutput: company-logo.svg (scalable, editable paths)`,
        note: 'Produces a genuinely scalable result rather than a raster image with an SVG extension.',
      },
    ],
  },

  'color-palette-from-image': {
    description: `A design system built around five color roles, a primary, a secondary, an accent, a background, and a text color, needs exactly that many swatches pulled from a reference image, not just whatever handful of colors happen to be most frequent in the pixels, which is a more structured extraction than a generic dominant-color list. This tool pulls exactly five colors from any image and returns each one as hex, RGB, and HSL, sized specifically to slot into a five-role color system rather than an arbitrary-length list that might come back with three colors or eight depending on the image. Useful for populating a five-color design token set directly from a reference photo or logo, or getting a fixed, predictable number of swatches to build a UI palette around instead of a variable-length extraction.`,
    examples: [
      {
        title: 'Populate a five-role design token set',
        code: `Input: brand-photo.jpg\nOutput: primary: #2563EB, secondary: #1E3A8A, accent: #F59E0B, background: #F8FAFC, text: #1A1A2E`,
        note: 'Maps exactly five swatches into five design roles instead of a variable-length list.',
      },
      {
        title: 'Extract a fixed swatch count from a logo',
        code: `Input: logo.png\nOutput: 5 hex, RGB, and HSL values`,
        note: 'Always returns exactly five colors regardless of how many are actually dominant in the source.',
      },
    ],
  },

  'temp-converter-express': {
    description: `Getting the conversion right between Celsius, Fahrenheit, and Kelvin means correctly applying formulas that aren't identical in structure, Fahrenheit needs both a multiplication and an addition applied to Celsius, while Kelvin is just Celsius plus a fixed offset with no scaling involved at all, differences easy to mix up doing the math by hand or from memory. This tool converts between all three instantly and shows the actual formula used for the specific conversion, rather than just returning a number with no way to check the math behind it. Useful for a student learning the relationship between the three temperature scales and wanting to see the formula alongside the answer, verifying a manual conversion came out correctly, or converting a scientific reading that specifically needs to end up in Kelvin rather than the more everyday Celsius or Fahrenheit.`,
    examples: [
      {
        title: 'Convert Celsius to Fahrenheit with the formula shown',
        code: `Input: 25°C\nFormula: (25 × 9/5) + 32\nOutput: 77°F`,
        note: 'Shows the multiplication and addition steps rather than just the final number.',
      },
      {
        title: 'Convert Celsius to Kelvin',
        code: `Input: 25°C\nFormula: 25 + 273.15\nOutput: 298.15 K`,
        note: 'Kelvin only needs a fixed offset added, no scaling factor like Fahrenheit requires.',
      },
    ],
  },

  'html-entities-reference': {
    description: `Encoding a specific string is one job, but sometimes the actual need runs the other way: knowing there's an HTML entity for a particular character, a copyright symbol, a non-breaking space, an em dash, without already knowing its exact code to look it up directly. This tool is a browsable reference table of HTML named entities and their numeric equivalents, organized so a specific character or symbol can be found by browsing or searching rather than requiring the entity code to already be known. Useful for finding the correct entity for a special character while hand-writing HTML, double-checking a named entity like &amp; actually maps to the numeric code you'd expect, or browsing the full set of available named entities rather than encoding one specific string you already have in hand.`,
    examples: [
      {
        title: 'Find the entity for a specific character',
        code: `Search: "copyright symbol"\nOutput: &copy; (named), &#169; (decimal)`,
        note: 'Finds the entity by searching for the character rather than needing its code already.',
      },
      {
        title: 'Confirm a named entity maps to the expected code',
        code: `Lookup: &amp;\nOutput: named: &amp;, decimal: &#38;, hex: &#x26;`,
        note: 'Cross-checks a named entity against its numeric equivalents.',
      },
    ],
  },

  'base64-image-decoder': {
    description: `An image sometimes only exists as a base64 string, embedded inline in a webpage's source, returned inside an API response's JSON field, pasted from a log entry, with no separate file to download directly, which leaves that base64 text as the only way to actually get the image out and look at it properly. This tool decodes a base64 data URL back into a real image file, ready to view, download, or inspect directly rather than staying trapped as a long string of encoded text. Useful for recovering an image embedded inline in a page's HTML source, extracting a photo returned as base64 inside an API response, or turning a base64 string copied from a log or a database field back into an actual file you can open.`,
    examples: [
      {
        title: "Recover an image embedded in a page's source",
        code: `Input: data:image/png;base64,iVBORw0KGgoAAAANS...\nOutput: image.png (downloadable file)`,
        note: 'Turns an inline base64 string from HTML source into an actual openable file.',
      },
      {
        title: 'Extract a photo from an API response',
        code: `Input: {"photo": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."}\nOutput: photo.jpg`,
        note: 'Recovers the actual image file from a base64 field returned by an API.',
      },
    ],
  },

  'placeholder-image-generator': {
    description: `A wireframe or a design mockup needs something occupying every image slot before real photos and graphics exist, a plain gray box with the intended dimensions and maybe a label showing the size, standing in for content that isn't ready yet without anyone mistaking it for a finished asset. This tool generates that placeholder image at any specific size, with custom text, background and text color, and output format, rather than using an external placeholder service that depends on a live internet connection and a URL staying available. Useful for filling every image slot in a wireframe before real assets are ready, generating a batch of correctly-sized placeholder images for a design system's component library, or testing how a layout handles an image of an exact specific size before the real one is dropped in.`,
    examples: [
      {
        title: 'Fill a wireframe with correctly-sized placeholders',
        code: `Input: 800x400, text: "800x400", background: #E5E7EB\nOutput: placeholder-800x400.png`,
        note: 'Occupies the exact image slot size a layout needs before real assets exist.',
      },
      {
        title: 'Generate a batch for a component library',
        code: `Input: sizes: 400x300, 600x400, 1200x630\nOutput: 3 placeholder images, one per size`,
        note: 'Produces placeholders for multiple slot sizes without depending on an external service staying online.',
      },
    ],
  },
};

export default FIX_BATCH_28;
