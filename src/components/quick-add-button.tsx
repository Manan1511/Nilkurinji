"use client";
import { useRef, useState } from "react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";
import { postCartAction } from "@/lib/cart-client";
import { useStorefrontCart } from "@/components/cart-provider";
import styles from "./quick-add-button.module.css";
export function QuickAddButton({ product, purchasingEnabled }: { product: StorefrontProduct; purchasingEnabled: boolean; compact?: boolean }) {
  const variant = getQuickAddVariant(product, purchasingEnabled);
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  const cart = useStorefrontCart();
  if (!variant) return null;
  async function add() {
    if (!variant || lock.current) return;
    lock.current = true; setPending(true); setMessage(""); setAdded(false);
    try {
      if (cart) {
        const result = await cart.mutate({ action: "add", variantId: variant.id, quantity: 1 });
        if (!result) throw new Error("Your cart is being updated. Please try again.");
      } else {
        await postCartAction({ action: "add", variantId: variant.id, quantity: 1 });
        window.dispatchEvent(new Event("nilkurinji:cart-updated"));
      }
      setAdded(true); setMessage("Added to your cart."); window.dispatchEvent(new Event("nilkurinji:cart-open"));
    } catch (error) { setMessage(error instanceof Error ? error.message : "The item could not be added. Please try again."); }
    finally { lock.current = false; setPending(false); }
  }
  return <div><button className={styles.button} type="button" disabled={pending} aria-label={`Add ${product.title} to cart`} aria-busy={pending} onClick={() => void add()}>{pending ? "Adding…" : added ? "Added" : "Add to cart"}</button>{message && <p className={styles.message} role="status">{message}</p>}</div>;
}
