import { headers } from "next/headers";
import { CATEGORIES } from "@/lib/site-config";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { SHOP_CATEGORY_BANNER_QUERY } from "@/lib/shopify/queries";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import type { ShopifyImage, StorefrontData } from "@/lib/shopify/types";

export type ShopCategoryBanner = {
  eyebrow: string;
  heading: string;
  body: string;
  image: ShopifyImage | null;
  mobileImage: ShopifyImage | null;
  altText: string;
};

type RawCategoryField = {
  key: string;
  value: string | null;
  reference?: { image?: ShopifyImage | null; fields?: RawCategoryField[] } | null;
};

export function normalizeShopCategoryBanner(fields: RawCategoryField[]): ShopCategoryBanner | null {
  const categoryFields = new Map(fields.map((field) => [field.key, field]));
  const bannerFields = categoryFields.get("banner")?.reference?.fields ?? [];
  const banner = new Map(bannerFields.map((field) => [field.key, field]));
  const image = banner.get("desktop_image")?.reference?.image ?? null;
  const mobileImage = banner.get("mobile_image")?.reference?.image ?? null;
  const eyebrow = banner.get("eyebrow")?.value?.trim() ?? "";
  const heading = banner.get("heading")?.value?.trim() || categoryFields.get("title")?.value?.trim() || "";
  const body = banner.get("body")?.value?.trim() || categoryFields.get("intro")?.value?.trim() || "";
  const altText = banner.get("image_alt")?.value?.trim() || image?.altText || "";
  if (!eyebrow && !heading && !body && !image) return null;
  return { eyebrow, heading, body, image, mobileImage, altText };
}

export async function getShopCategoryBanner(handle: string): Promise<StorefrontData<ShopCategoryBanner | null>> {
  if (handle !== "all" && !CATEGORIES.some((category) => category.handle === handle)) return { source: "shopify", data: null };
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: null };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{ metaobject: { fields: RawCategoryField[] } | null }>(
      SHOP_CATEGORY_BANNER_QUERY,
      { handle },
      { buyerIp: getBuyerIp(await headers()), tags: [`shopify-category-${handle}`] },
    );
    return { source: "shopify", data: result.metaobject ? normalizeShopCategoryBanner(result.metaobject.fields) : null };
  } catch {
    return { source: "unavailable", data: null, reason: "This shop category is temporarily unavailable." };
  }
}
