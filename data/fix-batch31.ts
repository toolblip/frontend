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

const FIX_BATCH_31: Record<string, FixBatchEntry> = {
  'epub-to-mobi': {
    description: `Kindle's oldest and most broadly compatible ereader hardware and apps expect MOBI specifically, and while EPUB works nearly everywhere else, sending it straight to an older Kindle or an app built around Amazon's earlier format can produce spotty results or need Amazon's own background conversion step first. This tool converts an EPUB file into MOBI directly, so a book bought from a non-Amazon store or downloaded from a library service opens cleanly on Kindle hardware that expects that specific format rather than relying on an automatic conversion during a send-to-Kindle step. Useful for getting an EPUB book reading correctly on an older Kindle device, sideloading a non-Amazon ebook onto Kindle hardware without going through Amazon's own conversion pipeline, or standardizing a personal ebook library on the one format a specific device actually reads best.`,
    examples: [
      {
        title: 'Convert a library-borrowed EPUB for Kindle',
        code: `Input: borrowed-book.epub\nOutput: borrowed-book.mobi (opens on Kindle hardware)`,
        note: "Skips relying on Amazon's own send-to-Kindle conversion step.",
      },
      {
        title: 'Sideload a non-Amazon ebook onto Kindle',
        code: `Input: indie-novel.epub\nOutput: indie-novel.mobi`,
        note: 'Gets a book purchased outside Amazon reading correctly on Kindle hardware.',
      },
    ],
  },

  'css-cursor-generator': {
    description: `A custom cursor in CSS needs more than just pointing to an image, since not every browser supports every image format for a cursor, and if the custom image ever fails to load or the format isn't supported, there needs to be a fallback keyword like pointer or default so the cursor doesn't just silently disappear. This tool builds that full cursor declaration: point to a custom image URL, set a fallback cursor keyword for when the image can't be used, and get the finished CSS cursor property ready to paste in. Useful for building a custom cursor for an interactive element without forgetting the fallback keyword that keeps things working if the custom image fails, or testing how a custom cursor image actually looks against a real background before committing the CSS.`,
    examples: [
      {
        title: 'Build a custom cursor with a fallback',
        code: `cursor: url('custom-pointer.png') 8 8, pointer;`,
        note: 'Falls back to the standard pointer cursor if the custom image fails to load.',
      },
      {
        title: 'Preview a custom cursor against a real background',
        code: `Input: crosshair.cur, hotspot: 16,16\nOutput: cursor: url('crosshair.cur') 16 16, crosshair;`,
        note: 'Confirms the cursor looks right before the CSS goes into production.',
      },
    ],
  },

  'citation-generator': {
    description: `Each citation style has its own specific rules for ordering author names, formatting a publication date, and punctuating a title, and those rules genuinely differ between APA, MLA, and Chicago rather than being cosmetic variations on the same format, which is exactly why a citation formatted correctly in one style is often wrong in another even though it lists the same underlying source. This tool builds a properly formatted citation in whichever style is required, for a book, a website, a journal article, or another source type, applying that style's specific formatting rules rather than a generic one-size-fits-all citation format. Useful for formatting a bibliography correctly in whatever style an assignment or publication requires, converting a citation from one style to another when a paper's requirements change, or double-checking a citation actually follows its style's specific rules before submitting a paper.`,
    examples: [
      {
        title: 'Generate an APA citation for a journal article',
        code: `Input: author: Smith, J., year: 2023, journal: "Journal of Psychology"\nOutput: Smith, J. (2023). Title of article. Journal of Psychology, 45(2), 123-145.`,
        note: "Applies APA's specific author-date ordering and punctuation rules.",
      },
      {
        title: 'Convert the same source to MLA format',
        code: `Input: same journal article\nOutput: Smith, John. "Title of Article." Journal of Psychology, vol. 45, no. 2, 2023, pp. 123-145.`,
        note: "Reformats the identical source using MLA's different ordering and punctuation conventions.",
      },
    ],
  },

  'chart-maker': {
    description: `A bar chart, a line chart, and a pie chart aren't interchangeable ways to show the same data, each shape fits a different kind of comparison: a bar chart suits comparing distinct categories against each other, a line chart suits showing a value change over time, a pie chart suits showing how parts make up a whole, and picking the wrong one for a dataset can make an accurate chart still read misleadingly. This tool builds all of these chart types from a dataset, letting the same data be tried across different chart types to see which shape communicates it most clearly rather than committing to one format by default. Useful for figuring out which chart type fits a dataset before building the final version, creating a chart for a report or presentation without opening a full spreadsheet program, or comparing how the same numbers look across different visual formats.`,
    examples: [
      {
        title: 'Compare categories with a bar chart',
        code: `Input: sales by region\nOutput: bar chart, one bar per region`,
        note: 'Suits comparing distinct categories against each other.',
      },
      {
        title: 'Show a trend over time with a line chart',
        code: `Input: monthly revenue, 12 months\nOutput: line chart tracking revenue across the year`,
        note: 'Fits a value changing over time better than a bar or pie chart would.',
      },
    ],
  },

  'm4a-to-mp4': {
    description: `M4A is audio-only, so converting it to MP4 isn't about adding a picture, it's about repackaging the same audio into a container that also supports album art and metadata the way a music library or media player actually expects to display it, cover art, artist, track title, information an M4A file can carry too but that some players read more reliably from an MP4 wrapper. This tool converts an M4A file into MP4, letting album art and metadata be attached during the conversion rather than requiring a separate step afterward. Useful for preparing an audio file for a media player that displays album art more reliably from MP4 containers, attaching missing metadata to a track before adding it to a library, or getting an audio file into the container format a specific app expects for full metadata support.`,
    examples: [
      {
        title: 'Attach album art during conversion',
        code: `Input: track.m4a, cover: album-art.jpg\nOutput: track.mp4 (with embedded album art)`,
        note: 'Adds artwork in the same step as the format conversion.',
      },
      {
        title: 'Add missing metadata to a track',
        code: `Input: track.m4a, artist: "Jane Doe", title: "Morning Light"\nOutput: track.mp4 (metadata attached)`,
        note: 'Fills in track information a media player can display reliably from the MP4 container.',
      },
    ],
  },

  'character-counter': {
    description: `A platform's character limit rarely lines up with a simple word count, a tweet is measured in characters, not words, and a meta description's practical display limit is also character-based, which means knowing you're under a word count doesn't actually tell you whether you're under the character limit that matters for wherever the text is actually going. This tool counts characters against the specific limits several platforms actually enforce, Twitter's 280, LinkedIn's 3,000, a meta description's roughly 160, with and without spaces counted separately since some limits count them and others effectively don't matter as much. Useful for confirming a tweet fits before posting it, checking a meta description won't get truncated in search results, or verifying a LinkedIn post stays under its much higher character ceiling before publishing.`,
    examples: [
      {
        title: 'Check a tweet against the 280-character limit',
        code: `Input: [draft tweet]\nOutput: 268 characters, 12 remaining`,
        note: "Measures against Twitter's actual character limit, not a word count.",
      },
      {
        title: "Check a meta description won't get truncated",
        code: `Input: [meta description draft]\nOutput: 148 characters (under the ~160 practical limit)`,
        note: 'Confirms the description fits before it gets cut off in search results.',
      },
    ],
  },

  'text-complexity-analyzer': {
    description: `Syllable count, sentence length, and vocabulary score each measure something different about how hard a piece of writing is to get through, and reading three separate numbers and mentally combining them into an overall sense of complexity takes more effort than the actual question usually calls for, is this piece of writing simple, moderate, or genuinely dense. This tool combines all three into one overall complexity read, so a single reference point summarizes what three separate metrics would otherwise leave to manual interpretation. Useful for getting one quick answer about how complex a piece of writing actually is without cross-referencing three separate numbers, comparing two drafts at a glance to see which reads more approachable overall, or checking that a piece intended for a general audience doesn't land somewhere unexpectedly dense.`,
    examples: [
      {
        title: 'Get one overall complexity read',
        code: `Input: [dense technical excerpt]\nOutput: complexity: high (long sentences, low vocabulary variety, high syllable count)`,
        note: 'Combines three separate metrics into a single overall reading instead of three numbers to interpret separately.',
      },
      {
        title: 'Compare two drafts at a glance',
        code: `Draft A: complexity: moderate\nDraft B: complexity: high`,
        note: 'Gives an immediate comparison without cross-referencing multiple raw scores.',
      },
    ],
  },

  'response-header-analyzer': {
    description: `A server that sends back JSON with a Content-Type header claiming it's actually HTML causes a browser to render the raw text instead of parsing it as data, and a JavaScript file served with the wrong MIME type can fail to execute entirely in a browser that enforces strict type checking, both problems invisible until something downstream breaks in a way that doesn't obviously point back to a mismatched header. This tool analyzes a response's headers specifically for that kind of configuration problem, checking whether the Content-Type actually matches what's being served alongside the usual security and caching header review. Useful for catching a Content-Type mismatch that's silently breaking how a browser handles a response, auditing a server's headers for caching and security gaps together, or debugging a resource that loads but behaves incorrectly because of what its headers actually claim about it.`,
    examples: [
      {
        title: 'Catch a Content-Type mismatch',
        code: `Input: https://api.example.com/data\nOutput: Content-Type: text/html (response body is actually JSON)`,
        note: 'Reveals a mismatch that would cause a browser to mishandle the response.',
      },
      {
        title: 'Audit caching and security headers together',
        code: `Input: https://example.com\nOutput: Cache-Control: present | Content-Security-Policy: missing`,
        note: 'Reviews both configuration areas in one pass.',
      },
    ],
  },

  'base64-image-viewer': {
    description: `A base64 string pasted from a debugger, a log entry, or an API response doesn't show you anything on its own, it's just a long block of encoded text, and confirming what image it actually represents usually means writing a quick script or manually building a data URL just to see it rendered. This tool renders a base64-encoded image directly in the browser the moment the string is pasted in, no download or file conversion step needed, just a quick visual check of what the encoded data actually contains. Useful for confirming what an image looks like before deciding whether it's worth extracting as an actual file, quickly checking a base64 string copied from a log without writing a script just to view it, or verifying an API response's embedded image field actually contains what it's supposed to.`,
    examples: [
      {
        title: 'View a base64 string copied from a log',
        code: `Input: data:image/png;base64,iVBORw0KGgoAAAANS...\nOutput: image rendered directly in the browser`,
        note: 'No file download or script needed just to see what the string represents.',
      },
      {
        title: "Verify an API response's embedded image",
        code: `Input: base64 value from a JSON response field\nOutput: rendered preview confirming the actual image content`,
        note: 'Quick visual check before deciding whether the image is worth extracting as a file.',
      },
    ],
  },

  'mock-port-scanner-full': {
    description: `Building or demonstrating a tool that consumes port scan results, a security dashboard, a monitoring UI, a training exercise, doesn't always need a real scan against real infrastructure, and sometimes shouldn't run one at all, whether because the target isn't actually available yet or because scanning real systems isn't appropriate for a demo or a classroom setting. This tool simulates a port scan against a host, returning realistic-looking results for common ports and services without sending any actual network traffic or touching real infrastructure. Useful for demoing a security tool's reporting UI with realistic sample data, testing how an application handles and displays scan results without a live target to scan, or running a training exercise that needs believable output without any real scanning activity involved.`,
    examples: [
      {
        title: "Demo a security dashboard's UI",
        code: `Input: demo-host.local\nOutput: simulated results: Port 80 (open), Port 443 (open), Port 22 (closed)`,
        note: 'Provides realistic sample data without scanning any real infrastructure.',
      },
      {
        title: 'Test scan-result handling without a live target',
        code: `Input: test-target\nOutput: simulated open/closed port list for UI testing`,
        note: 'Useful when the actual target system is not yet available to scan for real.',
      },
    ],
  },
};

export default FIX_BATCH_31;
