export type ProductFilterGroup = { id: string; label: string; options: { label: string; value: string }[] };
export type FacetedProduct = {
  collectionHandles: string[];
  tags: string[];
  variants: { availableForSale: boolean }[];
};

const PREFIXES = [
  { id: "type", label: "Type", prefix: "type:" },
  { id: "flavour", label: "Flavour", prefix: "flavour:" },
  { id: "caffeine", label: "Caffeine", prefix: "caffeine:" },
] as const;

function prettyLabel(value: string): string {
  const words = value.replace(/[-_]+/g, " ").trim();
  return words ? words[0].toUpperCase() + words.slice(1) : value;
}

export function buildCatalogFacetGroups(products: readonly FacetedProduct[], category: string): ProductFilterGroup[] {
  const groups: ProductFilterGroup[] = [];
  const teaCategory = category === "all" || category === "tea" || category === "tea-bags";
  const scoped = products.filter((product) => category === "all" || product.collectionHandles.includes(category));
  if (teaCategory) {
    for (const prefix of PREFIXES) {
      const values = [...new Set(scoped
        .filter((product) => product.collectionHandles.some((handle) => handle === "tea" || handle === "tea-bags"))
        .flatMap((product) => product.tags.filter((tag) => tag.startsWith(prefix.prefix))))]
        .sort((a, b) => prettyLabel(a.slice(prefix.prefix.length)).localeCompare(prettyLabel(b.slice(prefix.prefix.length))));
      if (values.length) groups.push({
        id: prefix.id,
        label: prefix.label,
        options: values.map((value) => ({ value, label: prettyLabel(value.slice(prefix.prefix.length)) })),
      });
    }
  }

  const inStock = scoped.some((product) => product.variants.some((variant) => variant.availableForSale));
  const soldOut = scoped.some((product) => product.variants.length > 0 && product.variants.every((variant) => !variant.availableForSale));
  const availability = [
    ...(inStock ? [{ label: "In stock", value: "in-stock" }] : []),
    ...(soldOut ? [{ label: "Sold out", value: "sold-out" }] : []),
  ];
  if (availability.length) groups.push({ id: "availability", label: "Availability", options: availability });
  return groups;
}

export function matchesPriceBand(price: number, value: string): boolean {
  if (!Number.isFinite(price)) return false;
  if (value === "under-300") return price < 300;
  if (value === "300-499") return price >= 300 && price < 500;
  if (value === "500-plus") return price >= 500;
  return false;
}

export function matchesSelectedFacets(product: FacetedProduct, selectedFacets: Record<string, string[]>): boolean {
  return Object.entries(selectedFacets).every(([id, values]) => {
    if (!values.length) return true;
    return values.some((value) => {
      if (id === "availability") {
        const available = product.variants.some((variant) => variant.availableForSale);
        return value === "in-stock" ? available : value === "sold-out" ? product.variants.length > 0 && !available : false;
      }
      return product.tags.includes(value);
    });
  });
}

export function filterBySelectedFacets<T extends FacetedProduct>(products: readonly T[], selectedFacets: Record<string, string[]>): T[] {
  return products.filter((product) => matchesSelectedFacets(product, selectedFacets));
}
