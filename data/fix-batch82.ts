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

const FIX_BATCH_82: Record<string, FixBatchEntry> = {
  rotate: {
    description: `A phone photo that shows up sideways or upside down in one app but fine in another is usually an EXIF orientation problem rather than anything wrong with the actual image data, and the fastest fix isn't opening a full editor, it's a quick 90 or 180 degree snap rotation that puts the photo the right way up in one step. This tool rotates an image by 90, 180, or a custom angle, built around quickly fixing an image's orientation rather than composing a precise creative angle. Useful for correcting a sideways photo straight out of a phone's camera roll, flipping a scanned document that came out upside down back to readable, or quickly fixing orientation on a batch of photos before uploading them somewhere that displays EXIF rotation inconsistently.`,
    examples: [
      {
        title: 'Fix a sideways phone photo',
        code: `Input: photo.jpg (rotated 90° from EXIF)\nOutput: photo-fixed.jpg (upright)`,
        note: 'Corrects orientation with a quick snap rotation instead of a full editor.',
      },
      {
        title: 'Flip an upside-down scan',
        code: `Input: scan.pdf (page upside down)\nOutput: scan-fixed.pdf (180° rotated)`,
        note: 'Puts a misoriented scanned page back to readable in one step.',
      },
    ],
  },

  'data-size-converter': {
    description: `A cloud storage bill listing usage in TB, a training dataset described in GB, and a data warehouse's total footprint measured in PB are all the same kind of number at wildly different scales, and converting between them by hand means multiplying or dividing by 1,024 or 1,000 several times over depending on which base a specific provider actually uses. This tool converts between bytes, KB, MB, GB, TB, and PB using either binary or decimal base, built for the scale of enterprise storage and cloud billing rather than just a single file's size. Useful for converting a cloud provider's usage report from GB into TB to match an invoice, checking how many GB a dataset's stated byte count actually comes to, or converting a data warehouse's storage footprint into PB for a capacity planning conversation.`,
    examples: [
      {
        title: 'Match a cloud invoice unit',
        code: `Input: 3,400 GB (usage report)\nOutput: 3.32 TB`,
        note: "Converts a provider's usage report into the unit an invoice actually uses.",
      },
      {
        title: 'Convert a data warehouse footprint to PB',
        code: `Input: 2,500,000 GB\nOutput: 2.5 PB (decimal) / 2.27 PiB (binary)`,
        note: 'Scales up to petabytes for enterprise storage capacity planning.',
      },
    ],
  },

  'mov-to-avi': {
    description: `A video recorded on an iPhone or a Mac saves as MOV by default, a format QuickTime handles natively but that a lot of older or business-standard Windows software either mishandles or won't open at all, while AVI, despite its age, remains deeply embedded in Windows Media Player and countless legacy applications that have supported it for decades. This tool converts a MOV file into AVI, trading MOV's native Apple-ecosystem support for a format that opens reliably on Windows machines and older software. Useful for converting a video shot on an iPhone so it opens on an older Windows PC without extra codecs installed, preparing a MOV file for legacy business software that only accepts AVI, or sharing a Mac-recorded video with someone on Windows who can't open QuickTime formats directly.`,
    examples: [
      {
        title: 'Open an iPhone video on an older Windows PC',
        code: `Input: vacation.mov (recorded on iPhone)\nOutput: vacation.avi`,
        note: 'Opens without extra codecs on a Windows machine that mishandles MOV.',
      },
      {
        title: 'Prepare a video for legacy business software',
        code: `Input: training-clip.mov\nOutput: training-clip.avi`,
        note: 'Converts for older software that only accepts AVI.',
      },
    ],
  },

  'text-to-image': {
    description: `A styled tweet-card graphic looks great for a tweet, but a motivational quote meant for an Instagram post, a stat meant for a blog header, or an announcement meant for a presentation slide each need their own layout and aspect ratio rather than being squeezed into a format built specifically to look like a tweet. This tool turns any text into a standalone image with a chosen theme and background, built for any destination rather than one platform's specific card style. Useful for turning a quote into a square graphic sized for an Instagram post, creating a text-based header image for a blog post from a single sentence, or generating an announcement graphic for a slide deck without it looking like a repurposed tweet screenshot.`,
    examples: [
      {
        title: 'Turn a quote into an Instagram graphic',
        code: `Input: "Do the work before you need the results."\nOutput: 1080x1080 quote graphic`,
        note: 'Sized for Instagram rather than a tweet-card layout.',
      },
      {
        title: 'Create a blog header from a headline',
        code: `Input: "5 Lessons From Our First Year"\nOutput: 1200x630 header image`,
        note: 'Fits a blog header aspect ratio instead of a social card format.',
      },
    ],
  },

  'ssl-certificate-checker': {
    description: `An SSL certificate usually renews itself silently in the background for years without anyone noticing, right up until a DNS change, an expired payment method, or a missed manual step breaks that renewal and a site suddenly greets every visitor with a browser warning that its connection isn't private, with no advance notice that anything was about to go wrong. This tool checks any HTTPS domain's certificate for its expiry date, issuer, and full chain, including a missing intermediate certificate that can leave a cert valid on some browsers while failing silently on others. Useful for catching a certificate that's about to expire before it actually takes a site offline, verifying a certificate chain is complete rather than missing an intermediate that only some browsers tolerate, or checking who actually issued a domain's certificate before trusting it.`,
    examples: [
      {
        title: 'Catch an expiring certificate early',
        code: `Input: example.com\nOutput: certificate expires in 9 days`,
        note: 'Surfaces an approaching expiry before it takes the site offline.',
      },
      {
        title: 'Check for a missing intermediate certificate',
        code: `Input: example.com\nOutput: warning - intermediate certificate missing from chain`,
        note: 'Flags a chain issue that fails silently on some browsers but not others.',
      },
    ],
  },

  'post-ideas': {
    description: `Having a content calendar slot to fill and nothing to actually say is a different problem than having a topic already decided and needing it written up, and no amount of a polished post-writing tool helps with the first one, since the blank page isn't a wording problem, it's a lack of angles to even consider in the first place. This tool brainstorms a list of social media post ideas and angles rather than writing a finished post from a topic that's already been chosen. Useful for filling an empty content calendar slot with a handful of angles to choose from, breaking through a creative block when nothing's coming to mind on a given topic, or generating several post directions before deciding which one is actually worth writing up in full.`,
    examples: [
      {
        title: 'Fill an empty content calendar slot',
        code: `Input: topic: "productivity"\nOutput: 8 post angles - "morning routines", "tools we use", "biggest time-waster", ...`,
        note: 'Produces angles to choose from rather than a finished post.',
      },
      {
        title: 'Break through a creative block',
        code: `Input: topic: "customer onboarding"\nOutput: 6 post ideas ranging from a tip list to a behind-the-scenes angle`,
        note: 'Solves the blank-page problem before any writing starts.',
      },
    ],
  },

  'algorithm-visualizer': {
    description: `A flowchart shows a program's static branching logic, which path leads where, but it can't actually show what happens to the data itself while an algorithm runs, two array elements swapping places during a sort, a search range narrowing step by step, a graph traversal visiting one node before moving to the next, the kind of runtime behavior that's genuinely hard to picture just by reading code. This tool animates sorting, searching, and graph algorithms operating on sample data step by step, showing what actually happens to the data at each step rather than the code's static structure. Useful for watching a sorting algorithm's actual swaps happen to understand why one approach is faster than another, seeing a search narrow its range step by step instead of just reading about it, or watching a graph traversal visit nodes in the order it actually does.`,
    examples: [
      {
        title: "Watch a sort's actual swaps happen",
        code: `Input: [5, 2, 8, 1], algorithm: bubble sort\nStep 1: swap 5 and 2 -> [2, 5, 8, 1]\nStep 2: swap 8 and 1 -> [2, 5, 1, 8]`,
        note: 'Shows the data-level operations, not just the final sorted result.',
      },
      {
        title: "See a graph traversal's visit order",
        code: `Input: graph with 6 nodes, algorithm: breadth-first search\nOutput: visits node A, then B and C, then D, E, F`,
        note: 'Animates the order nodes are actually visited, level by level.',
      },
    ],
  },

  'json-ld-generator': {
    description: `A recipe's cook time, a product's star rating, an event's date, showing up directly inside a Google search result rather than requiring a click through to the page depends entirely on a nested block of Schema.org structured data getting every required property exactly right, and missing even one field is often enough for the whole block to get silently rejected rather than partially accepted. This tool generates valid Schema.org JSON-LD structured data for a specific content type, formatted so the required properties are actually present rather than left to guesswork. Useful for marking up a recipe page so its cook time and rating can show up directly in search results, adding structured data to an event page so its date and location display without a click-through, or generating an FAQ page's structured data correctly enough to actually qualify for a rich result.`,
    examples: [
      {
        title: 'Mark up a recipe for rich results',
        code: `Input: recipe name, cook time: 25 min, rating: 4.7\nOutput: <script type="application/ld+json">{ "@type": "Recipe", ... }</script>`,
        note: 'Includes the required properties needed to qualify for a rich result.',
      },
      {
        title: 'Add structured data to an event page',
        code: `Input: event name, date: 2026-09-12, location\nOutput: Schema.org Event JSON-LD block`,
        note: 'Formats the nested structure Google expects for event rich results.',
      },
    ],
  },

  paraphrasing: {
    description: `Restating a fact or an idea from a source in genuinely different words, rather than lightly editing your own already-written paragraph for a fresher angle, is a distinct task with its own specific risk, staying close enough to the original meaning while wording it differently enough that it doesn't read as a copy of the source it came from. This tool rephrases text pulled from a source while preserving its original meaning, built around the specific workflow of citing or referencing someone else's material without repeating it word for word. Useful for restating a fact from a research source in original wording for a report or an article, rephrasing a quoted passage closely enough to preserve its meaning but not its exact wording, or reworking borrowed material into original phrasing before it goes into a piece of writing.`,
    examples: [
      {
        title: 'Restate a research fact in original wording',
        code: `Input: "Solar panel efficiency has increased by roughly 40% since 2010."\nOutput: "Since 2010, solar panels have become about 40% more efficient at converting sunlight into power."`,
        note: 'Preserves the fact while wording it differently from the source.',
      },
      {
        title: 'Rephrase a quoted passage',
        code: `Input: "The study found no significant correlation between the two variables."\nOutput: "Researchers observed no meaningful link between the two factors."`,
        note: "Keeps the source's meaning intact without repeating its exact phrasing.",
      },
    ],
  },

  'image-border-adder': {
    description: `Guessing at a border's width and color in a design tool and only seeing the actual result after applying it is a slow way to land on something that looks intentional, especially with several border styles, solid, dashed, dotted, double, each looking meaningfully different around the same photo. This tool adds a border around any image with a live preview showing the exact result as width, color, and style are adjusted, rather than a guess-and-check cycle of applying and undoing. Useful for framing a portfolio photo with a border that previews instantly as its width is adjusted, adding a colored border to make a product photo stand out in a marketplace grid, or trying a few different border styles side by side before committing to one.`,
    examples: [
      {
        title: 'Preview a border while adjusting width',
        code: `Input: photo.jpg, border: 12px solid #FFFFFF\nOutput: live preview updates as width changes to 20px`,
        note: 'Shows the exact result immediately instead of a guess-and-check cycle.',
      },
      {
        title: 'Compare border styles side by side',
        code: `Input: product-photo.jpg\nStyles: solid, dashed, dotted, double\nOutput: 4 preview variants`,
        note: 'Lets a few style options be compared before committing to one.',
      },
    ],
  },
};

export default FIX_BATCH_82;
