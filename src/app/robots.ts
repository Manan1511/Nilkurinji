import type { MetadataRoute } from "next";
import { isIndexableSite } from "@/lib/shopify/checkout-config";

function configuredSiteUrl(): URL | null {
  try {
    const value = process.env.SITE_URL ?? process.env.URL;
    return value ? new URL(value) : null;
  } catch {
    return null;
  }
}

export default function robots(): MetadataRoute.Robots {
  const indexable = isIndexableSite();
  const base = configuredSiteUrl();
  return {
    rules: {
      userAgent: "*",
      allow: indexable ? "/" : undefined,
      disallow: indexable ? ["/api/", "/cart", "/account", "/search"] : "/",
    },
    ...(indexable && base ? { sitemap: new URL("/sitemap.xml", base).toString(), host: base.host } : {}),
  };
}
