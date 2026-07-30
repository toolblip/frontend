---
title: "How to Generate JSON Schema From Data Automatically"
description: >-
  Learn how to generate JSON Schema from data with type inference, required
  fields, and nullable handling. Try the free online schema generator right now.
slug: 2026-07-30-generate-json-schema-from-data
date: "2026-07-30T00:00:00.000Z"
category: Developer Tools
tags:
  - Generate-a-JSON-Schema-automat
  - SEO
  - Developer Tools
author: Toolblip Team
readingTime: 7 min
featuredImage: https://api.radtx.com/gradient/6b7280-374151/1200/630
---

# How to Generate JSON Schema From Data Automatically

If you want to generate JSON Schema from data, you have an API response in hand and you need a schema to validate against, document, or feed into a code generator. Writing that schema by hand means transcribing every field name, guessing every type, and getting the nesting right, which is tedious for a ten field object and impractical for anything larger.

Inference does the transcription for you. Feed it a sample payload and it returns a draft schema, which you then correct in the places where a single sample cannot tell the whole story.

## What JSON Schema Inference Actually Does

Inference reads a concrete JSON value and works backward to a description of its shape. A string becomes `"type": "string"`, an object becomes a `properties` map, an array becomes an `items` definition.

Take a small API response:

```json
{
  "id": 4821,
  "email": "jane@example.com",
  "verified": true,
  "tags": ["admin", "beta"],
  "profile": { "display_name": "Jane", "avatar_url": null }
}
```

The inferred schema looks like this:

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "type": "object",
  "properties": {
    "id": { "type": "integer" },
    "email": { "type": "string" },
    "verified": { "type": "boolean" },
    "tags": { "type": "array", "items": { "type": "string" } },
    "profile": {
      "type": "object",
      "properties": {
        "display_name": { "type": "string" },
        "avatar_url": { "type": "null" }
      },
      "required": ["display_name", "avatar_url"]
    }
  },
  "required": ["id", "email", "verified", "tags", "profile"]
}
```

Every field name, every type, and the full nesting structure came from the sample. That is the part worth automating.

Notice `avatar_url` though. The sample had `null`, so inference recorded `"type": "null"`, which would reject an actual URL string. One sample cannot distinguish a field that is always null from a field that happens to be null right now.

## How to Generate JSON Schema From Data With Correct Required Fields

The `required` array is where inference makes its biggest assumption. The generator marks any field appearing in your sample as required, because it has no way to know the field is optional.

That assumption is wrong more often than it is right. Optional fields are common in API responses, and a schema that requires all of them will reject valid payloads in production.

Two approaches fix it.

Feeding multiple samples is the reliable one. A json schema required fields generator that accepts an array of examples marks a field required only when it appears in every sample:

```js
// Fields present in every sample are genuinely required
function inferRequired(samples) {
  const keyCounts = new Map();
  for (const sample of samples) {
    for (const key of Object.keys(sample)) {
      keyCounts.set(key, (keyCounts.get(key) || 0) + 1);
    }
  }
  return [...keyCounts.entries()]
    .filter(([, count]) => count === samples.length)
    .map(([key]) => key);
}

