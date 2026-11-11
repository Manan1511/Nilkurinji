import { expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  let releaseCategories!: (value: string[]) => void;
  const categories = new Promise<string[]>((resolve) => { releaseCategories = resolve; });
  return {
    categories,
    releaseCategories: (value: string[]) => releaseCategories(value),
    products: vi.fn(async () => ({ source: "shopify" as const, data: [] })),
    banner: vi.fn(async () => ({ source: "shopify" as const, data: null })),
  };
});
vi.mock("@/lib/shopify/catalog", () => ({ getProducts: mocks.products, searchProducts: mocks.products }));
vi.mock("@/lib/shopify/shop-category", () => ({ getEnabledCategoryHandles: () => mocks.categories, getShopCategoryBanner: mocks.banner }));

import ShopPage from "./page";

it("starts loading products while category settings are still loading", async () => {
  const page = ShopPage({ searchParams: Promise.resolve({}) });
  await Promise.resolve();
  expect(mocks.products).toHaveBeenCalledOnce();
  expect(mocks.banner).not.toHaveBeenCalled();
  mocks.releaseCategories(["tea"]);
  await page;
  expect(mocks.banner).toHaveBeenCalledWith("tea");
});
