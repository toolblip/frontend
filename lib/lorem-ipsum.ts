export type LoremUnit = 'words' | 'sentences' | 'paragraphs';

const SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.',
  'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit.',
  'Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.',
  'Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur.',
];

const WORDS = SENTENCES.join(' ')
  .replace(/[.,]/g, '')
  .split(/\s+/)
  .filter(Boolean);

function clampCount(count: number): number {
  return Math.min(100, Math.max(1, Number.isFinite(count) ? Math.floor(count) : 1));
}

export function generateLorem(
  count: number,
  unit: LoremUnit,
  startLorem: boolean,
  cycleOffset = 0,
): string {
  const n = clampCount(count);
  const wordStart = (startLorem ? 0 : 8) + cycleOffset * n;
  const sentenceStart = (startLorem ? 0 : 1) + cycleOffset * n;

  if (unit === 'words') {
    return Array.from({ length: n }, (_, i) => WORDS[(wordStart + i) % WORDS.length]).join(' ');
  }

  if (unit === 'sentences') {
    return Array.from(
      { length: n },
      (_, i) => SENTENCES[(sentenceStart + i) % SENTENCES.length],
    ).join(' ');
  }

  return Array.from({ length: n }, (_, paragraph) =>
    Array.from(
      { length: 3 },
      (_, sentence) => SENTENCES[(sentenceStart + paragraph * 3 + sentence) % SENTENCES.length],
    ).join(' '),
  ).join('\n\n');
}