inferRequired([
  { id: 1, email: 'a@example.com', nickname: 'ay' },
  { id: 2, email: 'b@example.com' },
]);
// ["id", "email"]  -  nickname correctly treated as optional
```

Adjusting strictness manually is the faster one. Generate with everything required, then remove the fields you know are optional. Practical when you only have one sample to work from.

## Using a JSON Schema Generator From API Response Data

Real API responses introduce cases a clean example never shows.

Nullable fields need a union rather than a bare null type. A field that holds either a string or null should be `"type": ["string", "null"]`, which inference from a single null sample will not produce.

Integers versus numbers matter for validation. A sample value of `10` infers as `integer`, which rejects `10.5`. If the field is a price or a rate, widen it to `number` before shipping the schema.

Empty arrays carry no type information. `"tags": []` gives the generator nothing to infer `items` from, so it produces an untyped array that accepts anything. Supply a sample where the array has at least one element.

Heterogeneous arrays need care too. An array mixing objects and strings infers as whichever type appeared, or as an overly permissive union. Decide deliberately whether the mix is intentional.

String formats get lost entirely. A value like `"2026-07-30T00:00:00Z"` infers as a plain string, when what you probably want is `{ "type": "string", "format": "date-time" }`. Same for email addresses, URIs, and UUIDs. Inference sees characters, not semantics, so adding `format` keywords is manual work worth doing on any field a consumer will parse.

Enums are similar. A `status` field holding `"active"` in your sample infers as an unconstrained string, accepting any text at all. If the field only ever holds a fixed set of values, an explicit `"enum": ["active", "pending", "closed"]` is far more useful than `"type": "string"`.

Before feeding a payload to any generator, pretty-print it so you can actually see its structure. The [JSON Formatter](https://toolblip.com/tools/json-formatter) validates the JSON and catches a malformed response, which saves you from debugging a schema built from broken input.

## Working With a JSON Schema Generator Online

Doing inference by hand for a nested payload means walking every branch and writing out each level, which is exactly the mechanical work worth handing off.

The [JSON Schema Generator](https://toolblip.com/tools/json-schema-generator) infers a schema from sample JSON with adjustable strictness and configurable required fields. Paste the payload, set how strict you want the output, copy the schema.

Everything runs locally. To confirm that rather than take it on faith, open DevTools, switch to the Network tab, clear the request list, then paste your JSON and generate. No request appears.

That matters when the sample response contains internal IDs, customer email addresses, or auth tokens. A client side generator means the payload you are describing never leaves your machine.

## JSON Schema Generator vs Validator

The two tools solve opposite halves of the same problem, and mixing them up wastes time.

A generator takes data and produces a schema. You use it once, at the start, to get a draft description of a payload shape.

A validator takes data plus a schema and reports whether they match. You use it repeatedly, in tests and in CI, to catch payloads that drift from the contract.

The workflow runs generator first, then validator. Generate the draft schema from a sample, correct the nullable and optional fields by hand, then run the [JSON Schema Validator](https://toolblip.com/tools/json-schema-validator) against several real responses to confirm the corrected schema actually accepts them.

That second step catches the inference mistakes. A schema that rejects a valid production payload tells you exactly which assumption was wrong.

Validating against more than one response is the part people skip. Inference from a single sample encodes that sample's quirks as rules, and the only way to surface them is to test the schema against payloads it did not come from. Pull three or four responses that differ meaningfully, including one where an optional field is absent and one where a nullable field is actually null, then validate all of them.

Each failure points at a specific line to fix. A `required` violation means a field was optional. A type violation on a null usually means you need a union. Working through the failures turns a guessed schema into a tested one, and the whole loop takes a couple of minutes.

## Choosing the Best JSON Schema Generator Online

Generators differ in ways that matter once your data stops being a tutorial example.

Multi-sample support is the most useful feature. A generator accepting several examples produces correct `required` arrays without manual editing, which is the single biggest source of wrong inferred schemas.

Strictness control comes next. You want a switch between a permissive schema for early development and a tight one with `additionalProperties: false` for a locked-down contract.

Draft version selection matters for compatibility. Draft 7 and 2020-12 differ enough that your validation library may only accept one, so check which the generator emits.

Nullable handling separates good from mediocre. Test with a payload containing an explicit null and see whether the output is a bare null type or a sensible union.

If you need to reshape a payload before generating, extracting a subset of fields or normalizing key names, the [Regex Tester](https://toolblip.com/tools/regex-tester) lets you build and confirm the pattern against your actual data first.

## Generating JSON Schema From Data Without the Manual Transcription

When you generate JSON Schema from data, inference handles the mechanical work reliably: field names, nesting, and base types all come straight from the sample. The parts it cannot know are the ones worth reviewing.

Getting required fields right takes either multiple samples or manual pruning. A nullable field needs a union type instead of a bare null. Integer fields that could actually hold decimals should widen to number. And an empty array won't infer anything about its items without at least one populated sample.

Review those four cases and an inferred schema goes from a rough draft to something you can validate against.

Paste your next API response into the [JSON Schema Generator](https://toolblip.com/tools/json-schema-generator), set your strictness, and start from a schema instead of a blank file.

