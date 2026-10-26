import { headers } from "next/headers";
import { getStorefrontMode } from "@/lib/shopify/mode";
import { ARTICLE_BY_HANDLE_QUERY, BLOG_BY_HANDLE_QUERY, BLOG_LANDING_QUERY, HOME_METAOBJECT_QUERY, PAGE_BY_HANDLE_QUERY, POLICIES_QUERY } from "@/lib/shopify/queries";
import { getBuyerIp, shopifyQuery } from "@/lib/shopify/server";
import { getSocialLinks, type SocialLink } from "@/lib/shopify/social-links";
import type { ShopifyPage, ShopifyPolicy, StorefrontArticle, StorefrontBlog, StorefrontBlogLanding, StorefrontData } from "@/lib/shopify/types";
import type { ShopifyImage } from "@/lib/shopify/types";
export type HomepageRitualChapter = {
  id: "leaf" | "water" | "cup";
  label: string;
  image: ShopifyImage;
  mobileImage: ShopifyImage | null;
  altText: string;
};

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
  ritualChapters?: HomepageRitualChapter[];
  formatImages?: { tea: ShopifyImage | null; teaBags: ShopifyImage | null };
  brewingProductHandle?: string | null;
  storyHeading?: string;
  storyBody?: string;
  storyImage?: ShopifyImage | null;
  socialLinks: SocialLink[];
};

export const DRAFT_HOMEPAGE_CONTENT: HomepageContent = {
  eyebrow: "TEA · TEA BAGS · PANTRY",
  heading: "The Finest Flavours of India",
  description: "Tea, tea bags and pantry favourites for everyday tables.",
  heroImage: null,
  secondaryEyebrow: "",
  secondaryHeading: "",
  secondaryDescription: "",
  secondaryImage: null,
  closingEyebrow: "",
  closingHeading: "",
  closingDescription: "",
  featuredProductsHeading: "",
  ritualChapters: [],
  formatImages: { tea: null, teaBags: null },
  brewingProductHandle: null,
  storyHeading: "A twelve-year rhythm.",
  storyBody: "Some populations of the violet-blue kurinji flower bloom in cycles of about twelve years. Timing varies between populations.",
  storyImage: null,
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
    if (!fields.heading?.trim() || !fields.description?.trim()) {
      return { source: "unavailable", data: null, reason: "Homepage content is incomplete in Shopify." };
    }
    const ritualIds = ["leaf", "water", "cup"] as const;
    const ritualChapters: HomepageRitualChapter[] = ritualIds.flatMap((id) => {
      const image = images[`${id}_image`];
      const altText = fields[`${id}_alt`]?.trim() ?? "";
      if (!image || !altText) return [];
      return [{ id, label: id === "leaf" ? "Leaf" : id === "water" ? "Water" : "Cup", image, mobileImage: images[`${id}_mobile_image`] ?? null, altText }];
    });
    return {
      source: "shopify",
      data: {
        eyebrow: fields.eyebrow?.trim() ?? "",
        heading: fields.heading.trim(),
        description: fields.description.trim(),
        heroImage: images.hero_image ?? null,
        secondaryEyebrow: fields.secondary_eyebrow?.trim() ?? "",
        secondaryHeading: fields.secondary_heading?.trim() ?? "",
        secondaryDescription: fields.secondary_description?.trim() ?? "",
        secondaryImage: images.secondary_image ?? null,
        closingEyebrow: fields.closing_eyebrow?.trim() ?? "",
        closingHeading: fields.closing_heading?.trim() ?? "",
        closingDescription: fields.closing_description?.trim() ?? "",
        featuredProductsHeading: fields.featured_products_heading?.trim() ?? "",
        ritualChapters,
        formatImages: { tea: images.format_tea_image ?? null, teaBags: images.format_tea_bags_image ?? null },
        brewingProductHandle: boundedHandle(fields.brewing_product_handle),
        storyHeading: fields.story_heading?.trim() ?? "",
        storyBody: fields.story_body?.trim() ?? "",
        storyImage: images.story_image ?? null,
        socialLinks: getSocialLinks(fields),
      },
    };
  } catch {
    return { source: "unavailable", data: null, reason: "Homepage content is temporarily unavailable." };
  }
}

function boundedHandle(value: string | undefined): string | null {
  const handle = value?.trim() ?? "";
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(handle) && handle.length <= 100 ? handle : null;
}

type RawArticle = Omit<StorefrontArticle, "author" | "blogHandle" | "blogTitle"> & {
  authorV2: { name: string } | null;
  contentReviewed: { value: string } | null;
  blog: { handle: string; title: string } | null;
};

