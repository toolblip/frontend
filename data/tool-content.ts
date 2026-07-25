export type ToolContentExample = {
  title: string;
  code: string;
  language?: string;
  note?: string;
};

export type ToolContent = {
  /** 100-200 word description specific to this tool, not shared boilerplate. */
  description: string;
  /** 2-3 short, concrete code examples relevant to this tool. */
  examples: ToolContentExample[];
  /** Key features specific to this tool. */
  features: string[];
};

/**
 * Hand-written, per-tool content keyed by slug. Unlike lib/generateToolContent.ts
 * and lib/faq.ts (which pick from a small pool of category-level templates and
 * are near-duplicate across every tool in a category), everything here should be
 * unique prose written for that specific tool.
 */
export const toolContent: Record<string, ToolContent> = {
  'json-formatter': {
    description:
      "The JSON Formatter turns a single unbroken line of JSON into an indented, readable tree the moment you paste it. It runs your input through the browser's native JSON parser, so if something is malformed, the error message points at the exact character that broke the parse instead of leaving you to eyeball a wall of text for a missing comma. Switch between 2-space and 4-space indentation depending on your team's style guide, or flip to minify mode to strip every byte of whitespace before you ship a payload over the wire. Because parsing and formatting both happen with dependency-free browser APIs, there's no network round-trip and no upload step — paste an API response that contains customer records or an internal auth token and it never leaves the tab. The formatter also copes with deeply nested structures and multi-megabyte payloads without stalling, which is the case that trips up most copy-paste-into-a-website JSON tools.",
    examples: [
      {
        title: 'Minified input',
        language: 'json',
        code: '{"id":482,"user":{"name":"Alice Chen","active":true},"tags":["admin","beta"],"createdAt":"2026-01-14T10:22:00Z"}',
        note: 'A typical single-line API response — hard to scan for a specific field.',
      },
      {
        title: 'Pretty-printed output (2-space)',
        language: 'json',
        code: `{
  "id": 482,
  "user": {
    "name": "Alice Chen",
    "active": true
  },
  "tags": ["admin", "beta"],
  "createdAt": "2026-01-14T10:22:00Z"
}`,
        note: 'The same payload after formatting — every key is scannable and the nesting is visible at a glance.',
      },
      {
        title: 'A syntax error the formatter catches',
        language: 'json',
        code: `{
  "id": 482,
  "active": true,
}`,
        note: 'The trailing comma after "active": true is invalid JSON. The formatter flags it immediately instead of leaving you to guess which character broke the parse.',
      },
    ],
    features: [
      'Real-time syntax validation that points to the exact line and character of the first error',
      'Toggle between 2-space and 4-space indentation without re-pasting your input',
      'One-click minify mode for stripping whitespace before sending a payload over the wire',
      'Handles multi-megabyte, deeply nested JSON without freezing the tab',
    ],
  },
};

export function getToolContent(slug: string): ToolContent | undefined {
  return toolContent[slug];
}
