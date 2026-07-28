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

const FIX_BATCH_90: Record<string, FixBatchEntry> = {
  'eps-to-svg': {
    description: `An EPS file, unlike a PNG or a JPEG, usually already contains genuine vector path data written in PostScript's own drawing language, which means converting it to SVG is mostly a translation problem, taking PostScript's path operators and rewriting them as SVG's own path syntax, rather than tracing a bitmap into vector shapes from scratch the way converting an actual raster image would require. This tool converts an EPS file into SVG, translating its existing PostScript vector paths directly into SVG path data rather than re-tracing an image that never had real vector data to begin with. Useful for modernizing an old logo that only exists as EPS into a web-ready SVG, converting vector artwork received from a print vendor or an old client relationship into a format a browser actually renders, or bringing decades-old PostScript vector work into a current web design workflow.`,
    examples: [
      {
        title: 'Modernize an old logo into web-ready SVG',
        code: `Input: legacy-logo.eps (PostScript vector paths)\nOutput: legacy-logo.svg (translated path data)`,
        note: 'Translates existing PostScript paths rather than re-tracing a bitmap.',
      },
      {
        title: 'Bring print vendor artwork onto the web',
        code: `Input: vendor-artwork.eps\nOutput: vendor-artwork.svg`,
        note: 'Converts vector data a browser can actually render directly.',
      },
    ],
  },

  'color-palette-from-image': {
    description: `A design template built around five specific color roles, primary, secondary, accent, background, text, needs exactly five colors to plug into those slots every time, not sometimes three and sometimes eight depending on how varied a particular photo happens to be, which is a genuinely different requirement than wanting however many colors an image actually contains. This tool extracts a consistent five-color palette from any image, with HEX, RGB, and HSL values for each swatch, built for feeding a fixed number of color slots rather than adapting to an image's actual complexity. Useful for populating a design template's five predefined color roles from a reference photo, generating a predictable, consistently sized palette regardless of how simple or complex the source image is, or extracting exactly five swatches to compare consistently across a batch of different images.`,
    examples: [
      {
        title: "Fill a template's five color roles",
        code: `Input: brand-photo.jpg\nOutput: primary #2563EB, secondary #1E3A8A, accent #F7C548, background #F8FAFC, text #0F172A`,
        note: 'Always returns exactly five swatches to match a fixed template.',
      },
      {
        title: 'Compare palettes consistently across images',
        code: `Input: photo-1.jpg, photo-2.jpg\nOutput: 5 swatches each, directly comparable`,
        note: 'Keeps output size consistent regardless of image complexity.',
      },
    ],
  },

  'temp-converter-express': {
    description: `Getting a temperature conversion's numeric answer is one thing, but actually seeing Fahrenheit equals Celsius times nine-fifths plus thirty-two, or Kelvin equals Celsius plus 273.15, spelled out alongside the result is what actually lets someone verify the math themselves or learn the formula rather than trusting an opaque number handed back with no visible working. This tool converts between Celsius, Fahrenheit, and Kelvin while showing the actual formula behind each conversion, built for understanding the calculation rather than only producing a number. Useful for a student learning the Celsius-to-Fahrenheit formula rather than just copying an answer, double-checking a temperature conversion done by hand against the shown formula, or converting a temperature while seeing exactly which equation produced the result.`,
    examples: [
      {
        title: 'See the Celsius-to-Fahrenheit formula',
        code: `Input: 20°C\nFormula: F = (20 × 9/5) + 32\nOutput: 68°F`,
        note: 'Shows the equation alongside the converted result.',
      },
      {
        title: 'Convert to Kelvin with the formula shown',
        code: `Input: 20°C\nFormula: K = 20 + 273.15\nOutput: 293.15 K`,
        note: 'Lets the calculation be verified rather than trusted blindly.',
      },
    ],
  },

  'html-entities-reference': {
    description: `Encoding a specific block of text into HTML entities is an action performed on input you actually supply, but knowing what code represents a copyright symbol or a non-breaking space in the first place is a different need entirely, one better served by browsing a reference table than by running any specific text through an encoder. This tool provides a browsable reference of HTML named entities alongside their decimal and hexadecimal codes, built for looking up a specific character's entity rather than transforming a block of text. Useful for looking up the exact entity code for a special character like a copyright symbol or an em dash, browsing available named entities when the specific one needed isn't already known, or referencing a numeric code without needing to encode or decode any actual text.`,
    examples: [
      {
        title: "Look up a symbol's entity code",
        code: `Search: "copyright"\nOutput: &copy; / &#169; / &#xA9;`,
        note: 'Browses the reference table without encoding any actual text.',
      },
      {
        title: 'Find a numeric code for a special character',
        code: `Search: "em dash"\nOutput: &mdash; / &#8212;`,
        note: 'Provides the code directly for reference rather than transforming input.',
      },
    ],
  },

  'base64-image-decoder': {
    description: `A base64 data URL pulled from an API response, a config file, or a browser's developer tools is just a long string of characters until it's actually turned back into a viewable image, and the real need at that point usually isn't encoding anything new, it's seeing what the string actually represents and getting a real file out of it. This tool decodes a base64 data URL back into an image file, ready to view, inspect, or download, built specifically for the decode direction rather than a bidirectional encode-and-decode tool. Useful for turning a base64 string copied from an API response into an actual downloadable image file, inspecting what a data URL embedded in a config file actually depicts before trusting it, or recovering a viewable image from base64 text found in an email or a document.`,
    examples: [
      {
        title: 'Turn an API response string into a real file',
        code: `Input: "data:image/png;base64,iVBORw0KGgo..."\nOutput: image.png (downloadable file)`,
        note: 'Converts a base64 string into an actual viewable, downloadable image.',
      },
      {
        title: "Inspect a config file's embedded image",
        code: `Input: [base64 string found in a config file]\nOutput: preview showing a 128x128 icon`,
        note: 'Reveals what a data URL actually depicts before trusting it.',
      },
    ],
  },

  'placeholder-image-generator': {
    description: `A gray box standing in for a photo that hasn't arrived yet says nothing about whether an image slot is actually rendering at its intended size, but a placeholder with its own dimensions printed directly on it, 800x600 spelled out across the box itself, turns that into something checkable at a glance, if the box looks stretched or tiny compared to what the label says, that's an immediate, visible layout bug rather than something only caught after real content goes in. This tool generates placeholder images at any size with custom text, color, and format. Useful for confirming an image slot renders at its actual intended size before final photos are ready, generating a placeholder labeled with its own dimensions to catch a layout bug immediately, or filling a mockup with sized, labeled placeholders instead of a single generic gray box.`,
    examples: [
      {
        title: 'Verify a layout slot renders at the right size',
        code: `Input: 800x600, text: "800x600", format: PNG\nOutput: placeholder.png (labeled with its own dimensions)`,
        note: 'Makes a sizing mistake visible at a glance instead of hidden.',
      },
      {
        title: 'Fill a mockup with labeled placeholders',
        code: `Input: 3 slots: 400x300, 800x600, 1200x400\nOutput: 3 placeholders, each labeled with its own size`,
        note: 'Replaces one generic gray box with sized, checkable placeholders.',
      },
    ],
  },

  'hex-to-rgba': {
    description: `Deciding exactly how transparent an overlay or a tint should look isn't really a math problem to compute once and move on from, it's something that usually needs to be seen and adjusted interactively, dragging an opacity value while watching a specific brand color visibly fade against a background until it looks right, rather than reading off a canvas API's RGB channel numbers. This tool converts a HEX color into RGBA, with an adjustable alpha slider and a live preview showing exactly how transparent the result looks as it's being tuned. Useful for dialing in a brand color's exact opacity for an overlay while watching it update live, finding the right transparency level for a subtle background tint by eye rather than by guessing a number, or previewing how a specific HEX color looks at several different opacity levels before picking one.`,
    examples: [
      {
        title: "Dial in an overlay's opacity live",
        code: `Input: #000000, alpha: dragging from 0.2 to 0.6\nOutput: rgba(0, 0, 0, 0.6) (preview updates live)`,
        note: 'Tunes transparency visually rather than computing a value blindly.',
      },
      {
        title: 'Find the right tint for a background',
        code: `Input: #2563EB, alpha: 0.08\nOutput: rgba(37, 99, 235, 0.08)`,
        note: 'Previews a subtle tint by eye before committing to a value.',
      },
    ],
  },

  'mp4-to-mp3': {
    description: `A concert recording, a DJ set, a music video downloaded as MP4, in all of these the video is basically incidental, the actual thing worth keeping is the audio, and converting straight to MP3 skips carrying picture data along for content that was only ever really about the sound in the first place. This tool extracts an MP4 video's audio track and saves it as MP3, built for casual listening of musical content pulled from video rather than a lossless source meant for further editing. Useful for pulling the soundtrack out of a downloaded music video to listen to on its own, converting a concert or DJ set recording's audio into a portable MP3, or extracting a video's music without keeping the picture when only the sound was ever the point.`,
    examples: [
      {
        title: 'Extract a soundtrack from a music video',
        code: `Input: music-video.mp4\nOutput: music-video.mp3`,
        note: 'Keeps just the audio when the video was only ever incidental.',
      },
      {
        title: 'Convert a concert recording to MP3',
        code: `Input: concert-recording.mp4\nOutput: concert-recording.mp3`,
        note: 'Produces a portable audio file for casual listening.',
      },
    ],
  },

  cutter: {
    description: `Trimming a video without re-encoding it works by cutting at existing keyframes and copying the surrounding footage as-is, which is dramatically faster and doesn't recompress anything, but it also means a cut can only land as precisely as the nearest keyframe allows, occasionally a few frames off from the exact instant intended, a real tradeoff against a full re-encode that could cut at any exact frame but takes far longer and recompresses the video in the process. This tool cuts and trims video files without re-encoding them, prioritizing speed and avoiding quality loss over frame-exact precision. Useful for quickly trimming a long recording down to its relevant section without waiting through a full re-encode, removing an unwanted section from a video while keeping the rest at its original quality, or cutting a clip fast when landing within a few frames of the exact intended point is good enough.`,
    examples: [
      {
        title: 'Trim a long recording fast',
        code: `Input: webinar.mp4 (90 min), cut: 12:00-45:00\nOutput: webinar-trimmed.mp4 (processed in seconds, no re-encoding)`,
        note: 'Cuts at the nearest keyframe instead of re-encoding the whole file.',
      },
      {
        title: 'Remove a section without losing quality',
        code: `Input: video.mp4, remove: 5:00-5:20\nOutput: video-cut.mp4 (original quality preserved)`,
        note: 'Avoids the generational quality loss a full re-encode would introduce.',
      },
    ],
  },

  'image-scale-calculator': {
    description: `Resizing "to 150%" and resizing "to exactly 1200 pixels wide" are two different ways of describing the same kind of change, and converting between them means working out what percentage a specific target width actually represents, then applying that same proportional scale to the height so the image doesn't stretch out of shape in one direction. This tool calculates new image dimensions from either a percentage scale or a specific target size, converting between the two while keeping the result proportional. Useful for figuring out the exact pixel dimensions a 150% scale-up actually produces, working backward from a required target width to the percentage scale that gets there, or confirming a resized image stays proportional instead of distorting in one direction.`,
    examples: [
      {
        title: 'Calculate dimensions from a percentage scale',
        code: `Input: 800x600, scale: 150%\nOutput: 1200x900`,
        note: 'Applies the percentage uniformly to both width and height.',
      },
      {
        title: 'Work backward from a target width',
        code: `Input: 800x600, target width: 1200\nOutput: scale: 150%, height: 900`,
        note: 'Keeps the image proportional by deriving the matching height.',
      },
    ],
  },
};

export default FIX_BATCH_90;
