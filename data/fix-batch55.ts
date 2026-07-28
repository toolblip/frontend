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

const FIX_BATCH_55: Record<string, FixBatchEntry> = {
  'sentence-lorem-ipsum': {
    description: `A card summary, a short bio field, or a single caption in a mockup doesn't need an entire paragraph of lorem ipsum, it needs one sentence's worth, and pulling just one sentence out of a longer generated block usually means generating more text than actually needed and trimming the rest down by hand. This tool generates individual lorem ipsum sentences one at a time, sized for a single line or a short field rather than a full paragraph block. Useful for filling a card summary or a short bio field with one sentence of classic placeholder text instead of an entire paragraph, generating a single caption for a mockup image, or dropping in one quick sentence of lorem ipsum without over-filling a field meant to hold only a line or two.`,
    examples: [
      {
        title: 'Generate one sentence for a card summary',
        code: `Output: "Lorem ipsum dolor sit amet, consectetur adipiscing elit."`,
        note: 'Sized for a single field instead of a full paragraph.',
      },
      {
        title: 'Generate a caption for a mockup',
        code: `Output: "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."`,
        note: 'Fills a caption field without overflowing it with paragraph-length text.',
      },
    ],
  },

  'sentiment-analyzer': {
    description: `A customer review or a social media comment carries a tone that isn't always obvious from a quick read, especially something that sounds neutral on the surface but actually reads as frustrated or sarcastic once scored more carefully, and responding to feedback without registering that undertone can land badly. This tool analyzes text and detects whether its tone is positive, negative, or neutral, attaching an actual score rather than just a label, so the strength of a sentiment is visible, not only its direction. Useful for gauging a customer review's actual tone before writing a response, checking a social media post for an unintended negative undertone before it's published, or scanning a batch of feedback comments to spot an overall trend in sentiment.`,
    examples: [
      {
        title: 'Score a customer review',
        code: `Input: "The product works fine I guess, nothing special."\nOutput: neutral, score: 0.1 (leaning slightly negative)`,
        note: 'Reveals an understated negative undertone a quick read might miss.',
      },
      {
        title: 'Check a social post before publishing',
        code: `Input: "Can't believe I have to deal with this again."\nOutput: negative, score: -0.7`,
        note: 'Flags a strongly negative tone before the post goes live.',
      },
    ],
  },

  'css-units-converter-new': {
    description: `A design spec's fixed 16px value doesn't scale if someone increases their browser's font size for readability, since a pixel value stays exactly the same size regardless, while a value set in rem scales relative to the root font size and actually respects that preference, a genuinely different behavior from converting between physical units like inches and centimeters. This tool converts between CSS length units, px, rem, em, vw, vh, ch, and more, handling the relative math each unit depends on rather than a simple fixed ratio. Useful for converting a fixed pixel spec into rem so a layout actually scales with a user's font size preference, converting between viewport units for a responsive layout, or checking what an em value nested inside another em context actually computes to in pixels.`,
    examples: [
      {
        title: 'Convert a fixed pixel value to rem',
        code: `Input: 16px (root font-size: 16px)\nOutput: 1rem`,
        note: 'Produces a value that scales if the root font-size changes.',
      },
      {
        title: 'Convert viewport units',
        code: `Input: 50vw (viewport width: 1440px)\nOutput: 720px`,
        note: 'Shows the actual pixel size a viewport unit computes to at a given screen width.',
      },
    ],
  },

  'title-rewriter': {
    description: `A headline that's technically accurate can still get scrolled past if it doesn't actually earn a click, and punching up a title for genuine curiosity or specificity without changing what the article underneath is actually about is a different skill than writing the article itself. This tool rewrites a headline or a title with AI to make it more clickable while keeping the same underlying content, generating an alternative angle rather than a rewritten article. Useful for punching up a blog headline before publishing without touching the piece itself, rewriting an email subject line to actually earn an open, or generating a few headline variations to test against each other for the same underlying article.`,
    examples: [
      {
        title: 'Rewrite a headline for clicks',
        code: `Input: "Tips for Saving Money on Groceries"\nOutput: "The Grocery Trick That Cut My Bill in Half"`,
        note: 'Keeps the same underlying content while sharpening the angle.',
      },
      {
        title: 'Generate headline variations to test',
        code: `Input: "New Features in Our App Update"\nOutput:\n"3 Updates That Change How You Use the App"\n"We Just Fixed the #1 Thing Users Complained About"`,
        note: 'Produces alternatives to test against each other for the same article.',
      },
    ],
  },

  'hex-rgb-hsl-color-picker': {
    description: `Picking a color by eye on a visual swatch and entering an exact numeric value are two different ways of arriving at the same shade, and switching between them usually means a separate tool for each, one for visually browsing a color wheel and another for typing in a precise HEX or HSL value, rather than one interface that keeps both in sync. This tool lets a color be picked visually or entered directly as HEX, RGB, or HSL, showing a live preview swatch and ready CSS output no matter which method was actually used. Useful for visually picking a shade and instantly getting its HEX, RGB, and HSL values together, entering a known HEX code and confirming visually that it looks right, or grabbing CSS-ready output the moment a color feels correct.`,
    examples: [
      {
        title: 'Pick a color and get all three formats',
        code: `Picked visually: teal swatch\nOutput: HEX #14B8A6, RGB rgb(20, 184, 166), HSL hsl(172, 80%, 40%)`,
        note: 'Shows every format at once from a single visual selection.',
      },
      {
        title: 'Enter a HEX value and confirm it visually',
        code: `Input: #E91E63\nOutput: live swatch shown, CSS: color: #E91E63;`,
        note: 'Confirms a typed value actually looks right before using it.',
      },
    ],
  },

  'mkv-to-mp3': {
    description: `An MKV video file holds a picture track and an audio track bundled together, and sometimes only the audio actually matters, a downloaded music video's actual song, a recorded lecture's spoken content, a commentary track worth keeping without the video eating up storage alongside it. This tool extracts the audio from an MKV file and saves it as an MP3, discarding the video entirely and keeping just the sound. Useful for pulling a song out of a downloaded music video without keeping the video file around, extracting a recorded lecture's audio to listen to on the go instead of watching it again, or saving a commentary track as its own MP3 separate from the video it came from.`,
    examples: [
      {
        title: 'Extract a song from a music video file',
        code: `Input: music-video.mkv\nOutput: music-video.mp3`,
        note: 'Keeps just the audio track, discarding the video entirely.',
      },
      {
        title: 'Save a lecture recording as audio',
        code: `Input: lecture-recording.mkv (1.2 GB)\nOutput: lecture-recording.mp3 (45 MB)`,
        note: 'Frees up storage by dropping the video while keeping the spoken content.',
      },
    ],
  },

  'remove-objects': {
    description: `A photobomber walking through the background, a stray power line cutting across an otherwise clean landscape shot, or an old timestamp burned into a photo from years ago all need the same fix, erasing that one specific element while the surrounding area fills back in convincingly rather than leaving an obvious gap or a crude patch behind. This tool removes an unwanted object from a photo automatically, cloning and healing the surrounding area to fill in what's left rather than requiring manual retouching pixel by pixel. Useful for erasing a photobomber from an otherwise good vacation photo, removing a power line or a trash can from a landscape shot, or clearing an old timestamp or a watermark left over from a previous camera.`,
    examples: [
      {
        title: 'Erase a photobomber from a photo',
        code: `Input: beach-photo.jpg (stranger walking through background)\nOutput: beach-photo-clean.jpg`,
        note: 'Fills the erased area with plausible surrounding detail automatically.',
      },
      {
        title: 'Remove a power line from a landscape shot',
        code: `Input: mountain-view.jpg\nOutput: mountain-view-clean.jpg`,
        note: 'Clears a single distracting element without retouching the whole image.',
      },
    ],
  },

  'word-finder': {
    description: `A Scrabble rack of seven scattered letters or a crossword clue with a couple of known letters and the rest blank both come down to the same problem, finding every valid English word that actually fits, a search tedious enough to do by hand that most people give up before checking every real possibility. This tool finds valid English words from a string of letters, with pattern and length filters narrowing the results down to exactly what a specific puzzle actually needs. Useful for finding every valid word makeable from a Scrabble or a Words With Friends rack, solving a crossword clue by matching a pattern of known and blank letters, or finding words of a specific length for a word puzzle that has an exact length requirement.`,
    examples: [
      {
        title: 'Find words from a Scrabble rack',
        code: `Input: letters: r, a, t, e, s, n, o\nOutput: rates, stare, tears, snore, ratones`,
        note: 'Surfaces every valid word makeable from a specific set of letters.',
      },
      {
        title: 'Solve a crossword with a known pattern',
        code: `Input: pattern: c_o_e, length: 5\nOutput: crone, clove`,
        note: 'Matches known and blank letters to a specific word length.',
      },
    ],
  },

  'google-rank-checker': {
    description: `An SEO campaign built around a specific keyword needs an actual answer to one question eventually, whether the targeted page's ranking is actually moving, and that answer changes depending on which region is searching, a page ranking third in one country and nowhere near the first page in another for the exact same keyword. This tool checks a page's approximate Google ranking for a specific keyword and region combination, giving a regional answer rather than one generic global position. Useful for tracking whether an SEO campaign targeting a specific keyword is actually improving a page's ranking over time, checking how a page ranks differently across two separate regions for the same search term, or confirming a page ranks for the keyword it was actually optimized for rather than a related but different one.`,
    examples: [
      {
        title: 'Check ranking in a specific region',
        code: `Input: keyword: "best hiking boots", URL: example.com/hiking-boots, region: US\nOutput: approximate rank: #7`,
        note: 'Gives a region-specific position instead of one generic global rank.',
      },
      {
        title: 'Compare ranking across two regions',
        code: `Input: same keyword and URL, region: UK\nOutput: approximate rank: #14`,
        note: 'Shows how the same page ranks differently depending on where the search happens.',
      },
    ],
  },

  'grammar-checker': {
    description: `An email before it's sent, a cover letter before it's submitted, or a social post before it goes out all need the same quick pass, catching a grammar mistake, a misspelled word, and an awkward phrasing together in one go rather than running three separate checks for three separate categories of error. This tool checks grammar, spelling, and style together and applies a fix with one click, covering all three categories in a single straightforward pass rather than requiring each handled by a different tool. Useful for giving an email or a cover letter one quick, complete check before sending it, catching a typo and an awkward phrase in the same pass instead of two separate ones, or cleaning up a social post fast without needing three different tools for three different problems.`,
    examples: [
      {
        title: 'Check an email before sending',
        code: `Input: "I wanted to reach out and see if there team is availible next week."\nOutput: "there" -> "their", "availible" -> "available"`,
        note: 'Catches a grammar mistake and a spelling error together in one pass.',
      },
      {
        title: 'Clean up a cover letter',
        code: `Input: "I am a person who is very hardworking and dedicated."\nSuggestion: "I am hardworking and dedicated."`,
        note: 'Applies a style fix alongside grammar and spelling in the same check.',
      },
    ],
  },
};

export default FIX_BATCH_55;
