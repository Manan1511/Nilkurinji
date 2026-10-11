export function safeCustomerAccountUrl(value: string | undefined, storeDomain: string): string | null {
  if (!value || !storeDomain) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const shopifyHosted = host === "shop.app" || host === "shopify.com" || host.endsWith(".shopify.com");
    return url.protocol === "https:" && (host === storeDomain.toLowerCase() || shopifyHosted) && !url.username && !url.password
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}
