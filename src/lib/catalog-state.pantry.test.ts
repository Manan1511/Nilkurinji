import { describe, expect, it } from "vitest";
import { filterTeaProducts, matchesCategory } from "./catalog-state";

describe("tea-only catalog scope", () => {
  it("does not let an old pantry filter turn non-tea categories back on", () => {
    expect(matchesCategory(["rice"], "pantry")).toBe(false);
    expect(matchesCategory(["rice"], "rice")).toBe(false);
    expect(matchesCategory(["rice"], "tea")).toBe(false);
    expect(matchesCategory([], "all")).toBe(true);
  });

  it("keeps only products assigned to the tea or tea-bag collection", () => {
    const products = [
      { handle: "loose-tea", collectionHandles: ["tea"] },
      { handle: "tea-bags", collectionHandles: ["tea-bags"] },
      { handle: "rice", collectionHandles: ["rice"] },
      { handle: "unassigned", collectionHandles: [] },
    ];

    expect(filterTeaProducts(products).map(({ handle }) => handle)).toEqual(["loose-tea", "tea-bags"]);
  });

});
