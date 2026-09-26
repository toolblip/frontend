import { boundedText } from '@/lib/developer-general/network';

export type DictionaryEntry = {
  word: string;
  phonetics: string[];
  meanings: {
    partOfSpeech: string;
    definitions: { definition: string; example?: string }[];
    synonyms: string[];
    antonyms: string[];
  }[];
};
export type DictionaryResult = { entries: DictionaryEntry[]; sourceUrl: string };
export const DICTIONARY_PROVIDER = 'https://freedictionaryapi.com';
export const DICTIONARY_LICENSE = 'https://creativecommons.org/licenses/by-sa/4.0/';

function invalid(): never { throw new Error('Invalid dictionary response'); }
function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return invalid();
  return value as Record<string, unknown>;
}
function text(value: unknown, limit = 16384): string {
  if (typeof value !== 'string' || value.length > limit) return invalid();
  return value;
}
function list(value: unknown, limit = 512): unknown[] {
  if (!Array.isArray(value) || value.length > limit) return invalid();
  return value;
}
function words(value: unknown): string[] { return list(value).map(item => text(item, 1024)); }

/** Consumes the provider's Wiktionary shape, bounded before rendering any fields.
 * https://freedictionaryapi.com/api/v1/openapi.json
 */
export function parseDictionary(value: unknown): DictionaryResult {
  const data = object(value), word = text(data.word, 1000), rawEntries = list(data.entries, 64);
  if (!word.trim()) return invalid();
  const source = object(data.source), license = object(source.license);
  let sourceUrl: URL;
  try { sourceUrl = new URL(text(source.url, 4096)); } catch { return invalid(); }
  if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'en.wiktionary.org' || sourceUrl.port || sourceUrl.username || sourceUrl.password ||
      (rawEntries.length > 0 && !sourceUrl.pathname.startsWith('/wiki/'))) return invalid();
  if (license.name !== 'CC BY-SA 4.0' || license.url !== DICTIONARY_LICENSE) return invalid();
  let senseCount = 0;
  const entries = rawEntries.map(raw => {
    const entry = object(raw);
    if (object(entry.language).code !== 'en') return invalid();
    const partOfSpeech = text(entry.partOfSpeech, 100);
    if (!partOfSpeech.trim()) return invalid();
    const phonetics = list(entry.pronunciations).flatMap(rawPronunciation => {
      const pronunciation = object(rawPronunciation), type = text(pronunciation.type, 32), value = text(pronunciation.text, 1024);
      return type === 'ipa' && value ? [value] : [];
    });
    const synonyms = words(entry.synonyms), antonyms = words(entry.antonyms);
    const definitions: DictionaryEntry['meanings'][number]['definitions'] = [];
    const visit = (rawSenses: unknown, depth: number) => {
      if (depth > 8) return invalid();
      for (const rawSense of list(rawSenses)) {
        if (++senseCount > 4096) return invalid();
        const sense = object(rawSense), definition = text(sense.definition), examples = words(sense.examples);
        if (definition.trim()) definitions.push({ definition, ...(examples[0] ? { example: examples[0] } : {}) });
        synonyms.push(...words(sense.synonyms)); antonyms.push(...words(sense.antonyms));
        const children = list(sense.subsenses);
        if (children.length) visit(children, depth + 1);
      }
    };
    visit(entry.senses, 0);
    if (!definitions.length) return invalid();
    return { word, phonetics: [...new Set(phonetics)], meanings: [{ partOfSpeech, definitions, synonyms: [...new Set(synonyms)], antonyms: [...new Set(antonyms)] }] };
  });
  return { entries, sourceUrl: sourceUrl.href };
}

export async function fetchDictionary(word: string, signal: AbortSignal): Promise<DictionaryResult | null> {
  signal.throwIfAborted();
  const response = await fetch(`${DICTIONARY_PROVIDER}/api/v1/entries/en/${encodeURIComponent(word)}`, { signal });
  signal.throwIfAborted();
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Dictionary lookup failed');
  const result = parseDictionary(JSON.parse(await boundedText(response, signal)));
  signal.throwIfAborted();
  return result.entries.length ? result : null;
}
