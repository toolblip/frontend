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

const FIX_BATCH_8: Record<string, FixBatchEntry> = {
  'html-to-plain-text-tool': {
    description: `Copy text straight out of a web page and paste it somewhere that doesn't render HTML, a plain-text email, a spreadsheet cell, an SMS, and what shows up is a mess of angle brackets, stray &amp; and &nbsp; entities, and paragraph breaks that either vanish entirely or turn into a single run-on line. This tool strips the markup out properly instead: tags get removed, entities get decoded back into normal characters, and paragraph and line breaks stay roughly where they belong so the result still reads like the original content rather than one wall of text. Paste in a chunk of scraped HTML or a page's source, and get back plain text ready to drop into a place that has no idea what a div is, an email body, a form field, a word counter that would otherwise be counting markup instead of actual words.`,
    examples: [
      {
        title: 'Clean scraped HTML before pasting into an email',
        code: `Input: <p>Hello &amp;nbsp;there,</p><div>Please <strong>confirm</strong></div>\nOutput: "Hello there,\\n\\nPlease confirm"`,
        note: 'Decodes entities and keeps paragraph breaks instead of mashing everything onto one line.',
      },
      {
        title: 'Strip markup before running a word count',
        code: `Input: <article><h1>Title</h1><p>Body text here.</p></article>\nOutput: "Title\\n\\nBody text here."`,
        note: 'A word counter would otherwise count HTML tags as part of the text.',
      },
    ],
  },

  'text-permutation-generator': {
    description: `Generating every anagram of a word only gets you the rearrangements that happen to spell real words, but sometimes the actual need is different: every possible arrangement, full stop, whether or not it spells anything recognizable. This tool produces that complete combinatorial set instead, every possible ordering of a word's letters or a phrase's words, without filtering for what counts as a real word along the way. That distinction matters for testing every possible word order in a short tagline to see which sequence reads best, generating every character arrangement for a puzzle or a brute-force exercise, or exploring combinations a strict anagram check would throw away simply because they aren't in a dictionary. Keep in mind the count grows fast: a 7-letter word already has over five thousand possible orderings, so this works best on short inputs.`,
    examples: [
      {
        title: 'Generate every word order for a short tagline',
        code: `Input: "fast simple free"\nOutput: "fast simple free", "fast free simple", "simple fast free", "simple free fast", "free fast simple", "free simple fast"`,
        note: 'Lists every possible order regardless of which one reads best.',
      },
      {
        title: 'Get all character arrangements of a short string',
        code: `Input: "cat"\nOutput: cat, cta, act, atc, tca, tac`,
        note: 'Includes arrangements that spell nothing at all, unlike an anagram generator.',
      },
    ],
  },

  'anagram-generator': {
    description: `An anagram isn't just any rearrangement of a word's letters, it specifically has to spell another real word or phrase using exactly the same letters, which is a much narrower and more interesting target than shuffling letters randomly. This tool checks a word or phrase against a dictionary and returns only the rearrangements that land on an actual valid word, filtering out the much larger pile of letter combinations that don't spell anything. Type in "listen" and get back "silent" and "enlist," not a list of every possible letter order regardless of whether it means something. Useful for solving a crossword clue built around an anagram, building a word puzzle where the answer needs to be a real word, or discovering that a name or phrase happens to rearrange into something else entirely.`,
    examples: [
      {
        title: 'Find real words hidden in a name',
        code: `Input: "listen"\nOutput: silent, enlist, tinsel`,
        note: 'Only returns rearrangements that are valid dictionary words.',
      },
      {
        title: 'Solve an anagram-based crossword clue',
        code: `Input: "stream"\nOutput: master, tamers, maters`,
        note: 'Filters out the much larger set of letter combinations that spell nothing.',
      },
    ],
  },

  grayscale: {
    description: `Removing color from a photo sounds like it should be one simple operation, but a naive conversion that just averages the red, green, and blue values per pixel tends to produce a flat, slightly washed-out result, because the eye doesn't perceive all three colors as equally bright. This tool converts to grayscale using a weighting that accounts for that difference, so the result keeps proper contrast between, say, a red and a green object that would otherwise end up looking like the same shade of gray. The intensity slider goes further than a plain on-off toggle: dial it partway for a subtly muted, partially desaturated look, or all the way for the classic full black-and-white effect. Useful for a moody portrait edit, matching a photo to a print that only supports monochrome, or previewing how an image reads without color pulling attention away from its composition.`,
    examples: [
      {
        title: 'Convert a portrait to full black and white',
        code: `Input: portrait.jpg, intensity: 100%\nOutput: portrait-bw.jpg`,
        note: "Uses a perceptual weighting so red and green tones don't collapse into the same gray.",
      },
      {
        title: 'Apply a subtle partial desaturation',
        code: `Input: landscape.jpg, intensity: 40%\nOutput: landscape-muted.jpg`,
        note: 'Keeps a hint of color instead of converting all the way to full monochrome.',
      },
    ],
  },

  'image-resizer': {
    description: `Resizing an image is a different job than cropping one: cropping cuts away part of the picture, resizing scales the entire thing up or down while keeping everything in frame, which is what actually matters when a platform enforces an exact pixel size instead of just an aspect ratio. This tool resizes to standard dimensions used across social platforms, thumbnails, and Open Graph preview images, with an aspect ratio lock so shrinking a photo's width doesn't accidentally squash or stretch it out of proportion. Batch resizing handles a whole folder of images to the same target size in one pass instead of opening each file individually. Useful for prepping a batch of product photos to a marketplace's exact required dimensions, generating a correctly sized preview image for a blog post, or shrinking a phone photo before it's attached somewhere with its own upload limit.`,
    examples: [
      {
        title: 'Batch resize product photos to a marketplace spec',
        code: `Input: 24 product photos, target: 1000x1000px, aspect lock: on\nOutput: 24 resized images, no distortion`,
        note: 'Applies the same exact dimensions across an entire batch in one pass.',
      },
      {
        title: 'Generate an Open Graph preview image',
        code: `Input: blog-header.jpg, target: 1200x630px\nOutput: blog-header-og.jpg`,
        note: 'Matches the exact dimensions most platforms expect for a link preview image.',
      },
    ],
  },

  'user-agent-parser': {
    description: `A modern Chrome user agent string still contains the word Mozilla and a fake reference to Safari and AppleWebKit, leftover compatibility cruft from decades of browsers pretending to be each other so older sites wouldn't block them. Reading one by eye to figure out what actually sent a request means untangling that history first, which is exactly what this tool automates: paste in a User-Agent string and get back the actual browser name and version, the operating system, and whether the request came from a phone, tablet, or desktop, stripped of all the historical noise. Useful for debugging a bug report that only happens on a specific browser version, checking what an unfamiliar entry in a server log actually represents, or confirming a mobile detection script reads a device correctly before shipping it.`,
    examples: [
      {
        title: 'Decode a User-Agent string from a log file',
        code: `Input: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15"\nOutput: Browser: Safari 17.4 | OS: iOS 17.4 | Device: iPhone`,
        note: 'Strips out the legacy Mozilla and AppleWebKit references left over from browser history.',
      },
      {
        title: 'Confirm a mobile detection script works correctly',
        code: `Input: "Mozilla/5.0 (Linux; Android 14; Pixel 8) Chrome/122.0"\nOutput: Browser: Chrome 122 | OS: Android 14 | Device: mobile`,
        note: 'Verifies the device type a detection script would actually read from the string.',
      },
    ],
  },

  'add-images': {
    description: `Getting a new image into a PDF that already exists, a signature stamp, a photo, a chart exported from somewhere else, usually means going back to whatever created the original file and adding it there, which is a dead end if that source file is gone or was never something you had in the first place. This tool drops an image directly onto an existing PDF page instead: pick where it lands, resize it to fit the available space, and place additional images on the same page or different ones as needed. It's built for adding something new to a document rather than modifying what's already printed on the page. Useful for inserting a scanned signature onto a signature line, attaching a photo as evidence to a filled-out form, or adding a company logo to a report that was exported without one.`,
    examples: [
      {
        title: 'Insert a scanned signature onto a form',
        code: `Input: form.pdf, signature.png, position: page 2, bottom-right\nOutput: form-signed.pdf`,
        note: 'Places a new image onto an existing page without recreating the document.',
      },
      {
        title: 'Attach photo evidence to a filled-out report',
        code: `Input: incident-report.pdf, photo1.jpg, photo2.jpg, position: page 3\nOutput: incident-report-updated.pdf`,
        note: 'Adds multiple images to the same page without needing the original report template.',
      },
    ],
  },

  'sleep-duration-calculator': {
    description: `Two nights of exactly seven hours of sleep can feel completely different depending on where in a sleep cycle the alarm actually goes off, since waking up mid-cycle during deep sleep tends to feel groggier than waking at a natural cycle boundary, even with the same total hours logged. This tool does more than subtract a bedtime from a wake time: it also works out how many complete roughly ninety-minute sleep cycles fit into that window, which is the number that actually predicts how rested you're likely to feel. Enter when you fell asleep and when the alarm went off, and see both the raw duration and how many full cycles it lines up with. Useful for figuring out whether a rough night was actually short on time or just badly timed against a cycle boundary, or picking a better bedtime for tomorrow's wake-up time.`,
    examples: [
      {
        title: 'Check how many full sleep cycles a night hit',
        code: `Input: bedtime 11:00 PM, wake time 6:30 AM\nOutput: 7h 30m total | 5 complete 90-minute cycles`,
        note: 'Landing on a full cycle count often explains why one 7-hour night feels better than another.',
      },
      {
        title: "Pick a better wake time for tomorrow",
        code: `Input: bedtime 11:30 PM\nOutput: cycle-aligned wake times: 5:00 AM (5 cycles), 6:30 AM (6 cycles)`,
        note: 'Suggests wake times that land on a cycle boundary instead of mid-cycle.',
      },
    ],
  },

  'listicle-writer': {
    description: `Some topics are naturally suited to a numbered list, ten mistakes beginners make, seven tools worth trying, five signs of something specific, and that particular shape, a short intro followed by a run of numbered points each with its own brief explanation, is a genuinely different structure than a flowing essay covering the same ground. This tool generates that list-style format specifically: give it a topic and a number of items, and it builds an opening hook, the individual numbered entries each with a short paragraph of explanation, and a closing wrap-up, all in the skimmable shape that makes a listicle easy to read in a few minutes or scan for just the one point that matters. Useful for a blog post about common tool mistakes, a roundup of recommendations, or any topic that's genuinely list-shaped rather than forced into a list for the sake of a familiar format.`,
    examples: [
      {
        title: 'Generate a common-mistakes listicle',
        code: `Input: topic: "beginner woodworking mistakes", items: 7\nOutput: hook intro + 7 numbered points with explanations + closing summary`,
        note: 'Produces the skimmable numbered structure instead of a flowing essay covering the same ground.',
      },
      {
        title: 'Build a tool roundup post',
        code: `Input: topic: "free budgeting apps", items: 5\nOutput: 5 numbered entries, each with a one-paragraph explanation`,
        note: 'Matches the format readers expect from a roundup-style post.',
      },
    ],
  },

  'tone-of-voice': {
    description: `The same piece of information needs to sound completely different depending on who's reading it: an internal memo written for a compliance team wants a formal, precise register, while the same update posted to social media wants something that reads casual and human. This tool keeps what a piece of writing actually says the same, the facts, the specific details, the order of points, while shifting how it sounds: more formal and precise, more casual and conversational, warmer and more approachable, or plainer and more direct. Paste in a draft written in one tone and get back the same message reworked into another, without rewriting the underlying content from scratch every time it needs to reach a different audience. Useful for adapting one core announcement into a formal email, a casual social post, and a friendly customer-facing notice without drafting three separate versions by hand.`,
    examples: [
      {
        title: 'Rewrite an update for a compliance audience',
        code: `Input: "Hey team, we fixed the bug, all good now!" (casual)\nOutput: "The reported issue has been resolved and the fix has been verified." (formal)`,
        note: 'Keeps the same underlying fact while changing only how it reads.',
      },
      {
        title: 'Adapt an announcement for social media',
        code: `Input: "The updated pricing structure will take effect on the first of next month." (formal)\nOutput: "Heads up, new pricing kicks in next month!" (casual)`,
        note: 'Same information, reworded for a more casual, conversational audience.',
      },
    ],
  },
};

export default FIX_BATCH_8;
