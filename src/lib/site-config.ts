export const CATEGORIES = [
  { handle: "tea", label: "Tea", href: "/shop?category=tea" },
  { handle: "tea-bags", label: "Tea Bags", href: "/shop?category=tea-bags" },
  { handle: "rice", label: "Rice", href: "/shop?category=rice" },
  { handle: "snacks", label: "Snacks", href: "/shop?category=snacks" },
  { handle: "other-foods", label: "Other Foods", href: "/shop?category=other-foods" },
] as const;

export const DEFAULT_CATEGORY_HANDLES: string[] = ["tea"];

export const PRIMARY_NAV = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Tea Guide", href: "/tea-guide" },
  { label: "Recipes", href: "/recipes" },
  { label: "Nilkurinji Journal", href: "/journal" },
  { label: "Contact", href: "/contact" },
] as const;

export const SITE_NAME = "Nilkurinji";
export const DEFAULT_DESCRIPTION =
  "Discover Nilkurinji Premium teas, thoughtfully crafted for everyday moments. Rare Taste of Nature.";

export function collectionHref(handle: string): string {
  return `/shop?category=${encodeURIComponent(handle)}`;
}
