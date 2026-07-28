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

const FIX_BATCH_83: Record<string, FixBatchEntry> = {
  'semver-checker': {
    description: `Comparing 1.9.0 against 1.10.0 as if they were decimal numbers gets the wrong answer, since .9 reads as larger than .10 when treated that way, but semantic versioning actually treats each dot-separated segment as its own integer, meaning 10 is genuinely greater than 9 in that position, and a pre-release tag like 1.0.0-alpha adds another layer of comparison rules a naive string or decimal check would miss entirely. This tool compares two semantic version strings using actual semver comparison rules, correctly ordering minor and patch numbers as integers rather than decimal fragments, and validating whether either string is even a properly formatted version to begin with. Useful for checking whether a dependency update actually represents a newer version before upgrading, sorting a list of release tags into their true chronological order, or catching an invalid version string before it causes a broken comparison somewhere downstream.`,
    examples: [
      {
        title: 'Compare minor versions as integers, not decimals',
        code: `Input: 1.9.0, 1.10.0\nOutput: 1.10.0 is greater (10 > 9 as an integer, not a decimal fragment)`,
        note: 'Avoids the decimal-comparison mistake that ranks 1.9.0 above 1.10.0.',
      },
      {
        title: 'Validate a pre-release version',
        code: `Input: 1.0.0-alpha, 1.0.0\nOutput: 1.0.0 is greater (a pre-release precedes its final release)`,
        note: 'Applies the specific pre-release comparison rule semver defines.',
      },
    ],
  },

  'word-cloud-generator': {
    description: `A frequency table communicates precisely how often each word appears, useful for analysis, but it's a poor way to convey an impression at a glance, while a word cloud trades that precision for immediate visual impact, sizing each word by how often it shows up so the most prominent words are literally the biggest thing on the page rather than a row buried in a list. This tool turns any text into a visual word cloud, with word size mapped to frequency and a customizable shape and color scheme. Useful for creating a visual summary for a presentation slide or a report cover rather than a precise data table, generating a classroom activity that shows students which words dominate a piece of text at a glance, or turning a large body of text into a shareable graphic rather than a spreadsheet of numbers.`,
    examples: [
      {
        title: 'Create a visual summary for a presentation',
        code: `Input: [conference talk transcript]\nOutput: word cloud with "growth", "customers", "retention" rendered largest`,
        note: 'Prioritizes visual impact over precise frequency numbers.',
      },
      {
        title: 'Shape a cloud for a report cover',
        code: `Input: [annual report text], shape: circle, colors: brand palette\nOutput: circular word cloud image`,
        note: 'Turns text into a shareable graphic rather than a data table.',
      },
    ],
  },

  watermark: {
    description: `A contract draft or a confidential report often needs to be marked clearly across every single page before it goes anywhere outside a small group, not just the first page, since a recipient screenshotting or forwarding just one page should still see it's a draft, not a final version, and applying that consistently across a hundred-page document by hand isn't realistic. This tool adds a text or image watermark across every page of a PDF at once, whether that's a diagonal "DRAFT" stamp, a company logo, or a "CONFIDENTIAL" marking, without disrupting the document's existing selectable text. Useful for stamping "CONFIDENTIAL" across an entire document before sharing it externally, marking every page of a draft contract so an out-of-context screenshot still reads as unfinished, or branding a document with a logo watermark before distributing it publicly.`,
    examples: [
      {
        title: 'Stamp DRAFT across every page',
        code: `Input: contract.pdf (42 pages), watermark: "DRAFT", diagonal, 30% opacity\nOutput: contract-draft.pdf (every page stamped)`,
        note: 'Applies consistently across all pages, not just the first.',
      },
      {
        title: 'Brand a document with a logo watermark',
        code: `Input: proposal.pdf, watermark: company-logo.png\nOutput: proposal-watermarked.pdf`,
        note: "Keeps the document's existing text selectable underneath the watermark.",
      },
    ],
  },

  'remove-duplicate-lines': {
    description: `Whether "Apple" and "apple" count as the same entry or two different ones depends entirely on the data, a list of email addresses probably should treat them as identical, while a list of exact product codes probably shouldn't, and a duplicate-line tool that can't make that distinction either strips lines it shouldn't or keeps ones it should have merged. This tool removes duplicate lines from text with an explicit case-sensitivity toggle and an optional sort, rather than assuming one fixed behavior for every kind of list. Useful for deduplicating a list of email addresses where case shouldn't matter, keeping "Apple" and "apple" as separate entries when case genuinely does matter for the data, or removing duplicates and sorting the result alphabetically in the same pass instead of two separate steps.`,
    examples: [
      {
        title: 'Deduplicate case-insensitively',
        code: `Input: Apple, apple, Banana\nOutput (case-insensitive): Apple, Banana`,
        note: "Treats different capitalizations as the same entry when that's appropriate.",
      },
      {
        title: 'Deduplicate and sort in one pass',
        code: `Input: banana, apple, apple, cherry\nOutput (sorted): apple, banana, cherry`,
        note: 'Combines deduplication and alphabetical sorting in a single step.',
      },
    ],
  },

  'html-entity-encoder': {
    description: `An ampersand can be represented in HTML three genuinely different but equivalent ways, the named entity &amp;, the decimal reference &#38;, or the hexadecimal reference &#x26;, and while a modern browser accepts all three interchangeably, an older parser, a strict XML context, or a system generating markup programmatically often expects one specific format and will choke on or mangle the others. This tool encodes and decodes HTML entities across all three formats, named, decimal, and hexadecimal, converting between them rather than only handling the most common named form. Useful for converting a named entity into its numeric equivalent for a context that doesn't recognize named references, decoding a hexadecimal entity back into its actual character, or generating markup in whichever entity format a specific downstream system actually expects.`,
    examples: [
      {
        title: 'Convert a named entity to its numeric form',
        code: `Input: &amp;\nOutput: &#38; (decimal) / &#x26; (hexadecimal)`,
        note: 'Produces the numeric equivalents for a context that expects one.',
      },
      {
        title: 'Decode a hexadecimal entity',
        code: `Input: &#x2764;\nOutput: ❤`,
        note: 'Resolves a hex reference back into its actual character.',
      },
    ],
  },

  'word-counter': {
    description: `Before deciding whether a piece of writing needs a precise character-limit check, a readability score, or a platform-specific limit indicator, the first question is usually just the basic one, how long is this thing, how many words, characters, sentences, and paragraphs, and roughly how long it takes to read, answered all at once rather than picking a specialized tool first. This tool counts words, characters, sentences, and paragraphs together and estimates reading time, built as the quick everyday check rather than a specialized metric for one particular use case. Useful for getting an immediate word and character count while drafting a blog post, checking a document's paragraph count before submitting it somewhere with a length requirement, or getting a rough reading-time estimate for social media or web copy without reaching for a more specialized tool first.`,
    examples: [
      {
        title: 'Get every basic count at once',
        code: `Input: [blog post draft]\nOutput: 842 words, 4,920 characters, 38 sentences, 12 paragraphs, ~4 min read`,
        note: 'Answers the basic length question without picking a specialized tool first.',
      },
      {
        title: 'Check a paragraph count before submitting',
        code: `Input: [essay draft]\nOutput: 6 paragraphs`,
        note: 'Useful for meeting a structural requirement stated in paragraphs.',
      },
    ],
  },

  'mp4-to-webm': {
    description: `MP4 plays reliably on nearly every device and piece of software that exists, which is exactly why it's rarely the format worth converting away from unless a specific destination benefits from something else, and a web page is exactly that case, WebM's VP8 and VP9 codecs are open, royalty-free, and typically compress noticeably smaller than MP4's H.264 at comparable quality when the destination is specifically a browser's native video tag. This tool converts MP4 into WebM, trading a small amount of MP4's broader device compatibility for meaningfully smaller file sizes purpose-built for web playback. Useful for shrinking a video file specifically for faster page load times on a website, converting a video for HTML5 playback without a proprietary codec dependency, or preparing a smaller web-optimized version of a video that already plays everywhere as MP4.`,
    examples: [
      {
        title: 'Shrink a video for faster page loads',
        code: `Input: hero-video.mp4 (18 MB)\nOutput: hero-video.webm (11 MB, comparable quality)`,
        note: 'Reduces file size specifically for web delivery.',
      },
      {
        title: 'Prepare a video for HTML5 playback',
        code: `Input: demo.mp4\nOutput: demo.webm`,
        note: "Targets the browser's native video tag without a proprietary codec dependency.",
      },
    ],
  },

  'markdown-editor': {
    description: `Markdown is meant to read as plain text and also render into properly formatted output, but the gap between those two things is easy to fall into without noticing, a missing blank line before a list, indentation that's a space off, and the syntax looks fine sitting in a plain text editor right up until it renders as a single unbroken paragraph instead of a list. This tool shows Markdown source and its rendered preview side by side in real time, and exports the result to HTML, PDF, or formatted text ready to paste elsewhere. Useful for catching a markdown syntax mistake the moment it breaks rendering rather than after publishing, writing documentation that needs to become both a webpage and a shareable PDF from the same source, or drafting formatted content that needs to be copied into a rich text editor as properly styled text.`,
    examples: [
      {
        title: 'Catch a broken list before publishing',
        code: `Input:\n- item one\n- item two (missing blank line above)\nPreview: renders as a single paragraph instead of a list`,
        note: 'Shows the rendering mistake immediately in the live preview.',
      },
      {
        title: 'Export the same source to HTML and PDF',
        code: `Input: [markdown document]\nOutput: document.html, document.pdf`,
        note: 'Produces multiple output formats from one markdown source.',
      },
    ],
  },

  'og-tag-debugger': {
    description: `When a shared link isn't previewing correctly anywhere, on Facebook, on Twitter, in a Slack unfurl, the actual problem could be a missing Open Graph tag, a malformed Twitter Card tag, or both at once, and checking one platform's preview at a time doesn't reveal which underlying tag is actually broken or absent. This tool validates both Open Graph and Twitter Card meta tags for a URL together, flagging exactly which tags are missing or malformed rather than only showing how a link happens to render on one specific platform. Useful for diagnosing why a link isn't generating a preview on any platform at all, confirming both tag systems are present and correctly formatted after a site redesign, or catching a malformed og:image tag that's silently breaking previews everywhere it's shared.`,
    examples: [
      {
        title: "Diagnose why a link isn't previewing anywhere",
        code: `Input: https://example.com/article\nOutput: og:image missing, twitter:card missing`,
        note: 'Identifies which tag system is actually broken or absent.',
      },
      {
        title: 'Catch a malformed image tag',
        code: `Input: <meta property="og:image" content="/logo.png">\nOutput: warning - relative URL, should be an absolute URL`,
        note: 'Flags a formatting mistake that silently breaks previews.',
      },
    ],
  },

  'tweet-to-image-converter': {
    description: `A tweet can't actually be embedded as a live post on Instagram, a slide deck, or a printed flyer, but a graphic styled to look exactly like an authentic tweet, matching the platform's actual layout, font, and handle styling, carries the same recognizable visual credibility a generic quote card never quite manages. This tool turns any tweet URL or custom text into a styled image that reads as an actual tweet screenshot, with a chosen theme and background, rather than a plain text-on-image graphic. Useful for repurposing a tweet's content as a shareable image on a platform where tweets can't be embedded live, creating a tweet-styled graphic for a joke or an announcement that borrows Twitter's recognizable visual format, or generating a clean, on-brand tweet screenshot without the surrounding clutter of an actual browser window.`,
    examples: [
      {
        title: 'Repurpose a tweet for Instagram',
        code: `Input: https://twitter.com/user/status/123456\nOutput: styled tweet-card image, 1080x1080`,
        note: "Preserves the tweet's recognizable visual format for a platform that can't embed it live.",
      },
      {
        title: 'Create a tweet-styled graphic from custom text',
        code: `Input: "Ship it.", handle: "@founder", theme: dark\nOutput: tweet-styled PNG image`,
        note: 'Borrows the tweet layout for text that was never actually posted.',
      },
    ],
  },
};

export default FIX_BATCH_83;
