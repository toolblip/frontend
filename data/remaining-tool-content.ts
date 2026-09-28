import type { ToolContent } from './tool-content';

// Source-reviewed copy for the original 99-route cohort, 2026-09-26.
// Content review does not grant indexing eligibility or public functional approval.
export const remainingToolContent: Record<string, ToolContent> = {
  "json-to-markdown-table": {
    "description": "Turn a JSON object or array of objects into an escaped Markdown table with columns from every row. Nested values are serialized. This doesn't render a spreadsheet or preserve JSON types when someone later parses the table.",
    "examples": [
      {
        "title": "Worked example",
        "code": "[{\"name\":\"Ada\",\"ok\":false},{\"name\":\"Lin\",\"count\":0}] keeps name, ok and count columns, including false and 0.",
        "note": "Nested values are serialized. This doesn't render a spreadsheet or preserve JSON types when someone later parses the table."
      }
    ],
    "features": [
      "Turn a JSON object or array of objects into an escaped Markdown table with columns from every row."
    ]
  },
  "image-aspect-ratio-calculator": {
    "description": "Reduce image width and height to an aspect ratio, compare common presets or read dimensions from a local image. Changing a dimension here doesn't resize or crop an image. Both dimensions must be positive.",
    "examples": [
      {
        "title": "Worked example",
        "code": "1200 by 800 pixels gives 3:2.",
        "note": "Changing a dimension here doesn't resize or crop an image. Both dimensions must be positive."
      }
    ],
    "features": [
      "Reduce image width and height to an aspect ratio, compare common presets or read dimensions from a local image."
    ]
  },
  "image-trimmer": {
    "description": "Remove a uniform outer border using the top-left pixel as the background reference and a color-distance tolerance. This detects edge background, not an object or face. Detail near the background color can be removed.",
    "examples": [
      {
        "title": "Worked example",
        "code": "An 8 by 6 image with a centered 4 by 2 red rectangle on white trims to 4 by 2.",
        "note": "This detects edge background, not an object or face. Detail near the background color can be removed."
      }
    ],
    "features": [
      "Remove a uniform outer border using the top-left pixel as the background reference and a color-distance tolerance."
    ]
  },
  "erase-color": {
    "description": "Pick a color in an uploaded image and make matching pixels transparent, then download PNG. Tolerance controls RGB color distance. Matching pixels anywhere in the image are affected; this isn't semantic background removal.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Pick the white border in a red-on-white image to retain the red pixels on transparency.",
        "note": "Tolerance controls RGB color distance. Matching pixels anywhere in the image are affected; this isn't semantic background removal."
      }
    ],
    "features": [
      "Pick a color in an uploaded image and make matching pixels transparent, then download PNG."
    ]
  },
  "square-crop": {
    "description": "Move a square crop over an image and export it at a selected preset or custom pixel size. Enlarging a small source doesn't add detail. Custom output is bounded to 50–4000 pixels per side.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Crop an 8 by 6 image and export a 1080 by 1080 PNG.",
        "note": "Enlarging a small source doesn't add detail. Custom output is bounded to 50–4000 pixels per side."
      }
    ],
    "features": [
      "Move a square crop over an image and export it at a selected preset or custom pixel size."
    ]
  },
  "htaccess-redirect-generator": {
    "description": "Draft Apache redirects for exact paths, HTTPS and www handling, with a downloadable .htaccess file. Review the result against existing server rules before use. Sources match paths, not query strings; Apache modules and hosting configuration matter.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A 301 rule from /old-page.html to /new-page escapes the dot and anchors the source path.",
        "note": "Review the result against existing server rules before use. Sources match paths, not query strings; Apache modules and hosting configuration matter."
      }
    ],
    "features": [
      "Draft Apache redirects for exact paths, HTTPS and www handling, with a downloadable .htaccess file."
    ]
  },
  "percentage-calculator": {
    "description": "Calculate part-to-whole percentages, percentage change, discounts, tips and markup in separate modes. Change uses the old value as denominator. A zero denominator has no defined percentage; markup isn't profit margin.",
    "examples": [
      {
        "title": "Worked example",
        "code": "15 out of 80 is 18.75%; a 30% markup on 80 gives 104.",
        "note": "Change uses the old value as denominator. A zero denominator has no defined percentage; markup isn't profit margin."
      }
    ],
    "features": [
      "Calculate part-to-whole percentages, percentage change, discounts, tips and markup in separate modes."
    ]
  },
  "gradient-generator": {
    "description": "Build a linear or radial CSS gradient from ordered color stops and an angle. Overlaps css-gradient-generator, whose separate implementation also supports conic gradients. Keep held until a deliberate consolidation decision.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Two stops at 0% and 100% with a 90-degree angle produce a horizontal linear gradient.",
        "note": "Overlaps css-gradient-generator, whose separate implementation also supports conic gradients. Keep held until a deliberate consolidation decision."
      }
    ],
    "features": [
      "Build a linear or radial CSS gradient from ordered color stops and an angle."
    ]
  },
  "slug-permalink-checker": {
    "description": "Inspect the last segment of a pasted path for case, separators and other local formatting rules. The score is a local heuristic, not a Google ranking metric. This doesn't check availability, redirects, indexability or whether a page exists.",
    "examples": [
      {
        "title": "Worked example",
        "code": "/blog/Bad_Slug flags uppercase letters and underscores.",
        "note": "The score is a local heuristic, not a Google ranking metric. This doesn't check availability, redirects, indexability or whether a page exists."
      }
    ],
    "features": [
      "Inspect the last segment of a pasted path for case, separators and other local formatting rules."
    ]
  },
  "slideshow-generator": {
    "description": "Arrange text slides with background colors and export a standalone HTML presentation with navigation. This produces HTML, not PowerPoint, video or a hosted presentation. Text is escaped for display.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Create Welcome and Next steps slides, then open the HTML download and move between them.",
        "note": "This produces HTML, not PowerPoint, video or a hosted presentation. Text is escaped for display."
      }
    ],
    "features": [
      "Arrange text slides with background colors and export a standalone HTML presentation with navigation."
    ]
  },
  "quote-of-the-day": {
    "description": "Show a date-selected quotation from a bundled collection, shuffle it or copy the current text. The collection isn't a verified quotation archive. Attributions and translations need checking before publication.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Shuffle selects a different entry; Back to Today restores the date-selected entry.",
        "note": "The collection isn't a verified quotation archive. Attributions and translations need checking before publication."
      }
    ],
    "features": [
      "Show a date-selected quotation from a bundled collection, shuffle it or copy the current text."
    ]
  },
  "morse-code-translator": {
    "description": "Convert supported Latin letters, digits and punctuation to dot-dash Morse text and decode it back. This is text conversion; it doesn't play audio. Unsupported characters and unknown code groups need explicit handling.",
    "examples": [
      {
        "title": "Worked example",
        "code": "SOS HELP becomes ... --- ... / .... . .-.. .--.",
        "note": "This is text conversion; it doesn't play audio. Unsupported characters and unknown code groups need explicit handling."
      }
    ],
    "features": [
      "Convert supported Latin letters, digits and punctuation to dot-dash Morse text and decode it back."
    ]
  },
  "twitter-card-preview": {
    "description": "Draft Twitter card metadata and preview the manually entered title, description and image. The preview doesn't fetch live Twitter data or guarantee how a platform will display a shared URL.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter a title and URL, then inspect the generated twitter:card metadata.",
        "note": "The preview doesn't fetch live Twitter data or guarantee how a platform will display a shared URL."
      }
    ],
    "features": [
      "Draft Twitter card metadata and preview the manually entered title, description and image."
    ]
  },
  "shell-command-reference": {
    "description": "Search a bundled shell-command reference and copy command examples. Commands aren't executed or tested against your machine. Review paths and destructive flags before using an example.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Search for grep to find text-search examples.",
        "note": "Commands aren't executed or tested against your machine. Review paths and destructive flags before using an example."
      }
    ],
    "features": [
      "Search a bundled shell-command reference and copy command examples."
    ]
  },
  "physics-constants-reference": {
    "description": "Search a local table of physical constants and their units. Displayed precision varies by constant. This is a reference table, not a unit-aware scientific calculation engine.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Look up the speed of light: 299792458 m/s.",
        "note": "Displayed precision varies by constant. This is a reference table, not a unit-aware scientific calculation engine."
      }
    ],
    "features": [
      "Search a local table of physical constants and their units."
    ]
  },
  "slug-generator": {
    "description": "Create an ASCII lowercase slug by replacing punctuation and spaces with hyphens. Accented characters aren't transliterated. The separate url-slug-generator has more controls; this overlapping route stays held.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Hello, World! becomes hello-world; Café becomes caf.",
        "note": "Accented characters aren't transliterated. The separate url-slug-generator has more controls; this overlapping route stays held."
      }
    ],
    "features": [
      "Create an ASCII lowercase slug by replacing punctuation and spaces with hyphens."
    ]
  },
  "graphql-playground": {
    "description": "Send a GraphQL query and JSON variables directly from the browser and inspect the actual response. The endpoint must permit browser CORS requests. No credentials are sent; requests have a time and response-size bound.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Query country code BD on the example endpoint to receive Bangladesh and Dhaka.",
        "note": "The endpoint must permit browser CORS requests. No credentials are sent; requests have a time and response-size bound."
      }
    ],
    "features": [
      "Send a GraphQL query and JSON variables directly from the browser and inspect the actual response."
    ]
  },
  "websocket-tester": {
    "description": "Connect to a WebSocket endpoint, send text and inspect sent, received and connection events. Server availability and browser policy affect connections. Binary messages are labelled, not decoded; logs and message length are bounded.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Send a short marker to the example WSS echo endpoint and compare the returned text.",
        "note": "Server availability and browser policy affect connections. Binary messages are labelled, not decoded; logs and message length are bounded."
      }
    ],
    "features": [
      "Connect to a WebSocket endpoint, send text and inspect sent, received and connection events."
    ]
  },
  "regex-pattern-generator": {
    "description": "Search a predefined JavaScript regular-expression library and try the selected pattern against text. This searches templates, not arbitrary natural-language generation. Format matches don't prove that an address, date or account exists.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Choose the IPv4 preset: 192.168.1.1 matches and 999.1.1.1 doesn't.",
        "note": "This searches templates, not arbitrary natural-language generation. Format matches don't prove that an address, date or account exists."
      }
    ],
    "features": [
      "Search a predefined JavaScript regular-expression library and try the selected pattern against text."
    ]
  },
  "currency-converter": {
    "description": "Explore currency arithmetic using fixed demonstration rates stored in the page. These aren't live exchange rates and aren't suitable for pricing or payment decisions. Displayed reciprocal rates must agree with the main conversion.",
    "examples": [
      {
        "title": "Worked example",
        "code": "With the sample USD/EUR rate, 100 USD produces 92 EUR.",
        "note": "These aren't live exchange rates and aren't suitable for pricing or payment decisions. Displayed reciprocal rates must agree with the main conversion."
      }
    ],
    "features": [
      "Explore currency arithmetic using fixed demonstration rates stored in the page."
    ]
  },
  "mime-types-reference": {
    "description": "Filter a bundled extension-to-MIME reference by search text and category. Extensions don't verify a file's actual bytes. Server MIME configuration and registered media types may differ.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The .json row maps to application/json.",
        "note": "Extensions don't verify a file's actual bytes. Server MIME configuration and registered media types may differ."
      }
    ],
    "features": [
      "Filter a bundled extension-to-MIME reference by search text and category."
    ]
  },
  "json-editor": {
    "description": "Edit JSON source with a neighboring expandable tree and in-place Format and Minify actions. This edits source text, not individual tree values. Parsing follows JavaScript JSON behavior and numeric precision.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter {\"active\":true,\"items\":[1,null]} and expand items without changing its values.",
        "note": "This edits source text, not individual tree values. Parsing follows JavaScript JSON behavior and numeric precision."
      }
    ],
    "features": [
      "Edit JSON source with a neighboring expandable tree and in-place Format and Minify actions."
    ]
  },
  "json-tree-view": {
    "description": "Explore nested JSON, search keys and values, and copy paths to individual nodes. Paths are navigation aids, not an arbitrary JSONPath query language. Very deep input can be expensive to render.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The second item under items has path $.items[1].",
        "note": "Paths are navigation aids, not an arbitrary JSONPath query language. Very deep input can be expensive to render."
      }
    ],
    "features": [
      "Explore nested JSON, search keys and values, and copy paths to individual nodes."
    ]
  },
  "html-entity-encoder": {
    "description": "Encode five HTML-sensitive characters or decode entities with the browser's textarea parser. Decoding follows HTML text parsing, including some semicolonless forms. It isn't sanitization for inserting untrusted HTML.",
    "examples": [
      {
        "title": "Worked example",
        "code": "<b>A & B</b> encodes angle brackets and the ampersand; &#x1F600; decodes to 😀.",
        "note": "Decoding follows HTML text parsing, including some semicolonless forms. It isn't sanitization for inserting untrusted HTML."
      }
    ],
    "features": [
      "Encode five HTML-sensitive characters or decode entities with the browser's textarea parser."
    ]
  },
  "md5-hash-generator": {
    "description": "Calculate an MD5 checksum of UTF-8 text, with other digest algorithms available in the selector. This input accepts text, not files. MD5 uses a local implementation and isn't suitable for passwords or collision-resistant security checks.",
    "examples": [
      {
        "title": "Worked example",
        "code": "MD5 of abc is 900150983cd24fb0d6963f7d28e17f72.",
        "note": "This input accepts text, not files. MD5 uses a local implementation and isn't suitable for passwords or collision-resistant security checks."
      }
    ],
    "features": [
      "Calculate an MD5 checksum of UTF-8 text, with other digest algorithms available in the selector."
    ]
  },
  "hash-diff-checker": {
    "description": "Compare two text digests or two pasted hexadecimal hashes and locate differences. Pasted hashes aren't identified or authenticated. Optional case-insensitive comparison only affects hexadecimal spelling.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Hash abc on both sides to get equal digests; change one side to abcd to get a mismatch.",
        "note": "Pasted hashes aren't identified or authenticated. Optional case-insensitive comparison only affects hexadecimal spelling."
      }
    ],
    "features": [
      "Compare two text digests or two pasted hexadecimal hashes and locate differences."
    ]
  },
  "lorem-ipsum-detector": {
    "description": "Look for adjacent-word pairs from the canonical Lorem ipsum passage in pasted text. This detects a fixed set of filler phrases, not all placeholder copy or plagiarism.",
    "examples": [
      {
        "title": "Worked example",
        "code": "lorem ipsum triggers a match; ordinary prose without those pairs doesn't.",
        "note": "This detects a fixed set of filler phrases, not all placeholder copy or plagiarism."
      }
    ],
    "features": [
      "Look for adjacent-word pairs from the canonical Lorem ipsum passage in pasted text."
    ]
  },
  "word-cloud-generator": {
    "description": "Build a visual word-frequency cloud from text and export the rendered image. Tokenization and stopword settings affect counts. The layout is a visualization, not semantic topic analysis.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Repeating apple more often than pear gives apple a larger representation.",
        "note": "Tokenization and stopword settings affect counts. The layout is a visualization, not semantic topic analysis."
      }
    ],
    "features": [
      "Build a visual word-frequency cloud from text and export the rendered image."
    ]
  },
  "text-highlighter": {
    "description": "Highlight literal keywords in pasted text and copy escaped HTML markup. Matches can occur inside longer words. This isn't a regex editor; special characters should be treated literally.",
    "examples": [
      {
        "title": "Worked example",
        "code": "With cat as keyword, cat cat receives two highlights.",
        "note": "Matches can occur inside longer words. This isn't a regex editor; special characters should be treated literally."
      }
    ],
    "features": [
      "Highlight literal keywords in pasted text and copy escaped HTML markup."
    ]
  },
  "word-combinations-generator": {
    "description": "Generate unordered or ordered pairs and triples from newline- or comma-separated items. Output is capped at 2000 combinations. Repeated input items can still produce repeated text.",
    "examples": [
      {
        "title": "Worked example",
        "code": "red, blue, green gives three unordered pairs or six ordered pairs.",
        "note": "Output is capped at 2000 combinations. Repeated input items can still produce repeated text."
      }
    ],
    "features": [
      "Generate unordered or ordered pairs and triples from newline- or comma-separated items."
    ]
  },
  "sentiment-analyzer": {
    "description": "Count weighted English sentiment words with a short negation window and show the contributing matches. This is a fixed lexicon heuristic. Sarcasm, context and languages outside its English word list can be misread.",
    "examples": [
      {
        "title": "Worked example",
        "code": "good scores positive; not good reverses that word's weight.",
        "note": "This is a fixed lexicon heuristic. Sarcasm, context and languages outside its English word list can be misread."
      }
    ],
    "features": [
      "Count weighted English sentiment words with a short negation window and show the contributing matches."
    ]
  },
  "hex-named-color-converter": {
    "description": "Convert named colors to hexadecimal and find a nearby named color for a hexadecimal input. An arbitrary hex color may only have a nearest name, not an exact named-color equivalent.",
    "examples": [
      {
        "title": "Worked example",
        "code": "red maps to #ff0000; #0000ff maps to blue.",
        "note": "An arbitrary hex color may only have a nearest name, not an exact named-color equivalent."
      }
    ],
    "features": [
      "Convert named colors to hexadecimal and find a nearby named color for a hexadecimal input."
    ]
  },
  "grammar-checker-v2": {
    "description": "Review grammar-service findings grouped by category with highlighted context. Text is sent to the grammar service. Suggestions need human review; stale responses and offsets after edits must be handled before promotion.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Check This are a test. to inspect the service's agreement suggestion.",
        "note": "Text is sent to the grammar service. Suggestions need human review; stale responses and offsets after edits must be handled before promotion."
      }
    ],
    "features": [
      "Review grammar-service findings grouped by category with highlighted context."
    ]
  },
  "json-validator": {
    "description": "Check JSON syntax without reformatting the original source and show parsing errors. This doesn't accept or validate a JSON Schema. Error locations depend on the browser parser.",
    "examples": [
      {
        "title": "Worked example",
        "code": "{\"ok\":true} is valid; {\"ok\":} is rejected.",
        "note": "This doesn't accept or validate a JSON Schema. Error locations depend on the browser parser."
      }
    ],
    "features": [
      "Check JSON syntax without reformatting the original source and show parsing errors."
    ]
  },
  "word-alphabetizer": {
    "description": "Extract words from prose, remove repeated tokens and sort the first retained spellings. Tokenization is ASCII-oriented and keeps internal apostrophes and hyphens. This differs from sorting whole lines.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Banana apple banana. Cherry! becomes apple, Banana, Cherry.",
        "note": "Tokenization is ASCII-oriented and keeps internal apostrophes and hyphens. This differs from sorting whole lines."
      }
    ],
    "features": [
      "Extract words from prose, remove repeated tokens and sort the first retained spellings."
    ]
  },
  "metric-imperial-converter": {
    "description": "Convert length, mass and temperature between selected metric and imperial units. Results use floating-point arithmetic and rounded display values. Swapping must use unformatted numbers rather than grouped display text.",
    "examples": [
      {
        "title": "Worked example",
        "code": "1 kilometre is 1000 metres; 25°C is 77°F.",
        "note": "Results use floating-point arithmetic and rounded display values. Swapping must use unformatted numbers rather than grouped display text."
      }
    ],
    "features": [
      "Convert length, mass and temperature between selected metric and imperial units."
    ]
  },
  "jwt-token-tester": {
    "description": "Verify supported HMAC JWT signatures with a supplied secret and inspect decoded claims. This doesn't verify asymmetric JWT algorithms or establish authorization. Use only test secrets you intend to enter in the browser.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A token signed with test-secret verifies with that secret and fails with a different one.",
        "note": "This doesn't verify asymmetric JWT algorithms or establish authorization. Use only test secrets you intend to enter in the browser."
      }
    ],
    "features": [
      "Verify supported HMAC JWT signatures with a supplied secret and inspect decoded claims."
    ]
  },
  "grammar-score-checker": {
    "description": "Check local English writing heuristics such as repeated words, spacing and possible passive constructions. The score is issue density, not a validated grammar or readability assessment. No grammar service is called.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The the cat. reports a repeated word; The cat sat. removes that finding.",
        "note": "The score is issue density, not a validated grammar or readability assessment. No grammar service is called."
      }
    ],
    "features": [
      "Check local English writing heuristics such as repeated words, spacing and possible passive constructions."
    ]
  },
  "grammar-checker-pro": {
    "description": "Filter grammar-service findings by category and view a separate local tone estimate. The tone label is heuristic. Text goes to a service; a selected suggestion must apply that exact replacement and invalidate stale findings.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Check a sentence, filter spelling findings and choose a replacement.",
        "note": "The tone label is heuristic. Text goes to a service; a selected suggestion must apply that exact replacement and invalidate stale findings."
      }
    ],
    "features": [
      "Filter grammar-service findings by category and view a separate local tone estimate."
    ]
  },
  "reading-level-estimator": {
    "description": "Estimate Flesch-Kincaid grade and reading ease from sentence length and approximate syllables. English syllable counting is heuristic. This overlaps readability-score and stays held pending an explicit consolidation decision.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The cat sat. reaches the clamped beginner end of the scale.",
        "note": "English syllable counting is heuristic. This overlaps readability-score and stays held pending an explicit consolidation decision."
      }
    ],
    "features": [
      "Estimate Flesch-Kincaid grade and reading ease from sentence length and approximate syllables."
    ]
  },
  "color-format-converter": {
    "description": "Convert a parsed color into HEX, RGB, HSL, HSV and a simple CMYK representation. CMYK is an unprofiled calculation, not a print-production color conversion. Alpha isn't represented by every format.",
    "examples": [
      {
        "title": "Worked example",
        "code": "#ff0000 gives rgb(255, 0, 0), hsl(0, 100%, 50%) and cmyk(0%, 100%, 100%, 0%).",
        "note": "CMYK is an unprofiled calculation, not a print-production color conversion. Alpha isn't represented by every format."
      }
    ],
    "features": [
      "Convert a parsed color into HEX, RGB, HSL, HSV and a simple CMYK representation."
    ]
  },
  "curl-gen": {
    "description": "Build a curl command from request method, URL, headers and body fields. The command isn't executed. Review quoting and sensitive headers before copying it to a shell.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A GET request to https://example.com produces a command for that URL.",
        "note": "The command isn't executed. Review quoting and sensitive headers before copying it to a shell."
      }
    ],
    "features": [
      "Build a curl command from request method, URL, headers and body fields."
    ]
  },
  "temp-converter": {
    "description": "Show Celsius, Fahrenheit and Kelvin values together with common temperature presets. Uses floating-point arithmetic and four decimal places. This is a simultaneous three-scale view, not a general unit converter.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Freezing is 32°F, 0°C and 273.15K.",
        "note": "Uses floating-point arithmetic and four decimal places. This is a simultaneous three-scale view, not a general unit converter."
      }
    ],
    "features": [
      "Show Celsius, Fahrenheit and Kelvin values together with common temperature presets."
    ]
  },
  "word-freq": {
    "description": "Count the top single words and two- and three-word phrases after filtering English stopwords. Phrase adjacency is calculated after filtering, so phrases can bridge removed words. Only the top 20 per group are shown.",
    "examples": [
      {
        "title": "Worked example",
        "code": "cat cat dog gives cat a count of 2 and 66.7% of the retained words.",
        "note": "Phrase adjacency is calculated after filtering, so phrases can bridge removed words. Only the top 20 per group are shown."
      }
    ],
    "features": [
      "Count the top single words and two- and three-word phrases after filtering English stopwords."
    ]
  },
  "regex-explainer": {
    "description": "Break a JavaScript regex into described tokens and test it against sample text. Token descriptions are a learning aid, not a complete parser or proof that a pattern is safe for all inputs.",
    "examples": [
      {
        "title": "Worked example",
        "code": "For ^[A-Z]+$, ABC matches while abc doesn't.",
        "note": "Token descriptions are a learning aid, not a complete parser or proof that a pattern is safe for all inputs."
      }
    ],
    "features": [
      "Break a JavaScript regex into described tokens and test it against sample text."
    ]
  },
  "passive-voice-detector": {
    "description": "Flag phrases that match a small set of English passive-voice patterns. The tool doesn't rewrite sentences. Pattern overlap and irregular verbs can cause false positives or missed phrases.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The report was written. flags was written; I wrote the report. is a negative control.",
        "note": "The tool doesn't rewrite sentences. Pattern overlap and irregular verbs can cause false positives or missed phrases."
      }
    ],
    "features": [
      "Flag phrases that match a small set of English passive-voice patterns."
    ]
  },
  "word-scramble-generator": {
    "description": "Shuffle letters inside ASCII words while retaining surrounding punctuation and lines. A random shuffle can repeat the original order. Non-ASCII letters aren't included in the word-matching pattern.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Scrambling banana! keeps three a letters, two n letters, one b and the exclamation mark.",
        "note": "A random shuffle can repeat the original order. Non-ASCII letters aren't included in the word-matching pattern."
      }
    ],
    "features": [
      "Shuffle letters inside ASCII words while retaining surrounding punctuation and lines."
    ]
  },
  "uuid-normalizer": {
    "description": "Normalize a UUID's textual case, hyphens and supported wrappers while preserving its value. Formatting doesn't convert between UUID versions or generate a new identifier.",
    "examples": [
      {
        "title": "Worked example",
        "code": "{550E8400-E29B-41D4-A716-446655440000} becomes 550e8400-e29b-41d4-a716-446655440000.",
        "note": "Formatting doesn't convert between UUID versions or generate a new identifier."
      }
    ],
    "features": [
      "Normalize a UUID's textual case, hyphens and supported wrappers while preserving its value."
    ]
  },
  "pressure-converter": {
    "description": "Convert pressure between Pa, bar, PSI, atmospheres and mmHg. Conversion constants and displayed digits are finite precision. Swapping must preserve the numeric result without thousands separators.",
    "examples": [
      {
        "title": "Worked example",
        "code": "1 atmosphere is 101325 Pa.",
        "note": "Conversion constants and displayed digits are finite precision. Swapping must preserve the numeric result without thousands separators."
      }
    ],
    "features": [
      "Convert pressure between Pa, bar, PSI, atmospheres and mmHg."
    ]
  },
  "energy-converter": {
    "description": "Show equivalent energy in joules, calories, watt-hours, BTU and foot-pounds. Some constants are rounded. Large floating-point values need finite-result validation.",
    "examples": [
      {
        "title": "Worked example",
        "code": "1 kWh is 3600000 J; 1 thermochemical calorie is 4.184 J.",
        "note": "Some constants are rounded. Large floating-point values need finite-result validation."
      }
    ],
    "features": [
      "Show equivalent energy in joules, calories, watt-hours, BTU and foot-pounds."
    ]
  },
  "business-plan-generator": {
    "description": "Fill a structured business-plan template and copy the draft into an editor. This doesn't research the market, validate forecasts or replace financial due diligence.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter a business idea and target market, generate the outline, then use Copy All to paste the draft into an editor.",
        "note": "This doesn't research the market, validate forecasts or replace financial due diligence."
      }
    ],
    "features": [
      "Fill a structured business-plan template and copy the draft into an editor."
    ]
  },
  "font-to-png": {
    "description": "Render entered text with browser fonts and export it as PNG. Only fonts available to the browser can render. This doesn't convert a font file into an installable font.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Render Sample in a selected font, then inspect the PNG dimensions and pixels.",
        "note": "Only fonts available to the browser can render. This doesn't convert a font file into an installable font."
      }
    ],
    "features": [
      "Render entered text with browser fonts and export it as PNG."
    ]
  },
  "press-release-generator": {
    "description": "Fill press-release fields and download a text or PDF draft. This doesn't publish or distribute a release. Review quotations and factual claims before sending it.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter a headline, date, location and contact, then verify them in the exported draft.",
        "note": "This doesn't publish or distribute a release. Review quotations and factual claims before sending it."
      }
    ],
    "features": [
      "Fill press-release fields and download a text or PDF draft."
    ]
  },
  "unicode-escape-encoder": {
    "description": "Encode text as four-digit UTF-16 escape sequences or decode those sequences. Astral characters use surrogate pairs. This isn't UTF-8 byte encoding; unmatched or unsupported escape forms remain literal.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A😀 becomes \\u0041\\ud83d\\ude00 and decodes back to A😀.",
        "note": "Astral characters use surrogate pairs. This isn't UTF-8 byte encoding; unmatched or unsupported escape forms remain literal."
      }
    ],
    "features": [
      "Encode text as four-digit UTF-16 escape sequences or decode those sequences."
    ]
  },
  "remove-extra-spaces": {
    "description": "Collapse repeated spaces and tabs, trim line ends and reduce excess blank lines. This changes whitespace intentionally and can alter indentation-sensitive code.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Two spaces or tabs between A and B become one space; three newlines become two.",
        "note": "This changes whitespace intentionally and can alter indentation-sensitive code."
      }
    ],
    "features": [
      "Collapse repeated spaces and tabs, trim line ends and reduce excess blank lines."
    ]
  },
  "random-choice-wheel": {
    "description": "Select from entered choices using a visual spinning wheel. It's a convenience picker, not an audited lottery. Repeated entries affect their share of the wheel.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter three choices and verify the selected label belongs to the submitted list.",
        "note": "It's a convenience picker, not an audited lottery. Repeated entries affect their share of the wheel."
      }
    ],
    "features": [
      "Select from entered choices using a visual spinning wheel."
    ]
  },
  "image-shadow-generator": {
    "description": "Add a shadow around an uploaded raster image and export the result as PNG. This exports pixels, not CSS box-shadow code. Blur and padding affect output dimensions.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Upload a small image, change shadow offset and inspect the enlarged PNG canvas.",
        "note": "This exports pixels, not CSS box-shadow code. Blur and padding affect output dimensions."
      }
    ],
    "features": [
      "Add a shadow around an uploaded raster image and export the result as PNG."
    ]
  },
  "hmac-generator": {
    "description": "Calculate a keyed UTF-8 message digest using SHA-1, SHA-256, SHA-384 or SHA-512. MD5 isn't offered. The key must be nonempty; this tool doesn't encrypt the message.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Compare HMAC-SHA256 for message abc and a test key against an independent implementation.",
        "note": "MD5 isn't offered. The key must be nonempty; this tool doesn't encrypt the message."
      }
    ],
    "features": [
      "Calculate a keyed UTF-8 message digest using SHA-1, SHA-256, SHA-384 or SHA-512."
    ]
  },
  "secure-random-generator": {
    "description": "Generate random data using the browser's cryptographic random source. Random values aren't guaranteed unique. Encoding changes representation, not entropy.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Request random bytes and check the selected output format has the expected length.",
        "note": "Random values aren't guaranteed unique. Encoding changes representation, not entropy."
      }
    ],
    "features": [
      "Generate random data using the browser's cryptographic random source."
    ]
  },
  "css-naming-convention": {
    "description": "Convert each entered name to several naming styles, including an approximate block and element BEM form. This doesn't build BEM modifiers or refactor a stylesheet.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Enter primary_button to see primary__button in the BEM row, alongside kebab, camel, Pascal, snake and constant forms.",
        "note": "The BEM row treats the first word as a block and the rest as an element; it doesn't build modifiers."
      }
    ],
    "features": [
      "Convert entered names to six naming styles; BEM output is an approximate block and element form."
    ]
  },
  "random-pin-generator": {
    "description": "Generate numeric PIN strings with selectable length and count. A PIN's length limits its entropy. Random output isn't a uniqueness or authentication guarantee.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Generate ten six-digit values and retain leading zeros.",
        "note": "A PIN's length limits its entropy. Random output isn't a uniqueness or authentication guarantee."
      }
    ],
    "features": [
      "Generate numeric PIN strings with selectable length and count."
    ]
  },
  "uuid-comparator": {
    "description": "Compare two UUIDs and inspect differing characters, decoded fields and embedded timestamp information where supported. Only timestamp-bearing versions contain recoverable time. This diagnostic differs from the smaller uuid-compare view.",
    "examples": [
      {
        "title": "Worked example",
        "code": "The same UUID with different case should compare as the same value.",
        "note": "Only timestamp-bearing versions contain recoverable time. This diagnostic differs from the smaller uuid-compare view."
      }
    ],
    "features": [
      "Compare two UUIDs and inspect differing characters, decoded fields and embedded timestamp information where supported."
    ]
  },
  "token-builder": {
    "description": "Build a signed HS256, HS384 or HS512 JWT from JSON header, payload and a test secret. Asymmetric signing and critical extensions aren't supported. A valid signature doesn't make claims trustworthy for your application.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Create an HS256 token and independently verify its HMAC signature.",
        "note": "Asymmetric signing and critical extensions aren't supported. A valid signature doesn't make claims trustworthy for your application."
      }
    ],
    "features": [
      "Build a signed HS256, HS384 or HS512 JWT from JSON header, payload and a test secret."
    ]
  },
  "image-scale-calculator": {
    "description": "Calculate image dimensions for a target scale or size while retaining aspect ratio. This calculates dimensions; it doesn't resample image pixels or add detail.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A 1200 by 800 source at half scale becomes 600 by 400.",
        "note": "This calculates dimensions; it doesn't resample image pixels or add detail."
      }
    ],
    "features": [
      "Calculate image dimensions for a target scale or size while retaining aspect ratio."
    ]
  },
  "http-headers-inspector": {
    "description": "Request an HTTP(S) URL from the browser and inspect the response headers it exposes. CORS can block requests or hide headers. This doesn't reveal every server header or bypass browser restrictions.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Inspect a CORS-enabled JSON endpoint and check its content-type.",
        "note": "CORS can block requests or hide headers. This doesn't reveal every server header or bypass browser restrictions."
      }
    ],
    "features": [
      "Request an HTTP(S) URL from the browser and inspect the response headers it exposes."
    ]
  },
  "headline-analyzer": {
    "description": "Count headline words and local framing signals and show a heuristic summary. The score doesn't measure click-through rate or predict ranking. Word lists and syllable estimates are limited.",
    "examples": [
      {
        "title": "Worked example",
        "code": "How to train cats has four words and how-to framing, with no number.",
        "note": "The score doesn't measure click-through rate or predict ranking. Word lists and syllable estimates are limited."
      }
    ],
    "features": [
      "Count headline words and local framing signals and show a heuristic summary."
    ]
  },
  "text-structure-validator": {
    "description": "Inspect Markdown-style headings, paragraph lengths and list usage. This recognizes simple line patterns rather than a full Markdown AST. Code fences and unusual Markdown can affect the result.",
    "examples": [
      {
        "title": "Worked example",
        "code": "An H1 followed by an H3 produces one skipped-level warning.",
        "note": "This recognizes simple line patterns rather than a full Markdown AST. Code fences and unusual Markdown can affect the result."
      }
    ],
    "features": [
      "Inspect Markdown-style headings, paragraph lengths and list usage."
    ]
  },
  "uuid-compare": {
    "description": "Check whether two UUID spellings represent the same value and show a compact difference summary. This is a focused equality view; use uuid-comparator for deeper field and timestamp diagnostics.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Compare lowercase and uppercase versions of 550e8400-e29b-41d4-a716-446655440000.",
        "note": "This is a focused equality view; use uuid-comparator for deeper field and timestamp diagnostics."
      }
    ],
    "features": [
      "Check whether two UUID spellings represent the same value and show a compact difference summary."
    ]
  },
  "frequency-converter": {
    "description": "Convert frequency between Hz, scaled Hz, RPM and radians per second. This assumes one cycle per revolution. Results use floating-point arithmetic and rounded display values.",
    "examples": [
      {
        "title": "Worked example",
        "code": "60 RPM is 1 Hz and about 6.283185 rad/s.",
        "note": "This assumes one cycle per revolution. Results use floating-point arithmetic and rounded display values."
      }
    ],
    "features": [
      "Convert frequency between Hz, scaled Hz, RPM and radians per second."
    ]
  },
  "force-converter": {
    "description": "Convert force between newtons, dyne, pound-force, kilogram-force and other listed units. Kilogram-force is force, not mass. Some constants are rounded and aren't an uncertainty model.",
    "examples": [
      {
        "title": "Worked example",
        "code": "1 kilogram-force is 9.80665 N.",
        "note": "Kilogram-force is force, not mass. Some constants are rounded and aren't an uncertainty model."
      }
    ],
    "features": [
      "Convert force between newtons, dyne, pound-force, kilogram-force and other listed units."
    ]
  },
  "random-color-generator": {
    "description": "Generate random colors and copy their represented values. Random colors aren't guaranteed accessible or visually coordinated. Check contrast separately.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Generate colors, then verify every displayed hex value parses to the same RGB components.",
        "note": "Random colors aren't guaranteed accessible or visually coordinated. Check contrast separately."
      }
    ],
    "features": [
      "Generate random colors and copy their represented values."
    ]
  },
  "time-duration-calculator": {
    "description": "Add a duration to a clock time or find the interval between two clock times, treating an earlier end as the next day. This doesn't account for timezones, dates or daylight-saving transitions.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Starting at 23:30:00 and adding 02:00:00 gives 1:30:00 with a +1 day rollover.",
        "note": "Clock inputs must be within one day. The Time Between mode assumes an earlier end is on the next day."
      }
    ],
    "features": [
      "Add a duration to a clock time or find a clock-time interval with next-day rollover."
    ]
  },
  "timestamp-diff-calculator": {
    "description": "Calculate the elapsed difference between two entered timestamps. Timezone interpretation depends on the input format. This computes elapsed time, not calendar-month counts.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A one-minute difference is 60 seconds and 60000 milliseconds.",
        "note": "Timezone interpretation depends on the input format. This computes elapsed time, not calendar-month counts."
      }
    ],
    "features": [
      "Calculate the elapsed difference between two entered timestamps."
    ]
  },
  "pixel-density-calculator": {
    "description": "Calculate horizontal, vertical and diagonal print pixel density from image and physical dimensions. Print-quality labels are rough guidance. Viewing distance, printer process and image content also matter.",
    "examples": [
      {
        "title": "Worked example",
        "code": "3000 by 2400 pixels printed at 10 by 8 inches gives 300 PPI on both axes.",
        "note": "Print-quality labels are rough guidance. Viewing distance, printer process and image content also matter."
      }
    ],
    "features": [
      "Calculate horizontal, vertical and diagonal print pixel density from image and physical dimensions."
    ]
  },
  "html-to-plain-text": {
    "description": "Extract readable text from pasted HTML with entity decoding and block separation. Scripts and styles shouldn't appear as prose. This isn't a full browser layout-to-text renderer.",
    "examples": [
      {
        "title": "Worked example",
        "code": "<p>A &amp; B</p><p>C</p> becomes A & B followed by C on a new line.",
        "note": "Scripts and styles shouldn't appear as prose. This isn't a full browser layout-to-text renderer."
      }
    ],
    "features": [
      "Extract readable text from pasted HTML with entity decoding and block separation."
    ]
  },
  "text-complexity-analyzer": {
    "description": "Show text length, approximate syllables, sentence lengths and vocabulary diversity. English-oriented tokenization and vowel-group syllables are approximate. These statistics don't establish comprehension.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Cat cat dog. has two unique words out of three, giving 66.7% diversity.",
        "note": "English-oriented tokenization and vowel-group syllables are approximate. These statistics don't establish comprehension."
      }
    ],
    "features": [
      "Show text length, approximate syllables, sentence lengths and vocabulary diversity."
    ]
  },
  "text-deduplicator": {
    "description": "Remove repeated lines, words or sentences while retaining the first occurrence. Modes use different matching rules. Word and sentence modes normalize case and punctuation; they aren't semantic duplicate detection.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A, B, A on separate lines becomes A followed by B.",
        "note": "Modes use different matching rules. Word and sentence modes normalize case and punctuation; they aren't semantic duplicate detection."
      }
    ],
    "features": [
      "Remove repeated lines, words or sentences while retaining the first occurrence."
    ]
  },
  "slug-health-checker": {
    "description": "Compare a pasted batch of final path segments for formatting issues and possible duplicate clusters. Different full URLs can legitimately share a segment. Clusters don't prove duplicate pages or canonical equivalence.",
    "examples": [
      {
        "title": "Worked example",
        "code": "/blog/widget and /shop/widget share the segment widget; widget-copy can form a nearby cluster.",
        "note": "Different full URLs can legitimately share a segment. Clusters don't prove duplicate pages or canonical equivalence."
      }
    ],
    "features": [
      "Compare a pasted batch of final path segments for formatting issues and possible duplicate clusters."
    ]
  },
  "text-sentence-shuffler": {
    "description": "Shuffle sentence order within each paragraph or across the whole input. Sentence splitting is punctuation-based and can misread abbreviations. Random order may match the original.",
    "examples": [
      {
        "title": "Worked example",
        "code": "One. Two. Three. keeps all three sentences and their separating spaces after a shuffle.",
        "note": "Sentence splitting is punctuation-based and can misread abbreviations. Random order may match the original."
      }
    ],
    "features": [
      "Shuffle sentence order within each paragraph or across the whole input."
    ]
  },
  "regex-pattern-builder": {
    "description": "Assemble a JavaScript pattern from selected building blocks and test sample text. This is a pattern builder, not arbitrary natural-language synthesis. Review the full pattern before production use.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Add a digit block with a chosen repetition count and check matching and nonmatching samples.",
        "note": "This is a pattern builder, not arbitrary natural-language synthesis. Review the full pattern before production use."
      }
    ],
    "features": [
      "Assemble a JavaScript pattern from selected building blocks and test sample text."
    ]
  },
  "css-animation-generator": {
    "description": "Configure a CSS animation and copy its keyframes and animation declaration. The preview is one element in this browser. Motion preferences and target-browser behavior need checking in the destination page.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Change duration and direction, then compare the generated CSS with the preview.",
        "note": "The preview is one element in this browser. Motion preferences and target-browser behavior need checking in the destination page."
      }
    ],
    "features": [
      "Configure a CSS animation and copy its keyframes and animation declaration."
    ]
  },
  "scientific-notation-converter": {
    "description": "Convert decimal numbers to scientific notation and expand supported exponent notation. JavaScript floating-point precision applies. Extremely small values can round or underflow in decimal display.",
    "examples": [
      {
        "title": "Worked example",
        "code": "0.00042 becomes 4.2 × 10^-4; 4.5e7 becomes 45000000.",
        "note": "JavaScript floating-point precision applies. Extremely small values can round or underflow in decimal display."
      }
    ],
    "features": [
      "Convert decimal numbers to scientific notation and expand supported exponent notation."
    ]
  },
  "css-cursor-generator": {
    "description": "Preview standard CSS cursors and copy the cursor declaration. The browser and operating system choose the actual pointer appearance. This doesn't create custom cursor files.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Choose pointer to get cursor: pointer;.",
        "note": "The browser and operating system choose the actual pointer appearance. This doesn't create custom cursor files."
      }
    ],
    "features": [
      "Preview standard CSS cursors and copy the cursor declaration."
    ]
  },
  "http-status-checker": {
    "description": "Send a browser request and report the actual HTTP status and exposed headers. CORS and redirects affect what the browser can observe. A blocked request isn't evidence that the remote site is down.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A successful JSON health endpoint returns HTTP 200 and application/json.",
        "note": "CORS and redirects affect what the browser can observe. A blocked request isn't evidence that the remote site is down."
      }
    ],
    "features": [
      "Send a browser request and report the actual HTTP status and exposed headers."
    ]
  },
  "random-choice-picker": {
    "description": "Choose entries from a pasted list with configurable selection behavior. This isn't a cryptographically audited draw. Duplicate input and replacement settings affect selection.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Pick from red, blue and green and check each returned value belongs to the list.",
        "note": "This isn't a cryptographically audited draw. Duplicate input and replacement settings affect selection."
      }
    ],
    "features": [
      "Choose entries from a pasted list with configurable selection behavior."
    ]
  },
  "list-difference-finder": {
    "description": "Compare newline-separated lists and show entries only in A, only in B and in both. Results are sets, so repeated identical items collapse. Optional case handling changes equality.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A/B compared with B/C yields A-only A, B-only C and intersection B.",
        "note": "Results are sets, so repeated identical items collapse. Optional case handling changes equality."
      }
    ],
    "features": [
      "Compare newline-separated lists and show entries only in A, only in B and in both."
    ]
  },
  "regex-escape": {
    "description": "Escape regex metacharacters so a literal string can be inserted into a pattern. This helper isn't the full ECMAScript RegExp.escape algorithm. Review delimiter and surrounding-pattern context.",
    "examples": [
      {
        "title": "Worked example",
        "code": "a+b?.[x] becomes a\\+b\\?\\.\\[x\\].",
        "note": "This helper isn't the full ECMAScript RegExp.escape algorithm. Review delimiter and surrounding-pattern context."
      }
    ],
    "features": [
      "Escape regex metacharacters so a literal string can be inserted into a pattern."
    ]
  },
  "what-if-scenario-calculator": {
    "description": "Evaluate an arithmetic formula with named scenario values. This is a bounded arithmetic evaluator, not JavaScript execution or a financial forecasting model.",
    "examples": [
      {
        "title": "Worked example",
        "code": "-2^2 evaluates to -4 and 2^3^2 to 512; division by zero is rejected.",
        "note": "This is a bounded arithmetic evaluator, not JavaScript execution or a financial forecasting model."
      }
    ],
    "features": [
      "Evaluate an arithmetic formula with named scenario values."
    ]
  },
  "word-finder": {
    "description": "Search the bundled word list using available letters, length bounds and ? wildcard patterns. Results are capped at 500. Dictionary inclusion doesn't imply suitability in every word game or language.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Letters cat with pattern c?t return cat when present in the list.",
        "note": "Results are capped at 500. Dictionary inclusion doesn't imply suitability in every word game or language."
      }
    ],
    "features": [
      "Search the bundled word list using available letters, length bounds and ? wildcard patterns."
    ]
  },
  "shell-command-generator": {
    "description": "Fill selected Bash command templates and copy the resulting command. This isn't natural-language generation for Bash, Zsh and Fish. Commands aren't executed; review quoting and paths before use.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Choose the git-status template to produce git status.",
        "note": "This isn't natural-language generation for Bash, Zsh and Fish. Commands aren't executed; review quoting and paths before use."
      }
    ],
    "features": [
      "Fill selected Bash command templates and copy the resulting command."
    ]
  },
  "sentence-extractor": {
    "description": "Split prose into a numbered sentence list with simple abbreviation and decimal protection. Boundary detection is heuristic and English-oriented. Unusual initials, abbreviations and punctuation can split differently.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Mr. Smith measured 3.14 meters. Done! exports two numbered sentences.",
        "note": "Boundary detection is heuristic and English-oriented. Unusual initials, abbreviations and punctuation can split differently."
      }
    ],
    "features": [
      "Split prose into a numbered sentence list with simple abbreviation and decimal protection."
    ]
  },
  "hex-to-decimal-converter": {
    "description": "Convert nonnegative whole integers between hexadecimal and decimal and show binary. Fractional and negative values aren't supported. Large integers must remain exact rather than pass through floating-point parsing.",
    "examples": [
      {
        "title": "Worked example",
        "code": "FF equals 255; 20000000000001 hex equals 9007199254740993 decimal.",
        "note": "Fractional and negative values aren't supported. Large integers must remain exact rather than pass through floating-point parsing."
      }
    ],
    "features": [
      "Convert nonnegative whole integers between hexadecimal and decimal and show binary."
    ]
  },
  "paragraph-generator": {
    "description": "Generate placeholder paragraphs from a small set of English sentence templates. This is random filler, not factual prose, topic-aware writing or unique content.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Request three paragraphs of five sentences and check no template markers remain.",
        "note": "This is random filler, not factual prose, topic-aware writing or unique content."
      }
    ],
    "features": [
      "Generate placeholder paragraphs from a small set of English sentence templates."
    ]
  },
  "random-id-generator": {
    "description": "Generate alphanumeric identifiers with configurable alphabet, length, count and prefix. Random generation doesn't guarantee uniqueness. Check collisions in the destination system.",
    "examples": [
      {
        "title": "Worked example",
        "code": "Generate five prefixed IDs and verify each suffix has the requested length and alphabet.",
        "note": "Random generation doesn't guarantee uniqueness. Check collisions in the destination system."
      }
    ],
    "features": [
      "Generate alphanumeric identifiers with configurable alphabet, length, count and prefix."
    ]
  },
  "jwt-token-inspector": {
    "description": "Decode JWT claims and inspect relative claim times and signature byte length. Decoding doesn't verify the signature. Claim times are untrusted until verified by the intended application.",
    "examples": [
      {
        "title": "Worked example",
        "code": "A token with exp: 0 reports an expired claim while preserving its decoded payload.",
        "note": "Decoding doesn't verify the signature. Claim times are untrusted until verified by the intended application."
      }
    ],
    "features": [
      "Decode JWT claims and inspect relative claim times and signature byte length."
    ]
  }
};
