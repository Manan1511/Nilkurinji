export type CatalogSort = "featured" | "title-asc" | "price-asc" | "price-desc";
export const TEA_COLLECTIONS = ["tea", "tea-bags"] as const;
export function isTeaProduct<T extends { collectionHandles: readonly string[] }>(product: T): boolean {
  return product.collectionHandles.some((handle) => TEA_COLLECTIONS.includes(handle as (typeof TEA_COLLECTIONS)[number]));
}
export function filterTeaProducts<T extends { collectionHandles: readonly string[] }>(products: T[]): T[] {
  return products.filter(isTeaProduct);
}
export function matchesCategory(collectionHandles: readonly string[], category: string): boolean {
  if (category === "all") return true;
  if (!TEA_COLLECTIONS.includes(category as (typeof TEA_COLLECTIONS)[number])) return false;
  return collectionHandles.includes(category);
}
export type CatalogState = { sort: CatalogSort; category: string; productType: string; priceBand: string; selectedFacets: Record<string, string[]> };
export type CatalogConfig = { categories: readonly string[]; productTypes: readonly string[]; priceBands: readonly string[]; facets: readonly { id: string; values: readonly string[] }[] };
export const emptyCatalogState = (): CatalogState => ({ sort: "featured", category: "all", productType: "all", priceBand: "all", selectedFacets: {} });
export function parseCatalogQuery(params: URLSearchParams, config: CatalogConfig): CatalogState {
  const state = emptyCatalogState();
  const sort = params.get("sort");
  if (sort && ["featured", "title-asc", "price-asc", "price-desc"].includes(sort)) state.sort = sort as CatalogSort;
  const valid = (key: string, values: readonly string[]) => { const value = params.get(key); return value && values.includes(value) ? value : "all"; };
  state.category = valid("category", config.categories); state.productType = valid("productType", config.productTypes);
  state.priceBand = config.facets.some((group) => group.id === "price") ? "all" : valid("price", config.priceBands);
  for (const group of config.facets) { const values = [...new Set(params.getAll(`facet.${group.id}`).filter((value) => group.values.includes(value)))]; if (values.length) state.selectedFacets[group.id] = values; }
  return state;
}
export function writeCatalogQuery(params: URLSearchParams, state: CatalogState): URLSearchParams {
  const next = new URLSearchParams(params);
  for (const key of [...next.keys()]) if (["sort", "category", "productType", "price"].includes(key) || key.startsWith("facet.")) next.delete(key);
  if (state.sort !== "featured") next.set("sort", state.sort);
  if (state.category !== "all") next.set("category", state.category);
  if (state.productType !== "all") next.set("productType", state.productType);
  if (state.priceBand !== "all") next.set("price", state.priceBand);
  for (const [id, values] of Object.entries(state.selectedFacets)) for (const value of [...new Set(values)]) next.append(`facet.${id}`, value);
  return next;
}
