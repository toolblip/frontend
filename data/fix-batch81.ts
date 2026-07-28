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

const FIX_BATCH_81: Record<string, FixBatchEntry> = {
  'gradient-generator': {
    description: `A gradient with just two colors is easy enough to picture in your head, but adding a third or fourth color stop means also deciding exactly where each one sits along that gradient, 20% here, 65% there, and getting those positions right by guessing at CSS values and reloading a browser repeatedly is a genuinely slow way to land on something that actually looks intentional. This tool builds multi-stop linear, radial, and conic gradients with each color stop draggable along the gradient itself, showing the live result while positions are being adjusted rather than after a page reload. Useful for placing a third accent color at exactly the right point in a background gradient, building a radial gradient for a UI element with more than two colors, or fine-tuning stop positions visually instead of guessing at percentage values in raw CSS.`,
    examples: [
      {
        title: 'Position a third color stop precisely',
        code: `Input: #FF6B35 @ 0%, #F7C548 @ 45%, #2563EB @ 100%\nOutput: linear-gradient(90deg, #FF6B35 0%, #F7C548 45%, #2563EB 100%)`,
        note: 'Drags stop positions visually instead of guessing percentage values.',
      },
      {
        title: 'Build a radial gradient with multiple stops',
        code: `Output: radial-gradient(circle, #FFFFFF 0%, #93C5FD 50%, #1E3A8A 100%)`,
        note: 'Shows the live result while stop positions are adjusted.',
      },
    ],
  },

  'unit-measurement-converter': {
    description: `Length, weight, and temperature cover most everyday conversion needs, but a recipe calling for a volume in cups, or a car's speed rated in mph needing a metric equivalent, falls outside that narrower set, which is exactly the gap a converter covering more categories in one place closes rather than sending someone hunting for a second, more specialized tool. This tool converts length, weight, temperature, speed, and volume between metric and imperial units, covering a broader range of categories in a single tool rather than splitting them across separate converters. Useful for converting a recipe's volume measurements between cups and milliliters in the same place as a temperature conversion, checking a vehicle's speed rating in both mph and km/h, or handling several different unit categories without switching between multiple specialized converters.`,
    examples: [
      {
        title: 'Convert a recipe volume and a temperature together',
        code: `Input: 2 cups -> Output: 473 ml\nInput: 350°F -> Output: 177°C`,
        note: 'Covers volume alongside the more common length, weight, and temperature categories.',
      },
      {
        title: 'Check a vehicle speed rating',
        code: `Input: 65 mph\nOutput: 104.6 km/h`,
        note: 'Includes speed conversion in the same tool as the other unit categories.',
      },
    ],
  },

  'http-response-headers': {
    description: `A page that loads stale content long after it was updated, a legitimate cross-origin request that gets silently blocked, a security scan flagging a missing header nobody remembered to set, all three trace back to the same place, the actual response headers a server sent back, which are invisible during normal browsing and only show up when something is specifically inspecting them. This tool fetches and displays every response header for any URL, organized by caching, CORS, and security categories rather than as one undifferentiated list. Useful for checking whether a Cache-Control header is causing a page to serve stale content longer than intended, confirming a CORS header is actually present before a cross-origin request gets blocked, or auditing which security headers, CSP, HSTS, X-Frame-Options, a page is or isn't sending.`,
    examples: [
      {
        title: 'Check why a page serves stale content',
        code: `Input: https://example.com\nOutput: Cache-Control: public, max-age=86400`,
        note: 'Reveals a caching duration long enough to explain stale content.',
      },
      {
        title: 'Audit missing security headers',
        code: `Input: https://example.com\nOutput: X-Frame-Options: missing, Content-Security-Policy: missing`,
        note: 'Flags security headers absent from the response.',
      },
    ],
  },

  'wifi-qr-code-generator': {
    description: `Reading out a WiFi password character by character to a guest, tracking capital letters, symbols, and numbers across a string nobody memorized on purpose, is exactly the kind of friction a WiFi QR code eliminates, since a phone's camera recognizes the standardized WIFI: QR format and offers to join the network directly, no typing required at all. This tool generates a QR code encoding a network's SSID, password, and encryption type in that standard format, ready to scan straight into a phone's WiFi settings. Useful for sharing a home network with a guest without reading a password aloud character by character, printing a WiFi QR code for a café or a waiting room where visitors connect constantly, or setting up quick network access for a device that can scan a code faster than a password can be typed.`,
    examples: [
      {
        title: 'Share a home network without reading the password aloud',
        code: `Input: SSID: "HomeNet", password: "Xk9#mQ2pL", encryption: WPA\nOutput: QR code that joins the network on scan`,
        note: 'Skips typing a complex password character by character.',
      },
      {
        title: 'Print a QR code for a café or waiting room',
        code: `Input: SSID: "GuestWiFi", password: "welcome2026", encryption: WPA2\nOutput: printable QR code`,
        note: 'Lets repeat visitors connect without ever asking for the password.',
      },
    ],
  },

  'json-to-tsv': {
    description: `A comma-separated file breaks in a specific, annoying way the moment actual data contains a comma, an address like "1600 Pennsylvania Ave, Washington DC" needs careful quoting or it corrupts the column structure, while a tab rarely if ever shows up inside real data, which is exactly why tab-separated format sidesteps that particular failure mode almost entirely. This tool converts a JSON array into TSV, using a tab as the delimiter so fields containing commas import cleanly into a spreadsheet without needing to be quoted or escaped. Useful for exporting JSON records containing comma-heavy fields like addresses or descriptions without corrupting a spreadsheet import, converting an API's JSON response into a format that pastes cleanly into Excel or Google Sheets, or avoiding comma-escaping issues entirely for data that's likely to contain commas.`,
    examples: [
      {
        title: 'Export comma-heavy fields safely',
        code: `Input: [{ "name": "Jane Doe", "address": "1600 Pennsylvania Ave, Washington DC" }]\nOutput TSV:\nname\taddress\nJane Doe\t1600 Pennsylvania Ave, Washington DC`,
        note: 'Keeps the comma-containing address intact without quoting or escaping.',
      },
      {
        title: 'Paste an API response into a spreadsheet',
        code: `Input: [{ "id": 1, "status": "active" }, { "id": 2, "status": "pending" }]\nOutput: id\tstatus\n1\tactive\n2\tpending`,
        note: 'Converts cleanly for pasting directly into Excel or Google Sheets.',
      },
    ],
  },

  'reading-level-estimator': {
    description: `Being told a piece of writing scores 65 on some named readability formula means very little without already knowing what that scale represents, but being told the same text reads at roughly an eighth-grade level translates immediately into something familiar, a school grade nearly everyone already has an intuitive sense of, no formula name or numeric scale required. This tool estimates the US school grade level a piece of text is actually written at, translating a passage's difficulty into a familiar grade rather than a named formula's raw score. Useful for checking whether a piece of public-facing writing is actually approachable for a general audience, confirming a children's book or an educational text matches its intended grade level, or getting an immediately understandable difficulty read without needing to interpret an unfamiliar readability scale.`,
    examples: [
      {
        title: 'Check public-facing writing for approachability',
        code: `Input: [website FAQ page]\nOutput: reads at approximately 9th-grade level`,
        note: 'Translates directly into a familiar school grade rather than a formula score.',
      },
      {
        title: "Confirm a children's book matches its target age",
        code: `Input: [picture book text]\nOutput: reads at approximately 2nd-grade level`,
        note: 'Gives an immediately understandable difficulty read.',
      },
    ],
  },

  'metric-imperial-converter': {
    description: `Most everyday conversions fall into just three categories, how long something is, how much it weighs, and how hot or cold it is, and a tool covering exactly those three without five other categories to scroll past stays faster to use for the common case than a broader converter built to handle everything at once. This tool converts length, weight, and temperature between metric and imperial units, focused specifically on the three categories that cover the vast majority of everyday conversions. Useful for a quick length conversion between centimeters and inches without navigating past unrelated categories, converting a recipe's oven temperature between Celsius and Fahrenheit, or checking a weight in kilograms against its pound equivalent for the common case that doesn't need speed or volume at all.`,
    examples: [
      {
        title: 'Convert length without extra categories',
        code: `Input: 30 cm\nOutput: 11.81 inches`,
        note: 'Stays focused on the three most common conversion categories.',
      },
      {
        title: "Convert a recipe's oven temperature",
        code: `Input: 180°C\nOutput: 356°F`,
        note: 'Handles the common case quickly without unrelated categories to scroll past.',
      },
    ],
  },

  'keyword-difficulty-checker': {
    description: `A keyword difficulty score isn't pulled out of thin air, it comes from actually looking at who currently occupies the top search results for that term, if the first page is dominated by large, well-established sites with substantial backlink profiles, breaking in is genuinely harder than a keyword where smaller or newer sites are already ranking, competition grounded in who's actually there rather than an abstract number. This tool estimates a keyword's ranking difficulty by analyzing the competition already occupying its current top search results. Useful for checking whether a target keyword is realistically winnable given who currently ranks for it, comparing difficulty across a shortlist of keyword candidates before committing content to one, or spotting a lower-competition keyword worth targeting instead of a much harder one with similar search volume.`,
    examples: [
      {
        title: 'Check difficulty based on current top results',
        code: `Input: "best running shoes"\nOutput: Difficulty: 78/100 (top results dominated by major retailers)`,
        note: "Grounds the score in who's actually ranking, not an abstract number.",
      },
      {
        title: 'Compare two keyword candidates',
        code: `Input: "running shoes" (difficulty: 78) vs "trail running shoes for beginners" (difficulty: 34)\nOutput: second keyword is meaningfully more winnable`,
        note: 'Surfaces a lower-competition alternative worth targeting instead.',
      },
    ],
  },

  'png-to-jpg': {
    description: `A transparent PNG converted to JPEG runs into a format limitation right away, JPEG has no alpha channel, so whatever was previously see-through needs a fill color chosen for it, white by default but not always the right call for a logo meant to sit on a dark background, and getting that choice wrong is how a transparent PNG turns into a graphic with an ugly white box around it. This tool converts PNG to JPEG with a chosen fill color for anything that was transparent, plus an adjustable compression quality level PNG's lossless format never required. Useful for converting a transparent logo to JPEG with a fill color matching a dark page background instead of defaulting to white, choosing a specific compression quality to balance file size against visible artifacts, or converting a PNG screenshot to JPEG for a smaller file where transparency was never actually needed.`,
    examples: [
      {
        title: 'Choose a fill color for a dark-background logo',
        code: `Input: logo.png (transparent background), fill: #000000\nOutput: logo.jpg (black background instead of default white)`,
        note: 'Avoids an unintended white box around a logo meant for a dark page.',
      },
      {
        title: 'Balance quality against file size',
        code: `Input: screenshot.png, quality: 80%\nOutput: screenshot.jpg (smaller file, minor compression artifacts)`,
        note: "Applies JPEG's adjustable compression that PNG's lossless format never required.",
      },
    ],
  },

  'mock-api-generator': {
    description: `Building a loading spinner or an error message actually requires seeing a slow response or a failed request happen, but a backend that isn't built yet, or one that's simply unavailable while a frontend is being developed, only ever returns the sunny-day success case, if it returns anything at all, leaving error states and loading behavior effectively untested until a real API exists to misbehave against. This tool generates a mock JSON API response with a customizable status code, an artificial delay, and a specific payload, simulating exactly the slow or failing responses a real backend would eventually produce. Useful for testing a loading state against an artificially slow mock response before a real API exists, building error-handling UI against a mocked 500 or 429 status code, or developing an entire frontend feature against a realistic mock response while the actual backend is still being built.`,
    examples: [
      {
        title: 'Simulate a slow response for a loading state',
        code: `Input: status: 200, delay: 3000ms, payload: { "items": [] }\nOutput: response returns after a 3-second delay`,
        note: 'Tests loading UI against an artificially slow response.',
      },
      {
        title: 'Build error handling against a mocked failure',
        code: `Input: status: 429, payload: { "error": "Too many requests" }\nOutput: mock 429 response returned immediately`,
        note: 'Develops error-handling UI before a real API can produce that failure.',
      },
    ],
  },
};

export default FIX_BATCH_81;
