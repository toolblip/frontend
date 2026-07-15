#!/usr/bin/env node
// One-time script: consolidate data/tools.ts entries that share the same `name`
// (case-insensitive) into a single canonical entry, and register redirects for
// the removed slugs in TOOL_SLUG_ALIASES. Safe to delete after running.
import ts from 'typescript';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE_PATH = path.join(__dirname, '..', 'data', 'tools.ts');

function quote(str) {
  return `'${String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function main() {
  const source = fs.readFileSync(FILE_PATH, 'utf8');
  const sf = ts.createSourceFile(FILE_PATH, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

  let toolsArrayNode = null;
  let aliasesObjectNode = null;

  sf.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    for (const decl of node.declarationList.declarations) {
      const name = decl.name.getText(sf);
      if (name === 'tools' && decl.initializer && ts.isArrayLiteralExpression(decl.initializer)) {
        toolsArrayNode = decl.initializer;
      }
      if (name === 'TOOL_SLUG_ALIASES' && decl.initializer && ts.isObjectLiteralExpression(decl.initializer)) {
        aliasesObjectNode = decl.initializer;
      }
    }
  });

  if (!toolsArrayNode || !aliasesObjectNode) {
    console.error('Could not locate `tools` array or `TOOL_SLUG_ALIASES` object in data/tools.ts');
    process.exit(1);
  }

  // ---- Parse existing aliases ----
  const existingAliases = new Map();
  for (const prop of aliasesObjectNode.properties) {
    if (!ts.isPropertyAssignment(prop)) continue;
    const key = ts.isStringLiteral(prop.name) ? prop.name.text : prop.name.getText(sf).replace(/^['"]|['"]$/g, '');
    const value = ts.isStringLiteral(prop.initializer) ? prop.initializer.text : undefined;
    if (value !== undefined) existingAliases.set(key, value);
  }

  // ---- Parse tool entries ----
  const entries = [];
  for (const el of toolsArrayNode.elements) {
    if (!ts.isObjectLiteralExpression(el)) {
      console.warn('WARNING: skipping non-object array element:', el.getText(sf).slice(0, 60));
      continue;
    }
    const entry = {};
    for (const prop of el.properties) {
      if (!ts.isPropertyAssignment(prop)) continue;
      const key = prop.name.getText(sf);
      if (['name', 'slug', 'description', 'emoji', 'category'].includes(key)) {
        entry[key] = ts.isStringLiteral(prop.initializer) ? prop.initializer.text : prop.initializer.getText(sf);
      } else if (key === 'tags' && ts.isArrayLiteralExpression(prop.initializer)) {
        entry.tags = prop.initializer.elements
          .filter((e) => ts.isStringLiteral(e))
          .map((e) => e.text);
      }
    }
    entries.push(entry);
  }

  const originalCount = entries.length;

  // ---- Group by case-insensitive name ----
  const groups = new Map();
  entries.forEach((entry, index) => {
    const key = (entry.name || '').trim().toLowerCase();
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ entry, index });
  });

  function completeness(entry) {
    return (
      (entry.description || '').length +
      (entry.tags ? entry.tags.length * 20 : 0) +
      (entry.emoji ? 1 : 0) +
      (entry.category ? 1 : 0)
    );
  }

  const removedSlugs = new Set();
  const newAliasEntries = new Map(); // removedSlug -> canonicalSlug
  const consolidations = [];

  function pickCanonical(group) {
    // Prefer whatever slug pre-existing aliases already treat as canonical
    // within this group, so we don't flip a decision an earlier pass made
    // (which could contradict live redirects/GSC canonical records) just
    // because a duplicate's boilerplate description happens to be longer.
    const votes = new Map();
    for (const { entry } of group) {
      const target = existingAliases.get(entry.slug);
      if (target && group.some((g) => g.entry.slug === target)) {
        votes.set(target, (votes.get(target) || 0) + 1);
      }
    }
    if (votes.size > 0) {
      let bestSlug = null;
      let bestVotes = -1;
      for (const [slug, count] of votes) {
        if (count > bestVotes) {
          bestVotes = count;
          bestSlug = slug;
        }
      }
      const consensusCanonical = group.find((g) => g.entry.slug === bestSlug);
      if (consensusCanonical) return consensusCanonical;
    }

    // Fallback: most complete data, tie-broken by original array order.
    let canonical = group[0];
    for (const candidate of group.slice(1)) {
      if (completeness(candidate.entry) > completeness(canonical.entry)) {
        canonical = candidate;
      }
    }
    return canonical;
  }

  for (const [name, group] of groups) {
    if (group.length < 2) continue;

    const canonical = pickCanonical(group);
    const others = group.filter((g) => g !== canonical);
    for (const other of others) {
      removedSlugs.add(other.entry.slug);
      newAliasEntries.set(other.entry.slug, canonical.entry.slug);
    }

    consolidations.push({
      name: canonical.entry.name,
      canonicalSlug: canonical.entry.slug,
      removedSlugs: others.map((o) => o.entry.slug),
    });
  }

  // ---- Surviving entries (preserve original order) ----
  const survivingEntries = entries.filter((e) => !removedSlugs.has(e.slug));
  const survivingSlugSet = new Set(survivingEntries.map((e) => e.slug));

  // ---- Merge alias maps: fresh consolidation decisions win over stale ones ----
  const mergedAliases = new Map(existingAliases);
  for (const [slug, canonicalSlug] of newAliasEntries) {
    mergedAliases.set(slug, canonicalSlug);
  }

  // ---- Collapse alias chains (redirects resolve in a single lookup) ----
  function resolve(key) {
    let current = key;
    const seen = new Set();
    while (mergedAliases.has(current) && !survivingSlugSet.has(current)) {
      if (seen.has(current)) {
        throw new Error(`Cycle detected resolving alias chain starting at "${key}"`);
      }
      seen.add(current);
      current = mergedAliases.get(current);
    }
    return current;
  }

  const resolvedAliases = new Map();
  for (const key of mergedAliases.keys()) {
    resolvedAliases.set(key, resolve(key));
  }

  // ---- Validate ----
  const errors = [];
  for (const [key, target] of resolvedAliases) {
    if (!survivingSlugSet.has(target)) {
      errors.push(`Alias "${key}" -> "${target}" does not resolve to a surviving tool slug.`);
    }
    if (survivingSlugSet.has(key)) {
      errors.push(`Alias key "${key}" collides with a surviving tool slug (would shadow a real page).`);
    }
  }
  if (errors.length) {
    console.error('Validation failed, aborting without writing changes:');
    for (const e of errors) console.error('  - ' + e);
    process.exit(1);
  }

  // ---- Serialize ----
  const sortedAliasKeys = [...resolvedAliases.keys()].sort((a, b) => a.localeCompare(b));
  const aliasLines = sortedAliasKeys
    .map((key) => `  ${quote(key)}: ${quote(resolvedAliases.get(key))},`)
    .join('\n');
  const newAliasesText = `{\n${aliasLines}\n}`;

  const toolLines = survivingEntries
    .map((entry) => {
      const parts = [
        `name: ${quote(entry.name)}`,
        `slug: ${quote(entry.slug)}`,
        `description: ${quote(entry.description)}`,
        `emoji: ${quote(entry.emoji)}`,
        `category: ${quote(entry.category)}`,
      ];
      if (entry.tags && entry.tags.length) {
        parts.push(`tags: [${entry.tags.map(quote).join(', ')}]`);
      }
      return `  { ${parts.join(', ')} },`;
    })
    .join('\n');
  const newToolsArrayText = `[\n${toolLines}\n]`;

  const aliasStart = aliasesObjectNode.getStart(sf);
  const aliasEnd = aliasesObjectNode.getEnd();
  const toolsStart = toolsArrayNode.getStart(sf);
  const toolsEnd = toolsArrayNode.getEnd();

  const newSource =
    source.slice(0, aliasStart) +
    newAliasesText +
    source.slice(aliasEnd, toolsStart) +
    newToolsArrayText +
    source.slice(toolsEnd);

  fs.writeFileSync(FILE_PATH, newSource, 'utf8');

  // ---- Report ----
  consolidations.sort((a, b) => b.removedSlugs.length - a.removedSlugs.length);
  console.log('='.repeat(70));
  console.log('DUPLICATE TOOL CONSOLIDATION REPORT');
  console.log('='.repeat(70));
  console.log(`Original tool entries:     ${originalCount}`);
  console.log(`Duplicate-name groups:     ${consolidations.length}`);
  console.log(`Entries removed:           ${removedSlugs.size}`);
  console.log(`Remaining tool entries:    ${survivingEntries.length}`);
  console.log(`New alias entries added:   ${newAliasEntries.size}`);
  console.log(`Total alias map size:      ${resolvedAliases.size} (was ${existingAliases.size})`);
  console.log('');
  console.log('Top consolidations by number of duplicates removed:');
  for (const c of consolidations.slice(0, 20)) {
    console.log(`  - "${c.name}" -> canonical "${c.canonicalSlug}" (removed ${c.removedSlugs.length}: ${c.removedSlugs.slice(0, 5).join(', ')}${c.removedSlugs.length > 5 ? ', ...' : ''})`);
  }
  console.log('');
  console.log(`... and ${Math.max(0, consolidations.length - 20)} more consolidations.`);
  console.log('='.repeat(70));
}

main();
