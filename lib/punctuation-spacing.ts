/** Removes the space before . ! ? , : ; after a letter, closing quote or closing bracket, and collapses runs of spaces and tabs; line breaks are kept. */
export function fixSpacing(text: string): string {
  return text
    .replace(/([\p{L}\u201D\u2019\)\]])[ \t]+([.!?,:;])/gu, '$1$2')
    .replace(/[ \t]+/g, ' ')
    .replace(/^ | $/gm, '')
    .trim();
}
