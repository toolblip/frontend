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

const FIX_BATCH_21: Record<string, FixBatchEntry> = {
  'semver-checker': {
    description: `Comparing version numbers as plain strings gets the wrong answer surprisingly often: 1.9.0 looks alphabetically greater than 1.10.0 because "9" sorts after "1", even though 1.10.0 is actually the newer release, and a pre-release tag like 1.0.0-beta needs to count as older than the plain 1.0.0 release despite the version numbers themselves being identical. This tool compares two version strings according to the actual semantic versioning rules rather than treating them as plain text, correctly ranking the numeric segments and handling pre-release and build metadata suffixes the way the spec actually defines. Useful for a release script deciding which of two versions is newer, checking whether a dependency's version satisfies a minimum requirement, or settling a question about whether a given version string is even valid semver in the first place.`,
    examples: [
      {
        title: 'Correctly rank versions a string comparison gets wrong',
        code: `Input: 1.9.0, 1.10.0\nOutput: 1.10.0 is greater`,
        note: 'A plain string comparison would incorrectly rank 1.9.0 higher because "9" sorts after "1".',
      },
      {
        title: 'Compare a pre-release against its full release',
        code: `Input: 2.0.0-beta, 2.0.0\nOutput: 2.0.0 is greater`,
        note: 'A pre-release tag ranks lower than the same version without one, per the semver spec.',
      },
    ],
  },

  'word-cloud-generator': {
    description: `A table of word frequencies is precise but takes a moment to actually read; a word cloud sacrifices some of that precision for something scannable in a couple of seconds, common words rendered larger, rare ones smaller, so the dominant themes in a piece of text jump out visually before anyone reads a single number. This tool builds that cloud from any text, with the overall shape and color scheme both adjustable, so the result fits a presentation slide or a report rather than looking like a generic default. Useful for a quick visual summary of what a survey's open-text responses are actually about, a presentation slide showing the recurring themes in a body of feedback, or a fast, glanceable check on what a long document is really focused on before reading it in full.`,
    examples: [
      {
        title: 'Summarize survey feedback visually',
        code: `Input: [200 open-text survey responses]\nOutput: word cloud with "shipping" and "support" rendered largest`,
        note: 'Surfaces the dominant themes at a glance without reading every response.',
      },
      {
        title: 'Build a cloud shaped for a presentation slide',
        code: `Input: [conference talk transcript], shape: circle, colors: blue-to-purple\nOutput: circular word cloud image`,
        note: 'Fits a specific shape and color scheme instead of a generic default layout.',
      },
    ],
  },

  watermark: {
    description: `A PDF heading out for review, a draft that shouldn't be mistaken for the final version, a confidential document that needs a visible reminder of its status on every page, all need something stamped across the document itself rather than just a filename or a cover email saying so, since a cover email doesn't travel with the file once it's forwarded or printed. This tool adds a text watermark, DRAFT, CONFIDENTIAL, a company name, or an image watermark like a logo, across every page of a PDF, with opacity and positioning adjustable so it's visible without making the underlying content unreadable. Useful for marking a document as a draft before it's finalized, stamping a confidentiality notice onto a document being shared externally, or branding a report with a logo before distribution.`,
    examples: [
      {
        title: 'Mark a document as a draft',
        code: `Input: proposal.pdf, watermark: "DRAFT", opacity: 30%\nOutput: proposal-draft.pdf (watermark on every page)`,
        note: 'Travels with the file itself, unlike a note in a cover email.',
      },
      {
        title: 'Add a confidentiality stamp before external sharing',
        code: `Input: report.pdf, watermark: "CONFIDENTIAL"\nOutput: report-marked.pdf`,
        note: 'Keeps the underlying content readable while making the status visible on every page.',
      },
    ],
  },

  'remove-duplicate-lines': {
    description: `A list built up over time, pasted together from multiple sources, exported more than once, or edited by several people, tends to accumulate duplicate entries somewhere along the way, and finding them by scanning line by line works fine for ten lines and becomes hopeless past a few hundred. This tool removes duplicate lines from any list or block of text in one pass, with a case-sensitive option for when "Item" and "item" should count as different entries rather than the same one, and a sort option for when the result should come back organized rather than just deduplicated in its original order. Useful for cleaning up an email list built from several exports, deduplicating a list of tags or keywords pulled from multiple sources, or tidying a list before it gets imported somewhere that would choke on repeated entries.`,
    examples: [
      {
        title: 'Deduplicate a list built from multiple exports',
        code: `Input:\njane@example.com\njohn@example.com\njane@example.com\nOutput:\njane@example.com\njohn@example.com`,
        note: 'Removes the repeated entry while keeping the first occurrence.',
      },
      {
        title: 'Deduplicate with case sensitivity on',
        code: `Input: "Item", "item", "ITEM"\nCase-sensitive: on\nOutput: "Item", "item", "ITEM" (all kept, treated as distinct)`,
        note: 'Case-sensitive mode treats differently-cased entries as separate rather than merging them.',
      },
    ],
  },

  'html-entity-encoder': {
    description: `An HTML entity can be written three completely different ways for the exact same character: a named entity like &amp;, a decimal reference like &#38;, or a hexadecimal reference like &#x26;, and depending on which system is generating or consuming a piece of HTML, one of those three might be expected while another gets rejected or displayed incorrectly. This tool converts between all three formats in either direction, encoding a character into whichever entity style is needed or decoding an entity back into the actual character it represents. Useful for converting a decimal-encoded entity from an old CMS export into the more readable named format, generating a hex entity for a system that specifically expects that style, or decoding a string full of entity codes back into plain, readable text.`,
    examples: [
      {
        title: 'Convert a decimal entity to its named form',
        code: `Input: &#38;\nOutput: &amp;`,
        note: 'Useful when an old CMS export uses decimal codes instead of the more readable named entities.',
      },
      {
        title: 'Decode a string full of entity codes',
        code: `Input: Caf&#233; &amp; Bistro\nOutput: Café & Bistro`,
        note: 'Converts both decimal and named entities back into the actual characters they represent.',
      },
    ],
  },

  'word-counter': {
    description: `A word count alone doesn't tell the whole story of whether a piece of writing fits where it's going: a tweet has a hard character limit, a meta description has a practical display limit, an essay assignment specifies a word count, and a blog post has a rough target for a decent read time, each one measured differently. This tool counts words, characters, sentences, and paragraphs all at once, plus an estimated reading time based on average reading speed, so a single paste covers whichever of those numbers actually matters for wherever the text is headed. Useful for checking a caption fits a platform's character limit, confirming an assignment meets a required word count, or estimating how long a blog post will actually take a reader to get through before publishing it.`,
    examples: [
      {
        title: 'Check a caption against a platform limit',
        code: `Input: [280-character draft tweet]\nOutput: 280 characters, 0 remaining`,
        note: 'Confirms a caption fits exactly within a hard platform limit.',
      },
      {
        title: "Estimate a blog post's reading time",
        code: `Input: [1,400-word draft]\nOutput: 1,400 words, ~7 minute read`,
        note: 'Gives a reading time estimate alongside the raw word count.',
      },
    ],
  },

  'mp4-to-webm': {
    description: `MP4 is what a phone or a camera produces by default, and it plays everywhere, but it's not actually the format most modern browsers and web video players are optimized around when serving video directly from a website. WebM, built around the VP8, VP9, or AV1 codecs instead of MP4's typical H.264, tends to compress web video more efficiently and was designed specifically for HTML5 video playback without the licensing baggage that trailed H.264 for years. This tool converts an MP4 file into WebM, better suited for a self-hosted video player on a site that cares about load time and bandwidth. Useful for a site serving its own video rather than embedding from YouTube or Vimeo, where switching to WebM can meaningfully cut file size and improve playback performance.`,
    examples: [
      {
        title: 'Optimize a self-hosted video for web playback',
        code: `Input: demo.mp4 (18 MB)\nOutput: demo.webm (11 MB, similar visual quality)`,
        note: "WebM's codecs typically compress web video more efficiently than MP4's H.264.",
      },
      {
        title: 'Convert a background video for a website hero section',
        code: `Input: hero-loop.mp4\nOutput: hero-loop.webm`,
        note: 'Suited for a site serving its own video rather than embedding from YouTube or Vimeo.',
      },
    ],
  },

  'markdown-editor': {
    description: `Writing in Markdown and seeing a live preview update as you type is the easy part most editors already handle; the harder gap is getting the finished result out in whatever format the destination actually needs, a CMS that only accepts HTML, a document that needs to go out as a PDF, an email or a document editor that would otherwise show raw asterisks and pound signs if Markdown syntax got pasted in directly. This tool writes and previews Markdown in real time, then exports the result as clean HTML, a formatted PDF, or rich, already-rendered text ready to paste directly into an email or document editor instead of raw syntax. Useful for drafting a blog post in Markdown and exporting HTML for a CMS, generating a shareable PDF from notes, or pasting formatted text into an email without asterisks and pound signs showing up literally.`,
    examples: [
      {
        title: 'Export a drafted post as HTML for a CMS',
        code: `Input: # My Post\\n\\nSome **bold** text.\nOutput: <h1>My Post</h1>\\n<p>Some <strong>bold</strong> text.</p>`,
        note: "Produces ready-to-paste HTML for a CMS that doesn't accept raw Markdown.",
      },
      {
        title: 'Copy formatted text into an email',
        code: `Input: # Meeting Notes\\n\\n- Action item one\nOutput: rich text pasted with real heading and bullet formatting, no visible # or - characters`,
        note: 'Avoids pasting raw Markdown syntax into an editor that renders plain text.',
      },
    ],
  },

  'og-tag-debugger': {
    description: `A missing or malformed Open Graph tag doesn't throw an error anywhere visible, the page loads completely normally, right up until someone shares the link and the preview card comes back blank, showing the wrong image, or pulling in a title from somewhere unexpected on the page. This tool checks a URL's actual Open Graph and Twitter Card meta tags directly, flagging a missing og:image, a title tag that's empty or duplicated, or an image reference that returns a broken link, rather than waiting to notice the problem only after a broken preview has already been shared somewhere. Useful for validating a new page's social tags before it goes live, debugging a specific report of a bad-looking share preview, or auditing an entire site's pages for social tags that were set up inconsistently.`,
    examples: [
      {
        title: 'Catch a missing og:image before sharing',
        code: `Input: https://example.com/blog/new-post\nResult: og:title present, og:image missing`,
        note: 'Explains why a shared link would show a blank preview image.',
      },
      {
        title: "Audit a site's pages for inconsistent tags",
        code: `Input: 12 blog URLs\nResult: 9 have complete Open Graph tags, 3 are missing og:description`,
        note: 'Surfaces pages set up inconsistently across a site rather than checking one at a time.',
      },
    ],
  },

  'tweet-to-image-converter': {
    description: `A tweet embedded live on a page depends on Twitter's own script loading correctly and the original tweet still existing, neither of which is guaranteed months or years later, which is exactly the gap this tool closes: convert a tweet into a static image styled to look like the actual tweet card, complete with the handle, the text, and a chosen background theme, rather than relying on a live embed that could break or disappear. Paste in a tweet's URL, or type custom text styled the same way, choose a background and theme, and download a shareable PNG. Useful for quoting a tweet inside a blog post without depending on Twitter's embed script staying available, archiving a tweet that might get deleted later, or creating a tweet-styled graphic from custom text for a social post.`,
    examples: [
      {
        title: 'Convert a tweet URL into a shareable image',
        code: `Input: https://twitter.com/user/status/123456\nOutput: tweet-image.png (styled tweet card, theme: dark)`,
        note: "Doesn't depend on Twitter's embed script staying available later.",
      },
      {
        title: 'Create a tweet-styled graphic from custom text',
        code: `Input: custom text: "Ship it.", handle: "@yourhandle"\nOutput: tweet-image.png (light theme)`,
        note: 'Builds the same visual style without needing an actual existing tweet.',
      },
    ],
  },
};

export default FIX_BATCH_21;
