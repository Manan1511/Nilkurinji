"use client";

import { useState } from "react";
import { Check, ShoppingCart } from "lucide-react";
import type { StorefrontProduct } from "@/lib/shopify/types";
import { getQuickAddVariant } from "@/lib/shopify/cart-ui";

export function QuickAddButton({ product, purchasingEnabled, compact = false }: { product: StorefrontProduct; purchasingEnabled: boolean; compact?: boolean }) {
  const variant = getQuickAddVariant(product, purchasingEnabled);
  const [pending, setPending] = useState(false);
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  if (!variant) {
    if (!product.isPreview) return null;
    return (
      <div className={`quick-add ${compact ? "quick-add--compact" : ""}`}>
        <button className={`product-card__quick-add product-card__quick-add--preview ${compact ? "product-card__quick-add--compact" : ""}`} type="button" disabled aria-label="Purchases are disabled in the preview store" title="Purchases are disabled in the preview store">
          <ShoppingCart aria-hidden="true" size={14} />
          {!compact && "Add to cart"}
        </button>
      </div>
    );
  }

  const addToCart = async () => {
    setPending(true);
    setAdded(false);
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
      setAdded(true);
      window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The item could not be added.");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="quick-add">
      {!compact && <p className="quick-add__option">Option: {variant.title}</p>}
      <button
        className={`product-card__quick-add ${compact ? "product-card__quick-add--compact" : ""} ${added ? "is-added" : ""}`}
        type="button"
        onClick={addToCart}
        disabled={pending}
        aria-busy={pending}
        aria-label={compact ? (added ? `${product.title} added to cart` : `Add ${product.title} to cart`) : undefined}
      >
        {compact ? (added ? <Check aria-hidden="true" size={17} /> : <ShoppingCart aria-hidden="true" size={17} />) : (pending ? "Adding…" : added ? "Added to cart" : "Quick add")}
        {compact && <span className="sr-only">{pending ? "Adding to cart" : added ? "Added to cart" : "Add to cart"}</span>}
      </button>
      <span className="sr-only" role="status" aria-live="polite">{message}</span>
    </div>
  );
}
