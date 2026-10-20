import { afterEach, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { makeProduct } from "../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ getProducts: vi.fn() }));
import { getProducts } from "@/lib/shopify/catalog";
import HomePage from "./page";
afterEach(() => vi.unstubAllEnvs());
it.each([0,1,2,4])("renders %s tea products without inventing slots or pantry fillers", async (count) => {
  vi.stubEnv("SHOPIFY_MODE", "preview");
  const products = Array.from({ length: count }, (_, index) => makeProduct({ id: `tea-${index}`, handle: `tea-${index}`, title: `Fixture tea ${index}`, isPreview: true }));
  vi.mocked(getProducts).mockResolvedValue({ source: "preview", data: [...products, makeProduct({ title: "Rice filler", collectionHandles: ["rice"], productType: "Rice" })] });
  const html = renderToStaticMarkup(await HomePage()); expect((html.match(/<article /g) ?? []).length).toBe(count); expect(html).not.toContain("Rice filler"); expect(html).toContain('href="/collections/rice"');
});
