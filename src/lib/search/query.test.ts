import { describe, expect, it } from "vitest";
import { normalizeSearchQuery, isEligibleSearchQuery } from "./query";
describe("search query contract", () => {
  it("collapses whitespace and preserves case", () => expect(normalizeSearchQuery("  Green\n  tea ")).toBe("Green tea"));
  it("caps Unicode without breaking a surrogate", () => expect([...normalizeSearchQuery("🍵".repeat(121))]).toHaveLength(120));
  it("uses code points for eligibility", () => { expect(isEligibleSearchQuery("🍵")).toBe(false); expect(isEligibleSearchQuery("茶葉")).toBe(true); });
});
