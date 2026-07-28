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

const FIX_BATCH_70: Record<string, FixBatchEntry> = {
  'image-metadata-remover': {
    description: `Submitting a photo to an anonymous contest or a blind portfolio review only stays anonymous if the file itself doesn't quietly give away who took it, and a photographer's name embedded in IPTC data or a camera's serial number tucked into EXIF metadata can break that anonymity just as easily as a visible signature would. This tool removes EXIF and metadata from images before they're shared, stripping out identifying details that aren't visible in the picture itself but are still very much present in the file. Useful for submitting a photo to an anonymous contest or review without identifying metadata giving away who took it, protecting privacy before sharing a personal photo publicly, or cleaning a batch of images before uploading them somewhere identifying details genuinely shouldn't travel along with the picture.`,
    examples: [
      {
        title: 'Strip identifying metadata before an anonymous submission',
        code: `Input: contest-entry.jpg (contains photographer name in IPTC, camera serial in EXIF)\nOutput: contest-entry-clean.jpg (no identifying metadata)`,
        note: 'Removes details that could break an anonymity requirement.',
      },
      {
        title: 'Clean a batch before a public upload',
        code: `Input: [15 photos]\nOutput: 15 photos with EXIF and metadata stripped`,
        note: 'Removes hidden details before sharing images publicly.',
      },
    ],
  },

  'random-pin-generator': {
    description: `A door lock, an alarm system, or a two-factor code field usually accepts digits only, no letters, no symbols, which makes a general password generator's mixed-character output the wrong tool entirely when what's actually needed is a purely numeric code of a specific length. This tool generates a random numeric PIN of any length, producing secure codes, OTPs, and access keys built from digits alone rather than the broader character set a password generator would include. Useful for generating a numeric PIN for a door lock or an alarm system that only accepts digits, creating a test OTP code for a development environment without needing an actual SMS service, or generating a random access code of a specific digit length for a physical security system.`,
    examples: [
      {
        title: 'Generate a 6-digit PIN',
        code: `Output: 483927`,
        note: 'Produces a purely numeric code for a lock or an alarm system.',
      },
      {
        title: 'Generate a test OTP code',
        code: `Input: length: 4\nOutput: 7052`,
        note: 'Creates a numeric code for testing without an actual SMS service.',
      },
    ],
  },

  'remove-watermark': {
    description: `A personal photo that picked up a watermark from an old editing app, or a photographer's own image still carrying a proof watermark from before it was purchased, both need that overlay cleaned off for private, personal use, a genuinely different situation from stripping a watermark off someone else's licensed stock image without permission. This tool removes a watermark from an image, cleaning up a photo for personal use rather than for redistributing content that isn't actually yours to use freely. Useful for cleaning an old watermark left over from a photo-editing app off a personal picture, removing your own watermark from an image you want to reuse without the branding, or clearing a stray overlay off a personal photo strictly for private use.`,
    examples: [
      {
        title: 'Clean an old watermark off a personal photo',
        code: `Input: photo-with-watermark.jpg\nOutput: photo-clean.jpg`,
        note: 'Removes an overlay left over from an old editing app for personal use.',
      },
      {
        title: 'Remove your own watermark for reuse',
        code: `Input: my-photo-branded.jpg\nOutput: my-photo.jpg`,
        note: 'Clears your own branding off an image you want to reuse without it.',
      },
    ],
  },

  'summarize-podcast': {
    description: `A ninety-minute podcast episode holds maybe ten minutes of information actually worth remembering, and deciding whether a specific episode is even worth the full listen usually takes almost as long as skimming it would if the content were in text instead of audio. This tool transcribes a podcast episode and summarizes it automatically, surfacing the key insights without requiring the full episode listened to start to finish. Useful for getting the main takeaways from a long episode without dedicating the full runtime to it, deciding whether a specific episode is actually worth listening to in full based on a quick summary first, or catching up on an episode's key points while multitasking instead of giving it undivided listening time.`,
    examples: [
      {
        title: "Get an episode's key takeaways",
        code: `Input: episode-112.mp3 (78 minutes)\nOutput: "The episode covers three main points: remote hiring trends, async communication tools, and a case study on distributed team retention."`,
        note: 'Surfaces the main points without requiring the full episode listened to.',
      },
      {
        title: 'Decide if an episode is worth listening to',
        code: `Input: episode-89.mp3\nOutput: summary: mostly sponsor content and a short interview segment on pricing strategy`,
        note: 'Gives enough context to decide whether the full episode is worth the time.',
      },
    ],
  },

  'paragraph-lorem-ipsum': {
    description: `A body-text block in a mockup usually needs to hold roughly a specific amount of content, not a single sentence and not an unpredictably long wall of text, which means the actual control that matters is over word count and sentence count together rather than picking between one sentence or an entire uncontrolled block. This tool generates paragraphs of lorem ipsum placeholder text with a custom word and sentence count, sizing the output to match a layout's actual paragraph space rather than guessing at how much text fills it. Useful for filling a body-text block in a mockup with a paragraph sized to match the space it's meant to hold, generating a specific sentence count to test how a layout handles a paragraph of that length, or producing a controlled word count of lorem ipsum for a design that needs a predictable amount of text.`,
    examples: [
      {
        title: 'Generate a paragraph by word count',
        code: `Input: word count: 75\nOutput: "Lorem ipsum dolor sit amet, consectetur adipiscing elit..." (75 words)`,
        note: 'Sizes the paragraph to match a specific layout space.',
      },
      {
        title: 'Generate a paragraph by sentence count',
        code: `Input: sentence count: 4\nOutput: four sentences of classic lorem ipsum text`,
        note: 'Controls length by sentence count instead of an unpredictable full block.',
      },
    ],
  },

  'slug-health-checker': {
    description: `A URL slug stuffed with keywords, separated by underscores instead of hyphens, or padded with an unnecessary date and a string of stop words works technically but reads as exactly the kind of structure that hurts both readability and search performance, sometimes without anyone noticing until an SEO audit actually flags it. This tool checks a URL slug's health for duplicate content issues and SEO-friendly structure, catching a poorly formed slug pattern before it becomes a habit repeated across an entire site. Useful for auditing an existing site's slugs for SEO best practices like hyphen usage and unnecessary length, catching a new page's slug that risks duplicating another page's existing pattern, or confirming a slug follows a site's established SEO-friendly structure before a page gets published.`,
    examples: [
      {
        title: 'Flag a poorly structured slug',
        code: `Input: /blog/2019_10_15_the_best_tips_for_beginners_who_want_to_learn\nOutput: issues: underscores instead of hyphens, unnecessary date, excessive length`,
        note: 'Catches formatting issues that hurt both readability and SEO.',
      },
      {
        title: 'Check for a duplicate slug pattern',
        code: `Input: /products/blue-widget\nOutput: warning - similar to existing slug /products/blue-widgets`,
        note: 'Flags a slug pattern that risks overlapping with an existing page.',
      },
    ],
  },

  edit: {
    description: `Discovering a typo in an already-finalized PDF, or needing to swap out an outdated logo baked directly into an exported document, doesn't have to mean going back to the original source file and re-exporting everything from scratch, when the actual text and images inside that PDF can just be changed directly. This tool edits text and images in a PDF file, changing content that's already there directly in the browser rather than only adding a new layer on top of it. Useful for fixing a typo discovered in a contract or a report that's already been exported to PDF, replacing an outdated image or a logo directly within an existing document, or making a small correction to a finalized PDF without needing to track down and re-export the original source file.`,
    examples: [
      {
        title: 'Fix a typo in a finalized PDF',
        code: `Input: contract.pdf, find: "recieve", replace: "receive"\nOutput: contract-corrected.pdf`,
        note: 'Changes existing text directly instead of overlaying a correction.',
      },
      {
        title: 'Replace an outdated logo',
        code: `Input: report.pdf, replace image on page 1 with new-logo.png\nOutput: report-updated.pdf`,
        note: 'Swaps an existing image within the document itself.',
      },
    ],
  },

  'backlink-analyzer': {
    description: `Knowing the overall shape of a site's backlink profile, roughly how many domains link to it, how authoritative those domains tend to be, which ones contribute the most, is a different question than checking any single link's individual attributes, closer to a high-level snapshot than a link-by-link audit. This tool analyzes a URL's overall backlink profile and shows domain authority estimates, giving a broad picture of where a site's link equity is actually coming from rather than inspecting one link at a time. Useful for getting a quick competitive snapshot of a rival's overall backlink strength before planning an SEO campaign, checking how a site's link profile has grown in authority over time, or getting a high-level read on where the bulk of a domain's backlinks are actually concentrated.`,
    examples: [
      {
        title: "Get a competitor's backlink snapshot",
        code: `Input: competitor.com\nOutput: 1,840 backlinks from 312 domains, average domain authority: 58`,
        note: 'Gives a high-level view of overall link strength rather than one link at a time.',
      },
      {
        title: 'See top referring domains',
        code: `Input: example.com\nOutput: top referring domains: industry-blog.com (DA 72), news-site.com (DA 65)`,
        note: "Shows where the bulk of a domain's link equity actually comes from.",
      },
    ],
  },

  'aac-to-m4r': {
    description: `An iPhone won't let an AAC or even a regular M4A file be set as a ringtone directly, no matter how good the audio actually sounds, since iOS specifically looks for the M4R file extension to recognize a sound as a ringtone rather than just another song sitting in a music library. This tool converts AAC audio into M4R format, producing the exact file type iPhone's Settings app will actually offer as a ringtone choice rather than one it quietly ignores. Useful for turning a favorite song clip into an actual selectable iPhone ringtone, converting a short sound effect into the ringtone format iOS specifically requires, or preparing an AAC audio clip so it shows up as a ringtone option instead of just another audio file.`,
    examples: [
      {
        title: 'Create an iPhone ringtone from a song clip',
        code: `Input: favorite-song-clip.aac\nOutput: favorite-song-clip.m4r`,
        note: 'Produces the exact extension iOS requires to offer it as a ringtone.',
      },
      {
        title: 'Convert a sound effect for ringtone use',
        code: `Input: notification-sound.aac\nOutput: notification-sound.m4r`,
        note: 'Makes a short clip selectable in the iPhone ringtone settings.',
      },
    ],
  },

  'bin-hex-dec-converter': {
    description: `Octal comes up almost exclusively in Unix file permissions, which makes it dead weight for the conversions that actually happen constantly in everyday programming, a hex color value, a memory address, a binary flag, all of which only ever need binary, hexadecimal, and decimal, never a fourth base that rarely applies to the task at hand. This tool converts between binary, hexadecimal, and decimal instantly, focused specifically on the three bases that come up in daily coding work rather than including a fourth one that mostly just adds clutter. Useful for converting a hex color value into decimal RGB components without an unnecessary octal field in the way, checking a binary flag's decimal equivalent during a quick debugging session, or converting a memory address between hex and decimal for the bases that actually matter day to day.`,
    examples: [
      {
        title: 'Convert a hex color to decimal RGB',
        code: `Input: #FF5733\nOutput: R: 255, G: 87, B: 51`,
        note: 'Focuses on the three bases relevant to everyday color work.',
      },
      {
        title: "Check a binary flag's decimal value",
        code: `Input: 1010\nOutput: decimal: 10, hex: A`,
        note: 'Covers binary, hex, and decimal without an unnecessary octal field.',
      },
    ],
  },
};

export default FIX_BATCH_70;
