export const CATEGORIES = [
  { handle: "tea", label: "Tea", href: "/collections/tea" },
  { handle: "tea-bags", label: "Tea Bags", href: "/collections/tea-bags" },
  { handle: "rice", label: "Rice", href: "/collections/rice" },
  { handle: "snacks", label: "Snacks", href: "/collections/snacks" },
  { handle: "other-foods", label: "Other Foods", href: "/collections/other-foods" },
] as const;

export const PRIMARY_NAV = [
  { label: "Shop", href: "/shop" },
  { label: "Tea", href: "/collections/tea" },
  { label: "Our story", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const SITE_NAME = "Nilkurinji";
export const DEFAULT_DESCRIPTION =
  "Explore the Nilkurinji pantry: tea, rice, snacks and everyday foods.";

export function collectionHref(handle: string): string {
  return `/collections/${encodeURIComponent(handle)}`;
}
