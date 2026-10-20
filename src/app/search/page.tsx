import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { SearchForm } from "@/components/search-form";
import { searchProducts } from "@/lib/shopify/catalog";
import { normalizeSearchQuery } from "@/lib/search/query";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "@/app/reading.module.css";
type SearchProps = { searchParams: Promise<{ q?: string | string[] }> };
export async function generateMetadata({ searchParams }: SearchProps): Promise<Metadata> { const { q } = await searchParams; const term = normalizeSearchQuery(Array.isArray(q) ? q[0] ?? "" : q ?? ""); return { title: term ? `Search · ${term.slice(0,70)}` : "Search", robots: { index: false, follow: true } }; }
export default async function SearchPage({ searchParams }: SearchProps) {
  const { q } = await searchParams; const query = normalizeSearchQuery(Array.isArray(q) ? q[0] ?? "" : q ?? ""); const result = await searchProducts(query);
  return <><header className={styles.heading}><h1>{query ? "Search results" : "Search the collection"}</h1><div className={styles.searchField}><SearchForm initialValue={query} /></div>{query && <p>Results for “{query}”</p>}</header>{result.source === "unavailable" ? <div className={styles.notice} role="status"><p>Search is temporarily unavailable.</p><Link href="/search" className="text-link">Try search again</Link><br /><Link href="/shop" className="button button--outline">Browse all products</Link></div> : query && result.data.length ? <ProductGrid products={result.data} emptyMessage="No matching products" allowCategoryFilter={false} purchasingEnabled={isShopifyCheckoutEnabled()} /> : <section className={styles.empty} aria-label={query ? "No search results" : "Explore the collection"}><h2>{query ? `No products found for “${query}”` : "A place to start"}</h2><p>{query ? "Try a different name, or browse a collection below." : "Explore our tea and tea bags, or browse the full collection."}</p><nav className={styles.discovery} aria-label="Explore collections"><Link href="/collections/tea">Tea</Link><Link href="/collections/tea-bags">Tea bags</Link><Link href="/shop">Shop all</Link></nav></section>}</>;
}
