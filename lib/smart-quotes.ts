// A quote opens a quotation after the start of the text, whitespace, an opening bracket or a dash;
// anywhere else it closes (or, for ', is an apostrophe).
const OPENS_AFTER = /[\s([{–—]/;

export function toSmartQuotes(text: string): string {
  return text.replace(/["']/g, (quote, i: number, s: string) => {
    const prev = i === 0 ? '' : s[i - 1];
    const opens = prev === '' || OPENS_AFTER.test(prev);
    if (quote === '"') return opens ? '“' : '”';
    // Elided decades such as '90s take an apostrophe, not an opening quote.
    if (opens && !/^'\d\d(s|\b)/.test(s.slice(i, i + 5)) && /\S/.test(s[i + 1] ?? '')) return '‘';
    return '’';
  });
}

export function toStraightQuotes(text: string): string {
  return text.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
}
