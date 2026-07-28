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

const FIX_BATCH_19: Record<string, FixBatchEntry> = {
  'unit-measurement-converter': {
    description: `Everyday conversions get rounded constantly, close enough for a recipe or a rough estimate, but a rounded factor isn't good enough for a citation, a technical spec, or a calculation where the last couple of decimal places actually matter, a mile is exactly 1.609344 kilometers, not the 1.6 shorthand most conversions default to. This tool converts length, weight, temperature, speed, and volume using the full precision conversion factor rather than a rounded approximation, and shows the exact figure used so the math behind a result can be checked or cited. Useful for a technical document that needs to state a converted value to a specific number of decimal places, verifying a conversion used elsewhere wasn't quietly rounded in a way that matters, or any calculation where the everyday shorthand version of a conversion factor isn't precise enough.`,
    examples: [
      {
        title: 'Get an exact conversion factor for a report',
        code: `Input: 1 mile\nOutput: 1.609344 kilometers (exact factor)`,
        note: 'Uses the full precision factor instead of the 1.6 shorthand common in everyday rounding.',
      },
      {
        title: 'Verify a converted figure used elsewhere',
        code: `Input: 5 gallons\nOutput: 18.92706 liters`,
        note: 'Useful for checking whether a figure cited elsewhere was rounded in a way that matters.',
      },
    ],
  },

  'http-response-headers': {
    description: `A page's content is only part of what a server actually sends back; the response headers riding along with it control caching behavior, whether another site's script is allowed to read the response at all through CORS, and which security protections, like a content security policy, are actually active on that specific request. This tool fetches a URL and displays the full set of response headers it returns, rather than requiring a browser's developer tools or a command-line request just to see them. Useful for confirming a CDN is actually caching a resource the way it's supposed to, debugging why a cross-origin request is being blocked by checking what CORS headers a server actually sends, or verifying a security header like HSTS or a content security policy is genuinely present rather than assumed to be configured.`,
    examples: [
      {
        title: 'Check if a resource is actually being cached',
        code: `Input: https://example.com/style.css\nOutput: Cache-Control: max-age=86400, ETag: "a1b2c3"`,
        note: 'Confirms a CDN or server is applying the caching behavior it claims to.',
      },
      {
        title: 'Debug a blocked cross-origin request',
        code: `Input: https://api.example.com/data\nOutput: Access-Control-Allow-Origin: https://otherapp.com (missing your domain)`,
        note: 'Reveals exactly which origin is allowed, explaining why a request from a different domain gets blocked.',
      },
    ],
  },

  'wifi-qr-code-generator': {
    description: `Reading a WiFi password off a sticky note character by character, especially one with a mix of symbols and cases, is the kind of small friction a QR code eliminates entirely: a phone's camera reads the code and offers to join the network directly, no typing required. This tool builds that QR code from a network's actual credentials, the SSID, the password, and the encryption type, encoded in the specific format phones expect for WiFi auto-join rather than a plain text QR code that would require typing the details in manually anyway. Useful for printing a card for guests to join a home or office network without reciting a password out loud, posting a code at a cafe or rental property for a network many people need to join, or setting up a shared network for an event without a queue of people asking for the password.`,
    examples: [
      {
        title: 'Create a QR code for guest WiFi',
        code: `Input: SSID: "GuestNetwork", password: "Welcome2026!", encryption: WPA\nOutput: QR code that joins the network directly when scanned`,
        note: 'Encodes credentials in the format phones use for WiFi auto-join, not a plain text code.',
      },
      {
        title: 'Print a network card for a rental property',
        code: `Input: SSID: "BeachHouseWifi", password: "SunnyDays24"\nOutput: printable QR code card`,
        note: 'Lets guests join without typing a password full of mixed characters.',
      },
    ],
  },

  'json-to-tsv': {
    description: `A spreadsheet doesn't read JSON, and pasting a JSON array of objects directly into one just produces a single garbled cell rather than organized rows and columns, which is exactly the gap this tool closes: convert a JSON array into tab-separated values, one row per object and one column per field, formatted the way a spreadsheet application expects when pasting data in directly. Tabs specifically, rather than commas, avoid the ambiguity a comma-separated format runs into when a field's own text happens to contain a comma. Useful for pulling an API response's JSON array straight into a spreadsheet for quick analysis, exporting a JSON dataset into a format non-technical teammates can actually open and sort, or preparing JSON data for import into a tool that expects tab-delimited rows rather than a JSON body.`,
    examples: [
      {
        title: 'Convert an API response for spreadsheet analysis',
        code: `Input: [{"name":"Alice","age":30},{"name":"Bob","age":25}]\nOutput:\nname\\tage\\nAlice\\t30\\nBob\\t25`,
        note: 'Produces rows and columns a spreadsheet can paste in directly instead of one garbled cell.',
      },
      {
        title: 'Handle a field containing a comma safely',
        code: `Input: [{"city":"Springfield, IL"}]\nOutput: city\\nSpringfield, IL`,
        note: 'Tabs avoid the ambiguity a comma-separated format would run into with this value.',
      },
    ],
  },

  'reading-level-estimator': {
    description: `A single grade-level number tells you what to expect from a piece of writing before committing time to it: an eighth-grade estimate signals a general-audience article most people will follow comfortably, while a graduate-level estimate warns that the same page is going to read dense and technical, regardless of what the writer intended. This tool analyzes a passage's sentence length and word complexity together and returns an estimated US school grade level required to read it comfortably, one number that summarizes what a full syllable and sentence breakdown would otherwise take longer to interpret. Useful for confirming a public-facing page isn't accidentally written above its intended audience's comfort level, checking that a children's resource actually matches its target age group, or comparing the general accessibility of two drafts at a glance.`,
    examples: [
      {
        title: 'Check if a public page reads too dense',
        code: `Input: [terms of service excerpt]\nOutput: Grade 16 (graduate level)`,
        note: 'Signals the page will read as dense and technical to a general audience.',
      },
      {
        title: "Confirm a children's resource matches its age group",
        code: `Input: [early reader story text]\nOutput: Grade 2`,
        note: 'Confirms the writing actually matches the intended reading age.',
      },
    ],
  },

  'metric-imperial-converter': {
    description: `Almost the entire world measures in metric; the US is one of the few major exceptions, which means an American reading a European recipe, a product spec sheet from an overseas manufacturer, or a news report about weather or distance abroad is constantly running into numbers in a system they don't think in, and the reverse happens just as often for anyone abroad interpreting American content. This tool converts specifically between metric and imperial for length, weight, and temperature, the three units that come up constantly in that exact situation. Useful for figuring out what a European clothing size or a recipe's grams actually mean in familiar terms, converting an American recipe's cups and Fahrenheit for someone who only has a metric kitchen, or making sense of a weather report given in Celsius when you think in Fahrenheit.`,
    examples: [
      {
        title: 'Understand a European measurement in familiar terms',
        code: `Input: 180 cm\nOutput: 5 ft 11 in`,
        note: 'Bridges a metric measurement for someone who thinks in feet and inches.',
      },
      {
        title: 'Convert an American recipe for a metric kitchen',
        code: `Input: 350°F, 2 cups flour\nOutput: 176.7°C, 473 ml`,
        note: 'Useful for following a US recipe with a kitchen that only measures in metric.',
      },
    ],
  },

  'keyword-difficulty-checker': {
    description: `A keyword search volume number tells you how many people search for a phrase, but it says nothing about how realistic it actually is to rank for that phrase, which depends entirely on who's already occupying the results, whether the top pages are from established, high-authority domains or smaller sites with a genuine opening to compete against. This tool estimates that difficulty by analyzing the actual competition currently ranking for a keyword, the authority and content strength of the pages already sitting at the top, rather than looking at search volume alone. Useful for prioritizing which keywords in a content plan are realistically winnable soon versus which ones would need months of authority-building first, or explaining to a client why a high-volume keyword isn't necessarily the right one to target first.`,
    examples: [
      {
        title: 'Check difficulty for a competitive keyword',
        code: `Input: "best laptops 2026"\nOutput: difficulty: 82/100 (top results from established tech publications)`,
        note: 'High difficulty here reflects strong existing competition, not just search volume.',
      },
      {
        title: 'Find a more realistically winnable keyword',
        code: `Input: "best laptops for architecture students"\nOutput: difficulty: 34/100 (mostly smaller sites currently ranking)`,
        note: 'A narrower keyword with weaker competition already ranking is often a more realistic target.',
      },
    ],
  },

  'png-to-jpg': {
    description: `Converting a PNG to JPEG raises one question a lot of conversions skip over: PNG supports a transparent background, and JPEG has no concept of transparency at all, so every transparent pixel has to become some actual solid color once the conversion happens, which matters because the wrong choice there can leave a visible box around what used to be a transparent logo or icon. This tool converts PNG to JPEG with the background fill color chosen explicitly rather than defaulted silently to whatever the software happens to pick, plus a quality setting for how aggressively the result gets compressed. Useful for placing a logo that has a transparent background onto a JPEG file with a specific matching background color, or converting a graphic to JPEG for a destination that doesn't accept PNG while controlling exactly what fills in where the transparency used to be.`,
    examples: [
      {
        title: 'Convert a transparent logo with a matching background',
        code: `Input: logo.png (transparent background), fill: #FFFFFF\nOutput: logo.jpg (white background)`,
        note: 'Chooses the fill color explicitly instead of leaving it to a default that might not match.',
      },
      {
        title: 'Convert a graphic with a specific quality setting',
        code: `Input: banner.png, quality: 85%\nOutput: banner.jpg (smaller file, minor compression)`,
        note: 'Balances file size against visible compression artifacts.',
      },
    ],
  },

  'mock-api-generator': {
    description: `Frontend work often needs to start before a backend API actually exists, or needs to keep running smoothly when the real API is slow, flaky, or returning an error the frontend needs to handle gracefully, none of which is easy to test against a real backend on demand. This tool generates a mock API endpoint that returns whatever JSON payload, status code, and response delay are configured, standing in for a real backend during development. Set it to return a 500 error to test how the frontend handles a failure, add an artificial delay to test a loading state properly instead of a response that resolves instantly, or return a specific payload shape before the real endpoint is ready to build against. Useful for frontend development that can't wait on backend completion, or testing edge cases a real API rarely produces on demand.`,
    examples: [
      {
        title: 'Test a loading state with an artificial delay',
        code: `Endpoint: GET /mock/products\nConfig: delay: 2000ms, status: 200, payload: [{"id":1,"name":"Widget"}]`,
        note: 'Simulates a slow response to properly test a loading indicator.',
      },
      {
        title: 'Test how the frontend handles a server error',
        code: `Endpoint: GET /mock/orders\nConfig: status: 500, payload: { "error": "Internal Server Error" }`,
        note: 'Lets error handling be tested without needing a real backend to actually fail.',
      },
    ],
  },

  rotate: {
    description: `90, 180, and a custom angle cover two genuinely different situations that happen to use the same word: 90 and 180 degree rotations fix an orientation problem, a photo that's sideways or upside down for one clear reason, while a custom angle is a compositional choice, straightening a slightly tilted horizon or angling an element deliberately for a design. This tool handles both: quick preset buttons for the common 90-degree turns, plus a precise custom angle for anything that needs a specific number of degrees rather than a quarter turn. Useful for fixing a sideways phone photo instantly with one click, or dialing in an exact small-angle rotation to level a crooked horizon line without a full quarter turn overcorrecting it.`,
    examples: [
      {
        title: 'Fix a sideways phone photo instantly',
        code: `Input: photo.jpg (rotated 90° from intended orientation)\nOutput: photo-fixed.jpg (90° preset applied)`,
        note: 'One click for the common orientation-fix case.',
      },
      {
        title: 'Straighten a slightly tilted horizon',
        code: `Input: beach-photo.jpg, angle: -3°\nOutput: beach-photo-straight.jpg`,
        note: 'A small custom angle corrects a tilt without a full 90-degree turn.',
      },
    ],
  },
};

export default FIX_BATCH_19;
