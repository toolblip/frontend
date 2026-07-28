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

const FIX_BATCH_16: Record<string, FixBatchEntry> = {
  'character-frequency-counter': {
    description: `Word frequency tells you which words repeat in a text; this counts something more granular, exactly how often each individual letter and character shows up, which is a different kind of analysis useful for two specific purposes: classic substitution cipher cryptanalysis, where the most common symbol in an encoded message likely stands in for E, the most frequent letter in English, and password strength checking, where a password that technically meets a length requirement can still lean heavily on two or three repeated characters in a way that quietly reduces how random it actually is. This tool breaks a piece of text down into a full character-by-character count, sorted from most to least frequent, including punctuation and spaces if relevant. Useful for working through a substitution cipher by hand using known letter frequencies, or checking whether a password's character distribution looks genuinely random rather than repetitive.`,
    examples: [
      {
        title: 'Analyze a substitution cipher',
        code: `Input: "XLLKFY LNNKLD" (encoded message)\nOutput: "L" appears 4 times (most frequent) -> likely maps to "E"`,
        note: 'The most frequent symbol in an encoded message often maps to E, the most common English letter.',
      },
      {
        title: 'Check a password for repeated characters',
        code: `Input: "aaabbbcc123"\nOutput: "a" (3), "b" (3), "c" (2), "1" (1), "2" (1), "3" (1)`,
        note: 'Reveals a password leaning heavily on a few repeated characters despite meeting a length requirement.',
      },
    ],
  },

  'css-to-styled-components': {
    description: `Styled-components doesn't take a CSS file directly, it wants each style block wrapped in a tagged template literal attached to a specific element, .card { padding: 16px; } needs to become something like const Card = styled.div with the styles inside backticks, with the original class selector gone entirely and an actual HTML element chosen to attach the styles to instead. This tool handles that conversion: paste in plain CSS and get back the equivalent styled-components syntax, nested media queries and pseudo-classes translated into the syntax styled-components expects inside the template literal rather than left as flat CSS. Useful for migrating an existing stylesheet into a React project that's moved to styled-components, or converting a design system's CSS into component-ready syntax without manually rewriting every selector by hand.`,
    examples: [
      {
        title: 'Convert a class selector to a styled component',
        code: `Input: .card { padding: 16px; border-radius: 8px; }\nOutput: const Card = styled.div\`\n  padding: 16px;\n  border-radius: 8px;\n\`;`,
        note: 'Attaches the styles to a chosen HTML element instead of a class name.',
      },
      {
        title: 'Convert a hover pseudo-class',
        code: `Input: .button:hover { background: #1D4ED8; }\nOutput: const Button = styled.button\`\n  &:hover {\n    background: #1D4ED8;\n  }\n\`;`,
        note: 'Nests the pseudo-class inside the template literal using the & selector styled-components expects.',
      },
    ],
  },

  'jpg-to-avif': {
    description: `AVIF at the same visual quality can end up roughly a tenth the size of the equivalent JPEG, which is a genuinely large enough gap to change how a page loads rather than a marginal improvement, but that efficiency comes from a more computationally expensive encoding process, which matters if you're converting one photo by hand versus running thousands of images through a build pipeline where encoding time actually adds up. This tool converts a JPEG into AVIF, trading a slightly longer conversion time for a dramatically smaller file at comparable quality. Useful for a site chasing every possible improvement in page load speed, where image weight is often the single biggest factor, though worth testing against specific images since the size advantage varies by content and isn't identical for every photo.`,
    examples: [
      {
        title: 'Shrink a photo dramatically at comparable quality',
        code: `Input: landscape.jpg (2.1 MB)\nOutput: landscape.avif (210 KB)`,
        note: 'A roughly tenfold size reduction at visually comparable quality.',
      },
      {
        title: 'Weigh encoding time in a build pipeline',
        code: `Input: 2,000 product photos\nOutput: AVIF conversion takes noticeably longer per image than JPEG re-encoding`,
        note: "Worth accounting for in a pipeline processing thousands of images, even though it doesn't matter for a single manual conversion.",
      },
    ],
  },

  'random-mac-generator': {
    description: `A MAC address identifies a specific network device, and it comes in a few different formats depending on what's consuming it: the classic 48-bit EUI-48 format most hardware still uses, the newer 64-bit EUI-64 format that also shows up inside IPv6 address generation, and a raw OUI vendor prefix on its own when only the manufacturer portion matters. This tool generates a random address in whichever of those formats is needed, without touching or referencing any real device's actual identifier. Useful for populating test data in network provisioning software, testing a MAC-based access control list or device whitelist without risking a collision with a real device on the network, or generating placeholder device identifiers for a demo environment that shouldn't reference actual hardware.`,
    examples: [
      {
        title: 'Generate a test MAC address for provisioning software',
        code: `Format: EUI-48\nOutput: 3A:1F:9C:22:7B:E4`,
        note: 'Populates test data without referencing any real device on the network.',
      },
      {
        title: 'Generate an EUI-64 address for IPv6 testing',
        code: `Format: EUI-64\nOutput: 3A1F:9CFF:FE22:7BE4`,
        note: 'EUI-64 is the longer format used when deriving part of an IPv6 address.',
      },
    ],
  },

  'api-endpoint-documenter': {
    description: `A prose description of an endpoint tells you what it does; a parameter table tells you exactly what to send, which path parameters are required, which query parameters are optional and what they default to, what type each one expects, all laid out so someone integrating against the API doesn't have to reconstruct that information by reading example requests and guessing at what's actually required versus optional. This tool builds that structured table directly from an endpoint's definition, organizing path parameters, query parameters, and body fields into separate, clearly labeled sections alongside the usual request and response examples. Useful for documenting an endpoint with enough precision that another developer can integrate against it without needing to ask what happens when an optional parameter gets left out.`,
    examples: [
      {
        title: 'Build a parameter table for a search endpoint',
        code: `Endpoint: GET /api/search?q={query}&limit={limit}\nTable: q (string, required), limit (integer, optional, default: 20)`,
        note: 'Separates required from optional parameters instead of leaving that implicit in an example.',
      },
      {
        title: 'Document path and body parameters together',
        code: `Endpoint: PATCH /api/users/{id}\nPath: id (string, required)\nBody: email (string, optional), name (string, optional)`,
        note: 'Organizes path parameters separately from body fields so nothing gets confused between the two.',
      },
    ],
  },

  'cleanup-picture': {
    description: `A great photo can still have one thing wrong with it, a stranger who wandered into frame in the background, a power line cutting across an otherwise clean landscape, a stray object sitting on a table that should have been moved before the shot. This tool removes exactly that kind of unwanted detail: mark the area to remove, and it fills the space back in using the surrounding image, reconstructing what would plausibly have been there rather than leaving a blurred patch or an obvious gap. That's a different job than adjusting color or cropping; it's specifically for content that shouldn't be in the frame at all rather than composition or exposure fixes. Useful for cleaning up a vacation photo before printing it, removing a passerby from an otherwise perfect shot, or tidying a product photo before it goes on a listing.`,
    examples: [
      {
        title: 'Remove a stranger from a vacation photo background',
        code: `Input: beach-photo.jpg (person walking through background)\nOutput: beach-photo-clean.jpg (area filled in based on surrounding sand and water)`,
        note: 'Reconstructs the background instead of leaving a blurred patch where the person was.',
      },
      {
        title: 'Remove a power line from a landscape shot',
        code: `Input: mountain-view.jpg (power line across the sky)\nOutput: mountain-view-clean.jpg (sky filled in, no visible trace of the line)`,
        note: 'Targets one unwanted element without affecting the rest of the photo.',
      },
    ],
  },

  'webp-to-jpg': {
    description: `WebP support has gotten a lot better over the years, but plenty of destinations still flatly don't take it, an older browser, a strict upload form, a print or photo service that only accepts a handful of long-established formats. JPEG is the one format that's essentially guaranteed to work everywhere those situations come up, which is exactly the gap this tool is built to close: convert a WebP image into JPEG, trading WebP's superior compression for a format nothing will ever reject. Useful as a fallback conversion right before uploading somewhere unfamiliar, attaching a WebP image to an email client that might not render it, or submitting a photo to a service that explicitly lists JPEG as a requirement without mentioning WebP at all.`,
    examples: [
      {
        title: 'Convert for a print service that only accepts JPEG',
        code: `Input: photo.webp\nOutput: photo.jpg`,
        note: 'Many print and photo services list JPEG as a requirement without mentioning WebP at all.',
      },
      {
        title: "Attach an image to an email client that might not render WebP",
        code: `Input: screenshot.webp\nOutput: screenshot.jpg`,
        note: "JPEG is essentially guaranteed to display correctly regardless of the recipient's email client.",
      },
    ],
  },

  'text-statistics': {
    description: `Before reaching for a deeper readability formula or a full lexicon density breakdown, sometimes what's actually needed is just the fundamentals: how many syllables the average word carries, how long sentences are running, and what the average word length looks like across a piece of text. This tool covers exactly those three baseline numbers without anything more elaborate layered on top, a fast way to get a general sense of how dense or approachable a piece of writing reads before deciding whether it's worth a deeper analysis. Useful as a quick first check on a draft, comparing the general complexity of two versions of the same paragraph, or getting a fast baseline reading before running something more detailed if the numbers here suggest it's actually needed.`,
    examples: [
      {
        title: 'Get a quick baseline reading on a draft',
        code: `Input: [500-word draft]\nOutput: avg sentence length: 16 words | avg word length: 4.8 letters | 1.4 syllables/word`,
        note: 'Covers the fundamentals without a deeper readability formula or lexicon density breakdown.',
      },
      {
        title: 'Compare two versions of the same paragraph',
        code: `Draft A: avg sentence length: 22 words\nDraft B: avg sentence length: 14 words`,
        note: 'A quick way to see which version reads as more approachable before deciding whether a deeper check is worth running.',
      },
    ],
  },

  'business-name-generator': {
    description: `Coming up with business name ideas usually starts from a description, not a list of words already picked out, what the business actually does, the industry it's in, the vibe it's going for, and turning that description into name candidates is a different starting point than combining words from lists someone already assembled. This tool generates name ideas directly from that kind of description, then checks which ones actually have an available matching domain, since a name that sounds perfect but has its .com already taken by an unrelated business is a dead end before you've even started. Useful for skipping straight from a rough concept to a shortlist of names that are both usable and actually registrable, rather than falling for a name that turns out to be unavailable after getting attached to it.`,
    examples: [
      {
        title: 'Generate names from a business description',
        code: `Input: "mobile dog grooming service"\nOutput: "PawVan", "Groom & Go", "Curbside Canine"`,
        note: 'Starts from a description of the business rather than requiring pre-picked word lists.',
      },
      {
        title: 'Check domain availability for a shortlist',
        code: `Input: "PawVan", "Groom & Go"\nOutput: pawvan.com (available), groomandgo.com (taken)`,
        note: 'Filters out names that sound good but already have their domain claimed.',
      },
    ],
  },

  'square-crop': {
    description: `Instagram's grid, a LinkedIn profile photo, a lot of app icon requirements, several platforms specifically expect a square image and will crop an off-ratio photo themselves if you don't do it first, sometimes cutting off exactly the part of the image that mattered because the platform's automatic crop has no idea what the actual subject is. This tool locks the crop to a perfect 1:1 ratio and lets you position the square selection over whatever part of the photo should actually stay in frame, rather than leaving that decision to whichever algorithm a platform uses for its automatic crop. Useful for prepping a profile picture, a grid post, or an app icon where the destination specifically requires square dimensions and getting the framing right matters more than leaving it to chance.`,
    examples: [
      {
        title: 'Prepare a profile picture',
        code: `Input: portrait.jpg (1600x2000, portrait orientation)\nOutput: portrait-square.jpg (1600x1600)`,
        note: "Locks the crop to 1:1 so the platform doesn't apply its own automatic crop.",
      },
      {
        title: 'Frame a product photo for an Instagram grid post',
        code: `Input: product-shot.jpg (1800x1200, landscape)\nOutput: product-shot-square.jpg (1200x1200, product centered)`,
        note: 'Lets you choose exactly what stays in frame instead of leaving it to an automatic crop.',
      },
    ],
  },
};

export default FIX_BATCH_16;
