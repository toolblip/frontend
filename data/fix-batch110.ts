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

const FIX_BATCH_110: Record<string, FixBatchEntry> = {
  'seo-meta-tag-analyzer': {
    description: `A meta description that's present, valid length, and technically well-formed can still read as generic and forgettable, the kind of description that fills the space without actually giving anyone a reason to click, which is a different problem from a tag being missing or broken entirely, the kind of gap a simple presence check would already catch. This tool analyzes existing SEO meta tags, Open Graph tags, and Twitter Card tags together and generates optimization suggestions, evaluating whether a tag that's technically present is actually working rather than just confirming it exists. Useful for getting a stronger, more specific rewrite suggestion for a meta description that's present but reads generic, checking whether an existing title tag is actually compelling rather than just correctly formatted, or getting concrete optimization suggestions across a page's full set of SEO and social tags at once rather than a simple pass or fail.`,
    examples: [
      {
        title: 'Get a rewrite suggestion for a generic description',
        code: `Input: "Learn more about our products and services."\nOutput: suggestion: "See how [Product] cuts setup time from hours to minutes."`,
        note: 'Flags a technically valid tag that still reads forgettable.',
      },
      {
        title: 'Get optimization suggestions across a full tag set',
        code: `Input: [page URL]\nOutput: title: compelling | meta description: too generic | og:image: missing`,
        note: 'Evaluates quality, not just presence, across the whole set.',
      },
    ],
  },

  'serp-rank-tracker': {
    description: `Checking where a page ranks for a keyword right now answers a snapshot question, but the more useful signal for an ongoing SEO effort is the trend, whether a position has been climbing, sliding, or holding steady across weeks, a pattern a single point-in-time check can't reveal no matter how many times it gets rerun manually. This tool tracks keyword rankings in Google search results and monitors position changes over time, built around watching a trend across an ongoing campaign rather than confirming a single position at a single moment. Useful for catching a gradual ranking decline across several target keywords before it becomes a serious traffic drop, confirming a recent SEO change actually moved rankings upward over the following weeks, or monitoring an entire keyword set's position history at once instead of checking each one manually and separately.`,
    examples: [
      {
        title: 'Catch a gradual ranking decline early',
        code: `Input: keyword: "budget travel tips", tracked weekly\nOutput: position 4 -> 6 -> 9 -> 14 over 4 weeks`,
        note: 'Reveals a trend a single snapshot check would miss.',
      },
      {
        title: 'Confirm an SEO change moved rankings',
        code: `Input: keyword set: 12 target terms, before/after a content update\nOutput: 8 of 12 improved over the following 3 weeks`,
        note: 'Monitors a whole keyword set over time, not one lookup.',
      },
    ],
  },

  'serp-snippet-preview': {
    description: `Google doesn't display a page's raw URL in a search result, it reformats it into a shortened, breadcrumb-style path, a site name followed by a chevron-separated trail of the actual folder structure, which looks meaningfully different from the literal URL string typed into a browser's address bar and is easy to overlook when focused only on whether a title or a description fits. This tool previews how a webpage looks as an actual Google search result, showing the title, the reformatted breadcrumb URL, and the description together the way they'd genuinely render rather than the raw address. Useful for checking how a page's URL structure actually displays as a breadcrumb trail in real search results, previewing a full search snippet's appearance before a page goes live, or confirming a page's folder structure translates into a clean, readable breadcrumb rather than an awkward one.`,
    examples: [
      {
        title: 'Preview how a URL displays as a breadcrumb',
        code: `Input: https://example.com/blog/category/2026/seo-tips\nOutput: example.com > Blog > Category > SEO Tips`,
        note: 'Shows the reformatted path, not the raw URL string.',
      },
      {
        title: 'Preview a full snippet before publishing',
        code: `Input: title, meta description, URL\nOutput: rendered exactly as a real Google search result would show it`,
        note: 'Combines all three elements as they actually render together.',
      },
    ],
  },

  'sha256-hash-generator': {
    description: `MD5 and SHA-1 both have known collision vulnerabilities that got them phased out of anything that actually matters for integrity verification, which is exactly why SHA-256 became the algorithm most current software distributions actually use for posting a checksum alongside a download, the specific standard a verification actually needs to match against today. This tool generates a SHA-256 hash from text or a file with one-click copy, producing the exact algorithm most modern file integrity checks are actually built around rather than an older, deprecated one. Useful for verifying a downloaded installer's checksum against what a vendor posted using the algorithm they most likely used, generating a SHA-256 hash to confirm a file wasn't corrupted or tampered with in transit, or producing a hash in the specific format a modern security tool or API actually expects.`,
    examples: [
      {
        title: "Verify a downloaded installer's checksum",
        code: `Input: installer.exe\nOutput: SHA-256: a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146`,
        note: 'Matches the algorithm most vendors post checksums with today.',
      },
      {
        title: "Confirm a file wasn't corrupted in transit",
        code: `Input: dataset.zip\nOutput: SHA-256 hash matches the one published alongside the download`,
        note: 'Uses the modern standard, not a deprecated algorithm.',
      },
    ],
  },

  sharpen: {
    description: `Sharpening can't recover detail a photo genuinely never captured, out-of-focus blur has actually lost information that isn't hiding somewhere waiting to be restored, what sharpening actually does is increase contrast right at existing edges so a boundary that's already there reads as more defined, which genuinely helps a slightly soft shot but has a real ceiling past which it just produces visible haloing instead of real detail. This tool sharpens blurry photos by enhancing detail and improving clarity, working within that actual mechanism rather than promising to restore something the image never had to begin with. Useful for cleaning up a slightly soft photo where the subject is basically in focus but lacking crispness, enhancing edge definition on a scanned image that lost some sharpness in the process, or improving a photo's perceived clarity without expecting it to fix a genuinely, badly out-of-focus shot.`,
    examples: [
      {
        title: 'Clean up a slightly soft photo',
        code: `Input: portrait.jpg (mostly in focus, slightly soft)\nOutput: portrait-sharpened.jpg (edges more defined)`,
        note: 'Enhances existing edge contrast rather than restoring lost data.',
      },
      {
        title: 'Enhance a scanned document',
        code: `Input: scanned-page.jpg\nOutput: scanned-page-sharpened.jpg`,
        note: 'Improves perceived clarity within a real technical ceiling.',
      },
    ],
  },

  sign: {
    description: `A signed document isn't a secret, anyone can still read every word of it, the signature exists to assert who reviewed and approved it rather than to hide anything, a completely different concern from encrypting a file to keep its contents confidential. This tool adds a signature to a PDF document by drawing, typing, or uploading one, covering an authentic handwritten look on a touchscreen, a fast styled signature when handwriting isn't practical, or reusing an existing signature image consistently across many documents. Useful for signing a contract by hand on a touchscreen or trackpad for an authentic look, adding a quick typed signature to a document when a full handwritten one isn't practical, or uploading the same signature image once to apply consistently across a batch of documents that all need it.`,
    examples: [
      {
        title: 'Sign a contract by hand on a touchscreen',
        code: `Input: contract.pdf, signature: drawn\nOutput: contract-signed.pdf`,
        note: 'Asserts approval, does not encrypt or hide the content.',
      },
      {
        title: 'Apply a saved signature across many documents',
        code: `Input: signature-image.png, apply to: 12 documents\nOutput: 12 documents signed consistently`,
        note: 'Reuses one signature image rather than redrawing each time.',
      },
    ],
  },

  'sitemap-analyzer': {
    description: `A sitemap that lists every URL correctly but is missing pages that actually exist on the site is incomplete in a way a per-URL metadata check wouldn't catch, and a sitemap bloated with duplicate, redirected, or low-value URLs wastes a search engine's limited crawl budget on a large site, two coverage-and-efficiency problems distinct from whether the priority or lastmod fields attached to each listed URL carry real signal. This tool analyzes an XML sitemap for URL coverage, missing entries, and crawl budget optimization, evaluating the sitemap's overall completeness and efficiency rather than the metadata quality of URLs already listed. Useful for finding pages that exist on a site but are missing from its sitemap entirely, identifying low-value or redirected URLs bloating a large sitemap's crawl budget, or auditing whether a sitemap's actual coverage matches what a site genuinely contains.`,
    examples: [
      {
        title: "Find pages missing from a sitemap",
        code: `Input: sitemap.xml + site crawl\nOutput: 14 live pages found on the site, not listed in the sitemap`,
        note: 'Checks coverage completeness, not per-URL metadata quality.',
      },
      {
        title: "Identify crawl budget waste",
        code: `Input: sitemap.xml (8,200 URLs)\nOutput: 1,100 URLs are redirected or return 404, wasting crawl budget`,
        note: 'Flags low-value entries bloating a large sitemap.',
      },
    ],
  },

  'sitemap-extractor': {
    description: `Sometimes the actual need isn't an analysis of a sitemap's quality or coverage at all, it's simply the raw list of URLs pulled out cleanly and fast, ready to drop into a spreadsheet or feed into a separate audit tool that does the actual analysis afterward. This tool extracts every URL from a sitemap.xml file instantly, producing a clean content inventory rather than an assessment of coverage gaps or metadata quality. Useful for pulling a complete URL list out of a large sitemap to feed into a separate SEO audit tool, building a quick content inventory of everything a site's sitemap currently lists, or extracting URLs in bulk from a sitemap without needing any analysis of the sitemap itself layered on top.`,
    examples: [
      {
        title: 'Pull a URL list for a separate audit tool',
        code: `Input: sitemap.xml\nOutput: [3,400 URLs, one per line, ready to export]`,
        note: 'A raw list, no coverage or quality analysis attached.',
      },
      {
        title: 'Build a quick content inventory',
        code: `Input: https://example.com/sitemap.xml\nOutput: CSV of every URL currently listed`,
        note: 'Extracts fast for use somewhere else, not for analysis here.',
      },
    ],
  },

  'speech-to-text': {
    description: `Uploading a pre-recorded audio file for transcription is one workflow, but dictating directly into a microphone and watching the text appear as the words are actually spoken is a different one entirely, suited to drafting a note hands-free, capturing a thought while multitasking, or typing by voice when typing itself isn't practical in the moment. This tool transcribes speech to text using a browser's microphone with real-time output, built around live dictation as it happens rather than processing an audio file uploaded afterward. Useful for drafting a quick note hands-free while doing something else at the same time, dictating text directly instead of typing it when typing isn't practical, or capturing spoken thoughts as text in the moment rather than recording first and transcribing later.`,
    examples: [
      {
        title: 'Draft a note hands-free',
        code: `Action: speak into microphone\nOutput: text appears live as words are spoken`,
        note: 'Live dictation, not a file uploaded for later processing.',
      },
      {
        title: 'Capture a thought without typing',
        code: `Input: [spoken sentence via microphone]\nOutput: transcribed text appears in real time`,
        note: 'Useful when typing is impractical in the moment.',
      },
    ],
  },

  split: {
    description: `Merging combines several files into one, but split runs the operation the other direction, taking a single large document and pulling out just the pages that are actually relevant, one chapter from a textbook PDF, one invoice from a batch-scanned stack, one exhibit from a longer contract, without sending the entire original file to someone who only needs that specific piece. This tool splits a PDF into separate pages or page ranges, extracting a section cleanly rather than combining multiple files into a single one. Useful for pulling one chapter out of a larger PDF to share on its own, extracting a single invoice from a stack that was scanned together as one file, or breaking a long document into separate page ranges that can each be shared or filed independently.`,
    examples: [
      {
        title: 'Pull one chapter out of a larger PDF',
        code: `Input: textbook.pdf, pages: 45-62\nOutput: chapter-3.pdf`,
        note: 'Extracts a section rather than combining files into one.',
      },
      {
        title: 'Extract one invoice from a scanned batch',
        code: `Input: batch-scan.pdf (24 pages), page: 7\nOutput: invoice-007.pdf`,
        note: 'Shares only the relevant piece, not the entire original file.',
      },
    ],
  },
};

export default FIX_BATCH_110;
