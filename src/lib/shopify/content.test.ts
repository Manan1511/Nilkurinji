import { beforeEach, expect, it, vi } from "vitest";
vi.mock("next/headers", () => ({ headers: async () => new Headers() }));
vi.mock("@/lib/shopify/mode", () => ({ getStorefrontMode: () => ({ mode: "live" }) }));
vi.mock("@/lib/shopify/server", () => ({ shopifyQuery: vi.fn(), getBuyerIp: () => undefined }));
import { shopifyQuery } from "./server";
import { getArticle, getBlog, getBlogLanding, getHomepageContent } from "./content";
beforeEach(() => vi.clearAllMocks());
it("retains a valid homepage when optional Shopify fields are omitted", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: { fields: [{ key: "eyebrow", value: "Nilkurinji" }, { key: "heading", value: "A considered cup." }, { key: "description", value: "Explore the tea collection." }] } });
  const result = await getHomepageContent(); expect(result.source).toBe("shopify"); if (result.source !== "unavailable") { expect(result.data.heading).toBe("A considered cup."); expect(result.data.secondaryHeading).toBe(""); expect(result.data.secondaryImage).toBeNull(); }
});
it("does not require a hidden eyebrow for the new hero", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: { fields: [{ key: "heading", value: "A considered cup." }, { key: "description", value: "Explore the tea collection." }] } });
  expect((await getHomepageContent()).source).toBe("shopify");
});

it("publishes only reviewed articles from a Shopify blog", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ blog: {
    id: "blog-id", handle: "tea-guide", title: "Tea Guide", articles: { nodes: [
      { id: "approved", handle: "brew", title: "How to brew", excerpt: null, contentHtml: "<p>Approved copy.</p>", image: null, publishedAt: "2026-10-01T00:00:00Z", authorV2: { name: "Nilkurinji" }, tags: ["Brewing"], blog: { handle: "tea-guide", title: "Tea Guide" }, seo: null, contentReviewed: { value: "true" } },
      { id: "draft", handle: "draft", title: "Unreviewed", excerpt: null, contentHtml: "<p>Draft.</p>", image: null, publishedAt: "2026-10-02T00:00:00Z", authorV2: null, tags: [], blog: { handle: "tea-guide", title: "Tea Guide" }, seo: null, contentReviewed: { value: "false" } },
    ] },
  } });
  const result = await getBlog("tea-guide");
  expect(result.source).toBe("shopify");
  if (result.source !== "unavailable") expect(result.data?.articles.map(({ handle }) => handle)).toEqual(["brew"]);
});

it("normalizes landing copy and hero image from the blog landing metaobject", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ metaobject: { fields: [
    { key: "section_heading", value: "Our Tips" }, { key: "intro", value: "Notes from the Nilkurinji team." },
    { key: "hero", value: null, reference: { fields: [
      { key: "heading", value: "Small Sips, Better Days." },
      { key: "desktop_image", value: null, reference: { image: { url: "https://cdn.shopify.com/hero.jpg", altText: "Tea by a window", width: 1800, height: 600 } } },
    ] } },
  ] } });
  const result = await getBlogLanding("tea-guide");
  expect(result.source).toBe("shopify");
  if (result.source !== "unavailable") expect(result.data).toEqual({
    heading: "Small Sips, Better Days.", intro: "Notes from the Nilkurinji team.",
    heroImage: { url: "https://cdn.shopify.com/hero.jpg", altText: "Tea by a window", width: 1800, height: 600 },
    mobileImage: null, altText: "Tea by a window", scriptLine: "",
  });
});

it("does not request a non-approved blog landing handle", async () => {
  expect((await getBlogLanding("not-a-blog")).data).toBeNull();
  expect(shopifyQuery).not.toHaveBeenCalled();
});

it("returns no live article unless the review flag is explicitly true", async () => {
  vi.mocked(shopifyQuery).mockResolvedValue({ blog: { articleByHandle: {
    id: "draft", handle: "draft", title: "Unreviewed", excerpt: null, contentHtml: "", image: null,
    publishedAt: "2026-10-02T00:00:00Z", authorV2: null, tags: [], blog: { handle: "tea-guide", title: "Tea Guide" }, seo: null,
    contentReviewed: { value: "yes" },
  } } });
  expect((await getArticle("tea-guide", "draft")).data).toBeNull();
});
