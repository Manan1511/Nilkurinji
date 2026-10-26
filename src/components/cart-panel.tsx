"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { CartAction } from "@/lib/shopify/cart-validation";
import { useStorefrontCart } from "@/components/cart-provider";
import styles from "./cart-panel.module.css";

export function CartPanel({ presentation = "page" }: { presentation?: "page" | "drawer" }) {
  const controller = useStorefrontCart();
  if (!controller) return <p className={styles.status} role="status">Your cart is loading.</p>;
  const { cart, preview, expired, enabled, loading, busy, message, refresh, mutate } = controller;
  const drawerClass = presentation === "drawer" ? styles.drawer : "";
  async function change(action: CartAction) {
    try {
      const result = await mutate(action);
      if (action.action === "checkout") {
        if (result?.checkoutUrl) window.location.assign(result.checkoutUrl);
        else if (!result?.providerSession) throw new Error("Checkout is temporarily unavailable. Please try again.");
      }
    } catch { /* The shared cart controller keeps the confirmed cart and error message. */ }
  }
  function reload() { void refresh(); }
  if (loading) return <p className={styles.status} role="status">Loading your cart…</p>;
  if (!cart?.lines.nodes.length) return <section className={`${styles.empty} ${drawerClass}`}><h2>{message ? "Your cart is temporarily unavailable." : preview ? "Purchases are disabled in this preview." : expired ? "Your cart has expired." : "Your cart is empty."}</h2><p>{message ? "Refresh your cart to try again. Your saved cart has not been replaced." : preview ? "Browse the sample catalog while the store is being prepared." : expired ? "Return to the shop to add your items again." : "Explore the collection to find your next cup."}</p>{message && <button type="button" className="button button--outline" onClick={reload}>Refresh cart</button>}<Link className="button button--dark" href="/shop">Browse the shop <ArrowRight size={16} aria-hidden="true" /></Link></section>;
  const unavailable = cart.lines.nodes.some((line) => !line.merchandise.availableForSale);
  return <div className={`${styles.layout} ${drawerClass}`}>
    <div className={styles.lines}>{cart.lines.nodes.map((line) => {
      const product = line.merchandise.product; const image = line.merchandise.image ?? product.featuredImage;
      return <article className={styles.line} key={line.id}><Link className={styles.image} href={`/products/${product.handle}`} aria-label={`View ${product.title}`}>{image && <Image src={image.url} alt={image.altText || product.title} fill sizes="96px" />}</Link><div className={styles.lineBody}><div className={styles.titleRow}><div><h2><Link href={`/products/${product.handle}`}>{product.title}</Link></h2>{line.merchandise.title !== "Default Title" && <p>{line.merchandise.title}</p>}</div><strong>{formatMoney(line.cost.totalAmount)}</strong></div>{!line.merchandise.availableForSale && <p className={styles.error}>This option is no longer available.</p>}<div className={styles.controls}><div className={styles.quantity}><button type="button" aria-label={`Decrease quantity of ${product.title}`} disabled={busy || !enabled || line.quantity <= 1} onClick={() => void change({ action: "update", lineId: line.id, quantity: line.quantity - 1 })}><Minus size={15} aria-hidden="true" /></button><output aria-label={`Quantity of ${product.title}`}>{line.quantity}</output><button type="button" aria-label={`Increase quantity of ${product.title}`} disabled={busy || !enabled || line.quantity >= 10} onClick={() => void change({ action: "update", lineId: line.id, quantity: line.quantity + 1 })}><Plus size={15} aria-hidden="true" /></button></div><button className={styles.remove} type="button" aria-label={`Remove ${product.title} from cart`} disabled={busy || !enabled} onClick={() => void change({ action: "remove", lineId: line.id })}><Trash2 size={15} aria-hidden="true" />Remove</button></div></div></article>;
    })}</div>
    <aside className={styles.summary}><h2>Order summary</h2><div><span>Subtotal</span><strong>{formatMoney(cart.cost.subtotalAmount)}</strong></div><div className={styles.total}><span>Current total</span><strong>{formatMoney(cart.cost.totalAmount)}</strong></div>{!enabled && <p>Checkout is currently closed.</p>}{unavailable && <p className={styles.error}>Update or remove unavailable items before checkout.</p>}<button type="button" className="button button--dark" disabled={!enabled || preview || unavailable || busy} onClick={() => void change({ action: "checkout" })}>{busy ? "Preparing checkout…" : "Continue to checkout"}<ArrowRight size={16} aria-hidden="true" /></button><p className={styles.fine}>Final pricing, delivery and payment options are confirmed at checkout.</p>{message && <div role="alert"><p className={styles.error}>{message}</p><button className={styles.remove} disabled={busy} onClick={reload} type="button">Refresh cart</button></div>}{presentation === "drawer" && <Link className={styles.fullCart} href="/cart">View full cart</Link>}</aside>
    <span className="sr-only" role="status">{busy ? "Updating your cart." : ""}</span>
  </div>;
}
