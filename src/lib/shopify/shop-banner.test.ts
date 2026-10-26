import { describe, expect, it } from "vitest";
import { getShopBannerImage } from "@/lib/shopify/shop-banner";
import type { ShopifyImage } from "@/lib/shopify/types";

const squareCollectionImage: ShopifyImage = {
  url: "/images/category-icon-rice.png", altText: "A bowl of rice", width: 1122, height: 1402,
};
const wideCollectionImage: ShopifyImage = {
  url: "https://cdn.shopify.com/s/files/banner.jpg", altText: "Tea on a stone table", width: 2400, height: 420,
};

describe("Shop banner image selection", () => {
  it("uses measured panoramic preview artwork for the approved tea and home banners", () => {
    expect(getShopBannerImage("all", squareCollectionImage, true)?.url).toBe("/images/preview-hero-home-kurinji.webp");
    expect(getShopBannerImage("tea", squareCollectionImage, true)?.url).toBe("/images/preview-hero-tea-kurinji.webp");
    expect(getShopBannerImage("tea-bags", squareCollectionImage, true)?.url).toBe("/images/preview-hero-tea-bags-kurinji.webp");
  });

  it("never stretches a square category medallion into the collection banner", () => {
    expect(getShopBannerImage("rice", squareCollectionImage, true)).toBeNull();
    expect(getShopBannerImage("snacks", squareCollectionImage, false)).toBeNull();
  });

  it("uses a live collection image only when it has a panoramic aspect ratio", () => {
    expect(getShopBannerImage("rice", wideCollectionImage, false)).toEqual(wideCollectionImage);
  });
});
