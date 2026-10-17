import { describe, expect, it } from "vitest";
import { isSafeNext } from "./safe-next";

describe("isSafeNext", () => {
  it("accepts same-origin paths", () => {
    expect(isSafeNext("/dashboard")).toBe(true);
    expect(isSafeNext("/tools/json?x=1#a")).toBe(true);
  });
  it("rejects external and ambiguous values", () => {
    for (const v of [null, undefined, "", "dashboard", "//evil.com", "/\\evil.com", "/\t/evil.com", "/\n/evil.com", "https://evil.com"]) {
      expect(isSafeNext(v)).toBe(false);
    }
  });
});
