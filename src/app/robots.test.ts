import { afterEach, describe, expect, it, vi } from "vitest";
import robots from "@/app/robots";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

vi.mock("@/lib/shopify/checkout-config", () => ({ isIndexableSite: vi.fn() }));

describe("robots rules", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("keeps search, account, cart, checkout and APIs out of indexing", () => {
    vi.mocked(isIndexableSite).mockReturnValue(true);
    vi.stubEnv("SITE_URL", "https://nilkurinji.example");

    const result = robots();

    expect(result.rules).toEqual({
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart", "/account", "/search", "/checkout"],
    });
    expect(result.sitemap).toBe("https://nilkurinji.example/sitemap.xml");
  });

  it("blocks the entire preview deployment", () => {
    vi.mocked(isIndexableSite).mockReturnValue(false);

    expect(robots().rules).toEqual({ userAgent: "*", disallow: "/" });
  });
});
