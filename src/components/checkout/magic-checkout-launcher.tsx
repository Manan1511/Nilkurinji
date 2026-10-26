"use client";

import { useEffect, useRef, useState } from "react";
import type { EmbeddedCheckoutSession } from "@/lib/cart-client";

type RazorpayResponse = { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };
type RazorpayOptions = {
  key: string;
  name: string;
  order_id: string;
  show_coupons?: boolean;
  theme?: { color: string };
  handler: (response: RazorpayResponse) => void | Promise<void>;
  modal?: { ondismiss?: () => void };
};
type RazorpayInstance = { open: () => void; close?: () => void };
type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;
declare global { interface Window { Razorpay?: RazorpayConstructor; } }

let magicLoadPromise: Promise<void> | null = null;
function loadMagicCheckout(): Promise<void> {
  if (window.Razorpay) return Promise.resolve();
  if (magicLoadPromise) return magicLoadPromise;
  magicLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/magic-checkout.js";
    script.async = true;
    script.dataset.nilkurinjiRazorpay = "true";
    script.onload = () => window.Razorpay ? resolve() : reject(new Error("The payment window could not be loaded."));
    script.onerror = () => { script.remove(); reject(new Error("The payment window could not be loaded.")); };
    document.head.append(script);
  });
  void magicLoadPromise.catch(() => { magicLoadPromise = null; });
  return magicLoadPromise;
}

export function MagicCheckoutLauncher({ session, onClose }: { session: EmbeddedCheckoutSession | null; onClose: () => void }) {
  const opened = useRef(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session || opened.current) return;
    let active = true;
    opened.current = true;
    setError("");
    const finish = async (payment: RazorpayResponse) => {
      if (!payment.razorpay_payment_id || !payment.razorpay_order_id || !payment.razorpay_signature) {
        window.location.assign("/checkout/status");
        return;
      }
      try {
        const response = await fetch("/api/checkout/complete", {
          method: "POST", credentials: "same-origin", cache: "no-store",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payment),
        });
        const result = await response.json() as { status?: string; orderStatusUrl?: string };
        if (response.ok && result.status === "confirmed" && result.orderStatusUrl) window.location.assign(result.orderStatusUrl);
        else window.location.assign("/checkout/status");
      } catch {
        window.location.assign("/checkout/status");
      }
    };
    const dismiss = () => {
      onClose();
      window.location.assign("/checkout/status");
    };
    void loadMagicCheckout().then(() => {
      if (!active || !window.Razorpay) return;
      const checkout = new window.Razorpay({
        key: session.keyId,
        name: session.name,
        order_id: session.orderId,
        theme: { color: session.accentColor },
        handler: finish,
        modal: { ondismiss: dismiss },
      });
      checkout.open();
    }).catch((reason: unknown) => {
      if (active) setError(reason instanceof Error ? reason.message : "The payment window could not be loaded.");
    });
    return () => { active = false; opened.current = false; };
  }, [session, onClose]);

  if (!session || !error) return null;
  return <div className="checkout-load-error" role="alert" aria-labelledby="checkout-load-title">
    <div>
      <h2 id="checkout-load-title">Checkout could not open</h2>
      <p>{error} Your cart is still saved. Check payment status before trying again.</p>
      <a className="button button--dark" href="/checkout/status">Check payment status</a>
      <button type="button" className="button button--outline" onClick={() => { onClose(); window.location.assign("/cart"); }}>Return to cart</button>
    </div>
  </div>;
}
