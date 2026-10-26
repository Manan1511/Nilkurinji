import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import HomePage from "@/app/page";

describe("preview homepage composition", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("uses the approved pantry composition without unsupported quality or ingredient claims", async () => {
    vi.stubEnv("SHOPIFY_MODE", "preview");
    const markup = renderToStaticMarkup(await HomePage());
    const categoryStart = markup.indexOf('aria-label="Shop by category"');
    const categoriesMarkup = markup.slice(categoryStart, markup.indexOf("</nav>", categoryStart));
    const unsupportedClaims = [
      "Our Best Sellers",
      "loved by many",
      "wholesome range of premium foods",
      "100% Natural Ingredients",
      "Pure, Safe, Wholesome.",
      "Authentic Indian Heritage",
      "Premium Quality",
      "Carefully sourced, Always.",
    ];

    const visibleClaims = unsupportedClaims.filter((claim) => markup.includes(claim));
    expect(visibleClaims).toEqual([]);
    expect(markup).toContain("The Finest Flavours of India");
    expect(markup).toContain("Tea, tea bags and pantry favourites for everyday tables.");
    expect(markup).toContain("Pan India Delivery");
    expect(markup).toContain('href="/shop?category=rice"');
    expect(markup).toContain('href="/shop?category=snacks"');
    expect(markup).toContain('href="/shop?category=other-foods"');
    const categoryIcons: Record<string, string> = {
      tea: "category-icon-tea-kurinji.webp",
      "tea-bags": "category-icon-tea-bags-kurinji.webp",
      rice: "category-icon-rice.png",
      snacks: "category-icon-snacks.png",
      "other-foods": "category-icon-other-foods.png",
    };
    for (const [handle, icon] of Object.entries(categoryIcons)) {
      expect(markup).toContain(icon);
      expect(categoriesMarkup).not.toContain(`url=%2Fimages%2Fcategory-${handle}.png`);
    }
    expect((categoriesMarkup.match(/categoryMedallion/g) ?? []).length).toBe(5);
    expect(markup).toContain("botanical-home-hero-left-refined.webp");
    expect(markup).toContain("botanical-home-hero-right-refined.webp");
    expect(markup).toContain("botanical-categories-left.webp");
    expect(markup).toContain("botanical-categories-right-kurinji.webp");
    expect(markup).not.toContain("botanical-tea-spray-alt.webp");
    expect(markup).not.toContain("A quiet start, a quick break, one more cup after lunch.");
  });

  it("keeps Shopify setup details out of the unavailable home page", async () => {
    vi.stubEnv("SHOPIFY_MODE", "live");
    vi.stubEnv("SHOPIFY_STORE_DOMAIN", "nilkurinji-jcqze5tu.myshopify.com");
    vi.stubEnv("SHOPIFY_API_VERSION", "2026-10");
    vi.stubEnv("SHOPIFY_STOREFRONT_PRIVATE_TOKEN", "");
    const markup = renderToStaticMarkup(await HomePage());

    expect(markup).not.toContain("Shopify");
    expect(markup).not.toContain("Headless");
    expect(markup).not.toContain("The Finest Flavours of India");
    expect(markup).not.toContain("Tea, tea bags and pantry favourites for everyday tables.");
    expect(markup).not.toContain("preview-hero-home-kurinji.webp");
    expect(markup).not.toContain("category-tea.png");
    expect(markup).not.toContain("category-icon-tea-kurinji.webp");
    expect(markup).toContain("Homepage content is temporarily unavailable.");
    expect(markup).toContain("The range is temporarily unavailable.");
    expect(markup).toContain('href="/shop"');
  });
});
