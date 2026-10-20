import { beforeEach, expect, it, vi } from "vitest";
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: () => ({ mode: "live" }) }));
vi.mock("@/lib/shopify/server", () => ({ shopifyQuery: vi.fn(), getBuyerIp: () => undefined }));
import { shopifyQuery } from "./server";
import { getHomepageContent } from "./content";
beforeEach(() => vi.clearAllMocks());
it("retains a valid homepage when optional Shopify fields are omitted", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: { fields: [{ key: "eyebrow", value: "Nilkurinji" }, { key: "heading", value: "A considered cup." }, { key: "description", value: "Explore the tea collection." }] } });
  const result = await getHomepageContent(); expect(result.source).toBe("shopify"); if (result.source !== "unavailable") { expect(result.data.heading).toBe("A considered cup."); expect(result.data.secondaryHeading).toBe(""); expect(result.data.secondaryImage).toBeNull(); }
});
it("does not require a hidden eyebrow for the new hero", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: { fields: [{ key: "heading", value: "A considered cup." }, { key: "description", value: "Explore the tea collection." }] } });
  expect((await getHomepageContent()).source).toBe("shopify");
});
