import type { Metadata } from "next";
import { ProductGrid } from "@/components/product-grid";
import { getProducts } from "@/lib/shopify/catalog";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";

export const metadata: Metadata = {
  title: "Shop all",
  description: "Browse tea, rice, snacks and other pantry categories from Nilkurinji.",
  alternates: { canonical: "/shop" },
};
export const revalidate = 60;

export default async function ShopPage() {
  const result = await getProducts();
  return (
    <>
      <header className="page-header page-header--left">
        <p className="eyebrow">The Nilkurinji pantry</p>
        <h1 className="page-title">Shop all</h1>
        <p className="page-header__description">Browse every category in one place. Product prices and availability come from Shopify.</p>
      </header>
      {result.source === "unavailable" ? (
        <div className="notice-card" role="status">{result.reason}</div>
      ) : (
        <ProductGrid
          products={result.data}
          emptyMessage={result.source === "preview" ? "Preview shelves are being set." : "The shop is being stocked."}
          purchasingEnabled={isShopifyCheckoutEnabled()}
        />
      )}
    </>
  );
}
