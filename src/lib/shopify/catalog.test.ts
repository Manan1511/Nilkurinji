import { afterEach, describe, expect, it, vi } from "vitest";
import { getProducts } from "./catalog";

describe("storefront catalog scope", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("returns only tea and tea bags in preview mode", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");

    const result = await getProducts();

    expect(result.source).toBe("preview");
    if (result.source === "unavailable") throw new Error("Preview catalog should be available");
    expect(result.data.map(({ collectionHandles }) => collectionHandles)).toEqual(
      expect.arrayContaining([["tea"], ["tea-bags"]]),
    );
    expect(result.data.every((product) => product.collectionHandles.length > 0 && product.collectionHandles.every((handle) => ["tea", "tea-bags"].includes(handle)))).toBe(true);
  });
});