function approvedArticle(article: RawArticle, fallbackBlog?: { handle: string; title: string }): StorefrontArticle | null {
  if (article.contentReviewed?.value !== "true") return null;
  const { contentReviewed, authorV2, blog, ...data } = article;
  void contentReviewed;
  return { ...data, author: authorV2?.name ?? null, blogHandle: blog?.handle ?? fallbackBlog?.handle ?? "", blogTitle: blog?.title ?? fallbackBlog?.title ?? "" };
}

export async function getBlog(handle: string): Promise<StorefrontData<StorefrontBlog | null>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: { id: `preview-blog-${handle}`, handle, title: handle, articles: [] } };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{ blog: { id: string; handle: string; title: string; articles: { nodes: RawArticle[] } } | null }>(
      BLOG_BY_HANDLE_QUERY,
      { handle, first: 24 },
      { buyerIp: await buyerIp(), tags: [`shopify-blog-${handle}`] },
    );
    const blog = result.blog;
    if (!blog) return { source: "shopify", data: null };
    return { source: "shopify", data: { ...blog, articles: blog.articles.nodes.map((article) => approvedArticle(article, blog)).filter((article): article is StorefrontArticle => article !== null) } };
  } catch {
    return { source: "unavailable", data: null, reason: "Editorial content is temporarily unavailable." };
  }
}

type RawMetaobjectField = {
  key: string;
  value: string | null;
  reference?: {
    image?: ShopifyImage | null;
    fields?: RawMetaobjectField[];
  } | null;
};

export async function getBlogLanding(handle: string): Promise<StorefrontData<StorefrontBlogLanding | null>> {
  if (!["tea-guide", "recipes", "journal"].includes(handle)) {
    return { source: "shopify", data: null };
  }
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: null };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{ metaobject: { fields: RawMetaobjectField[] } | null }>(
      BLOG_LANDING_QUERY,
      { handle },
      { buyerIp: await buyerIp(), tags: [`shopify-blog-${handle}`] },
    );
    const fields = result.metaobject?.fields ?? [];
    const byKey = new Map(fields.map((field) => [field.key, field]));
    const heroFields = byKey.get("hero")?.reference?.fields ?? [];
    const hero = new Map(heroFields.map((field) => [field.key, field]));
    const heading = hero.get("heading")?.value?.trim() || byKey.get("section_heading")?.value?.trim() || "";
    const intro = hero.get("body")?.value?.trim() || byKey.get("intro")?.value?.trim() || "";
    const heroImage = hero.get("desktop_image")?.reference?.image ?? null;
    const mobileImage = hero.get("mobile_image")?.reference?.image ?? null;
    const altText = hero.get("image_alt")?.value?.trim() || heroImage?.altText || "";
    const scriptLine = hero.get("script_line")?.value?.trim() || "";
    if (!heading && !intro && !heroImage) return { source: "shopify", data: null };
    return { source: "shopify", data: { heading, intro, heroImage, mobileImage, altText, scriptLine } };
  } catch {
    return { source: "unavailable", data: null, reason: "Editorial landing content is temporarily unavailable." };
  }
}

export async function getArticle(blogHandle: string, articleHandle: string): Promise<StorefrontData<StorefrontArticle | null>> {
  const mode = getStorefrontMode();
  if (mode.mode === "preview") return { source: "preview", data: null };
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{ blog: { articleByHandle: RawArticle | null } | null }>(
      ARTICLE_BY_HANDLE_QUERY,
      { blogHandle, articleHandle },
      { buyerIp: await buyerIp(), tags: [`shopify-blog-${blogHandle}`] },
    );
    return { source: "shopify", data: result.blog?.articleByHandle ? approvedArticle(result.blog.articleByHandle, { handle: blogHandle, title: blogHandle }) : null };
  } catch {
    return { source: "unavailable", data: null, reason: "This article is temporarily unavailable." };
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
    return { source: "preview", data: { privacy: null, refund: null, shipping: null, terms: null } };
  }
  if (mode.mode === "unavailable") return { source: "unavailable", data: null, reason: mode.reason };

  try {
    const result = await shopifyQuery<{
      shop: {
        privacyPolicy: ShopifyPolicy | null;
        refundPolicy: ShopifyPolicy | null;
        shippingPolicy: ShopifyPolicy | null;
        termsOfService: ShopifyPolicy | null;
      };
    }>(POLICIES_QUERY, {}, { buyerIp: await buyerIp(), tags: ["shopify-policies"] });
    return {
      source: "shopify",
      data: {
        privacy: result.shop.privacyPolicy,
        refund: result.shop.refundPolicy,
        shipping: result.shop.shippingPolicy,
        terms: result.shop.termsOfService,
      },
    };
  } catch {
    return { source: "unavailable", data: null, reason: "Shopify policies are temporarily unavailable." };
  }
}
