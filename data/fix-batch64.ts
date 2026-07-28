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

const FIX_BATCH_64: Record<string, FixBatchEntry> = {
  'physics-constants-reference': {
    description: `A physics problem that calls for the speed of light, Planck's constant, or the gravitational constant needs the actual precise decimal value, not a rounded approximation remembered from a textbook, since a multi-step calculation compounds even a small rounding error into a genuinely wrong final answer. This tool provides a browsable reference of common physics constants with their proper units, symbols, and precise decimal values, giving the exact number a calculation actually needs rather than one recalled from memory. Useful for pulling an exact constant value into a multi-step physics calculation where rounding would actually matter, confirming the correct symbol notation for a constant before writing it into a formula, or double-checking a memorized value and its units before it goes into an actual calculation.`,
    examples: [
      {
        title: 'Look up the speed of light',
        code: `Output: c = 299,792,458 m/s (exact, symbol: c)`,
        note: 'Gives the precise defined value instead of a rounded textbook approximation.',
      },
      {
        title: 'Look up the gravitational constant',
        code: `Output: G = 6.67430 × 10⁻¹¹ m³ kg⁻¹ s⁻² (symbol: G)`,
        note: 'Provides the exact decimal value and proper unit notation for a calculation.',
      },
    ],
  },

  'image-color-picker': {
    description: `A brand's exact color sitting inside a logo screenshot or a specific shade spotted in a photo isn't something to guess at with a color wheel, it needs to actually be sampled directly from the pixel it lives in, since eyeballing a close approximation from a swatch rarely lands on the exact value used. This tool picks a color directly from an uploaded image and returns its HEX, RGB, HSL, and CSS values instantly, sampling the actual pixel rather than approximating a nearby shade. Useful for matching a brand's exact color from a logo image when its hex code was never documented anywhere, extracting a small color palette from a photo for a design project, or sampling one specific pixel's color from a screenshot to match it precisely in CSS.`,
    examples: [
      {
        title: 'Sample a brand color from a logo',
        code: `Input: logo-screenshot.png, click pixel at (240, 88)\nOutput: HEX #E63946, RGB(230, 57, 70), HSL(355, 77%, 56%)`,
        note: 'Extracts the exact color used rather than an approximated match.',
      },
      {
        title: 'Extract a palette from a photo',
        code: `Input: sunset-photo.jpg\nOutput: sampled colors: #F4A261, #E76F51, #2A9D8F`,
        note: 'Pulls specific shades directly out of a photo for a design palette.',
      },
    ],
  },

  'image-aspect-ratio-calculator': {
    description: `Keeping a video at 16:9 while changing its width, or checking whether a photo's current dimensions actually match a standard ratio like 4:3 rather than being subtly off, both come down to the same underlying math, and figuring that out by hand for an unfamiliar dimension is more error-prone than it looks. This tool calculates aspect ratios and finds the standard dimensions that match any given image size, working out exactly what height keeps a specific ratio intact as a width changes. Useful for finding the correct height to keep a video's 16:9 ratio when only a target width is known, checking whether an image's dimensions actually match a standard ratio like 16:9 or 4:3, or calculating the exact dimensions a banner ad spec requires before resizing an image to fit.`,
    examples: [
      {
        title: 'Find the height for a 16:9 video',
        code: `Input: width: 1920px, ratio: 16:9\nOutput: height: 1080px`,
        note: 'Keeps the ratio intact when only one dimension is known.',
      },
      {
        title: 'Check if dimensions match a standard ratio',
        code: `Input: 1200x800\nOutput: closest standard ratio: 3:2 (exact match)`,
        note: "Confirms whether an image's dimensions already match a common ratio.",
      },
    ],
  },

  'percentage-difference': {
    description: `Comparing two competitors' prices or two survey results side by side isn't the same problem as tracking a value that changed over time from a clear starting point, since neither price or result is really the "before" value the other one changed from, which is exactly why percentage difference is calculated against the average of both numbers rather than treating one as a baseline the other moved away from. This tool calculates the percentage difference between two values, with direction and an absolute result option, built for comparing two peer values rather than a before-and-after change. Useful for comparing two competing products' prices without treating either one as the original, comparing two survey or test results that don't have a clear starting point, or getting an absolute percentage difference when the direction of the comparison genuinely doesn't matter.`,
    examples: [
      {
        title: 'Compare two competing prices',
        code: `Input: $45 vs $52\nOutput: 14.4% difference (average-based, no direction implied)`,
        note: 'Treats both prices as peers rather than one being the "original".',
      },
      {
        title: 'Compare two survey results',
        code: `Input: 62% approval vs 58% approval\nOutput: 6.7% difference`,
        note: 'Useful when neither number is a clear starting point.',
      },
    ],
  },

  'percentage-change-calc': {
    description: `Tracking this month's revenue against last month's, or this year's numbers against last year's, is a comparison where the order genuinely matters, one value is clearly the starting point and the other is what it became, unlike comparing two unrelated numbers that were never really a before-and-after pair to begin with. This tool calculates the percentage increase or decrease between two values with their direction and magnitude, built specifically for tracking a metric that actually moved from one point to another over time. Useful for tracking a month-over-month or year-over-year change in a business metric where the order clearly matters, calculating how much a price actually increased between two specific dates, or measuring a metric's change from a clear starting point rather than comparing two values with no real before-and-after relationship.`,
    examples: [
      {
        title: 'Track year-over-year revenue',
        code: `Input: last year: $500,000, this year: $575,000\nOutput: +15% (increase)`,
        note: "Treats last year's figure as the clear starting point.",
      },
      {
        title: 'Calculate a month-over-month change',
        code: `Input: January: 1,200 signups, February: 1,080 signups\nOutput: -10% (decrease)`,
        note: 'Measures a metric that moved from one specific point to the next.',
      },
    ],
  },

  'bmi-calculator': {
    description: `Body Mass Index is a simple ratio of weight to height squared, and it makes no distinction between muscle and fat, which is exactly why a heavily muscled athlete can register as overweight by the number alone despite carrying very little actual body fat, a limitation worth remembering rather than treating the result as a precise measurement of body composition. This tool calculates Body Mass Index from height and weight in either metric or imperial units, handling the unit conversion directly rather than requiring measurements converted by hand first. Useful for getting a quick general health screening baseline rather than a precise body composition reading, tracking a weight change over time relative to a fixed height, or calculating BMI directly from imperial measurements without converting to metric first.`,
    examples: [
      {
        title: 'Calculate BMI in metric units',
        code: `Input: height: 175 cm, weight: 70 kg\nOutput: BMI: 22.9 (normal range)`,
        note: 'Computes weight divided by height squared automatically.',
      },
      {
        title: 'Calculate BMI in imperial units',
        code: `Input: height: 5'9", weight: 160 lbs\nOutput: BMI: 23.6 (normal range)`,
        note: 'Skips manually converting to metric first.',
      },
    ],
  },

  'word-frequency-counter': {
    description: `A writer often can't hear their own repeated verbal tics from inside a piece of writing, a specific word or phrase leaned on far more than intended, the kind of pattern that's obvious counted up but invisible on a normal read-through. This tool counts how often each word appears in a piece of text, sorting the results by frequency with a percentage breakdown for each one. Useful for spotting an overused word in your own writing that's crept in without noticing, analyzing a speech or a transcript to see which words actually dominate it, or counting word frequency in a favorite piece of text, a song's lyrics or a well-loved passage, just to see what stands out.`,
    examples: [
      {
        title: 'Spot an overused word in your own writing',
        code: `Input: [2,000-word draft]\nOutput: "actually" - 14 times (0.7%), "basically" - 9 times (0.45%)`,
        note: "Surfaces a verbal tic that's easy to miss while writing.",
      },
      {
        title: 'Analyze word frequency in a transcript',
        code: `Input: [meeting transcript]\nOutput: "team" - 22 times, "deadline" - 15 times, "budget" - 11 times`,
        note: 'Reveals which words actually dominate a piece of text.',
      },
    ],
  },

  'syllable-counter': {
    description: `Fitting a lyric to a melody's rhythm or landing a rap verse's cadence correctly depends on the exact syllable count of each line matching the beat, a count that's easy to miscount silently in your head while actually writing, especially across several candidate lines being compared against each other. This tool counts syllables in any word or phrase using vowel-group detection, giving each line's count instantly rather than requiring it tapped out by hand while writing. Useful for checking whether a lyric actually fits a melody's rhythm before recording it, comparing a few candidate lines to find the one whose syllable count actually lands on the beat, or counting syllables across a full verse to keep its rhythm consistent line to line.`,
    examples: [
      {
        title: "Check a lyric's syllable count",
        code: `Input: "Started from the bottom now we're here"\nOutput: 9 syllables`,
        note: "Confirms whether a line fits a melody's rhythm before recording.",
      },
      {
        title: 'Compare candidate lines for a verse',
        code: `Line A: "Chasing dreams beneath the neon sky" -> 9 syllables\nLine B: "Running toward the light of a new day" -> 9 syllables`,
        note: 'Helps pick the line that actually lands on the beat.',
      },
    ],
  },

  'countdown-timer': {
    description: `Stepping away from the screen while something bakes, rests, or brews only works if there's an actual sound to catch attention when time's up, since a silent timer ticking down on a screen no one's watching might as well not exist at all. This tool sets a countdown timer with a custom duration, alerts, and sound notifications, making sure time running out is actually noticed rather than requiring the screen watched continuously. Useful for a kitchen timer that needs an audible alert once a dish is actually done, running a workout interval timer with a sound cue marking each round's start and end, or timing a presentation or an exam with a clear alert when time is up instead of someone having to watch a clock.`,
    examples: [
      {
        title: 'Set a kitchen timer with an alert',
        code: `Input: duration: 12 minutes, alert: chime sound\nOutput: timer running, sound plays at 0:00`,
        note: 'Notifies you audibly instead of requiring the screen to be watched.',
      },
      {
        title: 'Run a workout interval timer',
        code: `Input: 20 seconds work, 10 seconds rest, 8 rounds, sound cue each transition\nOutput: timer cycles through all 8 rounds with a sound at each change`,
        note: "Marks each round's start and end without needing to glance at a clock.",
      },
    ],
  },

  'color-temperature-adjuster': {
    description: `A UI meant to feel cozy and inviting reads differently than one meant to feel clean and clinical, and that difference often comes down to warmth rather than any change in brightness or saturation, a slightly warmer palette leaning toward amber and red feeling more inviting than the exact same colors shifted cooler toward blue. This tool shifts a color warmer toward yellow and red or cooler toward blue by adjusting its temperature value specifically, leaving lightness and saturation untouched while changing how a palette actually feels. Useful for warming an interface's palette to feel more inviting and less clinical without touching its brightness, cooling a palette down for a crisp, wintry seasonal theme, or adjusting an entire color scheme's mood by shifting temperature alone rather than redesigning the palette from scratch.`,
    examples: [
      {
        title: 'Warm an interface for a cozier feel',
        code: `Input: #4A90D9, temperature: +30\nOutput: #C9A24A`,
        note: 'Shifts the palette warmer without changing brightness or saturation.',
      },
      {
        title: 'Cool a palette for a wintry theme',
        code: `Input: #E8C547, temperature: -35\nOutput: #5FA8DC`,
        note: 'Adjusts mood through temperature alone rather than redesigning the palette.',
      },
    ],
  },
};

export default FIX_BATCH_64;
