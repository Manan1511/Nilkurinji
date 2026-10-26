import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import * as productGrid from "@/components/product-grid";

const gridHelpers = productGrid as unknown as {
  filterProductsByTopFilters<T extends { tags: string[] }>(products: T[], selectedTags: string[]): T[];
};

describe("shared collection browsing", () => {
  it("exposes product results and the unified shop category navigation", () => {
    const html = renderToStaticMarkup(createElement(productGrid.ProductGrid, {
      products: [],
      emptyMessage: "No teas",
      allowCategoryFilter: false,
      showToolbar: false,
      topFilters: [{ label: "All Teas", value: "all", icon: "leaf" }],
    }));
    expect(html).toContain('aria-label="Products"');
    expect(html).toContain('aria-label="Shop categories"');
    expect(html).toContain('href="/shop?category=other-foods"');
  });

  it("uses the selected tea type tag without requiring a duplicate facet", () => {
    expect(gridHelpers.filterProductsByTopFilters).toBeTypeOf("function");
    const products = [
      { handle: "black", tags: ["type:black-tea", "caffeine:caffeinated"] },
      { handle: "green", tags: ["type:green-tea", "caffeine:caffeinated"] },
      { handle: "herbal", tags: ["type:herbal-tea", "caffeine:decaf"] },
    ];

    expect(gridHelpers.filterProductsByTopFilters(products, ["type:black-tea"]).map(({ handle }) => handle)).toEqual(["black"]);
    expect(gridHelpers.filterProductsByTopFilters(products, [])).toEqual(products);
  });

  it("gives shoppers a useful next step when a collection has no products", () => {
    const html = renderToStaticMarkup(createElement(productGrid.ProductGrid, {
      products: [],
      emptyMessage: "No teas",
      allowCategoryFilter: false,
      showToolbar: false,
    }));

    expect(html).not.toContain("Shopify");
    expect(html).toContain("Products will appear here when they are available.");
  });

  it("exposes the selected category and announces product result changes", () => {
    const html = renderToStaticMarkup(createElement(productGrid.ProductGrid, {
      products: [],
      emptyMessage: "No teas",
    }));

    expect(html).toContain('aria-current="page"');
    expect(html).toContain('aria-label="Shop categories"');
    expect(html).toContain('aria-live="polite"');
    expect(html).toContain("0 products found.");
  });
});
