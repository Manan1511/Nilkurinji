import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import { CATEGORIES } from "@/lib/site-config";
import styles from "@/app/reading.module.css";
export const metadata: Metadata = { title: "Shop tea", description: "Browse Nilkurinji loose tea and tea bags, and find a cup to suit your day.", alternates: { canonical: "/shop" } };
export const revalidate = 60;
type ShopProps = { searchParams: Promise<{ category?: string | string[] }> };
export default async function ShopPage({ searchParams }: ShopProps) {
  const { category } = await searchParams;
  const requestedCategory = Array.isArray(category) ? category[0] : category;
  const initialCategory = CATEGORIES.some((item) => item.handle === requestedCategory) ? requestedCategory! : "all";
  const result = await getProducts();
  return <><header className={styles.heading}><h1>Find your tea.</h1><p>Loose tea to linger over. Tea bags to keep things simple.</p></header>{result.source === "unavailable" ? <div className={styles.notice} role="status"><p>Tea listings are temporarily unavailable.</p><Link href="/" className="button button--outline">Back to Nilkurinji home</Link></div> : <ProductGrid products={result.data} emptyMessage="The tea collection is being prepared." initialCategory={initialCategory} purchasingEnabled={isShopifyCheckoutEnabled()} />}</>;
}
