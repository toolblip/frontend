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

const FIX_BATCH_6: Record<string, FixBatchEntry> = {
  'color-contrast-auditor': {
    description: `Checking one text color against one background is straightforward, but a real design system has dozens of color combinations in play, body text on a card, a button label on its background, a link color against both light and dark surfaces, and eyeballing whether each one is readable enough doesn't scale. This tool audits a set of color pairs at once against the WCAG 2.1 AA and AAA thresholds, flags exactly which combinations fall short, and suggests a specific adjusted color that would pass instead of leaving you to guess how much darker or lighter something needs to be. That last part is the difference from a basic contrast check: instead of just a pass or fail, you get a concrete fix, nudge this blue two shades darker, lighten that gray background, ready to swap in and recheck immediately.`,
    examples: [
      {
        title: "Audit a design system's color pairs at once",
        code: `Input: body text #767676 on #FFFFFF, button label #FFFFFF on #F2A93B\nResult: body text passes AA (4.54:1), button label fails AA (2.1:1)`,
        note: 'Checks multiple pairs in one pass instead of testing each combination separately.',
      },
      {
        title: 'Get a specific fix for a failing pair',
        code: `Input: link color #6B9FE0 on #FFFFFF (2.8:1, fails AA)\nSuggested fix: #2E5FA3 on #FFFFFF (4.6:1, passes AA)`,
        note: 'Returns an adjusted color that passes instead of a plain fail notice.',
      },
    ],
  },

  'css-gradient-generator': {
    description: `A linear gradient blends colors along a straight line, angle it 45 degrees and the color shifts diagonally across an element. A radial gradient blends outward from a center point instead, which is what actually creates a spotlight or vignette effect rather than a straight band of color. A conic gradient does something different again: it sweeps colors around a center point like a color wheel, which is how a lot of loading rings and pie-chart-style visuals get their transitions. This tool builds all three with a live preview, letting you add and reposition individual color stops, set the angle or center point, and adjust each stop's exact position along the gradient instead of guessing at percentages in a stylesheet. Once it looks right, copy the finished CSS gradient function straight into a stylesheet.`,
    examples: [
      {
        title: 'Build a radial spotlight effect',
        code: `background: radial-gradient(circle at center, #FFD166 0%, #073B4C 100%);`,
        note: 'A radial gradient spreads outward from a point rather than across a straight line.',
      },
      {
        title: 'Create a conic gradient for a loading ring',
        code: `background: conic-gradient(from 0deg, #06D6A0 0deg, #118AB2 180deg, #06D6A0 360deg);`,
        note: "A conic gradient sweeps around a center point, which is what gives a loading ring its rotating color effect.",
      },
    ],
  },

  'css-naming-convention': {
    description: `Every CSS naming convention solves the same problem, keeping class names organized and collision-free, but each solves it with completely different syntax: BEM builds a block__element--modifier chain, kebab-case just lowercases and hyphenates, camelCase is what a lot of CSS-in-JS and CSS Modules setups expect instead. Joining a project that uses a different one than you're used to, or migrating an existing stylesheet from one convention to another, means manually rewriting every class name by hand unless there's a shortcut. This tool converts a list of class names between all four conventions at once, so a stylesheet full of kebab-case classes can be turned into their BEM or camelCase equivalents in one pass instead of renaming each selector individually across dozens of files.`,
    examples: [
      {
        title: 'Convert kebab-case classes to BEM',
        code: `Input: nav-item-active\nOutput: nav__item--active`,
        note: 'Useful when migrating a stylesheet to a design system that expects BEM structure.',
      },
      {
        title: 'Convert BEM to camelCase for CSS Modules',
        code: `Input: card__title--highlighted\nOutput: cardTitleHighlighted`,
        note: 'Matches the naming style most CSS Modules and CSS-in-JS setups expect.',
      },
    ],
  },

  'port-scanner-full': {
    description: `Confirming a server is actually listening on the port it's supposed to be usually means opening a terminal and running nmap, which isn't always available, welcome, or fast to install on a locked-down work laptop. This tool checks the common, well-known ports on a host, the ones services like HTTP, SSH, and databases typically use, straight from the browser, and reports back which ones respond and which stay silent. It's a lighter, quicker check than a full port sweep, built for the specific question of whether the service you expect to find is actually reachable from outside, not for mapping every possible open port on a machine. Useful for confirming a firewall rule actually closed a port it was supposed to, or checking that a newly deployed server's web port is responding before debugging anything more complicated.`,
    examples: [
      {
        title: 'Confirm a web server is reachable',
        code: `Input: example.com\nOutput: Port 80 (HTTP): open | Port 443 (HTTPS): open | Port 22 (SSH): closed`,
        note: 'Confirms the expected web ports are responding without opening a terminal.',
      },
      {
        title: 'Check that a firewall rule actually closed a port',
        code: `Input: db-server.internal\nOutput: Port 5432 (PostgreSQL): closed | Port 3306 (MySQL): closed`,
        note: 'Verifies a database port is not reachable from outside after a firewall change.',
      },
    ],
  },

  'jwt-inspector': {
    description: `A JWT's payload is just base64-encoded JSON sitting in the middle of the token, readable without needing the secret or public key that actually signed it. That's the specific job this tool does: split a token into its header and payload, decode both, and show the claims, expiration, issuer, whatever's actually inside, without attempting to verify the signature at all. That matters most when there's no signing key available in the first place, a token grabbed from a browser's network tab while debugging someone else's API, a JWT from a third-party service being integrated with, one pulled from a support ticket to check why a user's session expired early. Paste in the token and see exactly what it claims, decoded instantly, with the signature portion shown but left unverified since verifying it isn't the point here.`,
    examples: [
      {
        title: 'Read the claims inside a token grabbed from DevTools',
        code: `Input: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0IiwiZXhwIjoxNzAwMDAwMDAwfQ.signature\nDecoded payload: { "sub": "1234", "exp": 1700000000 }`,
        note: 'Decodes the claims without needing the secret key that signed the token.',
      },
      {
        title: 'Check why a session expired early',
        code: `Input: [pasted JWT from a support ticket]\nDecoded: exp: 1706000000 (Jan 23, 2026, 09:00 UTC)`,
        note: 'Reveals the exact expiration timestamp encoded in the token.',
      },
    ],
  },

  'ssh-key-generator': {
    description: `Setting up SSH access to a new server usually starts with a terminal command, ssh-keygen, and then remembering the right flags for the key type actually wanted. This tool generates the key pair directly: Ed25519 for the shortest, fastest option that most current servers and git hosts support and generally recommend as the default, RSA for the older, most universally compatible choice still required by some legacy systems and older hardware, or ECDSA as a middle ground between the two. Pick an algorithm, generate the pair, and get back both the private key to keep on your machine and the public key to paste into a server's authorized_keys file or a git host's settings. Useful for spinning up a fresh key pair for a new VPS, a CI pipeline, or a git account without opening a terminal at all.`,
    examples: [
      {
        title: 'Generate an Ed25519 key for a new git host',
        code: `Type: Ed25519\nOutput: id_ed25519 (private), id_ed25519.pub (public)`,
        note: 'The recommended default for most current servers and git hosting providers.',
      },
      {
        title: 'Generate an RSA key for a legacy system',
        code: `Type: RSA, 4096-bit\nOutput: id_rsa (private), id_rsa.pub (public)`,
        note: 'RSA remains the most broadly compatible choice for older servers and hardware.',
      },
    ],
  },

  'business-plan-generator': {
    description: `A business plan has a fairly standard shape that lenders and investors expect to see, an executive summary, a market analysis, a description of the product or service, a section on competition, and financial projections, but figuring out what belongs in each part and in what order is its own hurdle before a single sentence about the actual business gets written. This tool takes a few basics, what the business does, who it's for, how it makes money, and builds out that full section-by-section structure with prompts for what each part should cover. It's a scaffold to write into, not a finished plan generated from nothing; the goal is skipping the blank-page problem of knowing what a bank or investor expects a plan to contain, so the actual writing can focus on specific numbers and story instead of the format.`,
    examples: [
      {
        title: 'Scaffold a plan for a new coffee shop',
        code: `Input: business type: coffee shop, revenue model: retail sales + subscriptions\nOutput sections: Executive Summary, Market Analysis, Products & Services, Competition, Financial Projections`,
        note: 'Gives a section-by-section structure to write into instead of a blank page.',
      },
      {
        title: 'Build an outline for an investor pitch',
        code: `Input: business type: SaaS startup, funding stage: seed\nOutput sections: Executive Summary, Problem & Solution, Market Size, Go-to-Market Strategy, Financial Projections`,
        note: 'Matches the sections investors typically expect to see at the seed stage.',
      },
    ],
  },

  'url-encoder': {
    description: `A space, an ampersand, or an equals sign typed straight into a URL doesn't just look wrong, it can actively break the URL's structure, since those characters normally carry their own meaning: an ampersand separates query parameters, an equals sign assigns a value to one. This tool percent-encodes a URL or a specific query parameter so those reserved characters get replaced with their safe, escaped equivalents instead of colliding with the URL's own syntax. It matters most when building a link that includes user-provided text as a parameter, a search query, an email address, a value with spaces or special characters, since encoding just that value, rather than the whole URL, keeps the surrounding structure intact while making the value itself safe to transmit. Paste in a raw string or full URL and get back a version that won't misbehave when it's actually used.`,
    examples: [
      {
        title: 'Encode a query parameter with special characters',
        code: `Input: name=Jane & Co.\nOutput: name%3DJane%20%26%20Co.`,
        note: "Escapes the ampersand and equals sign so they don't get read as separate parameters.",
      },
      {
        title: 'Encode a search query for a URL',
        code: `Input: c++ tutorials & examples\nOutput: c%2B%2B%20tutorials%20%26%20examples`,
        note: 'Keeps a value with plus signs and spaces safe to embed inside a query string.',
      },
    ],
  },

  'image-metadata-remover': {
    description: `EXIF is only one layer of the metadata a photo can carry. A file edited in Lightroom or Photoshop often picks up XMP data recording the exact edit history, an ICC color profile describing how its colors should be interpreted, and IPTC fields for captions, keywords, and copyright notices, sometimes filled in automatically by whatever software touched the file last. This tool strips out all of it, not just the camera and GPS details in EXIF but the editing software's own metadata layers too, leaving the visible image completely unchanged. That matters for a file with a longer history than a straight-from-camera photo: a stock photo submission where leftover IPTC keywords might contradict the licensing terms, or a marketing image where an old caption field still references an internal project name that never should have left the building.`,
    examples: [
      {
        title: 'Strip leftover edit history before a stock submission',
        code: `Input: photo.jpg (XMP: edited in Lightroom, ICC profile: Adobe RGB)\nOutput: photo-clean.jpg (XMP and ICC data removed)`,
        note: 'Removes editing software metadata that a plain EXIF-only tool would leave behind.',
      },
      {
        title: "Remove an internal caption before a marketing image goes public",
        code: `Input: campaign-photo.jpg (IPTC caption: "v3_internal_review_do_not_publish")\nOutput: campaign-photo-clean.jpg (IPTC fields cleared)`,
        note: 'Clears caption and keyword fields that EXIF removal alone would not touch.',
      },
    ],
  },

  'random-pin-generator': {
    description: `People asked to pick their own PIN gravitate toward the same handful of options, a birth year, four repeated digits, a simple sequence like 1234, all of which are exactly the patterns anyone trying to guess a PIN checks first. This tool generates a numeric PIN using a cryptographically random source instead of a predictable pattern, at whatever length the situation calls for: four digits for a bank card, six for a one-time verification code, longer for a numeric access key protecting something more sensitive. Set the length, generate, and get a PIN with no memorable pattern behind it and nothing tying it back to a birthday or an easily guessed sequence. Useful for setting up a new device PIN, generating a batch of one-time codes for a verification flow, or creating an access code for a shared door lock that shouldn't be predictable.`,
    examples: [
      {
        title: 'Generate a 4-digit device PIN',
        code: `Length: 4\nOutput: 7042`,
        note: 'Drawn from a cryptographically random source rather than a predictable sequence.',
      },
      {
        title: 'Generate a batch of 6-digit one-time codes',
        code: `Length: 6, count: 5\nOutput: 384029, 917653, 502841, 663190, 275038`,
        note: 'Produces a batch for a verification flow without repeating patterns between codes.',
      },
    ],
  },
};

export default FIX_BATCH_6;
