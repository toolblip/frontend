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

const FIX_BATCH_45: Record<string, FixBatchEntry> = {
  'meme-maker': {
    description: `A meme reads as a meme because of a recognizable visual convention, bold white text with a black outline, usually in Impact font, positioned at the top and bottom of an image rather than tucked wherever there happens to be space, a format so specific that the same joke in a different font or placed in the middle just reads as a captioned photo instead of an actual meme. This tool builds on that convention directly: pick a popular template or upload an original image, add top and bottom text styled the way memes are expected to look, and export instantly. Useful for making a meme from a recognizable template without formatting the text and font manually, captioning a personal photo in the format people actually recognize as a meme, or quickly producing something shareable without opening a full editor just to add two lines of text.`,
    examples: [
      {
        title: 'Caption a popular template',
        code: `Input: template: "distracted boyfriend", top text: "Me", bottom text: "New side project"\nOutput: meme.png (Impact font, top/bottom positioning)`,
        note: 'Applies the specific font and placement convention that makes an image read as an actual meme.',
      },
      {
        title: 'Turn a personal photo into a meme',
        code: `Input: photo.jpg, top text: "When the code finally works", bottom text: "But you don't know why"\nOutput: meme.png`,
        note: 'Works with any uploaded image, not just a preset template.',
      },
    ],
  },

  'uuid-compare': {
    description: `Two UUIDs that look similarly formatted, the same dashes in the same places, can still be fundamentally different kinds of identifier underneath, one version encoding a timestamp and a node identifier, another generated from pure randomness with no structure to decode at all, a distinction that matters when debugging why two IDs that should sort predictably against each other don't, or why a system expected one version and received another. This tool compares two UUIDs directly, checking their version, variant, any embedded timestamp, and their lexicographic order relative to each other, rather than treating every UUID as interchangeable just because the format looks the same. Useful for confirming two identifiers are actually the same UUID version before assuming they behave the same way, checking whether one UUID genuinely sorts before another as expected, or debugging a system that's receiving an unexpected UUID version from somewhere in a pipeline.`,
    examples: [
      {
        title: 'Compare version and variant',
        code: `Input: A: 4e8f2a10-6c1b-11f0-8a3d-0242ac120002, B: 7c9e6679-7425-40de-944b-e07fc1f90ae7\nOutput: A: version 1, B: version 4`,
        note: 'Reveals two UUIDs are fundamentally different types despite similar formatting.',
      },
      {
        title: 'Check lexicographic order',
        code: `Input: A: 01ARZ3NDEKTSV4RRFFQ69G5FAV, B: 01ARZ3NDEMTSV4RRFFQ69G5FAW\nOutput: A sorts before B`,
        note: 'Confirms whether one identifier actually sorts before another as expected.',
      },
    ],
  },

  'nda-generator': {
    description: `An NDA that doesn't actually define what counts as confidential information, or that never states how long the confidentiality obligation actually lasts, is a document that looks official but leaves the exact thing it's supposed to protect dangerously vague, which is exactly the kind of gap that matters if the agreement is ever actually tested. This tool builds a non-disclosure agreement with those specific elements addressed: what qualifies as confidential, how long the obligation extends, and the standard exceptions, information already public, independently developed, that a workable NDA needs to include. It's a solid starting document, not a replacement for legal review on an agreement protecting something genuinely high-stakes. Useful for setting up a straightforward NDA before an early business conversation, having a base agreement ready before bringing in outside legal review for something more significant, or covering a routine confidentiality need without starting from a blank page.`,
    examples: [
      {
        title: 'Define confidential information and duration',
        code: `Input: parties: Company A, Contractor B, term: 3 years\nOutput: NDA with confidentiality definition, 3-year term, standard exceptions clause`,
        note: 'Includes the specific elements a workable NDA needs, not just boilerplate language.',
      },
      {
        title: 'Set up a mutual NDA before a business discussion',
        code: `Input: type: mutual, purpose: "exploring a potential partnership"\nOutput: NDA covering both parties' shared obligations`,
        note: 'Useful when both sides may share sensitive information, not just one.',
      },
    ],
  },

  'remove-bg': {
    description: `Cutting a subject out cleanly around fine detail, loose hair, a translucent edge, a gap between an arm and a body, is where background removal actually gets difficult, since a rough cutout that ignores those details leaves a visible fringe or a hard edge that immediately gives away that the background was removed rather than genuinely absent. This tool isolates a subject with that fine detail specifically handled, rather than a blunt cutout that treats every edge the same way regardless of how complex it actually is. Useful for isolating a product photo cleanly for a marketplace listing that requires a plain background, cutting out a portrait's hair and edges without a visible fringe left behind, or preparing a batch of product photos with consistent, clean isolation quality across every image.`,
    examples: [
      {
        title: 'Isolate a product photo for a marketplace listing',
        code: `Input: sneaker-photo.jpg (cluttered background)\nOutput: sneaker-cutout.png (clean isolation, transparent background)`,
        note: 'Handles a plain background requirement many marketplace listings enforce.',
      },
      {
        title: "Cut out a portrait's hair without a visible fringe",
        code: `Input: portrait.jpg (loose, flyaway hair)\nOutput: portrait-cutout.png (hair edges preserved cleanly)`,
        note: 'Targets exactly the fine-detail edges that make background removal genuinely difficult.',
      },
    ],
  },

  'bill-sale-generator': {
    description: `A bill of sale is a simpler document than a full purchase agreement, it doesn't negotiate contingencies or financing terms, it just confirms a sale already happened and formally transfers ownership from seller to buyer, which is exactly the document a DMV typically wants for a vehicle title transfer rather than the fuller negotiated contract a more complex sale would need. This tool generates that specific document for a vehicle or property sale, with the basic details, parties, item description, price, date, that a bill of sale actually needs to serve as valid proof of transfer. Useful for documenting a private vehicle sale in the format a DMV title transfer actually expects, formally recording a simple property sale after the terms were already agreed verbally, or having a basic, valid record of a transaction that doesn't call for a full negotiated contract.`,
    examples: [
      {
        title: 'Document a private vehicle sale',
        code: `Input: 2018 Honda Civic, VIN, odometer reading, price: $11,500\nOutput: bill of sale ready for a DMV title transfer`,
        note: 'Matches the simpler document format a DMV typically requires, not a full contract.',
      },
      {
        title: 'Record a simple property sale',
        code: `Input: item: riding mower, price: $650, date, both parties' names\nOutput: signed bill of sale confirming the transfer`,
        note: 'Suits a straightforward sale already agreed on rather than one still being negotiated.',
      },
    ],
  },

  'hreflang-tag-generator': {
    description: `Without hreflang tags telling a search engine which page is meant for which language or region, a French-language version of a page can outrank the English version for an English-speaking searcher, or the reverse, since nothing signals that these pages are regional alternatives meant to serve different audiences the same content. This tool generates hreflang tags for a set of language and regional page versions, and specifically handles the requirement that these tags be reciprocal, if one page references another as an alternate, that other page needs to reference the first one right back, or search engines may disregard the whole set. Useful for making sure the correct regional version of a page shows up for each audience, setting up hreflang correctly across a multi-language site without missing the reciprocal linking requirement, or fixing a site where the wrong language version keeps ranking for the wrong audience.`,
    examples: [
      {
        title: 'Generate reciprocal hreflang tags',
        code: `Output:\n<link rel="alternate" hreflang="en-us" href="https://example.com/us/" />\n<link rel="alternate" hreflang="fr-fr" href="https://example.com/fr/" />`,
        note: 'Each page in the set references the others, satisfying the reciprocal linking requirement.',
      },
      {
        title: 'Fix a site serving the wrong regional version',
        code: `Input: en-gb page missing a hreflang reference back to en-us\nResult: flagged, reciprocal tag missing, likely cause of the wrong version ranking`,
        note: 'Identifies a missing reciprocal link as the likely cause of a region mismatch.',
      },
    ],
  },

  'readability-score': {
    description: `Flesch-Kincaid, Gunning Fog, SMOG, and Coleman-Liau all claim to measure how hard a text is to read, but they weigh different things to get there, syllables per word, sentence length, unfamiliar word count, which means they can genuinely disagree on the exact same passage, and that disagreement itself is informative: when every formula lands close together, the readability estimate is trustworthy, and when they scatter widely, the text probably has some unusual characteristic none of them individually captures well. This tool calculates Flesch-Kincaid alongside several other established readability formulas for the same text, rather than relying on one score in isolation. Useful for cross-checking a readability estimate against more than one formula before trusting it, noticing when several scoring methods disagree in a way that flags something unusual about a text, or getting a fuller picture of a piece of writing's difficulty than any single formula would give alone.`,
    examples: [
      {
        title: 'Compare multiple formulas on the same text',
        code: `Input: [800-word article]\nOutput: Flesch-Kincaid: Grade 9 | Gunning Fog: Grade 11 | SMOG: Grade 10`,
        note: 'Shows whether formulas broadly agree or diverge on the same passage.',
      },
      {
        title: 'Spot a text with unusual characteristics',
        code: `Input: [technical excerpt]\nOutput: Flesch-Kincaid: Grade 8 | Coleman-Liau: Grade 14 (wide disagreement)`,
        note: 'A wide spread between formulas signals something a single score would miss.',
      },
    ],
  },

  'ip-address-info-express': {
    description: `An IP address showing up in a server log or an unexpected login alert doesn't mean much on its own, just a string of numbers, until it's actually looked up against real geolocation and network ownership data, which reveals roughly where in the world that address is registered and which internet provider or organization it actually belongs to. This tool looks up geolocation, ISP, and network details for any IPv4 or IPv6 address, translating a bare number into information that actually means something about where a connection is coming from. Useful for investigating an unfamiliar IP address that shows up in a login alert or a server log, checking roughly where a visitor to a site is actually connecting from, or identifying which organization or ISP a specific IP address is registered to before deciding whether it's worth further attention.`,
    examples: [
      {
        title: 'Investigate an unfamiliar login alert',
        code: `Input: 203.0.113.47\nOutput: location: Singapore | ISP: Example Telecom | network: 203.0.113.0/24`,
        note: 'Turns a bare IP address into context about where a login attempt came from.',
      },
      {
        title: "Check a site visitor's rough location",
        code: `Input: 198.51.100.23\nOutput: location: Toronto, Canada | ISP: Example Cable Co.`,
        note: 'Reveals roughly where a connection is coming from, not just an anonymous number.',
      },
    ],
  },

  'image-brightness-adjuster': {
    description: `Brightness and exposure aren't quite the same adjustment even though they both make an image look lighter, brightness shifts every pixel's value by roughly the same amount, while exposure behaves more like adjusting how much light actually reached the sensor, affecting how highlights and shadows compress across the image's whole tonal range rather than shifting every pixel uniformly, a real difference photographers rely on for different kinds of correction. This tool adjusts brightness, contrast, and exposure separately with a live preview, rather than one blunt lightening slider that treats every tonal adjustment the same way. Useful for correcting a photo that's genuinely underexposed rather than just uniformly dark, adjusting contrast independently of brightness to keep an image from looking flat or washed out, or fine-tuning all three together while watching the actual result before downloading.`,
    examples: [
      {
        title: 'Correct a genuinely underexposed photo',
        code: `Input: photo.jpg, exposure: +1.2\nOutput: photo-corrected.jpg (shadows and midtones lifted proportionally)`,
        note: 'Behaves like adjusting how much light hit the sensor, not just a flat brightness shift.',
      },
      {
        title: 'Adjust contrast independently of brightness',
        code: `Input: photo.jpg, contrast: +15, brightness: 0\nOutput: photo-adjusted.jpg (more defined without looking washed out)`,
        note: 'Keeps the two adjustments separate instead of one slider affecting both.',
      },
    ],
  },

  'slug-generator': {
    description: `A slug needs a consistent separator matching whatever a specific CMS or URL scheme expects, hyphens for most platforms, underscores for a few others, and a length limit that doesn't just chop off mid-word the moment a long title runs past the cutoff, both details a naive slugify function tends to get only partly right. This tool generates a URL-friendly slug from any text with the separator character and maximum length both configurable, truncating cleanly at a word boundary rather than cutting a word in half when a title runs long. Useful for generating a slug that matches a specific platform's separator convention instead of the default hyphen, keeping a long title's slug under a length limit without an awkwardly truncated word at the end, or converting a batch of titles into consistent, correctly formatted slugs at once.`,
    examples: [
      {
        title: 'Generate a slug with a custom separator',
        code: `Input: "Best Running Shoes 2026", separator: underscore\nOutput: best_running_shoes_2026`,
        note: 'Matches a platform convention that expects underscores instead of the default hyphen.',
      },
      {
        title: 'Truncate a long title at a word boundary',
        code: `Input: "The Complete Beginner's Guide to Sourdough Bread Baking at Home", max length: 40\nOutput: the-complete-beginners-guide-to-sourdough`,
        note: 'Cuts at a full word instead of chopping a word in half at the character limit.',
      },
    ],
  },
};

export default FIX_BATCH_45;
