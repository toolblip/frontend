/** Heuristic English syllable counter (Flesch-style). Shared across readability tools. */
export function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!word) return 0;
  if (word.length <= 3) return 1;

  word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '');
  word = word.replace(/^y/, '');

  const matches = word.match(/[aeiouy]{1,2}/g);
  return matches ? matches.length : 1;
}

export function countSyllablesInText(text: string): number {
  return text
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .reduce((sum, word) => sum + countSyllables(word), 0);
}

export function countPolysyllables(text: string): number {
  return text
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .filter((word) => countSyllables(word) >= 3).length;
}

export function getReadingEaseLabel(score: number): string {
  if (score >= 90) return 'Very Easy';
  if (score >= 80) return 'Easy';
  if (score >= 70) return 'Fairly Easy';
  if (score >= 60) return 'Standard';
  if (score >= 50) return 'Fairly Difficult';
  if (score >= 30) return 'Difficult';
  return 'Very Difficult';
}

export function getGradeLevelLabel(grade: number): string {
  if (grade <= 5) return 'Elementary';
  if (grade <= 8) return 'Middle School';
  if (grade <= 12) return 'High School';
  if (grade <= 16) return 'College';
  return 'Graduate';
}
