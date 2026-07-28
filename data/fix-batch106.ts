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

const FIX_BATCH_106: Record<string, FixBatchEntry> = {
  pixelate: {
    description: `A soft blur on a background is meant to look good, an artistic depth-of-field effect that still lets a shape read as recognizable, but obscuring a face or a license plate for actual privacy needs something closer to destroying the underlying detail entirely, which is exactly what pixelation does by averaging a block of pixels down into one flat color rather than just softening the edges around it. This tool pixelates a face or an object directly in a photo, reducing that specific region to blocky, unrecognizable color averages rather than a soft, still-legible blur. Useful for anonymizing a bystander's face in a street photo before posting it publicly, obscuring a license plate or another identifying detail in an image meant to be shared widely, or protecting a minor's identity in a family photo without blurring or cropping out the rest of the scene.`,
    examples: [
      {
        title: "Anonymize a bystander's face",
        code: `Input: street-photo.jpg (stranger visible in background)\nOutput: street-photo-pixelated.jpg (face reduced to blocky color averages)`,
        note: 'Destroys the underlying detail rather than softening it.',
      },
      {
        title: 'Obscure a license plate before sharing',
        code: `Input: car-photo.jpg\nOutput: car-photo-pixelated.jpg (plate area pixelated)`,
        note: 'Produces a genuinely unrecognizable result, not a legible blur.',
      },
    ],
  },

  'plain-text-counter': {
    description: `Text copied out of a Word document or pasted from a web page often carries more than what's visible on screen, curly quotes, non-breaking spaces, leftover formatting markers, characters that inflate a raw count without actually being part of what a reader would see as the real content. This tool counts words and characters in plain text specifically, stripping out formatting and special characters first so the count reflects only genuinely visible content rather than whatever hidden characters happened to tag along during a copy and paste. Useful for getting an accurate word count on text pasted from a formatted document before submitting it somewhere with a strict limit, cleaning hidden formatting characters out of pasted content before counting it, or confirming a plain text count that isn't quietly skewed by invisible characters a normal editor wouldn't show.`,
    examples: [
      {
        title: 'Get an accurate count from pasted content',
        code: `Input: [text pasted from Word, with hidden formatting marks]\nOutput: 412 words, 2,180 characters (formatting stripped first)`,
        note: 'Counts only genuinely visible content, not hidden characters.',
      },
      {
        title: "Confirm a count isn't skewed by invisible characters",
        code: `Input: [text with non-breaking spaces and curly quotes]\nOutput: accurate word and character count, special characters excluded`,
        note: "Reflects what a reader actually sees, not a raw character dump.",
      },
    ],
  },

  'png-compressor': {
    description: `PNG compression is lossless by design, DEFLATE under the hood, which means shrinking a PNG isn't the same tradeoff as compressing a JPEG, there's no quality to sacrifice in exchange for size, only a more efficient encoding to find, better palette reduction, leaner filtering, unnecessary metadata stripped out, all while the image's actual pixel data and its alpha transparency stay completely intact. This tool compresses PNG images to reduce file size while preserving transparency and quality, optimizing the lossless encoding itself rather than trading visible quality away for a smaller file. Useful for shrinking a PNG logo or icon that needs its transparent background to survive the process untouched, reducing a screenshot's file size without introducing any visible quality loss, or compressing a batch of UI graphics where losing even a little sharpness or transparency isn't an acceptable tradeoff.`,
    examples: [
      {
        title: "Shrink a logo without losing transparency",
        code: `Input: logo.png (transparent background, 480 KB)\nOutput: logo-compressed.png (140 KB, transparency intact)`,
        note: 'Optimizes lossless encoding rather than trading away quality.',
      },
      {
        title: "Reduce a screenshot's file size",
        code: `Input: screenshot.png (1.2 MB)\nOutput: screenshot-compressed.png (390 KB, no visible quality loss)`,
        note: 'Shrinks the file with pixel data left completely intact.',
      },
    ],
  },

  'png-to-avif': {
    description: `PNG usually gets chosen specifically because an image needs a transparent background, a logo, an icon, a UI graphic, but that transparency has historically meant accepting PNG's much larger file size as the cost, when AVIF actually supports an alpha channel too and can carry that same transparency at a fraction of PNG's file weight. This tool converts a PNG into AVIF, preserving transparency while moving to a dramatically smaller file rather than assuming transparency requires staying on a larger lossless format. Useful for shrinking a transparent logo or icon's file size without losing its transparent background in the process, converting a UI graphic that needs an alpha channel into a lighter format for faster page loads, or realizing a smaller file was actually available all along instead of defaulting to PNG purely for its transparency support.`,
    examples: [
      {
        title: 'Shrink a transparent logo without losing the alpha channel',
        code: `Input: logo.png (transparent, 210 KB)\nOutput: logo.avif (transparent, 28 KB)`,
        note: 'Carries the same transparency at a fraction of the file size.',
      },
      {
        title: 'Convert a UI graphic for faster page loads',
        code: `Input: icon-set.png\nOutput: icon-set.avif`,
        note: 'Moves off PNG without giving up the alpha channel it was chosen for.',
      },
    ],
  },

  'png-to-ico': {
    description: `A website's favicon and a Windows desktop application's icon are solving genuinely different problems, a favicon lives in a browser tab, while ICO is the format Windows itself expects for an application's taskbar icon, its desktop shortcut, or a Store app tile, built around a different set of required sizes entirely. This tool converts a PNG into ICO format specifically for Windows icons, generating the multiple sizes a Windows application or shortcut actually needs rather than the sizes a website favicon would use. Useful for creating an icon file for a Windows desktop application from a PNG source image, generating a properly sized ICO for a desktop shortcut rather than a browser tab, or producing the specific icon sizes Windows' shell expects instead of a web-oriented favicon set.`,
    examples: [
      {
        title: 'Create an icon for a Windows desktop app',
        code: `Input: app-logo.png\nOutput: app-icon.ico (16, 32, 48, 256px)`,
        note: "Targets Windows' shell requirements, not a browser favicon set.",
      },
      {
        title: 'Generate an ICO for a desktop shortcut',
        code: `Input: shortcut-graphic.png\nOutput: shortcut.ico`,
        note: 'Produces sizes a taskbar and desktop shortcut actually need.',
      },
    ],
  },

  'png-to-svg': {
    description: `A JPEG usually carries compression artifacts that confuse a tracing algorithm into mistaking noise for real edges, but a PNG is often already close to what tracing needs, an icon, a logo, a screenshot, flat colors and clean boundaries with none of that lossy compression noise to begin with, which usually makes for a noticeably cleaner vector trace. This tool converts a PNG into SVG by tracing shapes based on color boundaries, vectorizing an image that's typically already a strong candidate for it rather than fighting compression noise along the way. Useful for vectorizing a logo or an icon saved as PNG so it stays crisp at any size instead of blurring when enlarged, converting a flat-color screenshot or UI graphic into scalable vector paths, or tracing simple line art that was saved as PNG specifically to avoid JPEG's compression artifacts in the first place.`,
    examples: [
      {
        title: 'Vectorize a logo saved as PNG',
        code: `Input: logo.png (flat colors, clean edges)\nOutput: logo.svg (scalable, stays crisp at any size)`,
        note: 'PNG source is typically already a clean tracing candidate.',
      },
      {
        title: 'Convert a flat-color UI graphic',
        code: `Input: icon.png\nOutput: icon.svg`,
        note: 'No lossy compression noise to confuse the tracing algorithm.',
      },
    ],
  },

  'post-writer': {
    description: `A tweet rewards brevity and a sharp hook, LinkedIn rewards a more measured, professional tone with room to actually develop a point, and Instagram leans on a strong opening line plus a relevant hashtag set, which means the same core message genuinely needs different treatment for each platform rather than just the same post trimmed or stretched to fit. This tool writes a social media post optimized for whichever platform it's actually headed to, adapting tone and structure per platform rather than reworking an existing post or writing for one platform alone. Useful for turning one core message into versions genuinely suited to Twitter, LinkedIn, and Instagram rather than one post copied across all three, drafting a new platform-specific post from scratch rather than reworking something already published, or matching a post's tone to what a specific platform's audience actually expects.`,
    examples: [
      {
        title: 'Adapt one message for three platforms',
        code: `Input: "We just launched dark mode"\nOutput: Twitter: punchy one-liner | LinkedIn: feature rationale | Instagram: caption + hashtags`,
        note: 'Adapts tone and structure per platform rather than one-size-fits-all.',
      },
      {
        title: "Draft a new post from scratch",
        code: `Input: topic: "remote team culture", platform: LinkedIn\nOutput: a full new post in a professional, thought-leadership tone`,
        note: 'Writes new content rather than reworking something already posted.',
      },
    ],
  },

  'pressure-converter': {
    description: `A US tire gauge reads in PSI, a European weather report uses hectopascals or millibars, a blood pressure cuff reads in mmHg, and an industrial spec sheet often uses bar or atmospheres, genuinely different conventions by field and region rather than interchangeable labels for the same number, which makes assuming a bar reading translates directly to the same number in PSI a mistake substantial enough to matter, roughly a fourteen-and-a-half-times difference. This tool converts between pascals, bars, PSI, atmospheres, and mmHg instantly, translating a reading from whichever convention it was given in into whatever unit is actually needed. Useful for converting a European tire pressure spec in bar into the PSI a US gauge actually reads, translating a weather report's hectopascal reading into a more familiar unit, or converting a medical or an industrial pressure reading between the specific units each field conventionally uses.`,
    examples: [
      {
        title: 'Convert a European tire spec to PSI',
        code: `Input: 2.3 bar\nOutput: 33.4 PSI`,
        note: 'Catches a near 14.5x mismatch from assuming the numbers match.',
      },
      {
        title: "Translate a weather report's reading",
        code: `Input: 1013 hPa\nOutput: 1 atm / 14.7 PSI`,
        note: 'Converts between the units each field conventionally uses.',
      },
    ],
  },

  'privacy-policy-generator': {
    description: `An NDA mainly needs to define terms clearly between two known parties, but a privacy policy is a public disclosure document that has to accurately describe what a specific website actually does with visitor data, which cookies get set, which analytics or ad services run, what a contact form actually collects, since a generic template omitting an actual tracking cookie in use is legally deficient even though it reads as a complete, professional document. This tool generates a privacy policy for a website, built around the specific disclosures data protection law actually requires rather than only generic legal boilerplate. Useful for generating a starting policy that covers cookie and analytics disclosures a website is required to make, drafting a policy that can be adjusted to match exactly what a site's data practices actually are, or getting a compliant baseline document before a genuinely complex data-handling situation needs actual legal review.`,
    examples: [
      {
        title: 'Generate a policy covering cookie disclosures',
        code: `Input: site uses: Google Analytics, email signup form\nOutput: privacy policy disclosing both data collection points`,
        note: "Reflects what a site actually does, not generic boilerplate.",
      },
      {
        title: 'Draft a baseline before legal review',
        code: `Input: small business website\nOutput: privacy policy draft ready for legal review before launch`,
        note: 'A compliant starting point, not a substitute for real review.',
      },
    ],
  },

  protect: {
    description: `Not every PDF password tool actually protects much, plenty of legacy software still defaults to RC4 40-bit encryption, a scheme that can be cracked in seconds with commonly available software, which means a password that feels like real protection can be barely protecting anything depending on which encryption method actually sits behind it. This tool password-protects a PDF using AES-256 encryption specifically, a modern, genuinely strong standard rather than the weaker encryption some tools still quietly default to. Useful for protecting a contract, a tax document, or another genuinely sensitive PDF with encryption actually strong enough to matter, password-protecting a file before emailing it somewhere that isn't fully trusted, or securing a document with a real, current encryption standard instead of a legacy method that only looks secure.`,
    examples: [
      {
        title: 'Protect a sensitive contract with AES-256',
        code: `Input: contract.pdf, password: [set by user]\nOutput: contract-protected.pdf (AES-256 encrypted)`,
        note: 'Uses a standard that actually resists cracking, not legacy RC4.',
      },
      {
        title: 'Secure a document before emailing it',
        code: `Input: tax-records.pdf\nOutput: tax-records-protected.pdf (password required to open)`,
        note: "Genuine protection for content that isn't fully trusted in transit.",
      },
    ],
  },
};

export default FIX_BATCH_106;
