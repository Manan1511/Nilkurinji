import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify/catalog";
import { getBlog } from "@/lib/shopify/content";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

const EDITORIAL_SECTIONS = ["tea-guide", "recipes", "journal"] as const;

function siteBase(): URL | null {
  try {
    const value = process.env.SITE_URL ?? process.env.URL;
    return value ? new URL(value) : null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexableSite()) return [];
  const base = siteBase();
  if (!base) return [];
  const current = new Date();
  const routes = [
    "",
    "/shop",
    "/our-story",
    "/contact",
    "/shipping-and-returns",
    "/tea-guide",
    "/recipes",
    "/journal",
    "/pages/privacy-policy",
    "/pages/refund-policy",
    "/pages/shipping-policy",
    "/pages/terms-and-conditions",
  ].map((path) => ({ url: new URL(path || "/", base).toString(), lastModified: current }));

  const [products, blogs] = await Promise.all([
    getProducts(),
    Promise.all(EDITORIAL_SECTIONS.map((handle) => getBlog(handle))),
  ]);
  const productRoutes = products.source === "shopify"
    ? products.data.map((product) => ({ url: new URL(`/products/${product.handle}`, base).toString(), lastModified: current }))
    : [];
  const articleRoutes = blogs.flatMap((blogResult, index) => {
    if (blogResult.source !== "shopify" || !blogResult.data) return [];
    const section = EDITORIAL_SECTIONS[index];
    return blogResult.data.articles.map((article) => {
      const publishedAt = article.publishedAt ? new Date(article.publishedAt) : current;
      return {
        url: new URL(`/${section}/${article.handle}`, base).toString(),
        lastModified: Number.isNaN(publishedAt.valueOf()) ? current : publishedAt,
      };
    });
  });
  return [...routes, ...productRoutes, ...articleRoutes];
}
