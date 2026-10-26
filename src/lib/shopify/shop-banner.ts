import type { ShopifyImage } from "@/lib/shopify/types";

const previewBanners: Record<string, ShopifyImage> = {
  all: { url: "/images/preview-hero-home-kurinji.webp", altText: "Illustrative Nilkurinji tea scene with blue-purple blossoms", width: 2172, height: 724 },
  tea: { url: "/images/preview-hero-tea-kurinji.webp", altText: "Illustrative Nilkurinji tea scene with blue-purple blossoms", width: 2164, height: 727 },
  "tea-bags": { url: "/images/preview-hero-tea-bags-kurinji.webp", altText: "Illustrative Nilkurinji tea-bag scene with blue-purple blossoms", width: 2172, height: 724 },
};

function isPanoramic(image: ShopifyImage | null): image is ShopifyImage {
  return Boolean(image?.width && image.height && image.width / image.height >= 2.5);
}

export function getShopBannerImage(category: string, collectionImage: ShopifyImage | null, preview: boolean): ShopifyImage | null {
  if (preview && previewBanners[category]) return previewBanners[category];
  return isPanoramic(collectionImage) ? collectionImage : null;
}
