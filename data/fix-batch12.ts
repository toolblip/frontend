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

const FIX_BATCH_12: Record<string, FixBatchEntry> = {
  'jpg-to-svg': {
    description: `Tracing a JPEG into SVG works best on the specific kind of image a JPEG usually isn't: flat colors and clean edges, like a logo, an icon, or a scanned line drawing, rather than a detailed photograph full of gradients and compression artifacts. This tool converts a JPEG into vector paths by tracing shapes based on color boundaries, which turns a small, blocky logo photographed off a business card or scanned from an old print into a scalable SVG that stays crisp at any size instead of getting blurry when enlarged. Feed it a genuinely photographic image with lots of fine detail and the result looks more like an abstract painting than a faithful trace, since JPEG compression already introduces noise that vector tracing has no way to distinguish from real edges. Best suited to simple source images with a small number of distinct colors and clear boundaries.`,
    examples: [
      {
        title: 'Vectorize a logo photographed from a business card',
        code: `Input: card-logo.jpg (simple 2-color logo, photographed)\nOutput: card-logo.svg (clean vector paths, scales without blurring)`,
        note: 'Works well because the source has flat colors and clear edges rather than photographic detail.',
      },
      {
        title: 'See why a detailed photo traces poorly',
        code: `Input: family-photo.jpg (full color photograph)\nOutput: family-photo.svg (thousands of small shapes, looks abstract rather than photorealistic)`,
        note: 'JPEG compression noise gets traced as if it were real detail, producing a messy result.',
      },
    ],
  },

  'text-diff': {
    description: `Comparing two versions of a document by reading them side by side and hoping to spot every change is slow and unreliable the moment either one runs more than a paragraph, since a single word swapped in the middle of a long sentence is easy to miss just by eye. This tool compares two blocks of text directly and highlights exactly what changed, additions in one color, deletions in another, unchanged lines left alone, so the actual differences are visible immediately instead of buried in two walls of near-identical text. Useful for checking what an editor actually changed in a returned manuscript, confirming a contract's revised version only touched the clauses it was supposed to, or verifying two configuration files differ in exactly the way intended and nowhere else.`,
    examples: [
      {
        title: 'Check what an editor changed in a manuscript',
        code: `Input A: "The team met on Monday to review the budget."\nInput B: "The team met on Tuesday to review the annual budget."\nOutput: "Monday" removed, "Tuesday" added, "annual" added`,
        note: 'Highlights the exact word-level changes instead of requiring a line-by-line manual comparison.',
      },
      {
        title: 'Verify two config files differ only where expected',
        code: `Input A: timeout=30\\nretries=3\nInput B: timeout=60\\nretries=3\nOutput: only the "timeout" line flagged as changed`,
        note: 'Confirms nothing else in the file changed unexpectedly.',
      },
    ],
  },

  'mkv-to-avi': {
    description: `An MKV file plays fine on a modern computer but often draws a blank on the kind of hardware that's been around for over a decade, an older smart TV's built-in media player, a car's USB port, ancient media software that was never updated to handle newer container formats. AVI is the format that hardware from that era was actually built to expect, which is exactly why converting to it, despite being older and less efficient than MKV, solves a compatibility problem newer formats can't. This tool converts an MKV file into AVI, re-encoding the video and audio into a container that even genuinely old players will recognize without complaint. Useful for getting a downloaded or ripped MKV file playing on an older TV, a legacy media player, or any device where the newer container format simply isn't recognized.`,
    examples: [
      {
        title: 'Play a ripped file on an older smart TV',
        code: `Input: movie.mkv\nOutput: movie.avi (plays on the TV's built-in media player)`,
        note: 'Older TV media players often support AVI but not MKV.',
      },
      {
        title: "Get a video working in a car's USB media player",
        code: `Input: roadtrip-video.mkv\nOutput: roadtrip-video.avi`,
        note: 'Many car infotainment systems only recognize a narrow set of older formats like AVI.',
      },
    ],
  },

  'regex-match-tester': {
    description: `Testing whether a pattern matches something is only half the job when the actual goal is search-and-replace; the other half is confirming the replacement itself produces the output expected, backreferences and all, before running it against real data. This tool tests both together: enter a pattern and sample text to see matches highlighted live, then add a replacement string using backreferences like $1 or $2 to see exactly what the text looks like after the substitution runs, not just whether a match was found. That catches a specific class of mistake a plain match tester misses entirely, a replacement pattern that matches correctly but rearranges captured groups in the wrong order, or drops a group that should have been kept. Useful for verifying a find-and-replace regex before it runs against a real file or database column.`,
    examples: [
      {
        title: 'Test a find-and-replace before running it on real data',
        code: `Pattern: (\\d{4})-(\\d{2})-(\\d{2})\nReplacement: $2/$3/$1\nInput: "2026-07-27"\nOutput: "07/27/2026"`,
        note: 'Confirms the backreferences reorder the captured groups correctly before it runs against a real file.',
      },
      {
        title: 'Catch a replacement that drops a captured group',
        code: `Pattern: (\\w+)\\s(\\w+)\nReplacement: $1\nInput: "John Smith"\nOutput: "John"`,
        note: 'Reveals that the replacement silently discards the second name unless $2 is added.',
      },
    ],
  },

  'text-statistics-advanced': {
    description: `Word count and reading grade level cover the basics, but lexicon density measures something different: the ratio of distinct, meaningful words to the total word count, a proxy for how varied a piece of writing's vocabulary actually is rather than how long or complex its sentences are. A text with high lexicon density uses a wide range of specific words with little repetition; one with low density leans on the same handful of common words and connectors over and over, which can read as either simple and clear or thin and repetitive depending on the context. This tool calculates that ratio alongside syllables per word and an overall reading level, giving a fuller picture than sentence length alone. Useful for checking whether an article's vocabulary feels genuinely varied or is quietly repeating the same words disguised across different sentences.`,
    examples: [
      {
        title: "Check an article's vocabulary variety",
        code: `Input: [800-word article]\nOutput: lexicon density: 0.42 | syllables/word: 1.6 | reading level: Grade 8`,
        note: 'A lower density signals heavier reliance on a small set of repeated common words.',
      },
      {
        title: 'Compare two drafts with the same word count',
        code: `Draft A: lexicon density 0.38\nDraft B: lexicon density 0.51`,
        note: 'Draft B uses a noticeably wider range of distinct words for the same overall length.',
      },
    ],
  },

  'robots-txt-checker': {
    description: `A robots.txt file with one misplaced slash can accidentally block search engines from an entire site instead of the one folder it was meant to hide, and that kind of mistake is easy to make and surprisingly hard to notice just by reading the file, since the syntax looks fine even when the actual rule is wrong. This tool checks an existing robots.txt for exactly those problems: a Disallow rule broader than intended, directives that conflict with each other, or a path blocked that probably shouldn't be, like accidentally disallowing an uploads folder search engines need to index product images. Paste in a live robots.txt file, or point it at a URL, and get back which directives actually apply and which paths end up blocked once every rule is accounted for together. Useful for catching a robots.txt mistake before it quietly hurts a site's search visibility.`,
    examples: [
      {
        title: 'Catch a rule that blocks the entire site by accident',
        code: `Input: User-agent: *\\nDisallow: /\nResult: flagged, blocks all crawlers from the entire site`,
        note: 'A single stray slash here disallows everything rather than one intended folder.',
      },
      {
        title: 'Find a path blocked that search engines need',
        code: `Input: Disallow: /wp-content/\nResult: flagged, blocks /wp-content/uploads/, which search engines need to index product images`,
        note: 'A broad rule can unintentionally block a subfolder that should stay crawlable.',
      },
    ],
  },

  'htaccess-redirect-generator': {
    description: `Apache's .htaccess redirect syntax is unforgiving: a mod_rewrite rule with an unescaped period in a domain name, or a redirect written in the wrong order relative to other rules in the file, can silently create a loop that takes an entire site offline instead of just fixing the one URL it was meant to handle. This tool builds the actual rule text for common redirect needs, forcing HTTPS, adding or removing a www prefix, redirecting one specific old URL to a new one, without requiring memorization of mod_rewrite's regex quirks or escaping rules. Getting the redirect type right matters too: a permanent 301 redirect passes along the SEO value a page already earned, while a temporary 302 doesn't, so picking the wrong one on a permanent move quietly costs search ranking that took time to build. Copy the generated rule directly into a site's .htaccess file.`,
    examples: [
      {
        title: 'Force HTTPS on every request',
        code: `RewriteEngine On\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]`,
        note: 'Uses a 301 permanent redirect so search engines carry over the existing page ranking.',
      },
      {
        title: 'Redirect one old URL to a new page',
        code: `Redirect 301 /old-page.html /new-page`,
        note: 'A single explicit rule for one specific moved page rather than a broad pattern-based rewrite.',
      },
    ],
  },

  'word-combinations': {
    description: `Brainstorming a business name, a product name, or a domain often comes down to pairing words from two separate lists and seeing what clicks, an adjective list crossed with a noun list, or a location word crossed with an industry term, which is tedious to do by hand once each list has more than a handful of entries. This tool generates every two-word and three-word combination across a set of input words automatically, so a list like swift, blue, peak combined with labs, works, hub produces every pairing, Swift Labs, Blue Works, Peak Hub, and every other combination, instead of writing each one out by hand. Useful for generating a batch of name ideas to check against domain availability, brainstorming tagline fragments, or exploring word pairings that wouldn't have come to mind one at a time.`,
    examples: [
      {
        title: 'Generate business name ideas from two word lists',
        code: `Input: adjectives: swift, blue, peak\nnouns: labs, works, hub\nOutput: Swift Labs, Swift Works, Swift Hub, Blue Labs, Blue Works, Blue Hub, Peak Labs, Peak Works, Peak Hub`,
        note: 'Produces every pairing automatically instead of writing each combination by hand.',
      },
      {
        title: 'Build three-word tagline fragments',
        code: `Input: fast, simple, reliable + tools, results, workflow\nOutput: "fast simple tools", "fast reliable results", "simple reliable workflow"`,
        note: 'Extends the same combination logic to three words instead of two.',
      },
    ],
  },

  'image-to-svg': {
    description: `Tracing a raster image into a vector isn't a single fixed operation; the amount of detail preserved and the number of distinct colors used in the result both make a real difference in how the final SVG looks and how large the file ends up being. This tool traces any raster image, PNG, JPG, or similar, into scalable vector paths with both of those settings adjustable: more detail captures finer edges and small features at the cost of a larger, more complex file, while a reduced color count simplifies a photo-like image into flatter, more illustration-style shapes. That control matters for getting a usable result out of source images that vary widely in complexity, a simple two-color logo needs almost no adjustment, while a busier illustration needs the detail and color settings tuned to avoid an overly complicated or overly flattened trace.`,
    examples: [
      {
        title: 'Trace a simple icon with minimal settings',
        code: `Input: icon.png, detail: low, colors: 2\nOutput: icon.svg (clean, minimal path count)`,
        note: 'A simple two-color source needs very little detail to trace accurately.',
      },
      {
        title: 'Trace a busier illustration with higher detail',
        code: `Input: illustration.png, detail: high, colors: 12\nOutput: illustration.svg (more paths, closer to the original shading)`,
        note: 'Higher detail and color count capture more of the original shading at the cost of a larger file.',
      },
    ],
  },

  'landing-page-copy': {
    description: `A landing page isn't trying to inform or entertain the way a blog post does, every piece of copy on it works toward one specific action, a signup, a purchase, a demo request, which means the writing follows a different structure entirely: a headline built to stop someone scrolling, a subheadline that states the core benefit in concrete terms, body copy that answers the objection a visitor is silently having, and a call-to-action button that says exactly what happens next rather than a vague "submit." This tool generates that full set together, headline, subheadline, supporting body text, and CTA button copy, built around one product or offer and one specific action a visitor should take. Useful for drafting a new landing page fast, or generating a few headline variations to test against each other before picking one.`,
    examples: [
      {
        title: 'Generate a full landing page copy set',
        code: `Input: product: "invoicing app for freelancers", action: "start free trial"\nOutput: headline + subheadline + 3 body paragraphs + CTA button text`,
        note: 'Builds every section toward the same single action instead of a general product description.',
      },
      {
        title: 'Test multiple headline variations',
        code: `Input: product: "invoicing app for freelancers"\nOutput: 3 headline variants: "Get Paid Faster, Without the Spreadsheet", "Invoicing That Takes Five Minutes, Not Fifty", "Stop Chasing Clients for Payment"`,
        note: 'Generates alternatives to test against each other rather than committing to a single headline.',
      },
    ],
  },
};

export default FIX_BATCH_12;
