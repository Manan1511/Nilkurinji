"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { CATEGORIES } from "@/lib/site-config";
import { ProductCard } from "@/components/product-card";
import { ModalSheet } from "@/components/storefront/modal-sheet";
import { useCompactViewport } from "@/hooks/use-compact-viewport";
import { emptyCatalogState, matchesCategory, parseCatalogQuery, writeCatalogQuery, type CatalogSort, type CatalogState } from "@/lib/catalog-state";
import { buildCatalogFacetGroups, matchesPriceBand, matchesSelectedFacets, type ProductFilterGroup } from "@/lib/catalog-facets";
import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./product-grid.module.css";
export type ProductTopFilter = { label: string; value: string; icon: "leaf" | "coffee" | "flower" | "sprout" | "wheat" | "sparkles" };
export function filterProductsByTopFilters<T extends { tags: string[] }>(products: T[], selectedTags: string[]): T[] { return selectedTags.length ? products.filter((product) => selectedTags.some((tag) => product.tags.includes(tag))) : products; }
const priceOf = (product: StorefrontProduct) => Number(product.priceRange?.minVariantPrice.amount ?? NaN);
function selectProducts(products: StorefrontProduct[], state: CatalogState): StorefrontProduct[] {
  const selected = products.filter((product) => matchesCategory(product.collectionHandles, state.category) && (state.productType === "all" || product.productType === state.productType) && (state.priceBand === "all" || matchesPriceBand(priceOf(product), state.priceBand)) && matchesSelectedFacets(product, state.selectedFacets));
  if (state.sort === "title-asc") selected.sort((a,b) => a.title.localeCompare(b.title));
  if (state.sort === "price-asc" || state.sort === "price-desc") selected.sort((a,b) => { const left = priceOf(a), right = priceOf(b); if (!Number.isFinite(left)) return Number.isFinite(right) ? 1 : 0; if (!Number.isFinite(right)) return -1; return state.sort === "price-asc" ? left - right : right - left; });
  return selected;
}
export function ProductGrid({ products, emptyMessage, initialCategory = "all", showCategoryNavigation = true, showFilters = true, showToolbar = true, purchasingEnabled = false, facetGroups, topFilters }: { products: StorefrontProduct[]; emptyMessage: string; initialCategory?: string; allowCategoryFilter?: boolean; showCategoryNavigation?: boolean; showFilters?: boolean; showToolbar?: boolean; purchasingEnabled?: boolean; facetGroups?: ProductFilterGroup[]; topFilters?: ProductTopFilter[]; cardVariant?: "standard" | "collection"; shopLayout?: boolean }) {
  const [state, setState] = useState<CatalogState>(() => ({ ...emptyCatalogState(), category: initialCategory }));
  const [draft, setDraft] = useState<CatalogState>(emptyCatalogState);
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const compact = useCompactViewport();
  const groups = useMemo(() => (facetGroups ?? buildCatalogFacetGroups(products, state.category)).filter((group) => group.options.length), [products, facetGroups, state.category]);
  const tabs = useMemo(() => (topFilters ?? []).filter((tab) => tab.value === "all" || products.some((product) => product.tags.includes(tab.value))), [topFilters, products]);
  const hasPrice = products.some((product) => Number.isFinite(priceOf(product)));
  const config = useMemo(() => ({ categories: CATEGORIES.map((item) => item.handle), productTypes: [], priceBands: hasPrice ? ["under-300", "300-499", "500-plus"] : [], facets: [...groups.map((group) => ({ id: group.id, values: group.options.map((item) => item.value) })), ...(tabs.length ? [{ id: "type", values: tabs.filter((tab) => tab.value !== "all").map((tab) => tab.value) }] : [])] }), [hasPrice, groups, tabs]);
  useEffect(() => { const sync = () => setState(parseCatalogQuery(new URLSearchParams(window.location.search), config)); sync(); window.addEventListener("popstate", sync); return () => window.removeEventListener("popstate", sync); }, [config]);
  useEffect(() => { const media = window.matchMedia?.("(max-width: 1023px)"); const close = () => setOpen(false); media?.addEventListener("change", close); return () => media?.removeEventListener("change", close); }, []);
  const commit = (next: CatalogState) => { setState(next); const params = writeCatalogQuery(new URLSearchParams(window.location.search), next); const query = params.toString(); window.history.replaceState(window.history.state, "", `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`); };
  const visible = selectProducts(products, state);
  const active = state.priceBand !== "all" || Object.values(state.selectedFacets).some((values) => values.length);
  const clearFilters = (value: CatalogState) => ({ ...emptyCatalogState(), category: value.category });
  const priceLabels: Record<string, string> = { "under-300": "Under ₹300", "300-499": "₹300–₹499", "500-plus": "₹500 and above" };
  const activeChips = [
    ...(state.productType !== "all" ? [{ id: "productType", value: state.productType, label: state.productType, ariaLabel: "Remove product type filter" }] : []),
    ...(state.priceBand !== "all" ? [{ id: "price", value: state.priceBand, label: priceLabels[state.priceBand] ?? state.priceBand, ariaLabel: "Remove price filter" }] : []),
    ...Object.entries(state.selectedFacets).flatMap(([id, values]) => values.map((value) => ({
      id,
      value,
      label: groups.find((group) => group.id === id)?.options.find((option) => option.value === value)?.label ?? value,
      ariaLabel: `Remove filter: ${groups.find((group) => group.id === id)?.label ?? id} ${groups.find((group) => group.id === id)?.options.find((option) => option.value === value)?.label ?? value}`,
    }))),
  ];
  function fields(value: CatalogState, change: (next: CatalogState) => void) {
    return <div className={styles.fields}>
      {groups.map((group) => <fieldset key={group.id}><legend>{group.label}</legend>{group.options.map((option) => <label key={option.value}><input type="checkbox" checked={value.selectedFacets[group.id]?.includes(option.value) ?? false} onChange={() => { const previous = value.selectedFacets[group.id] ?? []; change({ ...value, selectedFacets: { ...value.selectedFacets, [group.id]: previous.includes(option.value) ? previous.filter((item) => item !== option.value) : [...previous, option.value] } }); }} />{option.label}</label>)}</fieldset>)}
      {config.priceBands.length > 0 && <label>Price<select value={value.priceBand} onChange={(event) => change({ ...value, priceBand: event.target.value })}><option value="all">Any price</option><option value="under-300">Under ₹300</option><option value="300-499">₹300–₹499</option><option value="500-plus">₹500 and above</option></select></label>}
    </div>;
  }
  return <div className={styles.catalog}>
    {showCategoryNavigation && <nav className={styles.categories} aria-label="Shop categories"><Link href="/shop" aria-current={state.category === "all" ? "page" : undefined}>All</Link>{CATEGORIES.map((item) => <Link href={item.href} key={item.handle} aria-current={state.category === item.handle ? "page" : undefined}>{item.label}</Link>)}</nav>}
    {showToolbar && <div className={styles.toolbar}><div className={styles.toolbarStart}>{showFilters && <button ref={trigger} className={styles.mobileFilter} type="button" aria-label="Open filters" aria-expanded={open && compact} aria-controls="catalog-filter-panel" onClick={() => { setDraft(state); setOpen(true); }}><SlidersHorizontal size={17} aria-hidden="true" />Filters</button>}<p>{visible.length} {visible.length === 1 ? "product" : "products"}</p>{active && <button className={styles.clear} type="button" onClick={() => commit(clearFilters(state))}>Clear filters</button>}</div><label className={styles.sort}>Sort by<select value={state.sort} onChange={(event) => commit({ ...state, sort: event.target.value as CatalogSort })}><option value="featured">Featured</option><option value="title-asc">Name, A to Z</option><option value="price-asc">Price, low to high</option><option value="price-desc">Price, high to low</option></select></label></div>}
    {activeChips.length > 0 && <div className={styles.activeFilters} aria-label="Active filters">{activeChips.map((chip) => <button key={`${chip.id}-${chip.value}`} type="button" aria-label={chip.ariaLabel} onClick={() => {
      if (chip.id === "price") commit({ ...state, priceBand: "all" });
      else commit({ ...state, selectedFacets: { ...state.selectedFacets, [chip.id]: (state.selectedFacets[chip.id] ?? []).filter((value) => value !== chip.value) } });
    }}>{chip.label}<X size={13} aria-hidden="true" /></button>)}</div>}
    <div className={`${styles.layout} ${!showFilters ? styles.noRail : ""}`}>
      {showFilters && !compact && <aside className={styles.rail} aria-label="Product filters">{fields(state, commit)}</aside>}
      <section className={styles.results} aria-label="Products"><p className="sr-only" aria-live="polite">{visible.length} {visible.length === 1 ? "product" : "products"} found.</p>
        {tabs.length > 0 && <nav className={styles.tabs} aria-label="Filter teas by type">{tabs.map((tab) => <button key={tab.value} type="button" aria-pressed={tab.value === "all" ? !state.selectedFacets.type?.length : state.selectedFacets.type?.includes(tab.value) ?? false} onClick={() => commit({ ...state, selectedFacets: { ...state.selectedFacets, type: tab.value === "all" ? [] : [tab.value] } })}>{tab.label}</button>)}</nav>}
        {visible.length ? <div className={styles.grid}>{visible.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={purchasingEnabled} />)}</div> : <div className={styles.empty}><h2>{products.length ? "No matching products" : emptyMessage}</h2><p>{products.length ? "Change or clear your filters to see more products." : "Products will appear here when they are available."}</p>{products.length ? <button type="button" className="button button--outline" onClick={() => commit(emptyCatalogState())}>Clear filters</button> : <Link href="/shop" className="text-link">Browse all products</Link>}</div>}
      </section>
    </div>
    <ModalSheet open={open && compact} id="catalog-filter-panel" label="Filters" placement="left" triggerRef={trigger} onClose={() => setOpen(false)}>{fields(draft, setDraft)}<p className={styles.draftCount} role="status">{selectProducts(products, draft).length} products match</p><div className={styles.apply}><button type="button" className="button button--outline" onClick={() => setDraft(clearFilters(draft))}>Clear</button><button type="button" className="button button--dark" onClick={() => { commit(draft); setOpen(false); }}>Apply filters</button></div></ModalSheet>
  </div>;
}
