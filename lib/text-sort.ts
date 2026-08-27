export type SortMode =
  | 'az'
  | 'za'
  | 'length-asc'
  | 'length-desc'
  | 'reverse'
  | 'random'
  | 'unique'
  | 'numeric';

export const TEXT_SORTER_EXAMPLE = `apple
Banana
cherry
Apple
10
2`;

function compareText(a: string, b: string, caseSensitive: boolean, numeric = false): number {
  return a.localeCompare(b, undefined, {
    numeric,
    sensitivity: caseSensitive ? 'variant' : 'base',
  });
}

export function sortLines(text: string, mode: SortMode, caseSensitive: boolean): string[] {
  const lines = text.split('\n').filter((line) => line.trim());
  switch (mode) {
    case 'az':
      return [...lines].sort((a, b) => compareText(a, b, caseSensitive));
    case 'za':
      return [...lines].sort((a, b) => compareText(b, a, caseSensitive));
    case 'length-asc':
      return [...lines].sort((a, b) => a.length - b.length);
    case 'length-desc':
      return [...lines].sort((a, b) => b.length - a.length);
    case 'reverse':
      return [...lines].reverse();
    case 'random': {
      const shuffled = [...lines];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    }
    case 'unique':
      return caseSensitive
        ? [...new Set(lines)]
        : [...new Set(lines.map((line) => line.toLowerCase()))].map(
            (key) => lines.find((line) => line.toLowerCase() === key) ?? key,
          );
    case 'numeric':
      return [...lines].sort((a, b) => compareText(a, b, caseSensitive, true));
    default:
      return lines;
  }
}

export function formatSortedLines(text: string, mode: SortMode, caseSensitive: boolean): string {
  return sortLines(text, mode, caseSensitive).join('\n');
}
