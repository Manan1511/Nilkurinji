"use client";
import { useRef, useState } from "react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";
import styles from "./quick-add-button.module.css";
export function QuickAddButton({ product, purchasingEnabled }: { product: StorefrontProduct; purchasingEnabled: boolean; compact?: boolean }) {
  const variant = getQuickAddVariant(product, purchasingEnabled);
  const lock = useRef(false);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [added, setAdded] = useState(false);
  if (!variant) return null;
  async function add() {
    if (!variant || lock.current) return;
    lock.current = true; setPending(true); setMessage(""); setAdded(false);
    try {
      const response = await fetch("/api/cart", { method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", variantId: variant.id, quantity: 1 }) });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The item could not be added. Please try again.");
      setAdded(true); setMessage("Added to your cart."); window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) { setMessage(error instanceof Error ? error.message : "The item could not be added. Please try again."); }
    finally { lock.current = false; setPending(false); }
  }
  return <div><button className={styles.button} type="button" disabled={pending} aria-label={`Add ${product.title} to cart`} aria-busy={pending} onClick={() => void add()}>{pending ? "Adding…" : added ? "Added" : "Add to cart"}</button>{message && <p className={styles.message} role="status">{message}</p>}</div>;
}
