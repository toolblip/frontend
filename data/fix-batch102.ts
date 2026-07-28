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

const FIX_BATCH_102: Record<string, FixBatchEntry> = {
  'json-to-go-struct': {
    description: `Go doesn't do dynamic typing the way JSON's data does, every struct field needs an explicit type declared up front, and Go's convention of capitalizing exported field names, Name instead of name, rarely matches a JSON key's original casing, which means mapping a nested JSON object into Go means both inferring the right static type per field and generating a json struct tag that preserves the original key so marshaling doesn't silently break. This tool converts JSON data into Go struct definitions with field types and JSON tags generated together, handling both concerns at once rather than leaving tags to be added by hand afterward. Useful for turning an API response into a typed Go struct without manually inferring each field's type, generating the exact json tags so marshaling matches the original API's key names, or scaffolding a struct from a real payload instead of writing one from documentation alone.`,
    examples: [
      {
        title: 'Convert an API response into a typed struct',
        code: `Input: {"user_name": "jane", "is_active": true}\nOutput:\ntype Response struct {\n  UserName string \`json:"user_name"\`\n  IsActive bool \`json:"is_active"\`\n}`,
        note: 'Infers the type and generates the tag preserving the original key.',
      },
      {
        title: 'Scaffold a struct from a real payload',
        code: `Input: {"id": 42, "tags": ["a", "b"]}\nOutput:\ntype Item struct {\n  ID   int      \`json:"id"\`\n  Tags []string \`json:"tags"\`\n}`,
        note: 'Builds the definition from actual data rather than documentation alone.',
      },
    ],
  },

  'json-to-markdown-table': {
    description: `A README or a wiki page displaying tabular data needs an actual Markdown table, headers, a row of alignment dashes, pipe-separated cells, syntax that's tedious to hand-write correctly for anything beyond a couple of rows, especially once column alignment needs specifying and every object in the array needs to actually share the same set of keys for the table to make sense. This tool converts JSON arrays into formatted Markdown tables with headers and alignment handled automatically, built for documentation output rather than for generating code. Useful for dropping an API response's JSON array straight into a README as a readable table, documenting a dataset's structure in a wiki page without hand-aligning pipe characters, or turning a config file's array of objects into a table for a documentation page.`,
    examples: [
      {
        title: 'Drop an API response into a README table',
        code: `Input: [{"name":"Jane","role":"Admin"},{"name":"Sam","role":"Editor"}]\nOutput:\n| name | role |\n|:-----|:-----|\n| Jane | Admin |\n| Sam  | Editor |`,
        note: 'Generates headers and alignment dashes automatically.',
      },
      {
        title: 'Document a config array in a wiki page',
        code: `Input: [{"key":"timeout","value":30}]\nOutput:\n| key | value |\n|:----|------:|\n| timeout | 30 |`,
        note: 'Handles column alignment without hand-aligning pipe characters.',
      },
    ],
  },

  'json-to-python': {
    description: `Python's dynamic typing means a plain dictionary already works fine for quick scripting, no declared type ever gets checked, but an actual application handling untrusted or external data usually wants real validation, catching a missing field or a wrong type at the boundary rather than downstream where it's harder to trace, which is a fundamentally different need than just wanting the data as a usable dict. This tool converts JSON data into either plain Python dictionaries or Pydantic model definitions, covering the throwaway-script case and the validated-application case as two distinct, selectable outputs rather than assuming which one is actually needed. Useful for getting a quick Python dict literal for a one-off script or a REPL session, generating a Pydantic model that validates external data at an application's boundary, or scaffolding a typed model definition straight from a real API response instead of writing one from scratch.`,
    examples: [
      {
        title: 'Get a quick dict for a one-off script',
        code: `Input: {"name": "jane", "age": 30}\nOutput: {"name": "jane", "age": 30}`,
        note: 'No validation overhead for throwaway scripting use.',
      },
      {
        title: 'Generate a validated Pydantic model',
        code: `Input: {"name": "jane", "age": 30}\nOutput:\nclass User(BaseModel):\n    name: str\n    age: int`,
        note: "Validates external data at an application's actual boundary.",
      },
    ],
  },

  'json-to-typescript': {
    description: `TypeScript can express an object's shape as either an interface or a type alias, and which one applies best depends on the JSON itself, a union of possible values for a field that changes shape, an array with mixed element types, cases where a type alias's more flexible syntax handles something an interface alone can't express cleanly, which is where strict-mode inference actually matters. This tool converts JSON data into TypeScript interfaces and types with an optional strict mode, choosing between interface and type output based on what the data's shape calls for rather than forcing everything into one syntax. Useful for generating a type alias when a field's inferred shape needs a union an interface can't express, turning a straightforward object into a clean interface when that fits better, or getting stricter inferred types instead of a looser structure that quietly allows more than the data actually shows.`,
    examples: [
      {
        title: 'Generate a type alias for a mixed-shape field',
        code: `Input: {"status": "active"} | {"status": "pending", "reason": "review"}\nOutput: type Status = { status: "active" } | { status: "pending"; reason: string };`,
        note: "Uses a type alias where an interface alone can't express a union.",
      },
      {
        title: 'Generate a clean interface for a straightforward object',
        code: `Input: {"id": 1, "name": "Widget"}\nOutput:\ninterface Item {\n  id: number;\n  name: string;\n}`,
        note: 'Chooses interface output when the shape fits it best.',
      },
    ],
  },

  'json-to-typescript-interface': {
    description: `Some codebases specifically standardize on interface declarations over type aliases for object shapes, often because interfaces support declaration merging and extends in a way type aliases don't, which makes a dedicated interface-only generator the right fit when the output format itself isn't actually a choice, and the real remaining decisions are things like whether a field observed as sometimes null should be typed nullable and whether a field should be marked readonly. This tool converts JSON into TypeScript interfaces specifically, with optional strict types, nullability, and readonly fields controlled directly rather than inferred as a single fixed default. Useful for generating interface-only output for a codebase that standardizes on interfaces over type aliases, marking a field readonly when the data represents something that shouldn't be reassigned after creation, or typing a field as nullable specifically when null actually showed up in the source JSON.`,
    examples: [
      {
        title: 'Mark a field readonly for immutable data',
        code: `Input: {"id": 1, "createdAt": "2026-01-01"}\nOutput:\ninterface Record {\n  readonly id: number;\n  readonly createdAt: string;\n}`,
        note: "Controls readonly directly rather than an inferred fixed default.",
      },
      {
        title: 'Type a field as nullable when null actually appears',
        code: `Input: {"middleName": null}\nOutput:\ninterface Person {\n  middleName: string | null;\n}`,
        note: 'Reflects a null value actually observed in the source JSON.',
      },
    ],
  },

  'json-to-url-encoded': {
    description: `Building a query string by hand from a JSON object of parameters means percent-encoding every special character in both keys and values correctly, a space, an ampersand, a slash, each with its own required escape sequence, easy to get subtly wrong in a way that only breaks once a value happens to contain the wrong character. This tool converts JSON key-value pairs into a URL-encoded string formatted for query parameters, handling that character-by-character escaping automatically rather than leaving it to string concatenation done by hand. Useful for turning a JSON object of filters into a properly encoded query string for a GET request, converting form data captured as JSON into the URL-encoded format an endpoint actually expects, or generating a query string that correctly escapes a value containing spaces or special characters instead of breaking on them.`,
    examples: [
      {
        title: 'Turn a JSON filter object into a query string',
        code: `Input: {"search": "coffee & tea", "page": 2}\nOutput: search=coffee%20%26%20tea&page=2`,
        note: 'Escapes special characters correctly in both keys and values.',
      },
      {
        title: 'Convert captured form data to URL-encoded format',
        code: `Input: {"email": "a@b.com", "name": "Jane Doe"}\nOutput: email=a%40b.com&name=Jane%20Doe`,
        note: 'Produces the exact format a GET endpoint expects.',
      },
    ],
  },

  'json-tree-view': {
    description: `Writing a JSONPath expression assumes the path to a specific field is already known, but with an unfamiliar, deeply nested response, the actual first step is usually finding where that field even lives, which calls for browsing the structure directly, collapsing sections that aren't relevant, searching for a key by name, rather than writing and testing an expression against a structure that hasn't been explored yet. This tool displays JSON data as an interactive tree with expand, collapse, search, and path copy, built around discovering where something lives before querying for it rather than assuming the path already. Useful for exploring an unfamiliar API response by collapsing irrelevant branches down to just what matters, searching a large JSON structure for a specific key by name instead of scanning visually, or copying the exact path to a field once it's found, ready to paste into a query tool elsewhere.`,
    examples: [
      {
        title: 'Collapse irrelevant branches in a large response',
        code: `Input: [500-line nested API response]\nAction: collapse "metadata", "pagination"\nOutput: tree reduced to just the "results" branch`,
        note: 'Narrows a large structure down to what actually matters.',
      },
      {
        title: 'Search for a key and copy its path',
        code: `Search: "userId"\nOutput: found at data.results[3].author.userId\nCopied: $.data.results[3].author.userId`,
        note: 'Discovers a path by browsing, ready to paste into a query tool.',
      },
    ],
  },

  'jwt-token-inspector': {
    description: `Confirming a token behaves correctly as it approaches its expiration timestamp is one kind of testing, but the more common everyday need is simpler, just seeing what's actually inside a specific token already in hand, which algorithm signed it, what claims the payload actually contains, whether an expected field is present at all, without setting up any time-based test scenario. This tool decodes a JWT and displays its header, payload, expiration, and signature information directly, focused on inspecting a token's current contents rather than testing how it behaves over a validity window. Useful for checking exactly what claims a token pulled from local storage or a request header actually contains, confirming which signing algorithm, HS256 or RS256, a specific token was issued with, or decoding a token to see why an expected payload field seems to be missing.`,
    examples: [
      {
        title: "Check a token's claims pulled from local storage",
        code: `Input: eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0In0.abc123\nOutput: header: {alg: HS256}, payload: {sub: "1234"}`,
        note: "Shows exactly what's inside a token already in hand.",
      },
      {
        title: 'Confirm which signing algorithm was used',
        code: `Input: [token issued by an auth service]\nOutput: alg: RS256, exp: 2026-08-01T12:00:00Z`,
        note: 'Surfaces the algorithm without any time-based test setup.',
      },
    ],
  },

  'keyword-generator-express': {
    description: `A single seed term rarely represents everything worth targeting around a topic, the actual related searches people run span variations, questions, and comparisons that don't show up just by staring at one phrase, which is why expanding one term into a broader set of tagged suggestions matters more for content planning than confirming how one specific keyword alone is already performing. This tool generates keyword suggestions from any seed term, tagged with search intent and volume hints, built around expanding one starting idea outward rather than analyzing a keyword that's already been chosen. Useful for expanding a single topic idea into a set of related keywords worth targeting before writing anything, checking which suggestions carry commercial versus informational intent before picking a content angle, or scanning volume hints across a batch of generated suggestions to prioritize which one to write about first.`,
    examples: [
      {
        title: 'Expand one seed term into related keywords',
        code: `Input: "meal prep containers"\nOutput: "best meal prep containers 2026" (informational), "buy meal prep containers" (commercial)`,
        note: 'Broadens one phrase into multiple tagged suggestions.',
      },
      {
        title: 'Prioritize suggestions by volume hint',
        code: `Input: "email marketing"\nOutput: "email marketing tools" (high volume), "email marketing for nonprofits" (low volume)`,
        note: 'Surfaces which generated idea is worth writing about first.',
      },
    ],
  },

  'ldap-filter-generator': {
    description: `LDAP filter syntax puts the operator before its arguments and nests everything in parentheses, something like (&(objectClass=user)(mail=*@example.com)) rather than a more familiar infix style, an unusual enough structure that a missing or misplaced parenthesis is easy to introduce by hand and often only surfaces as an unhelpful error once the malformed filter actually reaches a directory server. This tool builds and tests LDAP search filters through a visual query builder with syntax validation, catching a mismatched parenthesis or a malformed operator before the filter ever gets sent anywhere. Useful for building a filter with nested AND and OR conditions without hand-tracking parenthesis placement, validating a filter's syntax before sending it to a directory server that would otherwise reject it with a vague error, or constructing a filter visually for someone unfamiliar with LDAP's prefix-notation syntax.`,
    examples: [
      {
        title: 'Build a nested AND/OR filter visually',
        code: `Selected: objectClass=user AND (department=Sales OR department=Support)\nOutput: (&(objectClass=user)(|(department=Sales)(department=Support)))`,
        note: 'Handles parenthesis nesting without manual tracking.',
      },
      {
        title: 'Catch a malformed filter before it reaches a server',
        code: `Input: (&(objectClass=user)(mail=*@example.com)\nOutput: error - unmatched opening parenthesis`,
        note: 'Flags a syntax mistake before an unhelpful server-side rejection.',
      },
    ],
  },
};

export default FIX_BATCH_102;
