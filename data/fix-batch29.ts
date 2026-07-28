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

const FIX_BATCH_29: Record<string, FixBatchEntry> = {
  'hex-to-rgba': {
    description: `A hex color on its own has no concept of transparency, it's either fully there or not used at all, which matters when a specific color needs to sit semi-transparent over a photo, a modal backdrop, a tooltip background, and the actual visual effect of that transparency needs checking before committing to a value in CSS. This tool converts a hex code into RGBA with the alpha value adjustable directly, showing a live preview of the color at that specific transparency level rather than just returning a number with no way to see what it actually looks like. Useful for dialing in a semi-transparent overlay color and seeing the result before it goes into a stylesheet, converting an existing hex brand color into a translucent version for a hover state, or checking exactly how much a color fades at a specific alpha value rather than guessing.`,
    examples: [
      {
        title: 'Create a semi-transparent modal backdrop',
        code: `Input: #000000, alpha: 50%\nOutput: rgba(0, 0, 0, 0.5)`,
        note: 'Live preview shows the actual transparency before the value goes into a stylesheet.',
      },
      {
        title: 'Fade a brand color for a hover state',
        code: `Input: #2563EB, alpha: 20%\nOutput: rgba(37, 99, 235, 0.2)`,
        note: 'Converts an existing brand hex color into a translucent version for a subtle hover effect.',
      },
    ],
  },

  'mp4-to-mp3': {
    description: `MP4 is what a phone records by default, which makes extracting audio from an MP4 file probably the single most common version of this task, pulling the music out of a concert video shot on a phone, saving a video's soundtrack as a standalone song, grabbing the audio from a recorded event without keeping the footage. This tool extracts the audio track from an MP4 file and saves it as MP3, dropping the video entirely and leaving a much smaller file that plays in anything with a speaker. Useful for turning a phone-recorded video's audio into a song file worth keeping on its own, saving a soundtrack from a video without the accompanying footage, or converting an event recording down to just the audio for something that only needs to be heard, not watched.`,
    examples: [
      {
        title: "Save a concert video's audio as a song file",
        code: `Input: concert-clip.mp4 (85 MB)\nOutput: concert-clip.mp3 (4 MB)`,
        note: 'Keeps just the music, dropping the video entirely for a much smaller file.',
      },
      {
        title: 'Extract audio from a recorded event',
        code: `Input: wedding-speech.mp4\nOutput: wedding-speech.mp3`,
        note: 'Useful when only the audio needs to be kept, not the footage.',
      },
    ],
  },

  cutter: {
    description: `Cutting a video the normal way means decoding it, trimming the timeline, and re-encoding the result, which takes real time on a long file and always costs at least a little quality in the process, since re-encoding is inherently lossy even at a high setting. This tool trims a video without re-encoding it at all, copying the relevant portion of the file directly rather than decoding and rebuilding it, which is both dramatically faster and doesn't touch quality in any way. The tradeoff is that a cut point sometimes snaps to the nearest keyframe rather than landing on the exact frame requested, since a lossless cut can only happen at points the file's own structure supports. Useful for trimming a long recording down to just the relevant clip quickly without any quality loss, or cutting a large file down to size before sharing it without waiting through a full re-encode.`,
    examples: [
      {
        title: 'Trim a long recording without losing quality',
        code: `Input: full-lecture.mp4 (2h 15m)\nOutput: highlight-clip.mp4 (0:45:00-0:52:30, same quality as source)`,
        note: 'Copies the relevant portion directly instead of re-encoding, so quality stays identical.',
      },
      {
        title: 'Cut a large file down to size quickly',
        code: `Input: raw-footage.mp4 (4.2 GB)\nOutput: trimmed-footage.mp4 (380 MB), cut in seconds`,
        note: "Runs fast because it doesn't decode and rebuild the entire file.",
      },
    ],
  },

  'image-scale-calculator': {
    description: `Before actually resizing an image, it helps to know exactly what dimensions the result will end up at, scaling a 4000x3000 photo down to 25% doesn't obviously land on a round number without doing the multiplication, and specifying a target width alone leaves the resulting height as something that needs calculating separately to keep the aspect ratio intact. This tool calculates the resulting dimensions from either a percentage scale or a target size, without touching an actual image file, just doing the math a resize would produce ahead of time. Useful for checking whether scaling an image down to a specific percentage will still meet a minimum resolution requirement before committing to the export, working out the matching height for a specific target width while keeping proportions correct, or specifying exact dimensions to someone else before they actually run the resize.`,
    examples: [
      {
        title: 'Check if a scaled image still meets a resolution minimum',
        code: `Input: 4000x3000px, scale: 25%\nOutput: 1000x750px`,
        note: 'Confirms the resulting size before actually running the resize.',
      },
      {
        title: 'Find the matching height for a target width',
        code: `Input: 3000x2000px, target width: 1200px\nOutput: height: 800px (aspect ratio preserved)`,
        note: 'Calculates the proportional height without distorting the image.',
      },
    ],
  },

  'remove-extra-spaces': {
    description: `Text copied from a PDF or pasted out of a web page often looks completely normal on screen while actually carrying invisible extra whitespace underneath, doubled spaces, non-breaking spaces that look identical to regular ones, inconsistent line breaks, none of which show up to the eye but can break a search-and-replace that expects a single space, or cause a layout to render oddly once that whitespace lands somewhere it wasn't expected. This tool cleans all of that out: collapsing multiple spaces down to one, normalizing inconsistent line breaks, and stripping tabs left over from a pasted table or spreadsheet. Useful for cleaning up text copied from a PDF before it goes anywhere else, fixing a search that keeps failing to match text that looks identical but carries hidden extra spacing, or tidying up a block of pasted content before publishing it.`,
    examples: [
      {
        title: 'Clean text copied from a PDF',
        code: `Input: "Hello   there,\\n\\n\\nhow  are you?"\nOutput: "Hello there,\\n\\nhow are you?"`,
        note: 'Collapses doubled spaces and excess line breaks that a PDF copy often introduces invisibly.',
      },
      {
        title: 'Fix a search that keeps failing to match',
        code: `Input: text containing a non-breaking space that looks identical to a regular space\nOutput: text with all spacing normalized to regular single spaces`,
        note: 'Removes invisible whitespace differences that break an exact-match search.',
      },
    ],
  },

  'text-case-converter': {
    description: `The right case depends entirely on where text is headed: a heading wants Title Case, a JavaScript variable wants camelCase, a Python variable wants snake_case, a CSS custom property wants kebab-case, and converting between them by hand means re-typing the same words while manually tracking capitalization and separator rules for whichever format is needed next. This tool converts text between all of those cases at once, UPPERCASE, lowercase, Title Case, camelCase, snake_case, kebab-case, and more, handling the punctuation and spacing rules each format actually requires rather than a naive find-and-replace. Useful for converting a heading into a matching variable name while switching between programming languages with different naming conventions, formatting a title consistently across a document, or converting an identifier from one code style guide's convention into another's without retyping it by hand.`,
    examples: [
      {
        title: 'Convert a heading into a matching variable name',
        code: `Input: "User Profile Settings"\nOutput: camelCase: userProfileSettings, snake_case: user_profile_settings, kebab-case: user-profile-settings`,
        note: 'Generates the matching identifier for whichever language or style guide is in use.',
      },
      {
        title: 'Format a title consistently',
        code: `Input: "the QUICK brown Fox"\nOutput: Title Case: "The Quick Brown Fox"`,
        note: 'Normalizes inconsistent capitalization into a proper title case.',
      },
    ],
  },

  'csv-to-excel': {
    description: `Opening a CSV directly in Excel doesn't always preserve data the way it actually looks in the source file, a zip code with a leading zero silently loses it, a long ID number gets auto-converted into scientific notation, because Excel's CSV import guesses at column types rather than being told explicitly what each one actually is. This tool converts a CSV into a genuine .xlsx file instead, with formatting applied properly so columns keep their intended type rather than being reinterpreted by Excel's default import guesswork. Useful for converting a CSV export into a real Excel file that opens with formatting already applied, avoiding the leading-zero and scientific-notation problems that plague a raw CSV opened directly, or handing off a dataset to someone who expects an actual Excel file rather than a plain text CSV.`,
    examples: [
      {
        title: 'Preserve a leading zero in a zip code',
        code: `Input CSV: zip\\n02108\nOutput: 02108.xlsx (zip column formatted as text, leading zero intact)`,
        note: "Avoids Excel's default CSV import silently dropping the leading zero.",
      },
      {
        title: 'Prevent a long ID from becoming scientific notation',
        code: `Input CSV: order_id\\n1234567890123\nOutput: order_id column formatted so the full number displays, not 1.23457E+12`,
        note: "Excel's raw CSV import often reinterprets a long number as scientific notation by default.",
      },
    ],
  },

  'mobi-to-azw3': {
    description: `MOBI was Kindle's original format, but AZW3 supports layout features MOBI never could, fixed layouts, more precise typography, better embedded font support, which show up specifically on a Kindle Fire or a newer Kindle model built to take advantage of them. This tool converts a MOBI file into AZW3, upgrading an older ebook into the format a newer Kindle actually renders with its full formatting capability rather than falling back to whatever MOBI's older feature set could support. Useful for getting more out of a book that only exists as an older MOBI file when reading it on a Kindle Fire or a newer device, or standardizing an ebook library on the format that takes full advantage of current Kindle hardware instead of the older one it happens to already be in.`,
    examples: [
      {
        title: 'Upgrade an older ebook for Kindle Fire',
        code: `Input: novel.mobi\nOutput: novel.azw3 (fixed layout and typography supported)`,
        note: "Takes advantage of formatting features a Kindle Fire renders that older MOBI can't provide.",
      },
      {
        title: 'Standardize a library for newer Kindle hardware',
        code: `Input: 15 MOBI files\nOutput: 15 AZW3 files`,
        note: 'Matches the format a current-generation Kindle is built to render fully.',
      },
    ],
  },

  'text-combinations-generator': {
    description: `Keyword research often starts with a head term and a handful of modifiers, best, cheap, top, near me, and the actual research question is what every combination of those modifiers against every head term actually looks like as a search phrase, which is tedious to write out by hand once there's more than a couple of words on each side. This tool generates every two-word and three-word combination across a set of input words automatically, so a modifier list crossed with a set of product terms produces every resulting phrase at once instead of typing each pairing out individually before checking search volume on it. Useful for generating a full list of long-tail keyword variations to check against a keyword research tool, building out every modifier-plus-term combination for a content plan, or exploring word pairings across two lists that would take real time to write out one at a time.`,
    examples: [
      {
        title: 'Generate long-tail keyword variations',
        code: `Modifiers: best, cheap, top\nTerms: running shoes, laptops, headphones\nOutput: "best running shoes", "cheap running shoes", "top running shoes", "best laptops"`,
        note: 'Produces every modifier-term pairing at once for keyword research instead of typing each one.',
      },
      {
        title: 'Build three-word phrase variations',
        code: `Input: fast, reliable + shipping, support, service\nOutput: "fast shipping service", "reliable support service"`,
        note: 'Extends the same combination logic to three-word phrases.',
      },
    ],
  },

  'css-border-radius-generator': {
    description: `CSS border-radius can do more than round every corner the same amount, each corner accepts its own horizontal and vertical radius independently, which is exactly how an organic, blob-like shape gets built instead of a uniformly rounded rectangle, but hand-writing four corners each with two separate values and mentally previewing the result is slow and error-prone. This tool builds that per-corner control visually instead: adjust each corner independently, see the shape update live, and copy the finished border-radius value once it looks right. Useful for creating an asymmetric, organic shape that a single uniform radius value can't produce, fine-tuning a subtle rounded-corner card design visually rather than guessing at pixel values, or building a decorative blob shape for a background element without hand-calculating eight separate radius numbers.`,
    examples: [
      {
        title: 'Build an asymmetric blob shape',
        code: `border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;`,
        note: 'Uses independent horizontal and vertical radii per corner to create an organic, non-uniform shape.',
      },
      {
        title: 'Fine-tune a subtle rounded card',
        code: `border-radius: 12px 12px 4px 4px;`,
        note: 'Rounds the top corners more than the bottom for a specific visual effect.',
      },
    ],
  },
};

export default FIX_BATCH_29;
