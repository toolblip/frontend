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

const FIX_BATCH_71: Record<string, FixBatchEntry> = {
  'text-reverser': {
    description: `Reversing every character in a string, flipping the order of words while each word stays intact, and reversing the order of lines in a list are three genuinely different operations that just happen to share the word reverse, and mixing them up produces a completely different result than whichever one was actually intended. This tool reverses text at any of those three levels, characters, words, or lines, with the result ready to copy in one click. Useful for reversing a string entirely backwards for a simple visual effect or a puzzle, reversing the order of words in a sentence while keeping each word spelled correctly, or flipping the order of lines in a list to read the most recent entry first instead of last.`,
    examples: [
      {
        title: 'Reverse every character',
        code: `Input: "Hello World"\nOutput: "dlroW olleH"`,
        note: 'Flips the entire string character by character.',
      },
      {
        title: 'Reverse word order, keep words intact',
        code: `Input: "The quick brown fox"\nOutput: "fox brown quick The"`,
        note: 'Reorders the words without scrambling any word itself.',
      },
    ],
  },

  'html-to-plain-text-tool': {
    description: `An email's HTML body or a scraped web page carries formatting that a plain-text context, a text-to-speech reader, a plain-text email fallback, a system that can't render any markup at all, simply has no use for, and stripping tags down to bare readable words is a different, more thorough job than converting that same markup into markdown's own syntax. This tool strips HTML tags from any content and extracts clean, readable plain text, removing formatting entirely rather than translating it into another markup format. Useful for extracting a web page's actual readable content for a plain-text-only context, preparing an HTML email's body as a plain-text fallback version, or pulling bare text out of scraped HTML for a system that can't handle any markup syntax at all, not even markdown.`,
    examples: [
      {
        title: 'Strip an HTML email body to plain text',
        code: `Input: <p>Hi <b>Jane</b>, your order <a href="#">#4521</a> has shipped.</p>\nOutput: "Hi Jane, your order #4521 has shipped."`,
        note: 'Removes all markup, leaving only the readable words.',
      },
      {
        title: 'Extract text from a scraped web page',
        code: `Input: <div><h1>Article Title</h1><p>First paragraph.</p></div>\nOutput: "Article Title\\nFirst paragraph."`,
        note: 'Produces bare text with no markup syntax of any kind.',
      },
    ],
  },

  'text-permutation-generator': {
    description: `Every possible order a handful of words or characters could be arranged in is a purely combinatorial question, one that has nothing to do with whether any particular arrangement actually forms a real word or a sensible sentence, which makes it a fundamentally different kind of output than a dictionary-filtered result would be. This tool generates all possible permutations or arrangements of words and characters in text, enumerating every combinatorial possibility rather than filtering for ones that happen to mean something. Useful for generating every possible word order of a short phrase to test how a layout or a script handles each variation, producing every character arrangement for a testing or a QA scenario that needs full combinatorial coverage, or exploring the complete set of rearrangements for a set of words or characters regardless of whether any given one actually makes sense.`,
    examples: [
      {
        title: 'Generate every word order of a phrase',
        code: `Input: "red blue green"\nOutput: "red blue green", "red green blue", "blue red green", "blue green red", "green red blue", "green blue red"`,
        note: 'Lists all six possible orderings regardless of which ones read naturally.',
      },
      {
        title: 'Generate every arrangement of characters',
        code: `Input: "abc"\nOutput: abc, acb, bac, bca, cab, cba`,
        note: 'Covers full combinatorial arrangements for a testing scenario.',
      },
    ],
  },

  'anagram-generator': {
    description: `Rearranging the letters in "listen" happens to spell "silent" and "enlist," both real words hiding inside the same set of letters, and finding every one of those valid words is a genuinely different task than just scrambling the letters into some random, meaningless order for a puzzle. This tool generates all possible anagrams from any word or phrase with one click, filtering specifically for real, valid words hidden within the same letters rather than an arbitrary scrambled arrangement. Useful for finding every real word that can be formed from a specific set of letters for a word game, discovering a hidden anagram inside a name or a phrase for a fun reveal, or checking whether a given word actually has any valid anagrams at all before building a puzzle around it.`,
    examples: [
      {
        title: 'Find real words hidden in a set of letters',
        code: `Input: "listen"\nOutput: silent, enlist, inlets, tinsel`,
        note: 'Filters for actual valid words rather than a random scramble.',
      },
      {
        title: 'Discover an anagram inside a name',
        code: `Input: "clint eastwood"\nOutput: "old west action"`,
        note: 'Reveals a real-word anagram hidden within a longer phrase.',
      },
    ],
  },

  grayscale: {
    description: `A photo converted straight to black and white isn't always the actual goal, sometimes a partially desaturated, muted look reads better than the full classic monochrome effect, which is exactly why the conversion needs an adjustable intensity dial rather than a single all-or-nothing switch. This tool converts an image to black and white with a classic monochrome effect and an adjustable intensity level, allowing the conversion to land anywhere between full color and complete grayscale. Useful for creating a fully classic black-and-white look for an artistic photo edit, checking how a color photo's contrast will actually look once printed in black and white on a newspaper or a monochrome printer, or applying a partial desaturation for a subtler, muted stylistic effect instead of going fully grayscale.`,
    examples: [
      {
        title: 'Apply a full classic monochrome effect',
        code: `Input: color-photo.jpg, intensity: 100%\nOutput: photo-bw.jpg (full black and white)`,
        note: 'Produces the classic fully desaturated look.',
      },
      {
        title: 'Apply a partial desaturation',
        code: `Input: color-photo.jpg, intensity: 40%\nOutput: photo-muted.jpg (partially desaturated)`,
        note: 'Creates a subtler, muted effect instead of going fully gray.',
      },
    ],
  },

  'image-resizer': {
    description: `Resizing an entire folder of product photos to the same exact dimensions one image at a time is slow and prone to one photo quietly ending up a different size than the rest, which matters the moment a store listing or a thumbnail grid needs every image to actually match. This tool resizes images to standard dimensions for social media, thumbnails, and OG images, batch-resizing several at once with the aspect ratio locked so nothing ends up stretched, all without uploading a single file to a server. Useful for batch-resizing an entire folder of product photos to a consistent size for an online store listing, resizing a set of images for a thumbnail grid where every image needs to match exactly, or resizing several images locally in the browser without uploading anything anywhere.`,
    examples: [
      {
        title: 'Batch resize a folder of product photos',
        code: `Input: [24 product photos], target size: 1000x1000, lock aspect ratio\nOutput: 24 photos resized consistently to 1000x1000`,
        note: 'Resizes an entire batch to match instead of one at a time.',
      },
      {
        title: 'Resize locally without uploading',
        code: `Input: banner.jpg, target size: 1200x630 (OG image)\nOutput: banner-resized.jpg`,
        note: 'Processes the image entirely in the browser.',
      },
    ],
  },

  'user-agent-parser': {
    description: `A raw User-Agent string is a dense, cryptic line of text a browser sends identifying itself, and figuring out which actual browser, version, operating system, and device type it represents by reading it directly is genuinely difficult without something to parse it apart first. This tool parses a User-Agent string and identifies the browser, OS, and device it actually represents instantly, breaking the dense string down into readable, individual components. Useful for confirming exactly which browser and version rendered a page incorrectly before debugging further, analyzing server log entries to understand which browsers and devices are actually visiting a site, or decoding an unfamiliar or suspicious User-Agent string found while reviewing a security log.`,
    examples: [
      {
        title: 'Parse a User-Agent string',
        code: `Input: Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15\nOutput: browser: Safari, OS: iOS 17.0, device: iPhone`,
        note: 'Breaks a dense string into readable components.',
      },
      {
        title: "Analyze a log entry's visitor",
        code: `Input: [User-Agent from a server log]\nOutput: browser: Chrome 124, OS: Windows 11, device: Desktop`,
        note: 'Identifies exactly which browser and device generated a request.',
      },
    ],
  },

  'add-images': {
    description: `A document template that never included a company logo, a report that needs a supporting chart or a diagram, or a listing that needs several property photos embedded directly inside it all need actual image files placed into the PDF itself, positioned and sized correctly, rather than a signature or a short line of overlay text. This tool adds one or more images to a PDF file, with position and size both easily adjustable for each one placed. Useful for inserting a company logo into a document template that didn't originally include one, adding a supporting chart or a diagram image into a report that needs a visual alongside its text, or embedding several photos directly into a PDF, like property photos in a real estate listing document.`,
    examples: [
      {
        title: 'Insert a logo into a document template',
        code: `Input: template.pdf, image: company-logo.png, position: top-left, page: 1\nOutput: template-with-logo.pdf`,
        note: 'Places an image directly into a document that never had one.',
      },
      {
        title: 'Add property photos to a listing',
        code: `Input: listing.pdf, images: exterior.jpg, kitchen.jpg, backyard.jpg\nOutput: listing-with-photos.pdf`,
        note: 'Embeds several photos directly into the PDF itself.',
      },
    ],
  },

  'sleep-duration-calculator': {
    description: `Waking up in the middle of a roughly ninety-minute sleep cycle tends to feel groggier than waking up right at the boundary between two cycles, even with the exact same total hours slept, which makes the actual number of completed cycles just as relevant as the raw duration between bedtime and wake-up time. This tool calculates how long you slept between two times and shows how many full sleep cycles were actually completed, giving both numbers together rather than only the total duration. Useful for checking whether a planned wake-up time lines up with a full number of sleep cycles instead of cutting one off mid-cycle, figuring out what time to go to bed to wake up with a whole number of cycles completed, or simply tracking how many hours were actually slept between two logged times.`,
    examples: [
      {
        title: 'Check completed sleep cycles',
        code: `Input: bedtime: 11:00 PM, wake time: 6:30 AM\nOutput: 7h 30m slept, 5 full sleep cycles completed`,
        note: 'Shows whether the wake time lines up with a full cycle.',
      },
      {
        title: 'Find a bedtime for a target wake-up',
        code: `Input: wake time: 7:00 AM, target: 6 full cycles\nOutput: recommended bedtime: 10:00 PM`,
        note: 'Works backward from a wake-up time to a cycle-aligned bedtime.',
      },
    ],
  },

  'listicle-writer': {
    description: `A "10 tips for" or a "7 ways to" style post reads differently than flowing prose, built around a scannable, numbered structure that lets a reader skim straight to whichever point actually interests them, which is exactly the format that tends to perform well precisely because of how easy it is to skim. This tool generates a list-style article in that specific numbered, skimmable format, structuring the actual content around individual points rather than continuous paragraphs. Useful for quickly drafting a "10 tips for" style blog post structured around individual numbered points, generating a listicle on a specific topic that calls for a scannable format rather than flowing prose, or creating list-based social media content built to perform well because of its easy-to-skim structure.`,
    examples: [
      {
        title: 'Draft a "10 tips" style post',
        code: `Input: topic: "saving money on groceries"\nOutput: "10 Tips for Saving Money on Groceries" with 10 numbered points`,
        note: 'Structures the content around scannable numbered points.',
      },
      {
        title: 'Generate a listicle for social media',
        code: `Input: topic: "morning routine habits", count: 7\nOutput: "7 Morning Habits That Actually Stick" with 7 short bulleted points`,
        note: 'Produces a skimmable format suited to social content.',
      },
    ],
  },
};

export default FIX_BATCH_71;
