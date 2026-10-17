// Same-origin path only: browsers turn "\" into "/" and strip tabs/newlines, so "/\evil.com" or "/\t/evil.com" become "//evil.com".
export function isSafeNext(value: string | null | undefined): value is string {
  return typeof value === "string" && /^\/(?![/\\])[^\\\x00-\x1f\x7f]*$/.test(value);
}
