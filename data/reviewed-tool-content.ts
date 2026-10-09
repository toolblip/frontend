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
    "description": "Free JWT decoder that shows header, payload, and signature text for a three-part token in your browser. Numeric date claims appear in UTC with an expiry status from your device clock—without verifying the signature.",
    "examples": [
      {
        "title": "Inspect a sample token",
        "code": "Use Example. Header shows alg: HS256; payload shows sub: 1234567890.",
        "note": "A readable payload or Not expired badge does not prove the token is trusted. Input limit: 100,000 characters."
      },
      {
        "title": "Format claim JSON after decode",
        "code": "Copy the payload JSON, then open JSON Formatter to beautify nested claims before debugging.",
        "note": "This page does not verify issuer, audience, or signature. Pair with Base64 Encode/Decode only when you need to inspect a single JWT segment by hand."
      }
    ],
    "features": [
      "Header and payload JSON",
      "UTC claim dates",
      "Copy each part separately"
    ]
  },
  "json-formatter": {
    "description": "Free JSON formatter that beautifies with two or four spaces, or minifies whitespace, entirely in your browser. Invalid JSON shows the parser error so you can fix it before copying an API response or config back.",
    "examples": [
      {
        "title": "Beautify a compressed payload",
        "code": "Input: {\"ok\":true,\"items\":[1,2]}\nFormat (2 spaces):\n{\n  \"ok\": true,\n  \"items\": [1, 2]\n}",
        "note": "Use double-quoted keys and strings. Comments and trailing commas are invalid JSON. For a collapsible tree, open JSON Tree View after formatting."
      },
      {
        "title": "Minify before shipping",
        "code": "Input: { \"ok\": true, \"items\": [1, 2] }\nMinify: {\"ok\":true,\"items\":[1,2]}",
        "note": "Limits: 100,000 characters, 10,000 values and 64 nesting levels. Unsafe integers are rejected; quote large IDs as strings."
      }
    ],
    "features": [
      "Beautify with 2 or 4 spaces",
      "Minify for compact payloads",
      "Parser errors without uploading"
    ]
  },
  "regex-tester": {
    "description": "Free JavaScript regex tester: paste a pattern (no surrounding slashes), toggle flags, and inspect highlighted matches with numbered or named capture groups—all in your browser.",
    "examples": [
      {
        "title": "Find order numbers",
        "code": "Pattern: \\d+\nFlags: g\nText: Order 12 costs 34\nMatches: 12 at index 6; 34 at index 15",
        "note": "JavaScript RegExp only—not Python or PCRE. Limits: 2,000 pattern chars, 50,000 test chars, 1,000 matches, 500 ms worker timeout. The detailed list shows the first 100 matches."
      },
      {
        "title": "Named groups for a slug",
        "code": "Pattern: (?<kind>blog|docs)/(?<slug>[a-z0-9-]+)\nFlags: g\nText: /blog/hello-world\nGroups: kind=blog, slug=hello-world",
        "note": "This page tests matches; it does not run replace. For lookahead/lookbehind walkthroughs, open the related tutorial on the page."
      }
    ],
    "features": [
      "JavaScript flags and highlights",
      "Match offsets and capture groups",
      "No upload, runs locally"
    ]
  },
  "url-encode": {
    "description": "Free URL encode and decode for a single component value with encodeURIComponent. Spaces become %20. Paste a value—not a full URL—when you need to keep structure intact.",
    "examples": [
      {
        "title": "Encode a search value",
        "code": "Input: café & tea\nOutput: caf%C3%A9%20%26%20tea",
        "note": "A plus sign is not decoded to a space. Malformed percent escapes and invalid UTF-8 produce an error. Input limit: 100,000 characters."
      },
      {
        "title": "Decode a query fragment",
        "code": "Input: hello%20world%21\nDecode: hello world!",
        "note": "Switch to Decode mode for one result at a time. For Base64 payloads use Base64 Encode/Decode; for JWT parts use JWT Decoder."
      }
    ],
    "features": [
      "Encode and decode modes",
      "UTF-8 percent encoding",
      "Copy output"
    ]
  },
  "base64-encoder-decoder": {
    "description": "Free Base64 encode and decode for UTF-8 text in your browser. Use Swap to round-trip a result. Text only—images and files belong on Base64 Image Converter.",
    "examples": [
      {
        "title": "Round-trip a greeting",
        "code": "Encode: Hello, World!\nResult: SGVsbG8sIFdvcmxkIQ==\nDecode that result → Hello, World!",
        "note": "Base64 is reversible encoding, not encryption. Expects the standard +/ alphabet and valid UTF-8, not Base64URL or arbitrary binary."
      },
      {
        "title": "Prefer JWT Decoder for tokens",
        "code": "For a compact three-part JWT, open JWT Decoder. Use this page when you only need UTF-8 text ↔ standard Base64.",
        "note": "Text limit 100,000 characters; encoded input has a separate size cap. This decoder expects +/ padding, not Base64URL."
      }
    ],
    "features": [
      "UTF-8 text encode/decode",
      "Swap for round trips",
      "Runs locally in the browser"
    ]
  },
  "password-generator": {
    "description": "Free strong random password generator that runs in your browser with cryptographic randomness. Choose length 8–64 and which character groups to include; each selected group appears in the result.",
    "examples": [
      {
        "title": "Create a password without look-alikes",
        "code": "Length 20 · uppercase + lowercase + digits · No look-alikes on · symbols off if the site bans them · Generate",
        "note": "No look-alikes excludes O, 0, I, l and 1. Do not reuse a published sample as a real password. Shareable links keep settings only, never the password."
      },
      {
        "title": "Check a candidate you already have",
        "code": "Generate here, then open Password Strength Checker to review composition heuristics on a password you typed yourself.",
        "note": "The on-page strength label is only an estimate from length and character pool. Prefer a unique password per account."
      }
    ],
    "features": [
      "8 to 64 characters",
      "Guaranteed character groups",
      "Look-alike exclusion"
    ]
  },
  "uuid-generator": {
    "description": "Free UUID generator for random UUID v4 values in your browser. Toggle hyphens and letter case, then copy one ID or the last five from page history—ideal for fixtures and record keys.",
    "examples": [
      {
        "title": "Choose an identifier format",
        "code": "Shape: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx. Turn off Hyphens for 32 hex characters; toggle UPPERCASE if your fixture style needs it.",
        "note": "Version 4 only. UUIDs are identifiers, not passwords—use Password Generator for secrets. History clears on reload."
      },
      {
        "title": "Build a small fixture set",
        "code": "Generate five times, copy the history list into a test file, then regenerate if you need a fresh set.",
        "note": "There is no bulk count slider and no UUID v1/v7 picker on this page."
      }
    ],
    "features": [
      "UUID v4 from browser crypto",
      "Hyphen and case controls",
      "Five-item history"
    ]
  },
  "markdown-to-html": {
    "description": "Free Markdown to HTML converter with a sanitized live preview. Try headings, lists, links, fenced code, or GitHub-style tables, then copy the HTML for publishing—all in your browser.",
    "examples": [
      {
        "title": "Convert a heading and emphasis",
        "code": "# Hello\n\nA **bold** statement.\n\nHTML:\n<h1>Hello</h1>\n<p>A <strong>bold</strong> statement.</p>",
        "note": "Raw HTML is sanitized, so scripts and unsafe markup are removed. Input limit: 100,000 characters."
      },
      {
        "title": "Check length after convert",
        "code": "Copy the HTML, then open Character Counter or Word Counter if a CMS field has a length limit on the rendered text.",
        "note": "The preview can load HTTPS images from your Markdown; it is not an offline-only renderer. There is no HTML file download."
      }
    ],
    "features": [
      "Live sanitized preview",
      "GitHub-style Markdown",
      "Copy HTML output"
    ]
  },
  "case-converter": {
    "description": "Free case converter that shows eight outputs at once—UPPER, lower, Title, Sentence, camelCase, snake_case, kebab-case, and CONSTANT_CASE—so you can copy the form that fits a label or identifier.",
    "examples": [
      {
        "title": "Convert a variable name",
        "code": "Input: Hello World Example\ncamelCase: helloWorldExample\nsnake_case: hello_world_example\nkebab-case: hello-world-example\nCONSTANT_CASE: HELLO_WORLD_EXAMPLE",
        "note": "Title case capitalizes words without an editorial style guide. Sentence mode capitalizes only the first input character. Review acronyms after splitting."
      },
      {
        "title": "Normalize an API field name",
        "code": "Input: user_id\ncamelCase: userId\n→ paste into code, or check length with Word Counter / Character Counter if the label has a UI limit.",
        "note": "Identifier splitting handles whitespace, underscores, hyphens, dots, slashes, and lowercase-to-uppercase boundaries."
      }
    ],
    "features": [
      "Eight conversions at once",
      "Copy each result",
      "Runs in your browser"
    ]
  },
  "word-counter": {
    "description": "Free word counter for words, characters, sentences, paragraphs and lines as you type, plus reading and speaking time. Copy the statistics for a draft or length check.",
    "examples": [
      {
        "title": "Check a short sentence",
        "code": "Input: Hello world.\nWords: 2 · Characters: 12 · Sentences: 1 · Paragraphs: 1 · Lines: 1",
        "note": "Words are separated by whitespace. Sentence counts use punctuation heuristics. Character length is JavaScript string length, so some emoji count as more than one."
      },
      {
        "title": "Estimate reading time on a draft",
        "code": "A 400-word draft → about 2 minutes reading (200 wpm) and about 4 minutes speaking (130 wpm), each rounded up.",
        "note": "For a character-only breakdown (total, no spaces, letters, digits), use Character Counter. For a custom words-per-minute slider, use Reading Time Calculator."
      }
    ],
    "features": [
      "Live word and character counts",
      "Reading and speaking time",
      "Copy statistics"
    ]
  },
  "reading-time-calculator": {
    "description": "Free reading time calculator from word count and a words-per-minute speed you choose (100–500; default 200). Model a slower or faster reader before you publish.",
    "examples": [
      {
        "title": "Estimate a draft at two speeds",
        "code": "A 600-word draft → 3 minutes at 200 wpm, or 4 minutes at 150 wpm.",
        "note": "Words are separated by whitespace. This estimate does not score complexity or time spent on images."
      },
      {
        "title": "Pair with Word Counter",
        "code": "Paste the same draft into Word Counter for sentences and paragraphs, then tune WPM here for audience-specific reading time.",
        "note": "The slider does not know how fast a specific person reads—pick a speed that matches your audience and verify with a real read."
      }
    ],
    "features": [
      "Adjustable 100 to 500 wpm",
      "Word and character counts",
      "Minutes and seconds estimate"
    ]
  },
  "image-resizer": {
    "description": "Free image resizer for exact pixel width and height in your browser. Lock aspect ratio or set both sides, choose Auto, PNG, JPEG or WebP, then preview dimensions and file size before download.",
    "examples": [
      {
        "title": "Shrink a landscape photo",
        "code": "1200 × 800 → lock ratio → width 600 → height becomes 400 → export Auto/JPEG/PNG/WebP and compare bytes.",
        "note": "Whole-pixel sizes only, max 8,192 px per side and 40 megapixels. Smaller dimensions do not always mean a smaller file. Animation is not preserved."
      },
      {
        "title": "Need crop or many files instead?",
        "code": "Crop a region with Image Cropper, shrink file size with Image Compressor, or resize up to 20 files with Batch Image Resizer.",
        "note": "This page stretches one image to the typed size. It does not apply social-media crop presets or batch folders."
      }
    ],
    "features": [
      "Aspect ratio lock",
      "PNG, JPEG or WebP export",
      "Preview size before download"
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
  },

  "qr-code-generator": {
    "description": "Free QR code generator for URLs, text, WiFi, and vCards in your browser. Choose size, download PNG or SVG—nothing is uploaded.",
    "examples": [
      {
        "title": "Link QR for a page",
        "code": "Type: URL\nText: https://toolblip.com\nSize: 256 → Download PNG or SVG",
        "note": "URL and text modes encode the string you enter. Prefer HTTPS links when the scan should open a site."
      },
      {
        "title": "Guest WiFi without typing the password",
        "code": "Type: WiFi · SSID · Security WPA · Password → Generate → guests scan to join",
        "note": "The WiFi payload includes the password you type. Generation stays in the browser; clear the page when you are done."
      }
    ],
    "features": [
      "URL, text, WiFi, and vCard modes",
      "PNG and SVG download",
      "Sizes from 128 to 1024 px"
    ]
  },
  "percentage-calculator": {
    "description": "Free percentage calculator with separate modes for part-to-whole percent, percentage change, discounts, tips, and markup—each with the arithmetic shown.",
    "examples": [
      {
        "title": "What is 15% of 80?",
        "code": "Mode: Percentage · 15% of 80 → 12 (0.15 × 80)",
        "note": "Switch modes with the tabs. Only the active mode’s inputs are used."
      },
      {
        "title": "Tip split three ways",
        "code": "Mode: Tip · bill + 18% tip · 3 people → tip total and per-person share",
        "note": "Tip presets are shortcuts; you can type a custom tip percent. Markup and discount are separate modes."
      }
    ],
    "features": [
      "Five calculation modes",
      "Formula shown with the result",
      "Runs locally in the browser"
    ]
  },
  "color-picker": {
    "description": "Free color picker for HEX, RGB, and HSL with a live swatch and a WCAG contrast check against white—copy any format for CSS or design tools.",
    "examples": [
      {
        "title": "Match a brand blue",
        "code": "HEX: #0EA5E9\nRGB: rgb(14, 165, 233)\nHSL: hsl(199, 89%, 48%)",
        "note": "Type a 6-digit HEX or use the native color control. There is no CMYK output on this page."
      },
      {
        "title": "Quick contrast vs white",
        "code": "Picked color on #ffffff → AA / AAA / Fail badge for normal text",
        "note": "Contrast is measured against white only. For arbitrary foreground/background pairs, use Contrast Checker."
      }
    ],
    "features": [
      "HEX, RGB, and HSL values",
      "Copy each format",
      "WCAG badge vs white"
    ]
  },
  "character-counter": {
    "description": "Free character counter for total length, counts without spaces or newlines, plus letters and digits—live as you type in your browser.",
    "examples": [
      {
        "title": "Count a short line",
        "code": "Input: The quick brown fox jumps over 2 lazy dogs.\nTotal / no spaces / letters / digits update live",
        "note": "JavaScript string length counts some emoji as more than one character."
      },
      {
        "title": "Draft vs a limit you choose",
        "code": "Paste your draft, read Total Characters, compare to your own cap (tweet, title, CMS field)",
        "note": "This page does not draw Twitter, LinkedIn, or meta-description bars. Use Word Counter when you also need words and reading time."
      }
    ],
    "features": [
      "Live character breakdowns",
      "Spaces and newlines separated",
      "No upload required"
    ]
  },
  "unit-converter": {
    "description": "Free unit converter for length, weight, and temperature—pick a pair and get a live metric ↔ imperial result in your browser.",
    "examples": [
      {
        "title": "Oven temperature",
        "code": "Category: Temperature · 180 °C → °F (updates as you type)",
        "note": "Each tab has its own conversion pairs. This is not a full engineering unit catalog."
      },
      {
        "title": "Road distance",
        "code": "Category: Length · 10 km → miles",
        "note": "Switch pairs with the on-page tabs; results recalculate without a separate Convert button."
      }
    ],
    "features": [
      "Length, weight, temperature",
      "Live conversion",
      "Common metric and imperial pairs"
    ]
  },
  "lorem-ipsum-generator": {
    "description": "Free lorem ipsum generator for classic placeholder text—set words, sentences, or paragraphs (1–100) and copy for mockups.",
    "examples": [
      {
        "title": "Five-word label filler",
        "code": "Mode: Words · Count: 5 · classic opening on → Lorem ipsum dolor sit amet",
        "note": "Toggle the classic opening off if you want randomized Latin without the familiar start."
      },
      {
        "title": "Three paragraphs for a layout",
        "code": "Mode: Paragraphs · Count: 3 · Regenerate → Copy",
        "note": "Placeholder only—it does not write real marketing copy. Check length with Character Counter if a field has a cap."
      }
    ],
    "features": [
      "Words, sentences, or paragraphs",
      "Count from 1 to 100",
      "Optional classic opening"
    ]
  },
  "image-compressor": {
    "description": "Free image compressor for JPEG, PNG, and WebP in your browser—set a maximum quality, compare real bytes, and keep the original when compression would grow the file.",
    "examples": [
      {
        "title": "Shrink a JPEG photo",
        "code": "Format: JPEG · max quality 80 → preview bytes; quality may step down only if needed to get smaller",
        "note": "Quality is not a guaranteed percent savings. PNG is lossless here and does not use quality retries."
      },
      {
        "title": "When compression cannot help",
        "code": "If every encode is larger, the tool keeps the original file and says there was no size reduction",
        "note": "One image at a time. For exact pixel dimensions use Image Resizer; for cutting a region use Image Cropper."
      }
    ],
    "features": [
      "JPEG, PNG, WebP output",
      "Real byte comparison",
      "Original kept when not smaller"
    ]
  },
  "image-cropper": {
    "description": "Free image cropper with fixed ratio presets (square, 16:9, 4:3, 3:2, portrait, passport)—drag to position within the locked ratio, then download PNG in your browser.",
    "examples": [
      {
        "title": "Square social crop",
        "code": "Preset: 1:1 · drag the region · Crop → PNG download",
        "note": "The original file stays untouched; you download a new PNG of the selected region."
      },
      {
        "title": "Need resize instead of crop?",
        "code": "Use Image Resizer to scale the whole image, or Image Compressor when you mainly want fewer bytes",
        "note": "Presets help match common ratios; they are not a guarantee of a platform’s latest upload rules."
      }
    ],
    "features": [
      "Fixed ratio presets",
      "PNG export of the crop",
      "Runs locally in the browser"
    ]
  },
  "code-diff": {
    "description": "Free line-by-line diff checker for two code or text snippets—see additions, removals, and context, then copy the result as plain text.",
    "examples": [
      {
        "title": "Catch a one-line bug",
        "code": "Original: const answer = 41;\nModified: const answer = 42;\n→ one removed line, one added line",
        "note": "Comparison is line-oriented LCS, not a structured JSON/AST tree. Reordered object keys still look like line changes."
      },
      {
        "title": "Compare two API payloads cleanly",
        "code": "Beautify both JSON strings with JSON Formatter first, then paste into Original and Modified",
        "note": "Whitespace-only churn shrinks when both sides share the same indentation."
      }
    ],
    "features": [
      "Line-by-line LCS diff",
      "Copy with +/- prefixes",
      "Runs locally in the browser"
    ]
  },
  "unix-timestamp-converter": {
    "description": "Free Unix timestamp converter between epoch seconds and a local datetime field—two-way sync with a Local preview in your browser.",
    "examples": [
      {
        "title": "Epoch to local datetime",
        "code": "Unix: 1704067200 → local datetime-local + Local preview string",
        "note": "Uses whole seconds. There is no separate UTC datetime panel on this page."
      },
      {
        "title": "Now shortcut",
        "code": "Click Now → fills current epoch seconds and updates the local datetime",
        "note": "Example loads 1704067200 (2024-01-01 00:00:00 UTC as local wall time in the picker)."
      }
    ],
    "features": [
      "Epoch ↔ local datetime",
      "Now button",
      "Copy either side"
    ]
  },
  "cron-parser": {
    "description": "Free cron expression parser for standard 5-field schedules—plain-English meaning plus the next five local run times in your browser.",
    "examples": [
      {
        "title": "Weekday mornings",
        "code": "0 9 * * 1-5 → weekdays at 09:00 · next five local runs listed",
        "note": "When both day-of-month and day-of-week are constrained, classic cron ORs them—the description makes that explicit."
      },
      {
        "title": "Build instead of parse?",
        "code": "Use Cron Expression Generator for point-and-click schedules, then paste back here to verify next runs",
        "note": "Five fields only (minute through weekday). No seconds field and no sub-minute cadence."
      }
    ],
    "features": [
      "Plain-English explanation",
      "Next five local runs",
      "Standard 5-field cron"
    ]
  },
  "password-strength-checker": {
    "description": "Free password strength checker with local composition heuristics and a random-model bit upper bound—nothing leaves your browser.",
    "examples": [
      {
        "title": "Review a passphrase",
        "code": "Example: correct horse battery staple → score + composition notes + random-model bits",
        "note": "Random-model bits assume independent random characters. They are not measured entropy of your real password."
      },
      {
        "title": "Need a new password?",
        "code": "Use Password Generator, then paste the candidate here to review composition heuristics",
        "note": "This page does not predict crack time or query breach databases."
      }
    ],
    "features": [
      "Composition heuristics",
      "Random-model bit estimate",
      "Local-only checks"
    ]
  }
};

