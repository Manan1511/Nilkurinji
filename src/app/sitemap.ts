import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify/catalog";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

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
    "/about",
    "/contact",
    "/pages/privacy-policy",
    "/pages/refund-policy",
    "/pages/terms-and-conditions",
  ].map((path) => ({ url: new URL(path || "/", base).toString(), lastModified: current }));

  const products = await getProducts();
  const productRoutes = products.source === "shopify"
    ? products.data.map((product) => ({ url: new URL(`/products/${product.handle}`, base).toString(), lastModified: current }))
    : [];
  return [...routes, ...productRoutes];
}
