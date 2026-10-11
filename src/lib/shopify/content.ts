import { headers } from "next/headers";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { HOME_METAOBJECT_QUERY, PAGE_BY_HANDLE_QUERY, POLICIES_QUERY } from "@/lib/shopify/queries";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import { getSocialLinks, type SocialLink } from "@/lib/shopify/social-links";
import type { ShopifyPage, ShopifyPolicy, StorefrontData } from "@/lib/shopify/types";
import type { ShopifyImage } from "@/lib/shopify/types";

async function buyerIp(): Promise<string | undefined> {
  return getBuyerIp(await headers());
}

export type HomepageContent = {
  eyebrow: string;
  heading: string;
  description: string;
  heroImage: ShopifyImage | null;
  secondaryEyebrow?: string;
  secondaryHeading?: string;
  secondaryDescription?: string;
  secondaryImage: ShopifyImage | null;
  closingEyebrow?: string;
  closingHeading?: string;
  closingDescription?: string;
  featuredProductsHeading?: string;
  socialLinks: SocialLink[];
};

export const DRAFT_HOMEPAGE_CONTENT: HomepageContent = {
  eyebrow: "Nilkurinji · The pantry edit",
  heading: "A little more thought, in every day.",
  description: "Discover tea, rice, snacks and pantry favourites for the everyday table.",
  heroImage: null,
  secondaryEyebrow: "",
  secondaryHeading: "",
  secondaryDescription: "",
  secondaryImage: null,
  closingEyebrow: "",
  closingHeading: "",
  closingDescription: "",
  featuredProductsHeading: "",
  socialLinks: [],
};

export async function getHomepageContent(): Promise<StorefrontData<HomepageContent>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: DRAFT_HOMEPAGE_CONTENT };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{
      metaobject: { fields: {
        key: string;
        value: string | null;
        reference?: { image?: ShopifyImage | null } | null;
      }[] } | null;
    }>(HOME_METAOBJECT_QUERY, {}, { buyerIp: await buyerIp(), tags: ["shopify-homepage"] });
    if (!result.metaobject) {
      return { source: "unavailable", data: null, reason: "Homepage content has not been published in Shopify yet." };
    }
    const rawFields = result.metaobject?.fields ?? [];
    const fields = Object.fromEntries(rawFields.map(({ key, value }) => [key, value ?? ""]));
    const images = Object.fromEntries(rawFields.map(({ key, reference }) => [key, reference?.image ?? null]));
    if (!fields.eyebrow?.trim() || !fields.heading?.trim() || !fields.description?.trim()) {
      return { source: "unavailable", data: null, reason: "Homepage content is incomplete in Shopify." };
    }
    return {
      source: "shopify",
      data: {
        eyebrow: fields.eyebrow.trim(),
        heading: fields.heading.trim(),
        description: fields.description.trim(),
        heroImage: images.hero_image,
        secondaryEyebrow: fields.secondary_eyebrow.trim(),
        secondaryHeading: fields.secondary_heading.trim(),
        secondaryDescription: fields.secondary_description.trim(),
        secondaryImage: images.secondary_image,
        closingEyebrow: fields.closing_eyebrow.trim(),
        closingHeading: fields.closing_heading.trim(),
        closingDescription: fields.closing_description.trim(),
        featuredProductsHeading: fields.featured_products_heading.trim(),
        socialLinks: getSocialLinks(fields),
      },
    };
  } catch {
    return { source: "unavailable", data: null, reason: "Homepage content is temporarily unavailable." };
  }
}

export async function getPublishedPage(handle: string): Promise<StorefrontData<ShopifyPage | null>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: null };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{ page: ShopifyPage | null }>(PAGE_BY_HANDLE_QUERY, { handle }, {
      buyerIp: await buyerIp(),
      tags: [`shopify-page-${handle}`],
    });
    return { source: "shopify", data: result.page };
  } catch {
    return { source: "unavailable", data: null, reason: "This Shopify page is temporarily unavailable." };
  }
}

export async function getPublishedPolicies(): Promise<StorefrontData<Record<string, ShopifyPolicy | null>>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") {
    return { source: "preview", data: { privacy: null, refund: null, terms: null } };
  }
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{
      shop: {
        privacyPolicy: ShopifyPolicy | null;
        refundPolicy: ShopifyPolicy | null;
        termsOfService: ShopifyPolicy | null;
      };
    }>(POLICIES_QUERY, {}, { buyerIp: await buyerIp(), tags: ["shopify-policies"] });
    return {
      source: "shopify",
      data: {
        privacy: result.shop.privacyPolicy,
        refund: result.shop.refundPolicy,
        terms: result.shop.termsOfService,
      },
    };
  } catch {
    return { source: "unavailable", data: null, reason: "Shopify policies are temporarily unavailable." };
  }
}
