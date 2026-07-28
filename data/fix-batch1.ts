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

const FIX_BATCH_1: Record<string, FixBatchEntry> = {
  'countdown-timer': {
    description: `A countdown timer answers one question: how much time is left before something happens. Type in hours, minutes, and seconds, hit start, and watch the numbers tick down to zero. When time runs out, a sound plays so you don't have to keep the tab in view. That's different from a stopwatch, which only counts up and tells you how long something took after the fact. Use it for timing a presentation rehearsal, a study block, an egg boiling on the stove, or the last five minutes of a meeting when everyone starts talking over each other. You can pause it mid-run if you get interrupted, then pick up where you left off. There's no install, no account, and nothing interrupting the countdown itself with ads.`,
    examples: [
      {
        title: 'Set a 25-minute focus block',
        code: `Duration: 25:00\nAlert: chime + tab title flash\nAuto-restart: off`,
        note: 'A single Pomodoro-style sprint before a short break.',
      },
      {
        title: 'Track a 3-minute soft-boiled egg',
        code: `Duration: 3:00\nAlert: bell sound\nPause allowed: yes`,
        note: "Pause if you need to check the stove, then resume without losing the count.",
      },
    ],
  },

  'syllable-word-counter': {
    description: `Word counters tell you how many words you wrote. This tool goes a layer deeper and counts the syllables inside each word, then uses that number to estimate how hard the text is to read. Paste in a paragraph and you'll see a syllable count per word alongside an overall reading level, roughly matching the grade of student who could follow it without struggling. Poets use it to check meter when writing haiku or limericks, where the syllable count in each line actually matters. Teachers use it to check whether a handout matches their class's reading ability before printing fifty copies. Copywriters use it to catch sentences that sound simple but are secretly packed with three- and four-syllable words that slow readers down.`,
    examples: [
      {
        title: 'Check haiku meter',
        code: `Line: "An old silent pond"\nSyllables: 5 (an-1, old-1, si-lent-2, pond-1)`,
        note: 'Confirms the line fits the five-syllable opening line of a haiku.',
      },
      {
        title: 'Estimate the reading level of a sentence',
        code: `Text: "The mitochondria is the powerhouse of the cell."\nSyllables: 17 across 9 words\nEstimated level: Grade 9`,
        note: '"Mitochondria" alone carries five syllables, which pulls the grade estimate higher than word count alone would suggest.',
      },
    ],
  },

  'color-temperature-adjuster': {
    description: `Every color has a temperature, not just a hue. This tool takes a starting color and pushes it toward the orange-red end (warmer) or the blue end (cooler) using a slider, similar to the white balance dial on a camera. That's a different move than adjusting hue or saturation: instead of rotating around the color wheel, you're shifting how the color feels, cozy candlelight versus cold fluorescent light. Designers use it to test how a brand's primary color reads under a warm dawn palette compared to a cool midnight one. Photographers and video editors apply the same logic to correct a shot that came out too blue from cloudy daylight, or too orange from tungsten bulbs. Enter a hex code, drag the slider, and watch the RGB and hex values update as the color drifts.`,
    examples: [
      {
        title: 'Warm up a UI accent color',
        code: `Input: #4A90D9 (cool blue)\nTemperature: +40\nOutput: #C97A4A (warm orange-brown)`,
        note: 'Pushes a cool blue accent toward a warmer tone for a sunset-themed layout.',
      },
      {
        title: 'Correct a cloudy-day photo tint',
        code: `Input: #B8C9E0 (blue-cast white)\nTemperature: -25\nOutput: #E8E0C9 (neutral warm white)`,
        note: 'Counteracts the blue cast that overcast daylight often adds to a photo.',
      },
    ],
  },

  'area-converter': {
    description: `Area doesn't scale the way length does. Double the side of a square and the area goes up four times, not two, which is exactly why converting square feet to square meters by hand trips people up. This tool skips the mental math: enter a value in one area unit and get the equivalent in square meters, square feet, acres, hectares, square yards, and more, all updating together as you type. It's built for the moments unit conversion actually matters in real life: sizing up an apartment listing that gives square meters when you only think in square feet, comparing a farm's hectares to the acres on an American land deed, or figuring out how a soccer pitch's dimensions stack up against a football field. Switch the input unit any time without starting over.`,
    examples: [
      {
        title: 'Compare an apartment listing',
        code: `Input: 75 square meters\nOutput: 807.29 square feet | 0.0185 acres`,
        note: 'Useful when a European listing is in square meters but you think in square feet.',
      },
      {
        title: 'Convert farmland hectares to acres',
        code: `Input: 12 hectares\nOutput: 29.65 acres | 129,167 square feet`,
        note: 'Common when comparing metric land records against a US deed measured in acres.',
      },
    ],
  },

  'whois-lookup': {
    description: `Every registered domain has a paper trail: who registered it, which registrar they used, when it expires, and which name servers point traffic to it. This tool pulls that record for any domain you type in, no command line needed. Check it before buying a domain that looks unregistered, since sometimes it's actually parked and quietly approaching expiry, which means it might become available without an auction. Site owners use it to confirm their own renewal date so a domain doesn't lapse by accident and end up in someone else's hands. It's also useful when debugging why email or DNS records aren't propagating: the name servers listed here show exactly where a domain's configuration actually lives, which sometimes isn't the host you'd expect. Results include the registrar, creation date, expiry date, and current status.`,
    examples: [
      {
        title: 'Check when a domain expires',
        code: `Input: example.com\nRegistrar: Example Registrar Inc.\nExpiry Date: 2027-03-14\nStatus: clientTransferProhibited`,
        note: 'Confirms a renewal deadline before a domain lapses and becomes available to anyone.',
      },
      {
        title: 'Find name servers for DNS debugging',
        code: `Input: mysite.dev\nName Servers: ns1.hostprovider.com, ns2.hostprovider.com`,
        note: "Reveals which provider actually controls DNS when email or subdomain records aren't resolving.",
      },
    ],
  },

  'html-attribute-encoder': {
    description: `Encoding text for an HTML attribute isn't quite the same job as encoding text for the page body. A double quote inside a title attribute, or a stray apostrophe inside a single-quoted value, closes the attribute early and breaks the tag, sometimes in ways that let an attacker inject their own markup. This tool takes any string and escapes the characters that matter specifically inside attribute values: quotes, ampersands, and angle brackets, so it's safe to drop straight into title="...", value="...", or a data-* attribute without worrying about malformed HTML. Paste user-generated text, a filename with an apostrophe, or a JSON blob you're stuffing into a data attribute, and get back a version that won't break out of the surrounding quotes. Handy for templating engines that don't auto-escape attributes the way they escape body text.`,
    examples: [
      {
        title: 'Encode a title attribute containing quotes',
        code: `Input: She said "hello" & waved\nOutput: She said &quot;hello&quot; &amp; waved`,
        note: 'Safe to place inside title="..." without the quotes closing the attribute early.',
      },
      {
        title: 'Encode an apostrophe for a single-quoted value',
        code: `Input: O'Brien's Diner\nOutput: O&#39;Brien&#39;s Diner`,
        note: "Prevents an apostrophe from ending a value='...' attribute before the string finishes.",
      },
    ],
  },

  'grammar-score-checker': {
    description: `A grammar checker usually just lists what's wrong. This tool rolls everything into a single quality score, so you can tell at a glance whether a draft is in good shape or needs another pass before you send it. Paste in your text and you'll get the score alongside the specific issues behind it: subject-verb agreement slips, run-on sentences, misplaced modifiers, and awkward phrasing that a spell checker would never catch. It's built for situations where you're revising the same piece more than once, a cover letter, a college essay, a client email, and want a quick number confirming the second draft actually improved on the first instead of just feeling different. Students use it to gauge whether an assignment is ready to submit; professionals use it as a last check before hitting send on something that matters.`,
    examples: [
      {
        title: 'Score a cover letter draft',
        code: `Input: "Me and my team has finished the project early."\nScore: 62/100\nIssue: subject-verb agreement ("has" -> "have"), pronoun case ("Me" -> "My team and I")`,
        note: 'Flags the specific grammar rule broken, not just that something reads oddly.',
      },
      {
        title: 'Compare two revisions of the same paragraph',
        code: `Draft 1 Score: 71/100\nDraft 2 Score: 89/100\nFixed: 3 run-on sentences, 1 dangling modifier`,
        note: 'Confirms a rewrite actually fixed the underlying issues rather than just rearranging words.',
      },
    ],
  },

  'font-to-png': {
    description: `Web fonts don't always travel well outside a browser, and some licenses don't even allow embedding them in CSS at all. This tool sidesteps both problems by rendering your text straight into a flat PNG image using the font, size, and color you pick, so the output looks identical whether it's dropped into a slide deck, a social graphic, or an email that strips custom fonts entirely. Type your text, choose a typeface, set the size and background (including transparent), and export a PNG that behaves like any other image. It's a common move for quote graphics, channel watermarks, or a logo wordmark set in a font you're not licensed to embed on a live website. Because the text becomes pixels, there's no risk of a viewer's device swapping in a fallback font and quietly changing how the design looks.`,
    examples: [
      {
        title: 'Create a watermark graphic',
        code: `Text: "@studioname"\nFont: Montserrat Bold, 48px\nBackground: transparent\nOutput: watermark.png (320x80)`,
        note: 'Produces a transparent PNG that overlays cleanly on photos or video thumbnails.',
      },
      {
        title: 'Render a quote card headline',
        code: `Text: "Simplicity is the ultimate sophistication."\nFont: Playfair Display, 64px\nColors: #1A1A1A on #F5F0E6`,
        note: "Locks in the exact typeface and colors so the quote looks the same everywhere it's shared.",
      },
    ],
  },

  'css-animation-generator': {
    description: `A CSS transition only moves between two states, but @keyframes lets you choreograph a whole sequence: spin at 25%, scale up at 50%, fade at 75%, and so on. Writing that by hand means guessing at percentages and easing curves, then reloading the browser to check if the timing feels right. This tool builds the keyframe steps visually instead, so you can drag timing points, preview the animation live, and adjust duration, iteration count, direction, and easing without touching a text editor until the motion looks right. Once it does, copy out the finished @keyframes rule and the animation property that references it, ready to paste into a stylesheet. Useful for loading spinners, hover effects that need more than a simple fade, attention-grabbing badges, or any element that needs to loop, reverse, or pause partway through its cycle.`,
    examples: [
      {
        title: 'Bounce a notification badge',
        code: `@keyframes bounce {\n  0%, 100% { transform: translateY(0); }\n  50% { transform: translateY(-8px); }\n}\n.badge { animation: bounce 0.6s ease-in-out infinite; }`,
        note: 'Loops indefinitely to draw the eye to a new-notification badge until it gets clicked.',
      },
      {
        title: 'Fade and scale in a modal',
        code: `@keyframes modalIn {\n  0% { opacity: 0; transform: scale(0.95); }\n  100% { opacity: 1; transform: scale(1); }\n}\n.modal { animation: modalIn 0.25s ease-out forwards; }`,
        note: 'The forwards fill mode keeps the modal at its final scale instead of snapping back after the animation ends.',
      },
    ],
  },

  'webp-to-png': {
    description: `WebP images are smaller than PNGs, which is exactly why so many websites serve them by default, but plenty of older software still can't open the format at all: some design tools, older Office versions, and a fair number of print workflows expect a PNG instead. This tool converts a WebP file back to PNG without flattening a transparent background into solid white, so a logo or icon that was see-through in WebP stays see-through after conversion. Drop in a WebP you saved from a website or exported from a design tool, and get back a PNG you can open in software that never learned about WebP in the first place. Nothing is thrown away in the process beyond what WebP's own compression already baked in; this just changes the container, not the pixels.`,
    examples: [
      {
        title: 'Convert a downloaded WebP image for editing',
        code: `Input: banner.webp (240 KB)\nOutput: banner.png (410 KB), transparency preserved`,
        note: "PNG output is larger because WebP's compression is more efficient, not because quality was added.",
      },
      {
        title: 'Prepare a transparent icon for an older app',
        code: `Input: icon-webp-transparent.webp\nOutput: icon.png with alpha channel intact`,
        note: 'Keeps the transparent background instead of filling it with white, which some naive converters do by default.',
      },
    ],
  },
};

export default FIX_BATCH_1;
