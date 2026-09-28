import type { ToolContent } from './tool-content';

// Reviewed against selected components, 2026-09-26.
export const reviewedToolContent: Record<string, ToolContent> = {
  "json-to-typescript": {
    "description": "Infer TypeScript declarations from a JSON sample. Objects become interfaces; arrays and primitive values become type aliases. Mixed arrays retain their observed member types, including null. Review the result against data your sample does not cover.",
    "examples": [
      {
        "title": "A mixed list",
        "code": "{\"class\":true,\"items\":[1,\"two\",null]}",
        "note": "The class property is boolean; items contains number, string and null. Choose valid, non-reserved root and array-item names. Limits: 100,000 characters, 10,000 values and 64 nesting levels. Unsafe integers are rejected."
      }
    ],
    "features": [
      "Sample-based type inference",
      "Root and array-item names",
      "Quote and semicolon options"
    ]
  },
  "time-zone-converter": {
    "description": "Convert a dated local time to several IANA time zones. Compare a meeting time in New York with London and Tokyo, including date changes and daylight-saving offsets for that date.",
    "examples": [
      {
        "title": "A summer meeting",
        "code": "2024-07-01 12:00 in America/New_York\nEurope/London: 2024-07-01 17:00\nAsia/Tokyo: 2024-07-02 01:00",
        "note": "Choose a date and time, a source zone and target zones. Times that occur twice or do not exist during a DST transition produce an error; choose another time. Rules come from your browser, not a live time service."
      }
    ],
    "features": [
      "Multiple target zones",
      "Date-aware DST conversion",
      "Copy each result"
    ]
  },
  "html-table-generator": {
    "description": "Turn CSV rows and a separate header row into an HTML table. Quoted commas stay in one cell, and HTML characters are escaped in headers and values. Preview the table before copying its markup.",
    "examples": [
      {
        "title": "A quoted comma",
        "code": "Headers: Name,Note\nCSV: \"Ada, Lovelace\",\"<hello>\"\nCells: Ada, Lovelace | &lt;hello&gt;",
        "note": "Use Generate Table after changing input or options. Headers set the column count: extra data cells are omitted and missing cells are blank. Leave headers empty to keep each row’s cells. Limits: 100,000 input characters and 8,000 header characters."
      }
    ],
    "features": [
      "CSV quoting",
      "Escaped HTML and preview",
      "Borders and alternating row backgrounds"
    ]
  },
  "ldap-filter-generator": {
    "description": "Build an LDAP search filter from attribute, operator and value rows. Combine clauses with AND or OR, or negate the whole filter. Values are treated as literals; use the presence operator to match any value.",
    "examples": [
      {
        "title": "Match a literal name",
        "code": "Attribute: cn\nOperator: equals (=)\nValue: Ada (admin)\nFilter: (cn=Ada \\28admin\\29)",
        "note": "Parentheses, NUL, asterisk and backslash are escaped as filter octets. Attribute names or numeric OIDs are checked locally. This does not connect to a directory or validate its schema. Each attribute and value is limited to 8,000 characters."
      }
    ],
    "features": [
      "AND, OR and negation",
      "Literal-value escaping",
      "Presence and comparison operators"
    ]
  },
  "json-to-python": {
    "description": "Convert JSON into a Python data assignment containing dictionaries, lists and scalar literals. JSON true, false and null become True, False and None. Quoted dictionary keys and nested lists are preserved.",
    "examples": [
      {
        "title": "A Python data assignment",
        "code": "JSON: {\"active\":true,\"items\":[null,false]}\nPython: data = {\"active\": True, \"items\": [None, False]}",
        "note": "Output is indented Python literals, not Pydantic models, dataclasses or executable conversion logic. Limits: 100,000 characters, 10,000 values and 64 nesting levels. Unsafe integers are rejected; represent large IDs as strings."
      }
    ],
    "features": [
      "Python dictionaries and lists",
      "Boolean and null conversion",
      "Copy the data assignment"
    ]
  },
  "split-csv": {
    "description": "Split a UTF-8 CSV file into smaller downloads by data-row count. The first record is treated as the header and repeated in every part. Quoted newlines stay inside a record instead of becoming extra rows.",
    "examples": [
      {
        "title": "Two records per file",
        "code": "name,note\nAda,\"line 1\nline 2\"\nLin,\"comma, here\"\nSam,\"a \"\"quote\"\"\"",
        "note": "Choose Rows Per File after upload. Downloads arrive individually, so your browser may ask to allow multiple files. Limits: 10 MiB and 100,000 data rows. Record separators become LF; field quoting and embedded line breaks are preserved."
      }
    ],
    "features": [
      "Header repeated in each part",
      "Quoted multiline records",
      "Individual CSV downloads"
    ]
  },
  "html-minifier": {
    "description": "Remove ordinary HTML comments and trim whitespace at the start and end of a snippet. This conservative minifier keeps text spacing, quoted attributes and raw-element contents intact so inline words do not run together.",
    "examples": [
      {
        "title": "Keep the word separator",
        "code": "<span>Hello</span> <span>world</span><!-- remove -->\nResult: <span>Hello</span> <span>world</span>",
        "note": "It preserves script, style, pre, title and textarea contents, conditional comments and comments beginning with <!--!. It does not minify JavaScript or CSS, collapse internal whitespace or remove optional tags. Unclosed comments, tags and raw elements return errors. Input limit: 100,000 characters."
      }
    ],
    "features": [
      "Ordinary comment removal",
      "Inline spacing preserved",
      "Copy output and compare bytes"
    ]
  },
  "ipynb-formatter": {
    "description": "Pretty-print a Jupyter notebook’s JSON with two-space indentation. Formatting preserves cell sources, outputs and metadata. Optionally sort cells by execution count when you intend to change their document order.",
    "examples": [
      {
        "title": "Preserve notebook data",
        "code": "Paste or upload a version 4 .ipynb notebook. Leave Sort cells by execution count unchecked to preserve the original cell order, then copy or download the formatted JSON.",
        "note": "Limits: 10 MiB, 64 nesting levels and 100,000 JSON values. The tool checks notebook structure, not executable code or every detail of the official schema. Sorting moves cells without execution counts to the end. It does not execute cells or clear outputs."
      }
    ],
    "features": [
      "Version 4 notebook checks",
      "Optional execution-count sorting",
      "Copy or download formatted JSON"
    ]
  },

  "jwt-decoder": {
    "description": "Inspect the header, payload and signature text of a three-part JWT. Numeric date claims are shown in UTC, with an expiry status based on your device clock. Decoding does not verify the signature, issuer or audience.",
    "examples": [
      {
        "title": "Inspect a sample token",
        "code": "Use Example. The header contains alg: HS256 and the payload contains sub: 1234567890.",
        "note": "The sample has no exp claim. A readable payload or Not expired badge does not prove a token is trusted. Input is limited to 100,000 characters."
      }
    ],
    "features": [
      "Header and payload JSON",
      "UTC claim dates",
      "Separate copy buttons"
    ]
  },
  "json-formatter": {
    "description": "Format JSON with two or four spaces, or remove whitespace with Minify. Invalid JSON produces an input error. Use this to inspect an API response or check a configuration file before copying it back.",
    "examples": [
      {
        "title": "Minify a response",
        "code": "Input: { \"ok\": true, \"items\": [1, 2] }\nOutput: {\"ok\":true,\"items\":[1,2]}",
        "note": "Use double-quoted keys and strings. Comments and trailing commas are invalid JSON. Limits: 100,000 characters, 10,000 values and 64 nesting levels. Unsafe integer values are rejected; use strings for large IDs."
      }
    ],
    "features": [
      "Two or four space indentation",
      "Format and minify modes",
      "Copy parsed output"
    ]
  },
  "regex-tester": {
    "description": "Test a JavaScript regular expression against sample text. Toggle flags, inspect highlighted matches, and read numbered or named capture groups. Enter the pattern without surrounding slashes.",
    "examples": [
      {
        "title": "Find order numbers",
        "code": "Pattern: \\d+\nFlags: g\nText: Order 12 costs 34\nMatches: 12 at index 6; 34 at index 15",
        "note": "This uses JavaScript regex syntax, not PCRE. Limits: 2,000 pattern characters, 50,000 test characters, 1,000 matches and a 500 ms worker timeout. The detailed list shows the first 100 matches."
      }
    ],
    "features": [
      "JavaScript regex flags",
      "Match offsets and capture groups",
      "Highlighted matches"
    ]
  },
  "url-encode": {
    "description": "Encode text for a URL component, such as one query parameter value, or decode percent-encoded text. Spaces become %20. Paste a value rather than a complete URL when you want to preserve the URL structure.",
    "examples": [
      {
        "title": "Encode a search value",
        "code": "Input: café & tea\nOutput: caf%C3%A9%20%26%20tea",
        "note": "This uses encodeURIComponent and decodeURIComponent. A plus sign is not decoded to a space. Malformed percent escapes and invalid UTF-8 sequences produce an error. Input is limited to 100,000 characters."
      }
    ],
    "features": [
      "Encode and decode modes",
      "UTF-8 percent encoding",
      "Copy output"
    ]
  },
  "base64-encoder-decoder": {
    "description": "Encode UTF-8 text as Base64 or decode Base64 back to text. Use Swap to move a result into the opposite mode and check a round trip. This tool handles text, not file uploads or image previews.",
    "examples": [
      {
        "title": "Round-trip a greeting",
        "code": "Encode: Hello, World!\nResult: SGVsbG8sIFdvcmxkIQ==\nDecode that result to recover: Hello, World!",
        "note": "Base64 is reversible encoding, not encryption. Decoding expects the standard +/ alphabet and valid UTF-8, not arbitrary binary data or Base64URL. Text is limited to 100,000 characters; encoded input has a separate size limit."
      }
    ],
    "features": [
      "UTF-8 text encoding",
      "Decode and swap",
      "Copy output"
    ]
  },
  "password-generator": {
    "description": "Generate a random password in your browser. Choose a length from 8 to 64 characters and select uppercase letters, lowercase letters, digits or symbols. Each selected character group is represented in the result.",
    "examples": [
      {
        "title": "Create a password without look-alikes",
        "code": "Set length to 20. Keep letters and digits selected, turn symbols off if the destination requires it, then enable No look-alikes and regenerate.",
        "note": "No look-alikes excludes O, 0, I, l and 1. Output changes on each generation; do not reuse a published example as a password. The strength label is an estimate based on length and the selected character pool."
      }
    ],
    "features": [
      "8 to 64 characters",
      "Selected character groups included",
      "Look-alike exclusion"
    ]
  },
  "uuid-generator": {
    "description": "Generate random UUID v4 identifiers using your browser. Keep or remove hyphens, change letter case, and copy one value or the last five generated values. Use these identifiers for test fixtures or record IDs.",
    "examples": [
      {
        "title": "Choose an identifier format",
        "code": "A UUID v4 has the shape xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. Turn off Hyphens for 32 hexadecimal characters.",
        "note": "This page generates version 4 only. UUIDs are identifiers, not passwords or access tokens. The five-item history is held in page memory and disappears on reload."
      }
    ],
    "features": [
      "UUID v4 generation",
      "Hyphen and case controls",
      "Five-item history"
    ]
  },
  "markdown-to-html": {
    "description": "Convert Markdown to sanitized HTML and inspect it in a preview. Try headings, lists, links, fenced code or GitHub-style tables, then copy the HTML for your publishing workflow.",
    "examples": [
      {
        "title": "Convert a heading and emphasis",
        "code": "# Hello\n\nA **bold** statement.\n\nHTML:\n<h1>Hello</h1>\n<p>A <strong>bold</strong> statement.</p>",
        "note": "Raw HTML is sanitized, so scripts and unsafe markup are removed. Input is limited to 100,000 characters. The preview can load HTTPS images referenced by your Markdown; it is not an offline-only renderer."
      }
    ],
    "features": [
      "Rendered preview",
      "Sanitized HTML output",
      "GitHub-style Markdown"
    ]
  },
  "case-converter": {
    "description": "View eight case conversions for the same text, including uppercase, lowercase, title case, sentence case, camelCase, snake_case, kebab-case and CONSTANT_CASE. Copy the result that fits a label or code identifier.",
    "examples": [
      {
        "title": "Convert a variable name",
        "code": "Input: Hello World Example\ncamelCase: helloWorldExample\nsnake_case: hello_world_example\nkebab-case: hello-world-example",
        "note": "Title case capitalizes words without applying an editorial style guide. Sentence mode capitalizes only the first character of the input. Identifier splitting handles whitespace, underscores, hyphens, dots, slashes and lowercase-to-uppercase boundaries; review acronyms and punctuation."
      }
    ],
    "features": [
      "Eight outputs at once",
      "Copy each result",
      "Example and clear controls"
    ]
  },
  "word-counter": {
    "description": "Count words, characters, lines and paragraphs as you type. Copy the statistics for a draft or length check. Reading time uses 200 words per minute; speaking time uses 130, both rounded up to whole minutes.",
    "examples": [
      {
        "title": "Check a short sentence",
        "code": "Input: Hello world.\nWords: 2\nCharacters: 12\nSentences: 1\nParagraphs: 1\nLines: 1",
        "note": "Words are separated by whitespace. Paragraphs are separated by blank lines; sentence counts use punctuation heuristics. Character counts use JavaScript string length, so some emoji count as more than one. This is not a language-aware text analysis."
      }
    ],
    "features": [
      "Live text statistics",
      "Counts with and without whitespace",
      "Copy statistics"
    ]
  },
  "reading-time-calculator": {
    "description": "Estimate reading time from the word count and a speed you choose. Adjust the slider from 100 to 500 words per minute to model a slower or faster reader. The default is 200 words per minute.",
    "examples": [
      {
        "title": "Estimate a draft at two speeds",
        "code": "A 600-word draft takes 3 minutes at 200 wpm, or 4 minutes at 150 wpm.",
        "note": "Words are separated by whitespace. This estimate does not detect text complexity or include time spent studying images and diagrams. Choose a speed that fits your audience and check the result against a real reading session."
      }
    ],
    "features": [
      "Adjustable 100 to 500 wpm",
      "Word and character counts",
      "Minutes and seconds estimate"
    ]
  },
  "image-resizer": {
    "description": "Resize one image to exact pixel dimensions in your browser. Keep its aspect ratio or set width and height separately, then choose Auto, PNG, JPEG or WebP output. Preview the result and compare its dimensions and file size before downloading.",
    "examples": [
      {
        "title": "Make a smaller landscape image",
        "code": "Load a 1200 × 800 image. Keep the aspect ratio locked and set width to 600 pixels; height becomes 400 pixels. Choose the output format and create the resized result.",
        "note": "Use whole-pixel dimensions up to 8,192 pixels per side and 40 megapixels total. The input file limit depends on your plan. JPEG flattens transparency onto white. Smaller dimensions do not guarantee a smaller file, and resizing does not preserve animation."
      }
    ],
    "features": [
      "Aspect ratio lock",
      "PNG, JPEG or WebP output",
      "Result dimensions and size comparison"
    ]
  },
  "serp-preview": {
    "description": "Draft a title, URL and description in an approximate search snippet preview. Switch device views and copy metadata. This is a manual preview; it does not fetch a URL or reproduce Google pixel for pixel.",
    "examples": [
      {
        "title": "Draft a snippet",
        "code": "Title: Example shop\nURL: https://example.com/shop\nDescription: Browse the current catalog.",
        "note": "Enter these fields manually and switch device views. This does not fetch or change a live search result."
      }
    ],
    "features": [
      "No. It is an approximate manual preview. Actual search snippets can vary by query and device, and titles or descriptions may be rewritten.",
      "No. Enter the title, URL and description yourself. The tool does not crawl, publish or submit a page."
    ]
  },
  "readability-score": {
    "description": "Estimate Flesch Reading Ease, Flesch-Kincaid Grade and SMOG from pasted text. Counts are heuristic and do not measure individual comprehension. ARI and Coleman-Liau are not implemented.",
    "examples": [
      {
        "title": "Compare two drafts",
        "code": "Compare a paragraph of short sentences with the same ideas written as one long sentence.",
        "note": "Scores use approximate counts. Review the text with its intended readers instead of treating a grade as a comprehension guarantee."
      }
    ],
    "features": [
      "Flesch Reading Ease, Flesch-Kincaid Grade and SMOG. ARI and Coleman-Liau are not implemented.",
      "Word, sentence and syllable counts are estimates. Scores describe text patterns and do not measure comprehension for a particular reader."
    ]
  },

  "keyword-density-checker": {
    "description": "Count a keyword or phrase in pasted plain text. Review word-window frequency and counts. HTML is not extracted, so paste readable text rather than markup.",
    "examples": [
      {
        "title": "Count a phrase",
        "code": "Text: red blue red blue\nPhrase: red blue\nOccurrences: 2",
        "note": "Paste plain text. Counts describe the supplied text, not a recommended search ranking target."
      }
    ],
    "features": [
      "Paste plain text. The tool does not extract readable text from HTML, so markup can affect its counts.",
      "The analyzer compares word windows with the supplied phrase. It reports frequency within the pasted text; it does not recommend a ranking target."
    ]
  },
  "word-combinations-generator": {
    "description": "Generate two- or three-word combinations or ordered permutations from a word list. Output stops at 2,000 results; larger inputs can have additional possibilities.",
    "examples": [
      {
        "title": "Combine a short list",
        "code": "Words: red, blue, green\nChoose two-word combinations or ordered permutations.",
        "note": "Output is capped at 2,000 results, so a larger list can have more possibilities than are shown."
      }
    ],
    "features": [
      "The output is capped at 2,000 results.",
      "Two- or three-word combinations and ordered permutations. Large inputs may produce more possibilities than the cap allows."
    ]
  },
  "jwt-token-tester": {
    "description": "Inspect a JWT and verify shared-secret HMAC signatures with HS256, HS384 or HS512. RSA and elliptic-curve verification are not supported. Review issuer, audience and claims separately.",
    "examples": [
      {
        "title": "Check a development token",
        "code": "Paste a three-part HS256 token and supply its matching development shared secret to compare the signature.",
        "note": "Only HS256, HS384 and HS512 are supported. A matching signature does not establish the intended issuer or audience."
      }
    ],
    "features": [
      "Shared-secret HMAC signatures using HS256, HS384 or HS512. It does not verify RSA or elliptic-curve signatures.",
      "No. You still need to validate the intended issuer, audience and claims in your application."
    ]
  },
  "word-frequency-table": {
    "description": "Count Unicode letter runs in pasted text, with optional common-word exclusion and a minimum length. Punctuation separates words. Percentages use only words remaining after the filters; this is not language-specific segmentation.",
    "examples": [
      {
        "title": "Count punctuation-separated words",
        "code": "Input: café,café বাংলা\nCounts: café = 2; বাংলা = 1",
        "note": "With these words retained by the filters, percentages are 66.7% and 33.3%. Punctuation separates letter runs; words are not segmented by language."
      }
    ],
    "features": []
  },
  "json-to-markdown-table": {
    "description": "Convert a JSON object or nonempty array of objects to a Markdown table. Columns include keys from every row. Nested values are serialized, table syntax is escaped, and you can copy or download the result.",
    "examples": [
      {
        "title": "Keep columns introduced by later rows",
        "code": "Input: [{\"name\":\"Ada\"},{\"name\":\"Grace\",\"role\":\"Engineer\"}]\nColumns: name, role",
        "note": "Use one object or a nonempty array of objects. Limits: 1–200 columns, 10,000 rows and 1,000,000 input characters. Nested values use JSON text; null or missing cells are empty. There are no alignment controls."
      }
    ],
    "features": [
      "Union of row keys",
      "Escaped pipes and line breaks",
      "Copy and Markdown file download"
    ]
  }
};
