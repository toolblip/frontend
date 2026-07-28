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

const FIX_BATCH_78: Record<string, FixBatchEntry> = {
  'png-to-webp': {
    description: `Converting a PNG to JPG to save space means giving up transparency entirely, since JPG doesn't support an alpha channel at all, but WebP was built to compress noticeably smaller than PNG while keeping that same transparent background intact, so a logo or an icon with a see-through edge doesn't have to choose between file size and staying transparent. This tool converts PNG images into WebP, keeping alpha transparency intact while cutting file size, in a format nearly every modern browser now renders natively. Useful for shrinking a transparent PNG icon for a faster-loading web page without losing its see-through background, converting a batch of PNG screenshots to a smaller format for a site that already supports WebP, or reducing image weight on a page without switching to a format that would flatten transparency to a solid color.`,
    examples: [
      {
        title: 'Shrink a transparent icon',
        code: `Input: icon.png (24 KB, transparent background)\nOutput: icon.webp (9 KB, transparency preserved)`,
        note: 'Cuts file size while keeping the same alpha transparency.',
      },
      {
        title: 'Convert a batch of screenshots',
        code: `Input: screenshot-1.png, screenshot-2.png, screenshot-3.png\nOutput: screenshot-1.webp, screenshot-2.webp, screenshot-3.webp`,
        note: 'Reduces total page weight for a site that already supports WebP.',
      },
    ],
  },

  'css-validator': {
    description: `CSS doesn't throw an error when it hits something it doesn't understand, a misspelled property name, an invalid value, an unsupported syntax, it just silently skips that one declaration and moves on, which means a broken style rule can sit unnoticed in a stylesheet for a long time, quietly failing to apply rather than crashing the way a script error would. This tool validates CSS against W3C standards, flagging exactly which declarations are invalid, unsupported, or likely to cause an accessibility problem instead of leaving them to fail silently. Useful for catching a typo'd property name that would otherwise just get ignored without any warning, checking whether a CSS feature is actually supported before relying on it, or auditing a stylesheet for accessibility issues like insufficient contrast values baked into the CSS itself.`,
    examples: [
      {
        title: 'Catch a silently ignored typo',
        code: `Input: .card { colr: red; }\nResult: warning - "colr" is not a valid property, declaration ignored`,
        note: 'Flags a typo that CSS would otherwise skip without any error.',
      },
      {
        title: 'Check browser support for a property',
        code: `Input: .box { aspect-ratio: 16 / 9; }\nResult: supported in all modern browsers`,
        note: 'Confirms a feature is safe to rely on before shipping it.',
      },
    ],
  },

  'http-request-builder': {
    description: `Getting an authenticated API request right on the first try usually means assembling several pieces correctly at once, a Bearer token or an API key formatted into exactly the header a server expects, custom headers beyond the standard ones, a request body matching the content type declared alongside it, rather than sending one field at a time and troubleshooting whichever piece the server rejects. This tool builds a complete HTTP request, headers, body, and authentication together, as a single defined request rather than a quick ad hoc send-and-see attempt. Useful for assembling a Bearer token request with the exact header format an API expects, building a request with a custom header and JSON body together before sending it, or putting together a reusable request definition to test the same endpoint repeatedly with small changes.`,
    examples: [
      {
        title: 'Build a Bearer-authenticated request',
        code: `Method: GET\nURL: https://api.example.com/users\nHeader: Authorization: Bearer eyJhbGciOi...`,
        note: 'Formats the auth header exactly as the API expects before sending.',
      },
      {
        title: 'Assemble headers and a JSON body together',
        code: `Method: POST\nHeaders: Content-Type: application/json, X-API-Key: abc123\nBody: { "name": "Jane" }`,
        note: 'Builds the full request as one definition instead of testing pieces separately.',
      },
    ],
  },

  'shorten-content': {
    description: `Summarizing a piece of writing and simply shortening it aren't the same task, a summary distills the gist into a new, more compact structure, while shortening trims an existing piece down to a target length while keeping its original voice, sentence order, and structure mostly intact, an edit rather than a rewrite into an abstract. This tool condenses text down toward a target length by cutting redundant phrasing and unnecessary qualifiers, while preserving the piece's original structure and key points rather than restructuring it into a new form. Useful for trimming a press release down to fit a strict word count without losing its key announcement, shortening a product description to fit a marketplace listing's character limit, or condensing an overlong paragraph while keeping it read like the same piece of writing.`,
    examples: [
      {
        title: 'Trim a press release to a strict word count',
        code: `Input: [420-word press release]\nOutput: [300-word version, same structure and quotes intact]`,
        note: 'Cuts length while keeping the original voice and order.',
      },
      {
        title: 'Fit a product description to a character limit',
        code: `Input: [280-character description]\nOutput: [150-character version for a marketplace listing]`,
        note: 'Condenses to fit a limit without rewriting it into a different form.',
      },
    ],
  },

  'character-frequency-counter': {
    description: `In ordinary English text, the letter e shows up far more often than any other, and a simple substitution cipher that swaps each letter for a different symbol doesn't actually hide that pattern, it just relabels it, which is exactly why counting how often each character appears in a ciphertext is one of the oldest tricks in cryptanalysis for guessing which symbol actually represents e. This tool counts how often every character appears in a block of text, surfacing the same frequency pattern a classical cipher attack would look for. Useful for spotting the letter frequency pattern behind a simple substitution cipher, checking whether a password relies on too many repeated characters despite looking long enough, or analyzing character distribution in a piece of text for a cryptography exercise.`,
    examples: [
      {
        title: 'Spot the frequency pattern behind a substitution cipher',
        code: `Input: [ciphertext]\nOutput: "x" appears most often (12.4%) - likely maps to "e"`,
        note: 'Uses the same frequency logic classical cryptanalysis relies on.',
      },
      {
        title: 'Check repeated characters in a password',
        code: `Input: "aaaaaaaa1!"\nOutput: "a" appears 8 times out of 10 characters`,
        note: 'Reveals low actual entropy despite the password looking long.',
      },
    ],
  },

  'css-to-styled-components': {
    description: `Styled-components doesn't keep CSS in a separate stylesheet at all, it embeds the actual rules directly inside a component's JavaScript file using a tagged template literal, styled.div followed by backticks wrapping the CSS itself, a genuinely different model from something like SCSS that still lives in its own file with extra syntax layered on top. This tool converts plain CSS into that styled-components template literal syntax, wrapping the rules in the correct tagged template attached to a specific element. Useful for migrating an existing stylesheet into co-located, component-scoped styles for a React codebase, converting a single CSS class into its own styled component during a refactor, or adopting CSS-in-JS in a project that currently keeps its styles in separate files.`,
    examples: [
      {
        title: 'Convert a class into a styled component',
        code: `Input: .card { padding: 16px; border-radius: 8px; }\nOutput: const Card = styled.div\`\n  padding: 16px;\n  border-radius: 8px;\n\`;`,
        note: 'Embeds the CSS directly in the component file instead of a separate stylesheet.',
      },
      {
        title: 'Migrate a button style',
        code: `Input: .btn-primary { background: #2563EB; color: white; }\nOutput: const PrimaryButton = styled.button\`\n  background: #2563EB;\n  color: white;\n\`;`,
        note: 'Produces a reusable, component-scoped style ready to import.',
      },
    ],
  },

  'jpg-to-avif': {
    description: `AVIF, built on the same compression technology behind the AV1 video codec, squeezes a photo down noticeably smaller than even WebP manages in many cases, but that extra compression comes from a slower, more computationally expensive encoding process, and while modern browsers support it well, that support is newer and less universal than WebP's, a real tradeoff between the smallest possible file and the widest possible compatibility. This tool converts JPEG images into AVIF, producing files roughly ten times smaller than the original JPEG at comparable visual quality. Useful for serving the smallest possible image to visitors on modern browsers that support AVIF, cutting page weight aggressively on a site that doesn't need to support very old browsers, or comparing AVIF's file size against WebP for the same source photo.`,
    examples: [
      {
        title: 'Cut page weight aggressively',
        code: `Input: hero-photo.jpg (1.2 MB)\nOutput: hero-photo.avif (approximately 120 KB)`,
        note: 'Achieves roughly a 10x reduction at comparable visual quality.',
      },
      {
        title: 'Compare against WebP for the same photo',
        code: `Input: product.jpg\nOutput: product.avif (18 KB) vs product.webp (27 KB)`,
        note: 'AVIF often compresses smaller than WebP for the same source image.',
      },
    ],
  },

  'random-mac-generator': {
    description: `A MAC address isn't just a random string of hex digits, its first three bytes, the OUI, are actually assigned to a specific manufacturer, which is why a genuinely realistic test address needs to look plausible at that level too, not just be technically well-formed, and the difference between the standard 48-bit EUI-48 format most devices use and the extended 64-bit EUI-64 format used in other addressing contexts matters depending on what's actually being tested. This tool generates random MAC addresses in OUI-aware, EUI-48, or EUI-64 format. Useful for generating a batch of plausible-looking test addresses for a network simulation, creating a MAC address in EUI-64 format for testing an IPv6 interface identifier, or producing device addresses for test fixtures without accidentally reusing the same one twice.`,
    examples: [
      {
        title: 'Generate a manufacturer-plausible test address',
        code: `Output: 00:1A:2B:3C:4D:5E (OUI-aware EUI-48)`,
        note: 'Looks plausible at the manufacturer-assigned prefix, not just well-formed.',
      },
      {
        title: 'Generate an EUI-64 address for IPv6 testing',
        code: `Output: 02:1A:2B:FF:FE:3C:4D:5E`,
        note: 'Produces the extended 64-bit format used in IPv6 interface identifiers.',
      },
    ],
  },

  'cleanup-picture': {
    description: `Removing a single unwanted object from a photo, a stray photobomber in the background, a power line cutting across a landscape, a timestamp burned into the corner, a blemish on a face, is a fundamentally different job from cutting a subject out from its background entirely, since everything else in the frame needs to stay exactly where it is while just the erased area gets convincingly filled back in. This tool removes a marked object or imperfection from a photo and fills the gap it leaves behind with content that blends into the surrounding image. Useful for erasing a photobomber from an otherwise good group photo, removing a distracting power line or wire from a landscape shot, or cleaning a skin blemish or a scratch out of a photo without touching anything else in the frame.`,
    examples: [
      {
        title: 'Erase a photobomber from a group photo',
        code: `Input: group-photo.jpg (marked region: stranger in background)\nOutput: group-photo-cleaned.jpg (region filled to match surroundings)`,
        note: 'Keeps everyone and everything else in the frame untouched.',
      },
      {
        title: 'Remove a power line from a landscape shot',
        code: `Input: landscape.jpg (marked region: wire across the sky)\nOutput: landscape-cleaned.jpg`,
        note: 'Fills the erased area with a plausible continuation of the sky.',
      },
    ],
  },

  'text-statistics': {
    description: `Not every check on a draft needs a full composite readability score, sometimes the useful thing is just a quick read on the basics, how long sentences are running, how many syllables words average, how long words tend to be overall, a fast glance rather than a deeper multi-measure analysis. This tool reports syllable count, average sentence length, and average word length for any text, a quick baseline read rather than a combined readability score. Useful for getting a fast sense of whether sentences are running too long during a first draft, checking average word length before simplifying dense, jargon-heavy writing, or getting a quick baseline reading before deciding whether a deeper readability analysis is actually needed.`,
    examples: [
      {
        title: 'Get a quick baseline read on a draft',
        code: `Input: [300-word draft]\nOutput: avg sentence length: 22 words, avg syllables/word: 1.6, avg word length: 4.8 characters`,
        note: 'A fast glance at the basics rather than a full composite score.',
      },
      {
        title: 'Check word length before simplifying jargon',
        code: `Input: [technical paragraph]\nOutput: avg word length: 6.9 characters`,
        note: 'Flags unusually long average word length as a simplification signal.',
      },
    ],
  },
};

export default FIX_BATCH_78;
