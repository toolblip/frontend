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

const FIX_BATCH_4: Record<string, FixBatchEntry> = {
  'mkv-to-mp3': {
    description: `MKV files often carry more than one audio track bundled inside, an English dub, the original language, sometimes a director's commentary, all packed alongside the video in the same container. This tool pulls one of those tracks out and saves it as a standalone MP3, so instead of an entire movie file you're left with just the song, dialogue, or commentary you actually wanted. It's a common move for grabbing a soundtrack from a ripped concert film, pulling a lecture's audio out of a downloaded recording so it plays on a phone during a commute, or saving a commentary track separately to listen to on its own. Because a video's audio is usually a different codec than MP3 to begin with, the extraction re-encodes it, so the resulting file plays anywhere without needing whatever software understood the original container.`,
    examples: [
      {
        title: 'Extract a commentary track from a ripped film',
        code: `Input: movie.mkv (tracks: English, Spanish, Director Commentary)\nSelected track: Director Commentary\nOutput: movie-commentary.mp3`,
        note: 'MKV files often bundle several audio tracks, so you pick which one becomes the MP3.',
      },
      {
        title: "Save a concert film's audio as a standalone track",
        code: `Input: live-concert.mkv\nOutput: live-concert.mp3`,
        note: 'Leaves you with just the music instead of the full video file.',
      },
    ],
  },

  'mobi-to-epub': {
    description: `MOBI was built for Kindle, back before Amazon moved on to its own newer formats, and hardly anything outside Amazon's ecosystem opens it anymore. EPUB is what nearly every other e-reader actually expects: Kobo, Apple Books, most library lending apps, and any reader that isn't tied to a single storefront. This tool converts a MOBI file into EPUB, keeping the chapter structure, table of contents, and embedded images intact rather than just dumping raw text. It's the fix for a specific situation, an ebook downloaded years ago as MOBI, a backup pulled from an old Kindle library, a review copy sent in the wrong format, that now needs to open on a device that was never going to read MOBI in the first place. Drop in the file and get back something your current e-reader will actually recognize.`,
    examples: [
      {
        title: 'Read an old Kindle download on a Kobo',
        code: `Input: novel.mobi (2014 Kindle purchase backup)\nOutput: novel.epub (chapters and cover intact)`,
        note: 'Kobo and most non-Kindle readers only open EPUB, not MOBI.',
      },
      {
        title: 'Fix a review copy sent in the wrong format',
        code: `Input: advance-copy.mobi\nOutput: advance-copy.epub`,
        note: 'Keeps the table of contents and embedded images instead of just dumping raw text.',
      },
    ],
  },

  compress: {
    description: `A ten-page PDF shouldn't weigh fifty megabytes, but scanned documents and reports with embedded high-resolution images end up there constantly, because whatever created the file saved every image at full print resolution even though it's only ever viewed on a screen. This tool re-compresses the images and streams inside a PDF without touching the actual text or layout, so the pages look the same, the words stay selectable and searchable, and the file just takes up a fraction of the space. That difference matters most against a hard limit: an email attachment cap, a job application portal that rejects anything over ten megabytes, a government form upload that times out on a slow connection. Drop in a bloated PDF and get back one that opens just as fast but actually fits through whatever size limit is in the way.`,
    examples: [
      {
        title: 'Shrink a scanned contract for email',
        code: `Input: signed-contract.pdf (38 MB, scanned pages)\nOutput: signed-contract-compressed.pdf (4.1 MB)`,
        note: 'Recompresses the embedded scan images without touching the searchable text layer.',
      },
      {
        title: "Fit a report under a job portal's upload limit",
        code: `Input: annual-report.pdf (22 MB)\nOutput: annual-report-compressed.pdf (7.8 MB)`,
        note: 'Gets a bloated report under a typical 10 MB application upload cap.',
      },
    ],
  },

  'paragraph-completer': {
    description: `Staring at an unfinished paragraph, knowing roughly what you want to say next but not quite how to word it, is its own specific kind of stuck. This tool reads what you've already written, picks up on the tone and direction, and generates a continuation that keeps going from where the paragraph left off instead of restarting from a blank page. Paste in the start of an email that trails off mid-thought, a story scene that stalled after the opening line, or a report section you know the gist of but haven't found the words for, and get a few sentences that carry the same voice forward. It's meant as a starting point to edit and adjust, not a final draft to paste in as-is, useful for breaking through a stall rather than replacing your own writing entirely.`,
    examples: [
      {
        title: 'Finish an email that trails off',
        code: `Input: "Thanks for sending over the proposal. After reviewing the numbers, I think we should"\nOutput: "...move forward with the smaller pilot program first and revisit the full rollout once we see results."`,
        note: 'Picks up the sentence in progress instead of starting a new one.',
      },
      {
        title: 'Continue a stalled story scene',
        code: `Input: "The lighthouse keeper hadn't answered the radio in three days."\nOutput: "Mara told herself it was probably just the storm knocking out the relay again, the same excuse she'd used the last two times."`,
        note: 'Matches the tone already established instead of shifting into a different voice.',
      },
    ],
  },

  'gif-maker': {
    description: `A GIF plays itself the moment it loads, no play button, no sound, no video player waiting to buffer, which is exactly why it still survives in places a regular video file doesn't fit: forum signatures, chat reactions, email bodies that strip out embedded video entirely. This tool builds one two ways: stack a handful of still images into a frame-by-frame sequence with a delay you control between each one, or feed in a short clip and have it converted into a small looping file automatically. The image route works well for a step-by-step UI walkthrough or a simple before-and-after comparison. The video route is for turning an actual recording, a bug reproduction, a reaction clip, a quick demo, into something that drops straight into a Slack message or a bug tracker without anyone needing to click play.`,
    examples: [
      {
        title: 'Turn a UI bug into a shareable GIF',
        code: `Input: screen-recording.mp4 (0:04-0:09)\nOutput: bug-repro.gif (5 seconds, looping)`,
        note: 'Drops straight into a bug tracker or chat message without anyone needing to click play.',
      },
      {
        title: 'Build a step-by-step walkthrough from screenshots',
        code: `Input: step1.png, step2.png, step3.png, frame delay: 1200ms\nOutput: walkthrough.gif (3 frames, looping)`,
        note: 'A longer delay per frame gives someone time to actually read each step before it advances.',
      },
    ],
  },

  'fraction-to-decimal': {
    description: `A recipe calling for 2 3/4 cups, a blueprint measurement of 5/16 of an inch, a spec sheet listing a bolt size as a fraction, none of those drop cleanly into a calculator or spreadsheet formula until they become a decimal first. This tool converts a fraction or a mixed number like 2 3/4 into its decimal equivalent, and lets you set how many places to keep, since some fractions turn into a repeating decimal that would otherwise run on forever. Round 1/3 to two decimal places for a quick estimate, or keep six digits of precision for a measurement where the extra accuracy actually matters, like a machining tolerance. Useful for scaling a recipe up or down, converting a construction measurement for a tool that only accepts decimal input, or just checking that a fraction someone wrote by hand actually means what you think it does.`,
    examples: [
      {
        title: 'Convert a recipe measurement',
        code: `Input: 2 3/4 cups\nOutput: 2.75`,
        note: 'Handles the whole-number part of a mixed number, not just a simple fraction.',
      },
      {
        title: 'Round a repeating decimal to a usable precision',
        code: `Input: 1/3, precision: 4 decimal places\nOutput: 0.3333`,
        note: 'Stops the repeating decimal at a set number of digits instead of running on indefinitely.',
      },
    ],
  },

  'exif-remover': {
    description: `A photo file carries information that never shows up when you actually look at the picture: the make and model of the camera or phone that took it, sometimes the device's serial number, the exact software used to edit it, occasionally even the folder path the file lived in on someone's computer. All of it rides along quietly inside the EXIF metadata, attached to the file itself rather than the image you see. This tool strips that data out while leaving the visible photo completely unchanged, same pixels, same quality. It matters most where the metadata itself is the risk rather than the picture: a journalist sharing a photo without revealing the device or location it came from, someone on a dating profile who'd rather not broadcast exactly which phone they own, a business scrubbing internal file paths before a screenshot goes public.`,
    examples: [
      {
        title: "Strip device details before sharing a source photo",
        code: `Input: source-photo.jpg (Camera: Pixel 8, Software: Lightroom 6.2)\nOutput: source-photo-clean.jpg (metadata fields empty)`,
        note: 'Removes device and editing software info without altering how the photo looks.',
      },
      {
        title: 'Clean a screenshot before a public release',
        code: `Input: internal-screenshot.png (contains original file path metadata)\nOutput: internal-screenshot-clean.png`,
        note: 'Removes leftover file path data that could reveal internal folder structure.',
      },
    ],
  },

  'energy-converter': {
    description: `Energy shows up under a different name depending on which field you're in: a physicist writes joules, a nutrition label prints calories, an electric bill runs in kilowatt-hours, and an air conditioner's spec sheet lists BTU. They're all measuring the same underlying thing, just in units standardized separately for entirely different industries, which is why they never line up cleanly without a conversion. This tool moves a value between all four instantly, so a calorie count from a workout tracker, a kilowatt-hour figure from a power bill, or a BTU rating on an air conditioner box actually means something outside its original context. Useful for figuring out roughly how much electricity a workout's calorie burn would take to replicate, or translating an appliance's BTU cooling capacity into a wattage number that's actually comparable to a home's power usage.`,
    examples: [
      {
        title: "Translate a workout's calorie burn into kilowatt-hours",
        code: `Input: 450 kcal\nOutput: 0.52 kWh`,
        note: 'A rough way to see how much electricity that many calories would take to generate.',
      },
      {
        title: "Compare an air conditioner's BTU rating to household power use",
        code: `Input: 12,000 BTU\nOutput: 3.52 kWh (energy equivalent)`,
        note: "Makes an appliance's cooling spec comparable to numbers on an actual electric bill.",
      },
    ],
  },

  'heic-to-jpg': {
    description: `An iPhone saves photos as HEIC by default, and while the format is efficient, it's also the reason a photo sometimes fails to upload somewhere entirely: plenty of print labs, stock photography sites, and older upload forms are built around JPG specifically and don't recognize HEIC at all. This tool converts an iPhone photo into JPG, the format almost every photo service actually expects, rather than PNG, which suits graphics and screenshots better than photographs. JPG's compression is tuned for photos in particular, so the file stays reasonably small without the visible quality loss you'd notice on a picture with sharp lines or text. Use it before uploading vacation photos to a print service, submitting an image to a stock site with strict format rules, or attaching a photo to an application form that flatly rejects anything that isn't a JPG.`,
    examples: [
      {
        title: 'Upload a vacation photo to a print service',
        code: `Input: IMG_5192.heic (iPhone 15)\nOutput: IMG_5192.jpg (print-service compatible)`,
        note: 'Most photo print labs are built around JPG and reject HEIC uploads outright.',
      },
      {
        title: 'Submit a photo to a stock photography site',
        code: `Input: landscape-shot.heic\nOutput: landscape-shot.jpg`,
        note: 'Stock sites with strict format rules typically require JPG, not HEIC or PNG.',
      },
    ],
  },

  'api-doc-generator': {
    description: `Writing API documentation by hand means describing the same information twice, once in the code that defines an endpoint, and again in prose explaining what that endpoint expects and returns, and the second version drifts out of date the moment the code changes. This tool builds the documentation directly from endpoint definitions instead: list out the paths, methods, and parameters, and it generates readable reference pages complete with example request bodies and sample responses for each one. That's the part manual docs usually skip or fake, a request and response pair someone can actually copy and adapt, rather than an abstract description of a field's data type. Useful for handing a working reference to another team consuming an internal API, publishing developer docs for a public endpoint, or just having an accurate description that a Postman collection alone doesn't provide.`,
    examples: [
      {
        title: 'Generate a reference page for an endpoint',
        code: `Input: GET /api/users/:id\nOutput: endpoint doc with example request, sample 200 response, and 404 error case`,
        note: 'Produces a copy-and-adapt example instead of just listing field types.',
      },
      {
        title: "Document a POST endpoint's request body",
        code: `Input: POST /api/orders { "item_id": string, "quantity": number }\nOutput: sample request body, example success response, and validation error case`,
        note: 'Gives a consuming team a working example rather than an abstract schema description.',
      },
    ],
  },
};

export default FIX_BATCH_4;
