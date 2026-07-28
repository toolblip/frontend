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

const FIX_BATCH_54: Record<string, FixBatchEntry> = {
  'what-if-scenario-calculator': {
    description: `A single fixed calculation answers one specific question, but a real decision usually depends on several variables moving together at once, what happens to a monthly payment if the interest rate shifts by half a point and the loan term changes at the same time, a question a one-off calculation can't actually answer without being rebuilt from scratch for every new combination. This tool models a scenario with adjustable variables and recalculates every result instantly as any one of them changes, letting several possibilities be explored without rebuilding the math each time. Useful for seeing how a monthly payment scales as an interest rate or a loan term shifts, modeling how revenue changes if price and volume move in different directions at once, or exploring several what-if combinations quickly without a spreadsheet built specifically for that one question.`,
    examples: [
      {
        title: 'Model a loan payment scenario',
        code: `Input: principal: $20,000, rate: 5.5%, term: 60 months\nChange rate to 6.25%\nOutput: monthly payment updates from $382 to $390 instantly`,
        note: 'Recalculates immediately as any variable changes.',
      },
      {
        title: 'Model revenue from two variables',
        code: `Input: price: $40, volume: 500 units\nChange volume to 650\nOutput: revenue updates from $20,000 to $26,000`,
        note: 'Shows how results scale when more than one variable shifts.',
      },
    ],
  },

  'url-encoder-decoder': {
    description: `A space, an ampersand, or an equals sign dropped directly into a URL's query string doesn't stay literal text, it gets read as part of the URL's own structure instead, which is exactly why an email address containing a plus sign or a search term containing spaces needs percent-encoding first to survive as actual data rather than breaking the URL around it. This tool encodes and decodes URLs instantly, converting reserved characters into their percent-encoded form or reversing an already-encoded string back into readable text. Useful for encoding a query parameter that itself contains a special character before it breaks the surrounding URL's structure, decoding a percent-encoded URL pulled from a server log back into something readable, or preparing a search term or an email address to be safely passed as part of a query string.`,
    examples: [
      {
        title: 'Encode a query parameter',
        code: `Input: search query: "coffee & tea shops"\nOutput: coffee%20%26%20tea%20shops`,
        note: 'Keeps the ampersand and spaces from breaking the surrounding query string.',
      },
      {
        title: 'Decode a URL from a log file',
        code: `Input: %2Fsearch%3Fq%3Dhello%2Bworld\nOutput: /search?q=hello+world`,
        note: 'Turns a percent-encoded URL back into readable text.',
      },
    ],
  },

  'audio-to-text': {
    description: `A recorded meeting, an interview, or a podcast episode holds useful information that stays locked inside audio until someone actually transcribes it, a slow process by hand that gets slower the longer the recording actually runs. This tool converts an audio file into a text transcript, supporting MP3, WAV, M4A, and other common formats, turning spoken content into searchable, readable text without manual transcription. Useful for transcribing a recorded meeting into text that can actually be searched for a specific detail later, converting an interview recording into a written draft to quote from directly, or turning a quick voice memo into a written note without typing it out by hand.`,
    examples: [
      {
        title: 'Transcribe a recorded meeting',
        code: `Input: team-meeting.mp3 (32 minutes)\nOutput: full text transcript with timestamps`,
        note: 'Makes a long recording searchable for a specific detail later.',
      },
      {
        title: 'Convert a voice memo to a note',
        code: `Input: voice-memo.m4a (45 seconds)\nOutput: "Remember to call the supplier about the delayed shipment."`,
        note: 'Turns spoken content into a written note without typing it manually.',
      },
    ],
  },

  'text-line-sorter': {
    description: `A mailing list assembled from several sources, an export of URLs pulled from more than one report, or any list built up over time from multiple places usually ends up with the same entry appearing more than once, and finding every duplicate by scanning a long list manually is slow and easy to get wrong. This tool sorts text lines alphabetically, by length, or in reverse order, and removes duplicate lines in one click, cleaning up a list at the same time it gets sorted rather than requiring a separate deduplication pass. Useful for removing repeated entries from a mailing list built from several sources, deduplicating a list of URLs pulled from more than one report, or cleaning up a data export that accumulated the same entry multiple times before it's used somewhere else.`,
    examples: [
      {
        title: 'Remove duplicate entries',
        code: `Input: jane@example.com, mark@example.com, jane@example.com\nOutput: jane@example.com, mark@example.com`,
        note: 'Deduplicates a list built from more than one source in one click.',
      },
      {
        title: 'Sort and deduplicate a URL list',
        code: `Input: [URLs from two separate reports, some overlapping]\nOutput: sorted, unique list with every repeat removed`,
        note: 'Cleans and orders a list in a single pass instead of two.',
      },
    ],
  },

  'accessibility-checker': {
    description: `A page can pass a basic HTML syntax check and still be genuinely unusable for someone relying on a screen reader or navigating with low vision, a heading structure that skips from an h1 straight to an h4, text with a contrast ratio too low to actually read comfortably, or an image with no alt text at all, none of which show up as a markup error. This tool checks web content specifically against WCAG accessibility standards, flagging a contrast ratio that falls short, a missing alt attribute, or a heading structure that skips a level rather than just confirming the HTML itself is valid. Useful for catching a genuine WCAG compliance gap before it becomes a legal or an accessibility complaint, confirming a heading hierarchy is structured correctly for screen reader navigation, or checking whether a design's color choices actually meet a minimum contrast standard.`,
    examples: [
      {
        title: 'Flag a contrast ratio issue',
        code: `Input: text #999999 on background #FFFFFF\nOutput: fails WCAG AA - contrast ratio 2.85:1 (needs 4.5:1)`,
        note: 'Catches a readability issue a syntax check would never flag.',
      },
      {
        title: 'Catch a skipped heading level',
        code: `Input: <h1>Page Title</h1> ... <h4>Section</h4>\nOutput: warning - heading jumps from h1 to h4, skipping h2 and h3`,
        note: 'Flags a structure that breaks screen reader navigation.',
      },
    ],
  },

  'synonym-finder': {
    description: `Reaching for a synonym mid-sentence is a different moment than sitting down to brainstorm every word loosely related to a concept, sometimes the actual need is just one direct substitute, fast, with one click, rather than a wider exploration of a word's whole semantic neighborhood. This tool finds a synonym or an antonym for any word instantly with a single click, built for that quick in-the-moment substitution rather than a broader brainstorming session. Useful for swapping out a word that's been repeated too many times in the same paragraph, finding a quick antonym while writing a contrast or a comparison, or grabbing an immediate replacement word without leaving the sentence being written to go explore related concepts.`,
    examples: [
      {
        title: 'Find a quick synonym',
        code: `Input: "important"\nOutput: significant, essential, crucial`,
        note: 'Gives an immediate replacement for a word repeated too often.',
      },
      {
        title: 'Find an antonym in one click',
        code: `Input: "expand"\nOutput: contract, shrink, reduce`,
        note: 'Grabs a fast contrast word without leaving the sentence being written.',
      },
    ],
  },

  'punctuation-fixer': {
    description: `Text pasted from an older document sometimes carries two spaces after every period, a typewriter-era habit that reads as inconsistent spacing today, alongside a missing comma or a dropped period at the end of a bullet point, small punctuation issues that are tedious to hunt down one at a time across a longer piece of writing. This tool fixes missing or incorrect punctuation marks and applies consistent spacing throughout, focusing specifically on punctuation rather than grammar or broader style. Useful for normalizing inconsistent spacing after periods in text pasted from an older document, adding a missing punctuation mark at the end of a list of bullet points, or cleaning up scattered punctuation issues before submitting text somewhere with strict formatting requirements.`,
    examples: [
      {
        title: 'Normalize spacing after periods',
        code: `Input: "This is one sentence.  This is another."\nOutput: "This is one sentence. This is another."`,
        note: 'Reduces a leftover double space to a single space consistently.',
      },
      {
        title: 'Add missing punctuation to a list',
        code: `Input: "- Buy milk\\n- Call the plumber\\n- Finish the report"\nOutput: "- Buy milk.\\n- Call the plumber.\\n- Finish the report."`,
        note: 'Adds a missing period consistently across every list item.',
      },
    ],
  },

  'qr-code-scanner': {
    description: `A QR code printed on a flyer or embedded in an email doesn't reveal where it actually leads until it's scanned, and scanning it directly with a phone means committing to whatever page or action it triggers before actually knowing what that is, which matters when the code showed up somewhere less than trustworthy. This tool scans and decodes a QR code from an uploaded image or a live webcam feed, showing the actual text or URL hidden inside instantly rather than requiring a phone's camera app to commit to opening it. Useful for checking a QR code's actual destination before scanning it with a phone and getting redirected somewhere unexpected, decoding a QR code from a screenshot or a saved image without a phone on hand, or reading a code live through a webcam during a presentation or a meeting.`,
    examples: [
      {
        title: "Check a QR code's destination before trusting it",
        code: `Input: qr-flyer-photo.jpg\nOutput: decoded URL: https://example.com/promo`,
        note: 'Reveals where a code actually leads before scanning it with a phone.',
      },
      {
        title: 'Scan a code live via webcam',
        code: `Input: webcam feed pointed at a QR code\nOutput: decoded text: "WIFI:S:GuestNetwork;T:WPA;P:pass1234;;"`,
        note: 'Reads a code in real time without needing a phone.',
      },
    ],
  },

  'english-grammar-checker': {
    description: `A sentence can be grammatically correct and still read poorly, wordy where it should be tight, passive where an active voice would actually be clearer, and catching that kind of issue takes an editorial pass beyond simply checking whether each rule of grammar was technically followed. This tool checks English grammar with detailed suggestions covering punctuation, style, and clarity together, going past bare correctness to flag a sentence that's technically fine but could actually read better. Useful for tightening an unnecessarily wordy sentence that's grammatically correct but hard to follow, catching an awkward passive-voice construction that muddies who's actually doing what, or getting a detailed explanation of a style suggestion rather than a bare grammar correction with no reasoning given.`,
    examples: [
      {
        title: 'Tighten a wordy, passive sentence',
        code: `Input: "The decision was made by the committee to postpone the event."\nSuggestion: "The committee decided to postpone the event."`,
        note: 'Flags a passive construction that muddies who did what.',
      },
      {
        title: 'Get a detailed style explanation',
        code: `Input: "He is a person who always arrives late."\nSuggestion: "He always arrives late." - reason: removes an unnecessary relative clause`,
        note: 'Explains the clarity issue rather than just rewriting the sentence.',
      },
    ],
  },

  'toml-to-json': {
    description: `A Rust project's Cargo.toml or a Python project's pyproject.toml holds configuration that a JavaScript-based build tool or script often can't read directly, since TOML and JSON are both structured formats but not remotely the same syntax, and a tool expecting JSON has no way to parse TOML without an actual conversion first. This tool converts a TOML config file into formatted JSON with validation included, all directly in the browser with nothing uploaded anywhere. Useful for feeding a Rust or a Python project's TOML configuration into a JavaScript tool or script that only reads JSON, converting an unfamiliar TOML file into JSON's more universally recognized syntax just to read its structure more easily, or validating a TOML file's syntax while getting a JSON version out of the same pass.`,
    examples: [
      {
        title: 'Convert a Cargo.toml file',
        code: `Input: [package]\nname = "my-app"\nversion = "0.1.0"\nOutput: { "package": { "name": "my-app", "version": "0.1.0" } }`,
        note: 'Turns Rust project configuration into JSON a JS tool can read.',
      },
      {
        title: 'Validate and convert a config file',
        code: `Input: [server]\nport = 8080\nhost = "localhost"\nOutput: { "server": { "port": 8080, "host": "localhost" } }, valid TOML`,
        note: 'Confirms the TOML syntax is valid while producing the JSON version.',
      },
    ],
  },
};

export default FIX_BATCH_54;
