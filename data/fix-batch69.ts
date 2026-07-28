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

const FIX_BATCH_69: Record<string, FixBatchEntry> = {
  'regex-pattern-builder': {
    description: `Writing a regex pattern that correctly matches every valid email address or every reasonable phone number format from scratch is a genuinely fiddly task even for someone comfortable with regex syntax, and copying a formula found on a forum somewhere doesn't always fit the specific format actually being validated. This tool builds a regex pattern visually from common use cases, an email address, a phone number, a URL, a date, generating a working pattern for that specific format rather than requiring the syntax written by hand from nothing. Useful for building an email validation pattern without knowing regex syntax at all, constructing a phone number pattern through a visual builder instead of hunting down a formula online, or generating a date-matching pattern for a specific format without learning full regex from scratch first.`,
    examples: [
      {
        title: 'Build an email validation pattern',
        code: `Selected use case: Email address\nOutput: ^[\\w.-]+@[\\w-]+\\.[a-zA-Z]{2,}$`,
        note: 'Generates a working pattern without writing regex syntax by hand.',
      },
      {
        title: 'Build a phone number pattern',
        code: `Selected use case: US phone number\nOutput: ^\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}$`,
        note: 'Produces a pattern for a specific format through a visual builder.',
      },
    ],
  },

  'meta-description-checker': {
    description: `Google gives a meta description roughly 155 to 160 characters before truncating it, a noticeably different limit than a title tag's, and a description that reads too generic or doesn't actually match the page's content risks Google overriding it entirely with its own auto-generated snippet instead of using what was actually written. This tool checks a meta description's length and quality specifically for SEO readiness and click-through rate, catching both a truncation risk and a description too generic to actually earn a click. Useful for confirming an existing meta description fits within Google's actual character limit before it gets cut off, checking whether a description reads specific enough that Google is unlikely to replace it with its own snippet, or auditing a page's meta description before publishing to make sure it's actually working toward a click rather than just filling space.`,
    examples: [
      {
        title: 'Check for truncation risk',
        code: `Input: "Learn the best strategies for growing your small business online through social media, SEO, and content marketing techniques that actually work in today's market."\nOutput: 178 characters - will be truncated past 160`,
        note: 'Flags a description before Google cuts it off mid-sentence.',
      },
      {
        title: 'Flag a description too generic to earn a click',
        code: `Input: "This page has information about our products and services."\nOutput: quality: low - too generic, Google may override with its own snippet`,
        note: 'Catches vague phrasing that risks being replaced by an auto-generated snippet.',
      },
    ],
  },

  'color-contrast-auditor': {
    description: `Confirming one text and background color pair passes WCAG is useful, but auditing an entire palette or a live page for every contrast failure and getting an actual suggested fix for each one is a different job entirely, closer to a compliance review than a single spot check. This tool audits color contrast ratios against WCAG 2.1 AA and AAA requirements and suggests an actual fix for each failure, proposing an adjusted color that would pass rather than only reporting which pairs don't. Useful for auditing an entire palette or a page's color combinations at once instead of testing one pair at a time, getting a concrete suggested color adjustment instead of just a failing ratio number, or running a full accessibility compliance pass before a design system ships.`,
    examples: [
      {
        title: "Audit a page's color combinations",
        code: `Input: [5 text/background pairs from a page]\nOutput: 3 pass AA, 2 fail (need contrast increase)`,
        note: 'Checks multiple combinations at once instead of one pair at a time.',
      },
      {
        title: 'Get a suggested fix for a failure',
        code: `Input: text #999999 on background #FFFFFF (fails AA, 2.8:1)\nOutput: suggested fix: #767676 (4.5:1, passes AA)`,
        note: 'Proposes an adjusted color instead of only reporting the failure.',
      },
    ],
  },

  'css-gradient-generator': {
    description: `A linear gradient sweeps in a straight line and a radial gradient spreads outward from a center point, but a conic gradient does something neither can, sweeping color around a center like a color wheel, exactly the shape a custom progress ring or a wheel-style picker actually needs and a linear or radial gradient simply can't produce. This tool builds linear, radial, and conic gradients with a live preview, adjustable color stops, and angle control, copying the finished CSS instantly once it looks right. Useful for building a linear gradient background with a precise angle for a hero section, creating a radial gradient for a spotlight or a glow effect behind an element, or building a conic gradient specifically for a progress ring or a color-wheel style UI component.`,
    examples: [
      {
        title: 'Build a linear gradient with a specific angle',
        code: `Output: background: linear-gradient(135deg, #FF6B6B 0%, #4ECDC4 100%);`,
        note: 'Sets a precise angle rather than a default direction.',
      },
      {
        title: 'Build a conic gradient for a progress ring',
        code: `Output: background: conic-gradient(from 0deg, #4ECDC4 0% 75%, #E0E0E0 75% 100%);`,
        note: "Produces a wheel-style sweep a linear or radial gradient can't create.",
      },
    ],
  },

  'css-naming-convention': {
    description: `A component library written in camelCase from a CSS-in-JS setup doesn't fit cleanly into a codebase built around BEM, and a design system's class names accumulated from several different contributors over time often end up in an inconsistent mix that needs standardizing before it causes real confusion. This tool converts CSS class names between BEM, kebab-case, camelCase, and SCSS conventions, translating a naming style directly rather than requiring every class renamed by hand. Useful for migrating a component library's class names into the BEM convention a specific codebase actually uses, converting a design system's classes into kebab-case for a vanilla CSS project, or standardizing inconsistent naming across a codebase that picked up different conventions from different contributors.`,
    examples: [
      {
        title: 'Convert camelCase to BEM',
        code: `Input: cardTitleText\nOutput: card__title-text`,
        note: 'Migrates a CSS-in-JS naming style into a codebase that uses BEM.',
      },
      {
        title: 'Convert BEM to kebab-case',
        code: `Input: nav__item--active\nOutput: nav-item-active`,
        note: 'Standardizes a class name for a vanilla CSS project.',
      },
    ],
  },

  'port-scanner-full': {
    description: `A specific open port on a server reveals a specific running service, 22 for SSH, 80 or 443 for a web server, 3306 for a database, which makes scanning a host's common ports a genuinely useful first check before deploying anything, especially to confirm a database port hasn't been left exposed to the open internet by mistake. This tool scans common ports on a host directly from the browser, identifying which services and applications are actually running and reachable rather than assuming based on configuration alone. Useful for confirming a database port isn't accidentally exposed to the public internet before deploying, auditing a server's open ports as a basic security check, or diagnosing why a specific service seems unreachable by confirming whether its port is actually open at all.`,
    examples: [
      {
        title: 'Check which services are exposed',
        code: `Input: example-server.com\nOutput: 22 (SSH) open, 80 (HTTP) open, 443 (HTTPS) open, 3306 (MySQL) closed`,
        note: 'Confirms a database port is not left exposed to the public internet.',
      },
      {
        title: 'Diagnose an unreachable service',
        code: `Input: internal-app.example.com, port: 8080\nOutput: port 8080 closed - service is not reachable`,
        note: 'Confirms whether a specific port is actually open before troubleshooting further.',
      },
    ],
  },

  'jwt-inspector': {
    description: `Two tokens that both decode into a similar-looking payload can still differ in one detail that actually matters, the header's algorithm field, HS256 versus RS256, especially when integrating against an unfamiliar auth provider where a mismatched signing algorithm causes a rejection that looks like an entirely different problem. This tool inspects and decodes a JWT without verifying its signature, surfacing the header's algorithm alongside the payload and expiration rather than only the claims. Useful for confirming which signing algorithm an unfamiliar token actually uses before integrating with a new auth provider, diagnosing an algorithm mismatch error that looks unrelated to signing at first glance, or inspecting a token's full header and payload together during development without needing the actual signing secret.`,
    examples: [
      {
        title: 'Check the signing algorithm',
        code: `Input: eyJhbGciOiJSUzI1NiJ9...\nOutput: header: { "alg": "RS256", "typ": "JWT" }`,
        note: 'Surfaces the algorithm field that a mismatch error often hides.',
      },
      {
        title: 'Inspect payload and expiration together',
        code: `Input: [JWT from an auth provider]\nOutput: payload: { "sub": "user_88", "exp": 1735689600 }, header: { "alg": "HS256" }`,
        note: 'Views the header and payload together without needing the signing secret.',
      },
    ],
  },

  'ssh-key-generator': {
    description: `RSA is the oldest and most universally compatible SSH key algorithm but needs a noticeably larger key size for the same actual security, while Ed25519 is newer, faster, and produces a much shorter key at an equivalent or better security level, a real difference worth knowing before picking one for a new server versus an older system that hasn't caught up yet. This tool generates RSA, ECDSA, and Ed25519 SSH key pairs directly in the browser, producing whichever algorithm actually fits a specific server's supported options. Useful for generating a modern Ed25519 key for a new server that supports it, creating an RSA key pair for an older system that doesn't yet support the newer algorithms, or generating an SSH key pair entirely without opening a terminal to run ssh-keygen.`,
    examples: [
      {
        title: 'Generate a modern Ed25519 key pair',
        code: `Output:\nPrivate key: -----BEGIN OPENSSH PRIVATE KEY-----...\nPublic key: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...`,
        note: 'Produces a short, fast key for a server that supports the newer algorithm.',
      },
      {
        title: 'Generate an RSA key for an older system',
        code: `Output:\nPublic key: ssh-rsa AAAAB3NzaC1yc2EAAAADAQAB...`,
        note: 'Creates a key format compatible with systems that lack newer algorithm support.',
      },
    ],
  },

  'business-plan-generator': {
    description: `Applying for a small business loan or pitching to a potential investor both expect a business plan with the same core sections in place, an executive summary, a market analysis, financial projections, and staring at a blank document trying to remember what those sections are even supposed to be called wastes time better spent on the actual content. This tool creates a professional business plan outline with the key sections already covered, giving a structure to fill in rather than a blank page to start from. Useful for drafting a business plan outline quickly when applying for a loan that specifically requires one, creating a starting structure for a pitch deck aimed at potential investors, or getting a section-by-section skeleton so the actual writing can focus on content instead of remembering the standard structure.`,
    examples: [
      {
        title: 'Generate an outline for a loan application',
        code: `Output: Executive Summary, Company Description, Market Analysis, Organization & Management, Products & Services, Financial Projections`,
        note: 'Provides the sections a lender typically expects to see.',
      },
      {
        title: 'Generate a pitch-ready structure',
        code: `Input: business type: subscription meal kit service\nOutput: outline tailored with sections for market opportunity, competitive analysis, and revenue model`,
        note: 'Gives a starting structure for an investor pitch instead of a blank page.',
      },
    ],
  },

  'url-encoder': {
    description: `Building an outgoing request's query string, appending a search term with spaces or an email address with a plus sign onto a URL, only needs encoding in one direction, converting reserved characters into their percent-encoded form before the request goes out, with no need for a decode feature at all in that specific moment. This tool encodes URLs and query parameters for safe transmission and proper formatting, focused entirely on that one direction rather than requiring a decode option alongside it. Useful for encoding a search term or a special character before appending it to an outgoing request's query string, formatting a URL correctly before it gets sent to an API, or preparing a query parameter for safe transmission without needing to decode anything in the same pass.`,
    examples: [
      {
        title: 'Encode a search term for a query string',
        code: `Input: "coffee & tea shops"\nOutput: coffee%20%26%20tea%20shops`,
        note: 'Prepares a term with special characters for an outgoing request.',
      },
      {
        title: 'Encode an email address for a query parameter',
        code: `Input: jane+newsletter@example.com\nOutput: jane%2Bnewsletter%40example.com`,
        note: 'Keeps the plus sign and at symbol from breaking the URL structure.',
      },
    ],
  },
};

export default FIX_BATCH_69;
