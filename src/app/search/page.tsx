import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { SearchForm } from "@/components/search-form";
import { searchProducts } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";

type SearchProps = { searchParams: Promise<{ q?: string | string[] }> };

export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> {
  const { q } = await searchParams;
  const term = Array.isArray(q) ? q[0] ?? "" : q ?? "";
  return { title: term ? `Search · ${term.slice(0, 70)}` : "Search", robots: { index: false, follow: true } };
}

export default async function SearchPage({ searchParams }: SearchProps) {
  const { q } = await searchParams;
  const rawQuery = Array.isArray(q) ? q[0] ?? "" : q ?? "";
  const query = rawQuery.trim().slice(0, 120);
  const result = await searchProducts(query);
  return (
    <>
      <header className="page-header">
        <p className="eyebrow">Find your favourite</p>
        <h1 className="page-title">Search</h1>
        <SearchForm initialValue={query} />
      </header>
      {result.source === "unavailable" ? (
        <div className="notice-card" role="status">{result.reason}</div>
      ) : query ? (
        <div className="search-results">
          <p className="search-results__heading">{result.data.length ? `Results for “${query}”` : `No results for “${query}”`}</p>
          <ProductGrid products={result.data} emptyMessage="Nothing found this time. Try another search." allowCategoryFilter={false} purchasingEnabled={isShopifyCheckoutEnabled()} />
        </div>
      ) : (
        <div className="empty-state empty-state--catalog">
          <span className="eyebrow">The pantry at a glance</span>
          <h2>What are you looking for?</h2>
          <p>Search published products in the Nilkurinji Shopify catalog.</p>
        </div>
      )}
    </>
  );
}
