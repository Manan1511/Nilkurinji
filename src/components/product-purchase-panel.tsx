"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";

function variantOptions(variants: StorefrontVariant[]): { name: string; values: string[] }[] {
  const values = new Map<string, Set<string>>();
  for (const variant of variants) {
    for (const option of variant.selectedOptions) {
      const group = values.get(option.name) ?? new Set<string>();
      group.add(option.value);
      values.set(option.name, group);
    }
  }
  return [...values.entries()].map(([name, options]) => ({ name, values: [...options] }));
}

export function ProductPurchasePanel({
  product,
  purchasingEnabled,
}: {
  product: StorefrontProduct;
  purchasingEnabled: boolean;
}) {
  const options = useMemo(() => variantOptions(product.variants), [product.variants]);
  const firstVariant = product.variants.find((variant) => variant.availableForSale) ?? product.variants[0];
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() =>
    Object.fromEntries(firstVariant?.selectedOptions.map((option) => [option.name, option.value]) ?? []),
  );
  const [quantity, setQuantity] = useState(1);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const selectedVariant = product.variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  ) ?? (options.length === 0 ? firstVariant : undefined);
  const purchasable = purchasingEnabled && !product.isPreview && Boolean(selectedVariant?.availableForSale);

  async function sendCartAction(action: "add" | "buy-now"): Promise<void> {
    if (!selectedVariant || !purchasable || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action, variantId: selectedVariant.id, quantity }),
      });
      const result = await response.json() as { error?: string; checkoutUrl?: string; cart?: { totalQuantity?: number } };
      if (!response.ok) throw new Error(result.error || "The cart could not be updated.");
      if (action === "buy-now") {
        if (!result.checkoutUrl) throw new Error("Shopify did not return a checkout address.");
        window.location.assign(result.checkoutUrl);
        return;
      }
      setMessage("Added to your cart.");
      window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart could not be updated.");
    } finally {
      setBusy(false);
    }
  }

  const price = selectedVariant?.price ?? product.priceRange?.minVariantPrice;

  return (
    <div className="purchase-panel">
      {price && <p className="purchase-panel__price">{formatMoney(price)}</p>}
      {product.variants.length > 0 && options.map((option) => (
        <label className="form-field" key={option.name}>
          <span>{option.name}</span>
          <select
            value={selectedOptions[option.name] ?? option.values[0]}
            onChange={(event) => setSelectedOptions((current) => ({ ...current, [option.name]: event.target.value }))}
          >
            {option.values.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>
      ))}

      {product.variants.length > 0 && (
        <div className="quantity-control" aria-label="Quantity">
          <span>Quantity</span>
          <div>
            <button type="button" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} disabled={quantity <= 1 || busy}>
              <Minus aria-hidden="true" size={15} />
            </button>
            <output aria-live="polite">{quantity}</output>
            <button type="button" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(10, value + 1))} disabled={quantity >= 10 || busy}>
              <Plus aria-hidden="true" size={15} />
            </button>
          </div>
        </div>
      )}

      {product.isPreview ? (
        <p className="purchase-panel__notice" role="status">This is a visual preview. No product is available to purchase.</p>
      ) : !purchasingEnabled ? (
        <p className="purchase-panel__notice" role="status">Purchasing will open after Shopify inventory and checkout are approved.</p>
      ) : selectedVariant && !selectedVariant.availableForSale ? (
        <p className="purchase-panel__notice" role="status">This option is currently unavailable.</p>
      ) : null}

      <div className="purchase-panel__buttons">
        <button type="button" className="button button--dark" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("add")}>
          <ShoppingBag aria-hidden="true" size={17} /> {busy ? "Updating…" : "Add to cart"}
        </button>
        <button type="button" className="button button--outline" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("buy-now")}>
          Buy now
        </button>
      </div>
      <p className="purchase-panel__fine">Prices, options and availability are confirmed by Shopify.</p>
      <p className="purchase-panel__message" role="status" aria-live="polite">{message}</p>
    </div>
  );
}
