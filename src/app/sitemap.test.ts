import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import sitemap from "@/app/sitemap";
import { getProducts } from "@/lib/shopify/catalog";
import { getBlog } from "@/lib/shopify/content";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

vi.mock("@/lib/shopify/catalog", () => ({ getProducts: vi.fn() }));
vi.mock("@/lib/shopify/content", () => ({ getBlog: vi.fn() }));
vi.mock("@/lib/shopify/checkout-config", () => ({ isIndexableSite: vi.fn() }));

describe("store sitemap", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.stubEnv("SITE_URL", "https://nilkurinji.example");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("includes launch pages, live products, and approved blog articles", async () => {
    vi.mocked(isIndexableSite).mockReturnValue(true);
    vi.mocked(getProducts).mockResolvedValue({ source: "shopify", data: [{ handle: "assam-gold" }] } as never);
    vi.mocked(getBlog).mockImplementation(async (handle) => ({
      source: "shopify",
      data: {
        id: handle,
        handle,
        title: handle,
        articles: [{ handle: `${handle}-article` }],
      },
    } as never));

    const urls = (await sitemap()).map((item) => item.url);

    expect(urls).toContain("https://nilkurinji.example/our-story");
    expect(urls).toContain("https://nilkurinji.example/tea-guide");
    expect(urls).toContain("https://nilkurinji.example/recipes");
    expect(urls).toContain("https://nilkurinji.example/journal");
    expect(urls).toContain("https://nilkurinji.example/products/assam-gold");
    expect(urls).toContain("https://nilkurinji.example/tea-guide/tea-guide-article");
    expect(urls).toContain("https://nilkurinji.example/recipes/recipes-article");
    expect(urls).toContain("https://nilkurinji.example/journal/journal-article");
    expect(urls).not.toContain("https://nilkurinji.example/about");
    expect(urls).not.toContain("https://nilkurinji.example/cart");
  });

  it("keeps all routes out of the sitemap while indexing is disabled", async () => {
    vi.mocked(isIndexableSite).mockReturnValue(false);

    await expect(sitemap()).resolves.toEqual([]);
    expect(getProducts).not.toHaveBeenCalled();
    expect(getBlog).not.toHaveBeenCalled();
  });
});
