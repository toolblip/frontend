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

const FIX_BATCH_36: Record<string, FixBatchEntry> = {
  'jsonpath-query-tester': {
    description: `Getting a JSONPath expression exactly right on the first try is rare, since a small difference, a filter condition's syntax, whether to use dot notation or bracket notation for a specific key, changes what actually matches, which means the real workflow is trying a few candidate expressions against the same data and comparing results rather than writing one expression and assuming it's correct. This tool runs a JSONPath expression against real JSON data and shows exactly what matches, making it easy to try a variation, tweak a filter condition, adjust a wildcard, and immediately see how the result changes. Useful for iterating on an expression until it matches exactly the right nodes, comparing two candidate JSONPath expressions side by side to see which one actually returns what's needed, or debugging why an expression that looks correct isn't matching the expected data.`,
    examples: [
      {
        title: 'Try two candidate expressions and compare results',
        code: `Data: {"items": [{"price": 10}, {"price": 25}]}\nTry: $.items[*].price -> [10, 25]\nTry: $.items[?(@.price > 15)].price -> [25]`,
        note: 'Compares how a small syntax change affects which nodes actually match.',
      },
      {
        title: 'Debug an expression that matches nothing',
        code: `Query: $.item.title (singular "item")\nResult: no matches\nFix: $.items[*].title (data key is actually plural)`,
        note: "Reveals a mismatch between the expression and the data's actual key names.",
      },
    ],
  },

  'length-weight-converter': {
    description: `Height and weight show up together constantly on exactly the kind of forms and apps where the two unit systems collide, a fitness app that logs height in centimeters but weight in pounds, a medical form from one country asking for measurements in units another country doesn't use, an immigration document requiring both height and weight in metric when the person filling it out thinks in feet and pounds. This tool converts length and weight together between metric and imperial, covering the specific pair of measurements that tend to be needed side by side rather than treating them as two separate, unrelated conversions. Useful for filling out a form that asks for height and weight in units you don't normally think in, converting a fitness tracker's measurements to match a doctor's preferred units, or handling both conversions in one place instead of switching between two separate tools.`,
    examples: [
      {
        title: 'Convert height and weight for a foreign medical form',
        code: `Input: 5 ft 9 in, 165 lbs\nOutput: 175.3 cm, 74.8 kg`,
        note: 'Converts both measurements together since forms typically ask for them side by side.',
      },
      {
        title: "Match a fitness app's mixed units",
        code: `Input: 68 kg\nOutput: 149.9 lbs`,
        note: 'Bridges a tracker logging height in cm but weight in pounds.',
      },
    ],
  },

  'article-rewriter': {
    description: `Refreshing an entire existing article, an old post that's fallen out of date, a competitor's piece covering ground worth revisiting from a different angle, is a different scale of task than rewording a single paragraph, since the whole piece's structure, pacing, and flow all need to hold together as one coherent rewrite rather than a collection of independently reworded sections. This tool rewrites a full article at that scale, taking an existing piece and producing a complete rewritten version with fresh wording throughout rather than a patchwork of individually rephrased paragraphs. Useful for refreshing an old piece of content that's still relevant but reads stale, rewriting an article covering a topic you want to approach from a different angle, or producing a full alternate version of a piece rather than editing it section by section.`,
    examples: [
      {
        title: 'Refresh an outdated article',
        code: `Input: [2019 article on "best project management tools"]\nOutput: fully rewritten article covering the same topic with current framing`,
        note: 'Rewrites the entire piece as one coherent draft rather than section by section.',
      },
      {
        title: 'Rewrite a piece from a different angle',
        code: `Input: [competitor article on "remote work tips"]\nOutput: full alternate article covering the same topic with fresh structure and wording`,
        note: 'Produces a complete new version rather than a patchwork of reworded paragraphs.',
      },
    ],
  },

  'word-frequency-counter': {
    description: `Analyzing what a body of text, a speech transcript, a research corpus, a competitor's published content, is actually built around means looking at more than just which words show up, it means seeing what percentage of the whole each significant term represents, since a term appearing twelve times in a five-hundred-word transcript carries a very different weight than the same twelve occurrences spread across five thousand words. This tool counts every word's occurrences and expresses each one as a percentage of the total, sorted from most to least frequent, rather than a raw count with no sense of proportion. Useful for analyzing the actual word distribution in a speech transcript or a piece of published research, comparing how central a specific term is across two different documents, or getting a proportional breakdown of a text's vocabulary rather than just a list of counts.`,
    examples: [
      {
        title: "Analyze a speech transcript's word distribution",
        code: `Input: [20-minute speech transcript]\nOutput: "innovation" - 2.1% | "growth" - 1.8% | "team" - 1.4%`,
        note: 'Shows proportional weight, not just raw counts, across the whole transcript.',
      },
      {
        title: 'Compare term centrality across two documents',
        code: `Document A: "sustainability" - 3.2%\nDocument B: "sustainability" - 0.4%`,
        note: 'Reveals how much more central a term is in one document versus another.',
      },
    ],
  },

  'gif-to-webm': {
    description: `A GIF has no real audio track and caps out at 256 colors per frame, both real limitations that show up the moment an animation needs to look genuinely good rather than just functional, banding on any gradient, no sound even if one were wanted, file sizes that balloon fast past a few seconds. This tool converts an animated GIF into WebM, a real video format that supports full color depth and, if needed later, audio, typically producing a smaller file than the original GIF at noticeably better visual quality. Useful for converting a GIF with a smooth gradient or photographic content into a format that renders it without color banding, shrinking a large animated GIF down to a smaller file size without a visible quality drop, or moving an animation into a proper video container with room to grow if audio or higher quality is needed later.`,
    examples: [
      {
        title: 'Fix banding in a gradient animation',
        code: `Input: gradient-loop.gif (256-color palette)\nOutput: gradient-loop.webm (full color depth, no banding)`,
        note: "Removes the banding GIF's limited palette causes on smooth gradients.",
      },
      {
        title: 'Shrink a large animated GIF',
        code: `Input: long-animation.gif (18 MB)\nOutput: long-animation.webm (6 MB, same visual quality)`,
        note: 'Typically produces a smaller file than the original GIF.',
      },
    ],
  },

  'color-picker': {
    description: `The most common color task isn't adjusting transparency or building a themed palette, it's just picking one specific color and getting its value in whatever format a specific piece of code or design tool actually needs, hex for a CSS file, RGB for a canvas API, HSL for a value that needs adjusting later, all from the same color at once. This tool provides that straightforward color picker: choose a color from a live swatch, and see it instantly translated into hex, RGB, HSL, and ready-to-paste CSS syntax together. Useful for quickly grabbing a color's value in whichever format a specific context needs without a separate conversion step afterward, checking a color visually against a live preview before committing to it, or picking a color once and having every common format available immediately instead of one at a time.`,
    examples: [
      {
        title: 'Pick a color and get every format at once',
        code: `Picked: a mid-green swatch\nOutput: #22C55E | rgb(34, 197, 94) | hsl(142, 71%, 45%) | background-color: #22C55E;`,
        note: 'Returns hex, RGB, HSL, and ready-to-paste CSS from a single pick.',
      },
      {
        title: 'Check a color against a live preview',
        code: `Picked: #DC2626\nOutput: live swatch showing the exact color before committing to it`,
        note: 'Confirms the color looks right before copying any of the values.',
      },
    ],
  },

  'regex-cheatsheet': {
    description: `Writing a fresh regex for something as common as validating an email address or matching a phone number from scratch, when the actual pattern needed is one that's been solved the same way thousands of times already, is time spent reinventing something that just needs to be copied and adjusted slightly. This tool is a quick reference of common regex patterns already written and ready to use, emails, URLs, phone numbers, dates, and more, meant for copying a known-working pattern directly rather than generating or building one from a description. Useful for grabbing a standard email validation pattern without writing one from scratch, quickly referencing the correct regex syntax for a common format you don't use often enough to have memorized, or copying a working starting pattern to adjust slightly for a specific edge case.`,
    examples: [
      {
        title: 'Grab a standard email validation pattern',
        code: `Copy: ^[\\w.+-]+@[\\w-]+\\.[a-zA-Z]{2,}$`,
        note: 'A ready-to-use pattern instead of writing one from scratch.',
      },
      {
        title: 'Reference a common date format pattern',
        code: `Copy: ^\\d{4}-\\d{2}-\\d{2}$ (matches YYYY-MM-DD)`,
        note: "Quick lookup for a format that isn't used often enough to have memorized.",
      },
    ],
  },

  'mp4-to-wav': {
    description: `Speech-to-text software and audio analysis tools frequently require WAV input specifically rather than MP3, because they need the raw, uncompressed waveform to analyze accurately, and MP3's lossy compression has already discarded some of the detail that kind of analysis actually depends on. This tool extracts audio from an MP4 video and saves it as WAV, preserving the full uncompressed audio data instead of introducing MP3's compression artifacts into a file that's about to be analyzed or transcribed. Useful for preparing a video's audio track for a transcription or speech-to-text tool that specifically expects WAV, feeding a video's audio into an analysis tool that needs uncompressed data to work accurately, or extracting audio at full quality before any further processing that would be sensitive to compression artifacts.`,
    examples: [
      {
        title: 'Prepare a video for a transcription tool',
        code: `Input: interview.mp4\nOutput: interview.wav (uncompressed, ready for speech-to-text)`,
        note: 'Many transcription tools require WAV specifically for accurate results.',
      },
      {
        title: 'Extract audio for waveform analysis',
        code: `Input: podcast-video.mp4\nOutput: podcast-video.wav`,
        note: 'Preserves full audio detail instead of introducing MP3 compression artifacts.',
      },
    ],
  },

  'batch-favicon-downloader': {
    description: `Building a bookmarks page, a link directory, or a competitor research spreadsheet with each site's actual icon next to its name means grabbing dozens of favicons one at a time otherwise, opening each site, finding its favicon file, and saving it individually, a repetitive task multiplied by however many sites are on the list. This tool extracts and downloads favicons from a whole list of URLs in one click, rather than requiring each site to be visited and its icon saved separately. Useful for building a visual bookmarks or link directory page with real site icons instead of generic placeholders, collecting favicons for a competitive research project covering many sites at once, or grabbing icons for an entire list of links in one pass instead of one at a time.`,
    examples: [
      {
        title: 'Collect favicons for a link directory',
        code: `Input: 30 URLs\nOutput: 30 favicon files, one per site, ready to use as icons`,
        note: 'Grabs every icon in one click instead of visiting each site individually.',
      },
      {
        title: 'Gather icons for a competitor research list',
        code: `Input: 15 competitor URLs\nOutput: 15 favicon.ico/png files downloaded at once`,
        note: 'Builds a visual reference set without saving each icon by hand.',
      },
    ],
  },

  'ai-rephraser': {
    description: `Sometimes text needs a different tone entirely, formal instead of casual, sometimes it just needs the same tone but clearer phrasing, and sometimes the whole thing needs a genuine rewrite rather than a light touch-up, three meaningfully different jobs that a single generic rephrasing pass tends to blur together into one output regardless of which one was actually needed. This tool offers all three as distinct modes: shift the tone while keeping the same content, improve clarity without changing the register, or rewrite the passage completely, selected depending on what the text in front of you actually calls for rather than one fixed transformation applied every time. Useful for picking exactly the right degree of change a piece of text needs, from a light clarity pass to a full rewrite, rather than getting the same generic treatment regardless of what was actually asked for.`,
    examples: [
      {
        title: 'Shift tone without changing the content',
        code: `Input: "Hey, quick heads up the server's down." (casual)\nOutput: "Please be advised that the server is currently unavailable." (formal), mode: tone shift`,
        note: 'Keeps the same facts while changing only the register.',
      },
      {
        title: 'Improve clarity without changing the tone',
        code: `Input: "The thing we talked about with the numbers is kind of not looking great."\nOutput: "The revenue figures we discussed are below target.", mode: clarity`,
        note: 'Sharpens vague phrasing while keeping the same casual register.',
      },
    ],
  },
};

export default FIX_BATCH_36;
