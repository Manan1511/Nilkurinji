"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Minus, Plus, Trash2 } from "lucide-react";
import { formatMoney } from "@/lib/format";
import type { ShopifyCart } from "@/lib/shopify/cart";
import styles from "./cart-panel.module.css";
type CartApiResponse = { cart?: ShopifyCart | null; preview?: boolean; purchasingEnabled?: boolean; expired?: boolean; error?: string; checkoutUrl?: string };
export function CartPanel() {
  const [cart, setCart] = useState<ShopifyCart | null>(null);
  const [preview, setPreview] = useState(false);
  const [expired, setExpired] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const lock = useRef(false);
  const readPending = useRef(false);
  const readGeneration = useRef(0);
  const readCart = useCallback(async (signal?: AbortSignal) => {
    if (lock.current) return;
    const generation = ++readGeneration.current;
    readPending.current = true;
    try {
      const response = await fetch("/api/cart", { cache: "no-store", signal }); const body = await response.json() as CartApiResponse;
      if (signal?.aborted || generation !== readGeneration.current) return;
      if (!response.ok) throw new Error("Your cart is temporarily unavailable. Please try again.");
      setCart(body.cart ?? null); setPreview(body.preview ?? false); setExpired(body.expired ?? false); setEnabled(body.purchasingEnabled ?? false); setMessage("");
    } catch { if (!signal?.aborted && generation === readGeneration.current) setMessage("Your cart is temporarily unavailable. Please try again."); }
    finally { if (generation === readGeneration.current) { readPending.current = false; if (!signal?.aborted) setLoading(false); } }
  }, []);
  function reload() { if (lock.current || readPending.current) return; setLoading(true); setMessage(""); void readCart(); }
  useEffect(() => {
    const controller = new AbortController();
    void Promise.resolve().then(() => { if (!controller.signal.aborted) return readCart(controller.signal); });
    return () => controller.abort();
  }, [readCart]);
  async function mutate(action: "update" | "remove" | "checkout", lineId?: string, quantity?: number) {
    if (lock.current || readPending.current || preview || !cart || !enabled) return;
    if (action === "checkout" && (!cart.lines.nodes.length || cart.lines.nodes.some((line) => !line.merchandise.availableForSale))) return;
    lock.current = true; setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/cart", { method: "POST", headers: { "Content-Type": "application/json" }, cache: "no-store", body: JSON.stringify({ action, ...(lineId ? { lineId } : {}), ...(quantity ? { quantity } : {}) }) });
      const result = await response.json() as CartApiResponse;
      if (!response.ok) throw new Error(result.error || "The cart could not be updated. Refresh your cart and try again.");
      if (action === "checkout") { if (!result.checkoutUrl) throw new Error("Checkout is temporarily unavailable. Please try again."); window.location.assign(result.checkoutUrl); return; }
      setCart(result.cart ?? null); window.dispatchEvent(new Event("nilkurinji:cart-updated"));
    } catch (error) { setMessage(error instanceof Error ? error.message : "The cart could not be updated. Please try again."); }
    finally { lock.current = false; setBusy(false); }
  }
  if (loading) return <p className={styles.status} role="status">Loading your cart…</p>;
  if (!cart?.lines.nodes.length) return <section className={styles.empty}><h2>{message ? "Your cart is temporarily unavailable." : preview ? "Purchases are disabled in this preview." : expired ? "Your cart has expired." : "Your cart is empty."}</h2><p>{message ? "Refresh your cart to try again. Your saved cart has not been replaced." : preview ? "Browse the sample catalog while the store is being prepared." : expired ? "Return to the shop to add your items again." : "Explore the collection to find your next cup."}</p>{message && <button type="button" className="button button--outline" onClick={reload}>Refresh cart</button>}<Link className="button button--dark" href="/shop">Browse the shop <ArrowRight size={16} aria-hidden="true" /></Link></section>;
  const unavailable = cart.lines.nodes.some((line) => !line.merchandise.availableForSale);
  return <div className={styles.layout}><div className={styles.lines}>{cart.lines.nodes.map((line) => {
    const product = line.merchandise.product; const image = line.merchandise.image ?? product.featuredImage;
    return <article className={styles.line} key={line.id}><Link className={styles.image} href={`/products/${product.handle}`} aria-label={`View ${product.title}`}>{image && <Image src={image.url} alt={image.altText || product.title} fill sizes="96px" />}</Link><div className={styles.lineBody}><div className={styles.titleRow}><div><h2><Link href={`/products/${product.handle}`}>{product.title}</Link></h2>{line.merchandise.title !== "Default Title" && <p>{line.merchandise.title}</p>}</div><strong>{formatMoney(line.cost.totalAmount)}</strong></div>{!line.merchandise.availableForSale && <p className={styles.error}>This option is no longer available.</p>}<div className={styles.controls}><div className={styles.quantity}><button type="button" aria-label={`Decrease quantity of ${product.title}`} disabled={busy || !enabled || line.quantity <= 1} onClick={() => void mutate("update", line.id, line.quantity - 1)}><Minus size={15} aria-hidden="true" /></button><output aria-label={`Quantity of ${product.title}`}>{line.quantity}</output><button type="button" aria-label={`Increase quantity of ${product.title}`} disabled={busy || !enabled || line.quantity >= 10} onClick={() => void mutate("update", line.id, line.quantity + 1)}><Plus size={15} aria-hidden="true" /></button></div><button className={styles.remove} type="button" aria-label={`Remove ${product.title} from cart`} disabled={busy || !enabled} onClick={() => void mutate("remove", line.id)}><Trash2 size={15} aria-hidden="true" />Remove</button></div></div></article>;
  })}</div><aside className={styles.summary}><h2>Order summary</h2><div><span>Subtotal</span><strong>{formatMoney(cart.cost.subtotalAmount)}</strong></div><p className={styles.fine}>Shipping and taxes are calculated at checkout.</p><div className={styles.total}><span>Current total</span><strong>{formatMoney(cart.cost.totalAmount)}</strong></div>{!enabled && <p>Checkout is currently closed.</p>}{unavailable && <p className={styles.error}>Update or remove unavailable items before checkout.</p>}<button type="button" className="button button--dark" disabled={!enabled || preview || unavailable || busy} onClick={() => void mutate("checkout")}>{busy ? "Updating cart…" : "Continue to checkout"}<ArrowRight size={16} aria-hidden="true" /></button><p className={styles.fine}>Final pricing and payment options are confirmed by Shopify.</p>{message && <div role="alert"><p className={styles.error}>{message}</p><button type="button" className={styles.remove} disabled={busy} onClick={reload}>Refresh cart</button></div>}<span className="sr-only" role="status">{busy ? "Updating your cart." : ""}</span></aside></div>;
}
