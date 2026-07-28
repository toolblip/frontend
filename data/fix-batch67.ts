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

const FIX_BATCH_67: Record<string, FixBatchEntry> = {
  'compress-mov': {
    description: `An iPhone screen recording or a MOV export from an older Mac editing project often comes out far larger than it needs to be for actually putting online, and a video that's too big for a specific upload limit or too slow to load on mobile needs its file size brought down without necessarily changing the format entirely. This tool compresses QuickTime MOV videos, reducing file size specifically for web and mobile use while keeping the same MOV format the source file already uses. Useful for shrinking an iPhone screen recording before sharing it or uploading it somewhere with a size limit, compressing a MOV export from an older editing project before hosting it on a website, or reducing a video's file size to load faster on a mobile connection without converting it to a different format.`,
    examples: [
      {
        title: 'Shrink an iPhone screen recording',
        code: `Input: screen-recording.mov (340 MB)\nOutput: screen-recording-compressed.mov (48 MB)`,
        note: 'Reduces file size while keeping the same MOV format.',
      },
      {
        title: 'Compress a video for mobile upload',
        code: `Input: presentation.mov (210 MB)\nOutput: presentation-compressed.mov (35 MB)`,
        note: 'Fits under a strict upload limit without converting to a different format.',
      },
    ],
  },

  crop: {
    description: `Padding an odd-shaped photo to fit a square canvas keeps every pixel of the original intact, but sometimes the actual goal is the opposite, cutting away a distracting background element or a stray person at the edge of the frame entirely rather than preserving the whole picture. This tool crops an image to any size and aspect ratio, removing unwanted areas directly rather than padding around the existing content. Useful for cutting an unwanted background element or a stray person out of the edge of a photo, cropping an image down to a specific aspect ratio needed for a design layout, or trimming a screenshot down to just the relevant portion before sharing it.`,
    examples: [
      {
        title: 'Cut a stray person from the edge of a photo',
        code: `Input: group-photo.jpg (1600x1200)\nOutput: cropped to 1400x1200, stranger removed from the frame`,
        note: 'Removes unwanted content by cutting it away instead of padding around it.',
      },
      {
        title: 'Crop to a specific aspect ratio',
        code: `Input: photo.jpg, target ratio: 4:5\nOutput: photo-cropped.jpg (4:5)`,
        note: 'Matches an exact ratio required by a design layout.',
      },
    ],
  },

  'eps-to-svg': {
    description: `Flattening an EPS logo into a raster image works for a quick preview but throws away the one thing that actually made it a vector file, the ability to keep adjusting its paths and curves after the fact, which SVG preserves as a modern format any current web browser or design tool can open directly, unlike the older EPS format most of them can't. This tool converts an EPS vector file into SVG, producing fully editable vector output rather than flattening the artwork into fixed pixels. Useful for converting an old EPS logo into an SVG that works directly on a website, keeping a graphic's paths fully editable in a modern vector tool that no longer opens EPS files, or preparing an old vector asset for a web project that specifically requires SVG.`,
    examples: [
      {
        title: 'Convert a logo to editable SVG',
        code: `Input: company-logo.eps\nOutput: company-logo.svg (paths fully editable)`,
        note: 'Keeps the artwork as adjustable vector paths instead of flattening it.',
      },
      {
        title: 'Prepare a vector asset for a website',
        code: `Input: icon-set.eps\nOutput: icon-set.svg`,
        note: 'Produces a format modern browsers and design tools can open directly.',
      },
    ],
  },

  'heic-to-png': {
    description: `An iPhone photo saved as HEIC opens without any trouble on the phone itself but often won't open at all on a Windows PC or in an older program that's never heard of the format, a mismatch that turns a perfectly normal photo into a file nobody outside Apple's ecosystem can actually view. This tool converts HEIC images into PNG, preserving both quality and transparency, producing a file format that opens reliably everywhere rather than only within Apple's own software. Useful for opening an iPhone photo on a Windows computer or an older program that doesn't recognize HEIC, uploading an iPhone photo to a website or a form that only accepts JPG or PNG, or converting a HEIC screenshot into PNG while keeping its transparency intact.`,
    examples: [
      {
        title: 'Open an iPhone photo on Windows',
        code: `Input: IMG_4521.heic\nOutput: IMG_4521.png`,
        note: 'Converts to a format a Windows PC can open without extra software.',
      },
      {
        title: 'Preserve transparency in a HEIC screenshot',
        code: `Input: screenshot.heic (transparent background)\nOutput: screenshot.png (transparency intact)`,
        note: 'Keeps the alpha channel through the conversion.',
      },
    ],
  },

  'jpg-to-webp': {
    description: `JPG is still the format nearly every photo already exists in, and WebP is the modern replacement most sites now use for actual page speed, which makes converting straight from one to the other the single most common image optimization task there is, one that doesn't need a general multi-format tool's extra options when the destination format is already decided. This tool converts JPEG images into WebP directly, producing a smaller file at excellent quality without requiring a broader converter's additional format choices. Useful for converting a batch of JPG product photos into WebP before uploading them to a website for a quick page-speed improvement, shrinking a large JPG photo down for faster mobile loading, or preparing an image specifically for a platform that already prefers WebP uploads.`,
    examples: [
      {
        title: 'Convert product photos for faster loading',
        code: `Input: product-1.jpg (1.4 MB)\nOutput: product-1.webp (380 KB)`,
        note: 'Cuts file size significantly while keeping visual quality high.',
      },
      {
        title: 'Prepare an image for a WebP-preferring platform',
        code: `Input: hero-banner.jpg\nOutput: hero-banner.webp`,
        note: 'Matches the format a modern platform already expects.',
      },
    ],
  },

  'mkv-to-mov': {
    description: `Final Cut Pro doesn't natively open an MKV file, a container common for downloaded video and screen recordings from non-Apple tools, but it works directly with QuickTime's own MOV format, which is exactly the gap that stops a piece of MKV footage from being imported straight into an Apple-based editing project at all. This tool converts MKV into QuickTime MOV format, keeping the full video rather than extracting just its audio, producing a file Final Cut Pro and other Apple editing tools can actually open. Useful for importing a downloaded MKV video into Final Cut Pro for editing on a Mac, converting a recorded MKV screen capture into a format an Apple-based workflow can open directly, or preparing MKV footage for any QuickTime-based tool that can't read the MKV container on its own.`,
    examples: [
      {
        title: 'Import MKV footage into Final Cut Pro',
        code: `Input: downloaded-clip.mkv\nOutput: downloaded-clip.mov`,
        note: 'Converts to a format Final Cut Pro can open natively.',
      },
      {
        title: 'Convert a screen recording for an Apple workflow',
        code: `Input: screen-capture.mkv\nOutput: screen-capture.mov`,
        note: 'Prepares MKV footage for any QuickTime-based editing tool.',
      },
    ],
  },

  'mkv-to-mp3': {
    description: `An MKV file, the dominant container for a downloaded movie or an anime episode, often bundles more than one audio track together, a dubbed language, a commentary, the original language, all inside the same file, which means extracting just the audio actually means choosing which specific track is the one worth keeping. This tool extracts audio from an MKV file and saves the selected track as an MP3, pulling out one specific soundtrack rather than assuming there's only a single audio option to begin with. Useful for extracting a movie's original-language audio track from an MKV file that also bundles a dub, pulling a specific commentary track out separately from the main audio, or saving just the soundtrack from an MKV video that bundles several different audio options together.`,
    examples: [
      {
        title: 'Extract the original-language audio track',
        code: `Input: movie.mkv (tracks: English dub, Japanese original, commentary)\nOutput: movie-japanese-audio.mp3`,
        note: 'Selects one specific track instead of assuming there is only one.',
      },
      {
        title: 'Pull a commentary track separately',
        code: `Input: film.mkv, track: commentary\nOutput: film-commentary.mp3`,
        note: 'Extracts a specific bundled audio track on its own.',
      },
    ],
  },

  'mobi-to-epub': {
    description: `MOBI was Kindle's own format until Amazon moved on to newer ones, which leaves an old MOBI e-book stuck in a format that a Kobo, a Nook, Apple Books, or a library reading app won't open at all, none of them ever having supported Amazon's proprietary format to begin with. This tool converts MOBI files into EPUB, the open standard nearly every e-reader other than Kindle actually supports, making an old MOBI book readable well beyond the one ecosystem it was originally tied to. Useful for reading an old MOBI e-book on a Kobo, a Nook, or any e-reader that isn't a Kindle, converting a downloaded MOBI file into a format a library or a reading app can actually open, or future-proofing an old MOBI library now that the format itself has been discontinued.`,
    examples: [
      {
        title: 'Read an old MOBI book on a Kobo',
        code: `Input: old-book.mobi\nOutput: old-book.epub`,
        note: 'Converts to the format non-Kindle e-readers actually support.',
      },
      {
        title: 'Future-proof a MOBI library',
        code: `Input: [12 MOBI files]\nOutput: 12 EPUB files`,
        note: 'Moves an old collection into the format still actively supported everywhere.',
      },
    ],
  },

  'paragraph-completer': {
    description: `Writing an opening sentence or two and then getting stuck is a different problem than needing an entire paragraph generated from a bare topic, the beginning already exists and has its own voice, and what's actually needed is a continuation that keeps that same tone rather than a fresh paragraph that might not match it at all. This tool completes a paragraph that's already been started, continuing in a matching style and tone to finish the thought already begun rather than generating something disconnected from it. Useful for finishing a paragraph that's stalled out partway through without losing its established voice, keeping a consistent tone across a longer piece by having each section continue from where the last one left off, or speeding up a first draft by writing an opening line and letting the rest get completed from there.`,
    examples: [
      {
        title: 'Finish a paragraph that stalled out',
        code: `Input: "The rollout went smoothly at first, but by the second week"\nOutput: "...support tickets had tripled, and the team realized the documentation hadn't kept pace with the new features."`,
        note: 'Continues in the same voice rather than starting a new paragraph.',
      },
      {
        title: 'Keep a consistent tone across sections',
        code: `Input: opening line in a formal, analytical tone\nOutput: completion matching that same formal register`,
        note: 'Maintains the established style rather than drifting into a different one.',
      },
    ],
  },

  'fraction-to-decimal': {
    description: `A recipe measurement written as 3/8 of a cup doesn't mean anything to a digital kitchen scale that only accepts a decimal value, and a woodworking measurement of 3 and 3/8 inches needs converting the same way before it can go into a tool that works in decimals rather than fractions, a conversion that's simple for a clean fraction but genuinely fiddly for a repeating decimal like a third. This tool converts fractions and mixed numbers into decimal format with rounding and precision options, handling exactly how many decimal places a specific use actually needs. Useful for converting a recipe's fractional measurement into the decimal value a digital kitchen scale requires, converting a mixed number like 3 and 3/8 inches into decimal for a precise engineering or a woodworking calculation, or rounding a repeating decimal like one-third to a specific number of decimal places for a report.`,
    examples: [
      {
        title: 'Convert a recipe measurement',
        code: `Input: 3/8 cup\nOutput: 0.375 cups`,
        note: 'Gives the exact decimal value a digital scale requires.',
      },
      {
        title: 'Convert a mixed number with rounding',
        code: `Input: 1/3, precision: 2 decimal places\nOutput: 0.33`,
        note: 'Rounds a repeating decimal to the precision actually needed.',
      },
    ],
  },
};

export default FIX_BATCH_67;
