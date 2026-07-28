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

const FIX_BATCH_18: Record<string, FixBatchEntry> = {
  'summarize-youtube': {
    description: `A YouTube video already has a transcript sitting behind it in almost every case, either auto-generated captions or one the creator uploaded directly, which means getting a summary doesn't require re-transcribing anything from the audio the way a summary of a podcast episode with no captions might. This tool pulls that existing transcript, along with any chapter markers the video already has, and condenses it into the actual points covered, tied back to roughly where in the video each one comes up. Paste in a video's URL and get back a summary you can skim in under a minute instead of watching a twenty-minute video to find out if it covers what you actually need. Useful for deciding whether a long tutorial or review is worth the full watch, or jumping straight to the timestamp that covers the one point that matters.`,
    examples: [
      {
        title: 'Get key points without watching the full video',
        code: `Input: https://youtube.com/watch?v=abc123 (22-minute tutorial)\nOutput: 5 key points, each linked to a timestamp`,
        note: 'Pulls from the existing transcript rather than re-transcribing the audio.',
      },
      {
        title: 'Jump to the section that covers one specific point',
        code: `Input: [video about "React performance"]\nOutput: "Memoization discussed at 8:42"`,
        note: 'Points to the exact timestamp instead of requiring a full watch-through to find it.',
      },
    ],
  },

  'speed-converter': {
    description: `A wind report in knots, a car's speedometer in miles per hour, a European highway sign in kilometers per hour, a physics problem working in meters per second, speed shows up in whatever unit the source happens to use, and none of them convert to each other with round, easy-to-do-in-your-head numbers. This tool converts between km/h, mph, m/s, knots, and feet per second directly, so a number from any one of those contexts translates immediately into whichever unit actually makes sense to the person reading it. Useful for converting a marine weather forecast's wind speed in knots into something more intuitive, checking what a treadmill's km/h display means in miles per hour, or working through a physics problem that mixes units from different parts of a question.`,
    examples: [
      {
        title: 'Convert a marine forecast wind speed',
        code: `Input: 18 knots\nOutput: 20.7 mph | 33.3 km/h`,
        note: 'Knots are standard in marine and aviation forecasts but unfamiliar to most everyday readers.',
      },
      {
        title: "Check a treadmill's speed setting",
        code: `Input: 10 km/h\nOutput: 6.21 mph`,
        note: 'Useful when a treadmill or fitness app displays km/h but you think in mph.',
      },
    ],
  },

  'syllable-word-counter': {
    description: `Two scripts with the exact same word count can take noticeably different amounts of time to actually say out loud, because syllable count, not word count, is what really drives speaking pace, a sentence full of short one-syllable words reads faster than the same number of words stuffed with three- and four-syllable terms. This tool counts syllables per word and totals them across a passage, which is a better predictor of spoken duration than a plain word count for anyone timing a voiceover script, a presentation, or a video's narration. Useful for checking whether a subtitle line is too syllable-dense to read comfortably in the few seconds it's on screen, or estimating how long a script will actually take to narrate before recording it.`,
    examples: [
      {
        title: "Estimate a voiceover script's speaking time",
        code: `Input: [150-word script, 220 syllables]\nOutput: estimated speaking time: ~55 seconds`,
        note: 'Uses syllable count rather than word count, since syllables track speaking pace more closely.',
      },
      {
        title: 'Check if a subtitle line is too dense for its display time',
        code: `Input: "The mitochondria is the powerhouse of the cell" (on screen for 2 seconds)\nOutput: 17 syllables, likely too dense to read comfortably in 2 seconds`,
        note: 'Flags a caption that packs in more syllables than a viewer can comfortably read in the time allotted.',
      },
    ],
  },

  'lorem-ipsum-api': {
    description: `Generating placeholder text for a person to copy and paste is one job; generating it programmatically inside a test suite, a CI pipeline, or a script that needs fresh dummy content every time it runs without a human ever opening a browser is a different one entirely. This tool is built for the second case: an actual API endpoint that returns lorem ipsum text on request, with paragraph count, sentence count, and output format all controllable through parameters passed in the request itself rather than clicked through a UI. Useful for seeding test fixtures with placeholder content automatically, populating a staging database with sample records during automated setup, or generating dummy text inside a script where a copy-paste workflow simply isn't practical.`,
    examples: [
      {
        title: 'Seed a test fixture programmatically',
        code: `Request: GET /api/lorem?paragraphs=3&format=json\nResponse: { "text": ["Lorem ipsum dolor...", "Sed ut perspiciatis...", "At vero eos..."] }`,
        note: 'Called directly from a test script rather than copied from a webpage.',
      },
      {
        title: 'Populate a staging database during setup',
        code: `Request: GET /api/lorem?sentences=1&count=50\nResponse: 50 single-sentence placeholder strings`,
        note: 'Generates bulk placeholder content automatically as part of an automated setup script.',
      },
    ],
  },

  'sticky-notes': {
    description: `A plain text list treats every item the same, one line after another in whatever order they were typed, but a real brainstorm or a quick capture of scattered ideas usually needs the freedom to group related notes together, color-code by urgency, and move things around as priorities shift, none of which a linear list handles well. This tool creates digital sticky notes that can be placed anywhere on a board, colored to signal meaning, urgent items in red, ideas in yellow, done in green, and rearranged freely as a project evolves. Useful for a quick brainstorming session where ideas need to be grouped and regrouped visually, a shared to-do board where color communicates priority at a glance, or jotting down a scattered thought without it getting lost in a longer running list.`,
    examples: [
      {
        title: 'Color-code a brainstorm by urgency',
        code: `Note 1: "Fix login bug" (red)\nNote 2: "Redesign homepage" (yellow)\nNote 3: "Update footer copy" (green)`,
        note: 'Color communicates priority at a glance without needing to read every note.',
      },
      {
        title: 'Group related ideas on a board',
        code: `Notes: "Blog SEO", "Meta descriptions", "Internal linking" grouped together in one corner of the board`,
        note: 'Notes can be freely repositioned to cluster related ideas as a brainstorm develops.',
      },
    ],
  },

  'jpg-to-png': {
    description: `JPEG loses a little quality every single time it gets opened, edited, and saved again, since the format recompresses the image on each save, so a photo that's been through several rounds of edits and exports as JPEG has quietly degraded a bit more each time without anyone necessarily noticing until it's compared against the original. This tool converts a JPEG into PNG, which is lossless, so that degradation stops at the moment of conversion: whatever quality survived up to that point gets locked in, and every save after that point doesn't compound the loss further. Useful for an image that's going to go through more rounds of editing, converting first to PNG so additional saves don't keep quietly chipping away at quality the way continuing to save as JPEG would.`,
    examples: [
      {
        title: 'Stop further quality loss before more edits',
        code: `Input: photo-v3.jpg (already saved and re-saved twice)\nOutput: photo-v3.png (locks in current quality, no further generation loss)`,
        note: 'Additional saves after this point no longer recompress and degrade the image.',
      },
      {
        title: 'Convert before a round of heavy editing',
        code: `Input: portrait.jpg\nOutput: portrait.png`,
        note: 'Useful before several more rounds of edits and saves that would otherwise compound quality loss.',
      },
    ],
  },

  'random-choice-wheel': {
    description: `Picking a name out of a list instantly feels arbitrary in a way that a spinning wheel slowing to a stop somehow doesn't, even though the underlying randomness is identical either way, which is exactly why a wheel works better for a group decision, a classroom pick, or a live giveaway than a plain random result with no buildup at all. This tool builds that wheel from any list: type in names, items, or options, spin it, and watch it slow down to land on one entry with the same visual suspense as a physical prize wheel. Useful for picking a winner during a live raffle where the audience wants to watch it happen, choosing who goes first in a classroom or team activity, or settling on a restaurant from a shortlist without an argument about who actually picked it.`,
    examples: [
      {
        title: 'Pick a raffle winner live',
        code: `Input: 40 names entered\nOutput: wheel spins, lands on "Priya Patel"`,
        note: 'The spinning animation gives a live audience something to watch rather than an instant result.',
      },
      {
        title: 'Choose a restaurant from a shortlist',
        code: `Input: "Taco place", "Sushi bar", "Pizza spot"\nOutput: wheel lands on "Sushi bar"`,
        note: 'Settles a group decision without anyone feeling like they picked favorites.',
      },
    ],
  },

  'real-estate-description': {
    description: `Real estate listing copy has its own set of rules most other product descriptions don't: fair housing law restricts language that could be read as excluding or targeting buyers based on protected characteristics, so certain phrases common in casual real estate talk are actual legal risks rather than just style choices, on top of the usual MLS character limits and buyer-facing terminology, "cozy" reliably signaling small, that agents rely on to communicate a lot in very little space. This tool writes property descriptions built around those specific constraints: compelling copy that highlights a property's actual features without straying into language that could raise a fair housing compliance issue. Useful for a listing agent who needs copy that reads well and stays safely within advertising rules without researching the specifics of fair housing language each time.`,
    examples: [
      {
        title: 'Write a compliant listing description',
        code: `Input: 3-bed, 2-bath, 1,450 sq ft, updated kitchen, near downtown\nOutput: "This 3-bedroom, 2-bath home offers 1,450 square feet with a fully updated kitchen, minutes from downtown."`,
        note: 'Highlights the property itself rather than language about who the neighborhood suits.',
      },
      {
        title: 'Fit copy within an MLS character limit',
        code: `Input: property details, limit: 500 characters\nOutput: 487-character listing description`,
        note: 'Stays under the character cap MLS platforms typically enforce for listing summaries.',
      },
    ],
  },

  'uuid-generator': {
    description: `A UUID needs to be unique enough that two systems generating identifiers independently, with no coordination between them at all, essentially never produce the same value by accident, which is a much stronger guarantee than an incrementing counter or a random short string could offer on its own. This tool generates version 4 UUIDs, the random variant most systems default to, with format options like uppercase versus lowercase and hyphenated versus a plain unbroken string, plus the ability to generate a batch of many at once rather than one at a time. Useful for seeding test data with realistic-looking unique identifiers, generating a batch of IDs for a database migration script, or getting a single UUID quickly for a config value or a one-off reference key.`,
    examples: [
      {
        title: 'Generate a single UUID for a config value',
        code: `Output: 7c9e6679-7425-40de-944b-e07fc1f90ae7`,
        note: 'A version 4 UUID, generated randomly rather than derived from any predictable source.',
      },
      {
        title: 'Generate a batch of IDs for a migration script',
        code: `Count: 10\nOutput: 10 unique UUIDs, one per line`,
        note: 'Produces many identifiers at once instead of generating and copying one at a time.',
      },
    ],
  },

  'gradient-generator': {
    description: `CSS gradients live as code in a stylesheet, which is exactly the wrong shape for a lot of places a gradient background is actually needed, a presentation slide, a Canva or Figma design file, a social media graphic, anywhere that expects an actual image rather than a line of CSS to paste in. This tool builds a multi-stop gradient visually and exports it as an image file, sized to whatever a background, a banner, or a design canvas actually needs, rather than producing gradient syntax meant for a stylesheet. Useful for a design project built in a tool that doesn't read CSS at all, generating a gradient background image for a slide deck, or getting a quick gradient asset for a social graphic without recreating it by hand in a separate design program.`,
    examples: [
      {
        title: 'Export a gradient background for a slide deck',
        code: `Input: 3-color gradient, #2563EB to #7C3AED to #DB2777\nOutput: gradient-bg.png (1920x1080)`,
        note: 'Produces an image file for a tool that has no way to read CSS.',
      },
      {
        title: 'Create a gradient asset for a social graphic',
        code: `Input: 2-color gradient, angle: 45°\nOutput: gradient.png (1080x1080)`,
        note: 'Sized for a square social media post rather than a stylesheet background.',
      },
    ],
  },
};

export default FIX_BATCH_18;
