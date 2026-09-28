import { afterEach, describe, expect, it, vi } from 'vitest';
import sample from './fixtures/dictionary-eloquent.json';
import { fetchDictionary, parseDictionary } from './dictionary';

const response = () => structuredClone(sample);
afterEach(() => vi.unstubAllGlobals());

describe('FreeDictionaryAPI adapter', () => {
  it('preserves the real English definitions, IPA, examples and sense-level synonyms', () => {
    const result = parseDictionary(response());
    expect(result.sourceUrl).toBe('https://en.wiktionary.org/wiki/eloquent');
    expect(result.entries[0].word).toBe('eloquent');
    expect(result.entries[0].phonetics).toEqual(['/ˈɛl.əˌkwənt/']);
    const meaning = result.entries[0].meanings[0];
    expect(meaning.partOfSpeech).toBe('adjective');
    expect(meaning.definitions[0]).toEqual({ definition: 'Fluently persuasive and articulate.', example: 'an eloquent writer' });
    expect(meaning.synonyms).toEqual(['articulate', 'well-spoken']);
    expect(result.entries[0]).not.toHaveProperty('audio');
  });

  it('accepts a valid empty lookup', () => {
    const data = response(); data.entries = []; data.source.url = 'https://en.wiktionary.org';
    expect(parseDictionary(data).entries).toEqual([]);
  });

  it.each([null, [], {}, {word:'word', entries:[null]}])('rejects malformed response %j', data => {
    expect(() => parseDictionary(data)).toThrow('Invalid dictionary response');
  });

  it.each(['javascript:alert(1)', 'https://evil.example/wiki/eloquent', 'https://en.wiktionary.org.evil.example/wiki/eloquent', 'https://user@en.wiktionary.org/wiki/eloquent'])('rejects untrusted attribution URL %s', url => {
    const data = response(); data.source.url = url;
    expect(() => parseDictionary(data)).toThrow('Invalid dictionary response');
  });

  it('validates nested values and the advertised license', () => {
    const data = response(); data.entries[0].senses[0].synonyms = [42 as unknown as string];
    expect(() => parseDictionary(data)).toThrow();
    const license = response(); license.source.license.url = 'javascript:alert(1)';
    expect(() => parseDictionary(license)).toThrow();
  });

  it('includes bounded subsenses and their synonyms without inventing audio', () => {
    const data = response();
    const child = structuredClone(data.entries[0].senses[1]); child.synonyms = ['expressive'];
    data.entries[0].senses[0].subsenses = [child as never];
    expect(parseDictionary(data).entries[0].meanings[0].synonyms).toContain('expressive');
    expect(parseDictionary(data).entries[0].meanings[0].definitions[1].definition).toBe(child.definition);
  });

  it('rejects excessive collections and recursion', () => {
    const many = response(); many.entries = Array(65).fill(many.entries[0]);
    expect(() => parseDictionary(many)).toThrow();
    const deep = response(); let parent = deep.entries[0].senses[0];
    for (let i = 0; i < 10; i++) { const child = structuredClone(deep.entries[0].senses[1]); parent.subsenses = [child as never]; parent = child; }
    expect(() => parseDictionary(deep)).toThrow();
  });

  it('uses only the replacement endpoint and handles 404 and empty results', async () => {
    const fetch = vi.fn().mockResolvedValueOnce(new Response(JSON.stringify(response()))).mockResolvedValueOnce(new Response('', {status:404})).mockResolvedValueOnce(new Response(JSON.stringify({...response(), entries:[]})));
    vi.stubGlobal('fetch', fetch);
    expect((await fetchDictionary('eloquent', new AbortController().signal))?.entries[0].word).toBe('eloquent');
    expect(fetch.mock.calls[0][0]).toBe('https://freedictionaryapi.com/api/v1/entries/en/eloquent');
    expect(await fetchDictionary('unknown', new AbortController().signal)).toBeNull();
    expect(await fetchDictionary('unknown', new AbortController().signal)).toBeNull();
  });

  it('rejects invalid JSON and bodies above the byte limit', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(new Response('not JSON')).mockResolvedValueOnce(new Response('x'.repeat(1_000_001))));
    await expect(fetchDictionary('word', new AbortController().signal)).rejects.toThrow();
    await expect(fetchDictionary('word', new AbortController().signal)).rejects.toThrow(/limit/);
  });

  it('rejects a stale deferred response even when the transport ignores abort', async () => {
    let resolve!: (response: Response) => void;
    vi.stubGlobal('fetch', vi.fn(() => new Promise<Response>(done => { resolve = done; })));
    const controller = new AbortController();
    const lookup = fetchDictionary('eloquent', controller.signal);
    controller.abort();
    resolve(new Response(JSON.stringify(response())));
    await expect(lookup).rejects.toThrow();
  });
});
