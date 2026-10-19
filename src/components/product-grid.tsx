"use client";

import { useMemo, useState } from "react";
import { Coffee, Flower2, Leaf, SlidersHorizontal, Sparkles, Sprout, Wheat } from "lucide-react";
import { CATEGORIES } from "@/lib/site-config";
import { ProductCard } from "@/components/product-card";
import type { StorefrontProduct } from "@/lib/shopify/types";

type SortChoice = "featured" | "title-asc" | "price-asc" | "price-desc";
export type ProductFilterGroup = { id: string; label: string; options: { label: string; value: string }[] };
export type ProductTopFilter = { label: string; value: string; icon: "leaf" | "coffee" | "flower" | "sprout" | "wheat" | "sparkles" };

const FILTER_ICON = { leaf: Leaf, coffee: Coffee, flower: Flower2, sprout: Sprout, wheat: Wheat, sparkles: Sparkles };

function matchesFacet(product: StorefrontProduct, groupId: string, value: string): boolean {
  if (groupId !== "price") return product.tags.includes(value);
  const price = Number(product.priceRange?.minVariantPrice.amount ?? NaN);
  if (!Number.isFinite(price)) return false;
  if (value === "under-300") return price < 300;
  if (value === "300-500") return price >= 300 && price <= 500;
  return price > 500;
}

