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

const FIX_BATCH_10: Record<string, FixBatchEntry> = {
  'sql-prettifier': {
    description: `A query copied out of an ORM's debug log or exported as a single line from a database tool usually arrives as one unbroken string, no line breaks, no indentation, keywords in whatever case the original code happened to use. This tool reformats that into SQL a person can actually scan: each clause on its own line, consistent indentation for subqueries and joins, and keywords capitalized so SELECT, WHERE, and JOIN stand out from the column and table names around them. That difference matters most when debugging a slow query from a production log, where a giant unbroken string hides exactly which join or condition is causing the problem, or when reviewing a teammate's pull request that includes a raw SQL string nobody indented before committing. Paste in the raw query, choose an indentation style, and get back something that reads like a query someone actually wrote by hand.`,
    examples: [
      {
        title: 'Format a query copied from an ORM log',
        code: `Input: select id,name,email from users where active=1 and created_at>'2026-01-01' order by created_at desc\nOutput:\nSELECT id, name, email\nFROM users\nWHERE active = 1\n  AND created_at > '2026-01-01'\nORDER BY created_at DESC`,
        note: 'Breaks a single unbroken line into readable clauses with consistent indentation.',
      },
      {
        title: 'Clean up a nested subquery before a code review',
        code: `Input: select * from (select customer_id,sum(total) as t from orders group by customer_id) x where x.t>1000\nOutput:\nSELECT *\nFROM (\n  SELECT customer_id, SUM(total) AS t\n  FROM orders\n  GROUP BY customer_id\n) x\nWHERE x.t > 1000`,
        note: 'Indents the subquery separately so its boundaries are obvious at a glance.',
      },
    ],
  },

  'serp-preview': {
    description: `A character count only tells you so much about how a page will actually look in Google's results; the real test is seeing it rendered the way a searcher actually will, the blue title link, the green URL breadcrumb, the gray description snippet underneath, truncated exactly where Google's own rendering would cut it off. This tool builds that mockup directly: enter a page's title and meta description, and see the preview as it would genuinely appear on both desktop and mobile search results, where the available width and truncation point actually differ. Adjust the title or description and watch the preview update, catching a title that gets cut off mid-word or a description that runs past the visible line before the page ever goes live. Useful for testing several title variations against each other visually before picking the one most likely to earn a click.`,
    examples: [
      {
        title: 'Preview a title that gets cut off',
        code: `Input: title: "The Complete Guide to Understanding Every Aspect of Modern Web Performance Optimization Techniques"\nPreview: "The Complete Guide to Understanding Every Aspect of..." (truncated at ~60 characters)`,
        note: 'Shows the actual truncation point instead of just reporting a character count.',
      },
      {
        title: 'Compare desktop and mobile snippet width',
        code: `Input: title + description for /blog/widget-guide\nOutput: desktop preview (longer visible title) vs mobile preview (shorter, wraps sooner)`,
        note: 'Mobile and desktop truncate at different points, which a single preview would miss.',
      },
    ],
  },

  'color-format-converter-v2': {
    description: `A color value shows up differently depending on where you're working: a stylesheet might use hex, a design tool's color picker often defaults to HSL, an older CSS rule might specify RGBA for transparency, and a print job needs CMYK entirely. Jumping between those contexts usually means opening a different single-purpose converter for each pair, hex to RGB here, RGB to HSL there. This tool shows every format at once instead: paste in a color as hex, RGB, RGBA, HSL, HSLA, or CMYK, and see it translated into all the others simultaneously, with a live swatch confirming they all actually match. Useful when a project touches multiple contexts in the same session, pulling a brand color from a design file, checking it in a stylesheet, and confirming how it'll look on a printed brochure, without switching between five different single-format tools.`,
    examples: [
      {
        title: 'See a brand color in every format at once',
        code: `Input: #2563EB\nOutput: rgb(37, 99, 235) | hsl(217, 83%, 53%) | cmyk(84%, 58%, 0%, 8%)`,
        note: 'One paste updates every format simultaneously instead of converting pairs one at a time.',
      },
      {
        title: 'Check a semi-transparent color across formats',
        code: `Input: rgba(220, 38, 38, 0.75)\nOutput: #DC2626BF | hsla(0, 74%, 51%, 0.75)`,
        note: 'Keeps the alpha value consistent across the hex, RGBA, and HSLA representations.',
      },
    ],
  },

  'gif-to-mov': {
    description: `A GIF sent through iMessage or pasted into an Instagram story doesn't always behave the way you'd expect: some platforms convert it automatically and lose quality in the process, others simply don't accept the format as a native video at all. This tool converts an animated GIF into a QuickTime MOV file instead, which plays as a proper native video with better compression and smoother playback than GIF's limited color palette and frame-based format ever allowed. That matters most for sharing on iOS specifically, where a converted MOV drops right into Messages or Photos and plays the way a normal video clip would, rather than behaving like an image that happens to move. Useful for turning a GIF you found or made into something that shares cleanly on a platform that treats animated GIFs as a second-class file type.`,
    examples: [
      {
        title: 'Convert a GIF for smoother iMessage sharing',
        code: `Input: reaction.gif (3.2 MB, 15 fps)\nOutput: reaction.mov (1.1 MB, smooth playback)`,
        note: 'Plays as a native video clip in Messages instead of a lower-quality auto-converted GIF.',
      },
      {
        title: 'Prepare an animation for an Instagram story',
        code: `Input: animated-logo.gif\nOutput: animated-logo.mov`,
        note: 'Stories are built around video, so a native MOV avoids the awkward handling some apps give raw GIFs.',
      },
    ],
  },

  'regex-tester': {
    description: `Building a regex pattern is one job; confirming it actually behaves the way you think across every input it needs to handle is a separate one, and plenty of patterns that look correct on paper fail the moment a real edge case shows up. This tool is built for that second job: paste in a pattern already written, run it against sample text, and watch matches highlight live as either side gets edited, the pattern or the test string, instead of running the regex in actual code just to find out it doesn't match what was expected. Capture groups show up broken out individually, so a pattern with several groups doesn't leave you guessing which part of a match corresponds to which group. Useful for verifying a pattern against a handful of tricky real-world examples before it goes anywhere near production code.`,
    examples: [
      {
        title: 'Verify a pattern against several real examples',
        code: `Pattern: ^\\d{3}-\\d{3}-\\d{4}$\nTest strings: "555-123-4567" (match), "555.123.4567" (no match), "5551234567" (no match)`,
        note: 'Reveals that the pattern only accepts hyphens, not dots or no separator at all.',
      },
      {
        title: 'Inspect capture groups on a multi-part match',
        code: `Pattern: (\\w+)@(\\w+)\\.com\nInput: "contact: jane@example.com"\nGroups: 1 = "jane", 2 = "example"`,
        note: 'Breaks out each capture group individually instead of showing one combined match.',
      },
    ],
  },

  'twitter-card-preview': {
    description: `Pasting a link into a tweet only shows a rich preview card if the page behind it has the right meta tags in place, and there's no way to know that worked without either posting for real or checking with a tool built for exactly this. This tool renders that preview ahead of time: enter a URL and see how it would appear as either a large image card or a smaller summary card, catching a missing preview image, an oddly cropped photo, or a title cut off before the tweet ever goes out. It reads the same og: and twitter: meta tags that Twitter itself checks, so what shows up here is a genuine preview of what a real audience would see, not a guess. Useful for checking a new blog post's share card before it goes live, or debugging a link posted with no preview image at all.`,
    examples: [
      {
        title: 'Check a large image card before publishing',
        code: `Input: https://example.com/blog/new-feature\nOutput: large image card, 1200x630 image, title and description rendered below`,
        note: 'Confirms the og:image meta tag is set correctly before the link is shared publicly.',
      },
      {
        title: 'Debug a link with no preview image',
        code: `Input: https://example.com/no-og-tags\nOutput: summary card with no image (missing og:image or twitter:image tag)`,
        note: 'Reveals exactly which meta tag is missing that would otherwise leave a bare link preview.',
      },
    ],
  },

  'wcag-contrast-checker': {
    description: `WCAG doesn't use one single contrast number, it uses different thresholds depending on both the compliance level and the size of the text involved: AA requires a 4.5 to 1 ratio for normal body text but only 3 to 1 for large text and UI components, while AAA raises the normal-text bar all the way to 7 to 1. This tool checks one specific foreground and background pair against all of those thresholds at once, reporting the exact calculated ratio and whether it clears AA, AAA, both, or neither, for the text size actually being used. That size distinction matters: a color pair that fails for body copy might genuinely pass for a large heading, which a checker that only applies one flat threshold would get wrong. Useful for verifying one specific color decision precisely before it ships, rather than auditing an entire palette at once.`,
    examples: [
      {
        title: 'Check a pair that passes for large text only',
        code: `Input: #767676 on #FFFFFF\nOutput: 4.54:1, passes AA normal text, passes AA large text, fails AAA normal text`,
        note: 'Shows how the same ratio clears some thresholds but not others depending on text size.',
      },
      {
        title: 'Verify a UI component meets the lower 3:1 bar',
        code: `Input: #949494 on #FFFFFF (button border)\nOutput: 3.02:1, passes AA for UI components and large text`,
        note: 'UI components and large text use a 3:1 threshold instead of the 4.5:1 required for body copy.',
      },
    ],
  },

  'aac-to-mp4': {
    description: `Plenty of mobile video editing apps only let you import video files into a project, not standalone audio, which becomes a real problem the moment an AAC voiceover or a music track needs adding and the app's import screen simply won't show audio-only files as an option. This tool wraps an AAC file inside an MP4 container without adding any actual video, so the same audio that got rejected as an audio file now imports cleanly wherever the app expects a video, since technically that's what the container says it is. The sound itself stays untouched, just repackaged into a wrapper that more software recognizes as importable media. Useful for getting a voice recording or a music track into a phone-based video editor that's picky about file types, or onto a smart TV or media player that flatly refuses to play a bare audio file.`,
    examples: [
      {
        title: 'Import a voiceover into a phone video editor',
        code: `Input: voiceover.aac\nOutput: voiceover.mp4 (audio only, no video track)`,
        note: 'Some mobile editing apps only allow importing files with an mp4 extension.',
      },
      {
        title: 'Play an AAC file on a picky media player',
        code: `Input: podcast-clip.aac\nOutput: podcast-clip.mp4`,
        note: 'Some smart TVs and media players reject bare AAC files but recognize mp4 immediately.',
      },
    ],
  },

  'hex-to-cmyk': {
    description: `A color that looks vivid on a screen doesn't always survive the trip to a printed page, because a monitor mixes light directly while a printer mixes ink, and CMYK simply can't reproduce every color RGB can display, especially certain bright greens, oranges, and neon-leaning tones. This tool converts a hex color into its CMYK equivalent so a print shop or a layout program has the actual ink percentages to work with, rather than a screen color a printer would have to approximate on its own. It also gives an honest preview of what the color will likely look like once printed, which sometimes reveals that a color chosen on screen reads noticeably duller or shifted once actually converted to ink. Useful for checking a brand color before it goes on a business card or a brochure, catching a mismatch before an expensive print run rather than after.`,
    examples: [
      {
        title: 'Convert a brand color before sending it to print',
        code: `Input: #FF3B30\nOutput: cmyk(0%, 76%, 81%, 0%)`,
        note: 'Gives a print shop the ink percentages instead of a screen-only hex value.',
      },
      {
        title: 'Catch a color that will look duller once printed',
        code: `Input: #39FF14 (neon green)\nOutput: cmyk(76%, 0%, 100%, 0%), preview noticeably duller than the screen color`,
        note: 'Some bright screen colors fall outside what CMYK ink can reproduce.',
      },
    ],
  },

  'epub-to-azw3': {
    description: `EPUB is the format almost every ebook platform outside Amazon uses, but a Kindle device reads its own formats best, and AZW3, sometimes called KF8, supports layout features EPUB and the older MOBI format don't handle as well: fixed layouts, more precise typography, better support for embedded fonts. Sending an EPUB straight to a Kindle relies on Amazon's own background conversion, which doesn't always preserve formatting cleanly, especially for anything visually complex. This tool converts an EPUB file into AZW3 directly, so a book bought from a non-Amazon store, downloaded from a library service, or self-published outside Amazon's own pipeline ends up in the format a Kindle actually handles best, rather than something reformatted automatically and imperfectly on the way in.`,
    examples: [
      {
        title: 'Convert a purchased ebook for full Kindle formatting',
        code: `Input: novel.epub (embedded custom font, drop caps)\nOutput: novel.azw3 (formatting preserved)`,
        note: "Avoids relying on Kindle's automatic conversion, which doesn't always keep complex formatting intact.",
      },
      {
        title: 'Prepare a self-published book for a Kindle device',
        code: `Input: my-book.epub\nOutput: my-book.azw3`,
        note: 'Delivers the format a Kindle reads natively instead of one it has to reformat on arrival.',
      },
    ],
  },
};

export default FIX_BATCH_10;
