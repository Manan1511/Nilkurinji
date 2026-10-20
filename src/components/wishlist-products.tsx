"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { readWishlistState, WishlistButton } from "@/components/wishlist-button";
import type { StorefrontProduct } from "@/lib/shopify/types";
import styles from "./wishlist-products.module.css";
export function WishlistProducts({ purchasingEnabled }: { purchasingEnabled: boolean }) {
  const [products, setProducts] = useState<StorefrontProduct[]>([]);
  const [handles, setHandles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true; let generation = 0; let controller: AbortController | undefined;
    const refresh = async () => {
      const current = ++generation; controller?.abort(); controller = new AbortController(); const signal = controller.signal;
      const saved = readWishlistState();
      if (saved.error) { setError(saved.error); setLoading(false); return; }
      setHandles(saved.handles); setError("");
      if (!saved.handles.length) { setProducts([]); setLoading(false); return; }
      setLoading(true);
      try {
        const response = await fetch(`/api/wishlist?handles=${encodeURIComponent(saved.handles.join(","))}`, { cache: "no-store", signal }); const result = await response.json() as { products?: StorefrontProduct[] };
        if (!active || current !== generation) return;
        if (!response.ok || !Array.isArray(result.products)) throw new Error("Your wishlist is temporarily unavailable. Please try again.");
        setProducts(result.products.filter((product) => saved.handles.includes(product.handle)));
      } catch { if (active && current === generation && !signal.aborted) setError("Your wishlist is temporarily unavailable. Please try again."); }
      finally { if (active && current === generation) setLoading(false); }
    };
    void refresh(); const sync = () => void refresh(); window.addEventListener("nilkurinji:wishlist-updated", sync); window.addEventListener("storage", sync);
    return () => { active = false; controller?.abort(); window.removeEventListener("nilkurinji:wishlist-updated", sync); window.removeEventListener("storage", sync); };
  }, [attempt]);
  if (loading) return <p role="status">Opening your saved list…</p>;
  if (error) return <div className={styles.empty} role="alert"><p>{error}</p><button type="button" className="button button--outline" onClick={() => setAttempt((value) => value + 1)}>Try again</button><Link href="/shop" className="text-link">Browse the shop</Link></div>;
  if (!handles.length) return <div className={styles.empty}><h2>Your wishlist is empty.</h2><p>Save a product with the heart to keep it here. Your saved list stays on this device.</p><Link className="button button--dark" href="/shop">Explore the collection</Link></div>;
  const missing = handles.filter((handle) => !products.some((product) => product.handle === handle));
  return <>{products.length === 0 && <div className={styles.empty}><h2>Your saved products are unavailable.</h2><p>They may have been removed from the catalog. You can remove them below or explore the current collection.</p><Link href="/shop" className="text-link">Explore the collection</Link></div>}<div className={styles.grid}>{products.map((product) => <ProductCard key={product.id} product={product} purchasingEnabled={purchasingEnabled} />)}</div>{missing.length > 0 && <section className={styles.missing} aria-label="Unavailable saved products">{missing.map((handle) => <article key={handle}><div><h2>Saved product unavailable</h2><p>This product is no longer in the current catalog.</p></div><WishlistButton handle={handle} title="unavailable saved product" removeOnly /></article>)}</section>}</>;
}
