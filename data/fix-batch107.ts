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

const FIX_BATCH_107: Record<string, FixBatchEntry> = {
  'punycode-encoder': {
    description: `DNS itself only understands ASCII, which means a domain name written in Cyrillic, Chinese, or with an emoji has to get represented some other way before it can actually resolve, and Punycode is that specific encoding, converting non-ASCII characters into an ASCII string prefixed with xn-- that DNS infrastructure can handle without ever needing to understand Unicode itself. This tool encodes and decodes Punycode for internationalized domain names, converting between the Unicode domain a person actually types and the ASCII form DNS actually resolves. Useful for converting an internationalized domain into the ASCII Punycode form it actually resolves to behind the scenes, decoding a suspicious xn-- domain to see what Unicode characters it's actually hiding before trusting a link, or checking exactly how a non-ASCII domain gets represented once it leaves a browser's address bar and reaches DNS.`,
    examples: [
      {
        title: 'Convert an internationalized domain to Punycode',
        code: `Input: münchen.de\nOutput: xn--mnchen-3ya.de`,
        note: 'Produces the ASCII form DNS actually resolves.',
      },
      {
        title: 'Decode a suspicious xn-- domain',
        code: `Input: xn--pple-43d.com\nOutput: аpple.com (uses a Cyrillic "а", not the Latin letter)`,
        note: 'Reveals look-alike characters before a link is trusted.',
      },
    ],
  },

  'qr-code-generator': {
    description: `A URL scanned as a QR code just opens a link, but WiFi credentials need the network name, password, and encryption type encoded in a specific format a phone's camera recognizes well enough to offer connecting automatically, and a vCard needs full contact details structured so scanning it offers adding the person to contacts directly, each content type requiring its own internal format rather than plain text dumped in. This tool generates QR codes for URLs, plain text, WiFi credentials, and vCards, downloadable as PNG or SVG, encoding each content type in the specific structure a scanning app actually recognizes. Useful for generating a WiFi QR code guests can scan to connect automatically without typing a password, creating a vCard QR code that offers adding a contact directly when scanned, or producing a scalable SVG QR code for a URL that needs to print clearly at a large size.`,
    examples: [
      {
        title: 'Generate a WiFi QR code for guests',
        code: `Input: SSID: "GuestNetwork", password: "welcome2026", encryption: WPA\nOutput: QR code that connects automatically when scanned`,
        note: "Encodes credentials in the format a phone's camera recognizes.",
      },
      {
        title: 'Create a vCard QR code',
        code: `Input: name: "Jane Doe", phone: "+1-555-0100"\nOutput: QR code offering "Add to Contacts" when scanned`,
        note: 'Structures contact data for direct add-to-contacts recognition.',
      },
    ],
  },

  'random-choice-picker': {
    description: `Deciding where to eat, who goes first in a game, or which idea from a shortlist to actually run with doesn't need statistical randomness in the sense a number generator provides, it needs one option pulled fairly from a small, specific, personally meaningful list someone actually typed in. This tool picks a random item from a list of choices entered as newlines, spinning or picking one at random from options that matter to the person choosing rather than generating numbers or strings from scratch. Useful for settling on a restaurant from a shortlist without an argument about who decides, picking a random name from a list to go first in a game or an assignment, or choosing fairly between a handful of options that were already narrowed down to a meaningful few.`,
    examples: [
      {
        title: 'Settle on a restaurant from a shortlist',
        code: `Input:\nSushi Place\nTaco Truck\nPizza Joint\nOutput: "Taco Truck"`,
        note: 'Picks fairly from a small, personally meaningful list.',
      },
      {
        title: 'Pick who goes first in a game',
        code: `Input:\nAlex\nJordan\nSam\nOutput: "Jordan"`,
        note: 'Settles a real decision rather than generating raw numbers.',
      },
    ],
  },

  'random-id-generator': {
    description: `A coupon code or a referral code handed out in bulk to thousands of customers has to actually be unique across the whole batch, a collision means two people redeeming the identical code, which makes generating a small handful of IDs by hand or with a basic random function a real risk once volume gets high enough for a repeat to actually happen. This tool generates random alphanumeric IDs, coupon codes, and referral codes in bulk, built for the batch-uniqueness a real promotional campaign or user-facing system actually needs. Useful for generating a large batch of unique coupon codes for a promotional campaign without manually checking for duplicates, creating referral codes for every new signup at scale, or producing alphanumeric IDs in bulk for a system that needs many unique identifiers generated at once rather than one at a time.`,
    examples: [
      {
        title: 'Generate a batch of unique coupon codes',
        code: `Input: count: 5000, format: SAVE-XXXX-XXXX\nOutput: SAVE-4K2P-9QRT, SAVE-7J1M-XN3W, ... (5000 unique codes)`,
        note: 'Guarantees uniqueness across the whole batch, not just per code.',
      },
      {
        title: 'Create referral codes at signup scale',
        code: `Input: count: 10000, format: alphanumeric, length: 8\nOutput: 10000 unique 8-character referral codes`,
        note: 'Built for volume where a collision would actually cause a problem.',
      },
    ],
  },

  'random-number-generator': {
    description: `Picking lottery numbers, selecting a random sample for a study, or assigning raffle ticket numbers all share the same underlying requirement, numbers pulled from a specific range without a repeat showing up, which is a meaningfully different need from generating a random string or a random ID, since the actual values and their numeric range matter here rather than an opaque alphanumeric token. This tool generates random integers or decimals within a custom range, with an option to enforce unique values across the whole set generated. Useful for drawing lottery or raffle numbers from a defined range without any duplicates appearing, generating a random sample of unique numeric values for a statistics exercise, or producing a decimal within a specific range for a simulation or a randomized test case.`,
    examples: [
      {
        title: 'Draw lottery numbers without duplicates',
        code: `Input: range: 1-49, count: 6, unique: true\nOutput: 3, 17, 22, 28, 35, 44`,
        note: 'Enforces uniqueness across the whole generated set.',
      },
      {
        title: 'Generate a decimal for a simulation',
        code: `Input: range: 0.0-1.0, decimals: 4\nOutput: 0.7342`,
        note: 'Values and range matter, not an opaque token.',
      },
    ],
  },

  'random-string-generator': {
    description: `An API key, a session token, and a temporary password each have their own specific requirements for length and which characters are actually allowed, some systems reject symbols entirely, others require at least one, which makes a fixed-format random generator the wrong fit the moment a specific system's character rules don't match whatever it happens to output. This tool generates random strings with a custom character set, length, and format, built for a token or a key that has to match a specific system's exact requirements rather than an arbitrary set of characters. Useful for generating an API key or a token restricted to a specific character set a system actually accepts, producing a random string at an exact required length for a security credential, or creating a temporary key with only the character types a downstream system is actually configured to allow.`,
    examples: [
      {
        title: 'Generate an API key matching a required charset',
        code: `Input: charset: alphanumeric, length: 32\nOutput: aK9mP2xQ7rT4vN8wZ1cL6bH3jY5gD0e`,
        note: "Matches a specific system's exact allowed characters.",
      },
      {
        title: 'Create a token excluding symbols',
        code: `Input: charset: letters + digits only, length: 16\nOutput: F8kR2mT9pL4nQ7wX`,
        note: 'Avoids characters a downstream system might reject.',
      },
    ],
  },

  'read-time-calculator': {
    description: `A blog platform's 'five minute read' badge at the top of an article isn't measuring anything universal, it's calculated against a specific words-per-minute convention that platform chose, Medium uses around two hundred sixty-five, and matching that same convention matters if the number displayed needs to feel consistent with what readers already expect from other articles they've read elsewhere. This tool estimates how long a piece of text takes to read based on average reading speed, producing the kind of number meant for a public-facing read-time badge rather than a personalized estimate. Useful for generating the read-time badge displayed at the top of a blog post or an article, matching the reading-speed convention readers are already used to seeing elsewhere, or getting a quick, standard estimate for how long a piece of published content takes to read.`,
    examples: [
      {
        title: "Generate a blog post's read-time badge",
        code: `Input: [1,850-word article]\nOutput: "7 min read"`,
        note: 'Matches the convention readers expect from other articles.',
      },
      {
        title: 'Get a standard estimate for published content',
        code: `Input: [800-word news article]\nOutput: "4 min read"`,
        note: 'A public-facing number, not a personalized calculation.',
      },
    ],
  },

  'readability-score-calculator': {
    description: `Flesch-Kincaid, SMOG, ARI, and Coleman-Liau don't always agree on the same text's grade level, since each formula weighs a different signal, syllables per word, characters per word, sentence length, slightly differently, which means trusting only one of them risks missing a blind spot a different formula would have caught. This tool calculates all four readability scores together for any text, giving a fuller picture of a passage's actual reading difficulty rather than relying on a single formula's specific weighting. Useful for checking whether several established readability formulas actually agree on a document's grade level before trusting the number, catching a case where one formula rates text easier than the others actually suggest, or getting a more complete readability assessment for content where a single score wouldn't tell the whole story.`,
    examples: [
      {
        title: 'Compare four formulas on the same text',
        code: `Input: [product manual excerpt]\nOutput: Flesch-Kincaid: 9.2, SMOG: 10.1, ARI: 8.7, Coleman-Liau: 9.8`,
        note: "Reveals when formulas disagree rather than trusting just one.",
      },
      {
        title: "Catch a formula's blind spot",
        code: `Input: [text with many short but technical words]\nOutput: syllable-based scores rate it easier than character-based scores do`,
        note: 'Surfaces a gap a single formula alone would have missed.',
      },
    ],
  },

  'reading-pace-calculator': {
    description: `An average reading speed assumption, roughly two hundred to two hundred fifty words per minute, doesn't actually describe any specific person, since real reading speed varies meaningfully from one reader to the next, which means an estimate calibrated to an individual's own measured pace is a fundamentally more accurate prediction than one built on a generic population average. This tool calculates a personal reading speed in words per minute and estimates completion time for any text based on that measured pace rather than an assumed average. Useful for measuring your own actual reading speed from a timed sample passage, predicting how long a longer document will actually take you personally to finish, or getting a completion-time estimate calibrated to your own pace instead of a generic assumption that may not match how fast you actually read.`,
    examples: [
      {
        title: 'Measure your own reading speed',
        code: `Input: [500-word passage], time taken: 1m 40s\nOutput: your pace: 300 words per minute`,
        note: 'Calibrated to the individual, not a population average.',
      },
      {
        title: 'Predict completion time using your measured pace',
        code: `Input: [12,000-word document], your pace: 300 WPM\nOutput: estimated completion time: 40 minutes`,
        note: 'Uses a measured personal rate rather than an assumed one.',
      },
    ],
  },

  'reading-time-calculator': {
    description: `A page of dense legal text or an academic paper packed with technical vocabulary gets read at a meaningfully slower pace than the same word count in a casual blog post or a novel, which means a reading time estimate built on one flat average speed is systematically wrong for anything that isn't casual prose, either badly underestimating a dense technical document or overestimating an easy one. This tool estimates reading time based on average reading speed, accounting for how a text's actual complexity affects that pace rather than applying one fixed number to every kind of writing. Useful for getting a realistic time estimate for a dense technical document that a flat average would badly underestimate, comparing how reading time actually differs between casual and technical writing of the same length, or estimating completion time for content whose difficulty isn't the same as typical casual prose.`,
    examples: [
      {
        title: 'Estimate time for a dense technical document',
        code: `Input: [2,000-word legal contract]\nOutput: 12 min (slower pace applied for technical density)`,
        note: 'A flat average would badly underestimate this text.',
      },
      {
        title: 'Compare casual vs technical writing of the same length',
        code: `Casual blog post (2,000 words): 8 min\nTechnical whitepaper (2,000 words): 13 min`,
        note: "Accounts for complexity rather than one fixed number for both.",
      },
    ],
  },
};

export default FIX_BATCH_107;
