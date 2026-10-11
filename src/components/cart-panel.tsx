"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { ShopifyCart } from "@/lib/shopify/cart";

type CartApiResponse = {
  cart?: ShopifyCart | null;
  preview?: boolean;
  purchasingEnabled?: boolean;
  expired?: boolean;
  error?: string;
};

export function CartPanel() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [preview, setPreview] = useState(false);
  const [purchasingEnabled, setPurchasingEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busyLine, setBusyLine] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    void fetch("/api/cart", { cache: "no-store" })
      .then(async (response) => ({ response, body: await response.json() as CartApiResponse }))
      .then(({ response, body }) => {
        if (!active) return;
        setCart(body.cart ?? null);
        setPreview(body.preview ?? false);
        setPurchasingEnabled(body.purchasingEnabled ?? false);
        if (!response.ok && body.error) setMessage(body.error);
      })
      .catch(() => { if (active) setMessage("Your cart is temporarily unavailable."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  async function mutate(action: "update" | "remove", lineId: string, quantity?: number): Promise<void> {
    setBusyLine(lineId);
    setMessage("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action, lineId, ...(quantity ? { quantity } : {}) }),
      });
      const result = await response.json() as CartApiResponse;
      if (!response.ok) throw new Error(result.error || "The cart could not be updated.");
      setCart(result.cart ?? null);
      window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "The cart could not be updated.");
    } finally {
      setBusyLine("");
    }
  }

  async function checkout(): Promise<void> {
    setBusyLine("checkout");
    setMessage("");
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action: "checkout" }),
      });
      const result = await response.json() as { error?: string; checkoutUrl?: string };
      if (!response.ok) throw new Error(result.error || "Shopify checkout is not available yet.");
      if (!result.checkoutUrl) throw new Error("Shopify did not return a checkout address.");
      window.location.assign(result.checkoutUrl);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Shopify checkout is not available yet.");
    } finally {
      setBusyLine("");
    }
  }

  if (loading) return <div className="cart-loading" role="status">Loading your cart…</div>;

  if (!cart?.lines.nodes.length) {
    return (
      <div className="empty-state empty-state--cart">
        <span className="eyebrow">{preview ? "Preview only" : "Your basket"}</span>
        <h2>{preview ? "The shop is being prepared." : "Your basket is taking a breath."}</h2>
        <p>{preview ? "This preview has no purchasable products or prices yet." : "Once you add something from the shop, you will find it here."}</p>
        <Link className="button button--dark" href="/shop">Browse the shop <ArrowRight aria-hidden="true" size={16} /></Link>
        {message && <p className="cart-message" role="alert">{message}</p>}
      </div>
    );
  }

  const unavailableLines = cart.lines.nodes.some((line) => !line.merchandise.availableForSale);

  return (
    <div className="cart-layout">
      <div className="cart-lines">
        {cart.lines.nodes.map((line) => {
          const image = line.merchandise.image ?? line.merchandise.product.featuredImage;
          const busy = busyLine === line.id;
          return (
            <article className="cart-line" key={line.id}>
              <Link className="cart-line__image" href={`/products/${line.merchandise.product.handle}`} aria-label={`View ${line.merchandise.product.title}`}>
                {image && <Image src={image.url} alt={image.altText || line.merchandise.product.title} fill sizes="112px" />}
              </Link>
              <div className="cart-line__main">
                <div className="cart-line__title-row">
                  <div>
                    <p className="eyebrow">{line.merchandise.title !== "Default Title" ? line.merchandise.title : "Nilkurinji pantry"}</p>
                    <h2><Link href={`/products/${line.merchandise.product.handle}`}>{line.merchandise.product.title}</Link></h2>
                  </div>
                  <strong>{formatMoney(line.cost.totalAmount)}</strong>
                </div>
                {!line.merchandise.availableForSale && <p className="cart-line__stock">This option is no longer available.</p>}
                <div className="cart-line__controls">
                  <div className="quantity-control quantity-control--small">
                    <button type="button" aria-label="Decrease quantity" disabled={busy || line.quantity <= 1} onClick={() => void mutate("update", line.id, line.quantity - 1)}><Minus aria-hidden="true" size={14} /></button>
                    <output aria-label={`Quantity ${line.quantity}`}>{busy ? "…" : line.quantity}</output>
                    <button type="button" aria-label="Increase quantity" disabled={busy || line.quantity >= 10} onClick={() => void mutate("update", line.id, line.quantity + 1)}><Plus aria-hidden="true" size={14} /></button>
                  </div>
                  <button className="cart-line__remove" type="button" disabled={busy} onClick={() => void mutate("remove", line.id)}>
                    <Trash2 aria-hidden="true" size={15} /> Remove
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <aside className="cart-summary">
        <span className="eyebrow">A small recap</span>
        <h2>Order summary</h2>
        <div><span>Subtotal</span><strong>{formatMoney(cart.cost.subtotalAmount)}</strong></div>
        <div><span>Shipping &amp; taxes</span><span>Calculated in Shopify checkout</span></div>
        <div className="cart-summary__total"><span>Current total</span><strong>{formatMoney(cart.cost.totalAmount)}</strong></div>
        {!purchasingEnabled && <p className="purchase-panel__notice">Checkout is temporarily closed while Shopify setup is completed.</p>}
        {unavailableLines && <p className="purchase-panel__notice">Update or remove unavailable items before checkout.</p>}
        <button type="button" className="button button--dark" disabled={!purchasingEnabled || unavailableLines || busyLine === "checkout"} onClick={() => void checkout()}>
          {busyLine === "checkout" ? "Connecting…" : "Continue to Shopify checkout"} <ArrowRight aria-hidden="true" size={16} />
        </button>
        <p className="purchase-panel__fine">Final pricing and payment options are confirmed by Shopify.</p>
        {message && <p className="cart-message" role="alert">{message}</p>}
      </aside>
    </div>
  );
}
