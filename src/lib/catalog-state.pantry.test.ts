import { describe, expect, it } from "vitest";
import { filterTeaProducts, matchesCategory } from "./catalog-state";

describe("food collection filtering", () => {
  it("matches a supported food category and rejects legacy or unknown values", () => {
    expect(matchesCategory(["rice"], "pantry")).toBe(false);
    expect(matchesCategory(["rice"], "rice")).toBe(true);
    expect(matchesCategory(["rice"], "tea")).toBe(false);
    expect(matchesCategory([], "all")).toBe(true);
  });

  it("keeps the tea subset available for the homepage tea section", () => {
    const products = [
      { handle: "loose-tea", collectionHandles: ["tea"] },
      { handle: "tea-bags", collectionHandles: ["tea-bags"] },
      { handle: "rice", collectionHandles: ["rice"] },
      { handle: "unassigned", collectionHandles: [] },
    ];

    expect(filterTeaProducts(products).map(({ handle }) => handle)).toEqual(["loose-tea", "tea-bags"]);
  });

});
