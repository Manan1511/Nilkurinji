"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { readWishlist } from "@/components/wishlist-button";

export function WishlistProducts({ purchasingEnabled }: { purchasingEnabled: boolean }) {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      const handles = readWishlist();
      if (!handles.length) {
        if (active) { setProducts([]); setLoading(false); }
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/wishlist?handles=${encodeURIComponent(handles.join(","))}`, { cache: "no-store" });
        const result = await response.json() as { products?: StorefrontProduct[]; error?: string };
        if (!response.ok) throw new Error(result.error || "Your wishlist is temporarily unavailable.");
        if (active) { setProducts(result.products ?? []); setError(""); }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Your wishlist is temporarily unavailable.");
      } finally {
        if (active) setLoading(false);
      }
    };
    const sync = () => void refresh();
    void refresh();
    window.addEventListener("nilkurinji:wishlist-updated", sync);
    window.addEventListener("storage", sync);
    return () => {
      active = false;
      window.removeEventListener("nilkurinji:wishlist-updated", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  if (loading) return <div className="cart-loading" role="status">Opening your saved list…</div>;
  if (error) return <div className="notice-card" role="alert">{error}</div>;
  if (!products.length) {
    return (
      <div className="empty-state">
        <span className="eyebrow">Kept close</span>
        <h2>Your saved list is waiting.</h2>
        <p>Tap the heart on a product to keep it here. Saved items stay on this device.</p>
      </div>
    );
  }
  return <div className="product-grid">{products.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={purchasingEnabled} />)}</div>;
}
