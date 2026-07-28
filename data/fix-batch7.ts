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

const FIX_BATCH_7: Record<string, FixBatchEntry> = {
  'remove-watermark': {
    description: `Older digital cameras and a lot of phone apps used to burn a date stamp or a small logo directly into the photo itself, not as a separate overlay you can toggle off, but baked into the actual pixels. This tool detects that kind of embedded mark and fills in the area underneath using the surrounding image detail, so what's left looks like the mark was never there rather than just blurred or covered with a solid patch. It's built for cleaning up your own photos: a timestamp burned into an old vacation photo, a proof watermark added to a draft before sending a client the final version, a small app logo stamped into a screenshot you want to reuse. Upload the image, mark the area the watermark covers, and the tool reconstructs what's underneath based on the pixels around it.`,
    examples: [
      {
        title: 'Remove a timestamp burned into an old photo',
        code: `Input: vacation-1998.jpg (date stamp "12 25 98" in bottom-right corner)\nOutput: vacation-1998-clean.jpg (area reconstructed from surrounding pixels)`,
        note: 'Works on marks baked directly into the pixels, not just an overlay layer.',
      },
      {
        title: 'Remove your own proof watermark before sending a final version',
        code: `Input: draft-design.png (diagonal "PROOF" watermark)\nOutput: final-design.png (watermark area removed)`,
        note: 'Useful for cleaning up a draft you watermarked yourself before delivering the finished file.',
      },
    ],
  },

  'summarize-podcast': {
    description: `A ninety-minute podcast episode is a real time investment before you even know if it's worth the full listen, and skimming through audio the way you'd skim a long article just isn't possible. This tool takes a podcast episode, transcribes it, and condenses it into the actual points made: the main topics covered, notable quotes, and any specific recommendations or conclusions the hosts landed on, without needing to sit through the full runtime first. Paste in an episode's audio file or a link to it, and get back a summary you can skim in under a minute to decide whether the full episode is worth your time, or use as a quick reference afterward instead of scrubbing back through the recording trying to remember which segment covered a specific point.`,
    examples: [
      {
        title: 'Get the gist of a long interview episode',
        code: `Input: episode-87.mp3 (1h 42m)\nOutput: 6 key points, 3 notable quotes, estimated read time: 45 seconds`,
        note: 'Lets you decide whether the full episode is worth an hour and a half before committing.',
      },
      {
        title: 'Reference a specific segment without scrubbing the audio',
        code: `Input: episode-87.mp3\nOutput: "Segment 3 (32:10-41:00): discussion of remote hiring practices"`,
        note: 'Points back to roughly where a topic was covered instead of searching through the raw audio.',
      },
    ],
  },

  'paragraph-lorem-ipsum': {
    description: `A design mockup usually needs placeholder text that fills a specific space, not just a generic block of lorem ipsum that might run three lines short or two lines over whatever the layout was built for. This tool builds placeholder paragraphs to a specific shape instead: set how many sentences belong in each paragraph and roughly how many words each sentence should run, and it generates text that actually matches the space a design needs to fill. That level of control matters when testing how a layout handles a short caption versus a long body paragraph, or checking that a card component doesn't break when the placeholder runs longer than expected. Generate one paragraph or several at once, copy the output, and drop it straight into a mockup or a component being tested.`,
    examples: [
      {
        title: 'Fill a card component with a matching text length',
        code: `Input: 2 paragraphs, 3 sentences each, ~12 words per sentence\nOutput: 2 placeholder paragraphs matching that shape`,
        note: 'Tests whether a card layout holds up with a body length close to the real content.',
      },
      {
        title: 'Generate a short caption block',
        code: `Input: 1 paragraph, 1 sentence, ~8 words\nOutput: "Lorem ipsum dolor sit amet consectetur adipiscing elit."`,
        note: 'Useful for testing a tight caption space rather than a full paragraph block.',
      },
    ],
  },

  'slug-health-checker': {
    description: `Generating one clean URL slug from a title is the easy part; the harder problem shows up later, once a site has hundreds of pages and some of those slugs quietly overlap, run too long, or end up looking similar enough to each other that search engines start treating separate pages as duplicate or competing content. This tool checks a list of slugs for exactly those issues: near-duplicate paths that might be splitting search ranking between two pages that should really be one, slugs padded with dates or stop words that add length without adding meaning, and structure that doesn't match how the rest of the site organizes its URLs. Paste in a site's slug list and get back which ones need attention before a search engine decides two of your own pages are competing against each other.`,
    examples: [
      {
        title: 'Find near-duplicate slugs splitting search ranking',
        code: `Input: /blog/best-running-shoes-2026, /blog/best-running-shoes-2026-guide\nResult: near-duplicate detected, may compete for the same search terms`,
        note: "Flags slugs similar enough to cannibalize each other's ranking instead of ranking as one strong page.",
      },
      {
        title: 'Flag a slug padded with unnecessary words',
        code: `Input: /blog/the-ultimate-and-complete-guide-to-widgets-in-2026\nResult: flagged, excessive stop words and length, suggested: /blog/widget-guide-2026`,
        note: 'Shortens a bloated slug down to its actual meaningful keywords.',
      },
    ],
  },

  edit: {
    description: `A PDF is usually the last stop for a document, exported once from whatever created it and then treated as final, which becomes a real problem the moment a typo turns up or a date needs updating and nobody has the original Word file or design source anymore. This tool edits a PDF directly: click into a block of text and retype it, swap an image for a different one, move an element to a new spot on the page, all without needing to regenerate the file from source. It's built for the small, specific fixes that come up after a document already exists as a PDF: correcting a misspelled name on a certificate, updating a price on a flyer, replacing a logo that changed after the document was already finalized and sent out.`,
    examples: [
      {
        title: 'Fix a misspelled name on a certificate',
        code: `Input: certificate.pdf (name reads "Jonh Smith")\nOutput: certificate-fixed.pdf (name corrected to "John Smith")`,
        note: 'Edits the text directly in the PDF without needing the original design file.',
      },
      {
        title: 'Update a price on a flyer',
        code: `Input: flyer.pdf ("$49" listed price)\nOutput: flyer-updated.pdf ("$59" listed price)`,
        note: 'Useful when the source file used to create the flyer is no longer available.',
      },
    ],
  },

  'backlink-analyzer': {
    description: `A site's own content only tells half the SEO story; the other half is which other sites link to it and how much weight those links actually carry. This tool pulls the backlink profile for any URL, showing which domains link to it, how many separate links exist, and an estimated authority score for the linking domains themselves, since a single link from an established, well-linked site typically counts for more than a dozen links from thin, low-authority pages. Run it against your own domain to see where existing links are coming from and spot any that look spammy or low quality, or run it against a competitor's URL to see which sites link to them that might also be worth reaching out to for a link of your own.`,
    examples: [
      {
        title: "Check where your own site's links are coming from",
        code: `Input: yoursite.com\nOutput: 340 referring domains, top domain authority: 68 (industry-blog.com)`,
        note: 'Helps spot spammy or low-quality links worth disavowing.',
      },
      {
        title: 'See who links to a competitor',
        code: `Input: competitor.com\nOutput: 512 referring domains, notable: news-site.com (authority: 81)`,
        note: 'Surfaces sites that might be worth reaching out to for a link to your own site as well.',
      },
    ],
  },

  'image-metadata-viewer': {
    description: `Before deciding whether a photo's metadata needs stripping, it helps to actually see what's in there first, and that's the specific job this tool does: read a JPEG, PNG, or WebP file and display every EXIF, IPTC, and XMP field it can find, camera settings, GPS coordinates if present, caption and keyword fields, edit history from Lightroom or Photoshop, without changing or removing a single one. Photographers use it to check the exact aperture, shutter speed, and ISO a shot was taken at when trying to recreate a look later. Anyone handling a photo from an unknown source can use it to see exactly what information is riding along inside the file before deciding whether it's safe to share as-is or needs cleaning up first. Nothing gets modified here; this is purely for looking, not editing.`,
    examples: [
      {
        title: 'Check the exact camera settings behind a shot',
        code: `Input: sunset-shot.jpg\nOutput: Aperture: f/2.8, Shutter: 1/500s, ISO: 100, Lens: 24-70mm`,
        note: 'Useful for recreating a specific look in a later shoot.',
      },
      {
        title: 'Inspect a file before deciding whether to share it',
        code: `Input: received-photo.jpg\nOutput: GPS: 37.7749, -122.4194 | Camera: iPhone 15 Pro | Edited: Lightroom 6.3`,
        note: "Shows exactly what's inside before deciding whether the file needs cleaning up first.",
      },
    ],
  },

  'aac-to-m4r': {
    description: `An iPhone won't accept just any audio file as a ringtone; it specifically wants the M4R format, and it also enforces a maximum length, so a full song saved as AAC needs both a format change and, usually, a trim before it'll show up as a ringtone option at all. This tool converts an AAC file into M4R, the container iPhone's ringtone settings actually recognize, and lets you select which section of the audio becomes the tone rather than converting the entire file and hoping it fits. Pick the chorus of a song, a specific line from a voice clip, or any short segment, convert it, and sync it over as an actual ringtone option instead of just another audio file sitting unused in a music library.`,
    examples: [
      {
        title: "Turn a song's chorus into an iPhone ringtone",
        code: `Input: song.aac, trim: 1:02-1:32 (30 seconds)\nOutput: ringtone.m4r`,
        note: 'iPhone ringtones are capped at 30-40 seconds, so trimming happens before conversion.',
      },
      {
        title: 'Convert a voice clip into a custom ringtone',
        code: `Input: voice-clip.aac (0:00-0:05)\nOutput: ringtone.m4r`,
        note: 'A short clip converts cleanly without needing to trim much off the original.',
      },
    ],
  },

  'bin-hex-dec-converter': {
    description: `Binary, hex, and decimal all describe the exact same number, just written for different audiences: decimal is how people normally think about numbers, hex is how memory addresses and color codes usually get written because it's more compact, and binary is what actually shows up when you need to see individual bits, like a permissions flag or a bitmask. This tool converts a value between all three instantly, so a hex memory address from a debugger, a binary permission flag from a systems task, or a plain decimal number from anywhere else all translate into whichever form is actually needed for reading or comparison. Useful for checking what a hex color code looks like in binary, converting a decimal byte value into hex to match documentation, or working out exactly which bits are set in a flag without doing the math by hand.`,
    examples: [
      {
        title: 'Check a hex color code in binary',
        code: `Input: #FF6B35\nOutput binary: 11111111 01101011 00110101`,
        note: 'Shows exactly which bits are set in each color channel.',
      },
      {
        title: 'Convert a decimal byte value for documentation',
        code: `Input: 202 (decimal)\nOutput: CA (hex) | 11001010 (binary)`,
        note: 'Matches a value found in code to the hex notation used in a spec or datasheet.',
      },
    ],
  },

  'text-reverser': {
    description: `Reversing text isn't just one operation; flipping the letters in a word, reversing the order of words in a sentence, and reversing the order of lines in a list are three genuinely different transformations that happen to share the same name. This tool handles all three separately: character reversal turns "hello" into "olleh," word reversal turns "the quick fox" into "fox quick the" while keeping each word spelled normally, and line reversal flips the order of a multi-line list from bottom to top without touching the text within each line. Useful for building a palindrome check, creating a simple text puzzle, or reversing a chronological list, like a changelog or a set of dates, that got pasted in the wrong order and needs flipping instead of manually retyped.`,
    examples: [
      {
        title: 'Reverse individual characters',
        code: `Input: "hello world"\nOutput: "dlrow olleh"`,
        note: 'Useful for building or checking a palindrome.',
      },
      {
        title: 'Reverse the order of lines in a pasted list',
        code: `Input:\n2024-01-01\n2024-06-15\n2024-12-31\nOutput:\n2024-12-31\n2024-06-15\n2024-01-01`,
        note: 'Flips a chronological list that was pasted in the wrong order without retyping it.',
      },
    ],
  },
};

export default FIX_BATCH_7;
