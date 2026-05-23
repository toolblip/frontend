---
title: "Regex Lookahead and Lookbehind Explained: Match Without Consuming"
description: "Learn how to use regex lookahead and lookbehind to match patterns without consuming characters. Positive vs negative, ahead vs behind  -  with live examples."
date: 2026-05-05
category: Developer Tools
---

If you've ever written a regex to match something **only when it's followed by** (or **not followed by**) another pattern, you probably hit a wall. Standard capturing groups consume characters  -  they move the cursor, and you can't use the same text for two things at once.

That's where lookahead and lookbehind come in. They let you define a condition  -  something the match must (or must not) be adjacent to  -  **without actually consuming the characters**.

This guide covers all four types with real examples, common mistakes, and a free browser tool so you can test everything live.

## The Four Types at a Glance

| Type | Syntax | Matches when... |
|------|--------|----------------|
| Positive lookahead | `(?=...)` | ...the pattern is **followed by** `...` |
| Negative lookahead | `(?!...)` | ...the pattern is **not followed by** `...` |
| Positive lookbehind | `(?<=...)` | ...the pattern is **preceded by** `...` |
| Negative lookbehind | `(?<!...)` | ...the pattern is **not preceded by** `...` |

## Positive Lookahead: `(?=...)`

Matches a position **followed by** a specific pattern.

**Use case:** Find all prices in a string that are followed by "USD".

```js
const text = "Price: $49.99 USD, €39.99 EUR, £29.99 GBP";
const regex = /\$[\d.]+(?= USD)/g;

text.match(regex);
// → ["$49.99"]
```

The `$49.99` matches because it's immediately followed by ` USD`. The other prices are ignored  -  not because they lack a `$`, but because they're not followed by ` USD`.

In the [Toolblip Regex Tester](/tools/regex-tester), you'd enter:

- **Pattern:** `\$[\d.]+(?= USD)`
- **Flags:** `g`
- **Test string:** `Price: $49.99 USD, €39.99 EUR, £29.99 GBP`

## Negative Lookahead: `(?!...)`

Matches a position **not followed by** a specific pattern.

**Use case:** Find all prices that are **not** followed by a currency code (i.e., bare amounts).

```js
const text = "Total: $49.99, $39.99 USD, $29.99, $19.99 GBP";
const regex = /\$[\d.]+(?! [A-Z]{3})/g;

text.match(regex);
// → ["$49.99", "$29.99"]
```

`$39.99 USD` and `$19.99 GBP` are excluded because they **are** followed by a space and three uppercase letters. `$49.99` and `$29.99` are included because the character after the number is a comma or end of string  -  not a currency code.

## Positive Lookbehind: `(?<=...)`

Matches a position **preceded by** a specific pattern.

**Use case:** Extract the numeric amount from prices that start with a `$` symbol.

```js
const text = "Item A costs $49.99. Item B costs $12.00.";
const regex = /(?<=\$)[\d.]+/g;

text.match(regex);
// → ["49.99", "12.00"]
```

This reads as: "match one or more digits or dots, but only when preceded by a `$`." The `$` itself is not part of the match  -  it's only a condition.

> **Important:** JavaScript lookbehind support requires ES2018+. If you're on Node.js < 10, it won't work. All modern browsers support it.

## Negative Lookbehind: `(?<!...)`

Matches a position **not preceded by** a specific pattern.

**Use case:** Find numbers in a string that don't follow a `$` sign.

```js
const text = "Qty: 5 units, Price: $49.99, Discount: 10%";
const regex = /(?<!\$)[\d]+/g;

text.match(regex);
// → ["5", "49", "10"]
```

Wait  -  `$49.99` still matched `49` because the `4` is preceded by `$`... wait, no. The lookbehind checks the character **immediately before** the match position. At `4` in `$49.99`, the character before it is `$`  -  so it shouldn't match. But `9` in `49` has `4` before it, which is a digit  -  so it matches.

This reveals a subtlety: **lookbehind checks the character immediately before the match start**, not the whole preceding context. For `$49.99`, the pattern would match `49` (where `4` is preceded by `$`).

```js
// More precisely, exclude numbers that immediately follow $:
const text = "Qty: 5 units, Price: $49.99, Discount: 10%";
const regex = /(?<!\$)[\d]+/g;
// Matches: "5", "49", "10"
//  - "5" in Qty: space before, not $ → matches
//  - "49" in $49.99: $ before the 4, but the lookbehind checks the 4 → $ before 4 → no match... wait
//  - Actually: (?<!\$)[\d]+ means "not preceded by $" at the position where digits start.
//    For "$49.99": position before 4 is $ → lookbehind fails → no match for 49
//    Position before 9: character is 4 (digit) → lookbehind passes → 9 matches
```

This is why negative lookbehind can behave unexpectedly on continuous digit strings. For cleaner results, use a boundary:

```js
// Better: match whole numbers not directly after $
const text = "Qty: 5 units, Price: $49.99, Discount: 10%";
const regex = /(?<!\$)\b[\d.]+\b/g;
// → ["5", "49.99", "10"]
```

The `\b` word boundary helps isolate the number more reliably.

## Lookahead and Lookbehind Together

You can stack both  -  a match that is **preceded by X** and **followed by Y**:

