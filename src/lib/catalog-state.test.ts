import { describe, expect, it } from "vitest";
import { parseCatalogQuery, writeCatalogQuery } from "./catalog-state";
const config = { categories: ["tea"], productTypes: ["Tea"], priceBands: ["under-500"], facets: [{ id: "type", values: ["green"] }] };
describe("catalog URL state", () => {
  it("validates sort, facet values and duplicate parameters", () => {
    const state = parseCatalogQuery(new URLSearchParams("sort=bad&category=wrong&facet.type=green&facet.type=green&facet.type=unknown"), config);
    expect(state.sort).toBe("featured"); expect(state.category).toBe("all"); expect(state.selectedFacets).toEqual({ type: ["green"] });
  });
  it("preserves attribution/query while omitting default keys", () => {
    const params = writeCatalogQuery(new URLSearchParams("q=tea&utm_source=mail&sort=old&facet.unknown=x"), { sort: "featured", category: "all", productType: "all", priceBand: "all", selectedFacets: {} });
    expect(params.toString()).toBe("q=tea&utm_source=mail");
  });
  it("roundtrips configured state and retains zero-price filters", () => {
    const state = { sort: "price-asc" as const, category: "tea", productType: "Tea", priceBand: "under-500", selectedFacets: { type: ["green"] } };
    expect(parseCatalogQuery(writeCatalogQuery(new URLSearchParams(), state), config)).toEqual(state);
  });
});
