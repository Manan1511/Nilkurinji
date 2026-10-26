import { describe, expect, it } from "vitest";
import { buildCatalogFacetGroups, filterBySelectedFacets, matchesPriceBand } from "@/lib/catalog-facets";

const products = [
  {
    collectionHandles: ["tea"],
    tags: ["type:black-tea", "flavour:malty", "caffeine:caffeinated"],
    variants: [{ availableForSale: true }],
  },
  {
    collectionHandles: ["tea-bags"],
    tags: ["type:green-tea", "flavour:grassy", "caffeine:caffeinated"],
    variants: [{ availableForSale: false }],
  },
  {
    collectionHandles: ["rice"],
    tags: ["flavour:spicy"],
    variants: [{ availableForSale: true }],
  },
];

describe("catalog facets", () => {
  it("builds only the relevant tea filters for tea categories", () => {
    expect(buildCatalogFacetGroups(products, "tea")).toEqual([
      { id: "type", label: "Type", options: [{ label: "Black tea", value: "type:black-tea" }] },
      { id: "flavour", label: "Flavour", options: [{ label: "Malty", value: "flavour:malty" }] },
      { id: "caffeine", label: "Caffeine", options: [{ label: "Caffeinated", value: "caffeine:caffeinated" }] },
      { id: "availability", label: "Availability", options: [{ label: "In stock", value: "in-stock" }] },
    ]);
  });

  it("does not expose tea taxonomy as food filters", () => {
    expect(buildCatalogFacetGroups(products, "rice")).toEqual([
      { id: "availability", label: "Availability", options: [{ label: "In stock", value: "in-stock" }] },
    ]);
  });

  it("combines different facet groups with AND and choices within one group with OR", () => {
    const filtered = filterBySelectedFacets(products, { type: ["type:black-tea", "type:green-tea"], availability: ["in-stock"] });
    expect(filtered).toEqual([products[0]]);
  });

  it("keeps price presets mutually exclusive at the 300 and 500 rupee boundaries", () => {
    expect(matchesPriceBand(299.99, "under-300")).toBe(true);
    expect(matchesPriceBand(300, "under-300")).toBe(false);
    expect(matchesPriceBand(300, "300-499")).toBe(true);
    expect(matchesPriceBand(499.99, "300-499")).toBe(true);
    expect(matchesPriceBand(500, "300-499")).toBe(false);
    expect(matchesPriceBand(500, "500-plus")).toBe(true);
  });
});
