"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";
import styles from "./product-purchase-panel.module.css";
import { postCartAction } from "@/lib/cart-client";
import { useStorefrontCart } from "@/components/cart-provider";
import { DeliveryChecker } from "@/components/delivery-checker";

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

export function findSelectedVariant(
  variants: StorefrontVariant[],
  selectedOptions: Record<string, string>,
): StorefrontVariant | undefined {
  return variants.find((variant) =>
    variant.selectedOptions.every((option) => selectedOptions[option.name] === option.value),
  );
}

export function getPurchaseNotice(
  product: StorefrontProduct,
  purchasingEnabled: boolean,
  selectedVariant: StorefrontVariant | undefined,
): string | null {
  if (product.variants.length > 0 && !selectedVariant) {
    return "This option combination is not available. Choose another combination.";
  }
  if (selectedVariant && !selectedVariant.availableForSale) return "This option is currently unavailable.";
  if (product.isPreview) return "This is a visual preview. No product is available to purchase.";
  if (!purchasingEnabled) return "Purchasing will open after Shopify inventory and checkout are approved.";
  return null;
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
  const mutationLock = useRef(false);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const [showStickyPurchase, setShowStickyPurchase] = useState(false);
  const cart = useStorefrontCart();

  useEffect(() => {
    const target = buttonsRef.current;
    if (!target || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setShowStickyPurchase(!entry.isIntersecting);
    }, { threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const selectedVariant = findSelectedVariant(product.variants, selectedOptions)
    ?? (options.length === 0 ? firstVariant : undefined);
  const purchasable = purchasingEnabled && !product.isPreview && Boolean(selectedVariant?.availableForSale);
  const purchaseNotice = getPurchaseNotice(product, purchasingEnabled, selectedVariant);

  async function sendCartAction(action: "add" | "buy-now"): Promise<void> {
    if (!selectedVariant || !purchasable || mutationLock.current) return;
    mutationLock.current = true;
    setBusy(true);
    setMessage("");
    try {
      if (action === "buy-now" && !cart) throw new Error("Checkout is temporarily unavailable. Please refresh and try again.");
      const cartAction = { action, variantId: selectedVariant.id, quantity } as const;
      const result = cart ? await cart.mutate(cartAction) : await postCartAction(cartAction);
      if (cart && !result) throw new Error("Your cart is being updated. Please try again.");
      if (action === "buy-now") {
        const checkoutUrl = result?.checkoutUrl;
        if (checkoutUrl) window.location.assign(checkoutUrl);
        else if (result && "providerSession" in result && result.providerSession) setMessage("Complete your order in the secure checkout window.");
        else throw new Error("Checkout could not be prepared. Please try again.");
        return;
      }
      setMessage("Added to your cart.");
      if (cart) window.dispatchEvent(new Event("nilkurinji:cart-open"));
      else window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart could not be updated.");
    } finally {
      mutationLock.current = false;
      setBusy(false);
    }
  }

  const price = product.variants.length ? selectedVariant?.price : product.priceRange?.minVariantPrice;
  const selectedPack = selectedVariant?.selectedOptions.map((option) => option.value).join(" · ");

  return (
    <>
    <div className={styles.panel}>
      {price && <p className="purchase-panel__price">{product.isPreview ? "Sample price: " : ""}{formatMoney(price)}</p>}
      {!product.isPreview && price && <p className="purchase-panel__tax">Inclusive of all applicable taxes.</p>}
      {product.variants.length > 0 && options.map((option) => (
        <label className="form-field" key={option.name}>
          <span>{option.name}</span>
          <select
            value={selectedOptions[option.name] ?? option.values[0]}
            disabled={busy}
            onChange={(event) => { setSelectedOptions((current) => ({ ...current, [option.name]: event.target.value })); setMessage(""); }}
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

      {purchaseNotice && <p className="purchase-panel__notice" role="status">{purchaseNotice}</p>}

      <div className="purchase-panel__buttons" ref={buttonsRef}>
        <button type="button" className="button button--dark" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("add")}>
          <ShoppingBag aria-hidden="true" size={17} /> {busy ? "Updating…" : "Add to cart"}
        </button>
        <button type="button" className="button button--outline" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("buy-now")}>
          Buy now
        </button>
      </div>
      <p className="purchase-panel__fine">{product.isPreview ? "Sample prices are shown for layout review only." : "Prices, options and availability are confirmed by Shopify."}</p>
      <DeliveryChecker preview={product.isPreview} />
      <p className="purchase-panel__message" role="status" aria-live="polite">{message}</p>
    </div>
    {showStickyPurchase && <aside className={styles.stickyPurchase} aria-label="Quick purchase options">
      <div className={styles.stickyInfo}>
        <span>{selectedPack || "Selected option"}</span>
        <strong>{price ? <>{product.isPreview ? "Sample price: " : ""}{formatMoney(price)}</> : "Price unavailable"}</strong>
      </div>
      <div className={styles.stickyButtons}>
        <button type="button" className="button button--dark" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("add")}>
          {busy ? "Updating…" : "Add to cart"}
        </button>
        <button type="button" className="button button--outline" disabled={!purchasable || busy || !selectedVariant} onClick={() => void sendCartAction("buy-now")}>
          Buy now
        </button>
      </div>
      {message && <p className={styles.stickyMessage}>{message}</p>}
    </aside>}
    </>
  );
}
