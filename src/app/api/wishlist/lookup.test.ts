import { beforeEach, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { makeProduct } from "../../../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ getProduct: vi.fn(), getProducts: vi.fn().mockResolvedValue({ source: "shopify", data: [] }) }));
import { getProduct } from "@/lib/shopify/catalog";
import { GET } from "./route";
beforeEach(() => vi.clearAllMocks());
it("resolves a saved handle independently of the first catalog page", async () => {
  vi.mocked(getProduct).mockResolvedValue({ source: "shopify", data: makeProduct() });
  const response = await GET(new NextRequest("http://localhost/api/wishlist?handles=test-tea")); expect((await response.json()).products).toHaveLength(1); expect(getProduct).toHaveBeenCalledWith("test-tea");
});
it("distinguishes failed lookups from removed saved products", async () => {
  vi.mocked(getProduct).mockResolvedValue({ source: "unavailable", data: null, reason: "private error" });
  const response = await GET(new NextRequest("http://localhost/api/wishlist?handles=test-tea")); expect(response.status).toBe(503); expect(await response.text()).not.toContain("private error");
});
