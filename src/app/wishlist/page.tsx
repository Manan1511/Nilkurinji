import type { Metadata } from "next";
import { WishlistProducts } from "@/components/wishlist-products";
import { isShopifyCheckoutEnabled } from "@/lib/shopify/checkout-config";
import styles from "@/app/reading.module.css";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "The items you have saved on this device.",
  robots: { index: false, follow: false },
};

export default function WishlistPage() {
  return (
    <>
      <header className={styles.heading}>
        <h1>Your wishlist</h1>
        <p>Your saved items stay in this browser and are not linked to an account.</p>
      </header>
      <section className={styles.section}><WishlistProducts purchasingEnabled={isShopifyCheckoutEnabled()} /></section>
    </>
  );
}
