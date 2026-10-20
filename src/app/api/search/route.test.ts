import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { makeProduct } from "../../../../test/fixtures/storefront";
vi.mock("@/lib/shopify/catalog", () => ({ searchProducts: vi.fn() }));
import { searchProducts } from "@/lib/shopify/catalog";
import { GET } from "./route";
const request = (q: string) => GET(new NextRequest(`http://localhost/api/search?q=${encodeURIComponent(q)}`));
beforeEach(() => vi.clearAllMocks());
describe("public predictive search", () => {
  it("does not contact Shopify for short queries", async () => { const response = await request("🍵"); expect(response.status).toBe(200); expect(searchProducts).not.toHaveBeenCalled(); expect(response.headers.get("cache-control")).toContain("no-store"); expect(response.headers.has("set-cookie")).toBe(false); });
  it("projects at most six public products", async () => {
    vi.mocked(searchProducts).mockResolvedValue({ source: "shopify", data: Array.from({ length: 8 }, (_, index) => makeProduct({ id: String(index) })) });
    const body = await (await request("tea")).json(); expect(body.items).toHaveLength(6); expect(body.hasMore).toBe(true); expect(body.items[0]).not.toHaveProperty("variants"); expect(body.items[0].image).toBeNull();
  });
  it("fails safely without leaking a backend reason or preview items", async () => {
    vi.mocked(searchProducts).mockResolvedValue({ source: "unavailable", data: null, reason: "private internal detail" });
    const response = await request("tea"); expect(response.status).toBe(503); expect(await response.text()).not.toContain("private internal detail");
  });
});
