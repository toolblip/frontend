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

const FIX_BATCH_99: Record<string, FixBatchEntry> = {
  'favicon-maker': {
    description: `A favicon isn't really one image, it's several, sixteen by sixteen pixels for a browser tab, thirty-two for a bookmark bar, a hundred and eighty for an Apple touch icon, and detail that reads fine at larger sizes can blur into a smudge at the smallest one if the same image just gets scaled down naively rather than simplified for that dimension. This tool creates favicon.ico, PNG, and SVG icons from any image or emoji across the full set of standard sizes, built around an icon that stays legible at every size rather than one image stretched thin across all of them. Useful for generating a complete favicon set that stays sharp from a browser tab icon up to a full-size Apple touch icon, creating an emoji favicon across every standard size at once, or making sure fine detail doesn't disappear once an icon shrinks to sixteen pixels.`,
    examples: [
      {
        title: 'Generate a complete favicon size set',
        code: `Input: logo.png\nOutput: 16x16, 32x32, 180x180, 192x192, 512x512 (each independently optimized)`,
        note: 'Simplifies detail per size rather than scaling one image down uniformly.',
      },
      {
        title: 'Create an emoji favicon across every size',
        code: `Input: 🚀\nOutput: favicon.ico, favicon-32.png, apple-touch-icon.png, favicon.svg`,
        note: 'Covers browser tabs, bookmarks, and home screen icons in one pass.',
      },
    ],
  },

  'favicon-png-maker': {
    description: `Plenty of modern build tools and static site generators have dropped the legacy .ico format entirely, declaring favicons through a handful of PNG files linked at different sizes instead, which makes a PNG-only favicon generator the right fit specifically when a project's setup was never going to touch an .ico file in the first place. This tool generates PNG favicon icons in standard sizes from any image or emoji, with a transparent background, focused entirely on PNG output rather than bundling in ICO or SVG formats a modern setup might not actually need. Useful for generating favicon PNGs for a static site generator or a framework that only expects PNG files, producing a transparent-background icon set without an unnecessary .ico file included, or creating favicon PNGs specifically sized for a build process that already handles the linking itself.`,
    examples: [
      {
        title: 'Generate PNG favicons for a static site generator',
        code: `Input: logo.png\nOutput: favicon-16x16.png, favicon-32x32.png, favicon-192x192.png`,
        note: 'Produces only the PNG files a modern build setup actually links.',
      },
      {
        title: 'Create a transparent-background icon set',
        code: `Input: 🎨\nOutput: favicon-32x32.png (transparent background)`,
        note: "Skips generating an .ico file a PNG-only setup would never use.",
      },
    ],
  },

  'filler-word-counter': {
    description: `Actually, basically, really, just, these words add essentially no information to a sentence, removing most of them changes nothing about what's actually being said, yet they creep into both spoken speech as a nervous verbal habit and writing as a reflexive hedge, and neither shows up in an ordinary word frequency count as anything worth flagging on its own. This tool counts filler words specifically, a named category of words that pad a sentence without adding meaning, rather than treating them as just another word in a general frequency count. Useful for cleaning filler words out of a script before recording a video or a podcast, spotting a hedging habit creeping into professional writing, or tightening a speech or a presentation by cutting words that were never actually doing any work.`,
    examples: [
      {
        title: 'Clean filler words before recording',
        code: `Input: "So basically, we're actually just going to really focus on this."\nOutput: 4 filler words flagged: basically, actually, just, really`,
        note: 'Flags the specific named category rather than a general word count.',
      },
      {
        title: 'Spot a hedging habit in writing',
        code: `Input: [500-word draft]\nOutput: "just" used 9 times, "actually" used 6 times`,
        note: 'Surfaces a pattern a general frequency count would list without context.',
      },
    ],
  },

  flip: {
    description: `Rotating an image spins it to a different angle while text and faces stay oriented the same relative way, but flipping actually mirrors an image left to right or top to bottom, which is exactly why text or a logo turns backward and unreadable under a flip in a way it never would under a rotation, two genuinely different operations that solve different problems. This tool flips an image horizontally or vertically, producing a true mirror effect rather than a rotation to a different angle. Useful for correcting a selfie that looks mirrored compared to how other people actually see your face, since a phone's front camera preview is often flipped from reality, mirroring a graphic intentionally for a design that calls for it, or fixing an image that's backward rather than simply sideways.`,
    examples: [
      {
        title: 'Correct a mirrored selfie',
        code: `Input: selfie.jpg (front camera, mirrored)\nOutput: selfie-flipped.jpg (matches how others actually see you)`,
        note: 'Reverses the mirror effect rather than rotating to a new angle.',
      },
      {
        title: 'Mirror a graphic intentionally',
        code: `Input: arrow-icon.png (pointing right)\nOutput: arrow-icon-flipped.png (pointing left)`,
        note: 'Produces a true mirror image rather than a rotated one.',
      },
    ],
  },

  'google-algorithm-tracker': {
    description: `Google rarely announces the specifics of an algorithm change directly, most updates get identified after the fact by the SEO community noticing ranking volatility across many sites at once, which means the real value of tracking these updates is connecting a specific date a site's traffic mysteriously shifted to a documented update that actually rolled out around then, rather than being left to wonder what happened. This tool tracks major Google algorithm updates and the SEO factors each one actually affected, turning an unexplained ranking change into a dated event with a known cause. Useful for connecting a sudden traffic drop to a specific documented algorithm update instead of guessing at the cause, checking which SEO factors a recent update actually targeted before making a reactive change, or reviewing a timeline of major updates when investigating a longer-term ranking trend.`,
    examples: [
      {
        title: 'Connect a traffic drop to a documented update',
        code: `Input: traffic dropped March 12, 2026\nOutput: "March 2026 Core Update" rolled out March 10-14, targeted content quality signals`,
        note: 'Turns an unexplained date into a known, documented cause.',
      },
      {
        title: 'Check what a recent update actually targeted',
        code: `Input: latest update\nOutput: "Targeted: thin affiliate content, AI-generated spam pages"`,
        note: 'Shows which specific SEO factors a given update affected.',
      },
    ],
  },

  'google-serp-simulator': {
    description: `Google doesn't truncate a title or a description at a fixed character count the way a simple counter assumes, it actually measures pixel width, since a lowercase i takes up noticeably less horizontal space than an uppercase W, which means a character-count estimate can say a title fits fine while Google's actual rendering cuts it off mid-word. This tool simulates a webpage's title, description, and URL exactly as Google would render them, based on the same pixel-width truncation Google actually applies rather than a simpler character count. Useful for seeing exactly where a title actually gets cut off in a real Google result rather than trusting a character-count estimate, checking whether a wide-character title truncates earlier than expected, or previewing a page's actual search appearance before publishing rather than assuming a character limit alone predicts it correctly.`,
    examples: [
      {
        title: 'See exactly where a title truncates',
        code: `Input: "The Complete Wide-Character Title Guide for iiiWWW Comparisons"\nOutput: renders truncated based on actual pixel width, not character count`,
        note: "Matches Google's real pixel-based truncation rather than a character estimate.",
      },
      {
        title: 'Preview title, description, and URL together',
        code: `Input: page title, meta description, URL\nOutput: full SERP snippet as it would actually render`,
        note: 'Shows the complete result as Google would display it, not each piece separately.',
      },
    ],
  },

  'grammar-checker-pro': {
    description: `Whether a sentence is grammatically correct and whether it reads as too aggressive, too formal, or too casual for the situation it's being used in are two entirely different questions, the first has a right answer, the second is a matter of tone that a basic error-flagging grammar checker was never built to evaluate at all. This tool checks grammar and spelling while also detecting a piece of writing's actual tone, offering style suggestions alongside mechanical corrections rather than error-flagging alone. Useful for checking whether a professional email actually reads as too blunt or too formal before sending it, catching both a grammar mistake and a tone problem in the same review, or getting style feedback on writing that's already grammatically correct but doesn't read the way it was intended to.`,
    examples: [
      {
        title: 'Catch a tone problem alongside a grammar error',
        code: `Input: "Your wrong about this and you need to fix it now."\nOutput: grammar: "Your" -> "You're" | tone: reads as blunt/aggressive`,
        note: 'Flags both a mechanical error and a tone issue in one pass.',
      },
      {
        title: 'Check a professional email before sending',
        code: `Input: [draft email]\nOutput: tone: "reads as overly formal for an internal message"`,
        note: "Evaluates how the writing lands, not just whether it's correct.",
      },
    ],
  },

  grayscale: {
    description: `A full black-and-white conversion strips out every trace of color, but that's not always the look actually wanted, a partially desaturated photo, muted rather than fully monochrome, is a distinctly more contemporary editorial style than a stark, dated-feeling full grayscale switch flipped all the way on. This tool converts images to grayscale with adjustable intensity, allowing a partial desaturation rather than only a full black-and-white conversion. Useful for applying a subtle, muted color treatment that stops short of full monochrome for a modern editorial look, converting a photo to classic full black-and-white when that starker effect is actually wanted, or dialing in exactly how much color to strip out rather than committing to an all-or-nothing switch.`,
    examples: [
      {
        title: 'Apply a subtle, muted desaturation',
        code: `Input: photo.jpg, intensity: 60%\nOutput: photo-muted.jpg (partially desaturated, not full black and white)`,
        note: 'Stops short of full monochrome for a more contemporary look.',
      },
      {
        title: 'Convert to classic full black and white',
        code: `Input: portrait.jpg, intensity: 100%\nOutput: portrait-bw.jpg`,
        note: 'Applies a complete grayscale conversion when that starker effect is wanted.',
      },
    ],
  },

  'hash-from-text': {
    description: `Verifying a downloaded file's checksum against a webpage that posted its hash means matching whichever specific algorithm that page actually used, MD5, SHA-1, SHA-256, and generating each one separately with a different single-purpose tool just to find the one that matches is a slower path than generating all of them from the same text at once and comparing directly. This tool generates hashes from text using multiple hashing algorithms simultaneously, producing every common output together rather than committing to one algorithm at a time. Useful for generating MD5, SHA-1, and SHA-256 hashes from the same input at once to match whichever one a source actually posted, comparing hash lengths and formats across algorithms side by side, or checking several possible hash matches without switching between separate single-algorithm tools.`,
    examples: [
      {
        title: 'Generate multiple hashes to match a posted checksum',
        code: `Input: "hello world"\nOutput: MD5: 5eb63bbbe01eeed093cb22bb8f5acdc3, SHA-1: 2aae6c35..., SHA-256: b94d27b9...`,
        note: 'Produces every common algorithm at once to match whichever one a source used.',
      },
      {
        title: 'Compare hash formats side by side',
        code: `Input: "test123"\nOutput: MD5 (32 chars), SHA-1 (40 chars), SHA-256 (64 chars)`,
        note: 'Shows length and format differences across algorithms for the same input.',
      },
    ],
  },

  'hex-color-picker': {
    description: `Not every color pick needs a wheel to explore, a format to switch between after the fact, or an alpha channel factored in, sometimes the actual need is just picking a color and getting HEX, RGB, HSL, and ready-to-paste CSS all at once, the standard formats a project most commonly needs without anything more specialized layered on top. This tool picks a color visually and returns HEX, RGB, HSL, and CSS values together with a live preview swatch, built as the everyday, no-frills default rather than a picker built around one specific specialized feature. Useful for picking a color quickly and getting the four most commonly needed formats without any extra configuration, grabbing a ready-to-paste CSS value straight from a live swatch preview, or reaching for the simplest picker available when nothing more specialized is actually needed.`,
    examples: [
      {
        title: 'Pick a color and get every standard format at once',
        code: `Picked: #2563EB\nOutput: HEX #2563EB, RGB(37, 99, 235), HSL(217°, 83%, 53%), CSS-ready value`,
        note: 'Returns the four most commonly needed formats together.',
      },
      {
        title: 'Grab a ready-to-paste CSS value',
        code: `Picked: swatch preview\nOutput: color: #2563EB;`,
        note: 'The simplest default picker when nothing more specialized is needed.',
      },
    ],
  },
};

export default FIX_BATCH_99;
