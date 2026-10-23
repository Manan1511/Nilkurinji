export const CATEGORIES = [
  { handle: "tea", label: "Tea", href: "/shop?category=tea" },
  { handle: "tea-bags", label: "Tea Bags", href: "/shop?category=tea-bags" },
] as const;

export const PRIMARY_NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Our story", href: "/about" },
] as const;

export const SITE_NAME = "Nilkurinji";
export const DEFAULT_DESCRIPTION =
  "Explore Nilkurinji loose tea and tea bags.";

export function collectionHref(handle: string): string {
  return `/shop?category=${encodeURIComponent(handle)}`;
}