export function ProductGrid({
  products,
  emptyMessage,
  allowCategoryFilter = true,
  showFilters = true,
  showToolbar = true,
  purchasingEnabled = false,
  facetGroups,
  topFilters,
  cardVariant = "standard",
}: {
  products: StorefrontProduct[];
  emptyMessage: string;
  allowCategoryFilter?: boolean;
  showFilters?: boolean;
  showToolbar?: boolean;
  purchasingEnabled?: boolean;
  facetGroups?: ProductFilterGroup[];
  topFilters?: ProductTopFilter[];
  cardVariant?: "standard" | "collection";
}) {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortChoice>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [productType, setProductType] = useState("all");
  const [priceBand, setPriceBand] = useState("all");
  const [selectedFacets, setSelectedFacets] = useState<Record<string, string[]>>({});
  const productTypes = useMemo(() => [...new Set(products.map((product) => product.productType.trim()).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [products]);
  const hasPricedProducts = products.some((product) => Number.isFinite(Number(product.priceRange?.minVariantPrice.amount)));

  const visibleProducts = useMemo(() => {
    let filtered = category === "all"
      ? [...products]
      : products.filter((product) => product.collectionHandles.includes(category));
    if (productType !== "all") filtered = filtered.filter((product) => product.productType === productType);
    for (const group of facetGroups ?? []) {
      const values = selectedFacets[group.id] ?? [];
      if (values.length) filtered = filtered.filter((product) => values.some((value) => matchesFacet(product, group.id, value)));
    }
    if (priceBand !== "all") filtered = filtered.filter((product) => {
      const price = Number(product.priceRange?.minVariantPrice.amount ?? NaN);
      if (!Number.isFinite(price)) return false;
      if (priceBand === "under-500") return price < 500;
      if (priceBand === "500-999") return price >= 500 && price < 1000;
      return price >= 1000;
    });
    if (sort === "title-asc") filtered.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "price-asc") filtered.sort((a, b) => Number(a.priceRange?.minVariantPrice.amount ?? Infinity) - Number(b.priceRange?.minVariantPrice.amount ?? Infinity));
    if (sort === "price-desc") filtered.sort((a, b) => Number(b.priceRange?.minVariantPrice.amount ?? -Infinity) - Number(a.priceRange?.minVariantPrice.amount ?? -Infinity));
    return filtered;
  }, [category, facetGroups, priceBand, productType, products, selectedFacets, sort]);

  const toggleFacet = (groupId: string, value: string) => setSelectedFacets((current) => {
    const selected = current[groupId] ?? [];
    return { ...current, [groupId]: selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value] };
  });

  return (
    <div className="catalog-page">
      <div className={`catalog-layout ${showFilters ? "" : "catalog-layout--unfiltered"}`}>
      {showFilters && (
        <aside className={`catalog-filter ${filtersOpen ? "catalog-filter--open" : ""}`}>
          <div className="catalog-filter__heading"><h2>{facetGroups?.length ? "Filters" : "Browse by"}</h2><span>{visibleProducts.length} items</span></div>
          <button
            className="catalog-filter__mobile-toggle"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filter-options"
            onClick={() => setFiltersOpen((open) => !open)}
          >
            <SlidersHorizontal aria-hidden="true" size={17} /> Filters
          </button>
          <div id="catalog-filter-options" className="catalog-filter__options">
            {allowCategoryFilter && <fieldset className="catalog-facet">
              <legend>Category</legend>
              <button className={category === "all" ? "is-active" : ""} onClick={() => setCategory("all")} type="button">All pantry</button>
              {CATEGORIES.map((item) => (
                <button key={item.handle} className={category === item.handle ? "is-active" : ""} onClick={() => setCategory(item.handle)} type="button">
                  {item.label}
                </button>
              ))}
            </fieldset>}
            {facetGroups?.map((group) => <fieldset className="catalog-facet catalog-facet--checks" key={group.id}>
              <legend>{group.label}</legend>
              {group.options.map((option) => <label key={option.value}>
                <input type="checkbox" checked={selectedFacets[group.id]?.includes(option.value) ?? false} onChange={() => toggleFacet(group.id, option.value)} />
                <span>{option.label}</span>
              </label>)}
            </fieldset>)}
            {productTypes.length > 1 && <label className="catalog-facet catalog-facet--select">Product type
              <select value={productType} onChange={(event) => setProductType(event.target.value)}>
                <option value="all">All types</option>
                {productTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>}
            {!facetGroups?.length && hasPricedProducts && <label className="catalog-facet catalog-facet--select">Price
              <select value={priceBand} onChange={(event) => setPriceBand(event.target.value)}>
                <option value="all">Any price</option>
                <option value="under-500">Under ₹500</option>
                <option value="500-999">₹500–₹999</option>
                <option value="1000-plus">₹1,000 and above</option>
              </select>
            </label>}
          </div>
        </aside>
      )}

      <div className="catalog-results">
        {topFilters && <nav className="collection-type-nav" aria-label="Filter teas by type">
          {topFilters.map((filter) => {
            const Icon = FILTER_ICON[filter.icon];
            const active = filter.value === "all" ? !(selectedFacets.type?.length) : selectedFacets.type?.includes(filter.value) ?? false;
            return (
              <button key={filter.value} type="button" aria-pressed={active} className={active ? "is-active" : ""} onClick={() => setSelectedFacets((current) => ({ ...current, type: filter.value === "all" ? [] : [filter.value] }))}>
                <Icon aria-hidden="true" size={22} />
                <span>{filter.label}</span>
              </button>
            );
          })}
        </nav>}
        {showToolbar && <div className="catalog-toolbar">
          <p>{visibleProducts.length ? `${visibleProducts.length} ${visibleProducts.length === 1 ? "item" : "items"}` : "A quieter shelf"}</p>
          <label className="sort-control">Sort by
            <select value={sort} onChange={(event) => setSort(event.target.value as SortChoice)}>
              <option value="featured">Featured</option>
              <option value="title-asc">Name, A to Z</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
            </select>
          </label>
        </div>}

        {visibleProducts.length ? (
          <div className="product-grid">
            {visibleProducts.map((product, index) => <ProductCard key={product.id} product={product} purchasingEnabled={purchasingEnabled} variant={cardVariant} revealDelayMs={(index % 2) * 60} />)}
          </div>
        ) : (
          <div className="empty-state empty-state--catalog">
            <span className="eyebrow">A moment before opening</span>
            <h2>{emptyMessage}</h2>
            <p>Published products, prices and availability will come directly from Shopify.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
