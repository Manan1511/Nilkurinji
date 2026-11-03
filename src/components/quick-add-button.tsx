"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";
import { postCartAction } from "@/lib/cart-client";
import { useStorefrontCart } from "@/components/cart-provider";
import styles from "./quick-add-button.module.css";
export function QuickAddButton({ product, purchasingEnabled, compact = false }: { product: StorefrontProduct; purchasingEnabled: boolean; compact?: boolean }) {
  const variant = getQuickAddVariant(product, purchasingEnabled);
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const cart = useStorefrontCart();
  if (!variant) return null;
  async function add() {
    if (!variant) return;
    setPendingCount((count) => count + 1); setMessage(""); setAdded(false);
    try {
      if (cart) {
        const result = await cart.mutate({ action: "add", variantId: variant.id, quantity: 1 });
        if (!result) throw new Error("Your cart is being updated. Please try again.");
      } else {
        await postCartAction({ action: "add", variantId: variant.id, quantity: 1 });
        window.dispatchEvent(new Event("nilkurinji:cart-updated"));
      }
      setAdded(true); setMessage("Added to your cart.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "The item could not be added. Please try again."); }
    finally { setPendingCount((count) => Math.max(0, count - 1)); }
  }
  const pending = pendingCount > 0;
  return <div><button className={`${styles.button} ${compact ? styles.compact : ""}`} type="button" aria-label={`${pending ? "Adding" : "Add"} ${product.title} to cart`} aria-busy={pending} onClick={() => void add()}>{compact ? <><ShoppingCart aria-hidden="true" /><span className="sr-only">{pending ? "Adding" : added ? "Added" : "Add to cart"}</span></> : pending ? "Adding…" : added ? "Added" : "Add to cart"}</button>{message && <p className={styles.message} role="status">{message}</p>}</div>;
}
