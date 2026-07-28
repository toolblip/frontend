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

const FIX_BATCH_33: Record<string, FixBatchEntry> = {
  'repair-defects': {
    description: `A scratch across an old photo, a water stain that's bled into the paper, a crease where the print got folded decades ago, these are physical damage to the original print itself rather than something wrong with the photo's focus or an unwanted object that wandered into frame, and fixing them means reconstructing what the damaged area would have looked like undamaged rather than just sharpening or cropping. This tool identifies that kind of physical defect, scratches, stains, tears, fading, and repairs it by rebuilding the affected area from the surrounding image detail. Useful for restoring a decades-old family photo that's picked up scratches and stains from years in a box, repairing a crease line running through an inherited print before scanning it for the family archive, or bringing a faded, damaged photo back closer to how it originally looked.`,
    examples: [
      {
        title: 'Repair scratches on an old family photo',
        code: `Input: grandparents-1965.jpg (visible scratches across the image)\nOutput: grandparents-1965-repaired.jpg (scratches removed, detail reconstructed)`,
        note: 'Rebuilds the damaged areas from surrounding image detail rather than just blurring over them.',
      },
      {
        title: 'Fix a crease line before archiving a scan',
        code: `Input: inherited-photo-scan.jpg (fold crease across the middle)\nOutput: inherited-photo-scan-repaired.jpg`,
        note: 'Removes physical damage from the print itself, not an unwanted object or blur.',
      },
    ],
  },

  'countdown-timer': {
    description: `A speaker glancing at their phone mid-presentation looks distracted and breaks the flow of a talk, which is exactly the problem a visible countdown solves instead: a timer running where a speaker can see it out of the corner of their eye, with a threshold alert that changes color or sounds a warning when time is running short, rather than something checked by looking away from the audience. This tool sets a countdown for a specific duration with an alert at the end, or at a chosen point before time runs out, signaling a talk is wrapping up without anyone needing to check a device. Useful for managing a presentation's time budget without breaking eye contact with an audience, running a timed meeting segment where everyone can see how much time is left, or getting an early warning before a countdown reaches zero rather than only at the very end.`,
    examples: [
      {
        title: "Manage a presentation's time visibly",
        code: `Duration: 20:00, warning at: 5:00 remaining (turns red)\nOutput: visible countdown, no phone-checking required`,
        note: 'Lets a speaker track time without looking away from the audience.',
      },
      {
        title: 'Set an early warning before time runs out',
        code: `Duration: 45:00, alert at: 10:00 remaining\nOutput: warning sound at 35:00 elapsed, final alert at 45:00`,
        note: 'Gives advance notice instead of only alerting when the countdown hits zero.',
      },
    ],
  },

  'temperature-unit-converter': {
    description: `Celsius, Fahrenheit, and Kelvin cover almost every everyday and scientific context, but Rankine still shows up specifically in certain US engineering and thermodynamics calculations, an absolute temperature scale like Kelvin, starting at true zero, but sized in Fahrenheit-scale degrees rather than Celsius-scale ones, which makes it a genuinely different animal from the other three rather than just another everyday unit. This tool converts between all four, Celsius, Fahrenheit, Kelvin, and Rankine, covering the rare scale most everyday converters skip entirely alongside the three that come up constantly. Useful for a thermodynamics or aerospace engineering calculation that specifically works in Rankine, converting a Rankine value from a textbook or a technical spec into a more familiar scale, or handling the full range of four scales in one place instead of needing a separate reference for the one scale most tools leave out.`,
    examples: [
      {
        title: 'Convert a Rankine value from an engineering spec',
        code: `Input: 530 °R\nOutput: 70.33°F | 21.29°C`,
        note: 'Handles the one scale most everyday converters leave out entirely.',
      },
      {
        title: 'Convert Celsius to Kelvin and Rankine together',
        code: `Input: 25°C\nOutput: 298.15 K | 536.67 °R`,
        note: 'Covers all four scales from a single input.',
      },
    ],
  },

  'remove-text-photo': {
    description: `Text baked directly into an image, a caption burned into a screenshot, a label stamped across a scanned document, a subtitle embedded in a video frame grab, can't be edited or deleted the way real text can, since it's just pixels shaped like letters rather than an actual text layer sitting on top of the image. This tool erases that embedded text and reconstructs the area underneath from the surrounding image detail, rather than leaving a blank box or a visible patch where the text used to be. Useful for removing a caption baked into a screenshot before reusing the image elsewhere, cleaning a stamped label or watermark text off a scanned document, or erasing an embedded subtitle from a video frame grab that's being reused as a standalone image.`,
    examples: [
      {
        title: 'Remove a caption baked into a screenshot',
        code: `Input: screenshot.png (caption text burned into the image)\nOutput: screenshot-clean.png (caption removed, background reconstructed)`,
        note: 'Removes text that was rendered as pixels, not an editable text layer.',
      },
      {
        title: 'Clean a stamped label off a scanned document',
        code: `Input: scanned-form.jpg ("SAMPLE" stamped across the page)\nOutput: scanned-form-clean.jpg`,
        note: 'Reconstructs the area under the stamp instead of leaving a visible gap.',
      },
    ],
  },

  'password-strength-checker': {
    description: `A password that satisfies every common composition rule, one uppercase letter, one number, one symbol, can still be genuinely weak if it follows a predictable pattern like capitalizing the first letter and tacking a "1!" onto the end, exactly the kind of password composition rules encourage without actually measuring how unpredictable the result really is. Entropy measures that unpredictability directly, in bits, rather than checking off a checklist of character types, which is a meaningfully different and more honest way to score a password's actual strength. This tool checks a password's entropy and returns specific, practical suggestions for genuinely improving it, rather than just a pass or fail against composition rules. Useful for understanding why a password that technically meets every complexity rule might still be weak, or getting concrete suggestions for strengthening a password beyond just adding another required character type.`,
    examples: [
      {
        title: 'Reveal a weak password despite meeting complexity rules',
        code: `Input: "Password1!"\nOutput: entropy: 28 bits (weak), meets composition rules but follows a predictable pattern`,
        note: 'Composition rules alone would mark this password as compliant despite its low actual entropy.',
      },
      {
        title: 'Get specific improvement suggestions',
        code: `Input: "Summer2024"\nOutput: entropy: 34 bits, suggestion: add unrelated random words instead of a predictable year suffix`,
        note: 'Points to what specifically weakens the password instead of a generic strength label.',
      },
    ],
  },

  'percentage-difference': {
    description: `Percentage change and percentage difference sound like the same idea but measure something genuinely different: percentage change has a clear direction, an original value moving to a new one, so the increase or decrease is calculated against that specific starting point, while percentage difference is symmetric, comparing two values without treating either one as the "before" value, typically measured against their average instead. This tool calculates percentage difference specifically, with options for a directional or an absolute result, rather than conflating it with the more commonly seen percentage change calculation that assumes one value came before the other. Useful for comparing two measurements where neither one is genuinely the original or the baseline, checking the discrepancy between two independent readings of the same thing, or getting the specific percentage difference calculation a report or a formula explicitly calls for rather than a generic percentage change.`,
    examples: [
      {
        title: 'Compare two independent measurements',
        code: `Input: 45 and 50 (neither is the "original")\nOutput: 10.5% difference (measured against the average of both)`,
        note: 'Uses the average of both values rather than treating one as the baseline.',
      },
      {
        title: 'Get a directional result when one value is the baseline',
        code: `Input: from 45 to 50, mode: directional\nOutput: +11.1% (relative to 45 specifically)`,
        note: 'Switches to a directional calculation when one value genuinely is the starting point.',
      },
    ],
  },

  'image-background-remover': {
    description: `Removing a background from a photo of an ID document, a private family photo, or anything else genuinely sensitive means the image itself is worth thinking twice about before uploading anywhere, since a server-side tool means that photo actually left your device and sat somewhere else's storage, however briefly. This tool processes the background removal entirely inside the browser, so the image never gets uploaded anywhere at all, the same privacy guarantee that matters most for exactly the kind of photo where background removal is being considered in the first place. Useful for removing the background from a genuinely sensitive photo without it ever leaving your own device, processing an image with no internet connection needed once the tool itself has loaded, or handling a batch of private photos where uploading each one somewhere isn't something you want to do repeatedly.`,
    examples: [
      {
        title: 'Remove a background from a sensitive document photo',
        code: `Input: id-photo.jpg (processed entirely in-browser)\nOutput: id-photo-cutout.png (background removed, never uploaded)`,
        note: 'The image never leaves the device at any point in the process.',
      },
      {
        title: 'Process a batch of private photos',
        code: `Input: 10 personal photos\nOutput: 10 background-removed images, all processed locally`,
        note: 'No repeated uploads for a set of images that should stay off a server.',
      },
    ],
  },

  'url-encode': {
    description: `A URL you've received already percent-encoded, %20 where a space should be, %3D standing in for an equals sign, is hard to actually read at a glance, which matters when you're trying to figure out what a link or a query string actually says rather than encoding something yourself. This tool handles both directions: encoding a raw string into its percent-encoded, URL-safe form, and decoding an already-encoded URL back into readable text so the actual content underneath the encoding becomes clear. Useful for decoding a URL full of percent-encoded characters to see what it actually contains, encoding a value with spaces or special characters before it goes into a link, or checking that an encoded and decoded round-trip of the same URL comes back exactly the way it started.`,
    examples: [
      {
        title: 'Decode a percent-encoded URL to read it',
        code: `Input: https://example.com/search?q=hello%20world%26more\nOutput: https://example.com/search?q=hello world&more`,
        note: 'Reveals what an encoded URL actually says before you have to decode it manually.',
      },
      {
        title: 'Encode a value before adding it to a link',
        code: `Input: "café & bar"\nOutput: caf%C3%A9%20%26%20bar`,
        note: 'Produces a URL-safe encoded string for a value with spaces and special characters.',
      },
    ],
  },

  'sitemap-html-generator': {
    description: `An XML sitemap exists purely for search engine crawlers and is invisible to an actual visitor, which is a completely different job from an HTML sitemap, a real page on the site itself, linked from the footer, that a person can click through to see every page laid out in one navigable list, useful both for a visitor trying to find something and a crawler that benefits from another set of internal links to follow. This tool builds that HTML sitemap page from a list of URLs, generating clean, organized links a visitor can actually click through rather than the machine-readable format meant only for crawlers. Useful for adding a genuine sitemap page to a site's footer, giving search engines an additional set of internal links to discover pages through, or building a clean directory page for a site with enough pages that regular navigation menus don't cover everything.`,
    examples: [
      {
        title: 'Build a footer sitemap page',
        code: `Input: 45 site URLs\nOutput: sitemap.html with organized, clickable links to every page`,
        note: 'Gives visitors an actual page to browse, unlike an XML sitemap meant only for crawlers.',
      },
      {
        title: 'Organize a large site into a navigable list',
        code: `Input: 200 URLs grouped by section\nOutput: sitemap.html with links grouped under each site section`,
        note: "Helps a large site's pages stay discoverable beyond the regular navigation menu.",
      },
    ],
  },

  'jwt-decoder': {
    description: `Debugging a real production authentication issue usually means pasting an actual, live JWT into a decoder, a token that might carry a real user's ID, email, or role information inside its payload, which makes where that token actually goes the moment it's pasted in a genuine concern, not just an abstract privacy nicety. This tool decodes a JWT's header and payload entirely inside the browser, so a real token with real user data in it never gets sent to a server anywhere, verifiably rather than just claimed. Useful for debugging a production authentication issue where the token being inspected carries real user data, decoding a token during development without a habit of pasting sensitive data into random online tools, or inspecting a JWT's claims and expiration with confidence about where that data is and isn't going.`,
    examples: [
      {
        title: "Debug a production token's claims safely",
        code: `Input: [real production JWT with user data]\nOutput: decoded payload shown, never transmitted anywhere`,
        note: 'Confirms sensitive token data stays local while still getting the decoded claims.',
      },
      {
        title: 'Check an expiration timestamp during development',
        code: `Input: eyJhbGciOiJIUzI1NiJ9...\nOutput: exp: 1706000000 (Jan 23, 2026, 09:00 UTC)`,
        note: 'Decodes entirely client-side, avoiding the habit of pasting tokens into unknown online tools.',
      },
    ],
  },
};

export default FIX_BATCH_33;
