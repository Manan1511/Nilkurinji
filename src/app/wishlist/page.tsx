import type { Metadata } from "next";
import { WishlistProducts } from "@/components/wishlist-products";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The items you have saved on this device.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <>
      <header className="page-header">
        <p className="eyebrow">Kept close</p>
        <h1 className="page-title">Your wishlist</h1>
        <p className="page-header__description">Your saved items stay in this browser and are not linked to an account.</p>
      </header>
      <section className="section section--wide section--tight"><WishlistProducts purchasingEnabled={isShopifyCheckoutEnabled()} /></section>
    </>
  );
}
