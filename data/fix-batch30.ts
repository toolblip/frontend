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

const FIX_BATCH_30: Record<string, FixBatchEntry> = {
  'api-endpoint-tester': {
    description: `Building a full request with headers and authentication is one job, but sometimes the actual need is simpler: hit an endpoint right now and see exactly what comes back, formatted in a way that's actually readable, pretty-printed JSON, response headers, status code, and timing, rather than a wall of raw, unformatted response text. This tool sends a request to any API endpoint and formats the response for actual reading, switching between raw, pretty-printed, and headers-only views depending on what's actually useful to inspect at that moment. Useful for a quick spot-check of what an endpoint currently returns without setting up a full request first, comparing a response's shape against what documentation claims it should look like, or checking a status code and timing together when something about a request feels off.`,
    examples: [
      {
        title: 'Spot-check what an endpoint currently returns',
        code: `Input: GET https://api.example.com/users/42\nOutput: pretty-printed JSON, status 200, response time: 180ms`,
        note: 'Formats the response for reading instead of a raw, unformatted body.',
      },
      {
        title: 'Compare a response against documentation',
        code: `Input: GET https://api.example.com/products/9\nOutput: {"id": 9, "price": null} (docs claim price is always a number)`,
        note: 'Reveals a mismatch between documented behavior and the actual response.',
      },
    ],
  },

  'http-headers-viewer': {
    description: `A slow page load could be sitting in any one of several stages that happen before content ever starts rendering, a slow DNS lookup, a sluggish TLS handshake, a server that takes too long to send the first byte, and headers alone don't show which of those stages is actually the bottleneck without a timing breakdown alongside them. This tool checks a URL's request and response headers together with a timing breakdown covering each of those stages separately, rather than a single total load time that hides where the actual delay is happening. Useful for figuring out whether a slow page is stuck on DNS, the TLS handshake, or a slow server response specifically, debugging a CORS or caching header issue with the timing context alongside it, or getting a full picture of both what a server sent back and how long each step actually took.`,
    examples: [
      {
        title: 'Find which stage is slowing a page down',
        code: `Input: https://example.com\nOutput: DNS: 12ms, TLS handshake: 340ms, TTFB: 890ms, download: 45ms`,
        note: 'Isolates the TLS handshake as the actual bottleneck rather than a single total time.',
      },
      {
        title: 'Check headers with timing context',
        code: `Input: https://example.com\nOutput: Cache-Control: max-age=3600 | TTFB: 210ms`,
        note: 'Views caching behavior alongside how long the server actually took to respond.',
      },
    ],
  },

  'image-clipper': {
    description: `Cutting a subject out from its background by hand means tracing an outline pixel by pixel around hair, curved edges, and gaps between limbs, which takes real patience in an actual image editor and is exactly the tedious part this tool automates instead. It detects where a subject ends and the background begins automatically, then extracts just the subject with the background removed entirely, ready to place onto a new backdrop or drop into a design with one click rather than a manual trace. Useful for pulling a product out of its original photo background for a marketplace listing, extracting a person from a busy background for a profile photo, or cutting a subject out cleanly to composite onto something else without opening a full image editor.`,
    examples: [
      {
        title: 'Remove a background for a marketplace listing',
        code: `Input: sneaker-photo.jpg (cluttered background)\nOutput: sneaker-cutout.png (background removed, transparent)`,
        note: 'Extracts the subject automatically instead of tracing it by hand.',
      },
      {
        title: 'Extract a person from a busy photo',
        code: `Input: group-photo.jpg\nOutput: person-cutout.png (transparent background)`,
        note: 'Handles curved edges and hair detail that a manual trace would take real time to get right.',
      },
    ],
  },

  'azw3-to-epub': {
    description: `AZW3 carries Kindle-specific formatting features EPUB was never built around, fixed layouts, particular typography choices, page-precise positioning, so converting it into EPUB means more than just repackaging the same content, the text actually needs to be reflowed to work in EPUB's flexible, resizable-text model instead of Kindle's more rigid layout system. This tool converts a non-DRM AZW3 file into EPUB, adapting that Kindle-specific formatting into something EPUB's reflowable text model can actually render correctly rather than a broken layout that assumed a fixed Kindle screen. Useful for reading a personal or self-published AZW3 file on a non-Kindle device or app that only supports EPUB, or converting your own AZW3-formatted content into the one ebook format nearly every reader app outside Amazon's ecosystem actually supports.`,
    examples: [
      {
        title: 'Convert a self-published book for a non-Kindle app',
        code: `Input: my-novel.azw3 (non-DRM)\nOutput: my-novel.epub (reflowable text)`,
        note: "Adapts Kindle's fixed layout formatting into EPUB's resizable text model.",
      },
      {
        title: 'Read personal AZW3 content on another device',
        code: `Input: personal-notes.azw3\nOutput: personal-notes.epub`,
        note: 'Opens on any reader app outside the Amazon ecosystem.',
      },
    ],
  },

  'avi-to-mp3': {
    description: `Old camcorder footage from the early 2000s often saved as AVI, and sometimes the only thing actually worth keeping from an old home movie decades later isn't the shaky, low-resolution video itself, it's a birthday song playing in the background, a bit of narration, a piece of audio that exists nowhere else anymore. This tool pulls the audio track out of an AVI file and saves it as a standalone MP3, preserving a piece of sound that would otherwise stay locked inside old, rarely-opened video footage. Useful for recovering a recording of a family member's voice buried in decades-old home video, saving a song or performance captured only on an old camcorder file, or extracting audio from archived AVI footage without needing to keep or re-watch the video itself.`,
    examples: [
      {
        title: 'Recover a voice from old home video footage',
        code: `Input: birthday-1998.avi (camcorder footage)\nOutput: birthday-1998.mp3 (audio only)`,
        note: 'Preserves a recording that exists nowhere else besides this old video file.',
      },
      {
        title: 'Save a performance captured only on an old camcorder',
        code: `Input: recital-footage.avi\nOutput: recital-footage.mp3`,
        note: 'Extracts audio without needing to keep or rewatch the original video.',
      },
    ],
  },

  trace: {
    description: `A logo pulled off an old website, a small favicon, a low-resolution scan of a business card, is sometimes the only surviving copy of a logo whose original vector source file is long gone, lost in an old hard drive or a design agency that's no longer around to ask. This tool traces that low-resolution raster copy into a clean, editable vector, rebuilding scalable paths from what might be a genuinely small, blurry source image rather than requiring a high-quality original to start from. Useful for recovering a usable, scalable version of a logo when the original design file has been lost entirely, preparing an old low-resolution logo for a use that actually needs a vector, embroidery, signage, large-format print, or rebuilding a brand mark from whatever copy happens to still exist somewhere.`,
    examples: [
      {
        title: 'Recover a lost logo as editable vector paths',
        code: `Input: old-logo-favicon.png (32x32, low resolution)\nOutput: old-logo.svg (clean vector paths, scalable)`,
        note: 'Rebuilds a scalable version from a small, low-quality source when the original file is gone.',
      },
      {
        title: 'Prepare an old logo for large-format print',
        code: `Input: business-card-scan.png\nOutput: logo.svg`,
        note: 'Produces a vector suitable for signage or print at sizes the raster source could never support.',
      },
    ],
  },

  'avi-to-mkv': {
    description: `AVI is an aging container with real limitations that show up the moment a project outgrows them, a hard cap on file size for very long recordings, no clean way to hold more than one audio track or a subtitle track alongside the video, constraints that simply don't apply to MKV, a much more flexible container built to hold multiple tracks and larger files without the same ceiling. This tool converts an AVI file into MKV, moving old footage into a container that can actually accommodate an added subtitle track, a second audio track, or a file size AVI was never designed to handle gracefully. Useful for modernizing an old AVI archive before adding subtitles or an alternate audio track to it, or converting AVI footage into a container that plays more comfortably with current video editing software.`,
    examples: [
      {
        title: 'Add a subtitle track to old footage',
        code: `Input: old-film.avi\nOutput: old-film.mkv (ready to add a subtitle track)`,
        note: 'AVI has no clean way to hold a subtitle track alongside the video; MKV does.',
      },
      {
        title: 'Modernize an archive for current editing software',
        code: `Input: archive-footage.avi (large file)\nOutput: archive-footage.mkv`,
        note: 'Moves footage into a container current video editors handle more comfortably than aging AVI.',
      },
    ],
  },

  'instagram-caption-generator': {
    description: `Instagram truncates a caption after roughly the first two lines in the feed, everything past that sits behind a "more" tap most people never bother making, which means the opening of a caption is doing almost all the actual work regardless of how much thought went into the rest of it. This tool writes captions built around that constraint specifically, a strong opening line that earns the tap, followed by the supporting text and a relevant set of hashtags, rather than a generic caption that reads fine in full but buries its best line somewhere in the middle where the truncation cuts it off. Useful for writing a caption where the first line actually needs to work on its own, pairing a caption with a relevant hashtag set without hunting them down separately, or drafting captions for a batch of feed posts at once.`,
    examples: [
      {
        title: 'Write a caption with a strong opening line',
        code: `Input: post about: "new product launch"\nOutput: "This took us 6 months to build. (And it was worth every minute.)"`,
        note: "The opening line has to work on its own since Instagram truncates the rest behind a 'more' tap.",
      },
      {
        title: 'Pair a caption with relevant hashtags',
        code: `Input: post about: "morning coffee routine"\nOutput: caption + #coffeelovers #morningroutine #slowmornings`,
        note: 'Bundles a relevant hashtag set instead of researching them separately.',
      },
    ],
  },

  'open-graph-generator': {
    description: `A page with no Open Graph tags at all doesn't get a broken preview when it's shared, it gets no preview, or one built from a best-guess fallback that rarely looks intentional, a random image from the page, a truncated title pulled from wherever the sharing platform decided to look. This tool builds the actual og:title, og:description, and og:image tags for a page from scratch, with a live preview showing exactly how the resulting share card will look before any of it goes live. Useful for adding real Open Graph tags to a page that currently has none at all, previewing exactly how a new page will look when shared before publishing it, or fixing a specific field, swapping out a preview image, without guessing at what the final card will actually display.`,
    examples: [
      {
        title: 'Generate tags for a page with none',
        code: `Input: page title, description, featured image\nOutput: <meta property="og:title" content="..."> <meta property="og:image" content="...">`,
        note: 'Builds the tags from scratch rather than fixing ones that already exist.',
      },
      {
        title: 'Preview a share card before publishing',
        code: `Input: new blog post details\nOutput: live preview showing the card as it would appear when shared`,
        note: 'Shows the result before the page goes live rather than after someone shares it.',
      },
    ],
  },

  'cron-schedule-explainer': {
    description: `An inherited cron expression sitting in someone else's crontab or an old deployment script is often trusted to keep working simply because nobody wants to be the one who breaks it by touching something they don't fully understand, five densely packed fields with no comment explaining what any of them actually do. This tool takes an existing cron expression and explains it in plain English, translating the five fields into an actual sentence describing the schedule, plus the next several times it would actually run, rather than requiring the syntax to be manually decoded field by field. Useful for understanding an unfamiliar cron job inherited from a previous project before touching it, confirming an existing schedule actually runs when everyone assumes it does, or double-checking a manually-written expression translates to the schedule that was actually intended.`,
    examples: [
      {
        title: 'Explain an inherited cron expression',
        code: `Input: 0 3 * * 1-5\nOutput: "At 3:00 AM, Monday through Friday"`,
        note: 'Translates the five fields into a plain sentence instead of decoding them manually.',
      },
      {
        title: 'Get the next few run times',
        code: `Input: 0 0 1 * *\nOutput: "At midnight on the 1st of every month" | Next runs: Aug 1, Sep 1, Oct 1`,
        note: 'Confirms exactly when a schedule will actually fire next.',
      },
    ],
  },
};

export default FIX_BATCH_30;
