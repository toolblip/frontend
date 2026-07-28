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

const FIX_BATCH_49: Record<string, FixBatchEntry> = {
  'robots-txt-generator': {
    description: `A single misplaced line in robots.txt, Disallow: / instead of a specific folder, can block every search engine from an entire site without any warning until traffic quietly drops off weeks later, and the file's simple-looking syntax, User-agent, Disallow, Allow, Sitemap, hides exactly how easy that mistake actually is to make by hand. This tool builds a robots.txt file through actual configuration options rather than typing directives from memory, letting specific crawlers be allowed or blocked for specific paths and a sitemap URL added without guessing at syntax. Useful for blocking a crawler from an admin section or a staging folder without accidentally blocking the whole site, allowing one search engine's crawler while restricting another's, or generating a correct robots.txt file for a brand-new site that doesn't have one yet.`,
    examples: [
      {
        title: 'Block a staging folder without blocking the site',
        code: `User-agent: *\nDisallow: /staging/\nAllow: /`,
        note: 'Restricts one path instead of accidentally disallowing the whole site.',
      },
      {
        title: 'Allow one crawler while restricting another',
        code: `User-agent: Googlebot\nAllow: /\n\nUser-agent: BadBot\nDisallow: /`,
        note: 'Targets crawler behavior per user-agent instead of one blanket rule.',
      },
    ],
  },

  'hsl-to-rgb': {
    description: `Picking a color by rotating its hue, nudging it a little more toward orange or a little more toward blue while keeping the same brightness and intensity, is how HSL actually represents color, as a position on a wheel rather than three separate channels mixed together, which makes it the more intuitive format for a designer choosing a shade but not the format a stylesheet or an image file actually stores. This tool converts an HSL value into both RGB and hex, showing a live preview swatch so the converted color can be checked visually rather than trusted on faith. Useful for translating a hue picked on a color wheel into the RGB values a canvas element expects, converting an HSL variable from a design tool into the hex code a stylesheet needs, or confirming a converted shade actually looks right before using it.`,
    examples: [
      {
        title: 'Convert a hue-rotated color',
        code: `Input: hsl(200, 70%, 50%)\nOutput: rgb(38, 149, 217) / #2695D9`,
        note: 'Converts the wheel-based hue/saturation/lightness model into RGB and hex.',
      },
      {
        title: 'Preview before using in CSS',
        code: `Input: hsl(340, 82%, 52%)\nOutput: #E91E63 (live swatch shown)`,
        note: 'Confirms the converted shade visually before dropping it into a stylesheet.',
      },
    ],
  },

  'md5-hash-generator': {
    description: `Comparing a downloaded file against a checksum published alongside it is the actual reason MD5 still gets used today, confirming a file wasn't corrupted or altered in transit, a purpose it still serves well even though it's long been considered too weak for anything security-sensitive like storing a password. This tool generates an MD5 hash from pasted text or an uploaded file using the browser's own native crypto API, meaning nothing actually gets uploaded to a server to be hashed elsewhere. Useful for verifying a downloaded file matches its published checksum before trusting it, generating a quick hash to confirm two files are actually identical, or producing an MD5 value for a legacy system that still expects one, all without the file ever leaving the browser.`,
    examples: [
      {
        title: 'Verify a downloaded file',
        code: `Input: installer.zip\nOutput: 5d41402abc4b2a76b9719d911017c592\nPublished checksum: 5d41402abc4b2a76b9719d911017c592 -> match`,
        note: "Confirms the file wasn't corrupted or altered during download.",
      },
      {
        title: 'Hash a piece of text',
        code: `Input: "hello world"\nOutput: 5eb63bbbe01eeed093cb22bb8f5acdc3`,
        note: "Runs entirely through the browser's native crypto API, nothing uploaded.",
      },
    ],
  },

  'character-variety-checker': {
    description: `A password policy requiring an uppercase letter, a lowercase letter, a digit, and a special symbol is easy enough to state but tedious to verify by eye in a longer string, especially one that was randomly generated and needs confirming rather than just trusted. This tool checks a piece of text for exactly that variety, flagging whether uppercase, lowercase, digits, and special symbols are each actually present rather than leaving someone to scan the string manually. Useful for confirming a randomly generated password actually satisfies a site's complexity requirement before submitting it, checking a chosen password against a policy before an account gets locked out at signup, or verifying a generated string used elsewhere actually contains the character variety a system expects.`,
    examples: [
      {
        title: 'Check a password against complexity rules',
        code: `Input: "Summer2024!"\nOutput: uppercase ✓, lowercase ✓, digit ✓, symbol ✓`,
        note: 'Confirms every required character type is actually present.',
      },
      {
        title: 'Flag a missing requirement',
        code: `Input: "summer2024"\nOutput: uppercase ✗, lowercase ✓, digit ✓, symbol ✗`,
        note: 'Points out exactly which character type is missing before submission.',
      },
    ],
  },

  'image-square-fit': {
    description: `Fitting a landscape photo into a perfectly square frame usually means cropping it, cutting off part of the actual subject to force the proportions, which works until the cropped edge happens to slice through someone's face or a detail that mattered. This tool fits any image into a square canvas by padding around it with a background color instead of cropping, preserving the entire original photo rather than trimming any of it away. Useful for preparing a non-square photo for a platform that requires a square image, like a profile picture or an Instagram grid slot, without losing part of the subject, matching a background color to a brand's palette while fitting a wide photo into a square post, or standardizing a batch of differently shaped photos into one consistent square format.`,
    examples: [
      {
        title: 'Fit a landscape photo without cropping',
        code: `Input: 1600x900 photo, background: white\nOutput: 1600x1600 canvas, photo centered with white padding top and bottom`,
        note: 'Preserves the entire original photo instead of cutting off the edges.',
      },
      {
        title: 'Match padding to a brand color',
        code: `Input: 1200x800 photo, background: #1A1A2E\nOutput: 1200x1200 canvas with matching dark padding`,
        note: 'Keeps the square format consistent with a brand palette.',
      },
    ],
  },

  'security-headers-generator': {
    description: `CSP, HSTS, and X-Frame-Options each defend against a completely different kind of attack, CSP restricts which script sources a page will actually execute to blunt cross-site scripting, HSTS forces every connection over HTTPS to prevent a downgrade to plain HTTP, and X-Frame-Options stops a page from being embedded inside someone else's iframe to prevent clickjacking, three distinct defenses easy to conflate as one generic security setting. This tool generates the actual header syntax for each of these protections and more, ready to drop into a server config rather than assembled from scattered documentation. Useful for adding a Content-Security-Policy without hand-writing its directive syntax, enabling HSTS correctly on a domain that's fully moved to HTTPS, or preventing a page from being framed by an unrelated site through clickjacking.`,
    examples: [
      {
        title: 'Generate a Content-Security-Policy header',
        code: `Output: Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.example.com`,
        note: 'Restricts which script sources the page will execute.',
      },
      {
        title: 'Generate HSTS and X-Frame-Options headers',
        code: `Output:\nStrict-Transport-Security: max-age=63072000; includeSubDomains\nX-Frame-Options: DENY`,
        note: "Forces HTTPS and blocks the page from being embedded in another site's iframe.",
      },
    ],
  },

  'backlink-checker-express': {
    description: `Knowing which other sites actually link to a page matters for two different reasons, understanding your own site's link profile and seeing where a competitor's authority is actually coming from, and neither is answerable just by looking at the page itself, only by seeing who points to it from the outside. This tool analyzes backlinks pointing to any URL, estimating each linking domain's authority and flagging whether a link is dofollow or nofollow, distinguishing a link that actually passes ranking value from one that doesn't. Useful for auditing your own site's backlink profile after a content campaign to see what actually earned links, researching where a competitor's search authority is actually coming from, or checking whether a specific backlink is a dofollow link worth counting on or a nofollow one that isn't.`,
    examples: [
      {
        title: 'Audit backlinks pointing to a page',
        code: `Input: example.com/guide\nOutput: 214 backlinks from 58 domains, top domain authority: 71`,
        note: 'Shows which external domains actually link to a specific page.',
      },
      {
        title: 'Check whether a link passes ranking value',
        code: `Input: referring page: blog.example.org/review\nOutput: dofollow link, estimated domain authority: 44`,
        note: 'Distinguishes a dofollow link from a nofollow one that carries no ranking weight.',
      },
    ],
  },

  'css-animation-generator': {
    description: `A simple hover transition moves between exactly two states, but a bounce, a pulse, or any animation that needs several distinct waypoints along the way requires @keyframes specifically, a different CSS feature entirely from a two-state transition, one that also needs its own timing, iteration count, and easing curve tuned to actually look right. This tool builds a @keyframes animation through a visual editor, adjusting timing, how many times it repeats, and the easing curve that shapes its motion, then outputs the actual CSS rather than requiring each keyframe percentage to be hand-tuned by trial and error. Useful for building a multi-step animation like a bounce or a pulse that a simple transition can't express, fine-tuning an easing curve visually instead of guessing at cubic-bezier values, or generating a repeating animation with a specific iteration count for a loading indicator.`,
    examples: [
      {
        title: 'Build a multi-step bounce animation',
        code: `Output:\n@keyframes bounce {\n  0% { transform: translateY(0); }\n  50% { transform: translateY(-20px); }\n  100% { transform: translateY(0); }\n}\nanimation: bounce 1s ease-in-out infinite;`,
        note: 'Generates several waypoints instead of a simple two-state transition.',
      },
      {
        title: 'Adjust easing and iteration count visually',
        code: `Settings: duration 2s, iterations: 3, easing: cubic-bezier(0.68, -0.55, 0.27, 1.55)\nOutput: animation: pulse 2s cubic-bezier(0.68, -0.55, 0.27, 1.55) 3;`,
        note: 'Tunes the motion curve visually instead of guessing at cubic-bezier values.',
      },
    ],
  },

  'collage-maker': {
    description: `A single reshaped photo solves a different problem than arranging several separate images into one combined layout, a wedding album montage, a grid of vacation photos, or a nine-panel Instagram preview all need multiple images placed together with consistent borders rather than one image adjusted on its own. This tool arranges multiple photos into a chosen layout, with borders and spacing customizable between each image, building an actual combined collage rather than reshaping a single picture. Useful for building a photo grid from a vacation or an event to share as one combined image, laying out a nine-panel preview for an Instagram feed before posting each photo individually, or assembling a montage of several photos into a single shareable image with consistent borders throughout.`,
    examples: [
      {
        title: 'Build a grid layout from vacation photos',
        code: `Input: 6 photos, layout: 3x2 grid, border: 8px white\nOutput: single combined collage image`,
        note: 'Arranges several photos together instead of reshaping one image.',
      },
      {
        title: 'Create a nine-panel Instagram preview',
        code: `Input: 9 photos, layout: 3x3 grid, border: 4px\nOutput: preview.jpg showing all nine panels together`,
        note: 'Lets a whole feed layout be previewed before posting each photo individually.',
      },
    ],
  },

  'html-validator': {
    description: `Markup that renders fine in one browser can still be missing a closing tag, using an element deprecated a decade ago, or leaving out an alt attribute a screen reader actually depends on, none of which show up as a visible error since a browser quietly works around most broken markup instead of failing loudly. This tool validates HTML and flags a missing tag, a deprecated element, or an accessibility issue like a missing alt attribute, catching problems a browser silently tolerates rather than waiting for them to surface as an actual bug. Useful for catching a missing closing tag left over from an edit before it causes a rendering problem in a different browser, finding a deprecated element still lingering from an old redesign, or confirming images actually have alt text before a page ships to production.`,
    examples: [
      {
        title: 'Catch a missing closing tag',
        code: `Input: <div><p>Hello</div>\nOutput: error - <p> is never closed`,
        note: 'Flags markup a browser silently tolerates instead of rejecting outright.',
      },
      {
        title: 'Flag a missing alt attribute',
        code: `Input: <img src="banner.jpg">\nOutput: warning - <img> is missing an alt attribute`,
        note: 'Catches an accessibility issue a plain syntax check would miss.',
      },
    ],
  },
};

export default FIX_BATCH_49;
