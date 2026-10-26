"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import styles from "./checkout-status.module.css";

type StatusResult = { status?: "confirmed" | "not-paid" | "pending" | "no-attempt"; message?: string; orderStatusUrl?: string; fallbackUrl?: string };

export function CheckoutStatus() {
  const [result, setResult] = useState<StatusResult | null>(null);
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");

  const fetchStatus = useCallback(async (): Promise<StatusResult> => {
    const response = await fetch("/api/checkout/status", { cache: "no-store", credentials: "same-origin" });
    const body = await response.json() as StatusResult;
    if (!response.ok) throw new Error(body.message || "We could not check the payment right now. Please try again in a moment.");
    return body;
  }, []);

  const acceptStatus = useCallback((body: StatusResult) => {
    setResult(body);
    if (body.status === "confirmed" && body.orderStatusUrl) window.location.replace(body.orderStatusUrl);
  }, []);

  const check = useCallback(async () => {
    setBusy(true);
    setError("");
    try { acceptStatus(await fetchStatus()); }
    catch { setError("We could not check the payment right now. Please try again in a moment."); }
    finally { setBusy(false); }
  }, [acceptStatus, fetchStatus]);

  useEffect(() => {
    let active = true;
    void fetchStatus().then((body) => { if (active) acceptStatus(body); }).catch(() => {
      if (active) setError("We could not check the payment right now. Please try again in a moment.");
    }).finally(() => { if (active) setBusy(false); });
    return () => { active = false; };
  }, [acceptStatus, fetchStatus]);

  const pending = result?.status === "pending" || result === null;
  return <section className={styles.page} aria-labelledby="checkout-status-title">
    <p className={styles.eyebrow}>NILKURINJI · CHECKOUT</p>
    <h1 id="checkout-status-title">{pending ? "Checking your payment" : result?.status === "not-paid" ? "Payment not completed" : result?.status === "confirmed" ? "Order confirmed" : "No payment to check"}</h1>
    <p className={styles.copy} role="status" aria-live="polite">{error || result?.message || (pending ? "Please wait while we verify the payment and Shopify order." : result?.status === "confirmed" ? "Your order is confirmed. Opening the order details now." : "Return to your cart or shop when you are ready.")}</p>
    {pending && <button className="button button--dark" type="button" disabled={busy} onClick={() => void check()}>{busy ? "Checking…" : "Check payment status"}</button>}
    {result?.status === "not-paid" && result.fallbackUrl && <a className="button button--dark" href={result.fallbackUrl}>Continue with secure Shopify checkout</a>}
    {result?.status === "not-paid" && <Link className="button button--outline" href="/cart">Return to cart</Link>}
    {result?.status === "no-attempt" && <Link className="button button--dark" href="/shop">Continue to shop</Link>}
    {error && <button className="button button--outline" type="button" disabled={busy} onClick={() => void check()}>Try again</button>}
  </section>;
}
