import type { Metadata } from "next";
import Link from "next/link";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "@/app/reading.module.css";
export const metadata: Metadata = { title: "Shop all", description: "Browse tea, rice, snacks and other pantry categories from Nilkurinji.", alternates: { canonical: "/shop" } };
export const revalidate = 60;
export default async function ShopPage() {
  const result = await getProducts();
  return <><header className={styles.heading}><h1>Shop all</h1><p>Tea, tea bags and a little more for your pantry.</p></header>{result.source === "unavailable" ? <div className={styles.notice} role="status"><p>Product listings are temporarily unavailable.</p><Link href="/" className="button button--outline">Back to Nilkurinji home</Link></div> : <ProductGrid products={result.data} emptyMessage="The collection is being prepared." purchasingEnabled={isShopifyCheckoutEnabled()} />}</>;
}
