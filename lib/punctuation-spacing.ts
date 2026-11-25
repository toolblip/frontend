/** Removes the space before . ! ? , : ; and collapses runs of spaces and tabs; line breaks are kept. */
export function fixSpacing(text: string): string {
  return text
    .replace(/([a-z])[ \t]+([.!?,:;])/gi, '$1$2')
    .replace(/[ \t]+/g, ' ')
    .replace(/^ | $/gm, '')
    .trim();
}
