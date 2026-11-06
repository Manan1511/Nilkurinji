"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingBag } from "lucide-react";
import { formatMoney } from "@/lib/format";
import { postCartAction, postCheckoutSession } from "@/lib/cart-client";
import { useStorefrontCart, type CartMutationAction } from "@/components/cart-provider";
import type { CartAction } from "@/lib/shopify/cart-validation";
import type { ShopifyCart } from "@/lib/shopify/cart";
import type { StorefrontProduct, StorefrontVariant } from "@/lib/shopify/types";
import styles from "./product-card-actions.module.css";

function variantLabel(variant: StorefrontVariant): string {
  const packOption = variant.selectedOptions.find((option) => /pack|size|weight|quantity/i.test(option.name));
  if (packOption?.value) return packOption.value;
  const options = variant.selectedOptions.map((option) => option.value).filter(Boolean);
  if (options.length) return options.join(" · ");
  return variant.title === "Default Title" ? "Standard size" : variant.title;
}

export function ProductCardActions({
  product,
  cartEnabled,
  checkoutEnabled,
  onVariantChange,
  hideVariantSelector = false,
  hideBuyNow = false,
}: {
  product: StorefrontProduct;
  cartEnabled: boolean;
  checkoutEnabled: boolean;
  onVariantChange?: (variantId: string) => void;
  hideVariantSelector?: boolean;
  hideBuyNow?: boolean;
}) {
  const variants = product.variants;
  const initialVariant = variants.find((variant) => variant.availableForSale) ?? variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState(initialVariant?.id ?? "");
  const [pending, setPending] = useState<"buy-now" | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [message, setMessage] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [fallbackCart, setFallbackCart] = useState<ShopifyCart | null>(null);
  const [fallbackPendingByVariant, setFallbackPendingByVariant] = useState<Record<string, number>>({});
  const fallbackCartRef = useRef<ShopifyCart | null>(null);
  const fallbackQueue = useRef<Promise<void>>(Promise.resolve());
  const buyNowLock = useRef(false);
  const controller = useStorefrontCart();
  const activeCart = controller ? controller.cart : fallbackCart;
  const selectedVariant = useMemo(
    () => variants.find((variant) => variant.id === selectedVariantId),
    [selectedVariantId, variants],
  );
  const matchingLines = activeCart?.lines.nodes.filter((line) => line.merchandise.id === selectedVariantId) ?? [];
  const confirmedQuantity = matchingLines.reduce((total, line) => total + line.quantity, 0);
  const pendingVariantDelta = controller
    ? controller.pendingVariantQuantityDelta[selectedVariantId] ?? 0
    : fallbackPendingByVariant[selectedVariantId] ?? 0;
  const quantity = Math.max(0, confirmedQuantity + pendingVariantDelta);
  const canAdd = cartEnabled && !product.isPreview && !product.comingSoon && Boolean(selectedVariant?.availableForSale);
  const canBuy = checkoutEnabled && !product.isPreview && !product.comingSoon && Boolean(selectedVariant?.availableForSale);
  const optionName = variants.flatMap((variant) => variant.selectedOptions.map((option) => option.name))
    .find((name) => name.toLowerCase() === "pack size")
    ?? variants[0]?.selectedOptions[0]?.name
    ?? "Option";

  function changeFallbackDelta(variantId: string, delta: number) {
    setFallbackPendingByVariant((current) => {
      const next = (current[variantId] ?? 0) + delta;
      const updated = { ...current };
      if (next === 0) delete updated[variantId];
      else updated[variantId] = next;
      return updated;
    });
  }

  function enqueueFallback(action: CartMutationAction): Promise<void> {
    const request = fallbackQueue.current.then(async () => {
      let cartAction: CartAction;
      if (action.action === "decrement-variant") {
        const lines = fallbackCartRef.current?.lines.nodes.filter((line) => line.merchandise.id === action.variantId) ?? [];
        const line = lines.find((item) => item.quantity > 1) ?? lines[0];
        if (!line) return;
        cartAction = line.quantity > 1
          ? { action: "update", lineId: line.id, quantity: line.quantity - 1 }
          : { action: "remove", lineId: line.id };
      } else cartAction = action;

      const result = await postCartAction(cartAction);
      fallbackCartRef.current = result.cart ?? null;
      setFallbackCart(fallbackCartRef.current);
      window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    });
    fallbackQueue.current = request.then(() => undefined, () => undefined);
    return request;
  }

  async function updateCart(action: CartMutationAction, variantId: string, delta: number) {
    if (pending === "buy-now") return;
    setPendingCount((count) => count + 1);
    if (!controller && delta) changeFallbackDelta(variantId, delta);
    setMessage("");
    setAnnouncement(delta > 0 ? `Adding ${product.title} to your cart.` : `Updating ${product.title} quantity.`);
    try {
      if (controller) {
        await controller.mutate(action);
      } else {
        await enqueueFallback(action);
      }
      setMessage("");
      setAnnouncement(delta > 0 ? `${product.title} added to your cart.` : `${product.title} quantity updated.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart could not be updated. Please try again.");
      setAnnouncement("");
    } finally {
      if (!controller && delta) changeFallbackDelta(variantId, -delta);
      setPendingCount((count) => Math.max(0, count - 1));
    }
  }

  function addOne() {
    if (!selectedVariant || !canAdd || quantity >= 10) return;
    void updateCart(
      { action: "add", variantId: selectedVariant.id, quantity: 1 },
      selectedVariant.id,
      1,
    );
  }

  function removeOne() {
    if (!selectedVariant || quantity <= 0) return;
    void updateCart(
      { action: "decrement-variant", variantId: selectedVariant.id },
      selectedVariant.id,
      -1,
    );
  }

  async function buyNow() {
    if (!selectedVariant || buyNowLock.current || !canBuy) return;
    buyNowLock.current = true;
    setPending("buy-now");
    setMessage("");
    setAnnouncement("");
    try {
      const cartAction = { action: "buy-now", variantId: selectedVariant.id, quantity: 1 } as const;
      const result = controller
        ? await controller.mutate(cartAction)
        : await postCheckoutSession(cartAction);
      if (result?.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
      } else if (result && "providerSession" in result && result.providerSession) {
        setMessage("Complete your order in the secure checkout window.");
      } else {
        throw new Error("Checkout could not be prepared. Please try again.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Checkout could not be prepared. Please try again.");
    } finally {
      buyNowLock.current = false;
      setPending(null);
    }
  }

  const checkoutPending = pending === "buy-now";

  return <div className={styles.actions}>
    {!hideVariantSelector && <div className={styles.optionSlot}>
      <div className={styles.variantOptions} role="group" aria-label={`${optionName} for ${product.title}`}>
        {variants.length > 1 ? variants.map((variant) => {
          const selected = variant.id === selectedVariantId;
          return <button
            key={variant.id}
            type="button"
            className={styles.variantChip}
            aria-pressed={selected}
            aria-label={`${variantLabel(variant)}, ${formatMoney(variant.price)}${variant.availableForSale ? "" : ", sold out"}`}
            disabled={checkoutPending}
            onClick={() => { setSelectedVariantId(variant.id); onVariantChange?.(variant.id); setMessage(""); setAnnouncement(""); }}
          >
            <span>{variantLabel(variant)}</span>
            <span className={styles.variantPrice}>{formatMoney(variant.price)}</span>
            {!variant.availableForSale && <span className={styles.soldOut}>Sold out</span>}
          </button>;
        }) : selectedVariant ? <span className={`${styles.variantChip} ${styles.singleOption}`}>
          <span>{variantLabel(selectedVariant)}</span>
        </span> : <span className={`${styles.variantChip} ${styles.singleOption}`}>Option unavailable</span>}
      </div>
    </div>}
    <div className={`${styles.buttons}${hideBuyNow ? ` ${styles.singleButton}` : ""}`}>
      {quantity > 0 ? <div className={styles.quantityControl} role="group" aria-label={`Quantity of ${product.title}`} aria-busy={pendingCount > 0}>
        <button type="button" className={styles.quantityButton} aria-label={`Decrease ${product.title} quantity`} disabled={checkoutPending || quantity <= 0} onClick={removeOne}>
          <Minus aria-hidden="true" size={15} />
        </button>
        <output className={styles.quantityOutput} aria-live="polite" aria-label={`${quantity} in cart`}>{quantity}</output>
        <button type="button" className={styles.quantityButton} aria-label={`Increase ${product.title} quantity`} disabled={!canAdd || checkoutPending || quantity >= 10} onClick={addOne}>
          <Plus aria-hidden="true" size={15} />
        </button>
      </div> : <button type="button" className={styles.addButton} disabled={!canAdd || checkoutPending} aria-busy={pendingCount > 0} onClick={addOne}>
        <ShoppingBag aria-hidden="true" size={15} />
        <span>Add to cart</span>
      </button>}
      {!hideBuyNow && <button type="button" className={styles.buyButton} disabled={!canBuy || checkoutPending} title={!checkoutEnabled ? "Checkout is currently closed." : undefined} aria-label={!checkoutEnabled ? "Buy now, checkout currently closed" : undefined} aria-busy={checkoutPending} onClick={() => void buyNow()}>
        <span>{checkoutPending ? "Preparing…" : "Buy now"}</span>
        <ArrowRight aria-hidden="true" size={15} />
      </button>}
    </div>
    {message && <p className={styles.status} role="status" aria-live="polite">{message}</p>}
    <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
  </div>;
}
