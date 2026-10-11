"use client";

import { useState } from "react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";

export function QuickAddButton({ product, purchasingEnabled }: { product: StorefrontProduct; purchasingEnabled: boolean }) {
  const variant = getQuickAddVariant(product, purchasingEnabled);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  if (!variant) return null;

  const addToCart = async () => {
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "add", variantId: variant.id, quantity: 1 }),
      });
      const result = await response.json() as { error?: string };
      if (!response.ok) throw new Error(result.error || "The item could not be added.");
      setMessage("Added to your cart.");
      window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The item could not be added.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="quick-add">
      <p className="quick-add__option">Option: {variant.title}</p>
      <button className="product-card__quick-add" type="button" onClick={addToCart} disabled={pending}>
        {pending ? "Adding…" : "Quick add"}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{message}</span>
    </div>
  );
}
