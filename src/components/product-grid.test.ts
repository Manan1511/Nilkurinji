import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProductGrid } from "@/components/product-grid";

describe("reference collection layout", () => {
  it("places tea type tabs in the product column beside the filter sidebar", () => {
    const html = renderToStaticMarkup(createElement(ProductGrid, {
      products: [],
      emptyMessage: "No teas",
      allowCategoryFilter: false,
      showToolbar: false,
      topFilters: [{ label: "All Teas", value: "all", icon: "leaf" }],
    }));
    const layout = html.indexOf("catalog-layout");
    const results = html.indexOf("catalog-results");
    const tabs = html.indexOf("collection-type-nav");

    expect(layout).toBeGreaterThanOrEqual(0);
    expect(results).toBeGreaterThan(layout);
    expect(tabs).toBeGreaterThan(results);
  });
});
