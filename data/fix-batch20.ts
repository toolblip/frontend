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

const FIX_BATCH_20: Record<string, FixBatchEntry> = {
  'data-size-converter': {
    description: `Bytes through terabytes cover almost everyone's daily experience with file sizes, but a cloud storage bill, a data center capacity plan, or a genuinely large dataset used in analytics work routinely lands in petabytes, a scale most people never need a mental model for until they're suddenly staring at a number with fifteen zeros in it. This tool converts across the full range, bytes, kilobytes, megabytes, gigabytes, terabytes, and petabytes, using either the binary or decimal base explicitly so the number lines up with whatever convention the source actually used. Useful for making sense of a cloud provider's storage pricing tier listed in petabytes, sanity-checking a data center capacity figure in a planning document, or converting a large dataset's reported size into a unit that actually means something at a glance instead of a number too large to intuitively grasp.`,
    examples: [
      {
        title: 'Convert a cloud storage tier into a familiar unit',
        code: `Input: 2 PB\nOutput: 2,048 TB | 2,097,152 GB`,
        note: 'Cloud storage pricing tiers are often listed in petabytes at enterprise scale.',
      },
      {
        title: 'Check a dataset size using the binary base',
        code: `Input: 500 GB (binary)\nOutput: 536,870,912,000 bytes`,
        note: 'Uses the 1024-based binary definition rather than the decimal 1000-based one.',
      },
    ],
  },

  'mov-to-avi': {
    description: `Windows used to handle MOV files through Apple's own QuickTime player, but Apple stopped updating QuickTime for Windows years ago after a security vulnerability was found and never patched, and Windows no longer recommends installing it at all, which means a lot of Windows machines today genuinely can't open a MOV file without extra software. AVI carries none of that baggage; it's been natively supported by Windows Media Player since long before QuickTime for Windows existed at all. This tool converts a MOV file, the kind an iPhone or a Mac produces by default, into AVI, so it opens on a Windows machine without installing anything extra or hitting a codec error. Useful for sending a video shot on an iPhone to someone on an older Windows PC, or getting Mac-recorded footage playing in an environment built entirely around Windows.`,
    examples: [
      {
        title: 'Send an iPhone video to an older Windows PC',
        code: `Input: video.mov (recorded on iPhone)\nOutput: video.avi (plays in Windows Media Player)`,
        note: 'Avoids needing QuickTime, which Windows no longer supports or recommends installing.',
      },
      {
        title: 'Prepare Mac-recorded footage for a Windows-only workflow',
        code: `Input: screen-recording.mov\nOutput: screen-recording.avi`,
        note: 'AVI has been natively supported by Windows Media Player for decades.',
      },
    ],
  },

  'text-to-image': {
    description: `A quote posted as plain text on social media looks like every other text post in the feed, but the same words rendered as a designed image, a background color or photo, a deliberate font choice, the text laid out and sized to actually fill the frame, reads as a piece of content rather than just a caption. This tool turns text into that kind of shareable graphic: type in a quote or a short message, pick a background and a font treatment, and export an image sized for whichever platform it's headed to. Useful for turning a quote worth sharing into an actual graphic instead of a wall of plain text, building a consistent visual template for a series of quote posts, or creating a simple announcement graphic without opening a full design tool.`,
    examples: [
      {
        title: 'Turn a quote into a shareable graphic',
        code: `Text: "Simplicity is the ultimate sophistication."\nBackground: solid #1A1A2E, Font: Playfair Display\nOutput: quote-graphic.png (1080x1080)`,
        note: 'Renders as a designed image rather than plain text in a caption.',
      },
      {
        title: 'Create a simple announcement graphic',
        code: `Text: "We're closed July 4th"\nBackground: #F5F0E6, Font: Inter Bold\nOutput: announcement.png (1200x630)`,
        note: 'Sized for a social post without opening a full design tool.',
      },
    ],
  },

  'ssl-certificate-checker': {
    description: `An SSL certificate expiring unnoticed turns a normal site visit into a scary browser warning overnight, with no gradual warning beforehand, which is exactly the kind of failure worth catching proactively rather than from a support ticket the morning it happens. This tool checks a domain's certificate for its expiry date, who issued it, and whether the full chain, including any intermediate certificates, is actually complete, since a missing intermediate can make a site work fine in one browser while failing in another that doesn't already trust it separately. Useful for confirming a certificate isn't about to lapse before it becomes an emergency, diagnosing why a site shows a security warning in some browsers but not others, or verifying a newly issued certificate is actually configured correctly before considering the setup finished.`,
    examples: [
      {
        title: "Check a certificate's expiry date",
        code: `Input: example.com\nOutput: Issuer: Let's Encrypt | Expires: 2026-09-14 | Chain: complete`,
        note: 'Catches an upcoming expiry before it turns into a browser warning.',
      },
      {
        title: 'Diagnose a browser-specific security warning',
        code: `Input: example.com\nOutput: Chain: incomplete, missing intermediate certificate`,
        note: 'Explains why a site fails in one browser but works in another that already trusts the intermediate separately.',
      },
    ],
  },

  'post-ideas': {
    description: `Staring at a content calendar with no idea what to post about is a different problem than not knowing how to phrase a specific post, and it's the one that actually stalls a schedule most often: the writing itself is usually the easy part once there's an actual topic to write about. This tool solves that earlier problem, generating a batch of specific post topics and angles rather than finished copy, ideas to write from instead of a draft ready to publish. Useful for filling out an empty content calendar with a week or a month's worth of topics at once, breaking through a stretch of feeling like everything worth posting already got covered, or getting a fresh angle on a topic that's been posted about before but needs a new way in.`,
    examples: [
      {
        title: 'Fill a week of the content calendar',
        code: `Input: niche: "home baking"\nOutput: 7 post topics, e.g. "3 sourdough mistakes beginners make", "behind the scenes of a failed bake"`,
        note: 'Generates topics to write from, not finished captions.',
      },
      {
        title: 'Get a fresh angle on an already-covered topic',
        code: `Input: "sourdough starter" (posted about before)\nOutput: new angle: "what to do with discarded starter"`,
        note: 'Finds a new entry point into a topic instead of repeating the same post.',
      },
    ],
  },

  'algorithm-visualizer': {
    description: `Big-O notation tells you bubble sort is slower than quicksort in the abstract, but watching the two actually run side by side on the same list, counting comparisons and swaps as they happen, makes that difference concrete in a way a formula on its own doesn't, especially the first time through when the notation alone hasn't clicked yet. This tool animates sorting, searching, and graph algorithms step by step, showing each comparison, swap, or visited node as it happens rather than jumping straight to a final result. Useful for studying for a technical interview where explaining why an algorithm behaves the way it does matters as much as reciting its complexity, or for a class assignment where seeing an algorithm run is what finally makes the underlying logic click.`,
    examples: [
      {
        title: 'Compare bubble sort and quicksort on the same list',
        code: `Input: [8, 3, 9, 1, 6]\nBubble sort: 10 comparisons, 6 swaps\nQuicksort: 6 comparisons, 3 swaps`,
        note: 'Makes the practical difference in comparisons and swaps visible rather than abstract.',
      },
      {
        title: 'Watch a graph search algorithm visit nodes step by step',
        code: `Algorithm: breadth-first search\nInput: 6-node graph, start: A\nOutput: visits A, B, C, D, E, F in order, one step at a time`,
        note: 'Shows the traversal order happening live instead of just the final result.',
      },
    ],
  },

  'json-ld-generator': {
    description: `A page can be genuinely well-written and still show up in Google as a plain blue link with a snippet of text, because good writing alone doesn't tell a search engine what kind of content it's looking at; a recipe, a product listing, a how-to guide, and an opinion piece all look identical to a crawler without something explicitly labeling which is which. JSON-LD is that label: a block of structured data describing a page in terms Schema.org defines, this is a Recipe with this cook time, this is a Product at this price, which is what enables the rich results, star ratings, recipe times, FAQ dropdowns, shown directly in search results instead of a plain text snippet. This tool generates that JSON-LD block for a page's actual content type. Useful for making a recipe, product, or article page eligible for the richer search appearance those content types can get.`,
    examples: [
      {
        title: 'Generate structured data for a recipe page',
        code: `Input: recipe name, prep time: 20 min, cook time: 40 min, rating: 4.7\nOutput: <script type="application/ld+json">{ "@type": "Recipe", "prepTime": "PT20M" }</script>`,
        note: 'Enables the recipe rich result showing cook time and rating directly in search.',
      },
      {
        title: 'Mark up a product page',
        code: `Input: product name, price: $49.99, availability: in stock\nOutput: JSON-LD block with "@type": "Product" and offer details`,
        note: 'Lets a product page qualify for price and availability shown directly in search results.',
      },
    ],
  },

  paraphrasing: {
    description: `Paraphrasing correctly done isn't a way to avoid citing a source, it's restating someone else's idea in different words while still crediting where the idea came from, which is a genuinely different skill from either copying text directly or summarizing so loosely the original point gets lost. This tool rephrases a passage while preserving its actual meaning, useful for working a source's point into your own writing style and vocabulary rather than dropping in a quote verbatim, adapting a passage from your own earlier work so it reads freshly in a new piece rather than repeating itself, or simplifying dense phrasing for a different audience while keeping the underlying point intact. It changes how something is worded, not whether the original source or idea still needs proper attribution.`,
    examples: [
      {
        title: "Restate a source's point in your own words",
        code: `Input: "The study found a statistically significant correlation between sleep duration and cognitive performance."\nOutput: "Getting more sleep was linked to noticeably better cognitive test scores, the study found."`,
        note: 'Still requires citing the original study; only the wording changes, not the need for attribution.',
      },
      {
        title: 'Simplify dense phrasing for a general audience',
        code: `Input: "Utilization of this methodology facilitates enhanced comprehension among end users."\nOutput: "This approach helps users understand it better."`,
        note: 'Keeps the underlying point while making it readable for a non-technical audience.',
      },
    ],
  },

  'image-border-adder': {
    description: `A photo dropped straight into a grid or a document edge to edge can look unfinished compared to the same image with a deliberate border around it, a thin dark line to define the edge against a busy background, a thick white mat that gives it a printed-photo feel, a colored frame that makes one thumbnail stand out among a dozen identical ones. This tool adds a border around any image with the width, color, and style all adjustable, previewed live so the effect can be judged before committing to it. Useful for giving a screenshot a clean, intentional edge instead of a raw crop, adding a white mat border to a photo meant to look printed, or putting a colored frame around a thumbnail so it stands apart in a grid of otherwise similar images.`,
    examples: [
      {
        title: 'Add a printed-photo style white mat',
        code: `Input: photo.jpg, border: 40px, color: #FFFFFF\nOutput: photo-bordered.jpg`,
        note: 'Gives a digital photo the look of a printed photo with a white mat.',
      },
      {
        title: 'Make one thumbnail stand out in a grid',
        code: `Input: thumbnail.png, border: 6px, color: #FF6B35\nOutput: thumbnail-bordered.png`,
        note: 'A colored border draws the eye to one image among a set of otherwise similar thumbnails.',
      },
    ],
  },

  'color-mixer': {
    description: `Color theory schemes generate a set of colors mathematically related to one you already picked, but sometimes the actual question is simpler and more literal: what do you get if you combine these two specific colors, the way mixing two paints on a palette would. This tool blends two or more colors together with the blend mode adjustable, simulating how the colors would combine rather than generating a theoretically related set around a single starting point. Useful for predicting what a paint mix will look like before actually combining pigments, finding a genuine in-between color between two existing brand colors for a transition or gradient midpoint, or exploring what a handful of colors look like blended together rather than kept as separate swatches.`,
    examples: [
      {
        title: 'Predict a paint mixing result',
        code: `Input: #2563EB + #FFD166, blend: 50/50\nOutput: #93A98A (approximate mixed result)`,
        note: 'Simulates combining two colors rather than generating a theoretical scheme.',
      },
      {
        title: 'Find a midpoint between two brand colors',
        code: `Input: #DC2626 (brand red) + #2563EB (brand blue)\nOutput: #7A44A6 (midpoint)`,
        note: 'Useful for a gradient transition point between two existing colors.',
      },
    ],
  },
};

export default FIX_BATCH_20;