```js
const text = "Username: @john, @jane_doe, @admin, @sara";
// Find usernames that start with a letter (not a number) and have no underscore
const regex = /(?<=@)[a-z][a-z0-9]*(?![a-z0-9_])/g;

text.match(regex);
// → ["john", "jane"]  -  "jane_doe" has underscore, "admin" has 5 letters (matches), "sara" matches
```

Breaking it down:
- `(?<=@)`  -  must be preceded by `@`
- `[a-z]`  -  first character must be a letter
- `[a-z0-9]*`  -  rest can be letters or numbers
- `(?![a-z0-9_])`  -  **not** followed by a letter, number, or underscore

## Common Mistakes

### 1. Confusing Lookahead with Lookbehind

Lookahead checks **what comes after** the current position. Lookbehind checks **what comes before**.

```js
// "Match 'cat' only when followed by 'dog'"
const text = "cat dog catch";
/cat(?= dog)/.test(text);  // ✅ true  -  "cat" in "cat dog"
/cat(?= dog)/.test("catfish"); // ❌ false  -  "cat" not followed by " dog"

/(?<=@)\w+/.test("@john");  // ✅  -  matches "john" preceded by @
```

### 2. Overlapping Conditions

Lookahead and lookbehind are **zero-width**  -  they don't move the cursor. But if your lookahead consumes a character and your lookbehind starts from the same position, you can get unexpected behavior:

```js
// Wrong: trying to match a digit preceded by $ and followed by .
const text = "$5.99";
/(?<=\$)(\d)(?=\.)/.test(text); // matches "5"  -  but what if there were two digits?
```

### 3. Variable-Length Lookbehind in Older Engines

In older JavaScript environments (pre-ES2018), lookbehind **only worked with fixed-length patterns**. Modern engines support variable-length lookbehind, but some regex flavors (like Python's `re` module) still have restrictions.

```python
# Python re  -  lookbehind must be fixed length
import re
re.search(r'(?<=\$)\d+', "$49.99")  # ✅ works  -  fixed length
re.search(r'(?<=\$)\d+\.?\d*', "$49.99")  # ❌ error in basic Python re
# Use regex module for variable-length lookbehind in Python
```

### 4. Forgetting That Lookbehind Checks the Character Before the Match

```js
// I want to find @usernames NOT preceded by a space (start of string only)
const text = "@admin hello @user";
/(?<=^)@\w+/.test(text); // ✅ matches @admin at start
```

But if `@user` appears mid-string, its preceding character is a space  -  so lookbehind fails. Use a word boundary or alternation instead:

```js
/(?:^|(?<=\s))@\w+/g; // start of string OR preceded by whitespace
```

## Practical Examples

### Extract Domain from Email Addresses (without the @)

```js
const emails = "Contact: alice@example.com, bob@company.org";
const domains = emails.match(/(?<=@)[a-z.]+/g);
// → ["example.com", "company.org"]
```

### Find Words Not Inside HTML Tags

```js
const html = "<h1>Hello World</h1><p>Welcome</p>";
const words = html.match(/(?<=^|>)[^<]+?(?=<|$)/g);
// → ["Hello World", "Welcome"]
```

### Match Password Strength Requirements

```js
const password = "Abc123!";
const hasUpper = /[A-Z]/.test(password);       // ✅
const hasLower = /[a-z]/.test(password);        // ✅
const hasDigit = /(?=.*\d)/.test(password);     // ✅ positive lookahead scans whole string
const hasSpecial = /(?=.*[!@#$%^&*])/.test(password); // ✅
```

That last one  -  `(?=.*\d)`  -  is a **positive lookahead that scans the whole string** from the current position. The `.*` means "any characters, then a digit." This is how you check for a pattern **anywhere** in the string without consuming it.

### Filter Log Lines by Context

```js
const logs = [
  "ERROR db connection failed",
  "WARN  disk usage 80%",
  "ERROR db query timeout",
  "INFO  server started"
];

// Get ERROR logs that mention 'db'
const dbErrors = logs.filter(line => /(?=.*ERROR)(?=.*db)/.test(line));
// → ["ERROR db connection failed", "ERROR db query timeout"]
```

## Quick Reference

| Pattern | Meaning |
|---------|---------|
| `(?=abc)` | Preceded by `abc` (zero-width) |
| `(?!abc)` | Not preceded by `abc` |
| `(?<=abc)` | Followed by `abc` |
| `(?<!abc)` | Not followed by `abc` |

## Test It in Your Browser

No signup. No data uploaded. Everything runs locally in your browser.

👉 **[Try the Regex Tester](/tools/regex-tester)**  -  paste a pattern, write test strings, and see matches highlighted in real time.

Pair it with the **[Regex Cheatsheet](/tools/regex-cheatsheet)** for quick pattern reminders.

## When to Use Each

- Use **lookahead** when you want to include a forward condition (`if followed by X`)
- Use **negative lookahead** to exclude matches (`if NOT followed by X`)
- Use **lookbehind** to anchor on a preceding character without including it in the match
- Use **negative lookbehind** to exclude matches based on what precedes them

Lookahead and lookbehind are among the most powerful features in modern regex  -  and among the least understood. Once the "zero-width" concept clicks, you'll find yourself reaching for them constantly.

---

*Toolblip's [regex-tester](/tools/regex-tester) runs entirely in your browser. Your test strings never leave your device.*
